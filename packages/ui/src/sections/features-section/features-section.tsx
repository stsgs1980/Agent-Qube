'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface FeatureItem {
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Icon element (LucideIcon component) */
  icon?: ReactNode
  /** Optional badge/tag */
  badge?: string
}

export interface FeaturesSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** Feature items */
  items: FeatureItem[]
  /** Layout variant */
  variant?: 'grid' | 'list' | 'bento'
  /** Columns count (grid variant) */
  columns?: 2 | 3 | 4
}

/**
 * FeaturesSection -- Grid of feature cards with icons and descriptions.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <FeaturesSection
 *   heading="Everything you need"
 *   items={[
 *     { title: 'Layout Engine', description: '51 recipes with scoring', icon: <Grid3X3 /> },
 *     { title: 'Theme Engine', description: '5 presets with dual theme', icon: <Palette /> },
 *   ]}
 *   columns={3}
 * />
 * ```
 */
export const FeaturesSection = forwardRef<HTMLElement, FeaturesSectionProps>(
  ({ heading, subtitle, items, variant = 'grid', columns = 3, className, ...props }, ref) => {
    const colsClass = columns === 2 ? 'sm:grid-cols-2' : columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'

    return (
      <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
        {(heading || subtitle) && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {variant === 'grid' && (
          <div className={cn('mx-auto grid max-w-6xl gap-6', colsClass)}>
            {items.map((f, i) => (
              <div key={i} className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/30">
                {f.icon && (
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {f.icon}
                  </div>
                )}
                {f.badge && (
                  <span className="mb-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{f.badge}</span>
                )}
                <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        )}

        {variant === 'list' && (
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-card">
            {items.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-5">
                {f.icon && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {f.icon}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === 'bento' && (
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-3">
            {items.map((f, i) => {
              const isLarge = i === 0
              return (
                <div key={i} className={cn(
                  'rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/30',
                  isLarge && 'col-span-2 lg:col-span-2',
                )}>
                  {f.icon && (
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      {f.icon}
                    </div>
                  )}
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>
    )
  }
)
FeaturesSection.displayName = 'FeaturesSection'
