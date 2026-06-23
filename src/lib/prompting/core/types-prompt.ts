/**
 * @stsgs/prompting -- Core Prompt Types
 * Type definitions for prompt anatomy, techniques, and frameworks.
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
