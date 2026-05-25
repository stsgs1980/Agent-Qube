/**
 * @stsgs/prompting -- Advanced Techniques
 * 7 techniques: advanced difficulty level.
 */

import type { PromptTechnique, OutputFormat } from './types'

export const TECHNIQUES_ADVANCED: PromptTechnique[] = [
  // ── Reasoning (advanced) ─────────────────────────────────
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
  // ── Role-Play (advanced) ─────────────────────────────────
  {
    id: 'adversarial-reviewer',
    name: 'Adversarial Reviewer',
    description:
      'Assign a model the role of a harsh critic who must find flaws in a given solution, code, ' +
      'or design. This technique exploits the model\'s ability to analyze from multiple perspectives ' +
      'and often surfaces issues that a single-pass review misses. The adversarial framing forces ' +
      'the model to look for problems rather than validate assumptions.',
    category: 'role-play',
    applicableTo: ['markdown', 'plain-text', 'code'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'You are a senior security auditor who has seen thousands of vulnerabilities. ' +
      'Your job is to find EVERY possible flaw in this authentication flow. ' +
      'Be harsh. Assume the attacker is skilled and motivated. ' +
      'Rate each issue as Critical / High / Medium / Low with a concrete attack scenario.',
  },
  {
    id: 'stakeholder-simulation',
    name: 'Stakeholder Simulation',
    description:
      'Ask the model to adopt multiple stakeholder personas and give each one\'s perspective on ' +
      'a decision or design. This surfaces conflicting requirements early and helps find solutions ' +
      'that satisfy multiple constituencies. Each stakeholder should have a distinct voice, ' +
      'priority set, and concern focus.',
    category: 'role-play',
    applicableTo: ['markdown', 'conversation'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'Discuss this API design decision from 4 perspectives:\n' +
      '1. Frontend Developer (wants simple, typed responses)\n' +
      '2. Backend Engineer (wants performance and scalability)\n' +
      '3. Product Manager (wants flexibility for future features)\n' +
      '4. Security Engineer (wants minimal attack surface)\n\n' +
      'Each stakeholder gives their verdict: Approve / Reject / Approve with conditions.',
  },
  // ── Meta (advanced) ──────────────────────────────────────
  {
    id: 'meta-prompting',
    name: 'Meta-Prompting (Prompt for Prompt)',
    description:
      'Ask the model to generate or improve a prompt before executing it. This two-step ' +
      'process leverages the model\'s understanding of what makes effective prompts. In step 1, ' +
      'the model creates an optimized prompt. In step 2, that prompt is used (manually or ' +
      'automatically) to get the final result. Works best for complex, multi-step tasks.',
    category: 'meta',
    applicableTo: ['plain-text', 'markdown'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'I want to create a prompt that will generate a comprehensive REST API specification. ' +
      'First, generate the BEST possible prompt for this task. Your prompt should include ' +
      'role, context, constraints, output format, and examples. Output ONLY the prompt, ' +
      'ready to be pasted into a new conversation.',
  },
  {
    id: 'prompt-chaining',
    name: 'Prompt Chaining',
    description:
      'Break a complex task into a sequence of smaller prompts, where each prompt\'s output ' +
      'feeds into the next. This prevents context window overflow and allows each step to ' +
      'focus on a single responsibility. Chain boundaries should align with natural task ' +
      'boundaries. Store intermediate results to avoid recomputation.',
    category: 'meta',
    applicableTo: ['json', 'code', 'markdown', 'plain-text'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'Chain: Design -> Implement -> Test -> Review\n' +
      'Step 1: "Design the database schema for a project management app. Output SQL."\n' +
      'Step 2 (input: Step 1 output): "Generate TypeScript types matching this schema."\n' +
      'Step 3 (input: Step 2 output): "Write Zod validators for these types."\n' +
      'Step 4 (input: Step 3 output): "Review all 3 outputs for consistency."',
  },
  // ── Chain-of-Thought (advanced) ──────────────────────────
  {
    id: 'tree-of-thought',
    name: 'Tree of Thought',
    description:
      'Ask the model to explore multiple reasoning paths in parallel (like a search tree), ' +
      'evaluate each path, and backtrack if a path leads to a dead end. This is more powerful ' +
      'than linear chain-of-thought because it allows the model to recover from wrong reasoning ' +
      'directions. Best for problems with branching decision trees.',
    category: 'chain-of-thought',
    applicableTo: ['plain-text', 'markdown'] as OutputFormat[],
    difficulty: 'advanced',
    example:
      'Explore 3 possible approaches to this architecture decision:\n\n' +
      'Path A: Microservices with event-driven communication\n' +
      '  - Pros: ...\n' +
      '  - Cons: ...\n' +
      '  - Verdict: Continue or Abandon?\n\n' +
      'Path B: Modular monolith with shared libraries\n' +
      '  - Pros: ...\n' +
      '  - Cons: ...\n' +
      '  - Verdict: Continue or Abandon?\n\n' +
      'Path C: Serverless functions per domain\n' +
      '  - Pros: ...\n' +
      '  - Cons: ...\n' +
      '  - Verdict: Continue or Abandon?\n\n' +
      'Select the best path and explain why.',
  },
]
