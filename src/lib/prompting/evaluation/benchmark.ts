/**
 * @stsgs/prompting -- CORE-EEAT Benchmark Engine
 * 40 automated checks for prompt quality across 8 categories.
 * EEAT = Expertise, Experience, Authority, Trustworthiness.
 */

import type { BenchmarkResult, BenchmarkCheck, Grade } from '../core/types'
import { numericToGrade } from './scoring'

// ─── Check Definitions ───────────────────────────────────────

interface CheckDef {
  id: string
  category: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  /** Returns true if the check passes. */
  test: (prompt: string) => boolean
  /** Human-readable detail for the report. */
  detail: (prompt: string, passed: boolean) => string
}

const CHECKS: CheckDef[] = [
  // ── Clarity (5 checks) ──────────────────────────────────
  {
    id: 'CLAR-001', category: 'Clarity', severity: 'critical',
    description: 'Prompt starts with an action verb',
    test: p => /^(create|generate|write|build|design|analyze|review|fix|explain|translate|summarize|convert|refactor|test|implement|extract|optimize|update|configure|deploy|debug|describe|list|compare|find|show|help|check|validate|calculate)/i.test(p.trim()),
    detail: (p, passed) => passed
      ? `Starts with action verb: "${p.trim().split(/\s+/)[0]}"`
      : 'Does not start with an action verb. Begin with: create, generate, build, write, etc.',
  },
  {
    id: 'CLAR-002', category: 'Clarity', severity: 'warning',
    description: 'No ambiguous words (stuff, things, something, maybe)',
    test: p => !/\b(stuff|things|something|maybe|kind of|sort of|whatever|whichever|somehow)\b/i.test(p),
    detail: (_, passed) => passed ? 'No ambiguous words detected.' : 'Contains ambiguous words that reduce precision.',
  },
  {
    id: 'CLAR-003', category: 'Clarity', severity: 'warning',
    description: 'Sentences are under 40 words on average',
    test: p => {
      const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 3)
      if (sentences.length === 0) return false
      const avgWords = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length
      return avgWords <= 40
    },
    detail: (p, passed) => {
      const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 3)
      const avgWords = sentences.length > 0
        ? Math.round(sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length)
        : 0
      return passed ? `Average sentence length: ${avgWords} words.` : `Average sentence length: ${avgWords} words (target: <=40).`
    },
  },
  {
    id: 'CLAR-004', category: 'Clarity', severity: 'info',
    description: 'Uses structural delimiters (headers, lists, code blocks)',
    test: p => /#{1,3}\s|[-*]\s|\d+\.\s|```|<[a-z]+>|---|\n{2,}/i.test(p),
    detail: (_, passed) => passed ? 'Good use of structural elements.' : 'Consider adding headers, lists, or code blocks for structure.',
  },
  {
    id: 'CLAR-005', category: 'Clarity', severity: 'info',
    description: 'Prompt is under 2000 characters',
    test: p => p.length <= 2000,
    detail: (p, passed) => passed ? `Length: ${p.length} chars.` : `Length: ${p.length} chars (target: <=2000). Consider splitting into chained prompts.`,
  },

  // ── Specificity (5 checks) ──────────────────────────────
  {
    id: 'SPEC-001', category: 'Specificity', severity: 'critical',
    description: 'Includes quantitative specifics (numbers, sizes, counts)',
    test: p => /\d+/.test(p),
    detail: (p, passed) => {
      const numbers = p.match(/\d+/g)
      return passed ? `Found ${numbers?.length ?? 0} quantitative value(s).` : 'No numbers found. Add specific counts, sizes, or versions.'
    },
  },
  {
    id: 'SPEC-002', category: 'Specificity', severity: 'warning',
    description: 'Specifies output format (JSON, markdown, code, etc.)',
    test: p => /\b(json|yaml|xml|markdown|html|table|list|code|csv|text|plain)\b/i.test(p),
    detail: (p, passed) => {
      const formats = p.match(/\b(json|yaml|xml|markdown|html|table|list|code|csv|text|plain)\b/gi)
      return passed ? `Output format specified: ${formats?.join(', ')}` : 'No output format specified. Add: "Return as JSON" or similar.'
    },
  },
  {
    id: 'SPEC-003', category: 'Specificity', severity: 'warning',
    description: 'Uses explicit requirement words (must, should, require)',
    test: p => /\b(must|should|shall|require|required|ensure|exactly|specifically|mandatory)\b/i.test(p),
    detail: (_, passed) => passed ? 'Explicit requirements found.' : 'Add requirement words (must, should, ensure) for stronger constraints.'
  },
  {
    id: 'SPEC-004', category: 'Specificity', severity: 'info',
    description: 'Includes at least one example',
    test: p => /\b(example|e\.g\.|for instance|like this|such as|sample|template)\b/i.test(p),
    detail: (_, passed) => passed ? 'Examples included for pattern matching.' : 'Consider adding an example to anchor the expected output pattern.'
  },
  {
    id: 'SPEC-005', category: 'Specificity', severity: 'info',
    description: 'Names specific technologies or frameworks',
    test: p => /\b(react|next\.?js|typescript|javascript|python|node|tailwind|prisma|postgres|docker|aws|graphql|rest|api|css|html)\b/i.test(p),
    detail: (p, passed) => {
      const tech = p.match(/\b(react|next\.?js|typescript|javascript|python|node|tailwind|prisma|postgres|docker|aws|graphql|rest|api|css|html)\b/gi)
      return passed ? `Technologies mentioned: ${tech?.join(', ')}` : 'Consider naming specific technologies for more targeted output.'
    },
  },

  // ── Context (5 checks) ───────────────────────────────────
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

