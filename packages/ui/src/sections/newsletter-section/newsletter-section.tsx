'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface NewsletterSectionProps extends HTMLAttributes<HTMLElement> {
  /** Heading text */
  heading?: string
  /** Subtitle / description */
  subtitle?: string
  /** Input placeholder */
  placeholder?: string
  /** Submit button label */
  submitLabel?: string
  /** Disclaimed text */
  disclaimer?: string
  /** Custom action slot (replaces default form) */
  actionSlot?: ReactNode
  /** Visual variant */
  variant?: 'default' | 'compact' | 'banner'
}

/**
 * NewsletterSection -- Email subscription block.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <NewsletterSection
 *   heading="Stay updated"
 *   subtitle="Get notified about new components and features"
 *   placeholder="you@example.com"
 *   submitLabel="Subscribe"
 * />
 * ```
 */
export const NewsletterSection = forwardRef<HTMLElement, NewsletterSectionProps>(
  ({ heading, subtitle, placeholder, submitLabel = 'Subscribe', disclaimer, actionSlot, variant = 'default', className, ...props }, ref) => (
    <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
      {variant === 'banner' && (
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8 text-center">
          {heading && <h2 className="mb-2 text-2xl font-bold text-foreground">{heading}</h2>}
          {subtitle && <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>}
          {actionSlot ?? (
            <form onSubmit={e => e.preventDefault()} className="mx-auto flex max-w-md gap-3">
              <input type="email" placeholder={placeholder ?? 'you@example.com'} required
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
              <button type="submit" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">{submitLabel}</button>
            </form>
          )}
          {disclaimer && <p className="mt-3 text-xs text-muted-foreground">{disclaimer}</p>}
        </div>
      )}

      {variant === 'compact' && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <form onSubmit={e => e.preventDefault()} className="flex w-full gap-2">
            <input type="email" placeholder={placeholder ?? 'Email'} required
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
            <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">{submitLabel}</button>
          </form>
          {disclaimer && <p className="text-xs text-muted-foreground">{disclaimer}</p>}
        </div>
      )}

      {variant === 'default' && (
        <div className="mx-auto max-w-lg text-center">
          {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
          {subtitle && <p className="mb-6 text-muted-foreground">{subtitle}</p>}
          {actionSlot ?? (
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <input type="email" placeholder={placeholder ?? 'you@example.com'} required
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
              <button type="submit" className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">{submitLabel}</button>
            </form>
          )}
          {disclaimer && <p className="mt-3 text-xs text-muted-foreground">{disclaimer}</p>}
        </div>
      )}
    </section>
  )
)
NewsletterSection.displayName = 'NewsletterSection'
