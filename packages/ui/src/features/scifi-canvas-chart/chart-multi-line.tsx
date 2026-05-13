'use client'

import { forwardRef, useRef, useEffect } from 'react'
import { cn } from '../../tokens/cn'
import type { MultiLineChartProps } from './types'
import { useAnimateProgress } from './use-animate-progress'
import {
  setupCanvas, DEFAULT_PADDING, drawGrid,
  drawXLabels, drawReferenceLines, drawZoneFills,
  yToPixel, xToPixel,
} from './canvas-utils'

const PALETTE = ['#00e5ff', '#ff6b00', '#a855f7', '#22c55e', '#eab308', '#ff2244']

/**
 * ChartMultiLine -- sci-fi multi-line chart using Canvas 2D.
 *
 * @example
 * ```tsx
 * <ChartMultiLine type="multiLine"
 *   series={[{ name: 'Alpha', values: [10, 20, 30] }]}
 *   xLabels={['Q1', 'Q2', 'Q3']} showLegend />
 * ```
 */
export const ChartMultiLine = forwardRef<HTMLCanvasElement, MultiLineChartProps>(
  (props, forwardedRef) => {
    const {
      series, defaultColors = PALETTE, lineWidth = 2,
      showConfidence = true, showLegend = true, glow = true,
      xLabels, xLabelStep, yLabelFormatter, yMin, yMax,
      showGrid = true, gridColor = 'rgba(0, 229, 255, 0.06)', gridSteps = 5,
      referenceLines, zoneFills, height = '200px',
      animate = true, animateDuration = 2000, className,
    } = props

    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (forwardedRef as React.RefObject<HTMLCanvasElement>) ?? internalRef
    const { progress } = useAnimateProgress(animate ? animateDuration : 0)

    function draw() {
      const canvas = canvasRef.current
      if (!canvas || !series || series.length === 0) return
      const { ctx, w, h } = setupCanvas(canvas)
      const pad = { ...DEFAULT_PADDING }

      const allVals = series.flatMap((s) => s.values)
      const allConf = series.flatMap((s) => s.confidence ?? [])
      const lo = yMin ?? Math.min(...allVals, ...allConf)
      const hi = yMax ?? Math.max(...allVals, ...allConf, 1)
      const pointCount = series[0]?.values.length ?? 0
      if (showLegend) pad.top = 36
      const count = Math.max(2, Math.ceil(pointCount * progress))

      if (zoneFills?.length) drawZoneFills(ctx, w, h, pad, lo, hi, zoneFills)
      if (showGrid) drawGrid(ctx, w, h, pad, lo, hi, gridSteps, gridColor, yLabelFormatter)
      if (referenceLines?.length) drawReferenceLines(ctx, w, h, pad, lo, hi, referenceLines)

      const labels = xLabels ?? Array.from({ length: pointCount }, (_, i) => String(i))
      drawXLabels(ctx, w, h, pad, labels, xLabelStep ?? Math.max(1, Math.ceil(labels.length / 8)))

      series.forEach((s, si) => {
        const sc = s.color ?? defaultColors[si % defaultColors.length]
        if (showConfidence && s.confidence && count > 0) {
          ctx.fillStyle = sc + '15'
          ctx.beginPath()
          for (let i = 0; i < count; i++) {
            const px = xToPixel(i, pointCount, w, pad)
            const py = yToPixel(s.values[i] + s.confidence![i], lo, hi, h, pad)
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
          }
          for (let i = count - 1; i >= 0; i--) {
            ctx.lineTo(xToPixel(i, pointCount, w, pad), yToPixel(s.values[i] - s.confidence![i], lo, hi, h, pad))
          }
          ctx.closePath()
          ctx.fill()
        }

        ctx.save()
        if (glow) { ctx.shadowColor = sc; ctx.shadowBlur = 8 }
        ctx.strokeStyle = sc
        ctx.lineWidth = lineWidth
        ctx.lineJoin = 'round'
        ctx.beginPath()
        for (let i = 0; i < count; i++) {
          const px = xToPixel(i, pointCount, w, pad)
          const py = yToPixel(s.values[i], lo, hi, h, pad)
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.stroke()
        ctx.restore()

        if (count > 0) {
          ctx.fillStyle = sc
          ctx.beginPath()
          ctx.arc(xToPixel(count - 1, pointCount, w, pad), yToPixel(s.values[count - 1], lo, hi, h, pad), 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      if (showLegend) {
        ctx.save()
        ctx.font = '11px monospace'
        let lx = pad.left
        const ly = 14
        series.forEach((s, si) => {
          const sc = s.color ?? defaultColors[si % defaultColors.length]
          ctx.fillStyle = sc
          ctx.fillRect(lx, ly - 5, 12, 3)
          ctx.fillStyle = 'rgba(255,255,255,0.6)'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(s.name, lx + 16, ly - 3)
          lx += ctx.measureText(s.name).width + 30
        })
        ctx.restore()
      }
    }

    useEffect(() => { draw() })

    return (
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height }}
        className={cn('block', className)}
        data-slot="scifi-canvas-multi-line"
      />
    )
  },
)
ChartMultiLine.displayName = 'ChartMultiLine'
