'use client'

import { forwardRef } from 'react'
import { cn } from '../../tokens/cn'
import { CorrelationMatrix } from './correlation-matrix'
import { PerformanceBars } from './performance-bars'
import type { CorrelationData, PerformanceBar } from './types'

// ─── Types ─────────────────────────────────────────────────

export interface ScifiCorrelationGridProps {
  /** Correlation matrix data */
  data: CorrelationData
  /** Optional performance bars shown alongside the matrix */
  performanceBars?: PerformanceBar[]
  /** Layout mode. Default: 'split' */
  layout?: 'matrix' | 'split'
  /** Additional CSS classes */
  className?: string
}

// ─── Component ─────────────────────────────────────────────

/**
 * ScifiCorrelationGrid — combines a correlation matrix with optional performance bars.
 *
 * @example
 * ```tsx
 * <ScifiCorrelationGrid
 *   data={{
 *     assets: [{ label: 'Alpha' }, { label: 'Beta' }],
 *     matrix: [[1, 0.5], [0.5, 1]],
 *   }}
 *   performanceBars={[{ label: 'Sector A', value: 8.2 }]}
 *   layout="split"
 * />
 * ```
 */
export const ScifiCorrelationGrid = forwardRef<HTMLDivElement, ScifiCorrelationGridProps>(
  ({ data, performanceBars, layout = 'split', className }, ref) => {
    const { assets, matrix } = data
    const showBars = layout === 'split' && performanceBars && performanceBars.length > 0

    return (
      <div
        ref={ref}
        data-slot="scifi-correlation-grid"
        className={cn(
          'grid gap-6',
          showBars ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1',
          className,
        )}
      >
        {/* Matrix column */}
        <div className="overflow-x-auto">
          <CorrelationMatrix assets={assets} matrix={matrix} />
        </div>

        {/* Bars column */}
        {showBars && (
          <PerformanceBars bars={performanceBars!} />
        )}
      </div>
    )
  },
)

ScifiCorrelationGrid.displayName = 'ScifiCorrelationGrid'
