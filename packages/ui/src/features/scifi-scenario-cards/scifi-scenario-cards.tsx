'use client'

import { forwardRef } from 'react'
import { cn } from '../../tokens/cn'
import type { Scenario, ScenarioSeverity } from './types'

// ─── Config ───────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<ScenarioSeverity, { color: string; label: string }> = {
  low: { color: '#22c55e', label: 'LOW' },
  medium: { color: '#eab308', label: 'MEDIUM' },
  high: { color: '#ff6b00', label: 'HIGH' },
  critical: { color: '#ff2244', label: 'CRITICAL' },
}

const GRID_COLS: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1', 2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4',
}

// ─── Props ────────────────────────────────────────────────────

/**
 * A grid or list of scenario cards with probability ring charts and severity badges.
 *
 * @example
 * ```tsx
 * <ScifiScenarioCards label="Threats" columns={2}
 *   scenarios={[{ id: '1', name: 'Signal Loss', description: 'Comms disrupted',
 *     probability: 65, severity: 'high' }]} />
 * ```
 */
export interface ScifiScenarioCardsProps {
  /** Scenarios to display */
  scenarios: Scenario[]
  /** Layout: 'grid' for card grid, 'list' for vertical list. Default: 'grid' */
  layout?: 'grid' | 'list'
  /** Columns count for grid layout. Default: 2 */
  columns?: 1 | 2 | 3 | 4
  /** Show probability ring chart on each card. Default: true */
  showProbability?: boolean
  /** Label text for section header */
  label?: string
  /** Additional CSS classes */
  className?: string
}

// ─── Probability ring ─────────────────────────────────────────

function Ring({ value, color }: { value: number; color: string }) {
  const S = 48, sw = 4, r = (S - sw) / 2, c = S / 2
  const circ = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="relative shrink-0" style={{ width: S, height: S }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} className="-rotate-90" aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ - (v / 100) * circ}
          strokeLinecap="round" className="transition-[stroke-dashoffset] duration-700 ease-out" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-white"
        style={{ textShadow: `0 0 6px ${color}80` }}>{Math.round(v)}</span>
    </div>
  )
}

// ─── Severity badge ───────────────────────────────────────────

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${color}20`, color }}>{label}</span>
  )
}

// ─── Component ────────────────────────────────────────────────

export const ScifiScenarioCards = forwardRef<HTMLDivElement, ScifiScenarioCardsProps>(
  ({ scenarios, layout = 'grid', columns = 2, showProbability = true, label, className }, ref) => {
    return (
      <section ref={ref} data-slot="scifi-scenario-cards" className={cn('space-y-4', className)}>
        {label && (
          <h3 className="text-sm font-mono uppercase tracking-widest text-white/50">{label}</h3>
        )}
        <div className={cn(layout === 'grid' ? cn('grid gap-4', GRID_COLS[columns]) : 'flex flex-col gap-3')}>
          {scenarios.map((s) => {
            const color = s.color ?? (s.severity ? SEVERITY_CONFIG[s.severity].color : '#00e5ff')
            const sev = s.severity ? SEVERITY_CONFIG[s.severity] : null
            const isGrid = layout === 'grid'
            return (
              <article key={s.id} data-slot="scenario-card"
                className={cn(
                  'relative overflow-hidden rounded-md backdrop-blur-sm',
                  'border border-white/[0.06] bg-[rgba(10,10,30,0.5)] p-4',
                  'transition-all duration-300',
                  'hover:border-[var(--sc)] hover:shadow-[0_0_16px_var(--sc-glow)]',
                  isGrid ? '' : 'flex items-center gap-4',
                )}
                style={{ '--sc': color, '--sc-glow': `${color}30` } as React.CSSProperties}
              >
                {showProbability && <Ring value={s.probability} color={color} />}
                <div className={cn('flex-1 min-w-0', isGrid ? 'space-y-1' : 'flex items-center gap-3')}>
                  <div className={cn('flex items-center gap-2 flex-wrap min-w-0',
                    isGrid ? '' : 'flex-1')}>
                    <span className="font-semibold text-white text-sm truncate">{s.name}</span>
                    {sev && <Badge color={sev.color} label={sev.label} />}
                    {!isGrid && s.impact && (
                      <span className="shrink-0 text-xs text-white/40 font-mono">{s.impact}</span>
                    )}
                  </div>
                  {isGrid && (
                    <>
                      <p className="text-xs leading-relaxed text-white/50 line-clamp-2">{s.description}</p>
                      {s.impact && (
                        <span className="text-[11px] font-mono text-white/40">{s.impact}</span>
                      )}
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    )
  },
)
ScifiScenarioCards.displayName = 'ScifiScenarioCards'
