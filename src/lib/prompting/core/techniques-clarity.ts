/**
 * @stsgs/prompting -- Clarity & Constraint Techniques (10/20)
 * First half of the techniques array.
 */

import type { PromptTechnique, OutputFormat } from './types'

export const clarityTechniques: PromptTechnique[] = [
  // ── Clarity ──────────────────────────────────────────────
  {
    id: 'explicit-instruction',
    name: 'Explicit Instruction',
    description:
      'State exactly what you want the model to do. Avoid vague requests. ' +
      'Specify the output format, length, style, and any constraints upfront. ' +
      'Ambiguity is the enemy of consistent results -- every unclear word ' +
      'gives the model freedom to choose a different path than you intended.',
    category: 'clarity',
    applicableTo: ['json', 'markdown', 'plain-text', 'code', 'html'] as OutputFormat[],
    difficulty: 'beginner',
    example:
      'BAD: "Tell me about React hooks."\n' +
      'GOOD: "Explain the 5 most commonly used React hooks. For each hook, provide: ' +
      '(1) name, (2) signature, (3) one-line purpose, (4) a 3-line code example. ' +
      'Format as a markdown table with columns: Hook | Signature | Purpose | Example."',
  },
  {
    id: 'role-assignment',
    name: 'Role Assignment',
    description:
      'Assign a specific role or persona to the model to frame its expertise and ' +
      'communication style. This narrows the response distribution to a domain-specific ' +
      'subset, dramatically improving accuracy for specialized tasks. The more specific ' +
      'the role, the more focused the output becomes.',
    category: 'role-play',
    applicableTo: ['markdown', 'plain-text', 'code', 'conversation'] as OutputFormat[],
    difficulty: 'beginner',
    example:
      'You are a senior TypeScript architect with 10 years of experience at a FAANG company. ' +
      'You specialize in type-safe API design using Zod and tRPC. Review the following code ' +
      'for type safety issues and suggest improvements.',
  },
  {
    id: 'few-shot',
    name: 'Few-Shot Learning',
    description:
      'Provide 2-5 examples of the desired input-output pattern before the actual request. ' +
      'The model uses in-context learning to infer the pattern from examples. More examples ' +
      'create stronger pattern locks but consume more tokens. Order matters: the last example ' +
      'has the strongest influence on output.',
    category: 'reasoning',
    applicableTo: ['json', 'code', 'yaml', 'table', 'list'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'Convert these product names to URL slugs:\n' +
      'Input: "Best Wireless Headphones 2024" -> Output: "best-wireless-headphones-2024"\n' +
      'Input: "Men\'s Running Shoes" -> Output: "mens-running-shoes"\n' +
      'Input: "Kids Toy Car Set" -> Output: "kids-toy-car-set"\n' +
      'Input: "Premium Organic Coffee Beans" -> ???',
  },
  {
    id: 'chain-of-thought',
    name: 'Chain of Thought',
    description:
      'Ask the model to reason step-by-step before giving the final answer. This forces ' +
      'the model to decompose complex problems into intermediate reasoning steps, which ' +
      'dramatically improves accuracy on math, logic, and multi-step tasks. The key insight: ' +
      'more thinking tokens = better final tokens.',
    category: 'chain-of-thought',
    applicableTo: ['plain-text', 'markdown', 'code'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'Solve this step by step:\n' +
      '1. First, identify what the question is asking.\n' +
      '2. List all given information and constraints.\n' +
      '3. Determine the approach/formula needed.\n' +
      '4. Execute the calculation.\n' +
      '5. Verify the answer makes sense.\n\n' +
      'Question: A store offers 30% off. An item originally costs $89.99. ' +
      'Sales tax is 8.5%. What is the final price?',
  },
  {
    id: 'structured-output',
    name: 'Structured Output Specification',
    description:
      'Define the exact output structure using JSON schemas, type definitions, or explicit ' +
      'format templates. This eliminates parsing ambiguity and makes the output directly ' +
      'consumable by downstream systems. Always include field descriptions and validation ' +
      'rules within the prompt itself.',
    category: 'formatting',
    applicableTo: ['json', 'yaml', 'code'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'Respond with ONLY valid JSON matching this schema:\n' +
      '{\n' +
      '  "component": string (PascalCase component name),\n' +
      '  "props": Array<{ name: string, type: string, required: boolean, default?: string }>,\n' +
      '  "imports": string[] (ES module import paths),\n' +
      '  "code": string (complete TSX code)\n' +
      '}\n\n' +
      'Create a ResponsiveImage component with src, alt, width, height, and optional priority props.',
  },
  // ── Reasoning ────────────────────────────────────────────
  {
    id: 'self-consistency',
    name: 'Self-Consistency Check',
    description:
      'Ask the model to solve the same problem multiple times with different reasoning paths, ' +
      'then select the most common answer. This exploits the observation that correct answers ' +
      'tend to cluster around a single solution while wrong answers diverge. In a single prompt, ' +
      'you can ask for 3 approaches and a consensus.',
    category: 'reasoning',
    applicableTo: ['plain-text', 'markdown'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'Solve this problem using 3 different approaches:\n' +
      'Approach A: Algebraic method\n' +
      'Approach B: Logical deduction\n' +
      'Approach C: Estimation and verification\n\n' +
      'After all 3 approaches, state which answer appears most consistently and why.',
  },
  {
    id: 'assumption-challenge',
    name: 'Assumption Challenge',
    description:
      'Explicitly ask the model to list its assumptions before answering, then challenge each ' +
      'assumption. This prevents the model from silently embedding unstated assumptions that ' +
      'may not match your intent. Particularly useful for design and architecture decisions ' +
      'where hidden assumptions lead to wrong solutions.',
    category: 'reasoning',
    applicableTo: ['plain-text', 'markdown'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'Before answering, list 5 assumptions you are making about this request. ' +
      'For each assumption, rate your confidence (high/medium/low). ' +
      'Then answer the question, noting which assumptions most affect your answer.',
  },
  {
    id: 'analogical-reasoning',
    name: 'Analogical Reasoning',
    description:
      'Frame the problem in terms of a familiar domain the model understands well. By mapping ' +
      'an unfamiliar problem onto a well-known structure, the model can apply proven solutions ' +
      'from the analogous domain. Works especially well when explaining complex concepts or ' +
      'generating creative solutions.',
    category: 'reasoning',
    applicableTo: ['plain-text', 'markdown', 'conversation'] as OutputFormat[],
    difficulty: 'intermediate',
    example:
      'Design a caching strategy for our API by analogy to a restaurant kitchen:\n' +
      '- The kitchen = our server\n' +
      '- Ingredients = database records\n' +
      '- Prep station = cache layer\n' +
      '- Orders = API requests\n\n' +
      'Map each restaurant concept to a caching concept and design the system.',
  },
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
]