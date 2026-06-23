/**
 * @stsgs/prompting -- Framework Data
 * 11 Prompting Framework definitions.
 */

import type { PromptFramework } from './types'

export const frameworks: PromptFramework[] = [
  {
    id: 'rtf',
    name: 'Role-Task-Format',
    acronym: 'RTF',
    description:
      'The simplest and most versatile framework. Assign a role, define the task, and ' +
      'specify the expected output format. RTF works for 80% of everyday prompting needs. ' +
      'Its strength is simplicity -- three clear sections that the model can parse without ' +
      'ambiguity. Use it as the default framework and switch to more specialized ones only ' +
      'when RTF is insufficient.',
    steps: [
      { label: 'Role', description: 'Who is the AI acting as?', required: true, placeholder: 'You are a senior {domain} engineer...' },
      { label: 'Task', description: 'What should the AI do?', required: true, placeholder: '{Action verb} {specific deliverable} for {target audience}...' },
      { label: 'Format', description: 'How should the output be structured?', required: true, placeholder: 'Respond as {format}. Include {sections}...' },
    ],
    bestFor: ['Code generation', 'Content writing', 'Data extraction', 'API design', 'Documentation'],
    complexity: 'simple',
  },
  {
    id: 'rise',
    name: 'Role-Input-Steps-Expectation',
    acronym: 'RISE',
    description:
      'Extends RTF by explicitly listing the input data and the step-by-step process the model ' +
      'should follow. This is ideal when the task involves processing specific data or following ' +
      'a known procedure. The Steps section acts as a lightweight chain-of-thought, guiding the ' +
      'model through a predictable reasoning path.',
    steps: [
      { label: 'Role', description: 'Expert persona for the task.', required: true, placeholder: 'You are a {domain} specialist with {years} years of experience.' },
      { label: 'Input', description: 'What data/context is being provided.', required: true, placeholder: 'Here is the {data type}: ...' },
      { label: 'Steps', description: 'Step-by-step process to follow.', required: true, placeholder: '1. First, ...\n2. Then, ...\n3. Finally, ...' },
      { label: 'Expectation', description: 'Expected output format and quality criteria.', required: true, placeholder: 'Return a {format} with {criteria}...' },
    ],
    bestFor: ['Data processing', 'Report generation', 'Code review', 'Testing', 'Migration scripts'],
    complexity: 'simple',
  },
  {
    id: 'create',
    name: 'Context-Request-Explanation-Action-Tone-Extras',
    acronym: 'CREATE',
    description:
      'A comprehensive framework for content creation tasks. It explicitly addresses the ' +
      'creative context, explains WHY the content is needed (not just what), and sets the ' +
      'emotional tone. The Extras section catches edge cases like SEO requirements, word ' +
      'limits, brand voice guidelines, and accessibility considerations.',
    steps: [
      { label: 'Context', description: 'Background situation and audience.', required: true, placeholder: 'We are launching {product} for {audience}...' },
      { label: 'Request', description: 'Specific content to be created.', required: true, placeholder: 'Write a {type} that {goal}...' },
      { label: 'Explanation', description: 'Why this content is needed (purpose).', required: false, placeholder: 'This will be used for {channel} to achieve {metric}...' },
      { label: 'Action', description: 'What the reader should do after consuming.', required: false, placeholder: 'The reader should {call-to-action}...' },
      { label: 'Tone', description: 'Voice and emotional register.', required: true, placeholder: 'Tone: {adjective}. Style: {adjective}.' },
      { label: 'Extras', description: 'Additional constraints (SEO, length, brand).', required: false, placeholder: 'Max {N} words. Include keywords: {list}...' },
    ],
    bestFor: ['Blog posts', 'Marketing copy', 'Email campaigns', 'Social media', 'Product descriptions'],
    complexity: 'moderate',
  },
  {
    id: 'care',
    name: 'Context-Action-Result-Example',
    acronym: 'CARE',
    description:
      'A compact framework optimized for getting specific, actionable results. The Example ' +
      'step is the key differentiator -- it anchors the model to a concrete output pattern, ' +
      'reducing hallucination and format drift. CARE is especially effective when you need ' +
      'consistent output across multiple prompts with varying inputs.',
    steps: [
      { label: 'Context', description: 'Minimal background needed for the task.', required: true, placeholder: 'We have a {system} that {does what}...' },
      { label: 'Action', description: 'Exact operation to perform.', required: true, placeholder: 'Convert {input format} to {output format}...' },
      { label: 'Result', description: 'Expected output format description.', required: true, placeholder: 'A JSON object with fields: {list}...' },
      { label: 'Example', description: 'Concrete input/output example.', required: true, placeholder: 'Input: "x" -> Output: {"field": "y"}' },
    ],
    bestFor: ['Data transformation', 'Format conversion', 'API response design', 'Configuration generation'],
    complexity: 'simple',
  },
  {
    id: 'trace',
    name: 'Task-Request-Action-Context-Example',
    acronym: 'TRACE',
    description:
      'Task-first framework that puts the primary objective at the very top, ensuring the model ' +
      'never loses sight of what it needs to deliver. The Request section adds specificity to the ' +
      'Task, while Context and Example provide grounding. TRACE works well when prompts are long ' +
      'and the model might get distracted by secondary details.',
    steps: [
      { label: 'Task', description: 'One-sentence summary of what needs to be done.', required: true, placeholder: 'Generate a {deliverable} for {purpose}.' },
      { label: 'Request', description: 'Detailed requirements and constraints.', required: true, placeholder: 'Requirements:\n- {req1}\n- {req2}\n...' },
      { label: 'Action', description: 'Specific steps the model should take.', required: false, placeholder: '1. Analyze...\n2. Generate...\n3. Validate...' },
      { label: 'Context', description: 'Background information and constraints.', required: false, placeholder: 'Tech stack: {list}. Audience: {who}.' },
      { label: 'Example', description: 'Reference output to match quality/style.', required: false, placeholder: 'Here is a similar output for reference: ...' },
    ],
    bestFor: ['Complex code generation', 'System design', 'Architecture decisions', 'Multi-page documentation'],
    complexity: 'moderate',
  },
  {
    id: 'scope',
    name: 'Specific-Context-Objective-Persona-Execution',
    acronym: 'SCOPE',
    description:
      'Engineer-oriented framework that emphasizes specificity and execution details. The Specific ' +
      'section forces you to quantify requirements (exact numbers, precise formats). The Execution ' +
      'section breaks the task into verifiable steps. SCOPE is designed for technical tasks where ' +
      'vagueness leads to bugs and rework.',
    steps: [
      { label: 'Specific', description: 'Quantified, precise requirements.', required: true, placeholder: 'Generate exactly {N} {items}. Each must have {specific fields}...' },
      { label: 'Context', description: 'Technical environment and constraints.', required: true, placeholder: 'Runtime: {env}. Dependencies: {list}. API version: {v}...' },
      { label: 'Objective', description: 'What success looks like (measurable).', required: true, placeholder: 'The output must pass {test} and handle {edge cases}...' },
      { label: 'Persona', description: 'Technical role for the AI.', required: false, placeholder: 'You are a {level} {specialization} engineer.' },
      { label: 'Execution', description: 'Step-by-step implementation plan.', required: true, placeholder: '1. Set up...\n2. Implement...\n3. Test...\n4. Document...' },
    ],
    bestFor: ['API development', 'Database schemas', 'Infrastructure code', 'Test suites', 'Migration scripts'],
    complexity: 'moderate',
  },
  {
    id: 'packed',
    name: 'Purpose-Audience-Context-Key info-Emotion-Detail',
    acronym: 'PACKED',
    description:
      'Communication-focused framework designed for prompts that produce human-facing content. ' +
      'The Audience and Emotion steps ensure the output resonates with the target reader on an ' +
      'emotional level. Key Info prevents the model from omitting critical facts. PACKED bridges ' +
      'the gap between technical accuracy and human engagement.',
    steps: [
      { label: 'Purpose', description: 'Why this content exists.', required: true, placeholder: 'Inform users about {feature/issue/change}...' },
      { label: 'Audience', description: 'Who will read this content.', required: true, placeholder: '{Role} with {knowledge level} about {domain}...' },
      { label: 'Context', description: 'Situation and background.', required: true, placeholder: 'After {event}, users need to know {what}...' },
      { label: 'Key info', description: 'Must-include facts and data.', required: true, placeholder: '- {fact1}\n- {fact2}\n- {data point}...' },
      { label: 'Emotion', description: 'Desired emotional response.', required: false, placeholder: 'Tone should feel {adjective}, not {adjective}...' },
      { label: 'Detail', description: 'Level of depth and specifics.', required: false, placeholder: 'Be {brief/thorough}. Include {specifics}...' },
    ],
    bestFor: ['User notifications', 'Release notes', 'Error messages', 'Onboarding emails', 'Support responses'],
    complexity: 'moderate',
  },
  {
    id: 'stone',
    name: 'Setup-Task-Objective-Notes-Extras',
    acronym: 'STONE',
    description:
      'Minimalist framework for quick, utility prompts. Setup and Task are the only required ' +
      'fields, making STONE ideal for chat-based interactions where speed matters more than ' +
      'comprehensive specifications. Notes capture edge cases, Extras add optional polish. Use ' +
      'STONE when you need a fast, good-enough result without ceremony.',
    steps: [
      { label: 'Setup', description: 'Minimal context or role.', required: true, placeholder: 'As a {role}, ...' },
      { label: 'Task', description: 'What to do.', required: true, placeholder: '{verb} {what}...' },
      { label: 'Objective', description: 'Success criteria.', required: false, placeholder: 'The result should {metric}...' },
      { label: 'Notes', description: 'Edge cases or gotchas.', required: false, placeholder: 'Watch out for: {issues}...' },
      { label: 'Extras', description: 'Optional formatting/constraints.', required: false, placeholder: 'Format: {type}. Max: {N}.' },
    ],
    bestFor: ['Quick questions', 'Code snippets', 'Debugging help', 'Concept explanations', 'Brainstorming'],
    complexity: 'simple',
  },
  {
    id: 'co-star',
    name: 'Context-Objective-Style-Tone-Audience-Response',
    acronym: 'CO-STAR',
    description:
      'Singapore government-developed framework optimized for public sector communication. ' +
      'It adds explicit Style (writing style guidelines) and Response format control on top of ' +
      'the standard Context/Objective pattern. The Audience step ensures accessibility and ' +
      'inclusivity. CO-STAR produces content that is clear, professional, and audience-appropriate.',
    steps: [
      { label: 'Context', description: 'Background information.', required: true, placeholder: 'The {initiative} aims to {goal}...' },
      { label: 'Objective', description: 'What the content should achieve.', required: true, placeholder: 'Inform {audience} about {topic} so they can {action}...' },
      { label: 'Style', description: 'Writing style guidelines.', required: false, placeholder: 'Use {formal/casual} language. Avoid {jargon}.' },
      { label: 'Tone', description: 'Emotional register.', required: true, placeholder: 'Tone: {professional/friendly/urgent}...' },
      { label: 'Audience', description: 'Target readers and their needs.', required: true, placeholder: 'For {role} with {background}...' },
      { label: 'Response', description: 'Output format and structure.', required: true, placeholder: 'Provide a {format} with {sections}...' },
    ],
    bestFor: ['Government communication', 'Policy documents', 'Public announcements', 'Internal memos', 'Guidelines'],
    complexity: 'moderate',
  },
  {
    id: 'rag',
    name: 'Retrieval-Augmented Generation Prompt',
    acronym: 'RAG',
    description:
      'Framework for prompts that incorporate external knowledge retrieval. The Context section ' +
      'is populated dynamically from a retrieval system, so the prompt template must clearly ' +
      'delineate retrieved context from user instructions. The Instruction section tells the model ' +
      'how to use (or not use) the retrieved context, and Citation rules prevent hallucination.',
    steps: [
      { label: 'Instruction', description: 'What to do with the retrieved data.', required: true, placeholder: 'Based on the context below, answer the user question...' },
      { label: 'Context', description: 'Retrieved documents/knowledge (dynamic).', required: true, placeholder: '<context>\n{retrieved_documents}\n</context>' },
      { label: 'Question', description: 'The user actual query.', required: true, placeholder: '{user_question}' },
      { label: 'Citation', description: 'Rules for referencing sources.', required: false, placeholder: 'Cite sources using [doc-N]. Only use info from context.' },
    ],
    bestFor: ['Documentation search', 'Knowledge base Q&A', 'Research assistance', 'Legal/compliance queries', 'Technical support'],
    complexity: 'complex',
  },
  {
    id: 'chain',
    name: 'Multi-Agent Chain Framework',
    acronym: 'CHAIN',
    description:
      'Framework for orchestrating multiple AI agents in sequence. Each step defines an agent ' +
      'role, its input (from the previous step), and its expected output. The Handoff section ' +
      'specifies how data flows between agents. CHAIN is the foundation for building AI pipelines ' +
      'where each agent specializes in one part of a complex workflow.',
    steps: [
      { label: 'Goal', description: 'Overall objective of the pipeline.', required: true, placeholder: 'Transform a natural language spec into tested, deployed code.' },
      { label: 'Agent 1', description: 'First agent role and task.', required: true, placeholder: 'Planner: Break the spec into implementation tasks...' },
      { label: 'Agent 2', description: 'Second agent role and task.', required: true, placeholder: 'Coder: Implement tasks one by one...' },
      { label: 'Agent N', description: 'Additional agents as needed.', required: false, placeholder: 'Reviewer: Check code quality and correctness...' },
      { label: 'Handoff', description: 'Data flow between agents.', required: true, placeholder: 'Agent 1 output -> Agent 2 input format: JSON...' },
    ],
    bestFor: ['Code generation pipelines', 'Content creation workflows', 'Data processing chains', 'Research pipelines', 'CI/CD automation'],
    complexity: 'complex',
  },
]
