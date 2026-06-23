/**
 * @stsgs/prompting -- Constraint, Formatting & Chain-of-Thought Techniques
 * 7 techniques: constraint, formatting, chain-of-thought (intermediate).
 */

import type { PromptTechnique, OutputFormat } from './types'

export const TECHNIQUES_CONST_FMT: PromptTechnique[] = [
  // ── Constraint ───────────────────────────────────────────
  {
    id: 'negative-constraint',
    name: 'Negative Constraint (Forbidden List)',
    description:
      'Explicitly state what the model must NOT do. Negative constraints are as important as ' +
      'positive instructions. Without them, models tend to include unnecessary elements like ' +
      'markdown formatting in JSON output, emoji in professional text, or boilerplate in code. ' +
      'Be specific about what is forbidden.',
    category: 'constraint',
    applicableTo: ['json', 'code', 'yaml', 'plain-text'] as OutputFormat[],
    difficulty: 'beginner',
    example:
      'Rules:\n' +
      '- DO NOT use emoji, special Unicode characters, or decorative elements\n' +
      '- DO NOT wrap the response in markdown code blocks\n' +
      '- DO NOT add explanations or commentary after the JSON\n' +
      '- DO NOT include any field not listed in the schema\n' +
      '- DO NOT use placeholder values (use null for missing data)',
  },
  {
    id: 'token-budget',
    name: 'Token Budget Constraint',
    description:
      'Set explicit length limits to force conciseness and focus. Without budget constraints, ' +
      'models tend to over-explain and pad responses. Specifying word counts, line limits, or ' +
      'character limits forces the model to prioritize the most important information. This ' +
      'improves signal-to-noise ratio dramatically.',
    category: 'constraint',
    applicableTo: ['plain-text', 'markdown', 'code', 'json'] as OutputFormat[],
    difficulty: 'beginner',
    example:
      'Explain microservices vs monoliths in exactly 3 sentences.\n' +
      'Sentence 1: Core difference (what changes architecturally).\n' +
      'Sentence 2: Trade-offs (when each is better).\n' +
      'Sentence 3: Decision criteria (how to choose).\n\n' +
      'Total: exactly 3 sentences, no more, no less.',
  },
  {
    id: 'output-masking',
    name: 'Output Masking (Redaction)',
    description:
      'Instruct the model to mask or redact sensitive information in its output. This is useful ' +
      'when processing logs, user data, or code that may contain secrets, PII, or credentials. ' +
      'Combine with negative constraints for maximum effectiveness. The model should replace ' +
      'sensitive values with consistent placeholders.',
    category: 'constraint',
    applicableTo: ['json', 'plain-text', 'code'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'Review this code for security issues. When showing the code in your response:\n' +
      '- Replace all API keys with [API_KEY_REDACTED]\n' +
      '- Replace all URLs containing credentials with [URL_REDACTED]\n' +
      '- Replace all email addresses with [EMAIL_REDACTED]\n' +
      '- Replace all file paths containing usernames with [PATH_REDACTED]',
  },
  // ── Formatting ───────────────────────────────────────────
  {
    id: 'delimiter-pattern',
    name: 'Delimiter Pattern',
    description:
      'Use clear delimiters (---, ###, XML tags) to separate different sections of the prompt ' +
      'and expected output. Delimiters help the model understand where instructions end and ' +
      'data begins. They also make prompts more readable for humans and easier to debug. ' +
      'Triple-dash or XML-style tags work best for section separation.',
    category: 'formatting',
    applicableTo: ['json', 'markdown', 'code', 'yaml', 'plain-text'] as OutputFormat[],
    difficulty: 'beginner',
    example:
      '<instructions>\n' +
      'Extract all error codes from the log below. Return JSON with fields: code, message, count.\n' +
      '</instructions>\n\n' +
      '<data>\n' +
      '[ERROR] E1001: Database connection failed (x15)\n' +
      '[WARN] E2003: Cache miss rate above threshold (x8)\n' +
      '</data>',
  },
  {
    id: 'xml-tag-structure',
    name: 'XML Tag Structure',
    description:
      'Wrap different prompt sections in semantic XML tags to give the model explicit ' +
      'structure. This technique is used in production prompt engineering at scale because ' +
      'it eliminates ambiguity about which part of the prompt is an instruction vs data vs ' +
      'context vs example. Tags can be nested for complex prompts.',
    category: 'formatting',
    applicableTo: ['json', 'code', 'yaml', 'markdown'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      '<role>You are a TypeScript code reviewer.</role>\n' +
      '<task>Review the code for type safety issues.</task>\n' +
      '<rules>\n' +
      '  <rule priority="critical">No `any` types allowed.</rule>\n' +
      '  <rule priority="high">All props must have explicit types.</rule>\n' +
      '</rules>\n' +
      '<code>${userCode}</code>',
  },
  // ── Chain-of-Thought (intermediate) ──────────────────────
  {
    id: 'least-to-most',
    name: 'Least-to-Most Prompting',
    description:
      'Decompose a complex problem into a series of increasingly complex subproblems. Solve the ' +
      'simplest subproblem first, then use that solution to inform the next. This bottom-up ' +
      'approach ensures the model has correct building blocks before attempting the full solution. ' +
      'Each subproblem should be independently verifiable.',
    category: 'chain-of-thought',
    applicableTo: ['code', 'plain-text', 'markdown'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'Build a URL parser incrementally:\n' +
      'Sub-problem 1: Extract the protocol (http/https) from a URL.\n' +
      'Sub-problem 2: Extract the hostname (using solution from step 1 as context).\n' +
      'Sub-problem 3: Extract the port number.\n' +
      'Sub-problem 4: Extract the path segments.\n' +
      'Sub-problem 5: Extract query parameters.\n' +
      'Final: Combine all into a single parseUrl(url: string) function.',
  },
  {
    id: 'plan-and-solve',
    name: 'Plan and Solve',
    description:
      'First, ask the model to create a detailed plan. Then, ask it to execute each plan step. ' +
      'This two-phase approach prevents the model from jumping to solutions without understanding ' +
      'the full scope. The planning phase should be separate from the execution phase -- do not ' +
      'let the model start solving while it is still planning.',
    category: 'chain-of-thought',
    applicableTo: ['markdown', 'code', 'plain-text'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'PHASE 1 - PLAN (do NOT write code yet):\n' +
      'Create a numbered plan for implementing user authentication with NextAuth.js.\n' +
      'Each step should be specific enough that a developer could implement it without guessing.\n\n' +
      'PHASE 2 - EXECUTE (only after plan is approved):\n' +
      'Implement each plan step in order. Show the code for each step.',
  },
]
