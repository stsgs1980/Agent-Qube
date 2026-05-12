// Layer 5: Hooks
// Stateful logic without JSX. Encapsulate state, data, and side effects.
// Used by features/ and providers/.

export { useBreakpoint } from './use-breakpoint'
export type { BreakpointState } from './use-breakpoint'
// BreakpointName is re-exported from tokens/ (single source of truth)

export { useLayoutAdvice } from './use-layout-advice'
export type { LayoutRecommendation, UseLayoutAdviceResult } from './use-layout-advice'
