// ─── ScifiGauge Types ──────────────────────────────────────────

/** Discriminated union for gauge variants */
export type GaugeVariant = 'ring' | 'arc' | 'linear' | 'segmented'

/** Base props shared by all gauge variants */
export interface GaugeBaseProps {
  /** 0-100 percentage value
   *  @example value={72}
   */
  value: number

  /** Primary accent color (hex). Default: '#00e5ff'
   *  @example color="#10b981"
   */
  color?: string

  /** Animation duration in ms. Default: 1200
   *  @example duration={800}
   */
  duration?: number

  /** Show center value text. Default: false
   *  @example showValue
   */
  showValue?: boolean

  /** Label text below/beside gauge
   *  @example label="CPU Usage"
   */
  label?: string

  /** Sub-label text displayed beneath label
   *  @example sublabel="Real-time"
   */
  sublabel?: string

  /** Additional CSS classes
   *  @example className="w-48"
   */
  className?: string
}

/** Props for the ring (full-circle) gauge variant */
export interface RingGaugeProps extends GaugeBaseProps {
  variant: 'ring'
  /** Diameter in px. Default: 80
   *  @example size={120}
   */
  size?: number
  /** Track thickness in px. Default: 6
   *  @example strokeWidth={8}
   */
  strokeWidth?: number
  /** Color zone bands behind the arc
   *  @example zones={[{ from: 0, to: 40, color: '#10b981' }]}
   */
  zones?: Array<{ from: number; to: number; color: string }>
  /** Add inner glow ring. Default: false
   *  @example innerGlow
   */
  innerGlow?: boolean
}

/** Props for the arc (partial circle) gauge variant */
export interface ArcGaugeProps extends GaugeBaseProps {
  variant: 'arc'
  /** Diameter in px. Default: 200
   *  @example size={160}
   */
  size?: number
  /** Track thickness in px. Default: 10
   *  @example strokeWidth={14}
   */
  strokeWidth?: number
  /** Start angle in degrees. Default: 135
   *  @example startAngle={180}
   */
  startAngle?: number
  /** Total sweep in degrees. Default: 270
   *  @example sweep={180}
   */
  sweep?: number
  /** Gradient color stops for the arc
   *  @example gradient={[{ offset: 0, color: '#10b981' }, { offset: 1, color: '#f59e0b' }]}
   */
  gradient?: Array<{ offset: number; color: string }>
  /** Show tick marks around the arc. Default: false
   *  @example ticks
   */
  ticks?: boolean
  /** Show needle dot at current value position. Default: false
   *  @example needle
   */
  needle?: boolean
}

/** Props for the linear (horizontal bar) gauge variant */
export interface LinearGaugeProps extends GaugeBaseProps {
  variant: 'linear'
  /** Bar height in px. Default: 8
   *  @example height={12}
   */
  height?: number
  /** Show label text above bar. Default: false
   *  @example showLabel
   */
  showLabel?: boolean
  /** Add shimmer animation overlay. Default: false
   *  @example shimmer
   */
  shimmer?: boolean
  /** Vertical zone markers
   *  @example markers={[{ position: 50, color: '#f59e0b', label: 'warn' }]}
   */
  markers?: Array<{ position: number; color: string; label?: string }>
}

/** Props for the segmented gauge variant */
export interface SegmentedGaugeProps extends GaugeBaseProps {
  variant: 'segmented'
  /** Zone definitions
   *  @example segments={[{ label: 'Low', from: 0, to: 33, color: '#10b981' }]}
   */
  segments: Array<{ label: string; from: number; to: number; color: string }>
  /** Indicator style. Default: 'needle'
   *  @example indicator="fill"
   */
  indicator?: 'needle' | 'fill'
  /** Bar height in px. Default: 32
   *  @example height={24}
   */
  height?: number
}

/** Union of all gauge variant props */
export type ScifiGaugeProps =
  | RingGaugeProps
  | ArcGaugeProps
  | LinearGaugeProps
  | SegmentedGaugeProps
