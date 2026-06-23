/**
 * @stsgs/prompting -- 8 Flow Templates
 * Multi-step conversation flows for complex AI interactions.
 * Each flow defines a sequence of steps with validation and looping.
 */

import type { FlowTemplate } from '../core/types'

const flowTemplates: FlowTemplate[] = [
  {
    id: 'iterative-refinement',
    name: 'Iterative Refinement',
    description:
      'Generate an initial solution, then iteratively refine it based on feedback. ' +
      'The loop continues until the user is satisfied or max iterations are reached. ' +
      'Each iteration should improve upon the previous version, not start from scratch.',
    steps: [
      { role: 'user', template: 'Describe what you need: {task_description}', waitFor: 'input' },
      { role: 'assistant', template: 'I will create {deliverable}. Here is my initial version:\n\n{output}', waitFor: 'auto', validation: { type: 'length', rule: '100', errorMessage: 'Initial output must be at least 100 characters.' } },
      { role: 'user', template: 'Rate this version (1-10) and provide specific feedback for improvement, or type "done" if satisfied.', waitFor: 'input' },
      { role: 'assistant', template: 'Based on your feedback, here is the improved version ({iteration}/{max}):\n\nChanges made:\n- {change1}\n- {change2}\n\n{output}', waitFor: 'auto' },
    ],
    loopPoint: 2,
    maxIterations: 5,
  },
  {
    id: 'code-review-cycle',
    name: 'Code Review Cycle',
    description:
      'Submit code for review, receive structured feedback, fix issues, and resubmit. ' +
      'The cycle continues until no Critical or High issues remain. Each review focuses on ' +
      'different aspects: correctness, performance, security, readability.',
    steps: [
      { role: 'user', template: 'Submit code for review:\n\n```\n{code}\n```\n\nContext: {context}', waitFor: 'input' },
      { role: 'assistant', template: '## Code Review Results\n\n### Issues Found\n{issues_table}\n\n### Summary\nOverall quality: {grade}/10\nMust-fix issues: {critical_count}\nRecommended fixes: {high_count}', waitFor: 'auto', validation: { type: 'keywords', rule: ['Critical', 'High', 'Medium', 'Low'], errorMessage: 'Review must include severity ratings.' } },
      { role: 'user', template: 'Here is the updated code addressing the review feedback:\n\n```\n{code}\n```\n\nChanges: {changes_summary}', waitFor: 'input' },
      { role: 'assistant', template: '## Re-Review Results\n\n### Previous Issues\n{resolved_table}\n\n### New Issues\n{new_issues}\n\n### Verdict: {approved/rejected}', waitFor: 'auto' },
    ],
    loopPoint: 2,
    maxIterations: 4,
  },
  {
    id: 'requirements-to-code',
    name: 'Requirements to Code',
    description:
      'A 5-step pipeline from natural language requirements to tested, documented code. ' +
      'Each step must be approved before proceeding to the next. This flow ensures ' +
      'requirements are understood before any code is written.',
    steps: [
      { role: 'user', template: 'Requirements: {requirements}', waitFor: 'input' },
      { role: 'assistant', template: '## Step 1: Understanding\n\nI understand you need:\n{parsed_requirements}\n\n### Clarification Questions\n{questions}\n\nPlease confirm or correct my understanding.', waitFor: 'confirmation' },
      { role: 'user', template: '{confirmation_or_corrections}', waitFor: 'input' },
      { role: 'assistant', template: '## Step 2: Design\n\n### Architecture\n{architecture}\n\n### Data Model\n{data_model}\n\n### API Surface\n{api_surface}\n\nDoes this design look correct?', waitFor: 'confirmation' },
      { role: 'assistant', template: '## Step 3: Implementation\n\n{code}\n\n## Step 4: Tests\n\n{tests}\n\n## Step 5: Documentation\n\n{docs}', waitFor: 'auto' },
    ],
    maxIterations: 1,
  },
  {
    id: 'debug-session',
    name: 'Debug Session',
    description:
      'Structured debugging flow that follows the scientific method. Each hypothesis ' +
      'is tested before moving on. The flow ensures the root cause is found, not just symptoms.',
    steps: [
      { role: 'user', template: 'Bug report:\n- What happened: {symptom}\n- Expected: {expected}\n- Environment: {environment}\n- Code: {relevant_code}\n- Error: {error_message}', waitFor: 'input' },
      { role: 'assistant', template: '## Bug Analysis\n\n### Reproduction Steps\n1. {step1}\n2. {step2}\n\n### Hypothesis\n{hypothesis}\n\n### Suggested Verification\n{verification_steps}\n\nPlease run the verification and report results.', waitFor: 'confirmation' },
      { role: 'user', template: 'Verification results:\n{results}', waitFor: 'input' },
      { role: 'assistant', template: '## Diagnosis\n\n### Root Cause\n{root_cause}\n\n### Fix\n```{fix_code}```\n\n### Prevention\n{prevention}', waitFor: 'auto' },
    ],
    maxIterations: 3,
  },
  {
    id: 'knowledge-extraction',
    name: 'Knowledge Extraction',
    description:
      'Extract structured knowledge from unstructured text. Each pass focuses on a ' +
      'different type of entity or relationship. The loop refines the extraction based ' +
      'on what was found in previous passes.',
    steps: [
      { role: 'user', template: 'Extract knowledge from:\n\n{text}', waitFor: 'input' },
      { role: 'assistant', template: '## Extraction Pass {n}\n\n### Entities Found\n{entities}\n\n### Relationships\n{relationships}\n\n### Confidence\n{confidence_assessment}\n\n### Missing Information\n{gaps}', waitFor: 'auto', validation: { type: 'length', rule: '50', errorMessage: 'Extraction must contain substantial findings.' } },
      { role: 'user', template: 'Focus deeper on: {area_of_interest}', waitFor: 'input' },
      { role: 'assistant', template: '## Deep Extraction: {area}\n\n### Detailed Analysis\n{detailed_findings}\n\n### Connections\n{connections}\n\n### Summary\n{summary}', waitFor: 'auto' },
    ],
    loopPoint: 2,
    maxIterations: 3,
  },
  {
    id: 'multi-perspective-analysis',
    name: 'Multi-Perspective Analysis',
    description:
      'Analyze a topic from multiple expert perspectives, then synthesize a combined view. ' +
      'Each perspective adds unique insights that the others miss. The final synthesis ' +
      'resolves conflicts and identifies consensus points.',
    steps: [
      { role: 'user', template: 'Analyze this topic from multiple perspectives:\n\n{topic}', waitFor: 'input' },
      { role: 'assistant', template: '## Perspective 1: {role1}\n{analysis1}\n\n## Perspective 2: {role2}\n{analysis2}\n\n## Perspective 3: {role3}\n{analysis3}', waitFor: 'auto' },
      { role: 'user', template: 'Which perspective is most relevant? Any other perspectives to consider?', waitFor: 'input' },
      { role: 'assistant', template: '## Synthesis\n\n### Consensus Points\n{consensus}\n\n### Conflicts\n{conflicts}\n\n### Recommendation\n{recommendation}', waitFor: 'auto' },
    ],
    maxIterations: 1,
  },
  {
    id: 'data-pipeline',
    name: 'Data Processing Pipeline',
    description:
      'Step-by-step data processing: validate input, transform, aggregate, analyze, output. ' +
      'Each step validates its input before proceeding, ensuring data quality throughout.',
    steps: [
      { role: 'user', template: 'Process this data:\n\n{raw_data}\n\nTask: {processing_goal}', waitFor: 'input' },
      { role: 'assistant', template: '## Step 1: Validation\n\nRecords received: {count}\nValid records: {valid_count}\nInvalid records: {invalid_count}\nInvalid reasons: {reasons}\n\nProceeding with {valid_count} valid records.', waitFor: 'auto', validation: { type: 'keywords', rule: ['Valid', 'Invalid'], errorMessage: 'Must include validation results.' } },
      { role: 'assistant', template: '## Step 2: Transformation\n\n{transformed_data}\n\n## Step 3: Aggregation\n\n{aggregated_data}\n\n## Step 4: Analysis\n\n{analysis}\n\n## Step 5: Output\n\n{final_output}', waitFor: 'auto' },
    ],
    maxIterations: 1,
  },
  {
    id: 'interactive-tutorial',
    name: 'Interactive Tutorial',
    description:
      'A teaching flow that explains a concept, shows an example, gives an exercise, ' +
      'and reviews the answer. The loop adapts difficulty based on the learner performance.',
    steps: [
      { role: 'user', template: 'Teach me about: {topic}\nMy level: {beginner/intermediate/advanced}', waitFor: 'input' },
      { role: 'assistant', template: '## Lesson: {topic}\n\n### Concept\n{explanation}\n\n### Example\n{example}\n\n### Key Takeaways\n- {point1}\n- {point2}\n\nReady for an exercise?', waitFor: 'confirmation' },
      { role: 'user', template: '{exercise_attempt}', waitFor: 'input' },
      { role: 'assistant', template: '## Review\n\n### Your Answer\n{answer_evaluation}\n\n### Correct Approach\n{correct_solution}\n\n### Score: {score}/10\n\n{next_step_or_more_practice}', waitFor: 'auto' },
    ],
    loopPoint: 2,
    maxIterations: 5,
  },
]

// ─── Public API ──────────────────────────────────────────────

/** Get all flow templates. */
export function getFlowTemplates(): FlowTemplate[] {
  return flowTemplates
}

/** Get a specific flow template by ID. */
export function getFlowTemplate(id: string): FlowTemplate | undefined {
  return flowTemplates.find(f => f.id === id)
}

/** Get the current step prompt for a flow at a given iteration. */
export function getFlowStepPrompt(flowId: string, stepIndex: number, vars: Record<string, string>): string | null {
  const flow = getFlowTemplate(flowId)
  if (!flow || stepIndex >= flow.steps.length) return null

  let template = flow.steps[stepIndex].template
  for (const [key, value] of Object.entries(vars)) {
    template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return template
}

/** Check if a flow has more steps or should loop back. */
export function shouldContinueFlow(flowId: string, currentStep: number, iteration: number): boolean {
  const flow = getFlowTemplate(flowId)
  if (!flow) return false

  if (flow.loopPoint !== undefined && currentStep === flow.steps.length) {
    if (flow.maxIterations !== undefined && iteration >= flow.maxIterations) return false
    return true
  }
  return currentStep < flow.steps.length
}

export { flowTemplates }
