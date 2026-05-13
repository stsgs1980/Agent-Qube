'use client'

import { forwardRef } from 'react'
import type { ScifiGaugeProps } from './types'
import { GaugeRing } from './gauge-ring'
import { GaugeArc } from './gauge-arc'
import { GaugeLinear } from './gauge-linear'
import { GaugeSegmented } from './gauge-segmented'

/**
 * ScifiGauge -- sci-fi themed gauge/progress indicator with multiple variants.
 *
 * A discriminated-union component that renders one of four gauge styles based
 * on the `variant` prop: `ring` (full circle), `arc` (partial circle),
 * `linear` (horizontal bar), or `segmented` (multi-zone bar with needle).
 *
 * @example
 * ```tsx
 * // Ring variant
 * <ScifiGauge variant="ring" value={72} innerGlow showValue />
 *
 * // Arc variant with gradient and ticks
 * <ScifiGauge variant="arc" value={65} ticks needle size={160} />
 *
 * // Linear bar with shimmer
 * <ScifiGauge variant="linear" value={80} shimmer />
 *
 * // Segmented zones
 * <ScifiGauge
 *   variant="segmented"
 *   value={42}
 *   segments={[
 *     { label: 'Low', from: 0, to: 33, color: '#10b981' },
 *     { label: 'Mid', from: 33, to: 66, color: '#f59e0b' },
 *     { label: 'High', from: 66, to: 100, color: '#ef4444' },
 *   ]}
 * />
 * ```
 */
export const ScifiGauge = forwardRef<HTMLElement, ScifiGaugeProps>(
  (props, ref) => {
    switch (props.variant) {
      case 'ring':
        return <GaugeRing {...props} ref={ref as React.Ref<SVGSVGElement>} />
      case 'arc':
        return <GaugeArc {...props} ref={ref as React.Ref<SVGSVGElement>} />
      case 'linear':
        return <GaugeLinear {...props} ref={ref as React.Ref<HTMLDivElement>} />
      case 'segmented':
        return <GaugeSegmented {...props} ref={ref as React.Ref<HTMLDivElement>} />
    }
  },
)
ScifiGauge.displayName = 'ScifiGauge'
