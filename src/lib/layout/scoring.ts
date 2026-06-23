/**
 * Layout scoring engine and prompt parser — barrel re-export.
 * Split into parse-prompt.ts and score-layout.ts for anti-monolith compliance.
 * All existing imports from '@/lib/layout/scoring' continue to work.
 */

export { scoreLayout, scoreLayoutMulti, WEIGHTS, goalPreferences } from './score-layout'
export { parsePrompt } from './parse-prompt'
