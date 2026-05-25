// ─── Intent → Formula / Actions / Steps mapping tables ─────────

import type { IntentMatch, AgentRole, CognitiveFormula } from './prompt-analysis-types'
import type { PipelineStepDraft } from './prompt-analysis-types'

// ─── Agent role → P-MAS role group ────────────────────────────

export const ROLE_TO_GROUP: Record<string, string> = {
  'code-architect': 'Strategy',
  'frontend-specialist': 'Execution',
  'code-reviewer': 'Control',
  'debug-detective': 'Execution',
  'technical-writer': 'Communication',
  'test-engineer': 'Control',
  'data-analyst': 'Tactics',
  'security-auditor': 'Control',
  'ux-consultant': 'Strategy',
  'devops-engineer': 'Execution',
  'api-designer': 'Tactics',
  'prompt-engineer': 'Learning',
}

// ─── Intent → formula recommendation ──────────────────────────

const INTENT_TO_FORMULA_REASON: Record<string, string> = {
  'debugging': 'Debugging needs iterative exploration -- reason, act, observe, repeat',
  'code-review': 'Review benefits from structured verification of each claim',
  'code-generation': 'Generation works best with clear decomposition and step-by-step building',
  'data-analysis': 'Analysis requires systematic thinking with bias mitigation',
  'explanation': 'Complex explanations benefit from structured reasoning chains',
  'refactoring': 'Refactoring needs first-principles thinking to avoid repeating old mistakes',
  'testing': 'Testing benefits from boundary checks and systematic coverage analysis',
  'creative-writing': 'Creativity thrives under constraint-driven thinking',
  'layout-advice': 'Layout design benefits from multiple perspective evaluation',
  'component-query': 'Component selection needs precision drill to match exact requirements',
  'translation': 'Translation benefits from definition lock to prevent meaning drift',
  'summarization': 'Summarization benefits from skeleton-first then detail-fill approach',
}

const INTENT_TO_FORMULA_ID: Record<string, string> = {
  'debugging': 'cf-pre-mortem',
  'code-review': 'cf-confirmation-discount',
  'code-generation': 'cf-functional-decomposition',
  'data-analysis': 'cf-first-principles',
  'explanation': 'cf-inversion',
  'refactoring': 'cf-first-principles',
  'testing': 'cf-boundary-check',
  'creative-writing': 'cf-constraint-creativity',
  'layout-advice': 'cf-stakeholder-map',
  'component-query': 'cf-precision-drill',
  'translation': 'cf-definition-lock',
  'summarization': 'cf-anchoring-break',
}

export function getFormulaForIntent(intent: string, formulas: CognitiveFormula[]): {
  formula: CognitiveFormula | null
  reason: string
} {
  const formulaId = INTENT_TO_FORMULA_ID[intent] || 'cf-first-principles'
  const formula = formulas.find(f => f.id === formulaId) || formulas[0] || null
  const reason = INTENT_TO_FORMULA_REASON[intent] || 'General structured reasoning improves output quality'
  return { formula, reason }
}

// ─── Intent → step actions & names ────────────────────────────

const INTENT_TO_ACTIONS: Record<string, string[]> = {
  'debugging': ['process', 'process', 'review', 'decision'],
  'code-review': ['process', 'review', 'decision'],
  'code-generation': ['process', 'transform', 'review'],
  'data-analysis': ['process', 'transform', 'process', 'review'],
  'explanation': ['process', 'transform'],
  'refactoring': ['process', 'transform', 'review'],
  'testing': ['process', 'review', 'decision'],
  'creative-writing': ['process', 'review'],
  'layout-advice': ['process', 'review', 'decision'],
  'component-query': ['process', 'review'],
  'translation': ['process', 'review'],
  'summarization': ['process', 'transform'],
}

const STEP_NAMES: Record<string, string[]> = {
  'debugging': ['Diagnose', 'Investigate', 'Verify Fix', 'Approve'],
  'code-review': ['Analyze Code', 'Review Quality', 'Verdict'],
  'code-generation': ['Generate Code', 'Format & Refine', 'Review Output'],
  'data-analysis': ['Parse Data', 'Compute Metrics', 'Find Patterns', 'Review Findings'],
  'explanation': ['Research Topic', 'Structure Explanation'],
  'refactoring': ['Analyze Structure', 'Transform Code', 'Review Changes'],
  'testing': ['Generate Tests', 'Review Coverage', 'Verdict'],
  'creative-writing': ['Draft Content', 'Review Quality'],
  'layout-advice': ['Analyze Requirements', 'Review Layout', 'Verdict'],
  'component-query': ['Search Components', 'Review Match'],
  'translation': ['Translate Content', 'Review Accuracy'],
  'summarization': ['Extract Key Points', 'Format Summary'],
}

// ─── Builders ─────────────────────────────────────────────────

const ALL_INTENTS = [
  'layout-advice', 'component-query', 'code-generation', 'code-review',
  'debugging', 'explanation', 'translation', 'summarization',
  'data-analysis', 'creative-writing', 'refactoring', 'testing',
] as const

export function getRunnerUpIntents(primary: IntentMatch): Array<{ intent: string; confidence: number }> {
  return ALL_INTENTS
    .filter(i => i !== primary.intent)
    .slice(0, 2)
    .map((intent, idx) => ({
      intent,
      confidence: Math.max(10, primary.confidence - 25 - idx * 15),
    }))
}

export function buildAgentChain(intentType: string, bestRole: AgentRole): Array<{ id: string; name: string; roleGroup: string }> {
  const chain: Array<{ id: string; name: string; roleGroup: string }> = []

  if (['code-generation', 'data-analysis', 'layout-advice', 'debugging'].includes(intentType)) {
    chain.push({ id: 'code-architect', name: 'Code Architect', roleGroup: 'Strategy' })
  }

  chain.push({
    id: bestRole.id,
    name: bestRole.name,
    roleGroup: ROLE_TO_GROUP[bestRole.id] || 'Execution',
  })

  if (!['code-reviewer', 'security-auditor'].includes(bestRole.id)) {
    chain.push({ id: 'code-reviewer', name: 'Code Reviewer', roleGroup: 'Control' })
  }

  return chain
}

export function buildPipelineSteps(
  intentType: string,
  agentChain: Array<{ id: string; name: string; roleGroup: string }>,
  formula: CognitiveFormula | null,
): PipelineStepDraft[] {
  const actions = INTENT_TO_ACTIONS[intentType] || ['process', 'review']
  const names = STEP_NAMES[intentType] || ['Process', 'Review']
  const steps: PipelineStepDraft[] = []

  for (let i = 0; i < Math.max(actions.length, names.length); i++) {
    const agent = agentChain[Math.min(i, agentChain.length - 1)]
    steps.push({
      order: i,
      name: names[i] || `Step ${i + 1}`,
      action: actions[i] || 'process',
      agentId: agent.id,
      agentName: agent.name,
      roleGroup: agent.roleGroup,
      formulaName: formula?.name || 'Chain of Thought',
    })
  }

  return steps
}
