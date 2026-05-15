'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

export interface StatItem {
  /** Numeric value to display */
  value: string
  /** Label below the value */
  label: string
  /** Optional description under label */
  description?: string
  /** Optional prefix (e.g. "$", "+") */
  prefix?: string
  /** Optional suffix (e.g. "%", "+") */
  suffix?: string
}

export interface StatsSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** Stat items */
  items: StatItem[]
  /** Layout variant */
  variant?: 'row' | 'grid' | 'compact'
}

/**
 * StatsSection -- Key metrics and numbers display.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <StatsSection
 *   heading="By the numbers"
 *   items={[
 *     { value: '51', label: 'Layout Recipes', suffix: '+' },
 *     { value: '5', label: 'Theme Presets' },
 *     { value: '99', label: 'Components', suffix: '%' },
 *   ]}
 * />
 * ```
 */
export const StatsSection = forwardRef<HTMLElement, StatsSectionProps>(
  ({ heading, subtitle, items, variant = 'row', className, ...props }, ref) => (
    <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
      {(heading || subtitle) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {variant === 'row' && (
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-10">
          {items.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-accent">
                {s.prefix}{s.value}{s.suffix}
              </span>
              <span className="mt-1 text-sm font-medium text-foreground">{s.label}</span>
              {s.description && <span className="mt-0.5 text-xs text-muted-foreground">{s.description}</span>}
            </div>
          ))}
        </div>
      )}

      {variant === 'grid' && (
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 text-center">
              <span className="text-3xl font-extrabold tracking-tight text-accent">
                {s.prefix}{s.value}{s.suffix}
              </span>
              <div className="mt-1 text-sm font-medium text-foreground">{s.label}</div>
              {s.description && <div className="mt-0.5 text-xs text-muted-foreground">{s.description}</div>}
            </div>
          ))}
        </div>
      )}

      {variant === 'compact' && (
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 sm:grid-cols-6">
          {items.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xl font-bold text-accent">{s.prefix}{s.value}{s.suffix}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
)
StatsSection.displayName = 'StatsSection'
