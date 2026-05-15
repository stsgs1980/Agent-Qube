'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { useBreakpoint } from '../hooks/use-breakpoint'
import type { BreakpointName } from '../tokens/types'

// ─── Types ────────────────────────────────────────────────────

export interface LayoutProviderValue {
  /** Current viewport breakpoint */
  breakpoint: BreakpointName | 'base'
  /** Whether viewport is below 'md' (mobile) */
  isMobile: boolean
  /** Whether viewport is between 'md' and 'lg' (tablet) */
  isTablet: boolean
  /** Whether viewport is at or above 'lg' (desktop) */
  isDesktop: boolean
}

// ─── Context ──────────────────────────────────────────────────

const LayoutProviderContext = createContext<LayoutProviderValue>({
  breakpoint: 'lg', // Safe SSR default: desktop
  isMobile: false,
  isTablet: false,
  isDesktop: true,
})

/**
 * useLayoutContext -- access the viewport breakpoint from LayoutProvider.
 *
 * Returns the current breakpoint and convenience flags.
 * Falls back to desktop defaults when no LayoutProvider is present (SSR-safe).
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { breakpoint, isMobile } = useLayoutContext()
 *   return isMobile ? <MobileView /> : <DesktopView />
 * }
 * ```
 */
export function useLayoutContext(): LayoutProviderValue {
  return useContext(LayoutProviderContext)
}

// ─── Provider Component ──────────────────────────────────────

export interface LayoutProviderProps {
  children: ReactNode
}

/**
 * LayoutProvider -- provides viewport breakpoint context to the component tree.
 *
 * Wraps useBreakpoint (Layer 5) in a context provider (Layer 6) so that
 * Layer 2 components (Layout, Grid) can read the current breakpoint without
 * importing hooks directly (which would violate the layer dependency direction).
 *
 * Place this at the root of your app:
 * ```tsx
 * <LayoutProvider>
 *   <App />
 * </LayoutProvider>
 * ```
 *
 * Without LayoutProvider, Layout components default to the desktop breakpoint
 * (which is safe for SSR). With LayoutProvider, they become auto-responsive.
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  const { current, isMobile, isTablet, isDesktop } = useBreakpoint()

  const value: LayoutProviderValue = {
    breakpoint: current,
    isMobile,
    isTablet,
    isDesktop,
  }

  return (
    <LayoutProviderContext.Provider value={value}>
      {children}
    </LayoutProviderContext.Provider>
  )
}
