'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface SliderControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix' | 'onChange'> {
  /** Label text displayed above the slider */
  label: string
  /** Current numeric value */
  value: number
  /** Change handler -- receives the new value */
  onChange: (value: number) => void
  /** Minimum value (default 0) */
  min?: number
  /** Maximum value (default 100) */
  max?: number
  /** Step increment (default 1) */
  step?: number
  /** Unit suffix displayed next to the value (e.g. "px", "%", "deg") */
  unit?: string
  /** Left addon text (e.g. icon or prefix) */
  prefix?: ReactNode
  /** Additional class names for the slider track */
  trackClassName?: string
}

// ─── SliderControl Component ──────────────────────────────────

/**
 * SliderControl -- labeled range slider with value display.
 *
 * A reusable control that combines a label, a numeric value indicator,
 * and a native range input into one cohesive form element.
 *
 * @example
 * ```tsx
 * <SliderControl
 *   label="Border Radius"
 *   value={radius}
 *   onChange={setRadius}
 *   min={0}
 *   max={50}
 *   unit="px"
 * />
 * ```
 */
export const SliderControl = forwardRef<HTMLDivElement, SliderControlProps>(
  (
    { label, value, onChange, min = 0, max = 100, step = 1, unit, prefix, trackClassName, className, ...props }: SliderControlProps,
    ref
  ) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          {prefix}{label}
        </label>
        <span className="text-xs font-mono tabular-nums text-foreground">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={cn(
          'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted',
          '[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background',
          '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm',
          '[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2',
          '[&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-primary',
          trackClassName
        )}
        aria-label={label}
      />
    </div>
  )
)
SliderControl.displayName = 'SliderControl'
