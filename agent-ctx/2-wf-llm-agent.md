# Task 2 — WF LLM Agent

## Task: Add LLM Execution to Workflows Tab

## Work Done

### Part A: use-workflow-data.ts
- Added `runningLLMIds` state (Set<string>) separate from `runningIds`
- Added `handleRunLLM(workflowId)` — POSTs `{ workflowId, input: {} }` to `/api/workflows/execute-llm`
- Returns execution data on success, shows toast notifications
- Added both to return interface and object

### Part B: WorkflowCard
- Added `onRunLLM` and `runningLLM` props
- Added Sparkles icon button with amber (#F59E0B) accent styling
- Works for draft workflows (no status check unlike simulation)
- Tooltip: "Execute with AI"

### Part C: ExpandedPipelineView
- Added `onRunLLM` and `runningLLM` props
- Added "Execute with AI" button next to "Run Pipeline" with amber styling
- Uses Sparkles icon, shows "Executing..." when running

### Part D: workflow-pipeline.tsx
- Added `onRunLLM` callback using `data.handleRunLLM`
- Passes `onRunLLM` and `runningLLM` (from `data.runningLLMIds`) to WorkflowCard
- Both full-page and embedded views wired up

### Part E: workflow-llm-eval.tsx (new file)
- Created `hasLLMEval(outputData)` detector function
- Created `LLMEvalDisplay` component with:
  - Score badge (green >= 80, yellow >= 50, red < 50)
  - Verdict badge (approved=green, needs-work=yellow, rejected=red)
  - Issues count badge (red accent)
  - Summary text
  - Issues list with AlertTriangle icons
  - Suggestions list with Lightbulb icons
- Integrated into workflow-execution-modal.tsx before StepMessages

## File Line Counts (all under 150)
- use-workflow-data.ts: 148
- workflow-card.tsx: 116
- workflow-expanded-view.tsx: 107
- workflow-pipeline.tsx: 88
- workflow-execution-modal.tsx: 139
- workflow-llm-eval.tsx: 86

## Lint: 0 errors
