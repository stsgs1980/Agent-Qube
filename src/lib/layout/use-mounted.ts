/**
 * SSR-safe mounting hook via useSyncExternalStore.
 * Returns `false` on server, `true` on client after hydration.
 * Zero hydration mismatches — from Code-Realm pattern.
 *
 * Usage:
 *   const mounted = useMounted()
 *   if (!mounted) return <Skeleton />
 */
'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,   // subscribe — no-op, nothing to subscribe to
    () => true,       // getSnapshot — client always mounted
    () => false       // getServerSnapshot — SSR never mounted
  )
}
