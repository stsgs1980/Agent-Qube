/**
 * @stsgs/prompting -- Intent & Agent Types
 * Type definitions for intent matching, agent roles, and flow templates.
 */

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
