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

export function resolveAgents(steps: any[], agents: any[]): StepWithAgent[] {
  return steps.map(step => {
    let resolvedAgentId = step.agentId
    if (!resolvedAgentId && step.roleGroup) {
      const groupAgent = agents.find(a => a.roleGroup === step.roleGroup && a.status === 'active')
      resolvedAgentId = groupAgent?.id || null
    }
    return { step, resolvedAgentId }
  })
}

// ─── Step execution DB helpers ─────────────────────────────

async function markSkipped(stepExec: any) {
  await db.stepExecution.update({ where: { id: stepExec.id }, data: { status: 'skipped', error: 'No available agent' } })
}

interface StepRunContext {
  stepExec: any
  step: any
  previousOutput: any
  fromAgentId: string
  resolvedAgentId: string
  stepOrder: number
  total: number
}

async function markRunningAndCreateRequest(ctx: StepRunContext) {
  await db.stepExecution.update({
    where: { id: ctx.stepExec.id },
    data: { status: 'running', startedAt: new Date(), inputData: JSON.stringify(ctx.previousOutput) },
  })
  await db.agentMessage.create({
    data: {
      stepExecutionId: ctx.stepExec.id, fromAgentId: ctx.fromAgentId, toAgentId: ctx.resolvedAgentId, type: 'request',
      content: JSON.stringify({ task: ctx.step.name, action: ctx.step.action, input: ctx.previousOutput }),
      metadata: JSON.stringify({ stepOrder: ctx.step.order, pipelinePosition: `${ctx.stepOrder + 1}/${ctx.total}` }),
    },
  })
}

async function handleFeedback(stepExec: any, stepOutput: any, step: any, resolvedAgentId: string, prevAgentId: string | null) {
  await db.agentMessage.create({
    data: {
      stepExecutionId: stepExec.id, fromAgentId: resolvedAgentId, toAgentId: prevAgentId || 'system', type: 'feedback',
      content: JSON.stringify({
        reviewResult: 'reject', reason: stepOutput._reviewReason || 'Quality threshold not met',
        feedback: stepOutput._feedback || 'Please revise and resubmit',
      }),
      metadata: JSON.stringify({ feedbackLoop: true, targetStep: step.fallbackStepId }),
    },
  })
  await db.stepExecution.update({
    where: { id: stepExec.id },
    data: { status: 'waiting_feedback', completedAt: new Date(), outputData: JSON.stringify(stepOutput) },
  })
}

async function handleCompletion(stepExec: any, stepOutput: any, resolvedAgentId: string, nextAgentId: string, step: any) {
  await db.stepExecution.update({
    where: { id: stepExec.id },
    data: { status: 'completed', completedAt: new Date(), outputData: JSON.stringify(stepOutput) },
  })
  await db.agentMessage.create({
    data: {
      stepExecutionId: stepExec.id, fromAgentId: resolvedAgentId, toAgentId: nextAgentId,
      type: 'response', content: JSON.stringify(stepOutput),
      metadata: JSON.stringify({ stepOrder: step.order }),
    },
  })
}

function isFeedbackLoop(step: any, stepOutput: any): boolean {
  return step.action === 'review' && stepOutput._reviewResult === 'reject' && !!step.fallbackStepId
}

interface RecordStepResultOpts {
  stepExec: any
  stepOutput: any
  step: any
  resolvedAgentId: string
  fromAgentId: string
  resolvedSteps: StepWithAgent[]
  index: number
}

async function recordStepResult(opts: RecordStepResultOpts) {
  if (isFeedbackLoop(opts.step, opts.stepOutput)) {
    await handleFeedback(opts.stepExec, opts.stepOutput, opts.step, opts.resolvedAgentId, opts.fromAgentId)
  } else {
    const nextAgentId = opts.index < opts.resolvedSteps.length - 1 ? (opts.resolvedSteps[opts.index + 1]?.resolvedAgentId || 'system') : 'system'
    await handleCompletion(opts.stepExec, opts.stepOutput, opts.resolvedAgentId, nextAgentId, opts.step)
  }
}

// ─── Main execution loop ──────────────────────────────────

export async function executeSteps(
  resolvedSteps: StepWithAgent[], stepExecutions: any[], agentMap: Map<string, any>, input: any,
): Promise<{ taskContext: any; previousOutput: any; finalStatus: string; finalError: string | null }> {
  const taskContext: any = { ...(input || {}), _history: [] }
  let previousOutput: any = input || {}

  for (let i = 0; i < resolvedSteps.length; i++) {
    const { step, resolvedAgentId } = resolvedSteps[i]
    const stepExec = stepExecutions[i]
    const agent = resolvedAgentId ? agentMap.get(resolvedAgentId) : null

    if (!resolvedAgentId) {
      await markSkipped(stepExec)
      continue
    }

    const fromAgentId = i === 0 ? 'system' : (resolvedSteps[i - 1].resolvedAgentId || 'system')
    await markRunningAndCreateRequest({ stepExec, step, previousOutput, fromAgentId, resolvedAgentId, stepOrder: i, total: resolvedSteps.length })

    const stepOutput = simulateStepExecution(step, previousOutput, agent, taskContext)
    await recordStepResult({ stepExec, stepOutput, step, resolvedAgentId, fromAgentId, resolvedSteps, index: i })

    taskContext._history.push({
      step: step.name, agent: agent?.name || 'unknown', action: step.action,
      timestamp: new Date().toISOString(), status: isFeedbackLoop(step, stepOutput) ? 'feedback_requested' : 'completed',
    })
    previousOutput = stepOutput
  }

  return { taskContext, previousOutput, finalStatus: 'completed', finalError: null }
}