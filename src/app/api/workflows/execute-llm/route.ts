import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buildAgentSystemPrompt, callLLM, parseLLMOutput } from './helpers'

// ─── POST /api/workflows/execute-llm ──────────────────────────
//
// Real LLM-powered workflow execution using @stsgs/prompting + z-ai-web-dev-sdk.
// Unlike /api/workflows/execute (simulation), this route:
//   1. Builds a system prompt per step's agent via buildSystemPrompt() + applyFormula()
//   2. Calls the LLM for each step with resilience (retry, timeout, circuit breaker)
//   3. Parses structured JSON from LLM responses
//   4. Supports feedback loops (review rejection → fallback step)
//
// Body: { workflowId: string, input?: object }

export async function POST(req: NextRequest) {
  try {
    const { workflowId, input } = await req.json()
    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 })
    }

    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      include: { steps: { orderBy: { order: 'asc' } } },
    })
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    if (workflow.steps.length === 0) {
      return NextResponse.json({ error: 'Workflow has no steps' }, { status: 400 })
    }

    const agents = await db.agent.findMany()
    const agentMap = new Map(agents.map(a => [a.id, a]))

    // Resolve agent for each step
    const resolved = workflow.steps.map(step => {
      let agentId = step.agentId
      if (!agentId && step.roleGroup) {
        const match = agents.find(a => a.roleGroup === step.roleGroup && a.status === 'active')
        agentId = match?.id || null
      }
      return { step, agentId }
    })

    // Create execution record
    const execution = await db.workflowExecution.create({
      data: {
        workflowId, status: 'running',
        input: JSON.stringify(input || {}),
        taskContext: JSON.stringify({ ...(input || {}), _history: [] }),
      },
    })

    const stepExecs = await Promise.all(
      resolved.map(({ step, agentId }) =>
        db.stepExecution.create({
          data: { executionId: execution.id, stepId: step.id, agentId, status: 'pending', inputData: '{}', outputData: '{}' },
        })
      )
    )

    const taskContext: Record<string, unknown> = { ...(input || {}), _history: [] as object[] }
    let previousOutput: Record<string, unknown> = input || {}
    let finalStatus = 'completed'
    let finalError: string | null = null
    let stepIndex = 0

    while (stepIndex < resolved.length) {
      const { step, agentId } = resolved[stepIndex]
      const stepExec = stepExecs[stepIndex]
      const agent = agentId ? agentMap.get(agentId) : null

      if (!agentId || !agent) {
        await db.stepExecution.update({ where: { id: stepExec.id }, data: { status: 'skipped', error: 'No available agent' } })
        stepIndex++
        continue
      }

      // Mark running
      await db.stepExecution.update({
        where: { id: stepExec.id },
        data: { status: 'running', startedAt: new Date(), inputData: JSON.stringify(previousOutput) },
      })

      // Record request message
      await db.agentMessage.create({
        data: {
          stepExecutionId: stepExec.id,
          fromAgentId: stepIndex === 0 ? 'system' : (resolved[stepIndex - 1].agentId || 'system'),
          toAgentId: agentId, type: 'request',
          content: JSON.stringify({ task: step.name, action: step.action, input: previousOutput }),
          metadata: JSON.stringify({ stepOrder: step.order, position: `${stepIndex + 1}/${resolved.length}` }),
        },
      })

      // Build prompts and call LLM
      const systemPrompt = buildAgentSystemPrompt(agent)
      const userPrompt = [
        `ACTION: ${step.action}`,
        `STEP: ${step.name}`,
        `INPUT: ${JSON.stringify(previousOutput)}`,
        `CONTEXT HISTORY: ${JSON.stringify(taskContext._history)}`,
        step.action === 'review'
          ? 'Review the input. Respond with JSON: { "result": "approved" | "reject", "reason": "...", "feedback": "..." }'
          : 'Process the input and respond with JSON containing your output.',
      ].join('\n')

      let stepOutput: Record<string, unknown>
      try {
        const raw = await callLLM(systemPrompt, userPrompt)
        stepOutput = parseLLMOutput(raw, previousOutput)
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        await db.stepExecution.update({
          where: { id: stepExec.id },
          data: { status: 'failed', error: errMsg, completedAt: new Date(), outputData: '{}' },
        })
        taskContext._history.push({ step: step.name, agent: agent.name, action: step.action, status: 'failed', error: errMsg })
        finalStatus = 'failed'
        finalError = `Step "${step.name}" failed: ${errMsg}`
        break
      }

      // Handle feedback loops (review rejection with fallback)
      const isFeedback = step.action === 'review' &&
        stepOutput.result === 'reject' && step.fallbackStepId

      if (isFeedback) {
        await db.agentMessage.create({
          data: {
            stepExecutionId: stepExec.id, fromAgentId: agentId,
            toAgentId: resolved[stepIndex - 1]?.agentId || 'system', type: 'feedback',
            content: JSON.stringify({ reviewResult: 'reject', reason: stepOutput.reason, feedback: stepOutput.feedback }),
            metadata: JSON.stringify({ feedbackLoop: true, targetStep: step.fallbackStepId }),
          },
        })
        await db.stepExecution.update({
          where: { id: stepExec.id },
          data: { status: 'waiting_feedback', completedAt: new Date(), outputData: JSON.stringify(stepOutput) },
        })
        const fallbackIdx = resolved.findIndex(r => r.step.id === step.fallbackStepId)
        stepIndex = fallbackIdx >= 0 ? fallbackIdx : stepIndex + 1
      } else {
        await db.stepExecution.update({
          where: { id: stepExec.id },
          data: { status: 'completed', completedAt: new Date(), outputData: JSON.stringify(stepOutput) },
        })
        await db.agentMessage.create({
          data: {
            stepExecutionId: stepExec.id, fromAgentId: agentId,
            toAgentId: stepIndex < resolved.length - 1 ? (resolved[stepIndex + 1]?.agentId || 'system') : 'system',
            type: 'response', content: JSON.stringify(stepOutput),
            metadata: JSON.stringify({ stepOrder: step.order }),
          },
        })
        stepIndex++
      }

      taskContext._history.push({
        step: step.name, agent: agent.name, action: step.action,
        timestamp: new Date().toISOString(), status: isFeedback ? 'feedback_requested' : 'completed',
      })
      previousOutput = stepOutput
    }

    await db.workflowExecution.update({
      where: { id: execution.id },
      data: { status: finalStatus, taskContext: JSON.stringify(taskContext), output: JSON.stringify(previousOutput), error: finalError, completedAt: new Date() },
    })

    const fullExecution = await db.workflowExecution.findUnique({
      where: { id: execution.id },
      include: { steps: { include: { messages: true }, orderBy: { id: 'asc' } } },
    })

    return NextResponse.json({ execution: fullExecution }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[/api/workflows/execute-llm POST]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
