'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../tokens/cn'

export type EventImportance = 'critical' | 'high' | 'medium' | 'low'

export interface TimelineEvent {
  /** Unique identifier */
  id: string
  /** Display date string */
  date: string
  /** Event title */
  title: string
  /** Optional description text */
  description?: string
  /** Category label (e.g., "Geopolitics", "Market") */
  category?: string
  /** Category badge color. Default derived from importance */
  categoryColor?: string
  /** Importance level. Default: 'medium' */
  importance?: EventImportance
}

export interface ScifiTimelineProps {
  /** Events to display in chronological order */
  events: TimelineEvent[]
  /** Accent color for the timeline line and dots. Default: '#00e5ff' */
  color?: string
  /** Show alternating layout on desktop. Default: true */
  alternating?: boolean
  /** Label text for the timeline section header */
  label?: string
  /** Additional CSS classes */
  className?: string
}

const IMP: Record<EventImportance, { color: string; glow: string }> = {
  critical: { color: '#ff2244', glow: '#ff224466' },
  high:     { color: '#ff6b00', glow: '#ff6b0066' },
  medium:   { color: '#eab308', glow: '#eab30866' },
  low:      { color: '#22c55e', glow: '#22c55e66' },
}

/**
 * ScifiTimeline — alternating-side vertical timeline with event cards,
 * importance indicators, and category badges.
 *
 * @example
 * ```tsx
 * <ScifiTimeline
 *   events={[{ id: '1', date: 'Jan 15', title: 'Product Launch', importance: 'critical' }]}
 *   color="#00e5ff"
 *   label="Roadmap"
 * />
 * ```
 */
export const ScifiTimeline = forwardRef<HTMLDivElement, ScifiTimelineProps>(
  ({ events, color = '#00e5ff', alternating = true, label, className }, ref) => (
    <div ref={ref} data-slot="scifi-timeline" className={cn('py-12 px-4', className)}>
      <div className="mx-auto max-w-5xl">
        {label && (
          <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest"
            style={{ color, textShadow: `0 0 10px ${color}40` }}>{label}</h3>
        )}
        <div className="relative">
          <div className="absolute bottom-0 left-[11px] top-0 w-[2px] md:left-1/2 md:-translate-x-[1px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}20, ${color}40, ${color}20, transparent)`,
              boxShadow: `0 0 12px ${color}30, 0 0 4px ${color}20`,
            }} />
          <div className="flex flex-col gap-6 sm:gap-8">
            {events.map((ev, i) => {
              const imp = ev.importance ?? 'medium'
              const { color: ic, glow: ig } = IMP[imp]
              const even = i % 2 === 0, crit = imp === 'critical', cc = ev.categoryColor ?? ic
              return (
                <motion.div key={ev.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('relative flex items-start', alternating && (even ? 'md:flex-row' : 'md:flex-row-reverse'))}>
                  <div className={cn(
                    'hidden w-[140px] shrink-0 flex-col items-center md:flex',
                    alternating && even && 'pr-6 text-right',
                    alternating && !even && 'pl-6 text-left',
                    !alternating && 'pr-6 text-right',
                  )}>
                    <span className="text-sm font-bold tracking-wider"
                      style={{ color, textShadow: `0 0 10px ${color}40` }}>{ev.date}</span>
                    <span className="mt-0.5 font-mono text-[10px]" style={{ color: ic }}>{imp.toUpperCase()}</span>
                  </div>
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                    {crit && <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute h-6 w-6 rounded-full"
                      style={{ backgroundColor: `${ic}30`, border: `1px solid ${ic}40` }} />}
                    <div className={cn('h-3 w-3 shrink-0 rounded-full border', crit && 'animate-pulse')}
                      style={{ backgroundColor: crit ? ic : `${ic}cc`, borderColor: ic, boxShadow: `0 0 8px ${ig}` }} />
                  </div>
                  <div className={cn('flex-1 pl-3', alternating && (even ? 'md:pl-6' : 'md:pr-6'), !alternating && 'md:pl-6')}>
                    <div className="mb-1.5 md:hidden">
                      <span className="text-xs font-bold tracking-wider"
                        style={{ color, textShadow: `0 0 10px ${color}40` }}>{ev.date}</span>
                    </div>
                    <div className="rounded-lg border p-4" style={{
                      background: 'rgba(10,10,30,0.5)',
                      borderColor: 'rgba(255,255,255,0.06)',
                      boxShadow: crit ? `0 0 16px ${ig}` : undefined,
                    }}>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-white sm:text-base">{ev.title}</h3>
                          {ev.category && (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              style={{ backgroundColor: `${cc}20`, color: cc, border: `1px solid ${cc}40` }}>
                              {ev.category}
                            </span>
                          )}
                        </div>
                        {ev.description && <p className="text-xs leading-relaxed text-white/50 sm:text-sm">{ev.description}</p>}
                        <div className="mt-1 flex items-center gap-1.5 md:hidden">
                          <div className={cn('h-2 w-2 shrink-0 rounded-full', crit && 'animate-pulse')}
                            style={{ backgroundColor: ic, boxShadow: `0 0 6px ${ig}` }} />
                          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: ic }}>{imp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  ),
)

ScifiTimeline.displayName = 'ScifiTimeline'
