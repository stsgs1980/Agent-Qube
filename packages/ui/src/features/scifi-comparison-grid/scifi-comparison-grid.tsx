'use client'

import { forwardRef, useState } from 'react'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'
import { ComparisonCard } from './comparison-card'
import type { ComparisonCardData as ComparisonCardType, SpreadItem } from './types'

// ─── Types ────────────────────────────────────────────────────

export interface ScifiComparisonGridProps {
  /** Cards to render in the grid */
  cards: ComparisonCardType[]
  /** Grid columns. Default: 2 */
  columns?: 2 | 3 | 4
  /** Optional spread comparison items rendered below the grid */
  spreads?: SpreadItem[]
  /** Additional CSS classes */
  className?: string
}

// ─── Column Map ───────────────────────────────────────────────

const colMap: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

// ─── ScifiComparisonGrid Component ────────────────────────────

/**
 * ScifiComparisonGrid -- grid of glass-morphism comparison cards with
 * optional spread/comparison bar section.
 *
 * Renders each card with sparkline, change badge, tags, and metrics.
 * An optional spreads section shows horizontal bars with labels and notes.
 *
 * @example
 * ```tsx
 * <ScifiComparisonGrid
 *   columns={3}
 *   cards={[
 *     { id: 'btc', name: 'Bitcoin', value: 67842, change: 2.4, trend: [60, 65, 63, 68] },
 *     { id: 'eth', name: 'Ethereum', value: 3450, change: -1.2, trend: [35, 34, 36, 33] },
 *   ]}
 *   spreads={[
 *     { id: 'spread', label: 'BTC-ETH Spread', value: 0.45, color: '#22c55e' },
 *   ]}
 * />
 * ```
 */
export const ScifiComparisonGrid = forwardRef<HTMLDivElement, ScifiComparisonGridProps>(
  ({ cards, columns = 2, spreads, className }, forwardedRef) => {
    const [hoveredSpread, setHoveredSpread] = useState<string | null>(null)

    return (
      <div
        ref={forwardedRef}
        data-slot="scifi-comparison-grid"
        className={cn('space-y-6', className)}
      >
        {/* Card grid */}
        <div className={cn('grid gap-4', colMap[columns])}>
          {cards.map((card) => (
            <ComparisonCard key={card.id} card={card} />
          ))}
        </div>

        {/* Spreads section */}
        {spreads && spreads.length > 0 && (
          <div
            className="rounded-sm border border-white/10 bg-white/[0.02] backdrop-blur-sm p-4"
            data-slot="spread-section"
          >
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Spreads &amp; Comparison
            </h3>
            <div className="space-y-3">
              {spreads.map((item) => {
                const { r, g, b } = hexToChannels(item.color ?? '#00e5ff')
                const isHovered = hoveredSpread === item.id
                return (
                  <div
                    key={item.id}
                    className="group"
                    onMouseEnter={() => setHoveredSpread(item.id)}
                    onMouseLeave={() => setHoveredSpread(null)}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span
                        className="font-medium text-slate-300 transition-colors"
                        style={{ color: isHovered ? item.color ?? '#00e5ff' : undefined }}
                      >
                        {item.label}
                      </span>
                      <span className="tabular-nums font-mono text-slate-400">
                        {item.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(2, Math.abs(item.value) * 10))}%`,
                          backgroundColor: item.color ?? '#00e5ff',
                          opacity: isHovered ? 1 : 0.7,
                        }}
                      />
                    </div>
                    {item.note && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.note}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
)
ScifiComparisonGrid.displayName = 'ScifiComparisonGrid'
