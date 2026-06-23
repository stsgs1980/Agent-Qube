'use client'

import { forwardRef, useRef, useEffect } from 'react'
import { cn } from '../../tokens/cn'
import type { AreaChartProps, LineChartProps } from './types'
import { useAnimateProgress } from './use-animate-progress'
import {
  setupCanvas, DEFAULT_PADDING, drawGrid,
  drawXLabels, drawReferenceLines, drawZoneFills,
  yToPixel, xToPixel,
} from './canvas-utils'

type AreaLineProps = AreaChartProps | LineChartProps

/**
 * ChartArea -- sci-fi area or line chart using Canvas 2D.
 *
 * @example
 * ```tsx
 * <ChartArea type="area" data={[{ x: 'Jan', y: 30 }, { x: 'Feb', y: 50 }]} color="#00e5ff" />
 * ```
 */
export const ChartArea = forwardRef<HTMLCanvasElement, AreaLineProps>(
  (props, forwardedRef) => {
    const {
      type, data, color = '#00e5ff', lineWidth = 2, glow = true,
      xLabels, xLabelStep, yLabelFormatter, yMin, yMax,
      showGrid = true, gridColor = 'rgba(0, 229, 255, 0.06)', gridSteps = 5,
      referenceLines, zoneFills, height = '200px',
      hoverable = false, onHover, animate = true, animateDuration = 2000,
      className,
    } = props

    const internalRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = (forwardedRef as React.RefObject<HTMLCanvasElement>) ?? internalRef
    const { progress } = useAnimateProgress(animate ? animateDuration : 0)

    function draw() {
      const canvas = canvasRef.current
      if (!canvas || !data || data.length < 2) return
      const { ctx, w, h } = setupCanvas(canvas)
      const pad = DEFAULT_PADDING
      const values = data.map((d) => d.y)
      const lo = yMin ?? Math.min(...values)
      const hi = yMax ?? Math.max(...values)
      const isArea = type === 'area'
      const count = Math.max(2, Math.ceil(data.length * progress))

      if (zoneFills?.length) drawZoneFills(ctx, w, h, pad, lo, hi, zoneFills)
      if (showGrid) drawGrid(ctx, w, h, pad, lo, hi, gridSteps, gridColor, yLabelFormatter)
      if (referenceLines?.length) drawReferenceLines(ctx, w, h, pad, lo, hi, referenceLines)

      const labels = xLabels ?? data.map((d) => String(d.x))
      drawXLabels(ctx, w, h, pad, labels, xLabelStep ?? Math.max(1, Math.ceil(labels.length / 8)))

      if (isArea) {
        const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom)
        grad.addColorStop(0, color + '30')
        grad.addColorStop(1, color + '00')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(xToPixel(0, data.length, w, pad), h - pad.bottom)
        for (let i = 0; i < count; i++) {
          ctx.lineTo(xToPixel(i, data.length, w, pad), yToPixel(data[i].y, lo, hi, h, pad))
        }
        ctx.lineTo(xToPixel(count - 1, data.length, w, pad), h - pad.bottom)
        ctx.closePath()
        ctx.fill()
      }

      ctx.save()
      if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10 }
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineJoin = 'round'
      ctx.beginPath()
      for (let i = 0; i < count; i++) {
        const px = xToPixel(i, data.length, w, pad)
        const py = yToPixel(data[i].y, lo, hi, h, pad)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.restore()

      if (count > 0) {
        const last = data[count - 1]
        const lx = xToPixel(count - 1, data.length, w, pad)
        const ly = yToPixel(last.y, lo, hi, h, pad)
        ctx.save()
        if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 8 }
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(lx, ly, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    useEffect(() => { draw() })

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!hoverable || !canvasRef.current || !data) return
      const rect = canvasRef.current.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const pad = DEFAULT_PADDING
      const chartW = rect.width - pad.left - pad.right
      const idx = Math.round(((mx - pad.left) / chartW) * (data.length - 1))
      onHover?.(idx >= 0 && idx < data.length ? idx : null, idx >= 0 && idx < data.length ? data[idx] : null)
    }

    return (
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height }}
        className={cn('block', className)}
        data-slot="scifi-canvas-area"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => onHover?.(null, null)}
      />
    )
  },
)
ChartArea.displayName = 'ChartArea'
