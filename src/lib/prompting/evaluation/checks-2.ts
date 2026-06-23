/**
 * @stsgs/prompting -- Benchmark Checks Part 2 (20/40)
 * Categories: Completeness, Anti-patterns, Security, Accessibility
 */

import type { CheckDef } from './checks-1'

export const CHECKS_PART2: CheckDef[] = [
  // ── Completeness (5 checks) ──────────────────────────────
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

  // ── Security (5 checks) ──────────────────────────────────
  {
    id: 'SEC-001', category: 'Security', severity: 'critical',
    description: 'No hardcoded secrets or credentials',
    test: p => !/\b(password|secret|api[_-]?key|token|credential|auth[_-]?token)\s*[:=]\s*\S+/i.test(p),
    detail: (_, passed) => passed ? 'No hardcoded secrets detected.' : 'WARNING: Possible hardcoded secret/credential detected. Use placeholders.'
  },
  {
    id: 'SEC-002', category: 'Security', severity: 'warning',
    description: 'No URLs with embedded credentials',
    test: p => !/https?:\/\/[^:]+:[^@]+@/i.test(p),
    detail: (_, passed) => passed ? 'No credential URLs detected.' : 'WARNING: URL contains embedded credentials.'
  },
  {
    id: 'SEC-003', category: 'Security', severity: 'info',
    description: 'Mentions security when asking for auth-related code',
    test: p => {
      const asksAuth = /\b(auth|login|password|token|session|cookie|jwt|oauth)\b/i.test(p)
      const mentionsSec = /\b(security|safe|encrypt|hash|validate|sanitize|escape|xss|csrf|injection)\b/i.test(p)
      return !(asksAuth && !mentionsSec)
    },
    detail: (_, passed) => passed ? 'Security considerations present for auth-related requests.' : 'When asking about authentication, mention security requirements.'
  },
  {
    id: 'SEC-004', category: 'Security', severity: 'info',
    description: 'No email addresses or phone numbers',
    test: p => !/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(p) && !/\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,9}/.test(p),
    detail: (_, passed) => passed ? 'No PII detected.' : 'WARNING: Possible email or phone number detected. Redact personal information.'
  },
  {
    id: 'SEC-005', category: 'Security', severity: 'info',
    description: 'No file paths with usernames',
    test: p => !/\/home\/[a-zA-Z0-9]+\/|\/users\/[a-zA-Z0-9]+\/|C:\\Users\\[a-zA-Z0-9]+\\/i.test(p),
    detail: (_, passed) => passed ? 'No username paths detected.' : 'File paths contain usernames. Use generic paths like /home/user/ or /project/.'
  },

  // ── Accessibility (5 checks) ─────────────────────────────
  {
    id: 'A11Y-001', category: 'Accessibility', severity: 'info',
    description: 'Requests accessible output when asking for UI',
    test: p => {
      const asksUI = /\b(component|button|form|input|modal|dialog|nav|menu|card|table)\b/i.test(p)
      const mentionsA11y = /\b(accessib|aria|wcag|keyboard|screen reader|focus|alt text|semantic)\b/i.test(p)
      return !(asksUI && !mentionsA11y)
    },
    detail: (_, passed) => passed ? 'Accessibility mentioned for UI-related requests.' : 'When asking for UI components, mention accessibility (ARIA, keyboard nav, WCAG).'
  },
  {
    id: 'A11Y-002', category: 'Accessibility', severity: 'info',
    description: 'Uses plain language when possible',
    test: p => {
      const jargonCount = (p.match(/\b(paradigm|synergy|leverage|utilize|facilitate|methodology|orchestrate|implement|pursuant|heretofore)\b/gi) ?? []).length
      return jargonCount <= 2
    },
    detail: (p, passed) => {
      const jargon = p.match(/\b(paradigm|synergy|leverage|utilize|facilitate|methodology|orchestrate|implement|pursuant|heretofore)\b/gi) ?? []
      return passed ? `Jargon count: ${jargon.length} (acceptable).` : `Jargon count: ${jargon.length}. Use simpler language.`
    },
  },
  {
    id: 'A11Y-003', category: 'Accessibility', severity: 'info',
    description: 'Considers multilingual needs',
    test: p => {
      const hasNonLatin = /[a-zA-Z]/.test(p) && /[\u0400-\u04FF\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(p)
      return !hasNonLatin
    },
    detail: (_, passed) => passed ? 'Language is consistent.' : 'Mixed scripts detected. Consider separating multilingual content.'
  },
  {
    id: 'A11Y-004', category: 'Accessibility', severity: 'info',
    description: 'Readable font size in UI requests',
    test: p => {
      const asksUI = /\b(component|page|layout|dashboard|screen)\b/i.test(p)
      const mentionsSize = /\b(font.?size|text.?size|readable|legible|contrast|wcag|accessible)\b/i.test(p)
      return !(asksUI && !mentionsSize)
    },
    detail: (_, passed) => passed ? 'Readability considered.' : 'When asking for UI, mention font size and readability requirements.'
  },
  {
    id: 'A11Y-005', category: 'Accessibility', severity: 'info',
    description: 'No reliance on color alone',
    test: p => {
      const hasColorOnly = /\b(use color|color.?only|just color|only color|different color)\b/i.test(p)
      const hasAlt = /\b(icon|label|text|pattern|shape|position|marker)\b/i.test(p)
      return !(hasColorOnly && !hasAlt)
    },
    detail: (_, passed) => passed ? 'Not relying on color alone.' : 'Do not rely on color alone for conveying information. Add icons, labels, or patterns.'
  },
]