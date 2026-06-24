// ─── Helpers for use-prompt-analysis ─────────────────────────────

import type { IntentMatch, AgentRole, CognitiveFormula } from '@/lib/prompting'
import type { PromptAnalysis } from './prompt-analysis-types'
import { getRunnerUpIntents, buildAgentChain, buildPipelineSteps } from './prompt-analysis-mappings'

// Re-export for consumers
export type { PipelineStepDraft, PromptAnalysis, StepResult, ExecutionData } from './prompt-analysis-types'

// ─── Safe JSON parse ────────────────────────────────────────────

export async function safeJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json') && !ct.includes('text/plain')) {
    const text = await res.text()
    throw new Error(`Server returned non-JSON (HTTP ${res.status}). ${text.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

// ─── LLM step overrides ────────────────────────────────────────

export function applyLlmStepOverrides(
  llmAnalysis: { suggestedSteps?: unknown; suggestedActions?: unknown },
  pipelineSteps: Array<{ name: string; action?: string }>,
): void {
  if (!llmAnalysis?.suggestedSteps || !Array.isArray(llmAnalysis.suggestedSteps)) return
  const llmSteps = llmAnalysis.suggestedSteps as string[]
  const llmActions = (llmAnalysis.suggestedActions as string[]) || []
  for (let i = 0; i < llmSteps.length; i++) {
    if (i < pipelineSteps.length) {
      pipelineSteps[i].name = llmSteps[i]
      if (llmActions[i]) pipelineSteps[i].action = llmActions[i]
    }
  }
}

// ─── Default role fallback ──────────────────────────────────────

const DEFAULT_ROLE: AgentRole = {
  id: 'code-architect', name: 'Code Architect', temperature: 0.7,
  systemPrompt: '', expertise: [], preferredIntents: [],
}

const INTENT_REASONS: Record<string, string> = {
  debugging: 'Debugging needs iterative exploration',
  'code-review': 'Review benefits from structured verification',
  'code-generation': 'Generation works best with decomposition',
  'data-analysis': 'Analysis requires systematic thinking',
  explanation: 'Explanations benefit from structured reasoning',
  refactoring: 'Refactoring needs first-principles thinking',
  testing: 'Testing benefits from boundary checks',
  'creative-writing': 'Creativity thrives under constraint-driven thinking',
}

// ─── Build analysis from LLM response ──────────────────────────

export function buildAnalysisFromLlm(
  llmData: any,
  prompt: string,
): PromptAnalysis {
  const intent: IntentMatch = {
    intent: llmData.intent?.intent || 'explanation',
    confidence: llmData.intent?.confidence || 50,
    keywords: llmData.intent?.keywords || [],
  }
  const bestRole: AgentRole = llmData.bestRole || DEFAULT_ROLE
  const recommendedFormula: CognitiveFormula | null = llmData.recommendedFormula || null
  const formulaReason = llmData.llmAnalysis?.reasoning || 'General structured reasoning improves output quality'
  const runnerUpIntents = getRunnerUpIntents(intent)
  const agentChain = buildAgentChain(intent.intent, bestRole)
  const pipelineSteps = buildPipelineSteps(intent.intent, agentChain, recommendedFormula)
  applyLlmStepOverrides(llmData.llmAnalysis || {}, pipelineSteps)

  return {
    intent, bestRole, runnerUpIntents,
    recommendedFormula, formulaReason, agentChain, pipelineSteps,
  }
}

// ─── Build analysis from fallback GET responses ─────────────────

export async function buildAnalysisFromFallback(
  prompt: string,
): Promise<PromptAnalysis> {
  const [intentRes, rolesRes, formulasRes] = await Promise.all([
    fetch(`/api/prompting?section=intent&query=${encodeURIComponent(prompt)}`),
    fetch(`/api/prompting?section=roles&query=${encodeURIComponent(prompt)}`),
    fetch('/api/prompting?section=formulas'),
  ])

  const intentData: IntentMatch = await safeJson(intentRes)
  const rolesData: { intent: IntentMatch; bestRole: AgentRole } = await safeJson(rolesRes)
  const formulasData: { formulas: CognitiveFormula[] } = await safeJson(formulasRes)

  const runnerUpIntents = getRunnerUpIntents(intentData)
  const agentChain = buildAgentChain(intentData.intent, rolesData.bestRole)
  const pipelineSteps = buildPipelineSteps(intentData.intent, agentChain, formulasData.formulas[0])

  return {
    intent: intentData,
    bestRole: rolesData.bestRole,
    runnerUpIntents,
    recommendedFormula: formulasData.formulas[0] || null,
    formulaReason: INTENT_REASONS[intentData.intent] || 'General structured reasoning',
    agentChain,
    pipelineSteps,
  }
}