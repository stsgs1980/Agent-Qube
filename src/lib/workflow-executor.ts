/**
 * Workflow Executor
 * Resolves agents for steps and executes the pipeline loop.
 */

import { db } from '@/lib/db'
import { simulateStepExecution } from '@/lib/workflow-simulator'

interface StepWithAgent {
  step: any
  resolvedAgentId: string | null
}

/**
 * Resolve which agent runs each step.
 * If a step has an explicit agentId, use that.
 * Otherwise, pick the first active agent in the step's roleGroup.
 */
export function resolveAgents(
  steps: any[],
  agents: any[]
): StepWithAgent[] {
  return steps.map(step => {
    let resolvedAgentId = step.agentId
    if (!resolvedAgentId && step.roleGroup) {
      const groupAgent = agents.find(a =>
        a.roleGroup === step.roleGroup && a.status === 'active'
      )
      resolvedAgentId = groupAgent?.id || null
    }
    return { step, resolvedAgentId }
  })
}

/**
 * Execute resolved steps sequentially, recording state transitions
 * and agent messages. Returns the updated taskContext and final output.
 */
export async function executeSteps(
  resolvedSteps: StepWithAgent[],
  stepExecutions: any[],
  agentMap: Map<string, any>,
  input: any
): Promise<{
  taskContext: any
  previousOutput: any
  finalStatus: string
  finalError: string | null
}> {
  const taskContext: any = { ...(input || {}), _history: [] }
  let previousOutput: any = input || {}
  let finalStatus = 'completed'
  let finalError: string | null = null

  for (let i = 0; i < resolvedSteps.length; i++) {
    const { step, resolvedAgentId } = resolvedSteps[i]
    const stepExec = stepExecutions[i]
    const agent = resolvedAgentId ? agentMap.get(resolvedAgentId) : null

    // Skip if no agent available
    if (!resolvedAgentId) {
      await db.stepExecution.update({
        where: { id: stepExec.id },
        data: { status: 'skipped', error: 'No available agent' },
      })
      continue
    }

    // Mark step as running
    await db.stepExecution.update({
      where: { id: stepExec.id },
      data: {
        status: 'running',
        startedAt: new Date(),
        inputData: JSON.stringify(previousOutput),
      },
    })

    // Record request message
    await db.agentMessage.create({
      data: {
        stepExecutionId: stepExec.id,
        fromAgentId: i === 0 ? 'system' : (resolvedSteps[i - 1].resolvedAgentId || 'system'),
        toAgentId: resolvedAgentId,
        type: 'request',
        content: JSON.stringify({
          task: step.name,
          action: step.action,
          input: previousOutput,
        }),
        metadata: JSON.stringify({ stepOrder: step.order, pipelinePosition: `${i + 1}/${resolvedSteps.length}` }),
      },
    })

    // ─── Simulate step execution based on action type ────────────────────
    const stepOutput = simulateStepExecution(step, previousOutput, agent, taskContext)

    // Check for feedback loop (review action that rejects)
    const isFeedbackLoop = step.action === 'review' &&
      stepOutput._reviewResult === 'reject' &&
      step.fallbackStepId

    if (isFeedbackLoop) {
      // Record feedback message
      await db.agentMessage.create({
        data: {
          stepExecutionId: stepExec.id,
          fromAgentId: resolvedAgentId,
          toAgentId: resolvedSteps[i - 1]?.resolvedAgentId || 'system',
          type: 'feedback',
          content: JSON.stringify({
            reviewResult: 'reject',
            reason: stepOutput._reviewReason || 'Quality threshold not met',
            feedback: stepOutput._feedback || 'Please revise and resubmit',
          }),
          metadata: JSON.stringify({ feedbackLoop: true, targetStep: step.fallbackStepId }),
        },
      })

      // Mark step as waiting feedback
      await db.stepExecution.update({
        where: { id: stepExec.id },
        data: {
          status: 'waiting_feedback',
          completedAt: new Date(),
          outputData: JSON.stringify(stepOutput),
        },
      })
    } else {
      // Normal completion
      await db.stepExecution.update({
        where: { id: stepExec.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          outputData: JSON.stringify(stepOutput),
        },
      })

      // Record response message
      await db.agentMessage.create({
        data: {
          stepExecutionId: stepExec.id,
          fromAgentId: resolvedAgentId,
          toAgentId: i < resolvedSteps.length - 1 ? (resolvedSteps[i + 1]?.resolvedAgentId || 'system') : 'system',
          type: 'response',
          content: JSON.stringify(stepOutput),
          metadata: JSON.stringify({ stepOrder: step.order }),
        },
      })
    }

    // Update task context
    taskContext._history.push({
      step: step.name,
      agent: agent?.name || 'unknown',
      action: step.action,
      timestamp: new Date().toISOString(),
      status: isFeedbackLoop ? 'feedback_requested' : 'completed',
    })
    previousOutput = stepOutput
  }

  return { taskContext, previousOutput, finalStatus, finalError }
}
