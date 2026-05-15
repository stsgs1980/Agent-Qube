'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

/** A single option in the button group */
export interface ButtonGroupOption {
  /** Unique value identifying this option */
  value: string
  /** Display label */
  label: string
}

export interface ScifiButtonGroupProps {
  /** Currently selected value (controlled) */
  value: string
  /** Available options */
  options: ButtonGroupOption[]
  /** Called when user selects an option */
  onChange: (value: string) => void
  /** Label text shown before the button group */
  groupLabel?: string
  /** Accent color in hex. Default: '#00e5ff' */
  color?: string
  /** Show corner accents on inactive buttons. Default: true */
  showCorners?: boolean
  /** Additional CSS classes */
  className?: string
}

// ─── Corner Brackets ──────────────────────────────────────────

const CORNERS = [
  'absolute top-0 left-0 w-1.5 h-px',
  'absolute top-0 left-0 w-px h-1.5',
  'absolute top-0 right-0 w-1.5 h-px',
  'absolute top-0 right-0 w-px h-1.5',
  'absolute bottom-0 left-0 w-1.5 h-px',
  'absolute bottom-0 left-0 w-px h-1.5',
  'absolute bottom-0 right-0 w-1.5 h-px',
  'absolute bottom-0 right-0 w-px h-1.5',
] as const

// ─── Component ────────────────────────────────────────────────

/**
 * ScifiButtonGroup -- controlled button group with sci-fi styling.
 *
 * Renders selectable buttons with accent-colored active state, glow
 * box-shadow, optional corner brackets on inactive items, and hover/tap
 * animations via framer-motion.
 *
 * @example
 * ```tsx
 * <ScifiButtonGroup
 *   value="30d"
 *   onChange={setPeriod}
 *   options={[
 *     { value: '7d', label: '7D' },
 *     { value: '30d', label: '30D' },
 *     { value: '90d', label: '90D' },
 *   ]}
 *   groupLabel="PERIOD"
 * />
 * ```
 */
export const ScifiButtonGroup = forwardRef<HTMLDivElement, ScifiButtonGroupProps>(
  ({ value, options, onChange, groupLabel, color = '#00e5ff', showCorners = true, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-3', className)} data-slot="scifi-button-group">
        {groupLabel && (
          <span className="font-mono text-[9px] tracking-wider uppercase select-none" style={{ color: '#7070a0' }}>
            {groupLabel}
          </span>
        )}
        <div className="relative flex items-center gap-0">
          {options.map((opt) => {
            const active = value === opt.value
            return (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={cn(
                  'relative px-3 py-1.5 font-mono text-xs tracking-wider transition-colors duration-200 cursor-pointer',
                  active ? 'font-bold' : 'hover:brightness-125',
                )}
                style={{
                  color: active ? '#050510' : '#7070a0',
                  border: active ? `1px solid ${color}` : `1px solid ${color}26`,
                  backgroundColor: active ? color : 'transparent',
                  boxShadow: active
                    ? `0 0 12px ${color}66, 0 0 24px ${color}26, inset 0 0 8px rgba(0,0,0,0.2)`
                    : 'none',
                }}
                whileHover={!active ? { borderColor: `${color}66` } : {}}
                whileTap={{ scale: 0.97 }}
              >
                {!active && showCorners && CORNERS.map((cls, i) => (
                  <span key={i} className={cls} style={{ backgroundColor: `${color}4D` }} />
                ))}
                {opt.label}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  },
)
ScifiButtonGroup.displayName = 'ScifiButtonGroup'
