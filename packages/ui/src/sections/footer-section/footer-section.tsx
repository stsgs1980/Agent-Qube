'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface FooterSectionProps extends HTMLAttributes<HTMLElement> {
  /** Footer columns with links */
  columns?: Array<{
    title: string
    links: Array<{ label: string; href: string }>
  }>
  /** Copyright text */
  copyright?: string
  /** Bottom row slot */
  bottomSlot?: ReactNode
}

/**
 * FooterSection — Page footer with columns and copyright.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <FooterSection
 *   columns={[
 *     { title: 'Product', links: [{ label: 'Features', href: '/features' }] },
 *     { title: 'Company', links: [{ label: 'About', href: '/about' }] },
 *   ]}
 *   copyright="2026 @stsgs/ui"
 * />
 * ```
 */
export const FooterSection = forwardRef<HTMLElement, FooterSectionProps>(
  ({ columns, copyright, bottomSlot, className, ...props }, ref) => (
    <footer ref={ref} className={cn('border-t border-border px-6 py-10', className)} {...props}>
      {columns && columns.length > 0 && (
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between border-t border-border pt-6">
        {copyright && <span className="text-xs text-muted-foreground">{copyright}</span>}
        {bottomSlot}
      </div>
    </footer>
  )
)
FooterSection.displayName = 'FooterSection'
