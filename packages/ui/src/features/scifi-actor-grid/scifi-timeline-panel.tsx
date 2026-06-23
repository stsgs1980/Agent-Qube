'use client'

import { forwardRef, useState } from 'react'
import { cn } from '../../tokens/cn'
import type { TimelineEventEntry, EventSeverity } from './types'

// ─── Config ───────────────────────────────────────────────────

const SEV: Record<EventSeverity, string> = {
  low: '#22c55e', medium: '#eab308', high: '#ff6b00', critical: '#ff2244',
}

// ─── Props ────────────────────────────────────────────────────

/** A compact, expandable vertical timeline panel.
 * @example
 * ```tsx
 * <ScifiTimelinePanel title="Incident Log" events={[
 *   { id: '1', date: '2187.03.14', title: 'Treaty Signed', severity: 'high',
 *     description: 'All factions agreed to disarmament.' },
 * ]} />
 * ```
 */
export interface ScifiTimelinePanelProps {
  /** Timeline event entries */
  events: TimelineEventEntry[]
  /** Panel title. Default: `'Timeline'` */
  title?: string
  /** Accent colour for line and title. Default: `'#ff6b00'` */
  color?: string
  /** Additional CSS classes */
  className?: string
}

// ─── Component ────────────────────────────────────────────────

export const ScifiTimelinePanel = forwardRef<HTMLDivElement, ScifiTimelinePanelProps>(
  ({ events, title = 'Timeline', color: accent = '#ff6b00', className }, ref) => {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
      <section ref={ref} data-slot="scifi-timeline-panel" className={cn('space-y-3', className)}>
        <h3 className="text-sm font-mono uppercase tracking-widest" style={{ color: `${accent}cc` }}>
          {title}
        </h3>

        <div className="relative">
          {events.map((ev, idx) => {
            const dotColor = ev.severity ? SEV[ev.severity] : accent
            const open = expandedId === ev.id
            const hasDesc = !!ev.description
            const isLast = idx === events.length - 1

            return (
              <div key={ev.id}
                className={cn('relative pl-6', !isLast && 'pb-4')}
                onClick={hasDesc ? () => setExpandedId(open ? null : ev.id) : undefined}
                role={hasDesc ? 'button' : undefined}
                tabIndex={hasDesc ? 0 : undefined}
                onKeyDown={(e) => { if (hasDesc && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setExpandedId(open ? null : ev.id) } }}>

                {/* Connector line */}
                {!isLast && (
                  <span className="absolute left-[5px] top-2 bottom-0 w-px" aria-hidden="true"
                    style={{ backgroundColor: `${accent}20` }} />
                )}

                {/* Dot */}
                <span className={cn(
                  'absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 transition-shadow duration-300',
                )} style={{
                  borderColor: dotColor,
                  backgroundColor: open ? `${dotColor}40` : 'rgba(10,10,30,0.9)',
                  boxShadow: open ? `0 0 8px ${dotColor}60` : undefined,
                }} aria-hidden="true" />

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[10px] font-mono tabular-nums shrink-0"
                      style={{ color: `${accent}a0` }}>{ev.date}</span>
                    <span className="text-sm font-semibold text-white truncate">{ev.title}</span>
                  </div>

                  {hasDesc && (
                    <div className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      open ? 'mt-1.5 max-h-40 opacity-100' : 'max-h-0 opacity-0',
                    )}>
                      <p className="text-xs leading-relaxed text-white/50">{ev.description}</p>
                    </div>
                  )}

                  {hasDesc && !open && (
                    <span className="text-[9px] font-mono text-white/20 mt-0.5 block hover:text-white/40 transition-colors">
                      ▸ expand
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  },
)
ScifiTimelinePanel.displayName = 'ScifiTimelinePanel'
