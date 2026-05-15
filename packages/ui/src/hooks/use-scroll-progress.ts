'use client'

import { useState, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────

export interface UseScrollProgressOptions {
  /** Track scroll within a specific element (default: window) */
  target?: HTMLElement | null
}

export interface UseScrollProgressReturn {
  /** Scroll progress as a percentage 0-100 */
  progress: number
  /** Whether user has scrolled past the top */
  isScrolled: boolean
}

// ─── useScrollProgress Hook ───────────────────────────────────

/**
 * useScrollProgress -- track scroll position as a 0-100 percentage.
 *
 * Returns both the raw percentage and a boolean for common
 * "has user scrolled" checks. Works with window or a specific element.
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const { progress, isScrolled } = useScrollProgress()
 *   return (
 *     <>
 *       <div style={{ width: `${progress}%` }} className="h-1 bg-primary" />
 *       <header className={isScrolled ? 'shadow-md' : ''}>...</header>
 *     </>
 *   )
 * }
 * ```
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const { target } = options
  const [progress, setProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const element = target || document.documentElement

    const handleScroll = () => {
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight

      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setProgress(Math.min(Math.max(pct, 0), 100))
      setIsScrolled(scrollTop > 10)
    }

    // Set initial values
    handleScroll()

    const container = target || window
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [target])

  return { progress, isScrolled }
}
