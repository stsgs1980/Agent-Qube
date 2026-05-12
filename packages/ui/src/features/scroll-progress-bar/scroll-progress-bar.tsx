'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { useScrollProgress } from '../../hooks/use-scroll-progress'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface ScrollProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Bar height (default "3px") */
  height?: string
  /** Bar color (default "hsl(var(--primary))") */
  color?: string
  /** Whether to show a shadow glow effect (default false) */
  glow?: boolean
  /** Z-index (default "z-50") */
  zIndex?: string
  /** CSS position (default "fixed") */
  position?: 'fixed' | 'absolute' | 'sticky'
}

// ─── ScrollProgressBar Component ──────────────────────────────

/**
 * ScrollProgressBar -- fixed progress bar showing scroll position.
 *
 * A thin bar that fills from left to right as the user scrolls down.
 * Zero-friction -- just drop it into your layout.
 *
 * @example
 * ```tsx
 * <ScrollProgressBar color="#f59e0b" glow />
 * ```
 */
export const ScrollProgressBar = forwardRef<HTMLDivElement, ScrollProgressBarProps>(
  ({ height = '3px', color, glow = false, zIndex = 'z-50', position = 'fixed', className, ...props }, ref) => {
    const { progress } = useScrollProgress()

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('left-0 top-0 w-full transition-[width] duration-100', zIndex, position, className)}
        style={{
          height,
          width: `${progress}%`,
          backgroundColor: color ?? 'hsl(var(--primary))',
          boxShadow: glow ? `0 0 8px ${color ?? 'hsl(var(--primary))'}` : undefined,
        }}
        {...props}
      />
    )
  }
)
ScrollProgressBar.displayName = 'ScrollProgressBar'
