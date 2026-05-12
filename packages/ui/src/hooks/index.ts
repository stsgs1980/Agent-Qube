// Layer 5: Hooks
// Stateful logic without JSX. Encapsulate state, data, and side effects.
// Used by features/ and providers/.
// 2 original + 5 extracted from Code-Realm / Component-Browser.

export { useBreakpoint } from './use-breakpoint'
export type { BreakpointState } from './use-breakpoint'
// BreakpointName is re-exported from tokens/ (single source of truth)

export { useLayoutAdvice } from './use-layout-advice'
export type { LayoutRecommendation, UseLayoutAdviceResult } from './use-layout-advice'

// SSR / Browser hooks
export { useMounted } from './use-mounted'

// Clipboard
export { useCopyToClipboard } from './use-copy-to-clipboard'
export type { UseCopyToClipboardOptions, UseCopyToClipboardReturn } from './use-copy-to-clipboard'

// Animation
export { useAnimatedCounter } from './use-animated-counter'
export type { UseAnimatedCounterOptions, UseAnimatedCounterReturn } from './use-animated-counter'

// Scroll
export { useScrollProgress } from './use-scroll-progress'
export type { UseScrollProgressOptions, UseScrollProgressReturn } from './use-scroll-progress'

// Storage
export { useLocalStorage } from './use-local-storage'
export type { UseLocalStorageOptions, UseLocalStorageReturn } from './use-local-storage'
