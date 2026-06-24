import { db } from '@/lib/db'
import { getCognitiveFormula, matchIntent, getBestAgentForIntent, buildSystemPrompt, buildMinimalSystemPrompt, applyFormula, type PromptContext } from '@/lib/prompting'

// ─── Shared formula ID mapping ────────────────────────────────────────────

export const FORMULA_ID_MAP: Record<string, string> = {
  CoT: 'cf-first-principles',
  ToT: 'cf-anchoring-break',
  GoT: 'cf-functional-decomposition',
  AoT: 'cf-abstraction-layers',
  SoT: 'cf-precision-drill',
  CoVe: 'cf-self-audit',
  Reflexion: 'cf-devils-advocate',
  SelfConsistency: 'cf-confirmation-discount',
  SelfRefine: 'cf-pre-mortem',
  ReWOO: 'cf-inversion',
  ReAct: 'cf-boundary-check',
  MoA: 'cf-stakeholder-map',
  LATS: 'cf-scamper',
  PoT: 'cf-precision-drill',
  DSPy: 'cf-meta-prompting',
  PromptChaining: 'cf-functional-decomposition',
  LeastToMost: 'cf-accumulation-register',
  StepBack: 'cf-time-machine',
  PlanAndSolve: 'cf-pre-mortem',
  MetaCoT: 'cf-devils-advocate',
}

// ─── Agent creation: prompting metadata ───────────────────────────────────

export async function resolvePromptingMeta(role: string | undefined, description: string | undefined) {
  const promptingMeta: Record<string, unknown> = {}
  if (!role && !description) return promptingMeta

  try {
    const intentText = `${role || ''} ${description || ''}`.trim()
    const intentMatch = matchIntent(intentText)
    const bestRole = getBestAgentForIntent(intentMatch.intent)
    promptingMeta.intentMatch = {
      intent: intentMatch.intent,
      confidence: intentMatch.confidence,
      keywords: intentMatch.keywords,
    }
    promptingMeta.suggestedRole = bestRole
      ? { id: bestRole.id, name: bestRole.name, temperature: bestRole.temperature }
      : null
  } catch {
    // Prompting integration is optional
  }

  return promptingMeta
}

export async function resolveFormulaMeta(formula: string | undefined) {
  if (!formula) return null
  try {
    const pfId = FORMULA_ID_MAP[formula] || 'cf-first-principles'
    const cf = getCognitiveFormula(pfId)
    if (cf) return { id: cf.id, name: cf.name, category: cf.category, description: cf.description }
  } catch {
    // Formula resolution is optional
  }
  return null
}

export async function resolveSystemPrompt(role: string | undefined) {
  if (!role) return null
  try {
    return buildMinimalSystemPrompt(role, 'markdown')
  } catch {
    return null
  }
}

// ─── Agent prompt generation ──────────────────────────────────────────────

export interface AgentDataForPrompt {
  name: string
  formula: string
  role: string
  roleGroup: string
  description: string
}

export async function resolveAgentData(body: { agentId?: string; formula?: string; role?: string; roleGroup?: string; description?: string; name?: string }) {
  if (body.agentId) {
    const agent = await db.agent.findUnique({ where: { id: body.agentId } })
    if (!agent) return null
    return {
      name: agent.name, formula: agent.formula, role: agent.role,
      roleGroup: agent.roleGroup, description: agent.description,
    }
  }
  return {
    name: body.name || 'Agent',
    formula: body.formula || 'CoT',
    role: body.role || 'Agent',
    roleGroup: body.roleGroup || 'Execution',
    description: body.description || '',
  }
}

export function buildAgentPromptContext(data: AgentDataForPrompt) {
  const ctx: PromptContext = {
    role: data.role,
    domain: data.roleGroup,
    audience: 'developer',
    tone: 'technical',
    language: 'English',
    constraints: [
      `Cognitive formula: ${data.formula}`,
      data.description ? `Specialization: ${data.description}` : '',
    ].filter(Boolean),
    outputFormat: 'markdown',
  }
  return buildSystemPrompt(ctx)
}

