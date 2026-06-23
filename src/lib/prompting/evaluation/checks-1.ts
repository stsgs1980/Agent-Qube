/**
 * @stsgs/prompting -- Benchmark Checks Part 1 (20/40)
 * Categories: Clarity, Specificity, Context, Constraints
 */

export interface CheckDef {
  id: string
  category: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  /** Returns true if the check passes. */
  test: (prompt: string) => boolean
  /** Human-readable detail for the report. */
  detail: (prompt: string, passed: boolean) => string
}

export const CHECKS_PART1: CheckDef[] = [
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
    detail: (_, passed) => passed ? 'Explicit requirements found.' : 'Add requirement words (must, should, ensure) for stronger constraints.',
  },
  {
    id: 'SPEC-004', category: 'Specificity', severity: 'info',
    description: 'Includes at least one example',
    test: p => /\b(example|e\.g\.|for instance|like this|such as|sample|template)\b/i.test(p),
    detail: (_, passed) => passed ? 'Examples included for pattern matching.' : 'Consider adding an example to anchor the expected output pattern.',
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
    detail: (_, passed) => passed ? 'Role/persona assigned.' : 'Assign a role (e.g., "You are a senior engineer") for domain-specific responses.',
  },
  {
    id: 'CTXT-002', category: 'Context', severity: 'info',
    description: 'Specifies target audience',
    test: p => /\b(for (?:a|an|the|beginners?|experts?|developers?|users?|team|audience|clients?))\b/i.test(p),
    detail: (_, passed) => passed ? 'Target audience specified.' : 'Specify who the output is for (developers, beginners, end users, etc.).',
  },
  {
    id: 'CTXT-003', category: 'Context', severity: 'info',
    description: 'Provides environment or platform context',
    test: p => /\b(environment|production|development|staging|browser|server|client|mobile|desktop|cloud|local)\b/i.test(p),
    detail: (_, passed) => passed ? 'Environment/platform context provided.' : 'Add environment context (production, browser, server, etc.).',
  },
  {
    id: 'CTXT-004', category: 'Context', severity: 'info',
    description: 'Mentions existing constraints or prerequisites',
    test: p => /\b(already have|existing|current|using|built with|based on|runs on|depends on|constraint|limitation)\b/i.test(p),
    detail: (_, passed) => passed ? 'Existing context/constraints mentioned.' : 'Mention existing tools, constraints, or prerequisites for more relevant output.',
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