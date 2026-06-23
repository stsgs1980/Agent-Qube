'use client'

import { forwardRef, useMemo, useId } from 'react'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'
import type { ComparisonCardData as ComparisonCardType } from './types'

// ─── Sparkline Sub-component ─────────────────────────────────

/** Inline SVG sparkline — viewBox 0 0 100 30, auto-scaled to data range. */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const uid = useId()
  const { line, fill } = useMemo(() => {
    if (data.length < 2) return { line: '', fill: '' }
    const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
    const pad = 2, w = 96, h = 26
    const pts = data.map((v, i) =>
      `${(pad + (i / (data.length - 1)) * w).toFixed(1)},${(pad + (1 - (v - min) / range) * h).toFixed(1)}`,
    )
    return { line: pts.join(' '), fill: `${pad},30 ${pts.join(' ')} ${pad + w},30` }
  }, [data])

  if (!line) return null
  const gid = `cg-${uid}`
  return (
    <svg viewBox="0 0 100 30" className="w-full h-8" data-slot="sparkline">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}50)` }} />
    </svg>
  )
}

// ─── ComparisonCard Component ─────────────────────────────────

/** Props for the ComparisonCard sub-component. */
export interface ComparisonCardProps {
  /** Card data */
  card: ComparisonCardType
  /** Additional CSS classes */
  className?: string
}

/**
 * ComparisonCard -- glass-morphism card with value, sparkline, tags, and metrics.
 *
 * @example
 * ```tsx
 * <ComparisonCard card={{ id: '1', name: 'BTC', value: 67842, change: 2.4 }} />
 * ```
 */
export const ComparisonCard = forwardRef<HTMLDivElement, ComparisonCardProps>(
  ({ card, className }, forwardedRef) => {
    const { r, g, b } = hexToChannels(card.color ?? '#00e5ff')
    const isPositive = (card.change ?? 0) >= 0
    const accent = card.color ?? '#00e5ff'

    return (
      <div ref={forwardedRef} data-slot="comparison-card"
        className={cn('relative overflow-hidden backdrop-blur-sm rounded-sm p-4', className)}
        style={{
          backgroundColor: 'rgba(10, 10, 26, 0.8)',
          border: `1px solid rgba(${r}, ${g}, ${b}, 0.3)`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.3), 0 0 15px rgba(${r}, ${g}, ${b}, 0.08)`,
        }}>
        {/* Header */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-base font-bold tracking-tight truncate" style={{ color: accent }}>
            {card.name}
          </span>
          {card.region && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">{card.region}</span>
          )}
        </div>

        {/* Value + change */}
        <div className="flex items-end gap-2 mt-2">
          <span className="text-2xl font-bold tabular-nums leading-none" style={{ color: '#e2e8f0' }}>
            {card.value.toLocaleString()}
          </span>
          {card.change != null && (
            <span className={cn(
              'inline-flex items-center text-xs font-mono px-1.5 py-0.5 rounded-sm',
              isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400',
            )}>
              {isPositive ? '+' : ''}{card.change.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Sparkline */}
        {card.trend && card.trend.length >= 2 && (
          <div className="mt-3"><Sparkline data={card.trend} color={accent} /></div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {card.tags.map((t: { label: string; color?: string }) => {
              const tc = t.color ?? accent
              return (
                <span key={t.label} className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm"
                  style={{ backgroundColor: `${tc}20`, color: tc, border: `1px solid ${tc}40` }}>
                  {t.label}
                </span>
              )
            })}
          </div>
        )}

        {/* Metrics */}
        {card.metrics && card.metrics.length > 0 && (
          <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: `rgba(${r}, ${g}, ${b}, 0.15)` }}>
            {card.metrics.map((m: { label: string; value: string | number; bar?: number; barColor?: string }) => (
              <div key={m.label} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-16 shrink-0 truncate">{m.label}</span>
                <span className="tabular-nums text-slate-300">{m.value}</span>
                {m.bar != null && (
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, m.bar))}%`, backgroundColor: m.barColor ?? accent }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
)
ComparisonCard.displayName = 'ComparisonCard'
