import { db } from '@/lib/db'
import type { ResolvedStep, AgentRecord } from './workflow-execution'

// ─── Shared pipeline DB helpers ────────────────────────────

interface StepStartParams {
  stepExec: any
  step: ResolvedStep['step']
  previousOutput: any
  fromAgentId: string
  index: number
  total: number
  toAgentId: string
}

async function recordStepStart(params: StepStartParams) {
  await db.stepExecution.update({
    where: { id: params.stepExec.id },
    data: { status: 'running', startedAt: new Date(), inputData: JSON.stringify(params.previousOutput) },
  })
  await db.agentMessage.create({
    data: {
      stepExecutionId: params.stepExec.id, fromAgentId: params.fromAgentId, toAgentId: params.toAgentId, type: 'request',
      content: JSON.stringify({ task: params.step.name, action: params.step.action, input: params.previousOutput }),
      metadata: JSON.stringify({ stepOrder: params.step.order, pipelinePosition: `${params.index + 1}/${params.total}` }),
    },
  })
}

async function recordFeedback(stepExec: any, stepOutput: any, step: ResolvedStep['step'], fromAgentId: string, prevAgentId: string | null) {
  await db.agentMessage.create({
    data: {
      stepExecutionId: stepExec.id, fromAgentId, toAgentId: prevAgentId || 'system', type: 'feedback',
      content: JSON.stringify({ reviewResult: 'reject', reason: stepOutput._reviewReason || 'Quality threshold not met', feedback: stepOutput._feedback || 'Please revise and resubmit' }),
      metadata: JSON.stringify({ feedbackLoop: true, targetStep: step.fallbackStepId }),
    },
  })
  await db.stepExecution.update({
    where: { id: stepExec.id },
    data: { status: 'waiting_feedback', completedAt: new Date(), outputData: JSON.stringify(stepOutput) },
  })
}

async function recordCompletion(stepExec: any, stepOutput: any, fromAgentId: string, toAgentId: string, step: ResolvedStep['step']) {
  await db.stepExecution.update({
    where: { id: stepExec.id },
    data: { status: 'completed', completedAt: new Date(), outputData: JSON.stringify(stepOutput) },
  })
  await db.agentMessage.create({
    data: { stepExecutionId: stepExec.id, fromAgentId, toAgentId, type: 'response', content: JSON.stringify(stepOutput), metadata: JSON.stringify({ stepOrder: step.order }) },
  })
}

function isFeedbackReject(step: ResolvedStep['step'], output: any): boolean {
  return step.action === 'review' && output.result === 'reject' && !!step.fallbackStepId
}

function isSimFeedbackReject(step: ResolvedStep['step'], output: any): boolean {
  return step.action === 'review' && output._reviewResult === 'reject' && !!step.fallbackStepId
}

// ─── Step result recording ──────────────────────────────

async function recordSimStepResult(params: { stepExec: any; stepOutput: any; step: ResolvedStep['step']; fromAgentId: string; resolved: ResolvedStep[]; index: number }) {
  const { stepExec, stepOutput, step, fromAgentId, resolved, index } = params
  if (isSimFeedbackReject(step, stepOutput)) {
    await recordFeedback(stepExec, stepOutput, step, fromAgentId, resolved[index - 1]?.resolvedAgentId || null)
  } else {
    const toAgentId = index < resolved.length - 1 ? (resolved[index + 1]?.resolvedAgentId || 'system') : 'system'
    await recordCompletion(stepExec, stepOutput, fromAgentId, toAgentId, step)
  }
}

// ─── Simulated step execution loop ─────────────────────────

