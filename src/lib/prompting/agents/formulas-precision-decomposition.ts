/**
 * Cognitive Formulas — Part 2: Precision Focus + Perspective Taking
 * + Memory Augmentation + Self-Critique + Decomposition
 * Extracted from cognitive-formulas.ts for single-responsibility.
 */

import type { CognitiveFormula } from '../core/types'

export const precisionAndBeyondFormulas: CognitiveFormula[] = [
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
