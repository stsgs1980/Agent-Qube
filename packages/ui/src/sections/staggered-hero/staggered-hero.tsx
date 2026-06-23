'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface StaggeredHeroProps extends HTMLAttributes<HTMLElement> {
  /** Title parts — each rendered as a separate line, last one highlighted */
  titleParts: string[]
  /** Subtitle text */
  subtitle?: string
  /** Stats row data */
  stats?: Array<{ value: string; label: string }>
  /** Custom actions slot */
  actions?: ReactNode
}

/**
 * StaggeredHero — Hero with staggered-motion title lines and optional stats.
 * Layer 3: No own state. Props in, JSX out.
 *
 * @example
 * ```tsx
 * <StaggeredHero
 *   titleParts={['Describe it.', "We'll", 'layout it.']}
 *   subtitle="AI-powered layout advisor"
 *   stats={[{ value: '51', label: 'Recipes' }]}
 * />
 * ```
 */
export const StaggeredHero = forwardRef<HTMLElement, StaggeredHeroProps>(
  ({ titleParts, subtitle, stats, actions, className, ...props }, ref) => (
    <section ref={ref} className={cn('flex flex-col items-center gap-8 px-6 py-24 text-center', className)} {...props}>
      <h1 className="flex flex-col gap-1 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        {titleParts.map((part, i) => (
          <span
            key={i}
            className={cn(
              i === titleParts.length - 1 && 'text-accent',
            )}
          >
            {part}
          </span>
        ))}
      </h1>
      {subtitle && <p className="max-w-lg text-lg text-muted-foreground">{subtitle}</p>}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-10">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl font-bold text-accent">{s.value}</span>
              <span className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </section>
  )
)
StaggeredHero.displayName = 'StaggeredHero'
