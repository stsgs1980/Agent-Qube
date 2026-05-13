/**
 * Shared types for ScifiCanvasChart component family.
 * @module scifi-canvas-chart/types
 */

/** Single data point for line/area charts */
export interface DataPoint {
  /** X-axis label (date string, number, or category name) */
  x: string | number
  /** Y-axis numeric value */
  y: number
}

/** Multi-series data for overlay charts */
export interface Series {
  /** Series name for legend */
  name: string
  /** Data values (same length as xLabels) */
  values: number[]
  /** Override color for this series */
  color?: string
  /** Optional confidence band values (same length as values) */
  confidence?: number[]
}

/** Chart type discriminator */
export type ChartType = 'area' | 'line' | 'bar' | 'multiLine'

/** Reference line drawn horizontally across the chart */
export interface ReferenceLine {
  value: number
  color: string
  dash?: number[]
  label?: string
}

/** Zone fill (horizontal band between two Y values) */
export interface ZoneFill {
  from: number
  to: number
  color: string
}

/** Base props shared by all chart types */
export interface ChartBaseProps {
  xLabels?: string[]
  xLabelStep?: number
  yLabelFormatter?: (v: number) => string
  yMin?: number
  yMax?: number
  showGrid?: boolean
  gridColor?: string
  gridSteps?: number
  referenceLines?: ReferenceLine[]
  zoneFills?: ZoneFill[]
  height?: string
  hoverable?: boolean
  onHover?: (index: number | null, point: DataPoint | null) => void
  animate?: boolean
  animateDuration?: number
  className?: string
}

/** Props for the area chart variant */
export interface AreaChartProps extends ChartBaseProps {
  type: 'area'
  data: DataPoint[]
  color?: string
  lineWidth?: number
  glow?: boolean
}

/** Props for the line chart variant */
export interface LineChartProps extends ChartBaseProps {
  type: 'line'
  data: DataPoint[]
  color?: string
  lineWidth?: number
  glow?: boolean
}

/** Props for the bar chart variant */
export interface BarChartProps extends ChartBaseProps {
  type: 'bar'
  data: number[]
  color?: string
  barColorFn?: (index: number, value: number) => string
  barRatio?: number
}

/** Props for the multi-line chart variant */
export interface MultiLineChartProps extends ChartBaseProps {
  type: 'multiLine'
  series: Series[]
  defaultColors?: string[]
  lineWidth?: number
  showConfidence?: boolean
  showLegend?: boolean
  glow?: boolean
}

/** Discriminated union of all chart variant props */
export type ScifiCanvasChartProps =
  | AreaChartProps
  | LineChartProps
  | BarChartProps
  | MultiLineChartProps
