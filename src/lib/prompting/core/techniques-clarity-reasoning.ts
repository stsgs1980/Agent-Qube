/**
 * @stsgs/prompting -- Clarity & Reasoning Techniques
 * 6 techniques: clarity, reasoning, chain-of-thought, formatting, role-play.
 */

import type { PromptTechnique, OutputFormat } from './types'

export const TECHNIQUES_CLARITY_REASONING: PromptTechnique[] = [
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
  // ── Reasoning (intermediate) ─────────────────────────────
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
]
