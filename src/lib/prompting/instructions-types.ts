/**
 * @stsgs/prompting -- Instruction Types
 * Shared types for the instructions registry.
 */

export type InstructionCategory = 'instructions' | 'ai-rules'

export interface InstructionMeta {
  id: string
  title: string
  category: InstructionCategory
  description: string
  version: string
  keywords: string[]
}

export interface InstructionEntry extends InstructionMeta {
  content: string
  lineCount: number
}
