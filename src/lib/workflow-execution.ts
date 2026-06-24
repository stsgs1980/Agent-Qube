import { db } from '@/lib/db'

// ─── Types ──────────────────────────────────────────────────────────────────

export type AgentRecord = { id: string; name: string; role: string; formula: string }

export interface ResolvedStep {
  step: {
    id: string; name: string; action: string; order: number;
    roleGroup: string | null; config: string; fallbackStepId: string | null;
  }
  resolvedAgentId: string | null
}

// ─── Resolve agents for workflow steps ─────────────────────────────────────

export async function loadWorkflow(workflowId: string) {
  const workflow = await db.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: { orderBy: { order: 'asc' } } },
  })
  if (!workflow) throw new WorkflowError('Workflow not found', 404)
  if (workflow.steps.length === 0) throw new WorkflowError('Workflow has no steps', 400)
  return workflow
}

export async function resolveAgentsForSteps(steps: ResolvedStep['step'][]) {
  const agents = await db.agent.findMany()
  const agentMap = new Map(agents.map(a => [a.id, a]))

  const resolved: ResolvedStep[] = steps.map(step => {
    let agentId = step.agentId
    if (!agentId && step.roleGroup) {
      const match = agents.find(a => a.roleGroup === step.roleGroup && a.status === 'active')
      agentId = match?.id || null
    }
    return { step, resolvedAgentId: agentId }
  })

  return { resolved, agentMap }
}

// ─── Create execution + step records ──────────────────────────────────────

export async function createExecutionRecords(
  workflowId: string,
  input: Record<string, unknown> | undefined,
  resolved: ResolvedStep[],
) {
  const execution = await db.workflowExecution.create({
    data: {
      workflowId, status: 'running',
      input: JSON.stringify(input || {}),
      taskContext: JSON.stringify({ ...(input || {}), _history: [] }),
    },
  })

  const stepExecs = await Promise.all(
    resolved.map(({ step, resolvedAgentId }) =>
      db.stepExecution.create({
        data: {
          executionId: execution.id, stepId: step.id,
          agentId: resolvedAgentId, status: 'pending',
          inputData: '{}', outputData: '{}',
        },
      })
    )
  )

  return { execution, stepExecs }
}

// ─── Finalize execution ───────────────────────────────────────────────────

export async function finalizeExecution(
  executionId: string,
  taskContext: Record<string, unknown>,
  previousOutput: Record<string, unknown>,
  status: string,
  error: string | null,
) {
  await db.workflowExecution.update({
    where: { id: executionId },
    data: {
      status, taskContext: JSON.stringify(taskContext),
      output: JSON.stringify(previousOutput), error,
      completedAt: new Date(),
    },
  })

  return db.workflowExecution.findUnique({
    where: { id: executionId },
    include: { steps: { include: { messages: true }, orderBy: { id: 'asc' } } },
  })
}

// ─── Step execution helpers (DB updates) ─────────────────────────────────

export async function markStepRunning(stepExecId: string, inputData: unknown) {
  return db.stepExecution.update({
    where: { id: stepExecId },
    data: { status: 'running', startedAt: new Date(), inputData: JSON.stringify(inputData) },
  })
}

export async function markStepSkipped(stepExecId: string) {
  return db.stepExecution.update({
    where: { id: stepExecId },
    data: { status: 'skipped', error: 'No available agent' },
  })
}

export async function markStepCompleted(stepExecId: string, outputData: unknown) {
  return db.stepExecution.update({
    where: { id: stepExecId },
    data: { status: 'completed', completedAt: new Date(), outputData: JSON.stringify(outputData) },
  })
}

export async function markStepWaitingFeedback(stepExecId: string, outputData: unknown) {
  return db.stepExecution.update({
    where: { id: stepExecId },
    data: { status: 'waiting_feedback', completedAt: new Date(), outputData: JSON.stringify(outputData) },
  })
}

export async function markStepFailed(stepExecId: string, errorMsg: string) {
  return db.stepExecution.update({
    where: { id: stepExecId },
    data: { status: 'failed', error: errorMsg, completedAt: new Date(), outputData: '{}' },
  })
}

// ─── Message helpers ──────────────────────────────────────────────────────

export interface RequestMessageParams {
  stepExecId: string; fromAgentId: string; toAgentId: string;
  stepName: string; stepAction: string; stepOrder: number; input: unknown; position: string;
}

export async function createRequestMessage(p: RequestMessageParams) {
  return db.agentMessage.create({
    data: {
      stepExecutionId: p.stepExecId, fromAgentId: p.fromAgentId, toAgentId: p.toAgentId, type: 'request',
      content: JSON.stringify({ task: p.stepName, action: p.stepAction, input: p.input }),
      metadata: JSON.stringify({ stepOrder: p.stepOrder, pipelinePosition: p.position }),
    },
  })
}

