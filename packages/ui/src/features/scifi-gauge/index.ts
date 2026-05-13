// ─── ScifiGauge Barrel Export ──────────────────────────────────

// Types
export type {
  GaugeVariant,
  GaugeBaseProps,
  RingGaugeProps,
  ArcGaugeProps,
  LinearGaugeProps,
  SegmentedGaugeProps,
  ScifiGaugeProps,
} from './types'

// Main component (variant router)
export { ScifiGauge } from './scifi-gauge'

// Individual variant components
export { GaugeRing } from './gauge-ring'
export { GaugeArc } from './gauge-arc'
export { GaugeLinear } from './gauge-linear'
export { GaugeSegmented } from './gauge-segmented'
