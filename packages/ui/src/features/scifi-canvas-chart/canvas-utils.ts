/**
 * Pure Canvas 2D drawing utilities for ScifiCanvasChart.
 * No React hooks -- plain functions consumed by chart variant components.
 * @module scifi-canvas-chart/canvas-utils
 */

import type { ReferenceLine, ZoneFill } from './types'

export interface ChartPadding {
  top: number
  right: number
  bottom: number
  left: number
}

export const DEFAULT_PADDING: ChartPadding = { top: 20, right: 20, bottom: 30, left: 50 }

/** Setup canvas for HiDPI rendering, returns context and CSS-pixel dimensions */
export function setupCanvas(
  canvas: HTMLCanvasElement,
): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const ctx = canvas.getContext('2d')!
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  return { ctx, w: rect.width, h: rect.height }
}

/** Convert Y data value to canvas pixel Y (inverts axis: higher values at top) */
export function yToPixel(
  y: number, yMin: number, yMax: number, h: number, pad: ChartPadding,
): number {
  const chartH = h - pad.top - pad.bottom
  return pad.top + chartH * (1 - (y - yMin) / ((yMax - yMin) || 1))
}

/** Convert data index to canvas pixel X (evenly distributed) */
export function xToPixel(
  index: number, total: number, w: number, pad: ChartPadding,
): number {
  return pad.left + (index / ((total - 1) || 1)) * (w - pad.left - pad.right)
}

/** Draw horizontal grid lines with optional Y-axis labels */
export function drawGrid(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  pad: ChartPadding, yMin: number, yMax: number,
  steps: number, gridColor: string, fmt?: (v: number) => string,
): void {
  ctx.save()
  ctx.font = '10px monospace'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let i = 0; i <= steps; i++) {
    const val = yMin + (yMax - yMin) * (i / steps)
    const py = yToPixel(val, yMin, yMax, h, pad)
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pad.left, py)
    ctx.lineTo(w - pad.right, py)
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText(fmt ? fmt(val) : String(Math.round(val)), pad.left - 8, py)
  }
  ctx.restore()
}

/** Draw X-axis labels beneath chart, stepping by given step size */
export function drawXLabels(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  pad: ChartPadding, labels: string[], step: number,
): void {
  ctx.save()
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  for (let i = 0; i < labels.length; i += step) {
    ctx.fillText(labels[i], xToPixel(i, labels.length, w, pad), h - pad.bottom + 10)
  }
  ctx.restore()
}

/** Draw dashed horizontal reference lines with optional labels */
export function drawReferenceLines(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  pad: ChartPadding, yMin: number, yMax: number, lines: ReferenceLine[],
): void {
  ctx.save()
  ctx.font = '10px monospace'
  for (const line of lines) {
    const py = yToPixel(line.value, yMin, yMax, h, pad)
    ctx.strokeStyle = line.color
    ctx.lineWidth = 1
    ctx.setLineDash(line.dash ?? [6, 4])
    ctx.beginPath()
    ctx.moveTo(pad.left, py)
    ctx.lineTo(w - pad.right, py)
    ctx.stroke()
    ctx.setLineDash([])
    if (line.label) {
      ctx.fillStyle = line.color
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(line.label, pad.left + 4, py - 4)
    }
  }
  ctx.restore()
}

/** Draw translucent horizontal zone fills between two Y values */
export function drawZoneFills(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  pad: ChartPadding, yMin: number, yMax: number, zones: ZoneFill[],
): void {
  ctx.save()
  const chartW = w - pad.left - pad.right
  for (const zone of zones) {
    const yTop = yToPixel(zone.to, yMin, yMax, h, pad)
    const yBot = yToPixel(zone.from, yMin, yMax, h, pad)
    ctx.fillStyle = zone.color
    ctx.fillRect(pad.left, yTop, chartW, yBot - yTop)
  }
  ctx.restore()
}
