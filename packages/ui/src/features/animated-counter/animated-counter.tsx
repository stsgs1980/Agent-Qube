'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface AnimatedCounterProps {
  /** Target value to animate towards */
  end: number
  /** Animation duration in milliseconds (default 2000) */
  duration?: number
  /** Text suffix, e.g. "%" or "K" (default "") */
  suffix?: string
  /** Text prefix, e.g. "$" (default "") */
  prefix?: string
  /** Number of decimal places (default 0) */
  decimals?: number
  /** Additional CSS classes */
  className?: string
  /** Text color (default "inherit") */
  color?: string
  /** Font family (default "inherit") */
  fontFamily?: string
}

// ─── AnimatedCounter Component ────────────────────────────────

/**
 * AnimatedCounter -- number that counts up when scrolled into view.
 *
 * Uses IntersectionObserver and requestAnimationFrame for a smooth
 * ease-out cubic animation. Fires once when the element enters the viewport.
 * Supports prefix/suffix formatting and decimal precision.
 *
 * @example
 * ```tsx
 * <AnimatedCounter end={99.9} suffix="%" decimals={1} color="#10b981" />
 * ```
 */
export const AnimatedCounter = forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      end,
      duration = 2000,
      suffix = '',
      prefix = '',
      decimals = 0,
      className,
      color,
      fontFamily,
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLSpanElement>(null)
    const ref = forwardedRef ?? internalRef
    const hasAnimated = useRef(false)
    const rafRef = useRef<number>(0)

    useEffect(() => {
      const el = ref as React.RefObject<HTMLSpanElement | null>
      if (!el.current || hasAnimated.current) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const startTime = performance.now()

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = eased * end

              if (el.current) {
                el.current.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`
              }

              if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate)
              }
            }

            rafRef.current = requestAnimationFrame(animate)
            observer.disconnect()
          }
        },
        { threshold: 0 },
      )

      observer.observe(el.current)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(rafRef.current)
      }
    }, [end, duration, suffix, prefix, decimals, ref])

    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={cn('tabular-nums', className)}
        style={{ color, fontFamily }}
        data-slot="animated-counter"
      >
        {`${prefix}0${suffix}`}
      </span>
    )
  },
)
AnimatedCounter.displayName = 'AnimatedCounter'
