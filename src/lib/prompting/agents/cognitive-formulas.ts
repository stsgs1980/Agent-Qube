/**
 * @stsgs/prompting -- 20 Cognitive Formulas
 * Structured patterns that enhance AI reasoning by applying
 * cognitive science principles to prompt construction.
 */

import type { CognitiveFormula, CognitiveCategory } from '../core/types'

const formulas: CognitiveFormula[] = [
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

  // ── Precision Focus (3) ──────────────────────────────────
  {
    id: 'cf-precision-drill',
    name: 'Precision Drill',
    category: 'precision-focus',
    description: 'Forces the model to be maximally specific by replacing vague terms with precise ones. Works by identifying vague language patterns and requiring the model to substitute each with concrete, measurable alternatives.',
    pattern: 'Replace every vague term with a specific one.',
    template: 'In your response about {topic}, follow these precision rules:\n\n1. Replace "good" with specific quality metric\n2. Replace "fast" with specific response time\n3. Replace "simple" with specific complexity measure\n4. Replace "better" with specific improvement delta\n5. Replace "appropriate" with specific criteria\n6. Every claim needs a number or a concrete example\n7. Every recommendation needs a measurable success criterion',
    example: {
      input: 'Make the database queries faster',
      output: 'Replace "faster" with "reduce p95 from 800ms to under 200ms".\nTechniques: (1) Add composite index on (user_id, created_at) -- estimated 60% reduction. (2) Implement query result caching with 60s TTL. (3) Use EXPLAIN ANALYZE to identify sequential scans.\nSuccess: p95 < 200ms measured over 1000 requests.',
    },
  },
  {
    id: 'cf-definition-lock',
    name: 'Definition Lock',
    category: 'precision-focus',
    description: 'Locks down key term definitions before the model starts reasoning. This prevents the model from silently redefining terms mid-response, which is a common source of confusion and incorrect outputs.',
    pattern: 'Define all key terms first, then proceed.',
    template: 'Before answering about {topic}, define these terms precisely:\n\n1. "{term1}" means: {definition}\n2. "{term2}" means: {definition}\n3. "{term3}" means: {definition}\n\nUse ONLY these definitions throughout your response. If you need to use a term differently, state the redefinition explicitly.',
    example: {
      input: 'Discuss performance optimization',
      output: 'Definitions: "Performance" = time from request to last byte (TTFB + processing + transfer). "Optimization" = measurable reduction in p99 latency without increasing error rate. "Acceptable" = p99 < 500ms, error rate < 0.1%.',
    },
  },
  {
    id: 'cf-boundary-check',
    name: 'Boundary Check',
    category: 'precision-focus',
    description: 'Explicitly tests the boundaries of the model knowledge and confidence. By asking the model to state what it does NOT know, we prevent hallucination and get more honest, useful responses.',
    pattern: 'What do you NOT know about this?',
    template: 'Before answering about {topic}, state:\n\n1. What you KNOW with high confidence (backed by evidence)\n2. What you SUSPECT but cannot confirm\n3. What you DO NOT KNOW and cannot determine from the given information\n4. What ADDITIONAL INFORMATION would change your answer\n\nThen provide your answer, clearly marking which parts are confident vs speculative.',
    example: {
      input: 'Design a caching strategy',
      output: 'KNOW: Redis is faster than database reads (evidence: benchmarks).\nSUSPECT: 5-minute TTL is optimal for this use case (no data).\nDO NOT KNOW: Current traffic patterns, read/write ratio, memory budget.\nADDITIONAL: Cache hit ratio, memory limit, eviction policy preference.\nAnswer: [with confidence markers on each recommendation].',
    },
  },

  // ── Perspective Taking (2) ───────────────────────────────
  {
    id: 'cf-stakeholder-map',
    name: 'Stakeholder Perspective Map',
    category: 'perspective-taking',
    description: 'Forces the model to consider the same decision from multiple stakeholder viewpoints. Each stakeholder has different priorities, constraints, and success criteria. The model must reconcile conflicting viewpoints.',
    pattern: 'How would different stakeholders view this?',
    template: 'Consider {decision} from these stakeholder perspectives:\n\n1. {stakeholder1} (priority: {p1})\n   - Opinion: {opinion}\n   - Concern: {concern}\n\n2. {stakeholder2} (priority: {p2})\n   - Opinion: {opinion}\n   - Concern: {concern}\n\n3. End user (priority: ease of use)\n   - Opinion: {opinion}\n   - Concern: {concern}\n\nWhere do they agree? Where do they conflict?\nWhat decision satisfies the most critical needs?',
    example: {
      input: 'Should we add dark mode?',
      output: 'Developer (priority: code simplicity): Extra CSS variables, maintenance cost. Designer (priority: visual quality): Needs full color redesign, not just inversion. User (priority: comfort): Reduces eye strain at night. Agreement: Users want it. Conflict: Effort vs impact. Decision: Add with CSS variables, phase 1 = system preference.',
    },
  },
  {
    id: 'cf-time-machine',
    name: 'Time Machine Perspective',
    category: 'perspective-taking',
    description: 'Asks the model to evaluate a decision from different time horizons: immediate, 6 months, 2 years, 5 years. This prevents over-optimizing for the short term and reveals long-term consequences of seemingly good decisions.',
    pattern: 'How will this look in 6 months? 2 years? 5 years?',
    template: 'Evaluate {decision} across time horizons:\n\nIMMEDIATE (this week):\n- Benefit: {short_term_benefit}\n- Cost: {short_term_cost}\n\n6 MONTHS:\n- Will this still be valuable?\n- What maintenance will it need?\n- What might we regret?\n\n2 YEARS:\n- Will this scale?\n- Will the technology still be relevant?\n- What will be harder because of this decision?\n\n5 YEARS:\n- Will this be a competitive advantage or technical debt?\n- Is there a more future-proof alternative?\n\nRecommendation: {final}',
    example: {
      input: 'Time machine: choosing MongoDB vs PostgreSQL',
      output: 'Immediate: MongoDB faster to set up, flexible schema. 6mo: Schema migration pain if structure changes. 2yr: PostgreSQL ecosystem richer, tooling better. 5yr: SQL skills more transferable, PostgreSQL advancing faster. Recommendation: PostgreSQL for structured data, add MongoDB only if document flexibility is critical.',
    },
  },

  // ── Memory Augmentation (2) ──────────────────────────────
  {
    id: 'cf-accumulation-register',
    name: 'Accumulation Register',
    category: 'memory-augmentation',
    description: 'Maintains a running summary of key facts and decisions throughout a multi-turn conversation. The model periodically updates its "register" to prevent context drift and inconsistency in long conversations.',
    pattern: 'Update the fact register after each step.',
    template: 'FACT REGISTER (update after each step):\n| # | Fact/Decision | Source | Confidence |\n|---|---------------|--------|------------|\n| 1 | {fact1} | {source} | High |\n\nAfter each response:\n1. Check if any new facts were established\n2. Check if any previous facts were contradicted\n3. Update the register\n4. Flag any inconsistencies',
    example: {
      input: 'Multi-step API design session',
      output: '| 1 | API uses REST | Step 1 | High |\n| 2 | Auth via JWT | Step 2 | High |\n| 3 | Rate limit: 100/min | Step 3 | Medium |\nStep 4 update: Added pagination requirement. No contradictions.',
    },
  },
  {
    id: 'cf-context-window',
    name: 'Context Window Management',
    category: 'memory-augmentation',
    description: 'Explicitly structures the conversation to manage the context window efficiently. Early, low-value content is summarized and compressed to make room for more relevant information in later turns.',
    pattern: 'Summarize previous context, then continue.',
    template: 'CONTEXT SUMMARY (to manage conversation length):\n- Established: {key_decisions}\n- Discarded: {rejected_approaches}\n- Current state: {current_focus}\n- Open questions: {unresolved}\n\nContinue from: {current_focus}\nNew input: {new_request}',
    example: {
      input: 'After 10 turns of design discussion',
      output: 'ESTABLISHED: React + TypeScript, Zustand for state, shadcn/ui components.\nDISCARDED: Redux (too complex), Context API (prop drilling).\nCURRENT: Designing the settings page layout.\nOPEN: Dark mode approach (CSS vars vs class toggle).\nContinue from: Settings page layout.',
    },
  },

  // ── Self-Critique (2) ────────────────────────────────────
  {
    id: 'cf-self-audit',
    name: 'Self-Audit Protocol',
    category: 'self-critique',
    description: 'After generating a response, the model audits its own output against a checklist of quality criteria. This catches errors, omissions, and quality issues before the user sees them.',
    pattern: 'Generate, then audit against checklist.',
    template: 'After generating your response, perform this self-audit:\n\n1. ACCURACY: Are all facts verifiable? Any claims that might be wrong?\n2. COMPLETENESS: Did I address all parts of the request?\n3. CLARITY: Could any part be misunderstood?\n4. RELEVANCE: Is everything directly related to the question?\n5. CONSISTENCY: Are there any internal contradictions?\n\nFor each item, rate: Pass / Needs Fix / Fail\nFix any Fail items before finalizing.',
    example: {
      input: 'Self-audit after code generation',
      output: '1. ACCURACY: Pass (used documented APIs only).\n2. COMPLETENESS: Needs Fix (missing error handling for network timeout).\n3. CLARITY: Pass (variable names are descriptive).\n4. RELEVANCE: Pass (no unnecessary abstractions).\n5. CONSISTENCY: Pass (naming convention consistent).\nFix: Adding try-catch with timeout handling.',
    },
  },
  {
    id: 'cf-devils-advocate',
    name: "Devil's Advocate",
    category: 'self-critique',
    description: 'After presenting a solution, the model argues the opposite case with equal conviction. This stress-tests the recommendation and gives the user a balanced view they can use to make their own decision.',
    pattern: 'Present solution, then argue against it.',
    template: 'PART A - THE CASE FOR:\nRecommendation: {recommendation}\nReasoning:\n1. {reason1}\n2. {reason2}\n3. {reason3}\nEvidence: {evidence}\n\nPART B - THE CASE AGAINST (Devil\'s Advocate):\nCounter-argument: {counter}\nRisks:\n1. {risk1}\n2. {risk2}\nWhen this would fail: {failure_scenario}\n\nPART C - VERDICT:\n{balanced_verdict}',
    example: {
      input: 'Should we adopt microservices?',
      output: 'FOR: Scalability, independent deploys, tech flexibility.\nAGAINST: Operational overhead, network complexity, data consistency challenges.\nWHEN FAILS: Small team (<5), simple domain, early-stage startup.\nVERDICT: Start monolith, extract services when team > 5 and clear domain boundaries exist.',
    },
  },

  // ── Decomposition (2) ────────────────────────────────────
  {
    id: 'cf-functional-decomposition',
    name: 'Functional Decomposition',
    category: 'decomposition',
    description: 'Breaks a complex system into independent functional blocks with clear interfaces. Each block has a single responsibility, defined inputs/outputs, and can be implemented and tested independently.',
    pattern: 'Decompose into independent functional blocks.',
    template: 'Decompose {system} into functional blocks:\n\nFor each block:\n- Name: {block_name}\n- Responsibility: {single_responsibility}\n- Input: {input_spec}\n- Output: {output_spec}\n- Dependencies: {other_blocks_it_needs}\n- Tests: {how_to_verify}\n\nDraw the dependency graph. Identify blocks with zero dependencies (start here).',
    example: {
      input: 'Decompose a user registration system',
      output: 'Block 1: InputValidator (deps: none) -> validates form data.\nBlock 2: DuplicateChecker (deps: DB) -> checks existing users.\nBlock 3: PasswordHasher (deps: none) -> hashes password.\nBlock 4: UserCreator (deps: 2, 3) -> creates DB record.\nBlock 5: EmailSender (deps: 4) -> sends welcome email.\nStart: Block 1, 3 (no deps).',
    },
  },
  {
    id: 'cf- abstraction-layers',
    name: 'Abstraction Layers',
    category: 'decomposition',
    description: 'Organizes a system into layers of abstraction, from highest-level concepts to lowest-level implementation details. Each layer only knows about the layer directly below it, enforcing clean separation of concerns.',
    pattern: 'Define abstraction layers from high to low.',
    template: 'Define 4 abstraction layers for {system}:\n\nLAYER 4 - USER FACING:\nWhat the user sees and does: {user_interaction}\n\nLAYER 3 - BUSINESS LOGIC:\nRules and decisions: {business_rules}\n\nLAYER 2 - DATA ACCESS:\nHow data is stored and retrieved: {data_operations}\n\nLAYER 1 - INFRASTRUCTURE:\nLow-level implementation: {infrastructure}\n\nInterface between each layer: {contracts}',
    example: {
      input: 'Abstraction layers for a task manager',
      output: 'L4: Task list UI, drag-and-drop, filters.\nL3: Task CRUD, due dates, assignment rules, notifications.\nL2: Task queries, batch updates, search indexing.\nL1: Database connection, query builder, migrations.\nContracts: L4<->L3 = useTaskActions(), L3<->L2 = TaskRepository interface.',
    },
  },
]

// ─── Public API ──────────────────────────────────────────────

/** Get all cognitive formulas. */
export function getCognitiveFormulas(): CognitiveFormula[] {
  return formulas
}

/** Get formulas by category. */
export function getFormulasByCategory(category: CognitiveCategory): CognitiveFormula[] {
  return formulas.filter(f => f.category === category)
}

/** Get a specific formula by ID. */
export function getCognitiveFormula(id: string): CognitiveFormula | undefined {
  return formulas.find(f => f.id === id)
}

/** Apply a formula template with variable substitution. */
export function applyFormula(id: string, vars: Record<string, string>): string | null {
  const formula = getCognitiveFormula(id)
  if (!formula) return null

  let result = formula.template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}

/** Get all cognitive categories. */
export function getCognitiveCategories(): CognitiveCategory[] {
  return Array.from(new Set(formulas.map(f => f.category)))
}

export { formulas }
