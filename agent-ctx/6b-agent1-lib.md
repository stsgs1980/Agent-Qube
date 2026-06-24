# Task 6b-1: Fix LIB files (max-lines-per-function 60, complexity 15)

## Warnings to fix:
- src/lib/agent-helpers.ts: aggregateAgentStats complexity 17
- src/lib/layout/prompt-parser.ts: parsePrompt 75 lines, complexity 36
- src/lib/layout/parse-prompt.ts: parsePrompt 75 lines, complexity 36 (DUPLICATE of prompt-parser.ts - make it re-export from prompt-parser.ts instead)
- src/lib/layout/score-layout.ts: scoreLayout complexity 27, scoreLayoutMulti 62 lines + complexity 24
- src/lib/layout/scoring-multi.ts: scoreLayoutMulti 62 lines + complexity 24 (DUPLICATE - make it re-export from score-layout.ts instead)
- src/lib/stats-computations.ts: computeStats 151 lines
- src/lib/stats-heatmap.ts: computeConnectionHeatmap 61 lines, complexity 26
- src/lib/workflow-execution.ts: createRequestMessage 8 params, createFeedbackMessage 6 params
- src/lib/workflow-executor.ts: executeSteps 106 lines, complexity 21
- src/lib/workflow-pipeline.ts: runSimulatedPipeline 72 lines + complexity 21, runLLMPipeline 87 lines + complexity 21
- src/lib/workflow-simulator.ts: simulateStepExecution 76 lines, complexity 35

## STRATEGY:

### parse-prompt.ts
Make it re-export from prompt-parser.ts:
```ts
export { parsePrompt } from './prompt-parser'
```

### scoring-multi.ts
Make it re-export from score-layout.ts:
```ts
export type { MultiGoalRecommendation } from './score-layout'
export { scoreLayoutMulti } from './score-layout'
```
BUT: score-layout.ts must export `MultiGoalRecommendation` type (add it). Check what scoring-multi.ts exports and ensure score-layout.ts exports the same.

### prompt-parser.ts
Extract helper functions to reduce complexity:
- `scoreGoals(lower: string)` -> returns goalScores Record
- `resolvePrimaryGoal(goalScores)` -> returns { goal, maxG, detected }
- `normalizeGoalWeights(goalScores, primaryGoal, detected)` -> returns goalWeights, isMultiGoal
- `resolveContentType(lower, isMultiGoal)` -> returns { contentType, detected }
- `resolveItemCount(lower, goal, isMultiGoal, goalWeights)` -> returns { itemCount, detected }
- `resolveStructural(lower, goal, isMultiGoal, goalWeights)` -> returns { needsSidebar, needsHeader, needsFooter, detected }

### score-layout.ts
For `scoreLayout` (complexity 27): Extract scoring sections into helpers:
- `scoreGoalMatch(recipe, input)` -> { score, reasons }
- `scoreContentAffinity(recipe, input)` -> { score, reasons }
- `scoreItemCountFit(recipe, input)` -> { score, reasons }
- `scoreStructureMatch(recipe, input)` -> structBonus
- `computeVerdict(recipe, score)` -> verdict

For `scoreLayoutMulti` (62 lines, complexity 24): Extract:
- `applyConflictMitigation(recipe, goal, goalCount, goalWeights, singleScore)` -> adjustedScore
- `applyStructuralPenalty(input, recipe, finalScore, goalCount)` -> finalScore
- `applySynergyBonus(goalBreakdown, finalScore, goalCount)` -> finalScore
- `applyCriticalMissPenalty(goalBreakdown, goalWeights, finalScore)` -> finalScore

### agent-helpers.ts
`aggregateAgentStats` complexity 17: Use early returns and reduce branching. The main complexity comes from loops and conditionals. Extract:
- `initAgentStats(agentId)` -> AgentStatEntry
- `accumulateScores(stepExecutions)` -> scoresByAgent Record

### stats-computations.ts
`computeStats` 151 lines: Extract into separate helper functions:
- `fetchStatsData()` -> { agents, tasks }
- `computeQuickStats(agents, tasks, ALL_KNOWN_FORMULAS)` -> quickStats
- `computeStatusDistribution(agents, STATUS_CONFIG)` -> statusDistribution
- `computeRoleGroups(agents, ROLE_GROUP_ORDER, ROLE_GROUP_CONFIG, STATUS_CONFIG)` -> roleGroups
- `computeActivityEvents(tasks)` -> activityEvents
- `computeTopPerformers(agents, tasks)` -> topPerformers

### stats-heatmap.ts
`computeConnectionHeatmap` complexity 26: Extract:
- `buildGroupIndex()` -> groupIndex Record
- `addInterAgentConnections(agents, groupIndex, heatmap)` -> void
- `addIntraGroupConnections(agentsByGroup, ROLE_GROUP_ORDER, groupIndex, heatmap)` -> void

### workflow-execution.ts
`createRequestMessage` 8 params: Use an options object:
```ts
interface RequestMessageParams {
  stepExecId: string; fromAgentId: string; toAgentId: string;
  stepName: string; stepAction: string; stepOrder: number; input: unknown; position: string;
}
export async function createRequestMessage(params: RequestMessageParams) { ... }
```
Same for `createFeedbackMessage` (6 params -> options object).
Check consumers before changing exports! Grep for `createRequestMessage` and `createFeedbackMessage` imports.

### workflow-executor.ts
`executeSteps` 106 lines, complexity 21: Extract:
- `handleSkippedStep(stepExec)` -> db update
- `createRequestMessageForStep(step, resolvedAgentId, stepExec, i, resolvedSteps)` -> db create message
- `handleFeedbackLoop(stepExec, stepOutput, resolvedAgentId, i, resolvedSteps)` -> db updates
- `handleStepCompletion(stepExec, stepOutput, resolvedAgentId, i, resolvedSteps)` -> db updates
- `recordHistory(taskContext, step, agent, step.action, isFeedbackLoop)` -> void

### workflow-pipeline.ts
`runSimulatedPipeline` and `runLLMPipeline` are very similar. Extract shared:
- `recordStepStart(stepExec, step, previousOutput, i, resolved, isLLM)` -> void (handles mark running + create request message)
- `recordStepFeedback(stepExec, stepOutput, step, resolvedAgentId, i, resolved)` -> void
- `recordStepComplete(stepExec, stepOutput, step, resolvedAgentId, i, resolved)` -> void

### workflow-simulator.ts
`simulateStepExecution` complexity 35: Use a lookup table for action handlers:
```ts
const ACTION_HANDLERS: Record<string, (input: any, agent, config, step, context) => any> = {
  process: simulateProcess,
  review: simulateReview,
  transform: simulateTransform,
  delegate: simulateDelegate,
  broadcast: simulateBroadcast,
  decision: simulateDecision,
}
```
Then: `const handler = ACTION_HANDLERS[step.action]; return handler ? handler(input, agent, config, step, context) : defaultOutput`

## CRITICAL RULES:
- Read EVERY file fully before editing
- Keep ALL exports
- grep for consumers before changing exports
- Do NOT change any imports in consumer files
- Write work record to /home/z/my-project/agent-ctx/6b-agent1-lib.md when done
