'use client'

import { forwardRef, useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../tokens/cn'
import type { RingGaugeProps } from './types'

/**
 * GaugeRing -- full-circle ring gauge with optional zones and glow.
 *
 * @example
 * ```tsx
 * <GaugeRing variant="ring" value={72} size={80} innerGlow
 *   zones={[{ from: 0, to: 40, color: '#10b981' }]} />
 * ```
 */
export const GaugeRing = forwardRef<SVGSVGElement, RingGaugeProps>(
  ({
    value, color = '#00e5ff', duration = 1200, showValue, label, sublabel, className,
    size = 80, strokeWidth = 6, zones, innerGlow = false,
  }, ref) => {
    const uid = useId()
    const r = (size - strokeWidth) / 2, cx = size / 2, cy = size / 2
    const circ = 2 * Math.PI * r
    const clamped = Math.max(0, Math.min(100, value))
    const offset = circ - (clamped / 100) * circ

    return (
      <div className={cn('inline-flex flex-col items-center gap-1', className)}>
        <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90" style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
          data-slot="gauge-ring" aria-hidden="true">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          {zones?.map((zone, i) => {
            const zStart = (zone.from / 100) * circ, zLen = ((zone.to - zone.from) / 100) * circ
            return (
              <circle key={`${uid}-z-${i}`} cx={cx} cy={cy} r={r} fill="none"
                stroke={zone.color} strokeOpacity={0.25} strokeWidth={strokeWidth}
                strokeDasharray={`${zLen} ${circ}`} strokeDashoffset={-zStart} strokeLinecap="butt" />
            )
          })}
          {innerGlow && (
            <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
              strokeOpacity={0.15} strokeWidth={strokeWidth + 6} strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
              transition={{ duration: duration / 1000, ease: 'easeOut' }} strokeLinecap="round" />
          )}
          <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }} strokeLinecap="round" />
          <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
            strokeOpacity={0.4} strokeWidth={Math.max(1, strokeWidth - 2)} strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }}
            strokeLinecap="round" style={{ filter: 'blur(2px)' }} />
        </svg>
        {showValue && (
          <span className="absolute text-sm font-bold tabular-nums"
            style={{ color, textShadow: `0 0 6px ${color}80` }}>{Math.round(clamped)}</span>
        )}
        {(label || sublabel) && (
          <div className="flex flex-col items-center leading-tight">
            {label && <span className="text-xs text-white/60">{label}</span>}
            {sublabel && <span className="text-[10px] text-white/30">{sublabel}</span>}
          </div>
        )}
      </div>
    )
  },
)
GaugeRing.displayName = 'GaugeRing'
