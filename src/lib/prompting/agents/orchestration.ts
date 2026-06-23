/**
 * @stsgs/prompting -- 12 Orchestration Patterns
 * Multi-agent coordination patterns for complex AI workflows.
 * Each pattern defines how multiple agents collaborate to solve a task.
 */

import type { OrchestrationPattern, OrchestrationStep } from '../core/types'

const patterns: OrchestrationPattern[] = [
  {
    id: 'sequential-chain',
    name: 'Sequential Chain',
    description:
      'Agents process in a fixed sequence, each receiving the previous agent output. ' +
      'The simplest and most predictable pattern. Best when tasks have a natural order ' +
      'and each step builds on the previous one. No parallelism, but maximum control.',
    agentCount: 3,
    topology: 'sequential',
    steps: [
      { agentRole: 'Planner', inputFrom: '*', outputTo: 1, promptTemplate: 'Analyze the request and create a detailed plan:\n\n{input}\n\nOutput a numbered list of tasks.' },
      { agentRole: 'Coder', inputFrom: 0, outputTo: 2, promptTemplate: 'Implement the following plan:\n\n{input}\n\nGenerate complete, production-ready code.' },
      { agentRole: 'Reviewer', inputFrom: 1, outputTo: '*', promptTemplate: 'Review this implementation for correctness, edge cases, and best practices:\n\n{input}\n\nProvide specific issues and fixes.' },
    ],
    useCase: 'Code generation with planning and review phases.',
  },
  {
    id: 'parallel-experts',
    name: 'Parallel Experts',
    description:
      'Multiple agents analyze the same input simultaneously, each from a different perspective. ' +
      'An aggregator agent merges their outputs into a final result. Best when you need diverse ' +
      'viewpoints on a single problem. Trades speed for breadth of analysis.',
    agentCount: 4,
    topology: 'parallel',
    steps: [
      { agentRole: 'Security Expert', inputFrom: '*', outputTo: 3, promptTemplate: 'Analyze this from a security perspective:\n\n{input}\n\nFocus on vulnerabilities, data exposure, and attack vectors.' },
      { agentRole: 'Performance Expert', inputFrom: '*', outputTo: 3, promptTemplate: 'Analyze this from a performance perspective:\n\n{input}\n\nFocus on bottlenecks, optimization opportunities, and scalability.' },
      { agentRole: 'UX Expert', inputFrom: '*', outputTo: 3, promptTemplate: 'Analyze this from a UX perspective:\n\n{input}\n\nFocus on usability, accessibility, and user experience.' },
      { agentRole: 'Aggregator', inputFrom: [0, 1, 2], outputTo: '*', aggregation: 'merge', promptTemplate: 'Synthesize these expert analyses into a unified report:\n\nSecurity: {input_0}\n\nPerformance: {input_1}\n\nUX: {input_2}\n\nPrioritize findings by severity and resolve any conflicts.' },
    ],
    useCase: 'Comprehensive code/system review from multiple angles.',
  },
  {
    id: 'hierarchical-delegate',
    name: 'Hierarchical Delegate',
    description:
      'A manager agent decomposes a task into subtasks and delegates to specialist agents. ' +
      'Each specialist works independently, then the manager reviews and integrates. Best ' +
      'for complex tasks that can be naturally decomposed into independent sub-problems.',
    agentCount: 4,
    topology: 'hierarchical',
    steps: [
      { agentRole: 'Manager', inputFrom: '*', outputTo: [1, 2], promptTemplate: 'Decompose this task into independent subtasks:\n\n{input}\n\nAssign each subtask to a specialist. Output format:\nSubtask 1 (for {specialist}): {description}\nSubtask 2 (for {specialist}): {description}' },
      { agentRole: 'Frontend Specialist', inputFrom: 0, outputTo: 3, promptTemplate: 'Complete your assigned subtask:\n\n{input}\n\nGenerate production-ready code with types.' },
      { agentRole: 'Backend Specialist', inputFrom: 0, outputTo: 3, promptTemplate: 'Complete your assigned subtask:\n\n{input}\n\nGenerate production-ready code with types.' },
      { agentRole: 'Manager (Review)', inputFrom: [1, 2], outputTo: '*', aggregation: 'chain', promptTemplate: 'Review and integrate the subtask outputs:\n\nFrontend: {input_1}\n\nBackend: {input_2}\n\nEnsure consistency, fix integration issues, and produce the final deliverable.' },
    ],
    useCase: 'Full-stack feature development with frontend/backend split.',
  },
  {
    id: 'debate-adversarial',
    name: 'Debate Adversarial',
    description:
      'Two agents with opposing perspectives argue about a solution. A judge agent evaluates ' +
      'both arguments and makes a final decision. Best for decisions with no clear right answer ' +
      'where exploring multiple sides leads to better outcomes.',
    agentCount: 3,
    topology: 'mesh',
    steps: [
      { agentRole: 'Advocate (Pro)', inputFrom: '*', outputTo: 2, promptTemplate: 'Make the strongest possible case FOR this approach:\n\n{input}\n\nInclude evidence, examples, and address potential counterarguments.' },
      { agentRole: 'Advocate (Con)', inputFrom: '*', outputTo: 2, promptTemplate: 'Make the strongest possible case AGAINST this approach:\n\n{input}\n\nIdentify risks, hidden costs, and better alternatives.' },
      { agentRole: 'Judge', inputFrom: [0, 1], outputTo: '*', aggregation: 'select-best', promptTemplate: 'Evaluate both sides and make a decision:\n\nPro: {input_0}\n\nCon: {input_1}\n\nVerdict: {for/against/compromise} with detailed reasoning.' },
    ],
    useCase: 'Architecture decisions, technology selection, go/no-go evaluations.',
  },
  {
    id: 'map-reduce',
    name: 'Map-Reduce',
    description:
      'A coordinator agent distributes work items across worker agents (map phase), then ' +
      'aggregates their results (reduce phase). Best for processing large datasets or many ' +
      'similar items that can be handled independently.',
    agentCount: 3,
    topology: 'hierarchical',
    steps: [
      { agentRole: 'Coordinator', inputFrom: '*', outputTo: 1, promptTemplate: 'Split this into N independent work items:\n\n{input}\n\nEach item should be self-contained and processable independently.' },
      { agentRole: 'Worker', inputFrom: 0, outputTo: 2, promptTemplate: 'Process this work item:\n\n{input}\n\nFollow the standard format for your output.' },
      { agentRole: 'Reducer', inputFrom: 1, outputTo: '*', aggregation: 'merge', promptTemplate: 'Aggregate these worker outputs into a unified result:\n\n{input}\n\nDeduplicate, sort, and summarize key findings.' },
    ],
    useCase: 'Batch processing, data analysis, content generation at scale.',
  },
  {
    id: 'iterative-refinement-loop',
    name: 'Iterative Refinement Loop',
    description:
      'A generator creates an initial solution, then a critic provides feedback, and the ' +
      'generator refines. This loop continues until quality threshold is met or max iterations ' +
      'are reached. Best for tasks where quality improves with iteration.',
    agentCount: 2,
    topology: 'sequential',
    steps: [
      { agentRole: 'Generator', inputFrom: '*', outputTo: 1, promptTemplate: 'Create a {deliverable} for:\n\n{input}\n\nFocus on correctness and completeness.' },
      { agentRole: 'Critic', inputFrom: 0, outputTo: 0, aggregation: 'chain', promptTemplate: 'Review this {deliverable} and provide specific improvement feedback:\n\n{input}\n\nRate overall quality: {score}/10. List issues by priority.' },
    ],
    useCase: 'Content creation, code quality improvement, design refinement.',
  },
  {
    id: 'pipeline-etl',
    name: 'Pipeline (Extract-Transform-Load)',
    description:
      'A linear pipeline where each agent performs one transformation on the data. Data flows ' +
      'through stages like water through pipes. Best for data processing, ETL workflows, and ' +
      'content transformation chains.',
    agentCount: 4,
    topology: 'sequential',
    steps: [
      { agentRole: 'Extractor', inputFrom: '*', outputTo: 1, promptTemplate: 'Extract structured data from:\n\n{input}\n\nOutput as JSON with consistent field names.' },
      { agentRole: 'Validator', inputFrom: 0, outputTo: 2, promptTemplate: 'Validate this extracted data:\n\n{input}\n\nCheck: required fields, data types, value ranges. Flag invalid records.' },
      { agentRole: 'Transformer', inputFrom: 1, outputTo: 3, promptTemplate: 'Transform this validated data:\n\n{input}\n\nApply: normalization, enrichment, formatting per the schema.' },
      { agentRole: 'Loader', inputFrom: 2, outputTo: '*', promptTemplate: 'Format this transformed data for the target system:\n\n{input}\n\nOutput in the required format with proper encoding.' },
    ],
    useCase: 'Data migration, format conversion, content pipelines.',
  },
  {
    id: 'ensemble-voting',
    name: 'Ensemble Voting',
    description:
      'Multiple agents solve the same problem independently, then vote on the best answer. ' +
      'Works like random forest in ML -- individual agents may be wrong, but the ensemble ' +
      'is more reliable. Best for tasks where consistency matters more than creativity.',
    agentCount: 4,
    topology: 'parallel',
    steps: [
      { agentRole: 'Solver A', inputFrom: '*', outputTo: 3, promptTemplate: 'Solve this problem independently:\n\n{input}\n\nProvide your answer with confidence level (high/medium/low).' },
      { agentRole: 'Solver B', inputFrom: '*', outputTo: 3, promptTemplate: 'Solve this problem independently:\n\n{input}\n\nProvide your answer with confidence level (high/medium/low).' },
      { agentRole: 'Solver C', inputFrom: '*', outputTo: 3, promptTemplate: 'Solve this problem independently:\n\n{input}\n\nProvide your answer with confidence level (high/medium/low).' },
      { agentRole: 'Voter', inputFrom: [0, 1, 2], outputTo: '*', aggregation: 'vote', promptTemplate: 'Tally the votes:\n\nSolver A: {input_0}\nSolver B: {input_1}\nSolver C: {input_2}\n\nMajority answer: {answer}\nConfidence: {agreement_level}' },
    ],
    useCase: 'Answer validation, classification, decision making with uncertainty.',
  },
  {
    id: 'round-robin-sprint',
    name: 'Round-Robin Sprint',
    description:
      'Agents take turns contributing to a shared output. Each agent adds its expertise to ' +
      'the growing result. Best for collaborative creation where each agent has a unique ' +
      'contribution (e.g., code + tests + docs + review).',
    agentCount: 4,
    topology: 'round-robin',
    steps: [
      { agentRole: 'Architect', inputFrom: '*', outputTo: 1, promptTemplate: 'Design the architecture for:\n\n{input}\n\nDefine interfaces, data flow, and key decisions.' },
      { agentRole: 'Developer', inputFrom: 0, outputTo: 2, promptTemplate: 'Implement the architecture:\n\n{input}\n\nWrite production-ready code following the defined interfaces.' },
      { agentRole: 'Tester', inputFrom: 1, outputTo: 3, promptTemplate: 'Write tests for this implementation:\n\n{input}\n\nCover: happy paths, edge cases, error scenarios.' },
      { agentRole: 'Documenter', inputFrom: [0, 1, 2], outputTo: '*', aggregation: 'merge', promptTemplate: 'Create documentation based on:\n\nArchitecture: {input_0}\nCode: {input_1}\nTests: {input_2}\n\nInclude: API docs, usage examples, and troubleshooting.' },
    ],
    useCase: 'Complete feature delivery: design, implement, test, document.',
  },
  {
    id: 'diamond-diverge-converge',
    name: 'Diamond (Diverge-Converge)',
    description:
      'Starts narrow (understand the problem), diverges (explore multiple solutions), then ' +
      'converges (select the best). This diamond shape ensures both exploration and ' +
      'decisiveness. Best for innovative problem-solving where the best solution is not obvious.',
    agentCount: 3,
    topology: 'hierarchical',
    steps: [
      { agentRole: 'Analyst', inputFrom: '*', outputTo: 1, promptTemplate: 'Deeply analyze this problem:\n\n{input}\n\nDefine: requirements, constraints, success criteria, and key trade-offs.' },
      { agentRole: 'Explorer', inputFrom: 0, outputTo: 2, promptTemplate: 'Based on this analysis, generate 3+ diverse solution approaches:\n\n{input}\n\nFor each: describe the approach, pros, cons, and effort estimate.' },
      { agentRole: 'Decider', inputFrom: 1, outputTo: '*', aggregation: 'select-best', promptTemplate: 'Evaluate these solutions against the criteria and select the best:\n\n{input}\n\nDecision matrix and final recommendation.' },
    ],
    useCase: 'Innovation, architecture exploration, technology evaluation.',
  },
  {
    id: 'feedback-collector',
    name: 'Feedback Collector',
    description:
      'One agent generates output, multiple reviewer agents provide feedback, then the ' +
      'original agent revises. This is like a code review process but automated. Best when ' +
      'quality requires multiple rounds of review from different perspectives.',
    agentCount: 4,
    topology: 'mesh',
    steps: [
      { agentRole: 'Author', inputFrom: '*', outputTo: [1, 2], promptTemplate: 'Create {deliverable}:\n\n{input}\n\nMake it production-ready and complete.' },
      { agentRole: 'Reviewer A', inputFrom: 0, outputTo: 3, promptTemplate: 'Review from a correctness perspective:\n\n{input}\n\nList issues as: [line/section] - [issue] - [fix]' },
      { agentRole: 'Reviewer B', inputFrom: 0, outputTo: 3, promptTemplate: 'Review from a best practices perspective:\n\n{input}\n\nList improvements as: [area] - [suggestion] - [priority]' },
      { agentRole: 'Author (Revise)', inputFrom: [1, 2], outputTo: '*', aggregation: 'chain', promptTemplate: 'Revise based on all feedback:\n\nCorrectness: {input_1}\n\nBest practices: {input_2}\n\nApply all valid feedback. Explain what you changed and why.' },
    ],
    useCase: 'High-quality content creation, critical code modules.',
  },
  {
    id: 'supervisor-workers',
    name: 'Supervisor with Worker Pool',
    description:
      'A supervisor agent manages a pool of identical worker agents. It distributes tasks, ' +
      'monitors progress, handles failures, and collects results. Best for embarrassingly ' +
      'parallel workloads where each item is independent.',
    agentCount: 3,
    topology: 'hierarchical',
    steps: [
      { agentRole: 'Supervisor', inputFrom: '*', outputTo: 1, promptTemplate: 'Split this work into N equal tasks for parallel processing:\n\n{input}\n\nFor each task: define scope, dependencies (none), and expected output.' },
      { agentRole: 'Worker', inputFrom: 0, outputTo: 2, promptTemplate: 'Process this task independently:\n\n{input}\n\nFollow the standard output format.' },
      { agentRole: 'Supervisor (Collect)', inputFrom: 1, outputTo: '*', aggregation: 'merge', promptTemplate: 'Collect and verify all worker outputs:\n\n{input}\n\nCheck completeness, deduplicate, and produce the final aggregate result.' },
    ],
    useCase: 'Batch processing, test generation, content batch creation.',
  },
]

// ─── Public API ──────────────────────────────────────────────

/** Get all orchestration patterns. */
export function getOrchestrationPatterns(): OrchestrationPattern[] {
  return patterns
}

/** Get a pattern by ID. */
export function getOrchestrationPattern(id: string): OrchestrationPattern | undefined {
  return patterns.find(p => p.id === id)
}

/** Get patterns by topology type. */
export function getPatternsByTopology(topology: OrchestrationPattern['topology']): OrchestrationPattern[] {
  return patterns.filter(p => p.topology === topology)
}

/** Get the step sequence for a pattern, rendered with actual prompts. */
export function renderPatternSteps(patternId: string, input: string): OrchestrationStep[] {
  const pattern = getOrchestrationPattern(patternId)
  if (!pattern) return []

  return pattern.steps.map(step => ({
    ...step,
    promptTemplate: step.promptTemplate.replace('{input}', input),
  }))
}

export { patterns }
