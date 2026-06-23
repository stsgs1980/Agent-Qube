'use client'

import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface FloatingSymbol {
  /** Text character to render (e.g. "{", "=>", "#fff") */
  symbol: string
  /** Horizontal position in % (0-100). Random if omitted. */
  left?: number
  /** Vertical position in % (0-100). Random if omitted. */
  top?: number
  /** Font size in px (default random 10-18) */
  size?: number
  /** Animation duration in seconds (default random 8-20) */
  duration?: number
  /** Animation delay in seconds (default random 0-10) */
  delay?: number
}

export interface FloatingDecorationsProps extends HTMLAttributes<HTMLDivElement> {
  /** Symbols to float. If string[], each string becomes a symbol with random position. */
  symbols: FloatingSymbol[] | string[]
  /** Number of items if symbols is a short list (default: symbols.length, min 1) */
  count?: number
  /** Color (default: current text color / 30% opacity) */
  color?: string
  /** Whether to enable animations (default true) */
  animated?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function normalizeSymbols(input: FloatingSymbol[] | string[], count?: number): FloatingSymbol[] {
  const source: FloatingSymbol[] = typeof input[0] === 'string'
    ? (input as string[]).map(s => ({ symbol: s }))
    : (input as FloatingSymbol[]).map(s => ({ ...s }))

  const targetCount = count ?? source.length
  if (targetCount <= source.length) return source.slice(0, targetCount)

  // Cycle source if more items requested
  return Array.from({ length: targetCount }, (_, i) => {
    const base = source[i % source.length]
    return {
      symbol: base.symbol,
      left: base.left ?? rand(5, 90),
      top: base.top ?? rand(5, 90),
      size: base.size ?? rand(10, 18),
      duration: base.duration ?? rand(8, 20),
      delay: base.delay ?? rand(0, 10),
    }
  })
}

// ─── Keyframes (injected once) ────────────────────────────────

let styleInjected = false
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return
  styleInjected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fd-float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-12px) rotate(3deg); opacity: 0.6; }
    }
  `
  document.head.appendChild(style)
}

// ─── FloatingDecorations Component ────────────────────────────

/**
 * FloatingDecorations -- animated floating code symbols overlay.
 *
 * Renders configurable text symbols that drift gently in the background.
 * Pure CSS animation (no framer-motion dependency). Injects keyframes once.
 *
 * Extracted from Code-Realm where this pattern was duplicated 8+ times.
 *
 * @example
 * ```tsx
 * <FloatingDecorations
 *   symbols={['{ }', '< />', '#fff', 'rgb()', '=>', 'npm', 'css']}
 *   color="var(--muted-foreground)"
 * />
 * ```
 */
export const FloatingDecorations = forwardRef<HTMLDivElement, FloatingDecorationsProps>(
  ({ symbols, count, color, animated = true, className, ...props }, ref) => {
    // Inject animation keyframes once
    if (animated) injectStyles()

    const items = useMemo(() => normalizeSymbols(symbols, count), [symbols, count])

    return (
      <div
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        aria-hidden="true"
        {...props}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={cn(
              'absolute select-none font-mono text-xs opacity-30',
              animated && 'animate-[fd-float_var(--fd-duration)_ease-in-out_var(--fd-delay)_infinite]'
            )}
            style={{
              left: `${item.left ?? rand(5, 90)}%`,
              top: `${item.top ?? rand(5, 90)}%`,
              fontSize: `${item.size ?? rand(10, 18)}px`,
              '--fd-duration': `${item.duration ?? rand(8, 20)}s`,
              '--fd-delay': `${item.delay ?? rand(0, 10)}s`,
              color: color ?? 'inherit',
            } as React.CSSProperties}
          >
            {item.symbol}
          </span>
        ))}
      </div>
    )
  }
)
FloatingDecorations.displayName = 'FloatingDecorations'
