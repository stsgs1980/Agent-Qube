'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface ContactField {
  /** Field name */
  name: string
  /** Field label */
  label: string
  /** Field type */
  type?: 'text' | 'email' | 'textarea' | 'select'
  /** Placeholder */
  placeholder?: string
  /** Required flag */
  required?: boolean
  /** Select options (for type='select') */
  options?: Array<{ value: string; label: string }>
}

export interface ContactSectionProps extends HTMLAttributes<HTMLElement> {
  /** Section heading */
  heading?: string
  /** Section subtitle */
  subtitle?: string
  /** Form fields */
  fields?: ContactField[]
  /** Primary CTA label */
  submitLabel?: string
  /** Side content slot (e.g. contact info, map) */
  sideContent?: ReactNode
  /** Layout variant */
  variant?: 'centered' | 'split'
}

/**
 * ContactSection -- Contact form with optional side content.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <ContactSection
 *   heading="Get in touch"
 *   fields={[
 *     { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
 *     { name: 'email', label: 'Email', type: 'email', required: true },
 *     { name: 'message', label: 'Message', type: 'textarea' },
 *   ]}
 *   submitLabel="Send Message"
 * />
 * ```
 */
export const ContactSection = forwardRef<HTMLElement, ContactSectionProps>(
  ({ heading, subtitle, fields, submitLabel = 'Send', sideContent, variant = 'centered', className, ...props }, ref) => {
    const form = (
      <form onSubmit={e => e.preventDefault()} className={cn('space-y-4', variant === 'centered' && 'mx-auto max-w-lg')}>
        {fields?.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium text-foreground">{f.label}{f.required && <span className="ml-0.5 text-destructive">*</span>}</label>
            {f.type === 'textarea' ? (
              <textarea id={f.name} name={f.name} placeholder={f.placeholder} required={f.required} rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
            ) : f.type === 'select' ? (
              <select id={f.name} name={f.name} required={f.required}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50">
                {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input id={f.name} name={f.name} type={f.type ?? 'text'} placeholder={f.placeholder} required={f.required}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" />
            )}
          </div>
        ))}
        <button type="submit" className="w-full rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
          {submitLabel}
        </button>
      </form>
    )

    return (
      <section ref={ref} className={cn('py-16 px-6', className)} {...props}>
        {(heading || subtitle) && (
          <div className={cn('mb-10', variant === 'centered' ? 'mx-auto max-w-3xl text-center' : 'max-w-xl')}>
            {heading && <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {variant === 'centered' && form}

        {variant === 'split' && (
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            {sideContent && <div className="flex flex-col justify-center">{sideContent}</div>}
            {form}
          </div>
        )}
      </section>
    )
  }
)
ContactSection.displayName = 'ContactSection'
