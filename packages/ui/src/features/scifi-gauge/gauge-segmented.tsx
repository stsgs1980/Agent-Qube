'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../tokens/cn'
import type { SegmentedGaugeProps } from './types'

/**
 * GaugeSegmented -- multi-zone bar with needle or fill indicator.
 *
 * @example
 * ```tsx
 * <GaugeSegmented variant="segmented" value={62} height={32}
 *   segments={[
 *     { label: 'Low', from: 0, to: 33, color: '#10b981' },
 *     { label: 'High', from: 66, to: 100, color: '#ef4444' },
 *   ]} />
 * ```
 */
export const GaugeSegmented = forwardRef<HTMLDivElement, SegmentedGaugeProps>(
  ({
    value, color = '#00e5ff', duration = 1200, showValue, label, sublabel, className,
    segments, indicator = 'needle', height = 32,
  }, ref) => {
    const clamped = Math.max(0, Math.min(100, value))
    const activeIdx = segments.findIndex((s) => clamped >= s.from && clamped <= s.to)

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)}
        data-slot="gauge-segmented" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-xs text-white/50">{label}</span>}
            {showValue && (
              <span className="text-xs font-bold tabular-nums ml-auto"
                style={{ color, textShadow: `0 0 4px ${color}60` }}>{Math.round(clamped)}%</span>
            )}
          </div>
        )}
        <div className="relative flex rounded-md overflow-hidden" style={{ height, backgroundColor: 'rgba(255,255,255,0.03)' }}>
          {segments.map((seg, i) => (
            <div key={`s-${i}`} className="relative flex items-center justify-center transition-opacity duration-300"
              style={{
                width: `${seg.to - seg.from}%`, backgroundColor: seg.color,
                opacity: i === activeIdx ? 0.9 : 0.25,
                borderRight: i < segments.length - 1 ? '1px solid rgba(255,255,255,0.08)' : undefined,
              }}>
              <span className="text-[10px] font-medium truncate px-1"
                style={{
                  color: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                  textShadow: i === activeIdx ? `0 0 4px ${seg.color}` : undefined,
                }}>{seg.label}</span>
            </div>
          ))}
          {indicator === 'fill' && (
            <motion.div className="absolute inset-y-0 left-0 rounded-md pointer-events-none"
              style={{ background: `linear-gradient(90deg, ${color}60, ${color})`, boxShadow: `inset 0 0 12px ${color}40` }}
              initial={{ width: 0 }} animate={{ width: `${clamped}%` }}
              transition={{ duration: duration / 1000, ease: 'easeOut' }} />
          )}
          {indicator === 'needle' && (
            <motion.div className="absolute top-0 bottom-0 z-10" style={{ left: `${clamped}%` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: duration / 1000, ease: 'easeOut' }}>
              <div className="absolute -top-1.5 -translate-x-1/2" style={{
                width: 0, height: 0, borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent', borderTop: `5px solid ${color}`,
                filter: `drop-shadow(0 0 3px ${color})`,
              }} />
              <div className="absolute top-0 bottom-0 -translate-x-1/2"
                style={{ width: '2px', backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
              <div className="absolute -bottom-1.5 -translate-x-1/2" style={{
                width: 0, height: 0, borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent', borderBottom: `5px solid ${color}`,
                filter: `drop-shadow(0 0 3px ${color})`,
              }} />
            </motion.div>
          )}
        </div>
        {sublabel && <span className="text-[10px] text-white/25">{sublabel}</span>}
      </div>
    )
  },
)
GaugeSegmented.displayName = 'GaugeSegmented'
