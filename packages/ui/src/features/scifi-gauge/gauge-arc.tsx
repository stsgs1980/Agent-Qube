'use client'

import { forwardRef, useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../tokens/cn'
import type { ArcGaugeProps } from './types'

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180
  const s = toRad(startDeg - 90), e = toRad(endDeg - 90)
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s)
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e)
  return `M ${x1} ${y1} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${x2} ${y2}`
}

/**
 * GaugeArc -- partial-circle arc gauge with gradient, ticks, and needle.
 *
 * @example
 * ```tsx
 * <GaugeArc variant="arc" value={65} gradient={[{ offset: 0, color: '#10b981' }]} ticks needle />
 * ```
 */
export const GaugeArc = forwardRef<SVGSVGElement, ArcGaugeProps>(
  ({
    value, color = '#00e5ff', duration = 1200, showValue, label, sublabel, className,
    size = 200, strokeWidth = 10, startAngle = 135, sweep = 270,
    gradient, ticks = false, needle = false,
  }, ref) => {
    const uid = useId()
    const cx = size / 2, cy = size / 2, r = (size - strokeWidth) / 2
    const clamped = Math.max(0, Math.min(100, value))
    const valueAngle = startAngle + (clamped / 100) * sweep
    const trackPath = describeArc(cx, cy, r, startAngle, startAngle + sweep)
    const valuePath = describeArc(cx, cy, r, startAngle, valueAngle)

    const needlePos = useMemo(() => {
      const rad = ((valueAngle - 90) * Math.PI) / 180
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
    }, [cx, cy, r, valueAngle])

    const tickMarks = useMemo(() => {
      if (!ticks) return []
      const count = Math.floor(sweep / 10)
      return Array.from({ length: count + 1 }, (_, i) => {
        const angle = startAngle + (i / count) * sweep
        const rad = ((angle - 90) * Math.PI) / 180
        const inner = r + strokeWidth / 2 + 1, outer = inner + 3
        return { x1: cx + inner * Math.cos(rad), y1: cy + inner * Math.sin(rad), x2: cx + outer * Math.cos(rad), y2: cy + outer * Math.sin(rad) }
      })
    }, [ticks, sweep, startAngle, cx, cy, r, strokeWidth])

    return (
      <div className={cn('inline-flex flex-col items-center gap-1', className)}>
        <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}50)` }} data-slot="gauge-arc" aria-hidden="true">
          <defs>
            {gradient && (
              <linearGradient id={`arc-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                {gradient.map((stop, i) => (
                  <stop key={`${uid}-gs-${i}`} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
                ))}
              </linearGradient>
            )}
          </defs>
          <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} strokeLinecap="round" />
          <motion.path d={valuePath} fill="none" stroke={gradient ? `url(#arc-grad-${uid})` : color}
            strokeWidth={strokeWidth} strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }} />
          {tickMarks.map((t, i) => (
            <line key={`${uid}-t-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          ))}
          {needle && (
            <motion.circle cx={needlePos.x} cy={needlePos.y} r={strokeWidth / 2 + 3}
              fill={color} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: duration / 1000, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
          )}
        </svg>
        {showValue && (
          <span className="text-2xl font-bold tabular-nums" style={{ color, textShadow: `0 0 8px ${color}80` }}>
            {Math.round(clamped)}%
          </span>
        )}
        {(label || sublabel) && (
          <div className="flex flex-col items-center leading-tight">
            {label && <span className="text-sm text-white/60">{label}</span>}
            {sublabel && <span className="text-xs text-white/30">{sublabel}</span>}
          </div>
        )}
      </div>
    )
  },
)
GaugeArc.displayName = 'GaugeArc'
