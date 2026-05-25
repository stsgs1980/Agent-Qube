# Task 1 - Phase C Agent

## Task: Add Prompt History + Tips to Prompt Studio

### Work Done

1. **Part A: PromptHistory model + API**
   - Added `PromptHistory` model to `prisma/schema.prisma` (id, prompt, intent, confidence, formula, avgScore, verdict, stepCount, executionId, createdAt)
   - Ran `bun run db:push` to push schema to database
   - Created API route `src/app/api/prompt-history/route.ts`:
     - GET: returns last 50 prompts ordered by createdAt desc
     - POST: saves a new prompt history entry with validation
     - DELETE: deletes a prompt history entry by id
   - Used direct PrismaClient instantiation (instead of shared db) to avoid global cache issues with new models
   - Updated `src/lib/db.ts` with SCHEMA_VERSION to force new PrismaClient when schema changes

2. **Part B: Save history after execution**
   - Modified `src/hooks/prompt-analysis-executor.ts`:
     - Added `HistoryMeta` interface (confidence, formula)
     - Added `meta` parameter to `executeWorkflowSimulation`
     - After successful execution, fires `savePromptHistory` (fire-and-forget)
   - Created `src/hooks/prompt-history-saver.ts`:
     - Computes avgScore from completed step evals
     - Derives verdict via majority vote from step evals
     - POSTs to `/api/prompt-history` with all required fields
   - Updated `src/hooks/use-prompt-analysis.ts` to pass meta (confidence, formula) to executor

3. **Part C: Prompt History panel UI**
   - Created `src/components/prompt-studio/prompt-history.tsx` (149 lines):
     - Collapsible sidebar (280px width) with History icon and count badge
     - Each item shows: truncated prompt text, intent badge, score color circle, verdict badge, relative timestamp
     - Clicking an item calls onSelect to reload prompt into input
     - "Clear history" button deletes all entries
     - Collapse/expand toggle
     - Dark theme: #0A0A0A bg, #06B6D4 cyan accents, rgba(51,51,51,0.3) borders

4. **Part D: Tips component**
   - Created `src/components/prompt-studio/prompt-tips.tsx` (35 lines):
     - 4 tip cards in a responsive grid (2 cols mobile, 4 cols desktop)
     - Each tip has: icon (Target/FileText/SlidersHorizontal/LayoutList), title, description
     - Contextual filtering based on analysis confidence:
       - confidence < 60: all 4 tips shown
       - confidence < 75: 3 tips
       - confidence < 85: 2 tips
       - confidence >= 85: 1 tip ("Define Output" always shown)

5. **Part E: Wired it all together**
   - Modified `src/components/prompt-studio/prompt-studio.tsx` (122 lines):
     - Imported PromptHistory and PromptTips
     - Added PromptHistory as collapsible sidebar on the right
     - Added PromptTips below input area (visible when analysis exists)
     - Auto-analyze on history selection: uses `autoAnalyze` state + useEffect pattern to set prompt and trigger analysis
     - Extracted StudioHeader and ErrorBanner as local functions
     - Layout: flex row with main content + history sidebar

### Files Changed
- `prisma/schema.prisma` (added PromptHistory model)
- `src/lib/db.ts` (added SCHEMA_VERSION for cache invalidation)
- `src/app/api/prompt-history/route.ts` (new, 72 lines)
- `src/hooks/prompt-analysis-executor.ts` (added HistoryMeta, meta param, fire-and-forget save)
- `src/hooks/prompt-history-saver.ts` (new, 43 lines)
- `src/hooks/use-prompt-analysis.ts` (pass meta to executor)
- `src/components/prompt-studio/prompt-history.tsx` (new, 149 lines)
- `src/components/prompt-studio/prompt-tips.tsx` (new, 35 lines)
- `src/components/prompt-studio/prompt-studio.tsx` (refactored, 122 lines)

### Stage Summary
- PromptHistory model + CRUD API fully working
- Execution results automatically saved to history (fire-and-forget)
- Collapsible history sidebar with item selection and clear all
- Contextual tips based on analysis confidence
- All files under 150-line anti-monolith limit
- Lint: 0 errors (only pre-existing warnings in packages/ui/)
