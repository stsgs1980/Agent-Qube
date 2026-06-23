/**
 * Types for the ScifiComparisonGrid feature.
 *
 * @example
 * ```ts
 * const card: ComparisonCard = {
 *   id: 'btc',
 *   name: 'Bitcoin',
 *   region: 'Global',
 *   value: 67842,
 *   change: 2.4,
 *   trend: [60, 62, 58, 65, 67, 63, 67],
 * }
 * ```
 */

// ─── Comparison Card ──────────────────────────────────────────

/** Metric row rendered inside a comparison card
 * @example `{ label: 'Volume', value: '12.3B', bar: 78 }`
 */
export interface MetricRow {
  /** Metric label */
  label: string
  /** Display value */
  value: string | number
  /** Progress bar percentage 0–100 (optional) */
  bar?: number
  /** Override bar colour. Defaults to card accent color. */
  barColor?: string
}

/** A single card in the comparison grid
 * @example
 * ```ts
 * { id: '1', name: 'ETH', value: 3450, trend: [30, 32, 31, 34, 33, 34] }
 * ```
 */
export interface ComparisonCardData {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Region or subtitle (muted, small) */
  region?: string
  /** Current value displayed as the main number */
  value: number
  /** Trend sparkline data points */
  trend?: number[]
  /** Change value — positive or negative for green/red badge */
  change?: number
  /** Tag badges rendered as small colored pills */
  tags?: Array<{ label: string; color?: string }>
  /** Extra metric rows rendered below the main value */
  metrics?: MetricRow[]
  /** Accent colour. Default: '#00e5ff' */
  color?: string
}

// ─── Spread Item ──────────────────────────────────────────────

/** A spread/comparison bar item shown in the optional section
 * @example `{ id: 'bid-ask', label: 'Bid-Ask Spread', value: 0.12, color: '#22c55e' }`
 */
export interface SpreadItem {
  /** Unique identifier */
  id: string
  /** Label text */
  label: string
  /** Numeric value */
  value: number
  /** Bar accent colour. Default: '#00e5ff' */
  color?: string
  /** Optional note rendered in muted text */
  note?: string
}
