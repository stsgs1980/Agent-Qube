# Task 6b-2: Fix HOOKS + LAYOUT components

## Thresholds: Hooks max 60 lines, Components max 50 lines

## HOOKS WARNINGS:
- src/hooks/use-dashboard-data.ts: useDashboardData 66 lines (6 over)
- src/hooks/use-hierarchy-data.ts: useHierarchyData 61 lines (1 over)
- src/hooks/use-workflow-create.ts: useWorkflowCreate 63 lines (3 over)

## LAYOUT COMPONENT WARNINGS:
- src/components/layout/ai-canvas.tsx: VariantAICanvas 124 lines, complexity 17
- src/components/layout/explorer-sidebar.tsx: ExplorerSidebar 89 lines
- src/components/layout/theme-dropdown.tsx: ThemeDropdown 57 lines
- src/components/layout/theme-recommendation-parts.tsx: Arrow function complexity 16 (line 47, in OtherRecommendations)
- src/components/layout/grid-code-block.tsx: GridCodeBlock 74 lines
- src/components/layout/grid-preview.tsx: GridPreview 70 lines, complexity 17
- src/components/layout/features/ai-canvas.tsx: VariantAICanvas 125 lines
- src/components/layout/features/layout-explorer.tsx: VariantLayoutExplorer 127 lines
- src/components/layout/features/prompt-studio-parts.tsx: PromptInputSection 60 lines, complexity 23
- src/components/layout/features/theme-preset-selector.tsx: ThemePresetSelector 75 lines
- src/components/layout/sections/explorer-sidebar.tsx: ExplorerSidebar 82 lines
- src/components/layout/ui/grid-code-block.tsx: GridCodeBlock 74 lines
- src/components/layout/ui/grid-preview.tsx: GridPreview 70 lines, complexity 17

## STRATEGY:

### HOOKS (extract helpers):

**use-dashboard-data.ts** (66 lines → < 60): Extract the computed values block into a helper:
```ts
function buildDashboardValues(statsData: any) { return { quickStats, roleGroups, agentList, ... } }
```
Put it in the same file, called inside useDashboardData.

**use-hierarchy-data.ts** (61 lines → < 60): Extract the mock status cycling effect into a custom hook or callback. E.g., extract the interval callback into a named function `startMockStatusCycle(wsConnected, setAgents)`.

**use-workflow-create.ts** (63 lines → < 60): Extract the handleSave function body into a separate named function `saveWorkflow(params)`.

### LAYOUT COMPONENTS:

For all layout components, the strategy is to extract sub-components or inline style objects. Since these use inline styles extensively, the most effective approach is:

**ai-canvas.tsx (124 lines) and features/ai-canvas.tsx (125 lines)**: These are similar. Extract:
- `CanvasTopBar` component
- `CommandPalette` component (the overlay)
- `CanvasLeftPanel` component (context + rankings)
- `CanvasCenter` component

For layout/ai-canvas.tsx, put extracted components in the SAME file.
For features/ai-canvas.tsx, same approach.

**explorer-sidebar.tsx (89 lines) and sections/explorer-sidebar.tsx (82 lines)**: Extract:
- `SidebarHeader` component
- `SidebarSearch` component  
- `LayerNavigation` component
- `GoalFilters` component

**theme-dropdown.tsx (57 lines)**: Just 7 lines over. Extract the footer hint into `ThemeDropdownFooter`.

**theme-recommendation-parts.tsx**: The complexity 16 warning is on line 47 in `OtherRecommendations` - extract the inner map callback into a named component `RecommendationChip`.

**grid-code-block.tsx (74 lines) and ui/grid-code-block.tsx (74 lines)**: These are duplicates. Extract `CodeToolbar` component. Both files are identical - fix both the same way.

**grid-preview.tsx (70 lines) and ui/grid-preview.tsx (70 lines)**: These are near-duplicates. Extract `GridSlots` component. Fix both.

**layout-explorer.tsx (127 lines)**: Extract:
- `ExplorerTopbar` component
- `RecipeGrid` component (grid view mode)
- `RecipeList` component (list view mode)

**prompt-studio-parts.tsx (60 lines, complexity 23)**: `PromptInputSection` has many conditional styles. Extract:
- `PromptInputField` component
- `AIModeToggle` component
- `PromptQualityIndicator` component

**theme-preset-selector.tsx (75 lines)**: Extract the dropdown panel into `PresetDropdownPanel` component.

## CRITICAL RULES:
- Read EVERY file fully before editing
- Keep ALL exports
- For duplicate files (grid-code-block, grid-preview), fix both identically
- Write work record to /home/z/my-project/agent-ctx/6b-agent2-hooks-layout.md when done
