'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'
import { tokens } from '../../tokens/tokens'

// ─── Types ────────────────────────────────────────────────────

/** Responsive column configuration: mobile-first, maps breakpoint to column count */
export type ResponsiveColumns =
  | number
  | { sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number }

/** Named gap sizes from layout tokens */
export type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns or responsive config (default: 1) */
  cols?: ResponsiveColumns
  /** Gap between grid items using named token (default: 'md') */
  gap?: GapSize
  /** Number of rows (optional, for explicit row grids) */
  rows?: number
  /** Alignment of grid items on the block axis */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Alignment of grid items on the inline axis */
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'between'
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** How many columns this item spans (default: 1) */
  colSpan?: number
  /** How many rows this item spans (default: 1) */
  rowSpan?: number
  /** Start column position (1-based) */
  colStart?: number
  /** Start row position (1-based) */
  rowStart?: number
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

function resolveGridClasses(cols: ResponsiveColumns, gap: GapSize): string {
  const gapClass = gapMap[gap]

  if (typeof cols === 'number') {
    // Static column count
    return `grid-cols-${cols} ${gapClass}`
  }

  // Responsive: build breakpoint classes
  const classes: string[] = ['grid-cols-1'] // mobile-first default

  if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
  if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
  if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
  if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`)

  return `${classes.join(' ')} ${gapClass}`
}

// ─── Grid Component ───────────────────────────────────────────

/**
 * Grid -- CSS Grid wrapper with responsive column configuration.
 *
 * Extracted from 14+ section components in Component-Browser-Public-v1.0
 * that all repeat the same `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern.
 *
 * Uses named gap tokens from layout.gutters and responsive breakpoint
 * configuration from layout.defaultColumns.
 *
 * @example
 * ```tsx
 * // Static 3-column grid
 * <Grid cols={3} gap="lg">
 *   <GridItem>Card 1</GridItem>
 *   <GridItem>Card 2</GridItem>
 *   <GridItem>Card 3</GridItem>
 * </Grid>
 *
 * // Responsive card grid (the most common pattern)
 * <Grid cols={{ md: 2, lg: 3 }} gap="lg">
 *   {cards.map(card => <GridItem key={card.id}>...</GridItem>)}
 * </Grid>
 *
 * // With spanning
 * <Grid cols={4} gap="md">
 *   <GridItem colSpan={2}>Wide card</GridItem>
 *   <GridItem>Normal</GridItem>
 *   <GridItem>Normal</GridItem>
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, gap = 'md', rows, align, justify, className, children, ...props }, ref) => {
    const gridClasses = resolveGridClasses(cols, gap)

    const alignClass = align === 'stretch' || !align ? '' : `items-${align}`
    const justifyClass = justify === 'stretch' || !justify ? '' : justify === 'between' ? 'justify-between' : `justify-${justify}`

    return (
      <div
        ref={ref}
        className={cn('grid', gridClasses, alignClass, justifyClass, className)}
        style={{
          ...(rows ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` } : {}),
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

// ─── GridItem Component ───────────────────────────────────────

/**
 * GridItem -- child of Grid with optional column/row spanning.
 *
 * @example
 * ```tsx
 * <Grid cols={3} gap="md">
 *   <GridItem colSpan={2}>Spans 2 columns</GridItem>
 *   <GridItem>1 column</GridItem>
 * </Grid>
 * ```
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ colSpan, rowSpan, colStart, rowStart, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          ...(colSpan ? { gridColumn: `span ${colSpan} / span ${colSpan}` } : {}),
          ...(rowSpan ? { gridRow: `span ${rowSpan} / span ${rowSpan}` } : {}),
          ...(colStart ? { gridColumnStart: colStart } : {}),
          ...(rowStart ? { gridRowStart: rowStart } : {}),
          ...style,
        }}
        {...props}
      />
    )
  }
)

GridItem.displayName = 'GridItem'
