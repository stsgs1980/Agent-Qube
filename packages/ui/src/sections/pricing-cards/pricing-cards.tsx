'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface PricingTier {
  /** Tier name */
  name: string
  /** Price amount (empty string for "Custom") */
  price: string
  /** Price period (e.g. "/mo", "/year") */
  period?: string
  /** Feature list */
  features: string[]
  /** Primary CTA label */
  ctaLabel: string
  /** Whether this tier is highlighted/recommended */
  highlighted?: boolean
  /** Badge text (e.g. "Popular") */
  badge?: string
  /** Optional custom footer slot */
  footerSlot?: ReactNode
}

export interface PricingCardsProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** Pricing tiers */
  tiers: PricingTier[]
}

/**
 * PricingCards -- Pricing tiers with feature lists and CTAs.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <PricingCards
 *   heading="Simple pricing"
 *   tiers={[
 *     { name: 'Starter', price: '0', features: ['5 layouts', '2 themes'], ctaLabel: 'Free', period: '/mo' },
 *     { name: 'Pro', price: '29', features: ['51 layouts', '5 themes', 'AI assist'], ctaLabel: 'Get Pro', highlighted: true, badge: 'Popular', period: '/mo' },
 *     { name: 'Enterprise', price: 'Custom', features: ['Unlimited', 'Priority support'], ctaLabel: 'Contact us' },
 *   ]}
 * />
 * ```
 */
export const PricingCards = forwardRef<HTMLElement, PricingCardsProps>(
  ({ heading, subtitle, tiers, className, ...props }, ref) => (
    <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
      {(heading || subtitle) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <div key={i} className={cn(
            'relative flex flex-col rounded-xl border bg-card p-6',
            t.highlighted ? 'border-accent shadow-lg' : 'border-border',
          )}>
            {t.badge && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-foreground">
                {t.badge}
              </span>
            )}
            <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              {t.price !== 'Custom' ? (
                <><span className="text-3xl font-extrabold tracking-tight text-foreground">{t.price}</span>{t.period && <span className="text-sm text-muted-foreground">{t.period}</span>}</>
              ) : (
                <span className="text-xl font-bold text-accent">Custom</span>
              )}
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-accent">+</span>{f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {t.footerSlot ?? (
                <button className={cn(
                  'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                  t.highlighted ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'border border-border text-foreground hover:bg-muted',
                )}>{t.ctaLabel}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
)
PricingCards.displayName = 'PricingCards'