export function resolveCognitiveFormulaId(formula: string) {
  return FORMULA_ID_MAP[formula] || 'cf-first-principles'
}

export function buildFormulaTemplate(formulaId: string, data: AgentDataForPrompt) {
  return applyFormula(formulaId, {
    topic: data.role,
    problem: data.description || data.role,
    goal: data.description || data.role,
    project: data.name,
    decision: data.description || data.role,
    system: data.name,
    deliverable: 'solution',
  })
}

// ─── Execution stats helpers ──────────────────────────────────────────────

export function parseScore(outputData: string | null): number {
  if (!outputData) return 0
  try {
    const parsed: Record<string, unknown> = JSON.parse(outputData)
    const raw = parsed.score
    if (typeof raw === 'number') return raw
    if (typeof raw === 'string') return parseFloat(raw) || 0
    return 0
  } catch {
    return 0
  }
}

export function formatStepExecution(se: any) {
  const parsed: Record<string, unknown> = {}
  try { Object.assign(parsed, JSON.parse(se.outputData || '{}')) } catch { /* ignore */ }

  return {
    id: se.id,
    stepName: se.step?.name || 'Unknown Step',
    stepAction: se.step?.action || 'process',
    status: se.status,
    score: parseScore(se.outputData),
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    verdict: typeof parsed.verdict === 'string' ? parsed.verdict : '',
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    startedAt: se.startedAt,
    completedAt: se.completedAt,
    workflowId: se.step?.workflowId || null,
  }
}

export function computeExecutionStats(stepExecutions: any[]) {
  const total = stepExecutions.length
  const completed = stepExecutions.filter(se => se.status === 'completed').length
  const failed = stepExecutions.filter(se => se.status === 'failed').length
  const skipped = stepExecutions.filter(se => se.status === 'skipped').length
  const scores = stepExecutions
    .filter(se => se.status === 'completed')
    .map(se => parseScore(se.outputData))
    .filter(s => s > 0)
  return {
    totalRuns: total,
    completedRuns: completed,
    failedRuns: failed,
    skippedRuns: skipped,
    successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    avgScore: scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0,
    lastExecutedAt: stepExecutions.length > 0
      ? stepExecutions[0].startedAt || stepExecutions[0].completedAt
      : null,
  }
}

// ─── Aggregate execution stats for all agents ─────────────────────────────

interface AgentStatEntry {
  totalRuns: number
  completedRuns: number
  failedRuns: number
  avgScore: number
  lastExecutedAt: string | null
  isRunning: boolean
}

function accumulateScores(stepExecutions: any[]): Record<string, number[]> {
  const scoresByAgent: Record<string, number[]> = {}
  for (const se of stepExecutions) {
    if (!se.agentId || se.status !== 'completed') continue
    const score = parseScore(se.outputData)
    if (score > 0) {
      if (!scoresByAgent[se.agentId]) scoresByAgent[se.agentId] = []
      scoresByAgent[se.agentId].push(score)
    }
  }
  return scoresByAgent
}

export function aggregateAgentStats(stepExecutions: any[]): Record<string, AgentStatEntry> {
  const agentStats: Record<string, AgentStatEntry> = {}

  for (const se of stepExecutions) {
    if (!se.agentId) continue
    if (!agentStats[se.agentId]) {
      agentStats[se.agentId] = {
        totalRuns: 0, completedRuns: 0, failedRuns: 0,
        avgScore: 0, lastExecutedAt: null, isRunning: false,
      }
    }
    const stats = agentStats[se.agentId]
    stats.totalRuns++
    if (se.status === 'completed') stats.completedRuns++
    if (se.status === 'failed') stats.failedRuns++
    if (se.status === 'running') stats.isRunning = true
    if (se.startedAt && (!stats.lastExecutedAt || se.startedAt > stats.lastExecutedAt)) {
      stats.lastExecutedAt = se.startedAt.toISOString()
    }
  }

  for (const [agentId, scores] of Object.entries(accumulateScores(stepExecutions))) {
    if (agentStats[agentId]) {
      agentStats[agentId].avgScore = Math.round(
        (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
      ) / 10
    }
  }

  return agentStats
}