export async function createResponseMessage(
  stepExecId: string, fromAgentId: string, toAgentId: string,
  output: unknown, stepOrder: number,
) {
  return db.agentMessage.create({
    data: {
      stepExecutionId: stepExecId, fromAgentId, toAgentId, type: 'response',
      content: JSON.stringify(output), metadata: JSON.stringify({ stepOrder }),
    },
  })
}

export interface FeedbackMessageParams {
  stepExecId: string; fromAgentId: string; toAgentId: string;
  reason: string; feedback: string; fallbackStepId: string | null;
}

export async function createFeedbackMessage(p: FeedbackMessageParams) {
  return db.agentMessage.create({
    data: {
      stepExecutionId: p.stepExecId, fromAgentId: p.fromAgentId, toAgentId: p.toAgentId, type: 'feedback',
      content: JSON.stringify({ reviewResult: 'reject', reason: p.reason, feedback: p.feedback }),
      metadata: JSON.stringify({ feedbackLoop: true, targetStep: p.fallbackStepId }),
    },
  })
}

// ─── Simulation engine (extracted per-action handlers) ────────────────────

function simulateProcess(input: any, agent: AgentRecord | undefined, stepName: string) {
  return {
    ...input,
    _processedBy: agent?.name || 'system',
    _processingResult: 'success',
    _timestamp: new Date().toISOString(),
    [stepName.toLowerCase().replace(/\s+/g, '_')]: {
      status: 'processed', agent: agent?.name, formula: agent?.formula,
    },
  }
}

function simulateReview(input: any, agent: AgentRecord | undefined) {
  const approved = Math.random() > 0.2
  return {
    ...input,
    _reviewResult: approved ? 'approved' : 'reject',
    _reviewReason: approved ? 'Meets quality standards' : 'Quality threshold not met',
    _reviewedBy: agent?.name || 'system',
    _feedback: approved ? undefined : 'Needs improvement in accuracy and completeness',
    _timestamp: new Date().toISOString(),
  }
}

function simulateTransform(input: any, agent: AgentRecord | undefined, config: any, stepName: string) {
  return {
    ...input,
    _transformedBy: agent?.name || 'system',
    _transformType: config.transformType || 'format',
    _transformResult: 'transformed',
    _timestamp: new Date().toISOString(),
  }
}

function simulateDelegate(input: any, agent: AgentRecord | undefined, config: any, stepRoleGroup: string | null) {
  return {
    ...input,
    _delegatedBy: agent?.name || 'system',
    _delegatedTo: config.targetGroup || stepRoleGroup,
    _delegationReason: config.reason || 'Specialized processing required',
    _timestamp: new Date().toISOString(),
  }
}

function simulateBroadcast(input: any, agent: AgentRecord | undefined, context: any) {
  return {
    ...input,
    _broadcastBy: agent?.name || 'system',
    _broadcastTargets: context._history?.length || 0,
    _broadcastResult: 'delivered',
    _timestamp: new Date().toISOString(),
  }
}

function simulateDecision(input: any, agent: AgentRecord | undefined, config: any) {
  const condition = config.condition || 'default'
  const branch = condition === 'quality_check'
    ? (Math.random() > 0.3 ? 'pass' : 'fail')
    : 'default'
  return {
    ...input,
    _decisionBy: agent?.name || 'system',
    _decisionBranch: branch,
    _decisionReason: `Condition "${condition}" evaluated to "${branch}"`,
    _timestamp: new Date().toISOString(),
  }
}

export function simulateStepExecution(
  step: { action: string; name: string; roleGroup: string | null; config: string },
  input: any,
  agent: AgentRecord | undefined,
  context: any,
): any {
  const config = typeof step.config === 'string' ? JSON.parse(step.config) : step.config

  switch (step.action) {
    case 'process':
      return simulateProcess(input, agent, step.name)
    case 'review':
      return simulateReview(input, agent)
    case 'transform':
      return simulateTransform(input, agent, config, step.name)
    case 'delegate':
      return simulateDelegate(input, agent, config, step.roleGroup)
    case 'broadcast':
      return simulateBroadcast(input, agent, context)
    case 'decision':
      return simulateDecision(input, agent, config)
    default:
      return { ...input, _processedBy: agent?.name || 'system', _timestamp: new Date().toISOString() }
  }
}

// ─── Build LLM user prompt for a step ─────────────────────────────────────

export function buildStepUserPrompt(
  stepAction: string,
  stepName: string,
  previousOutput: Record<string, unknown>,
  history: unknown[],
): string {
  const lines = [
    `ACTION: ${stepAction}`,
    `STEP: ${stepName}`,
    `INPUT: ${JSON.stringify(previousOutput)}`,
    `CONTEXT HISTORY: ${JSON.stringify(history)}`,
    stepAction === 'review'
      ? 'Review the input. Respond with JSON: { "result": "approved" | "reject", "reason": "...", "feedback": "..." }'
      : 'Process the input and respond with JSON containing your output.',
  ]
  return lines.join('\n')
}

// ─── Error class ──────────────────────────────────────────────────────────

export class WorkflowError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}