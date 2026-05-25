/**
 * Cognitive Formulas — Part 1: Bias Mitigation + Reasoning Enhancement
 * Extracted from cognitive-formulas.ts for single-responsibility.
 */

import type { CognitiveFormula } from '../core/types'

export const biasAndReasoningFormulas: CognitiveFormula[] = [
  // ── Bias Mitigation (3) ──────────────────────────────────
  {
    id: 'cf-anchoring-break',
    name: 'Anchoring Break',
    category: 'bias-mitigation',
    description: 'Counteracts anchoring bias by forcing the model to consider multiple starting points before converging. Without this, the model latches onto the first reasonable answer and rationalizes subsequent analysis to fit it.',
    pattern: 'First, consider 3 different approaches. Then evaluate each before choosing.',
    template: 'Before answering, generate 3 different approaches/interpretations:\n\n1. Conservative approach: {conservative}\n2. Moderate approach: {moderate}\n3. Aggressive approach: {aggressive}\n\nEvaluate all 3, then recommend the best with reasoning.',
    example: {
      input: 'How should we handle authentication?',
      output: '1. Conservative: Session-based auth with server-side sessions\n2. Moderate: JWT with short-lived tokens and refresh\n3. Aggressive: Passwordless with magic links\n\nEvaluation: ... Recommendation: JWT (moderate) balances security and UX.',
    },
  },
  {
    id: 'cf-confirmation-discount',
    name: 'Confirmation Discount',
    category: 'bias-mitigation',
    description: 'Reduces confirmation bias by explicitly asking the model to argue against its own conclusion. The model must provide reasons both FOR and AGAINST before settling on a final answer.',
    pattern: 'State your conclusion. Then argue against it. Then decide.',
    template: '1. State your initial conclusion about {topic}.\n2. Provide 3 reasons FOR this conclusion.\n3. Provide 3 reasons AGAINST this conclusion.\n4. Weigh both sides and give a final, balanced conclusion.',
    example: {
      input: 'Should we use microservices?',
      output: 'Initial: Yes, for scalability.\nFor: Scalability, independent deployment, tech flexibility.\nAgainst: Operational complexity, network latency, data consistency.\nFinal: Use modular monolith first, extract services when clear boundaries emerge.',
    },
  },
  {
    id: 'cf-status-quo-challenge',
    name: 'Status Quo Challenge',
    category: 'bias-mitigation',
    description: 'Forces the model to question default assumptions and the "obvious" solution. The status quo bias makes models favor familiar patterns even when better alternatives exist for the specific context.',
    pattern: 'What is the default approach? Why might it be wrong here?',
    template: 'The default/obvious approach to {problem} is {default}.\n\n1. List 3 assumptions this default relies on.\n2. For each assumption, explain when it is FALSE.\n3. Based on your specific context ({context}), is the default still the best choice?\n4. If not, what is the better alternative?',
    example: {
      input: 'Should we use a SQL database?',
      output: 'Default: PostgreSQL.\nAssumptions: (1) Structured data (2) ACID needed (3) Single region.\nWhen false: (1) Document data -> use NoSQL (2) Eventual OK -> use NoSQL.\nContext: Multi-region document store -> Recommendation: MongoDB.',
    },
  },

  // ── Reasoning Enhancement (3) ────────────────────────────
  {
    id: 'cf-first-principles',
    name: 'First Principles Analysis',
    category: 'reasoning-enhancement',
    description: 'Breaks a problem down to its fundamental truths and builds up from there. This prevents the model from reasoning by analogy (which can be misleading) and forces genuine understanding of the underlying mechanics.',
    pattern: 'What are the fundamental truths? What can we build from them?',
    template: 'Apply first principles thinking to {problem}:\n\n1. What is the fundamental goal? (Strip away all assumptions)\n2. What are the immovable constraints? (Physics, laws, hard limits)\n3. What are the flexible constraints? (Conventions, preferences, budgets)\n4. Building from fundamentals only, what is the simplest solution?\n5. How does this compare to the conventional approach?',
    example: {
      input: 'How should we structure our React app?',
      output: 'Fundamental goal: Render UI that responds to user actions.\nImmovable: React renders components, state triggers re-renders.\nFlexible: File structure, state management, styling.\nSimplest: Single file, local state. Scale: feature folders, shared state. Conventional: src/components, pages, hooks.',
    },
  },
  {
    id: 'cf-inversion',
    name: 'Inversion Thinking',
    category: 'reasoning-enhancement',
    description: 'Instead of asking "how do I achieve X?", ask "how would I guarantee NOT achieving X?" and then avoid those things. This surfaces failure modes that forward-thinking misses.',
    pattern: 'How would I guarantee failure? Now avoid that.',
    template: 'Instead of asking "how do we succeed at {goal}?", ask:\n\n"How would we GUARANTEE failure at {goal}?"\n\nList 5 ways to guarantee failure:\n1. {failure1}\n2. {failure2}\n3. {failure3}\n4. {failure4}\n5. {failure5}\n\nNow: What must we do to avoid each failure? What does this tell us about the path to success?',
    example: {
      input: 'How do we build a reliable API?',
      output: 'Guarantee failure: (1) No error handling (2) No input validation (3) No monitoring (4) No versioning (5) No tests.\nTo avoid: Add error boundaries, validate all input, set up monitoring, version from day 1, write tests first.',
    },
  },
  {
    id: 'cf-pre-mortem',
    name: 'Pre-Mortem Analysis',
    category: 'reasoning-enhancement',
    description: 'Imagine the project has already failed and work backwards to identify what went wrong. This is more effective than risk analysis because it bypasses optimism bias -- people are better at explaining past failures than predicting future ones.',
    pattern: 'The project failed. Why?',
    template: 'Imagine it is 6 months from now and {project} has FAILED.\n\n1. What was the #1 reason for failure?\n2. What early warning signs were ignored?\n3. What assumption proved to be false?\n4. What resource was underestimated?\n5. What could have been done differently at the start?\n\nFor each answer, specify a preventive action we can take NOW.',
    example: {
      input: 'Pre-mortem our migration to TypeScript',
      output: '#1 reason: Scope creep (trying to convert everything at once).\nWarning: File count growing faster than conversion rate.\nFalse assumption: "Developers will learn TS on the fly."\nUnderestimated: Refactoring time for type-compatible APIs.\nPrevention: Start with new files only, create adapters for existing code.',
    },
  },

  // ── Creativity Boost (3) ─────────────────────────────────
  {
    id: 'cf-constraint-creativity',
    name: 'Constraint-Driven Creativity',
    category: 'creativity-boost',
    description: 'Paradoxically, adding constraints increases creativity by forcing novel connections. A blank canvas produces generic solutions; tight constraints produce innovative ones. This formula adds artificial constraints to trigger creative thinking.',
    pattern: 'Solve it with these artificial constraints.',
    template: 'Solve {problem} under these ARTIFICIAL constraints:\n\n1. You cannot use {forbidden_technology}\n2. The solution must be under {size_limit}\n3. It must work without {missing_resource}\n4. You must use at least 3 different approaches combined\n5. The solution should be explainable to a 12-year-old\n\nAfter solving with constraints, show how removing each constraint changes the solution.',
    example: {
      input: 'Design a notification system',
      output: 'Constraints: No WebSocket, under 100 lines, no database, 3 approaches, explainable.\nSolution: Polling + localStorage + BroadcastChannel + Service Worker.\nRemove "no WebSocket": Simplify to single WebSocket connection.',
    },
  },
  {
    id: 'cf-random-input',
    name: 'Random Input Stimulus',
    category: 'creativity-boost',
    description: 'Introduces a random/unrelated concept and forces the model to find connections to the problem. This leverages the brain ability to find meaningful patterns in seemingly unrelated inputs (apophenia used constructively).',
    pattern: 'How is this like {random_concept}?',
    template: 'How is {problem} like a {random_concept}?\n\nFind at least 5 structural parallels:\n1. {parallel1}: In {random_concept}, {mechanism} is like {problem_aspect}\n2. {parallel2}: ...\n3. {parallel3}: ...\n4. {parallel4}: ...\n5. {parallel5}: ...\n\nBased on these parallels, what novel solution does {random_concept} suggest for {problem}?',
    example: {
      input: 'Problem: State management. Random: Water supply system.',
      output: '1. Reservoir = global store, pipes = selectors, taps = components.\n2. Pressure = re-render frequency.\n3. Valves = middleware.\n4. Water treatment = data transformation.\n5. Leak detection = debugging tools.\nNovel insight: Use "pressure valves" to throttle re-renders.',
    },
  },
  {
    id: 'cf-scamper',
    name: 'SCAMPER Technique',
    category: 'creativity-boost',
    description: 'Systematic creativity technique that applies 7 transformations to an existing solution: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse. Each transformation generates a variant that may be better than the original.',
    pattern: 'Apply SCAMPER transformations.',
    template: 'Apply SCAMPER to {existing_solution}:\n\nS - Substitute: What component/technology can be replaced with what?\nC - Combine: What two parts can be merged for synergy?\nA - Adapt: What from another domain can be adapted here?\nM - Modify: What can be enlarged, shrunk, or altered?\nP - Put to other use: How could this solve a different problem?\nE - Eliminate: What can be removed without losing value?\nR - Reverse: What if we did the exact opposite?\n\nRate each variant: Keep / Maybe / Discard.',
    example: {
      input: 'SCAMPER a standard login form',
      output: 'S: Password -> biometric. C: Login + registration. A: OAuth from social. M: One-tap login. P: Login as authentication for API. E: Remove password (magic link). R: Server authenticates client (mTLS).',
    },
  },
]
