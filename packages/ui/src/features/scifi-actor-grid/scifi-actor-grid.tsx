'use client'

import { forwardRef } from 'react'
import { cn } from '../../tokens/cn'
import type { Actor, StanceType } from './types'

// ─── Config ───────────────────────────────────────────────────

const STANCE: Record<StanceType, { color: string; label: string }> = {
  friendly:   { color: '#22c55e', label: 'FRIENDLY' },
  protective: { color: '#00e5ff', label: 'PROTECTIVE' },
  hostile:    { color: '#ff2244', label: 'HOSTILE' },
  neutral:    { color: '#7070a0', label: 'NEUTRAL' },
}

const COL_MAP: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

// ─── Props ────────────────────────────────────────────────────

/** A grid of entity / actor cards with stance badges and influence bars.
 * @example
 * ```tsx
 * <ScifiActorGrid columns={3} actors={[
 *   { id: '1', name: 'Earth Alliance', stance: 'protective', influence: 85 },
 * ]} />
 * ```
 */
export interface ScifiActorGridProps {
  /** Actor data to render */
  actors: Actor[]
  /** Column count. Default: `2` */
  columns?: 2 | 3 | 4
  /** Show influence bar on each card. Default: `true` */
  showInfluence?: boolean
  /** Accent colour (fallback when no stance). Default: `'#00e5ff'` */
  color?: string
  /** Additional CSS classes */
  className?: string
}

// ─── Component ────────────────────────────────────────────────

export const ScifiActorGrid = forwardRef<HTMLDivElement, ScifiActorGridProps>(
  ({ actors, columns = 2, showInfluence = true, color: fallback = '#00e5ff', className }, ref) => {
    return (
      <section ref={ref} data-slot="scifi-actor-grid" className={cn('space-y-4', className)}>
        <div className={cn('grid gap-4', COL_MAP[columns])}>
          {actors.map((a) => {
            const sc = a.stance ? STANCE[a.stance] : null
            const accent = sc?.color ?? fallback

            return (
              <article key={a.id} data-slot="actor-card"
                className="relative overflow-hidden rounded-md backdrop-blur-sm border border-white/[0.06] bg-[rgba(10,10,30,0.5)] p-4 transition-all duration-300 hover:border-[var(--a-s)] hover:shadow-[0_0_16px_var(--a-g)]"
                style={{ '--a-s': accent, '--a-g': `${accent}30` } as React.CSSProperties}>

                {/* Header */}
                <div className="flex items-start gap-3 min-w-0">
                  {a.icon && <span className="shrink-0 text-lg mt-0.5" aria-hidden="true">{a.icon}</span>}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm truncate">{a.name}</span>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider"
                        style={{ backgroundColor: `${accent}20`, color: accent }}>
                        {sc?.label ?? 'UNKNOWN'}
                      </span>
                    </div>
                    {a.role && <p className="text-xs text-white/40 mt-0.5 truncate">{a.role}</p>}
                  </div>
                </div>

                {/* Influence */}
                {showInfluence && a.influence != null && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Influence</span>
                      <span className="text-[11px] font-bold tabular-nums"
                        style={{ color: accent, textShadow: `0 0 6px ${accent}80` }}>
                        {Math.round(a.influence)}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: `${Math.max(0, Math.min(100, a.influence))}%`,
                          backgroundColor: accent, boxShadow: `0 0 8px ${accent}80` }} />
                    </div>
                  </div>
                )}

                {/* Description */}
                {a.description && (
                  <p className="mt-2 text-xs leading-relaxed text-white/50 line-clamp-2">{a.description}</p>
                )}
              </article>
            )
          })}
        </div>
      </section>
    )
  },
)
ScifiActorGrid.displayName = 'ScifiActorGrid'
