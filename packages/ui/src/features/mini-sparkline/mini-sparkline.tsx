'use client'

import { forwardRef, useMemo, useId } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface MiniSparklineProps {
  /** Array of numeric data points (minimum 2 values required) */
  data: number[]
  /** Stroke color for positive trend (default "#00e5ff") */
  color?: string
  /** Stroke color for negative trend (default "#ff2244") */
  negativeColor?: string
  /** SVG width in pixels (default 80) */
  width?: number
  /** SVG height in pixels (default 30) */
  height?: number
  /** Whether the trend is positive (false uses negativeColor, default true) */
  isPositive?: boolean
  /** Show gradient fill under the line (default true) */
  showFill?: boolean
  /** Show drop-shadow glow (default true) */
  showGlow?: boolean
  /** Additional CSS classes */
  className?: string
}

// ─── MiniSparkline Component ──────────────────────────────────

/**
 * MiniSparkline -- tiny inline SVG sparkline chart.
 *
 * Renders a minimal area+line sparkline for embedding in cards, tables,
 * or dashboards. Automatically computes scale from data. Supports positive
 * and negative color modes, gradient fill, and a subtle glow filter.
 *
 * @example
 * ```tsx
 * <MiniSparkline
 *   data={[12, 19, 15, 25, 22, 30, 28]}
 *   color="#10b981"
 *   isPositive={true}
 * />
 * ```
 */
export const MiniSparkline = forwardRef<SVGSVGElement, MiniSparklineProps>(
  (
    {
      data,
      color = '#00e5ff',
      negativeColor = '#ff2244',
      width = 80,
      height = 30,
      isPositive = true,
      showFill = true,
      showGlow = true,
      className,
    },
    forwardedRef,
  ) => {
    const uid = useId()

    const { linePoints, fillPoints, strokeColor } = useMemo(() => {
      if (!data || data.length < 2) {
        return { linePoints: '', fillPoints: '', strokeColor: color }
      }

      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = max - min || 1
      const padding = 2
      const usableWidth = width - padding * 2
      const usableHeight = height - padding * 2

      const points = data.map((val, i) => {
        const x = padding + (i / (data.length - 1)) * usableWidth
        const y = padding + (1 - (val - min) / range) * usableHeight
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })

      const linePoints = points.join(' ')
      const fillPoints = `${padding},${height} ${linePoints} ${width - padding},${height}`
      const strokeColor = isPositive ? color : negativeColor

      return { linePoints, fillPoints, strokeColor }
    }, [data, color, negativeColor, width, height, isPositive])

    if (!data || data.length < 2) return null

    const gradientId = `spark-${uid}`
    const sc = strokeColor.replace('#', '')

    return (
      <svg
        ref={forwardedRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn('inline-block', className)}
        style={{ filter: showGlow ? `drop-shadow(0 0 3px ${strokeColor}50)` : undefined }}
        data-slot="mini-sparkline"
      >
        <defs>
          {showFill && (
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* Gradient fill under the line */}
        {showFill && (
          <polygon
            points={fillPoints}
            fill={`url(#${gradientId})`}
          />
        )}

        {/* Line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
)
MiniSparkline.displayName = 'MiniSparkline'
