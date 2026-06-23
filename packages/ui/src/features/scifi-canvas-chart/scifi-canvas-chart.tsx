'use client'

/**
 * Main entry point for ScifiCanvasChart.
 *
 * A thin discriminated-union switch that delegates to the correct
 * chart variant based on the `type` prop. Exported as a forwardRef
 * component so consumers always import a single name.
 *
 * @module scifi-canvas-chart/scifi-canvas-chart
 */

import { forwardRef } from 'react'
import { cn } from '../../tokens/cn'
import type { ScifiCanvasChartProps } from './types'
import { ChartArea } from './chart-area'
import { ChartBar } from './chart-bar'
import { ChartMultiLine } from './chart-multi-line'

/**
 * ScifiCanvasChart -- unified sci-fi chart component.
 *
 * Accepts a discriminated `type` prop and delegates to the correct
 * Canvas 2D renderer (area, line, bar, or multiLine). All variants
 * share common base props for grid, reference lines, zone fills,
 * animation, and hover interaction.
 *
 * @example
 * ```tsx
 * // Area chart
 * <ScifiCanvasChart
 *   type="area"
 *   data={[{ x: 'A', y: 10 }, { x: 'B', y: 30 }]}
 *   color="#00e5ff"
 * />
 *
 * // Bar chart
 * <ScifiCanvasChart
 *   type="bar"
 *   data={[10, 25, 15, 40]}
 *   color="#ff6b00"
 * />
 *
 * // Multi-line chart
 * <ScifiCanvasChart
 *   type="multiLine"
 *   series={[
 *     { name: 'S1', values: [1, 2, 3] },
 *     { name: 'S2', values: [3, 1, 4], color: '#a855f7' },
 *   ]}
 *   xLabels={['Q1', 'Q2', 'Q3']}
 * />
 * ```
 */
export const ScifiCanvasChart = forwardRef<HTMLCanvasElement, ScifiCanvasChartProps>(
  (props, ref) => {
    const { type, className } = props

    const chart = (() => {
      switch (type) {
        case 'area':
        case 'line':
          return <ChartArea ref={ref} {...props} />
        case 'bar':
          return <ChartBar ref={ref} {...props} />
        case 'multiLine':
          return <ChartMultiLine ref={ref} {...props} />
        default:
          return null
      }
    })()

    return (
      <div className={cn('relative w-full', className)} data-slot="scifi-canvas-chart">
        {chart}
      </div>
    )
  },
)
ScifiCanvasChart.displayName = 'ScifiCanvasChart'
