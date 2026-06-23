'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────

export interface UseAnimatedCounterOptions {
  /** Target value (default 0) */
  to?: number
  /** Starting value (default 0) */
  from?: number
  /** Duration in ms (default 1000) */
  duration?: number
  /** Easing function (default ease-out cubic) */
  easing?: (t: number) => number
  /** Whether to start immediately (default true) */
  autoStart?: boolean
  /** Decimal places (default 0) */
  decimals?: number
}

export interface UseAnimatedCounterReturn {
  /** Current animated value */
  value: number
  /** Formatted string with fixed decimals */
  formatted: string
  /** Start or restart the animation */
  start: () => void
}

// ─── Easing functions ─────────────────────────────────────────

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

// ─── useAnimatedCounter Hook ──────────────────────────────────

/**
 * useAnimatedCounter -- animate a numeric value from one number to another.
 *
 * Uses requestAnimationFrame for smooth 60fps animation.
 * Supports custom easing, decimal precision, and manual start.
 *
 * @example
 * ```tsx
 * function StatCounter() {
 *   const { formatted, start } = useAnimatedCounter({ to: 1234, duration: 1500 })
 *   useEffect(() => { start() }, [start])
 *   return <span>{formatted}</span>
 * }
 * ```
 */
export function useAnimatedCounter(
  options: UseAnimatedCounterOptions = {}
): UseAnimatedCounterReturn {
  const {
    to = 0,
    from = 0,
    duration = 1000,
    easing = easeOutCubic,
    autoStart = true,
    decimals = 0,
  } = options

  const [value, setValue] = useState(from)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const animate = (startAt: number) => {
    startTimeRef.current = startAt

    const step = (now: number) => {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      setValue(from + (to - from) * easedProgress)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }

  const start = () => {
    cancelAnimationFrame(rafRef.current)
    setValue(from)
    animate(performance.now())
  }

  useEffect(() => {
    if (autoStart) start()
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, from, duration, easing, autoStart])

  return {
    value,
    formatted: value.toFixed(decimals),
    start,
  }
}
