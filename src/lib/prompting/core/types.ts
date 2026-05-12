/**
 * @stsgs/prompting -- Core Types
 * Layer 1: Type definitions for the entire prompting library.
 * No React, no JSX, no runtime side effects.
 */

// ─── Prompt Anatomy ──────────────────────────────────────────

export interface PromptContext {
  role: string
  domain: string
  audience: string
  tone: PromptTone
  language: string
  constraints: string[]
  outputFormat: OutputFormat
}

export type PromptTone =
  | 'professional'
  | 'casual'
  | 'technical'
  | 'creative'
  | 'authoritative'
  | 'empathetic'
  | 'neutral'

export type OutputFormat =
  | 'json'
  | 'markdown'
  | 'plain-text'
  | 'code'
  | 'html'
  | 'yaml'
  | 'table'
  | 'list'
  | 'conversation'

export interface PromptBlock {
  layer: SystemPromptLayer
  content: string
  weight: number // 0-1, how strongly this block shapes the output
  optional: boolean
}

export type SystemPromptLayer =
  | 'identity'     // Who the AI is
  | 'context'      // What situation/environment
  | 'constraints'  // What the AI must/must not do
  | 'output'       // Expected format/structure
  | 'behavior'     // How the AI should behave/tone

// ─── Techniques ──────────────────────────────────────────────

export interface PromptTechnique {
  id: string
  name: string
  description: string
  category: TechniqueCategory
  applicableTo: OutputFormat[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  example: string
}

export type TechniqueCategory =
  | 'clarity'
  | 'reasoning'
  | 'constraint'
  | 'role-play'
  | 'formatting'
  | 'meta'
  | 'chain-of-thought'

// ─── Frameworks ──────────────────────────────────────────────

export interface PromptFramework {
  id: string
  name: string
  acronym: string
  description: string
  steps: FrameworkStep[]
  bestFor: string[]
  complexity: 'simple' | 'moderate' | 'complex'
}

export interface FrameworkStep {
  label: string
  description: string
  required: boolean
  placeholder: string
}

// ─── Intent Matching ─────────────────────────────────────────

export type IntentType =
  | 'layout-advice'
  | 'component-query'
  | 'code-generation'
  | 'code-review'
  | 'debugging'
  | 'explanation'
  | 'translation'
  | 'summarization'
  | 'data-analysis'
  | 'creative-writing'
  | 'refactoring'
  | 'testing'

export interface IntentMatch {
  intent: IntentType
  confidence: number      // 0-100
  keywords: string[]      // matched keywords
  template: string        // recommended prompt template
  metadata: Record<string, unknown>
}

// ─── Agent Templates ─────────────────────────────────────────

export interface AgentRole {
  id: string
  name: string
  systemPrompt: string
  strengths: string[]
  weaknesses: string[]
  bestFor: IntentType[]
  temperature: number     // 0-2
  maxTokens: number
}

// ─── Flow Templates ──────────────────────────────────────────

export interface FlowStep {
  role: 'user' | 'assistant' | 'system'
  template: string
  waitFor: 'input' | 'confirmation' | 'auto'
  validation?: FlowValidation
}

export interface FlowValidation {
  type: 'json-schema' | 'regex' | 'keywords' | 'length'
  rule: string | string[]
  errorMessage: string
}

export interface FlowTemplate {
  id: string
  name: string
  description: string
  steps: FlowStep[]
  loopPoint?: number     // step index to loop back to
  maxIterations?: number
}

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
  outputTo: number | '*'
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