// ─── Public API ──────────────────────────────────────────────

/**
 * Run the full CORE-EEAT benchmark (40 checks) on a prompt.
 *
 * @param prompt - The prompt text to benchmark
 * @returns BenchmarkResult with total score, grade, and per-check details
 */
export function runBenchmark(prompt: string): BenchmarkResult {
  const checks: BenchmarkCheck[] = CHECKS.map(check => {
    const passed = check.test(prompt)
    return {
      id: check.id,
      category: check.category,
      description: check.description,
      passed,
      severity: check.severity,
      details: check.detail(prompt, passed),
    }
  })

  const passed = checks.filter(c => c.passed).length
  const failed = checks.length - passed
  const score = Math.round((passed / checks.length) * 100)
  const grade = numericToGrade(score)

  return {
    totalChecks: checks.length,
    passed,
    failed,
    score,
    grade,
    checks,
  }
}

/**
 * Run a quick benchmark (critical checks only).
 * Useful for real-time feedback where full benchmark is too slow.
 */
export function quickBenchmark(prompt: string): { score: number; grade: Grade; criticalPassed: number; criticalTotal: number } {
  const criticalChecks = CHECKS.filter(c => c.severity === 'critical')
  const results = criticalChecks.map(c => ({ check: c, passed: c.test(prompt) }))
  const passed = results.filter(r => r.passed).length
  const score = Math.round((passed / criticalChecks.length) * 100)
  return { score, grade: numericToGrade(score), criticalPassed: passed, criticalTotal: criticalChecks.length }
}

/**
 * Get checks for a specific category.
 */
export function getChecksByCategory(category: string): BenchmarkCheck[] {
  return CHECKS.filter(c => c.category === category).map(check => ({
    id: check.id,
    category: check.category,
    description: check.description,
    passed: false,
    severity: check.severity,
    details: '',
  }))
}

/**
 * Get all benchmark categories.
 */
export function getBenchmarkCategories(): string[] {
  return Array.from(new Set(CHECKS.map(c => c.category)))
}

export { CHECKS }