export async function runSimulatedPipeline(
  resolved: ResolvedStep[], stepExecs: any[], agentMap: Map<string, AgentRecord>,
  input: any,
  simulateStep: (step: ResolvedStep['step'], input: any, agent: AgentRecord | undefined, context: any) => any,
) {
  const taskContext: any = { ...(input || {}), _history: [] }
  let previousOutput: any = input || {}

  for (let i = 0; i < resolved.length; i++) {
    const { step, resolvedAgentId } = resolved[i]
    const stepExec = stepExecs[i]
    const agent = resolvedAgentId ? agentMap.get(resolvedAgentId) : null

    if (!resolvedAgentId) {
      await db.stepExecution.update({ where: { id: stepExec.id }, data: { status: 'skipped', error: 'No available agent' } })
      continue
    }

    const fromAgentId = i === 0 ? 'system' : (resolved[i - 1].resolvedAgentId || 'system')
    await recordStepStart({ stepExec, step, previousOutput, fromAgentId, index: i, total: resolved.length, toAgentId: resolvedAgentId })

    const stepOutput = simulateStep(step, previousOutput, agent, taskContext)
    await recordSimStepResult({ stepExec, stepOutput: step, fromAgentId, resolved, index: i })

    taskContext._history.push({
      step: step.name, agent: agent?.name || 'unknown', action: step.action,
      timestamp: new Date().toISOString(), status: isSimFeedbackReject(step, stepOutput) ? 'feedback_requested' : 'completed',
    })
    previousOutput = stepOutput
  }

  return { taskContext, previousOutput }
}

// ─── LLM step execution loop ──────────────────────────────

export interface LLMStepResult {
  taskContext: Record<string, unknown>
  previousOutput: Record<string, unknown>
  finalStatus: string
  finalError: string | null
}

async function executeLLMStep(params: {
  step: ResolvedStep['step']; previousOutput: Record<string, unknown>;
  taskContext: Record<string, unknown>; agent: AgentRecord;
  callStepLLM: (step: ResolvedStep['step'], prev: Record<string, unknown>, hist: unknown[], agent: AgentRecord) => Promise<Record<string, unknown>>;
  stepExec: any;
}): Promise<Record<string, unknown> | 'FAILED'> {
  const { step, previousOutput, taskContext, agent, callStepLLM, stepExec } = params
  try {
    return await callStepLLM(step, previousOutput, taskContext._history as unknown[], agent)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    await db.stepExecution.update({
      where: { id: stepExec.id },
      data: { status: 'failed', error: errMsg, completedAt: new Date(), outputData: '{}' },
    })
    ;(taskContext._history as object[]).push({ step: step.name, agent: agent.name, action: step.action, status: 'failed', error: errMsg })
    return 'FAILED'
  }
}

async function recordLLMStepResult(params: { stepExec: any; typedOutput: any; step: ResolvedStep['step']; agentId: string; fromAgentId: string; resolved: ResolvedStep[]; stepIndex: number }) {
  const { stepExec, typedOutput, step, agentId, fromAgentId, resolved, stepIndex } = params
  if (isFeedbackReject(step, typedOutput)) {
    await recordFeedback(stepExec, typedOutput, step, agentId, fromAgentId)
    const fallbackIdx = resolved.findIndex(r => r.step.id === step.fallbackStepId)
    return fallbackIdx >= 0 ? fallbackIdx : stepIndex + 1
  }
  const toAgentId = stepIndex < resolved.length - 1 ? (resolved[stepIndex + 1]?.agentId || 'system') : 'system'
  await recordCompletion(stepExec, typedOutput, agentId, toAgentId, step)
  return stepIndex + 1
}

export async function runLLMPipeline(
  resolved: ResolvedStep[], stepExecs: any[], agentMap: Map<string, AgentRecord>,
  input: Record<string, unknown> | undefined,
  callStepLLM: (step: ResolvedStep['step'], previousOutput: Record<string, unknown>, history: unknown[], agent: AgentRecord) => Promise<Record<string, unknown>>,
): Promise<LLMStepResult> {
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
      stepIndex++; continue
    }

    const fromAgentId = stepIndex === 0 ? 'system' : (resolved[stepIndex - 1].agentId || 'system')
    await recordStepStart({ stepExec, step, previousOutput, fromAgentId, index: stepIndex, total: resolved.length, toAgentId: agentId })

    const stepOutput = await executeLLMStep({ step, previousOutput, taskContext, agent, callStepLLM, stepExec })
    if (stepOutput === 'FAILED') break

    const typedOutput = stepOutput as Record<string, unknown>
    const feedback = isFeedbackReject(step, typedOutput)
    stepIndex = await recordLLMStepResult({ stepExec, typedOutput, step, agentId, fromAgentId, resolved, stepIndex })

    taskContext._history.push({
      step: step.name, agent: agent.name, action: step.action,
      timestamp: new Date().toISOString(), status: feedback ? 'feedback_requested' : 'completed',
    })
    previousOutput = typedOutput
  }

  return { taskContext, previousOutput, finalStatus, finalError }
}