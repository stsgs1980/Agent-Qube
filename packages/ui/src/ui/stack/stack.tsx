'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'
import type { GapSize } from '../grid/grid'

// ─── Types ────────────────────────────────────────────────────

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction of stacking (default: 'column') */
  direction?: 'column' | 'row'
  /** Gap between items using named token (default: 'md') */
  gap?: GapSize
  /** Cross-axis alignment */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** Main-axis justification */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** Whether items should wrap (only for direction='row') */
  wrap?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────

const gapMap: Record<GapSize, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const

const alignMap: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

// ─── Stack Component ──────────────────────────────────────────

/**
 * Stack -- vertical or horizontal flex stack with named gap.
 *
 * The most common layout primitive. Replaces `flex flex-col gap-4`
 * and `flex items-center gap-2` patterns found in 17+ components
 * across Component-Browser-Public-v1.0.
 *
 * For horizontal wrapping layouts (tags, chips, action buttons),
 * use Cluster instead.
 *
 * @example
 * ```tsx
 * // Vertical stack (default)
 * <Stack gap="lg">
 *   <Header />
 *   <Content />
 *   <Footer />
 * </Stack>
 *
 * // Horizontal stack
 * <Stack direction="row" gap="sm" align="center">
 *   <Avatar />
 *   <UserName />
 *   <Badge />
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ direction = 'column', gap = 'md', align, justify, wrap, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col' : 'flex-row',
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      />
    )
  }
)

Stack.displayName = 'Stack'
