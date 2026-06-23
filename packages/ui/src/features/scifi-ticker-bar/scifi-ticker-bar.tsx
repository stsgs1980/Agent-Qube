'use client'
import { forwardRef, useId } from 'react'
import { cn } from '../../tokens/cn'

/** A single ticker item displayed in the scrolling bar. */
export interface TickerItem {
  /** Identifier / label text (e.g. "BTC", "BRENT") */
  label: string
  /** Primary value to display */
  value: string | number
  /** Percent or absolute change. Drives the green/red badge. */
  change?: number
  /** Optional prefix before the value (e.g. "$") */
  prefix?: string
}

export interface ScifiTickerBarProps {
  /** Ticker items to display */
  items: TickerItem[]
  /** Height of the ticker bar in px. @default 28 */
  height?: number
  /** Accent color. @default '#00e5ff' */
  color?: string
  /** Scroll animation mode. @default 'scroll' */
  animation?: 'scroll' | 'static'
  /** Background color. @default 'rgba(5,5,16,0.8)' */
  backgroundColor?: string
  /** Additional CSS classes */
  className?: string
}

// ─── Internal sub-components ──────────────────────────────────────

function TickerEntry({ item }: { item: TickerItem }) {
  const isPositive = (item.change ?? 0) > 0
  const isNegative = (item.change ?? 0) < 0
  const changeColor = isPositive ? 'text-[#22c55e]' : isNegative ? 'text-[#ff2244]' : 'text-[#7070a0]'
  const arrow = isPositive ? '▲' : isNegative ? '▼' : ''
  const displayValue = item.prefix != null ? `${item.prefix}${item.value}` : String(item.value)

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="font-mono text-[9px] tracking-[0.15em] text-[#505080] uppercase">
        {item.label}
      </span>
      <span className="font-mono text-[11px] font-semibold tabular-nums text-white">
        {displayValue}
      </span>
      {item.change != null && item.change !== 0 && (
        <span className={cn('font-mono text-[9px] tabular-nums', changeColor)}>
          {arrow} {isPositive ? '+' : ''}
          {item.change}
        </span>
      )}
    </span>
  )
}

function Separator({ color }: { color: string }) {
  return <span className="inline-block w-[3px] h-[3px] rounded-full shrink-0" style={{ backgroundColor: `${color}40` }} />
}

/**
 * ScifiTickerBar -- infinitely-scrolling sci-fi ticker bar.
 * Horizontal bar with labeled values and change indicators.
 * Items are duplicated for a seamless CSS-only infinite horizontal scroll.
 *
 * @example
 * ```tsx
 * <ScifiTickerBar items={[{ label: 'BTC', value: '67,432', change: 2.41, prefix: '$' }]} />
 * ```
 */
export const ScifiTickerBar = forwardRef<HTMLDivElement, ScifiTickerBarProps>(
  (
    {
      items,
      height = 28,
      color = '#00e5ff',
      animation = 'scroll',
      backgroundColor = 'rgba(5,5,16,0.8)',
      className,
    },
    ref,
  ) => {
    const instanceId = useId().replace(/:/g, '')
    const animName = `stb-scroll-${instanceId}`
    const isScroll = animation === 'scroll'
    const row = items.flatMap((item, i) =>
      i > 0
        ? [<Separator key={`sep-${i}`} color={color} />, <TickerEntry key={item.label} item={item} />]
        : [<TickerEntry key={item.label} item={item} />],
    )

    return (
      <>
        {isScroll && <style>{`@keyframes ${animName} { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>}
        <div
          ref={ref}
          data-slot="scifi-ticker-bar"
          role="marquee"
          aria-label="Scrolling ticker bar"
          className={cn('relative w-full flex items-center overflow-hidden', className)}
          style={{
            height: `${height}px`,
            backgroundColor,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="shrink-0 h-full w-[2px]"
            style={{ background: `linear-gradient(180deg, ${color}, ${color}33)` }}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-3 px-3" style={isScroll ? { animation: `${animName} 30s linear infinite`, width: 'max-content' } : undefined}>
              {row}
              {isScroll && row}
            </div>
          </div>
          <div
            className="shrink-0 h-full w-[2px]"
            style={{ background: `linear-gradient(180deg, ${color}33, ${color})` }}
          />
        </div>
      </>
    )
  },
)
ScifiTickerBar.displayName = 'ScifiTickerBar'
