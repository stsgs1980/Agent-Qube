/**
 * @stsgs/prompting -- CORE-EEAT Checks: Completeness + Anti-patterns
 * 10 checks across 2 categories.
 */

import type { CheckDef } from './checks-clarity-specificity'

// ── Completeness (5 checks) ──────────────────────────────

export const CHECKS_COMPL_ANTI: CheckDef[] = [
  {
    id: 'CMPL-001', category: 'Completeness', severity: 'warning',
    description: 'Specifies both input and output',
    test: p => {
      const hasInput = /\b(input|given|provided|data|source|from|here is|this code|this text)\b/i.test(p)
      const hasOutput = /\b(output|return|result|produce|generate|create|respond|answer)\b/i.test(p)
      return hasInput && hasOutput
    },
    detail: (_, passed) => passed ? 'Both input and output directions specified.' : 'Clarify what is given (input) and what is expected (output).'
  },
  {
    id: 'CMPL-002', category: 'Completeness', severity: 'info',
    description: 'Mentions error handling or edge cases',
    test: p => /\b(error|exception|edge case|failure|fallback|boundary|corner case|invalid|empty|null|undefined|timeout)\b/i.test(p),
    detail: (_, passed) => passed ? 'Error handling / edge cases mentioned.' : 'Consider asking about edge cases or error handling.'
  },
  {
    id: 'CMPL-003', category: 'Completeness', severity: 'info',
    description: 'Includes acceptance criteria or validation rules',
    test: p => /\b(should|must|criteria|validate|check|verify|assert|pass|correct|accurate)\b/i.test(p),
    detail: (_, passed) => passed ? 'Acceptance criteria present.' : 'Add acceptance criteria to validate the output.'
  },
  {
    id: 'CMPL-004', category: 'Completeness', severity: 'info',
    description: 'Covers multiple aspects (what, how, why)',
    test: p => {
      const hasWhat = /\b(what|which)\b/i.test(p)
      const hasHow = /\b(how|approach|method|steps?|process|way)\b/i.test(p)
      return hasWhat && hasHow
    },
    detail: (_, passed) => passed ? 'Multiple aspects covered (what + how).' : 'Cover both "what" and "how" for completeness.'
  },
  {
    id: 'CMPL-005', category: 'Completeness', severity: 'info',
    description: 'Asks for code with imports/types',
    test: p => {
      const asksForCode = /\b(code|function|component|class|implement|write|generate)\b/i.test(p)
      const mentionsImports = /\b(import|include|require|type|interface|export)\b/i.test(p)
      return !(asksForCode && !mentionsImports)
    },
    detail: (p, passed) => passed ? 'Code requests include type/import context.' : 'When asking for code, mention imports and types for completeness.'
  },

  // ── Anti-patterns (5 checks) ─────────────────────────────
  {
    id: 'ANTI-001', category: 'Anti-patterns', severity: 'warning',
    description: 'No urgency words (quickly, asap, fast)',
    test: p => !/\b(quickly|asap|as soon as possible|fast|hurry|rush|urgent)\b/i.test(p),
    detail: (_, passed) => passed ? 'No urgency words detected.' : 'Urgency words reduce output quality. Remove: quickly, asap, fast.'
  },
  {
    id: 'ANTI-002', category: 'Anti-patterns', severity: 'warning',
    description: 'No hedging language (roughly, approximately, maybe)',
    test: p => !/\b(roughly|approximately|maybe|perhaps|might|could be|I think|sort of)\b/i.test(p),
    detail: (_, passed) => passed ? 'No hedging language detected.' : 'Hedging language introduces ambiguity. Be specific instead.'
  },
  {
    id: 'ANTI-003', category: 'Anti-patterns', severity: 'info',
    description: 'Not a single very long paragraph',
    test: p => {
      const paragraphs = p.split(/\n{2,}/).filter(s => s.trim().length > 0)
      const longestParagraph = Math.max(...paragraphs.map(s => s.length))
      return longestParagraph <= 500
    },
    detail: (p, passed) => {
      const paragraphs = p.split(/\n{2,}/).filter(s => s.trim().length > 0)
      const longest = Math.max(...paragraphs.map(s => s.length))
      return passed ? `Longest paragraph: ${longest} chars.` : `Longest paragraph: ${longest} chars (target: <=500). Break into smaller sections.`
    },
  },
  {
    id: 'ANTI-004', category: 'Anti-patterns', severity: 'info',
    description: 'Does not ask the model to ask questions',
    test: p => !/\b(ask me|any questions\?|let me know if|tell me what|what do you need)\b/i.test(p),
    detail: (_, passed) => passed ? 'Prompt is self-contained.' : 'Asking the model to ask questions wastes a turn. Provide all info upfront.'
  },
  {
    id: 'ANTI-005', category: 'Anti-patterns', severity: 'warning',
    description: 'Does not contain more than 3 topics',
    test: p => {
      const topicIndicators = p.split(/[.,!?]+/).filter(s => {
        const t = s.trim().toLowerCase()
        return t.length > 10 && /^(also|additionally|furthermore|moreover|and|plus)/.test(t) === false
      })
      return topicIndicators.length <= 15
    },
    detail: (_, passed) => passed ? 'Prompt is focused.' : 'Prompt may cover too many topics. Consider splitting into separate prompts.'
  },
]
