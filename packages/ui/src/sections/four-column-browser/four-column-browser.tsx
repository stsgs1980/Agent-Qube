'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface FourColumnBrowserProps<C extends { id: string; name: string; [key: string]: unknown } = { id: string; name: string; [key: string]: unknown }> extends HTMLAttributes<HTMLDivElement> {
  categories: Array<{ id: string; label: string }>
  items: C[]
  selectedCategoryId?: string
  selectedItemId?: string
  onCategorySelect?: (id: string) => void
  onItemSelect?: (id: string) => void
  renderPreview: (item: C) => ReactNode
  renderCode: (item: C) => ReactNode
  filterByCategory?: (item: C, categoryId: string) => boolean
}

/**
 * FourColumnBrowser — 4-column browser (Categories→Items→Variants→Preview/Code).
 * Layer 3: No own state. Fully prop-driven.
 */
export const FourColumnBrowser = forwardRef<HTMLDivElement, FourColumnBrowserProps>(
  ({ categories, items, selectedCategoryId, selectedItemId, onCategorySelect, onItemSelect, renderPreview, renderCode, filterByCategory, className, ...props }, ref) => {
    const filteredItems = selectedCategoryId && filterByCategory
      ? items.filter(item => filterByCategory(item, selectedCategoryId))
      : items
    const selectedItem = selectedItemId ? items.find(i => i.id === selectedItemId) : null

    return (
      <div ref={ref} className={cn('grid h-full grid-cols-[180px_220px_1fr_1fr] gap-0 border border-border', className)} {...props}>
        <div className="border-r border-border p-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => onCategorySelect?.(cat.id)}
              className={cn('flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors', selectedCategoryId === cat.id ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted')}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="border-r border-border p-2">
          {filteredItems.map(item => (
            <button key={item.id} onClick={() => onItemSelect?.(item.id)}
              className={cn('flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors', selectedItemId === item.id ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted')}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="border-r border-border overflow-auto p-4">
          {selectedItem ? renderPreview(selectedItem) : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Preview</div>}
        </div>
        <div className="overflow-auto p-4">
          {selectedItem ? renderCode(selectedItem) : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Code</div>}
        </div>
      </div>
    )
  }
)
FourColumnBrowser.displayName = 'FourColumnBrowser'
