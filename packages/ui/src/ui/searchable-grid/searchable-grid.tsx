'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'
import type { ResponsiveColumns, GapSize } from '../grid/grid'

// ─── Types ────────────────────────────────────────────────────

export interface FilterableItem {
  id: string
  name: string
  description?: string
  category: string
  [key: string]: unknown
}

export interface FilterCategory {
  id: string
  name: string
}

export interface SearchableFilterableGridProps<T extends FilterableItem> {
  /** Items to display and filter */
  items: T[]
  /** Filter categories (include { id: 'all', name: 'All' } for no-filter option) */
  categories: FilterCategory[]
  /** Search input placeholder (default: 'Search...') */
  searchPlaceholder?: string
  /** Which fields to search (default: ['name', 'description']) */
  searchKeys?: (keyof T)[]
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode
  /** Empty state message (default: 'No items found.') */
  emptyMessage?: string
  /** Grid columns: number or responsive config (default: { md: 2, lg: 3 }) */
  columns?: ResponsiveColumns
  /** Gap size (default: 'lg') */
  gap?: GapSize
  /** Show search input (default: true) */
  showSearch?: boolean
  /** Show category tabs (default: true) */
  showTabs?: boolean
  /** Additional class */
  className?: string
}

// ─── SearchableFilterableGrid Component ───────────────────────

/**
 * SearchableFilterableGrid -- search + category tabs + responsive card grid.
 *
 * The most repeated layout pattern in Component-Browser-Public-v1.0:
 * appears in 14+ section components (ComponentsSection, LibrariesSection,
 * PatternsSection, TechnologiesSection, SystemsSection, etc.).
 *
 * Generalizes SearchableFilterableGrid (035) from the original repo,
 * adding Grid primitive integration for consistent responsive behavior.
 *
 * @example
 * ```tsx
 * <SearchableFilterableGrid
 *   items={libraries}
 *   categories={[
 *     { id: 'all', name: 'All' },
 *     { id: 'styling', name: 'Styling' },
 *     { id: 'animation', name: 'Animation' },
 *   ]}
 *   columns={{ md: 2, lg: 3 }}
 *   renderItem={(lib) => <LibraryCard library={lib} />}
 * />
 * ```
 */
export function SearchableFilterableGrid<T extends FilterableItem>({
  items,
  categories,
  searchPlaceholder = 'Search...',
  searchKeys = ['name', 'description'] as (keyof T)[],
  renderItem,
  emptyMessage = 'No items found.',
  columns = { md: 2, lg: 3 },
  gap = 'lg',
  showSearch = true,
  showTabs = true,
  className,
}: SearchableFilterableGridProps<T>) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        search === '' ||
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(search.toLowerCase())
        )
      const matchesCategory = category === 'all' || item.category === category
      return matchesSearch && matchesCategory
    })
  }, [items, search, category, searchKeys])

  // Build Tailwind grid classes from columns config
  const gridColsClass = useMemo(() => {
    if (typeof columns === 'number') {
      return `grid-cols-${columns}`
    }
    const classes = ['grid-cols-1']
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`)
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`)
    if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`)
    return classes.join(' ')
  }, [columns])

  const gapMap: Record<GapSize, string> = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search + Tabs */}
      {(showSearch || showTabs) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {showSearch && (
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}
          {showTabs && (
            <div className="flex gap-1 bg-muted p-1 rounded-md">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-sm transition-all whitespace-nowrap',
                    category === cat.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      <div className={cn('grid', gridColsClass, gapMap[gap])}>
        {filteredItems.map((item, index) => (
          <div key={item.id}>{renderItem(item, index)}</div>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  )
}
