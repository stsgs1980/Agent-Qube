'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface NavbarSectionProps extends HTMLAttributes<HTMLElement> {
  /** Brand / logo content */
  brand?: ReactNode
  /** Brand name text (if no custom brand slot) */
  brandName?: string
  /** Navigation links */
  links?: Array<{ label: string; href: string; active?: boolean }>
  /** Right-side actions slot */
  actions?: ReactNode
  /** Whether navbar is sticky */
  sticky?: boolean
}

/**
 * NavbarSection — Top navigation bar with brand, links, and actions.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <NavbarSection
 *   brandName="@stsgs/ui"
 *   links={[{ label: 'Docs', href: '/docs' }, { label: 'Components', href: '/components', active: true }]}
 *   actions={<Button size="sm">Sign In</Button>}
 * />
 * ```
 */
export const NavbarSection = forwardRef<HTMLElement, NavbarSectionProps>(
  ({ brand, brandName, links, actions, sticky = true, className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        'flex h-14 items-center gap-6 border-b border-border px-6',
        sticky && 'sticky top-0 z-20 bg-background',
        className,
      )}
      {...props}
    >
      {brand ?? (
        <span className="text-lg font-bold text-foreground">{brandName}</span>
      )}
      {links && links.length > 0 && (
        <div className="flex items-center gap-1">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                link.active ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </nav>
  )
)
NavbarSection.displayName = 'NavbarSection'
