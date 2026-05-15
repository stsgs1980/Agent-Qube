// ScifiCorrelationGrid feature

// ─── Types ─────────────────────────────────────────────────
export type {
  MatrixAsset,
  CorrelationData,
  PerformanceBar,
} from './types'

// ─── Sub-components ────────────────────────────────────────
export { CorrelationMatrix } from './correlation-matrix'
export type { CorrelationMatrixProps } from './correlation-matrix'

export { PerformanceBars } from './performance-bars'
export type { PerformanceBarsProps } from './performance-bars'

// ─── Main composite ────────────────────────────────────────
export { ScifiCorrelationGrid } from './scifi-correlation-grid'
export type { ScifiCorrelationGridProps } from './scifi-correlation-grid'
