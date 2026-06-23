'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface CTABannerProps extends HTMLAttributes<HTMLElement> {
  /** Heading text */
  title: string
  /** Subtitle text */
  subtitle?: string
  /** Primary CTA button label */
  ctaLabel?: string
  /** Secondary action slot */
  secondaryAction?: ReactNode
  /** Whether to show gradient glow effect */
  glow?: boolean
}

/**
 * CTABanner — Call-to-action banner with gradient card and optional glow.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <CTABanner
 *   title="Ready to build?"
 *   subtitle="Start with 51 layout recipes"
 *   ctaLabel="Get Started"
 *   glow
 * />
 * ```
 */
export const CTABanner = forwardRef<HTMLElement, CTABannerProps>(
  ({ title, subtitle, ctaLabel, secondaryAction, glow = false, className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center',
        glow && 'shadow-[0_4px_32px_rgba(var(--accent-rgb),0.12)]',
        className,
      )}
      {...props}
    >
      {glow && <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5" />}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        {subtitle && <p className="max-w-md text-muted-foreground">{subtitle}</p>}
        <div className="flex items-center gap-3">
          {ctaLabel && (
            <button className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              {ctaLabel}
            </button>
          )}
          {secondaryAction}
        </div>
      </div>
    </section>
  )
)
CTABanner.displayName = 'CTABanner'
