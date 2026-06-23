'use client'

import { forwardRef, useRef, useEffect } from 'react'
import { cn } from '../../tokens/cn'
import type { BarChartProps } from './types'
import { useAnimateProgress } from './use-animate-progress'
import {
  setupCanvas, DEFAULT_PADDING, drawGrid,
  drawXLabels, drawReferenceLines, drawZoneFills, yToPixel,
} from './canvas-utils'

/**
 * ChartBar -- sci-fi bar chart using Canvas 2D.
 *
 * @example
 * ```tsx
 * <ChartBar type="bar" data={[12, 19, 8, 25]} color="#ff6b00" xLabels={['Mon','Tue','Wed','Thu']} />
 * ```
 */
export const ChartBar = forwardRef<HTMLCanvasElement, BarChartProps>(
  (props, forwardedRef) => {
    const {
      data, color = '#ff6b00', barColorFn, barRatio = 0.7,
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
      if (!canvas || !data || data.length === 0) return
      const { ctx, w, h } = setupCanvas(canvas)
      const pad = DEFAULT_PADDING
      const lo = yMin ?? 0
      const hi = yMax ?? Math.max(...data, 1)

      if (zoneFills?.length) drawZoneFills(ctx, w, h, pad, lo, hi, zoneFills)
      if (showGrid) drawGrid(ctx, w, h, pad, lo, hi, gridSteps, gridColor, yLabelFormatter)
      if (referenceLines?.length) drawReferenceLines(ctx, w, h, pad, lo, hi, referenceLines)

      const labels = xLabels ?? data.map((_, i) => String(i))
      drawXLabels(ctx, w, h, pad, labels, xLabelStep ?? Math.max(1, Math.ceil(labels.length / 10)))

      const chartW = w - pad.left - pad.right
      const slotW = chartW / data.length
      const barW = slotW * barRatio
      const baseline = yToPixel(lo, lo, hi, h, pad)

      for (let i = 0; i < data.length; i++) {
        const val = data[i] * progress
        const barColor = barColorFn ? barColorFn(i, data[i]) : color
        const barTop = yToPixel(val, lo, hi, h, pad)
        const bx = pad.left + slotW * i + (slotW - barW) / 2
        const grad = ctx.createLinearGradient(bx, barTop, bx, baseline)
        grad.addColorStop(0, barColor)
        grad.addColorStop(1, barColor + '44')
        ctx.fillStyle = grad

        const radius = Math.min(barW / 2, 4)
        ctx.beginPath()
        ctx.moveTo(bx + radius, barTop)
        ctx.lineTo(bx + barW - radius, barTop)
        ctx.quadraticCurveTo(bx + barW, barTop, bx + barW, barTop + radius)
        ctx.lineTo(bx + barW, baseline)
        ctx.lineTo(bx, baseline)
        ctx.lineTo(bx, barTop + radius)
        ctx.quadraticCurveTo(bx, barTop, bx + radius, barTop)
        ctx.closePath()
        ctx.fill()

        ctx.save()
        ctx.shadowColor = barColor
        ctx.shadowBlur = 6
        ctx.strokeStyle = barColor
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(bx + radius, barTop)
        ctx.lineTo(bx + barW - radius, barTop)
        ctx.stroke()
        ctx.restore()
      }
    }

    useEffect(() => { draw() })

    return (
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height }}
        className={cn('block', className)}
        data-slot="scifi-canvas-bar"
      />
    )
  },
)
ChartBar.displayName = 'ChartBar'
