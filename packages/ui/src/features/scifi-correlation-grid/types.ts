/**
 * Types for the ScifiCorrelationGrid feature.
 *
 * @example
 * ```ts
 * const data: CorrelationData = {
 *   assets: [{ label: 'Alpha' }, { label: 'Beta' }],
 *   matrix: [[1, 0.5], [0.5, 1]],
 * }
 * ```
 */

// ─── Matrix ─────────────────────────────────────────────────

/** Row / column header entry
 * @example `{ label: 'WTI', shortLabel: 'W' }`
 */
export interface MatrixAsset {
  /** Display label */
  label: string
  /** Short label used in tight layouts. Falls back to `label`. */
  shortLabel?: string
}

/** Complete correlation matrix payload
 * @example
 * ```ts
 * { assets: [{ label: 'A' }, { label: 'B' }], matrix: [[1, 0.3], [0.3, 1]] }
 * ```
 */
export interface CorrelationData {
  /** Ordered list of row/column headers (length must equal matrix NxN) */
  assets: MatrixAsset[]
  /** Square matrix of correlation values in [-1, 1] */
  matrix: number[][]
}

// ─── Performance Bars ───────────────────────────────────────

/** A single horizontal bar
 * @example `{ label: 'Energy', value: 8.2, color: '#22c55e' }`
 */
export interface PerformanceBar {
  /** Bar label */
  label: string
  /** Numeric value (positive or negative) */
  value: number
  /** Override bar colour. Default: green for positive, red for negative. */
  color?: string
}
