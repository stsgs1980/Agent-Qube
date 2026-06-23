'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface ThreeColumnBrowserItem {
  id: string
  name: string
  [key: string]: unknown
}

export interface ThreeColumnBrowserProps<C extends ThreeColumnBrowserItem = ThreeColumnBrowserItem> extends HTMLAttributes<HTMLDivElement> {
  /** Categories for the first column */
  categories: Array<{ id: string; label: string; icon?: ReactNode }>
  /** Items for the second column */
  items: C[]
  /** Currently selected category ID */
  selectedCategoryId?: string
  /** Currently selected item ID */
  selectedItemId?: string
  /** Callback when category is selected */
  onCategorySelect?: (categoryId: string) => void
  /** Callback when item is selected */
  onItemSelect?: (itemId: string) => void
  /** Detail panel renderer */
  renderDetail: (item: C) => ReactNode
  /** Filter items by category */
  filterByCategory?: (item: C, categoryId: string) => boolean
}

/**
 * ThreeColumnBrowser — Generic 3-column master-detail pattern.
 * Categories → Items → Detail. Layer 3: No own state.
 *
 * @example
 * ```tsx
 * <ThreeColumnBrowser
 *   categories={[{ id: 'layouts', label: 'Layouts' }]}
 *   items={recipes}
 *   selectedCategoryId="layouts"
 *   renderDetail={(item) => <LayoutPreview recipe={item} />}
 * />
 * ```
 */
export const ThreeColumnBrowser = forwardRef<HTMLDivElement, ThreeColumnBrowserProps>(
  ({ categories, items, selectedCategoryId, selectedItemId, onCategorySelect, onItemSelect, renderDetail, filterByCategory, className, ...props }, ref) => {
    const filteredItems = selectedCategoryId && filterByCategory
      ? items.filter(item => filterByCategory(item, selectedCategoryId))
      : items
    const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) : null

    return (
      <div ref={ref} className={cn('grid h-full grid-cols-[220px_1fr_1fr] gap-0 border border-border', className)} {...props}>
        {/* Column 1: Categories */}
        <div className="border-r border-border p-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect?.(cat.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                selectedCategoryId === cat.id ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Column 2: Items */}
        <div className="border-r border-border p-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => onItemSelect?.(item.id)}
              className={cn(
                'flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors',
                selectedItemId === item.id ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Column 3: Detail */}
        <div className="overflow-auto p-4">
          {selectedItem ? renderDetail(selectedItem) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select an item to view details
            </div>
          )}
        </div>
      </div>
    )
  }
)
ThreeColumnBrowser.displayName = 'ThreeColumnBrowser'
