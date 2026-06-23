/**
 * Scoring dimension definitions — 6 evaluation dimensions.
 * Extracted from scoring.ts for single-responsibility.
 */

// ─── Dimension Definitions ───────────────────────────────────

export interface DimensionConfig {
  name: string
  weight: number
  description: string
  /** Pure function: prompt text -> 0-100 score + feedback */
  evaluate: (prompt: string) => { score: number; feedback: string }
}

export const DIMENSIONS: DimensionConfig[] = [
  {
    name: 'Specificity',
    weight: 0.25,
    description: 'How specific and unambiguous the prompt is.',
    evaluate(p) {
      let score = 30
      const feedback: string[] = []

      if (p.length > 200) { score += 15; feedback.push('Good length for detail.') }
      else if (p.length < 30) { score -= 10; feedback.push('Too short -- add more context.') }

      // Check for specific numbers/quantities
      if (/\d+/.test(p)) { score += 15; feedback.push('Includes quantitative specifics.') }
      else { feedback.push('Consider adding numbers (count, size, version).') }

      // Check for explicit requirements
      const requirementWords = ['must', 'should', 'require', 'exactly', 'specifically', 'ensure', 'include']
      const reqCount = requirementWords.filter(w => p.toLowerCase().includes(w)).length
      if (reqCount >= 2) { score += 15; feedback.push('Clear requirements specified.') }
      else if (reqCount === 0) { score -= 10; feedback.push('No explicit requirements found.') }

      // Check for format specification
      if (/json|yaml|markdown|table|list|xml/i.test(p)) { score += 15; feedback.push('Output format specified.') }

      // Check for examples
      if (/example|e\.g\.|for instance|like this/i.test(p)) { score += 10; feedback.push('Includes examples.') }

      return { score: Math.min(100, Math.max(0, score)), feedback: feedback.join(' ') }
    },
  },
  {
    name: 'Clarity',
    weight: 0.20,
    description: 'How easy it is to understand what the prompt asks for.',
    evaluate(p) {
      let score = 40
      const feedback: string[] = []

      // Check for single clear action verb at start
      const actionVerbs = ['create', 'generate', 'write', 'build', 'design', 'analyze', 'review', 'fix', 'explain', 'translate', 'summarize', 'convert', 'refactor', 'test', 'implement']
      const words = p.split(/\s+/)
      const firstVerb = words.find(w => actionVerbs.includes(w.toLowerCase()))
      if (firstVerb && words.indexOf(firstVerb) < 5) { score += 20; feedback.push(`Clear action verb "${firstVerb}" found near start.`) }
      else { feedback.push('Start with a clear action verb (create, generate, build, etc.).') }

      // Check sentence structure
      const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 5)
      if (sentences.length >= 2 && sentences.length <= 8) { score += 15; feedback.push('Well-structured sentence count.') }
      else if (sentences.length > 15) { score -= 10; feedback.push('Too many sentences -- consider structuring with headers.') }
      else if (sentences.length === 1 && p.length > 100) { score -= 10; feedback.push('Very long single sentence -- break into multiple sentences.') }

      // Check for sections/delimiters
      if (/#{1,3}\s|---|\n{2,}|<[a-z]+>|##/i.test(p)) { score += 15; feedback.push('Good use of structure/delimiters.') }

      // Check for ambiguous words
      const ambiguous = ['stuff', 'things', 'something', 'maybe', 'kind of', 'sort of', 'whatever']
      const ambigCount = ambiguous.filter(w => p.toLowerCase().includes(w)).length
      if (ambigCount === 0) { score += 10; feedback.push('No ambiguous language detected.') }
      else { score -= ambigCount * 8; feedback.push(`Found ${ambigCount} ambiguous word(s): ${ambiguous.filter(w => p.toLowerCase().includes(w)).join(', ')}.`) }

      return { score: Math.min(100, Math.max(0, score)), feedback: feedback.join(' ') }
    },
  },
  {
    name: 'Context',
    weight: 0.15,
    description: 'Whether the prompt provides sufficient background information.',
    evaluate(p) {
      let score = 25
      const feedback: string[] = []

      // Check for role/persona assignment
      if (/you are|as a|act as|role:|persona/i.test(p)) { score += 20; feedback.push('Role/persona assigned.') }
      else { feedback.push('Consider assigning a role (e.g., "You are a senior engineer").') }

      // Check for audience specification
      if (/for (?:a|an|the|beginners?|experts?|developers?|users?|team)/i.test(p)) { score += 15; feedback.push('Target audience specified.') }
      else { feedback.push('Specify who the output is for (audience/users).') }

      // Check for domain/context words
      const techDomains = ['react', 'typescript', 'javascript', 'python', 'api', 'database', 'sql', 'css', 'html', 'next\.?js', 'node', 'docker', 'aws', 'git']
      const domainCount = techDomains.filter(d => p.toLowerCase().includes(d)).length
      if (domainCount >= 2) { score += 20; feedback.push('Rich domain context provided.') }
      else if (domainCount === 0) { feedback.push('Add domain context (technologies, frameworks, tools).') }

      // Check for constraint/boundary specification
      if (/constraint|limit|must not|cannot|only|except|unless/i.test(p)) { score += 10; feedback.push('Constraints/boundaries specified.') }

      // Check for environment context
      if (/environment|production|development|staging|browser|server|client/i.test(p)) { score += 10; feedback.push('Environment context provided.') }

      return { score: Math.min(100, Math.max(0, score)), feedback: feedback.join(' ') }
    },
  },
  {
    name: 'Completeness',
    weight: 0.15,
    description: 'Whether all necessary information is present for a complete response.',
    evaluate(p) {
      let score = 30
      const feedback: string[] = []

      // Check for all W-questions context
      const hasWhat = /what|which|which type/i.test(p)
      const hasHow = /how|approach|method|steps?|process/i.test(p)
      const hasWhy = /why|because|reason|purpose|goal/i.test(p)
      const wCount = [hasWhat, hasHow, hasWhy].filter(Boolean).length

      if (wCount >= 2) { score += 25; feedback.push('Multiple dimensions covered (what/how/why).') }
      else if (wCount === 1) { score += 10; feedback.push('Only one dimension covered -- add more context.') }
      else { feedback.push('Specify what, how, and why to improve completeness.') }

      // Check for edge case handling
      if (/edge case|error|exception|failure|fallback|boundary|corner case/i.test(p)) { score += 15; feedback.push('Edge cases considered.') }
      else { feedback.push('Consider mentioning edge cases or error handling.') }

      // Check for input/output specification
      const hasInput = /input|given|provided|data|source|from/i.test(p)
      const hasOutput = /output|return|result|produce|generate|create/i.test(p)
      if (hasInput && hasOutput) { score += 15; feedback.push('Both input and output specified.') }
      else if (!hasOutput) { feedback.push('Specify expected output format/structure.') }

      // Check for acceptance criteria
      if (/should|must|criteria|acceptance|requirement|validate/i.test(p)) { score += 15; feedback.push('Acceptance criteria present.') }

      return { score: Math.min(100, Math.max(0, score)), feedback: feedback.join(' ') }
    },
  },
  {
    name: 'Constraint Control',
    weight: 0.15,
    description: 'Whether the prompt effectively constrains the output space.',
    evaluate(p) {
      let score = 25
      const feedback: string[] = []

      // Check for negative constraints
      const negPatterns = [/do not|don't|must not|never|no {1,2}\w/i, /forbidden|prohibited|avoid|skip|without|exclude/i]
      const negCount = negPatterns.filter(pattern => pattern.test(p)).length
      if (negCount >= 2) { score += 25; feedback.push('Strong negative constraints defined.') }
      else if (negCount === 1) { score += 10; feedback.push('Some negative constraints present.') }
      else { feedback.push('Add negative constraints (what NOT to do) to reduce hallucination.') }

      // Check for explicit format control
      if (/format:|as json|as markdown|as html|structured|schema/i.test(p)) { score += 15; feedback.push('Explicit format control.') }

      // Check for length/size constraints
      if (/\d+\s*(words?|lines?|chars?|sentences?|items?)|maximum|min|max|limit/i.test(p)) { score += 15; feedback.push('Quantitative constraints specified.') }

      // Check for style/tone constraints
      if (/tone:|style:|formal|casual|professional|technical|creative/i.test(p)) { score += 10; feedback.push('Tone/style constraints present.') }

      // Check for scope limitation
      if (/only|just|focus on|specifically|limited to/i.test(p)) { score += 10; feedback.push('Scope is well-defined.') }

      return { score: Math.min(100, Math.max(0, score)), feedback: feedback.join(' ') }
    },
  },
  {
    name: 'Actionability',
    weight: 0.10,
    description: 'How directly the prompt leads to a useful, implementable response.',
    evaluate(p) {
      let score = 35
      const feedback: string[] = []

      // Check for concrete deliverables
      const deliverables = [/code|function|component|class|api|endpoint/i, /document|report|article|guide|tutorial/i, /list|table|schema|diagram|chart/i]
      const delivCount = deliverables.filter(d => d.test(p)).length
      if (delivCount >= 1) { score += 20; feedback.push('Concrete deliverable specified.') }
      else { feedback.push('Specify the exact deliverable (function, component, document, etc.).') }

      // Check for verifiable criteria
      if (/test|verify|validate|check|assert|should pass/i.test(p)) { score += 15; feedback.push('Verifiable success criteria present.') }

      // Check for real-world applicability
      if (/production|deploy|production-ready|production grade/i.test(p)) { score += 10; feedback.push('Production-ready requirement ensures quality.') }

      // Check for step-by-step request
      if (/step by step|incremental|first.*then|1\.\s|phase/i.test(p)) { score += 10; feedback.push('Structured approach requested.') }

      // Check against anti-patterns
      const antiPatterns = [/quickly|asap|fast/i, /roughly|approximately|about/i]
      const antiCount = antiPatterns.filter(a => a.test(p)).length
      if (antiCount > 0) { score -= antiCount * 10; feedback.push('Avoid urgency words -- they reduce output quality.') }

      return { score: Math.min(100, Math.max(0, score)), feedback: feedback.join(' ') }
    },
  },
]
