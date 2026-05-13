/**
 * Barrel exports for the scifi-canvas-chart feature.
 *
 * Re-exports all chart variant components, shared types, and
 * canvas drawing utilities for convenient importing.
 *
 * @module scifi-canvas-chart
 */

// ─── Components ───────────────────────────────────────────────
export { ScifiCanvasChart } from './scifi-canvas-chart'
export { ChartArea } from './chart-area'
export { ChartBar } from './chart-bar'
export { ChartMultiLine } from './chart-multi-line'

// ─── Types ────────────────────────────────────────────────────
export type {
  DataPoint,
  Series,
  ChartType,
  ReferenceLine,
  ZoneFill,
  ChartBaseProps,
  AreaChartProps,
  LineChartProps,
  BarChartProps,
  MultiLineChartProps,
  ScifiCanvasChartProps,
} from './types'

// ─── Canvas Utilities ─────────────────────────────────────────
export {
  setupCanvas,
  DEFAULT_PADDING,
  drawGrid,
  drawXLabels,
  drawReferenceLines,
  drawZoneFills,
  yToPixel,
  xToPixel,
} from './canvas-utils'
export type { ChartPadding } from './canvas-utils'
