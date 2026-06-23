/**
 * @stsgs/prompting -- Instructions Registry
 * Behavioral rules and protocols for AI agents.
 *
 * Two categories:
 *   instructions/  -- 6 behavioral rules (language, git, sandbox, onboarding, planning, diagnostics)
 *   ai-rules/      -- 4 architectural rules (core, enforcement, library, project) [inline, no filesystem dependency]
 *
 * Use getInstruction() or getAIRule() to retrieve content as string
 * for injection into LLM system prompts.
 */

// ─── Types (re-export) ────────────────────────────────────────

export type { InstructionCategory, InstructionMeta, InstructionEntry } from './instructions-types'

// ─── Data ─────────────────────────────────────────────────────

import type { InstructionEntry, InstructionMeta, InstructionCategory } from './instructions-types'
import { INSTRUCTIONS as BEHAVIORAL } from './instructions-behavioral'
import { INSTRUCTIONS_EXTRA as BEHAVIORAL_EXTRA } from './instructions-behavioral-extra'
import { AI_RULES } from './instructions-ai-rules'

/** All behavioral instructions (6 entries). */
export const INSTRUCTIONS: InstructionEntry[] = [...BEHAVIORAL, ...BEHAVIORAL_EXTRA]

/** Re-export AI_RULES for barrel consumers. */
export { AI_RULES }

// ─── Public API ──────────────────────────────────────────────

/** All instructions (behavioral + architectural). */
const ALL: InstructionEntry[] = [...INSTRUCTIONS, ...AI_RULES]

/** Get all instruction entries (metadata + content). */
export function getAllInstructions(): InstructionEntry[] {
  return ALL
}

/** Get instruction metadata only (no content, lighter payload). */
export function getInstructionMeta(): InstructionMeta[] {
  return ALL.map(({ content: _c, lineCount: _l, ...meta }) => meta)
}

/** Get a single instruction by ID. */
export function getInstruction(id: string): InstructionEntry | undefined {
  return ALL.find(i => i.id === id)
}

/** Get instruction content as string (for LLM system prompt injection). */
export function getInstructionContent(id: string): string | undefined {
  return ALL.find(i => i.id === id)?.content
}

/** Get instructions by category. */
export function getInstructionsByCategory(category: InstructionCategory): InstructionEntry[] {
  return ALL.filter(i => i.category === category)
}

/** Search instructions by keyword. */
export function searchInstructions(query: string): InstructionEntry[] {
  const q = query.toLowerCase()
  return ALL.filter(i =>
    i.title.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q) ||
    i.keywords.some(k => k.toLowerCase().includes(q))
  )
}

/** Get instruction IDs list. */
export function getInstructionIds(): string[] {
  return ALL.map(i => i.id)
}

/** Get all instruction content concatenated (for full context injection). */
export function getAllInstructionContent(): string {
  return ALL.map(i => `--- ${i.title} ---\n${i.content}`).join('\n\n')
}