// ─── Shared types for Prompt Analysis ──────────────────────────

import type { IntentMatch, AgentRole, CognitiveFormula } from '@/lib/prompting'

export type { IntentMatch, AgentRole, CognitiveFormula }

export interface PipelineStepDraft {
  order: number
  name: string
  action: string
  agentId: string
  agentName: string
  roleGroup: string
  formulaName: string
}

export interface PromptAnalysis {
  intent: IntentMatch
  bestRole: AgentRole
  runnerUpIntents: Array<{ intent: string; confidence: number }>
  recommendedFormula: CognitiveFormula | null
  formulaReason: string
  agentChain: Array<{ id: string; name: string; roleGroup: string }>
  pipelineSteps: PipelineStepDraft[]
}

export interface StepResult {
  id: string
  name: string
  status: string
  agentId: string | null
  agentName: string
  action: string
  startedAt: string | null
  completedAt: string | null
  inputData: string
  outputData: string
  error: string | null
}

export interface ExecutionData {
  id: string
  status: string
  steps: StepResult[]
}
