'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'
import type { GapSize } from '../grid/grid'

// ─── Types ────────────────────────────────────────────────────

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between items using named token (default: 'sm') */
  gap?: GapSize
  /** Cross-axis alignment (default: 'center') */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis justification */
  justify?: 'start' | 'center' | 'end' | 'between'
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
}

const justifyMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

// ─── Cluster Component ────────────────────────────────────────

/**
 * Cluster -- horizontal wrapping flex container for groups of items.
 *
 * Purpose-built for tag lists, action button rows, chip groups,
 * and any collection of items that should wrap to new lines.
 *
 * Different from Stack in that Cluster always:
 *   - Flows horizontally (flex-row)
 *   - Wraps by default (flex-wrap)
 *   - Centers items vertically by default
 *
 * Extracted from QuickActions (002), CTABanner (006), and
 * filter/action bars across 6+ section components.
 *
 * @example
 * ```tsx
 * // Tag list
 * <Cluster gap="sm">
 *   {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
 * </Cluster>
 *
 * // Action buttons
 * <Cluster gap="sm" justify="end">
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Save</Button>
 * </Cluster>
 * ```
 */
export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(
  ({ gap = 'sm', align = 'center', justify, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap',
          gapMap[gap],
          alignMap[align],
          justify && justifyMap[justify],
          className
        )}
        {...props}
      />
    )
  }
)

Cluster.displayName = 'Cluster'
