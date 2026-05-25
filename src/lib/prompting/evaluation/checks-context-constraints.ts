/**
 * @stsgs/prompting -- CORE-EEAT Checks: Context + Constraints
 * 10 checks across 2 categories.
 */

import type { CheckDef } from './checks-clarity-specificity'

// ── Context (5 checks) ───────────────────────────────────

export const CHECKS_CONTEXT_CONST: CheckDef[] = [
  {
    id: 'CTXT-001', category: 'Context', severity: 'warning',
    description: 'Assigns a role or persona',
    test: p => /\b(you are|as a|act as|role:|persona|expert|specialist|senior|junior)\b/i.test(p),
    detail: (_, passed) => passed ? 'Role/persona assigned.' : 'Assign a role (e.g., "You are a senior engineer") for domain-specific responses.'
  },
  {
    id: 'CTXT-002', category: 'Context', severity: 'info',
    description: 'Specifies target audience',
    test: p => /\b(for (?:a|an|the|beginners?|experts?|developers?|users?|team|audience|clients?))\b/i.test(p),
    detail: (_, passed) => passed ? 'Target audience specified.' : 'Specify who the output is for (developers, beginners, end users, etc.).'
  },
  {
    id: 'CTXT-003', category: 'Context', severity: 'info',
    description: 'Provides environment or platform context',
    test: p => /\b(environment|production|development|staging|browser|server|client|mobile|desktop|cloud|local)\b/i.test(p),
    detail: (_, passed) => passed ? 'Environment/platform context provided.' : 'Add environment context (production, browser, server, etc.).'
  },
  {
    id: 'CTXT-004', category: 'Context', severity: 'info',
    description: 'Mentions existing constraints or prerequisites',
    test: p => /\b(already have|existing|current|using|built with|based on|runs on|depends on|constraint|limitation)\b/i.test(p),
    detail: (_, passed) => passed ? 'Existing context/constraints mentioned.' : 'Mention existing tools, constraints, or prerequisites for more relevant output.'
  },
  {
    id: 'CTXT-005', category: 'Context', severity: 'warning',
    description: 'Sufficient length for context (at least 50 characters)',
    test: p => p.trim().length >= 50,
    detail: (p, passed) => passed ? `Length: ${p.trim().length} chars.` : `Length: ${p.trim().length} chars (minimum: 50). Add more context.`
  },

  // ── Constraints (5 checks) ───────────────────────────────
  {
    id: 'CNST-001', category: 'Constraints', severity: 'warning',
    description: 'Includes negative constraints (what NOT to do)',
    test: p => /\b(do not|don't|must not|never|no (?:emoji|markdown|explanation|placeholder|unicode))\b/i.test(p),
    detail: (_, passed) => passed ? 'Negative constraints defined.' : 'Add negative constraints to reduce unwanted output (e.g., "DO NOT use emoji").'
  },
  {
    id: 'CNST-002', category: 'Constraints', severity: 'info',
    description: 'Specifies length or size limits',
    test: p => /\b(maximum|max|min|minimum|limit|at most|no more than|exactly|under|over)\b.*\d+|\d+\s*(words?|lines?|chars?|sentences?|items?|files?)/i.test(p),
    detail: (_, passed) => passed ? 'Quantitative limits specified.' : 'Consider adding size limits (e.g., "maximum 200 words", "exactly 3 examples").'
  },
  {
    id: 'CNST-003', category: 'Constraints', severity: 'info',
    description: 'Mentions tone or style requirements',
    test: p => /\b(tone:|style:|formal|casual|professional|technical|creative|friendly|serious|humorous|academic)\b/i.test(p),
    detail: (_, passed) => passed ? 'Tone/style specified.' : 'Specify tone (formal, casual, technical) for consistent output.'
  },
  {
    id: 'CNST-004', category: 'Constraints', severity: 'info',
    description: 'Limits scope (only, just, focus on)',
    test: p => /\b(only|just|focus on|specifically|limited to|restrict|nothing else)\b/i.test(p),
    detail: (_, passed) => passed ? 'Scope is limited/focused.' : 'Consider limiting scope (e.g., "focus only on", "just the API layer").'
  },
  {
    id: 'CNST-005', category: 'Constraints', severity: 'warning',
    description: 'No conflicting instructions',
    test: p => {
      const hasNoExplain = /no explanation|don't explain|without explanation|no commentary/i.test(p)
      const hasExplain = /explain|describe why|provide reason/i.test(p)
      return !(hasNoExplain && hasExplain)
    },
    detail: (_, passed) => passed ? 'No conflicting instructions detected.' : 'Possible conflict: prompt asks both for and against explanations.'
  },
]
