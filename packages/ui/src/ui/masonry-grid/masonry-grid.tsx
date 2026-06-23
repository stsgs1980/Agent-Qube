'use client'

import { forwardRef, type HTMLAttributes, type CSSProperties, useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '../../tokens/cn'
import type { GapSize } from '../grid/grid'

// ─── Types ────────────────────────────────────────────────────

export interface MasonryGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns (default: 3) */
  cols?: number
  /** Gap between items (default: 'md') */
  gap?: GapSize
  /** Minimum column width for responsive behavior (default: 280) */
  minColumnWidth?: number
}

// ─── Helpers ──────────────────────────────────────────────────

const gapPxMap: Record<GapSize, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

// ─── MasonryGrid Component ────────────────────────────────────

/**
 * MasonryGrid -- CSS-columns-based masonry layout.
 *
 * Items flow into columns top-to-bottom, then left-to-right,
 * creating a Pinterest-style layout where items of varying heights
 * pack tightly without whitespace gaps.
 *
 * Implementation uses CSS `column-count` which provides native
 * masonry behavior with minimal JavaScript.
 *
 * Supports the 'masonry-grid' and 'masonry-grid' LayoutStructure
 * patterns declared in tokens/types.ts.
 *
 * Note: CSS masonry renders items in column-first order (top-to-bottom,
 * then left-to-right). If you need row-first order, consider using
 * BentoGrid with rowSpan instead.
 *
 * @example
 * ```tsx
 * <MasonryGrid cols={3} gap="md">
 *   {cards.map(card => (
 *     <div key={card.id} className="break-inside-avoid mb-4">
 *       <Card>{card.content}</Card>
 *     </div>
 *   ))}
 * </MasonryGrid>
 * ```
 */
export const MasonryGrid = forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ cols = 3, gap = 'md', minColumnWidth, className, style, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [responsiveCols, setResponsiveCols] = useState(cols)

    const gapPx = gapPxMap[gap]

    // Responsive column calculation based on container width
    useEffect(() => {
      if (!minColumnWidth) return

      const container = containerRef.current
      if (!container) return

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width
          const possibleCols = Math.max(1, Math.floor((width + gapPx) / (minColumnWidth + gapPx)))
          setResponsiveCols(possibleCols)
        }
      })

      observer.observe(container)
      return () => observer.disconnect()
    }, [minColumnWidth, gapPx])

    return (
      <div
        ref={(node) => {
          // Handle both refs
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={cn(className)}
        style={{
          columnCount: minColumnWidth ? responsiveCols : cols,
          columnGap: `${gapPx}px`,
          ...style,
        }}
        {...props}
      />
    )
  }
)

MasonryGrid.displayName = 'MasonryGrid'
