'use client'

import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export type ActivityKind = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface ActivityEntry {
  /** Unique identifier */
  id: string
  /** Activity description */
  description: string
  /** Activity kind for icon/color mapping */
  kind?: ActivityKind
  /** Timestamp (Date object or ISO string) */
  timestamp: Date | string
  /** Optional extra content */
  detail?: string
}

export interface ActivityTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Activity entries to display */
  entries: ActivityEntry[]
  /** Heading above the timeline */
  heading?: string
  /** Maximum entries to show */
  maxItems?: number
  /** Empty state message */
  emptyMessage?: string
  /** Icon renderer per kind */
  renderIcon?: (kind: ActivityKind) => ReactNode
}

// ─── Helpers ──────────────────────────────────────────────────

const kindColors: Record<ActivityKind, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-green-500/15 text-green-600 dark:text-green-400',
  warning: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  error: 'bg-red-500/15 text-red-600 dark:text-red-400',
  info: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
}

function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

const kindPaths: Record<ActivityKind, string> = {
  default: 'M5 12h14M12 5v14',
  success: 'M20 6L9 17l-5-5',
  warning: 'M12 9v4M12 17h.01',
  error: 'M18 6L6 18M6 6l12 12',
  info: 'M12 16v-4M12 8h.01',
}

// ─── ActivityTimeline Component ───────────────────────────────

/**
 * ActivityTimeline -- vertical timeline with color-coded entries and relative timestamps.
 * Layer 4: Stateful (useMemo for maxItems). Extracted from Component-Browser.
 *
 * @example
 * ```tsx
 * <ActivityTimeline
 *   entries={[
 *     { id: '1', description: 'Deployed v2.3', kind: 'success', timestamp: new Date() },
 *   ]}
 * />
 * ```
 */
export const ActivityTimeline = forwardRef<HTMLDivElement, ActivityTimelineProps>(
  ({ entries, heading, maxItems, emptyMessage = 'No activity yet', renderIcon, className, ...props }, ref) => {
    const visible = useMemo(() => maxItems ? entries.slice(0, maxItems) : entries, [entries, maxItems])

    if (visible.length === 0) {
      return (
        <div ref={ref} className={cn('py-8 text-center text-sm text-muted-foreground', className)} {...props}>
          {emptyMessage}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('py-6', className)} {...props}>
        {heading && <h3 className="mb-4 text-sm font-semibold text-foreground">{heading}</h3>}
        <div className="relative">
          <div className="absolute bottom-0 left-[7px] top-2 w-px bg-border" />
          <div className="flex flex-col gap-4">
            {visible.map(entry => {
              const kind = entry.kind ?? 'default'
              return (
                <div key={entry.id} className="relative flex gap-3 pl-1">
                  <span className={cn(
                    'relative z-10 mt-1 flex size-[15px] shrink-0 items-center justify-center rounded-full',
                    kindColors[kind],
                  )}>
                    {renderIcon ? renderIcon(kind) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="h-3 w-3">
                        <path d={kindPaths[kind]} />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{entry.description}</p>
                    {entry.detail && <p className="mt-0.5 text-xs text-muted-foreground">{entry.detail}</p>}
                    <time className="mt-0.5 block text-[11px] text-muted-foreground/70">{relativeTime(entry.timestamp)}</time>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)
ActivityTimeline.displayName = 'ActivityTimeline'
