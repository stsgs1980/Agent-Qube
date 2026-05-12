'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface FaqItem {
  /** Question text */
  question: string
  /** Answer text or custom content */
  answer: ReactNode
}

export interface FaqSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** FAQ items (question + answer pairs) */
  items: FaqItem[]
  /** Layout variant */
  variant?: 'accordion' | 'grid'
  /** Max items visible when variant='grid' */
  maxVisible?: number
}

/**
 * FaqSection -- Frequently asked questions with accordion or grid layout.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <FaqSection
 *   heading="Frequently Asked Questions"
 *   items={[
 *     { question: 'What is @stsgs/ui?', answer: 'An Interface Studio for building ready-to-use interfaces.' },
 *     { question: 'How many layouts?', answer: '51 layout recipes across 6 categories.' },
 *   ]}
 *   variant="accordion"
 * />
 * ```
 */
export const FaqSection = forwardRef<HTMLElement, FaqSectionProps>(
  ({ heading, subtitle, items, variant = 'accordion', maxVisible, className, ...props }, ref) => {
    const visible = maxVisible ? items.slice(0, maxVisible) : items

    return (
      <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
        {(heading || subtitle) && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {variant === 'accordion' ? (
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-card">
            {visible.map((item, i) => (
              <details key={i} className="group px-6 py-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground marker:[content:''] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {visible.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 text-sm font-semibold text-foreground">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }
)
FaqSection.displayName = 'FaqSection'
