# Task 6b-3: Fix PROMPT-STUDIO + WORKFLOW components + EXAMPLES

## Thresholds: Components max 50 lines

## PROMPT-STUDIO WARNINGS:
- src/components/prompt-studio/execution-result.tsx: EvalStepRow 55 lines + complexity 22, EvalDetail 57 lines
- src/components/prompt-studio/intent-display.tsx: IntentDisplay 66 lines
- src/components/prompt-studio/prompt-comparison.tsx: PromptComparison 64 lines
- src/components/prompt-studio/prompt-history.tsx: PromptHistory 60 lines
- src/components/prompt-studio/prompt-quality-score.tsx: PromptQualityScore 52 lines

## WORKFLOW WARNINGS:
- src/components/workflows/workflow-card.tsx: WorkflowCard 89 lines
- src/components/workflows/workflow-contracts.tsx: DataContractCard 65 lines, complexity 20
- src/components/workflows/workflow-create-dialog.tsx: CreateWorkflowDialog 85 lines
- src/components/workflows/workflow-execution-modal.tsx: ExecutionModal 115 lines, complexity 16
- src/components/workflows/workflow-expanded-view.tsx: ExpandedPipelineView 84 lines
- src/components/workflows/workflow-llm-eval.tsx: LLMEvalDisplay 52 lines
- src/components/workflows/workflow-node.tsx: PipelineStepNode 53 lines
- src/components/workflows/workflow-pipeline.tsx: WorkflowPipeline 75 lines, complexity 16
- src/components/workflows/workflow-sidebar.tsx: WorkflowSidebar 51 lines
- src/components/workflows/workflow-timeline.tsx: TaskContextTimeline 89 lines

## EXAMPLES:
- src/examples/wireframe/prompt-demo.tsx: WireframePromptDemo 90 lines (threshold 60 for examples)

## STRATEGY:

### PROMPT-STUDIO:

**execution-result.tsx**: 
- `EvalStepRow` (55 lines, complexity 22): Extract `StepRowHeader` (the button content) and `StepRowExpanded` (the expanded content)
- `EvalDetail` (57 lines): Extract `EvalIssues` and `EvalSuggestions` sub-components

**intent-display.tsx** (66 lines): Extract `AgentChainDisplay` component and `FormulaRecommendation` component.

**prompt-comparison.tsx** (64 lines): Extract `ComparisonControls` (select + button) and `ComparisonResults` (winner + scores) sub-components.

**prompt-history.tsx** (60 lines): Extract `HistorySidebar` component (the non-collapsed view).

**prompt-quality-score.tsx** (52 lines): Just 2 over. Extract the suggestions section into `QualitySuggestions` component, or extract `DimensionBar` component.

### WORKFLOWS:

**workflow-card.tsx** (89 lines): Extract:
- `CardHeader` (title + status + action buttons)
- `CardMeta` (trigger type, steps, success rate, runs)
- `CardExpandedContent` (execution history)

**workflow-contracts.tsx** (65 lines, complexity 20): Extract `checkCompatibility` helper function (the if/else logic), and `SchemaDisplay` component.

**workflow-create-dialog.tsx** (85 lines): Extract `DialogFormFields` component.

**workflow-execution-modal.tsx** (115 lines, complexity 16): Extract:
- `ModalHeader` component
- `PipelineVisualization` component (the step nodes + arrows)
- `StepExecutionList` component

**workflow-expanded-view.tsx** (84 lines): Extract `PipelineControls` (buttons) and `ActionLegend` (bottom legend).

**workflow-llm-eval.tsx** (52 lines): Extract `EvalBadges` (the flex-wrap badges) or `EvalIssues` and `EvalSuggestions`.

**workflow-node.tsx** (53 lines): Extract `StepAnimationRing` component (the absolute-positioned ring).

**workflow-pipeline.tsx** (75 lines, complexity 16): Extract `PipelineModals` (the modals JSX), `FullPagePipeline` and `EmbeddedPipeline` sub-components.

**workflow-sidebar.tsx** (51 lines): Just 1 over. Extract the collapsed icons into `SidebarCollapsedIcons` component.

**workflow-timeline.tsx** (89 lines): Extract `TimelineHeader` (button) and `TimelineEntry` (the map item) components.

### EXAMPLES:

**prompt-demo.tsx** (90 lines, threshold 60): Extract:
- `usePromptRanking(recipes, parsed)` custom hook for the useMemo logic
- `PromptInputSection` component
- `PromptResultSection` component

## CRITICAL RULES:
- Read EVERY file fully before editing
- Keep ALL exports  
- Write work record to /home/z/my-project/agent-ctx/6b-agent3-workflows-prompts.md when done
