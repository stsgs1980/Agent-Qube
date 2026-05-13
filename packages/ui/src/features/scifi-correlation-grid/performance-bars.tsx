'use client'

import { forwardRef, useMemo } from 'react'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'
import type { PerformanceBar } from './types'

// ─── Types ─────────────────────────────────────────────────

export interface PerformanceBarsProps {
  /** Bar definitions */
  bars: PerformanceBar[]
  /** Bar height in px. Default: 24 */
  height?: number
  /** Show value text at the end of the bar. Default: true */
  showValues?: boolean
  /** Additional CSS classes */
  className?: string
}

// ─── Helpers ───────────────────────────────────────────────

const DEFAULT_POS = '#22c55e'
const DEFAULT_NEG = '#ff2244'

// ─── Component ─────────────────────────────────────────────

/**
 * PerformanceBars — simple horizontal bar chart with gradient fill and glow.
 *
 * @example
 * ```tsx
 * <PerformanceBars
 *   bars={[
 *     { label: 'Energy', value: 8.2 },
 *     { label: 'Finance', value: -1.2 },
 *   ]}
 * />
 * ```
 */
export const PerformanceBars = forwardRef<HTMLDivElement, PerformanceBarsProps>(
  ({ bars, height = 24, showValues = true, className }, ref) => {
    const maxAbs = useMemo(() => Math.max(...bars.map((b) => Math.abs(b.value)), 1), [bars])

    return (
      <div ref={ref} data-slot="performance-bars" className={cn('flex flex-col gap-2', className)}>
        {bars.map((bar, i) => {
          const isPos = bar.value >= 0
          const hex = bar.color ?? (isPos ? DEFAULT_POS : DEFAULT_NEG)
          const { r, g, b } = hexToChannels(hex)
          const pct = Math.min(100, (Math.abs(bar.value) / maxAbs) * 100)

          return (
            <div key={i}>
              {/* Label row */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-mono truncate" style={{ color: 'rgba(160,160,192,0.85)' }}>
                  {bar.label}
                </span>
                {showValues && (
                  <span className="text-[11px] font-mono font-bold shrink-0 ml-2" style={{ color: hex }}>
                    {isPos ? '+' : ''}{bar.value}
                  </span>
                )}
              </div>

              {/* Bar */}
              <div
                className="w-full overflow-hidden"
                style={{ height, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}
              >
                <div
                  className="transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: 2,
                    background: isPos
                      ? `linear-gradient(90deg, rgba(${r},${g},${b},0.35), rgba(${r},${g},${b},0.8))`
                      : `linear-gradient(90deg, rgba(${r},${g},${b},0.8), rgba(${r},${g},${b},0.35))`,
                    boxShadow: `0 0 8px rgba(${r},${g},${b},0.25)`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  },
)

PerformanceBars.displayName = 'PerformanceBars'
