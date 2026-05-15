# Task 4 - full-stack-developer

## Task: Split scoring.ts (252 lines) into 3 files under 200 lines each

## Work Log
- Read scoring.ts (318 lines total): identified two clear domains — prompt parsing and layout scoring
- Created `parse-prompt.ts` (133 lines): moved GOAL_KEYWORDS, CONTENT_KEYWORDS, SIDEBAR_KW, FOOTER_KW, parsePrompt()
- Created `score-layout.ts` (196 lines): moved WEIGHTS, contentAffinity, goalPreferences, scoreLayout(), scoreLayoutMulti()
- Rewrote `scoring.ts` (8 lines): thin barrel re-export from the two new files
- Verified backward compatibility: all 5 consumer files (layout-explorer.tsx, ai-canvas.tsx, prompt-studio.tsx, use-ai-prompt.ts, prompt-demo.tsx) import from '@/lib/layout/scoring' and still work without any changes
- Lint: all files pass cleanly, no errors

## Stage Summary
- Files: parse-prompt.ts (new, 133 lines), score-layout.ts (new, 196 lines), scoring.ts (barrel, 8 lines)
- All files under 200-line anti-monolith limit
- Zero changes to consumer files — barrel re-export ensures full backward compatibility
- Status: completed
