'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  /** Main heading */
  title: string
  /** Highlighted portion of title (renders in accent color) */
  titleHighlight?: string
  /** Subtitle / description text */
  subtitle?: string
  /** Primary CTA button label */
  ctaLabel?: string
  /** Secondary CTA button label */
  secondaryCtaLabel?: string
  /** Badge text shown above title */
  badge?: string
  /** Stats row data */
  stats?: Array<{ value: string; label: string }>
  /** Custom actions slot */
  actions?: ReactNode
}

/**
 * HeroSection — Full-width landing hero with title, subtitle, CTA, and optional stats.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <HeroSection
 *   title="Build faster with" titleHighlight="@stsgs/ui"
 *   subtitle="A foundation component library with 51 layout recipes"
 *   ctaLabel="Get Started"
 *   stats={[{ value: '51', label: 'Layouts' }]}
 * />
 * ```
 */
export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ title, titleHighlight, subtitle, ctaLabel, secondaryCtaLabel, badge, stats, actions, className, ...props }, ref) => (
    <section ref={ref} className={cn('flex flex-col items-center justify-center gap-6 px-6 py-20 text-center', className)} {...props}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />{badge}
        </span>
      )}
      <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        {title}{titleHighlight && <> <span className="text-accent">{titleHighlight}</span></>}
      </h1>
      {subtitle && <p className="max-w-xl text-lg text-muted-foreground">{subtitle}</p>}
      {(ctaLabel || secondaryCtaLabel || actions) && (
        <div className="flex items-center gap-3">
          {ctaLabel && <button className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">{ctaLabel}</button>}
          {secondaryCtaLabel && <button className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted">{secondaryCtaLabel}</button>}
          {actions}
        </div>
      )}
      {stats && stats.length > 0 && (
        <div className="mt-6 flex items-center gap-8">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-accent">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
)
HeroSection.displayName = 'HeroSection'
