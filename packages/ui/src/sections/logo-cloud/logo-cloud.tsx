'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

export interface LogoItem {
  /** Logo image URL */
  src: string
  /** Alt text */
  alt: string
  /** Optional link */
  href?: string
}

export interface LogoCloudProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** Logo items */
  items: LogoItem[]
  /** Grayscale mode */
  grayscale?: boolean
  /** Max visible items */
  maxVisible?: number
}

/**
 * LogoCloud -- Row of partner/client logos for social proof.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <LogoCloud
 *   heading="Trusted by teams at"
 *   items={[
 *     { src: '/logos/acme.svg', alt: 'Acme Corp' },
 *     { src: '/logos/globex.svg', alt: 'Globex' },
 *   ]}
 *   grayscale
 * />
 * ```
 */
export const LogoCloud = forwardRef<HTMLElement, LogoCloudProps>(
  ({ heading, subtitle, items, grayscale = true, maxVisible, className, ...props }, ref) => {
    const visible = maxVisible ? items.slice(0, maxVisible) : items

    return (
      <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
        {(heading || subtitle) && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8">
          {visible.map((logo, i) => {
            const img = (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className={cn(
                  'h-10 w-auto object-contain opacity-60 transition-opacity hover:opacity-100',
                  grayscale && 'grayscale hover:grayscale-0',
                )}
              />
            )
            return logo.href ? <a key={i} href={logo.href} className="flex items-center">{img}</a> : img
          })}
        </div>
      </section>
    )
  }
)
LogoCloud.displayName = 'LogoCloud'
