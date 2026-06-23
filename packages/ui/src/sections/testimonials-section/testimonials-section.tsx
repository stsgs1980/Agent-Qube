'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

export interface Testimonial {
  /** Author name */
  name: string
  /** Author role or company */
  role?: string
  /** Author avatar URL */
  avatar?: string
  /** Author initials (shown when no avatar) */
  initials?: string
  /** Testimonial text */
  text: string
  /** Star rating 1-5 */
  rating?: number
}

export interface TestimonialsSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** Testimonial items */
  items: Testimonial[]
  /** Layout variant */
  variant?: 'grid' | 'carousel' | 'masonry'
}

/**
 * TestimonialsSection -- Social proof with quotes, avatars, and ratings.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <TestimonialsSection
 *   heading="Loved by developers"
 *   items={[
 *     { name: 'Alex', role: 'CTO', text: 'Best layout system we have used.', rating: 5 },
 *     { name: 'Maria', role: 'Designer', text: 'Themes are gorgeous.', rating: 5, initials: 'M' },
 *   ]}
 * />
 * ```
 */
export const TestimonialsSection = forwardRef<HTMLElement, TestimonialsSectionProps>(
  ({ heading, subtitle, items, variant = 'grid', className, ...props }, ref) => (
    <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
      {(heading || subtitle) && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {variant === 'grid' && (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              {t.rating && (
                <div className="mb-3 flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-xs">{s < t.rating! ? '\u2605' : '\u2606'}</span>
                  ))}
                </div>
              )}
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                    {t.initials ?? t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'masonry' && (
        <div className="mx-auto columns-1 max-w-6xl gap-6 sm:columns-2 lg:columns-3">
          {items.map((t, i) => (
            <div key={i} className="mb-6 break-inside-avoid rounded-xl border border-border bg-card p-6">
              {t.rating && (
                <div className="mb-3 flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-xs">{s < t.rating! ? '\u2605' : '\u2606'}</span>
                  ))}
                </div>
              )}
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                    {t.initials ?? t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
)
TestimonialsSection.displayName = 'TestimonialsSection'
