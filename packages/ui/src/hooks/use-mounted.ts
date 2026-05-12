'use client'

import { useSyncExternalStore } from 'react'

// ─── Types ────────────────────────────────────────────────────

// ─── useMounted Hook ──────────────────────────────────────────

/**
 * useMounted -- SSR-safe mount detection via useSyncExternalStore.
 *
 * Returns true only after the component has hydrated on the client.
 * Prevents hydration mismatches when rendering client-only content.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const mounted = useMounted()
 *   if (!mounted) return <Skeleton />
 *   return <RealContent />
 * }
 * ```
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
