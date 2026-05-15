'use client'

import { forwardRef, type HTMLAttributes, type CSSProperties } from 'react'
import { cn } from '../../tokens/cn'
import type { GapSize } from '../grid/grid'

// ─── Types ────────────────────────────────────────────────────

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns (default: 4) */
  cols?: number
  /** Gap between items (default: 'md') */
  gap?: GapSize
  /** Row height in CSS units (default: '80px') */
  rowHeight?: string
}

export interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
  /** How many columns to span (default: 1) */
  colSpan?: number
  /** How many rows to span (default: 1) */
  rowSpan?: number
}

// ─── Helpers ──────────────────────────────────────────────────

const gapRemMap: Record<GapSize, string> = {
  none: '0rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}

// ─── BentoGrid Component ──────────────────────────────────────

/**
 * BentoGrid -- grid with variable-size items (colSpan + rowSpan).
 *
 * Named after the Japanese bento box layout: items of different sizes
 * fit together in a compact grid. Supports the 'bento-grid',
 * 'bento-sidebar', 'bento-hero', 'bento-masonry' LayoutStructure
 * patterns declared in tokens/types.ts.
 *
 * Unlike regular Grid where all items are equal-sized, BentoGrid
 * lets children declare their own span, enabling dashboard-style
 * layouts, feature showcases, and editorial layouts.
 *
 * @example
 * ```tsx
 * <BentoGrid cols={4} gap="md" rowHeight="80px">
 *   <BentoItem colSpan={2} rowSpan={2}>Hero feature</BentoItem>
 *   <BentoItem>Small item</BentoItem>
 *   <BentoItem>Small item</BentoItem>
 *   <BentoItem colSpan={2}>Wide item</BentoItem>
 * </BentoGrid>
 * ```
 */
export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ cols = 4, gap = 'md', rowHeight = '80px', className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid', className)}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: `minmax(${rowHeight}, auto)`,
          gap: gapRemMap[gap],
          ...style,
        }}
        {...props}
      />
    )
  }
)

BentoGrid.displayName = 'BentoGrid'

// ─── BentoItem Component ──────────────────────────────────────

/**
 * BentoItem -- child of BentoGrid with configurable column and row spanning.
 */
export const BentoItem = forwardRef<HTMLDivElement, BentoItemProps>(
  ({ colSpan = 1, rowSpan = 1, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          gridColumn: `span ${colSpan} / span ${colSpan}`,
          gridRow: `span ${rowSpan} / span ${rowSpan}`,
          ...style,
        }}
        {...props}
      />
    )
  }
)

BentoItem.displayName = 'BentoItem'
