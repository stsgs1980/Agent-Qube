'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

/** A single key-metric displayed in a card */
export interface StatMetric {
  id: string
  label: string
  value: number | string
  suffix?: string
  prefix?: string
  color?: string
}

/** A horizontal linear gauge entry (0-100) */
export interface GaugeEntry {
  label: string
  value: number
  color?: string
}

/** Props for ScifiStatsSection */
export interface ScifiStatsSectionProps {
  title?: string
  subtitle?: string
  label?: string
  metrics: StatMetric[]
  gauges?: GaugeEntry[]
  children?: React.ReactNode
  color?: string
  className?: string
}

// ─── Gauge Bar (internal) ────────────────────────────────────

function GaugeBar({ entry, accent }: { entry: GaugeEntry; accent: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const c = entry.color ?? accent
  const v = Math.max(0, Math.min(100, entry.value))

  return (
    <div ref={ref} className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-white/50 truncate">{entry.label}</span>
        <span className="text-xs font-bold tabular-nums shrink-0"
          style={{ color: c, textShadow: `0 0 4px ${c}60` }}>{Math.round(v)}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden bg-white/[0.06]">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{
          width: visible ? `${v}%` : '0%',
          background: `linear-gradient(90deg, ${c}80, ${c})`,
          boxShadow: `0 0 8px ${c}60, 0 0 16px ${c}30`,
        }} />
      </div>
    </div>
  )
}

// ─── ScifiStatsSection ───────────────────────────────────────

/**
 * Sci-fi styled metrics overview with optional gauge bars.
 *
 * Renders a header (label / title / subtitle), a responsive grid of
 * glass-morphism metric cards, an optional row of gauge bars, and a children slot.
 *
 * @example
 * ```tsx
 * <ScifiStatsSection
 *   label="analytics" title="Key Metrics"
 *   metrics={[{ id: '1', label: 'Revenue', value: 2400000, prefix: '$' }]}
 *   gauges={[{ label: 'CPU', value: 72 }]}
 * />
 * ```
 */
export const ScifiStatsSection = forwardRef<HTMLDivElement, ScifiStatsSectionProps>(
  ({ title, subtitle, label, metrics, gauges, children, color = '#00e5ff', className }, ref) => (
    <section ref={ref} data-slot="scifi-stats-section" className={cn('space-y-6', className)}>
      {(label || title || subtitle) && (
        <div className="space-y-2">
          {label && (
            <span className="block font-mono text-xs sm:text-sm uppercase tracking-widest text-white/50">
              {label}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
          )}
          {subtitle && (
            <p className="font-mono text-sm sm:text-base text-white/40 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((m) => {
          const c = m.color ?? color
          return (
            <div key={m.id} data-slot="stat-metric" className={cn(
              'relative overflow-hidden rounded-lg p-4 sm:p-5',
              'border border-white/[0.06] bg-[rgba(10,10,30,0.5)] backdrop-blur-sm',
              'transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]',
            )}>
              <span className="block text-xs font-mono text-white/40 mb-2 truncate">{m.label}</span>
              <div className="flex items-baseline gap-0.5">
                {m.prefix && <span className="text-sm font-semibold text-white/60">{m.prefix}</span>}
                <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight"
                  style={{ color: c, textShadow: `0 0 8px ${c}40` }}>{m.value}</span>
                {m.suffix && <span className="text-sm font-semibold text-white/60">{m.suffix}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {gauges && gauges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gauges.map((g, i) => <GaugeBar key={`${g.label}-${i}`} entry={g} accent={color} />)}
        </div>
      )}

      {children && <div className="mt-2">{children}</div>}
    </section>
  ),
)
ScifiStatsSection.displayName = 'ScifiStatsSection'
