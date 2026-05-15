'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface ColorPickerInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current hex color value (e.g. "#ff0000") */
  value: string
  /** Change handler -- receives the full hex string */
  onChange: (value: string) => void
  /** Label text displayed above the control */
  label?: string
  /** Whether to show the hex text input (default true) */
  showHexInput?: boolean
  /** Preset color swatches */
  presets?: string[]
}

// ─── ColorPickerInput Component ───────────────────────────────

/**
 * ColorPickerInput -- native color picker combined with hex input and optional presets.
 *
 * Provides a compact color selection control with a clickable swatch,
 * an editable hex text field, and optional preset swatches.
 *
 * @example
 * ```tsx
 * <ColorPickerInput
 *   label="Primary Color"
 *   value={color}
 *   onChange={setColor}
 *   presets={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']}
 * />
 * ```
 */
export const ColorPickerInput = forwardRef<HTMLDivElement, ColorPickerInputProps>(
  ({ value, onChange, label, showHexInput = true, presets, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative size-7 shrink-0 overflow-hidden rounded-md border border-border">
          <input
            type="color"
            value={value.length === 4
              ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
              : value
            }
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer"
            aria-label={label ?? 'Pick a color'}
          />
        </div>
        {showHexInput && (
          <input
            type="text"
            value={value}
            onChange={e => {
              const v = e.target.value
              if (/^#([0-9a-fA-F]{0,6})$/.test(v)) onChange(v)
            }}
            maxLength={7}
            className="h-7 w-24 rounded-md border border-border bg-transparent px-2 text-xs font-mono text-foreground outline-none focus:ring-1 focus:ring-primary"
            placeholder="#000000"
            aria-label={`${label ?? 'Color'} hex value`}
          />
        )}
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {presets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'size-5 rounded border transition-transform hover:scale-110',
                value.toLowerCase() === preset.toLowerCase()
                  ? 'border-foreground ring-1 ring-foreground/30'
                  : 'border-border'
              )}
              style={{ backgroundColor: preset }}
              aria-label={`Select ${preset}`}
            />
          ))}
        </div>
      )}
    </div>
  )
)
ColorPickerInput.displayName = 'ColorPickerInput'
