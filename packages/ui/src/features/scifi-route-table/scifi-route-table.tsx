'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────
/** Risk severity level */
export type RouteRisk = 'low' | 'medium' | 'high' | 'critical'

/** A single route / connection row */
export interface RouteItem {
  id: string
  from: string
  to: string
  volume?: string
  risk?: RouteRisk
  status?: string
  share?: number
}

export interface ScifiRouteTableProps {
  /** Route items to display */
  items: RouteItem[]
  /** Show progress bar for share values. Default: true */
  showShareBar?: boolean
  /** Accent color. Default: '#00e5ff' */
  color?: string
  /** Label text */
  label?: string
  /** Additional CSS classes */
  className?: string
}

// ─── Config ───────────────────────────────────────────────────

const RISK: Record<RouteRisk, string> = {
  low: '#22c55e', medium: '#eab308', high: '#ff6b00', critical: '#ff2244',
}

const ROW_V = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

/** Hex #rrggbb → "r,g,b" */
const rgb = (h: string) => {
  const v = parseInt(h.slice(1), 16)
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`
}

// ─── Component ────────────────────────────────────────────────
/** ScifiRouteTable — sci-fi styled table of routes with risk badges & share bars.
 * @example `<ScifiRouteTable items={[{ id: '1', from: 'Earth', to: 'Mars', risk: 'low', share: 65 }]} color="#00e5ff" />` */
export const ScifiRouteTable = forwardRef<HTMLDivElement, ScifiRouteTableProps>(
  ({ items, showShareBar = true, color = '#00e5ff', label, className }, ref) => {
    const flags = {
      vol: items.some((i) => i.volume),
      risk: items.some((i) => i.risk),
      stat: items.some((i) => i.status),
      share: showShareBar && items.some((i) => i.share != null),
    }
    const cols = `1fr${flags.vol ? ' auto' : ''}${flags.risk ? ' auto' : ''}${flags.stat ? ' auto' : ''}`
    const hdrCls = 'px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-widest text-[#505070] border-b border-[rgba(255,255,255,0.06)]'

    return (
      <div ref={ref} data-slot="scifi-route-table"
        className={cn(
          'rounded-md overflow-hidden max-h-[420px] overflow-y-auto',
          'bg-[rgba(8,8,24,0.55)] backdrop-blur-md border border-[rgba(255,255,255,0.06)]',
          'scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.08)] scrollbar-track-transparent',
          className,
        )}>
        {label && (
          <div className="px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
          </div>
        )}

        {/* Header */}
        <div className={cn('grid items-center gap-2', hdrCls)} style={{ gridTemplateColumns: cols }}>
          <span>Route</span>
          {flags.vol && <span className="text-right">Vol</span>}
          {flags.risk && <span className="text-center">Risk</span>}
          {flags.stat && <span className="text-right">Status</span>}
        </div>

        {/* Rows */}
        {items.map((it, idx) => {
          const rc = it.risk ? RISK[it.risk] : null
          return (
            <motion.div key={it.id} custom={idx} variants={ROW_V} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              className="grid items-center gap-2 px-4 py-2.5 text-xs font-mono transition-colors duration-150 hover:bg-[rgba(255,255,255,0.03)]"
              style={{ gridTemplateColumns: cols, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate text-[#b0b0c8]">{it.from}</span>
                <ArrowRight className="w-3 h-3 shrink-0 text-[#3a3a5c]" />
                <span className="truncate text-[#d0d0e0] font-medium">{it.to}</span>
              </div>
              {flags.vol && <span className="text-right text-[#808098] tabular-nums">{it.volume ?? '—'}</span>}
              {flags.risk && (
                <span className="inline-flex justify-center px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: rc ?? '#505070', backgroundColor: rc ? `rgba(${rgb(rc)},0.12)` : 'transparent', border: rc ? `1px solid rgba(${rgb(rc)},0.25)` : '1px solid rgba(255,255,255,0.06)' }}>
                  {it.risk ?? '—'}
                </span>
              )}
              {flags.stat && <span className="text-right text-[#808098] tabular-nums">{it.status ?? '—'}</span>}
            </motion.div>
          )
        })}

        {/* Share bars */}
        {flags.share && (
          <div className="px-4 pb-3 pt-1 space-y-1.5">
            {items.map((it) => {
              const pct = Math.min(100, Math.max(0, it.share ?? 0))
              return (
                <div key={`b-${it.id}`} className="flex items-center gap-2 text-[9px] font-mono text-[#505070]">
                  <span className="w-20 truncate">{it.from}→{it.to}</span>
                  <div className="flex-1 h-[6px] rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)`, boxShadow: `0 0 6px ${color}40` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums">{pct}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  },
)
ScifiRouteTable.displayName = 'ScifiRouteTable'
