'use client'

import { useState, useEffect, useCallback } from 'react'
import { tokens } from '../tokens/tokens'

// ─── Types ────────────────────────────────────────────────────

import type { BreakpointName } from '../tokens/types'

export type { BreakpointName }

export interface BreakpointState {
  /** Current active breakpoint name */
  current: BreakpointName | 'base'
  /** Whether viewport is below 'md' (mobile) */
  isMobile: boolean
  /** Whether viewport is between 'md' and 'lg' (tablet) */
  isTablet: boolean
  /** Whether viewport is at or above 'lg' (desktop) */
  isDesktop: boolean
  /** Whether viewport is at or above the given breakpoint */
  isAbove: (bp: BreakpointName) => boolean
  /** Whether viewport is below the given breakpoint */
  isBelow: (bp: BreakpointName) => boolean
}

// ─── Breakpoint values from tokens ────────────────────────────

const breakpointValues: Record<BreakpointName, number> = {
  sm: parseInt(tokens.breakpoints.sm, 10),
  md: parseInt(tokens.breakpoints.md, 10),
  lg: parseInt(tokens.breakpoints.lg, 10),
  xl: parseInt(tokens.breakpoints.xl, 10),
  '2xl': parseInt(tokens.breakpoints['2xl'], 10),
}

const breakpointOrder: (BreakpointName | 'base')[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl']

// ─── useBreakpoint Hook ──────────────────────────────────────

/**
 * useBreakpoint -- reactive breakpoint detection based on design tokens.
 *
 * Returns the current breakpoint name and convenience boolean flags
 * for mobile/tablet/desktop detection. Uses the same breakpoint values
 * defined in tokens/breakpoints (sm=640, md=768, lg=1024, xl=1280, 2xl=1536).
 *
 * Works client-side using window.matchMedia. Returns safe defaults
 * during SSR (isDesktop=true, current='base').
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { current, isMobile, isDesktop, isAbove } = useBreakpoint()
 *
 *   return (
 *     <div>
 *       <p>Current breakpoint: {current}</p>
 *       {isMobile && <MobileNav />}
 *       {isDesktop && <DesktopNav />}
 *       {isAbove('xl') && <WideSidebar />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useBreakpoint(): BreakpointState {
  const [current, setCurrent] = useState<BreakpointName | 'base'>('base')

  const getCurrent = useCallback((): BreakpointName | 'base' => {
    if (typeof window === 'undefined') return 'base'
    const width = window.innerWidth
    if (width >= breakpointValues['2xl']) return '2xl'
    if (width >= breakpointValues.xl) return 'xl'
    if (width >= breakpointValues.lg) return 'lg'
    if (width >= breakpointValues.md) return 'md'
    if (width >= breakpointValues.sm) return 'sm'
    return 'base'
  }, [])

  useEffect(() => {
    setCurrent(getCurrent())

    const handleResize = () => {
      setCurrent(getCurrent())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getCurrent])

  const currentIndex = breakpointOrder.indexOf(current)

  const isAbove = useCallback(
    (bp: BreakpointName): boolean => {
      const bpIndex = breakpointOrder.indexOf(bp)
      return currentIndex >= bpIndex
    },
    [currentIndex]
  )

  const isBelow = useCallback(
    (bp: BreakpointName): boolean => {
      const bpIndex = breakpointOrder.indexOf(bp)
      return currentIndex < bpIndex
    },
    [currentIndex]
  )

  return {
    current,
    isMobile: current === 'base' || current === 'sm',
    isTablet: current === 'md',
    isDesktop: currentIndex >= breakpointOrder.indexOf('lg'),
    isAbove,
    isBelow,
  }
}
