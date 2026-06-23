/**
 * @stsgs/prompting -- CORE-EEAT Checks: Security + Accessibility
 * 10 checks across 2 categories.
 */

import type { CheckDef } from './checks-clarity-specificity'

// ── Security (5 checks) ──────────────────────────────────

export const CHECKS_SEC_A11Y: CheckDef[] = [
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
