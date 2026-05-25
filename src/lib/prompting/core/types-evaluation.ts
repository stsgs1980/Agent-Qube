/**
 * @stsgs/prompting -- Evaluation & Orchestration Types
 * Type definitions for scoring, cognitive formulas, orchestration, and resilience.
 */

// ─── Evaluation ──────────────────────────────────────────────

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface PromptScore {
  overall: Grade
  numeric: number        // 0-100
  dimensions: ScoreDimension[]
  suggestions: string[]
}

export interface ScoreDimension {
  name: string
  score: number          // 0-100
  weight: number         // 0-1
  grade: Grade
  feedback: string
}

export interface BlindCompareResult {
  winner: 'a' | 'b' | 'tie'
  reason: string
  scores: { a: PromptScore; b: PromptScore }
  deltas: Record<string, number>
}

export interface BenchmarkResult {
  totalChecks: number
  passed: number
  failed: number
  score: number          // 0-100
  grade: Grade
  checks: BenchmarkCheck[]
}

export interface BenchmarkCheck {
  id: string
  category: string
  description: string
  passed: boolean
  severity: 'critical' | 'warning' | 'info'
  details: string
}

// ─── Cognitive Formulas ──────────────────────────────────────

export interface CognitiveFormula {
  id: string
  name: string
  category: CognitiveCategory
  description: string
  pattern: string          // regex or keyword pattern
  template: string         // how to apply in prompt
  example: { input: string; output: string }
}

export type CognitiveCategory =
  | 'bias-mitigation'
  | 'reasoning-enhancement'
  | 'creativity-boost'
  | 'precision-focus'
  | 'perspective-taking'
  | 'memory-augmentation'
  | 'self-critique'
  | 'decomposition'

// ─── Orchestration ───────────────────────────────────────────

export interface OrchestrationPattern {
  id: string
  name: string
  description: string
  agentCount: number
  topology: 'sequential' | 'parallel' | 'hierarchical' | 'mesh' | 'round-robin'
  steps: OrchestrationStep[]
  useCase: string
}

export interface OrchestrationStep {
  agentRole: string
  inputFrom: number | number[] | '*'
  outputTo: number | number[] | '*'
  promptTemplate: string
  aggregation?: 'merge' | 'vote' | 'chain' | 'select-best'
}

// ─── Resilience ──────────────────────────────────────────────

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number        // ms
  maxDelay: number         // ms
  backoffMultiplier: number
  jitter: boolean
  retryableErrors: string[] // error substrings
}

export interface CircuitState {
  state: 'closed' | 'open' | 'half-open'
  failures: number
  successes: number
  lastFailure: number | null  // timestamp
  nextRetry: number | null    // timestamp
}

export interface ResilienceResult<T> {
  success: boolean
  data: T | null
  attempts: number
  totalDuration: number
  errors: string[]
  circuitState: CircuitState
}
