'use client'

import { forwardRef, useState } from 'react'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'

// ─── Types ────────────────────────────────────────────────────

/** Visual style variant
 * @example `'outline'`
 */
export type BadgeVariant = 'filled' | 'outline' | 'hex' | 'laser'

/** Size preset
 * @example `'md'`
 */
export type BadgeSize = 'xs' | 'sm' | 'md'

/** Predefined severity / status preset
 * @example `'critical'`
 */
export type BadgePreset = 'critical' | 'high' | 'medium' | 'low' | 'active' | 'monitoring' | 'resolved'

export interface ScifiBadgeProps {
  /** Visual variant. Default: `'filled'` */
  variant?: BadgeVariant
  /** Size preset. Default: `'sm'` */
  size?: BadgeSize
  /** Predefined severity/status — auto-maps color, label, pulse */
  preset?: BadgePreset
  /** Custom accent color hex (overrides preset color)
   * @example `'#ff2244'`
   */
  color?: string
  /** Badge text content (overrides preset label)
   * @example `'ALERT'`
   */
  label?: React.ReactNode
  /** Show pulsing dot before label. Default: `false`
   * @example `true`
   */
  dot?: boolean
  /** Leading icon element
   * @example `<AlertTriangle className="w-3 h-3" />`
   */
  icon?: React.ReactNode
  /** Additional CSS classes
   * @example `'ml-2'`
   */
  className?: string
}

// ─── Config ───────────────────────────────────────────────────

const PRESET: Record<BadgePreset, { color: string; pulse: boolean }> = {
  critical:   { color: '#ff2244', pulse: true },
  high:       { color: '#ff6b00', pulse: false },
  medium:     { color: '#eab308', pulse: false },
  low:        { color: '#22c55e', pulse: false },
  active:     { color: '#ff2244', pulse: true },
  monitoring: { color: '#eab308', pulse: false },
  resolved:   { color: '#22c55e', pulse: false },
}

const SIZE: Record<BadgeSize, { font: string; pad: string; dot: string; ico: string }> = {
  xs: { font: 'text-[8px]',  pad: 'px-1 py-0.5',   dot: 'w-1 h-1',     ico: 'w-2.5 h-2.5' },
  sm: { font: 'text-[9px]',  pad: 'px-2 py-0.5',   dot: 'w-1.5 h-1.5', ico: 'w-3 h-3' },
  md: { font: 'text-[11px]', pad: 'px-2.5 py-1',   dot: 'w-2 h-2',     ico: 'w-3.5 h-3.5' },
}

const TXT = 'font-mono font-bold uppercase tracking-wider leading-none whitespace-nowrap'

// ─── Component ────────────────────────────────────────────────

/**
 * ScifiBadge — sci-fi themed badge / status indicator.
 *
 * Renders a compact monospaced label with configurable visual variant,
 * seven presets, and optional pulsing dot or leading icon.
 *
 * @example
 * ```tsx
 * <ScifiBadge preset="critical" size="sm" dot />
 * <ScifiBadge variant="laser" color="#00e5ff" label="ONLINE" />
 * ```
 */
export const ScifiBadge = forwardRef<HTMLSpanElement, ScifiBadgeProps>(
  ({ variant = 'filled', size = 'sm', preset, color: colorProp, label, dot: dotProp, icon, className }, ref) => {
    const [hovered, setHovered] = useState(false)

    const color = colorProp ?? (preset ? PRESET[preset].color : '#00e5ff')
    const showDot = dotProp ?? (preset ? PRESET[preset].pulse : false)
    const { r, g, b } = hexToChannels(color)
    const sz = SIZE[size]
    const displayLabel = label ?? (preset ? preset.toUpperCase() : null)
    if (displayLabel == null && !icon) return null

    const baseBg = `rgba(${r},${g},${b},0.12)`
    const border = `1px solid rgba(${r},${g},${b},0.25)`

    const style: React.CSSProperties & { '--badge-color'?: string } =
      variant === 'filled'  ? { backgroundColor: baseBg, color, border }
      : variant === 'outline' ? { backgroundColor: 'transparent', color, border: `1px solid rgba(${r},${g},${b},0.5)` }
      : variant === 'hex'    ? { backgroundColor: `rgba(${r},${g},${b},0.15)`, color, clipPath: 'polygon(8px 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,8px 100%,0 50%)' }
      : variant === 'laser'   ? {
          '--badge-color': color, backgroundColor: baseBg, color, border,
          boxShadow: hovered
            ? `0 0 8px rgba(${r},${g},${b},0.6),0 0 20px rgba(${r},${g},${b},0.3),0 0 40px rgba(${r},${g},${b},0.1)`
            : undefined,
        }
      : {}

    return (
      <span
        ref={ref} role="status" data-slot="scifi-badge"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn('inline-flex items-center gap-1 rounded-sm select-none transition-shadow duration-300', TXT, sz.font, sz.pad, variant === 'hex' && 'py-1', className)}
        style={style}
      >
        {icon && <span className={cn('shrink-0', sz.ico)} style={{ color }}>{icon}</span>}
        {showDot && (
          <span className={cn('shrink-0 rounded-full animate-pulse', sz.dot)} aria-hidden="true"
            style={{ backgroundColor: color, boxShadow: `0 0 6px rgba(${r},${g},${b},0.8)` }} />
        )}
        {displayLabel != null && <span>{displayLabel}</span>}
      </span>
    )
  },
)
ScifiBadge.displayName = 'ScifiBadge'
