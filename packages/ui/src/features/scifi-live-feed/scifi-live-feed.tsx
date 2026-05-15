'use client'

import { forwardRef, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { cn } from '../../tokens/cn'

/** A single entry in the live feed */
export interface FeedItem {
  /** Unique identifier */
  id: string
  /** Display label (e.g. "BRENT", "CPU Load") */
  label: string
  /** Current value string (e.g. "$102.40", "78%") */
  value: string
  /** Numeric change value; positive = green, negative = red */
  change?: number
  /** ISO / locale timestamp string */
  timestamp: string
  /** Severity level. Default: 'info' */
  severity?: 'info' | 'warning' | 'critical'
}

export interface ScifiLiveFeedProps {
  /** Initial feed items */
  items?: FeedItem[]
  /** Auto-generate new items at this interval (ms). 0 = no auto. Default: 0 */
  autoInterval?: number
  /** Called to generate the next item. If omitted, no auto-generation. */
  generateItem?: () => FeedItem
  /** Max visible items before oldest are removed. Default: 20 */
  maxItems?: number
  /** Section label text */
  label?: string
  /** Additional CSS classes */
  className?: string
}

const SEV_COLOR: Record<string, string> = { info: '#00e5ff', warning: '#eab308', critical: '#ff2244' }
const A = '#00e5ff'

/**
 * ScifiLiveFeed — generalized live-updating data feed with severity indicators,
 * change badges, and a pause/resume control.
 *
 * @example
 * ```tsx
 * <ScifiLiveFeed label="Prices" autoInterval={3000} generateItem={myGen} />
 * ```
 */
export const ScifiLiveFeed = forwardRef<HTMLDivElement, ScifiLiveFeedProps>(
  ({ items: initItems, autoInterval = 0, generateItem, maxItems = 20, label, className }, ref) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>(initItems ?? [])
    const [isPaused, setIsPaused] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (isPaused || !autoInterval || !generateItem) return
      const id = setInterval(() => {
        setFeedItems(prev => [generateItem(), ...prev.slice(0, maxItems - 1)])
      }, autoInterval)
      return () => clearInterval(id)
    }, [isPaused, autoInterval, generateItem, maxItems])

    const renderRow = (item: FeedItem, i: number) => {
      const dc = SEV_COLOR[item.severity ?? 'info']
      const pos = (item.change ?? 0) >= 0
      return (
        <motion.div
          key={item.id}
          initial={i === 0 ? { opacity: 0, x: -12, backgroundColor: `${A}10` } : undefined}
          animate={i === 0 ? { opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' } : undefined}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-3 px-4 py-2 text-xs transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dc, boxShadow: `0 0 6px ${dc}60` }} />
            <span className="shrink-0 font-bold tracking-wide" style={{ color: dc }}>{item.label}</span>
            <span className="truncate font-mono text-white/70">{item.value}</span>
            {item.change != null && (
              <span className={cn('shrink-0 rounded px-1 py-0.5 font-mono text-[10px] font-bold', pos ? 'text-emerald-400' : 'text-red-400')}
                style={{ backgroundColor: pos ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)' }}>
                {pos ? '+' : ''}{item.change.toFixed(2)}
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-[10px]" style={{ color: '#505080' }}>{item.timestamp}</span>
        </motion.div>
      )
    }

    return (
      <div ref={ref} data-slot="scifi-live-feed" className={cn('rounded-lg border overflow-hidden', className)}
        style={{ background: 'rgba(10,10,30,0.5)', borderColor: `${A}1f` }}>
        <div className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: `${A}20`, backgroundColor: `${A}08` }}>
          <div className="flex items-center gap-2">
            {label && <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: A }}>{label}</span>}
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
              style={{ backgroundColor: `${A}15`, color: A }}>{feedItems.length}</span>
          </div>
          {generateItem && (
            <button onClick={() => setIsPaused(p => !p)}
              className="flex h-7 w-7 items-center justify-center rounded-md border transition-colors hover:bg-white/5"
              style={{ borderColor: isPaused ? '#ff6b0060' : `${A}30`, color: isPaused ? '#ff6b00' : A }}
              aria-label={isPaused ? 'Resume feed' : 'Pause feed'} aria-pressed={isPaused}>
              {isPaused ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
        <div ref={scrollRef} className="max-h-64 overflow-y-auto scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
          {feedItems.length === 0
            ? <div className="py-10 text-center font-mono text-xs" style={{ color: '#505080' }}>Awaiting data&hellip;</div>
            : <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>{feedItems.map(renderRow)}</div>}
        </div>
      </div>
    )
  },
)

ScifiLiveFeed.displayName = 'ScifiLiveFeed'
