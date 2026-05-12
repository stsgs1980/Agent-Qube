'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface ColumnCategory<C> {
  id: string
  name: string
  icon?: ReactNode
  items: C[]
}

export interface BrowserItem {
  id: string
  name: string
  description?: string
}

export interface ColumnTab {
  id: string
  name: string
  icon?: ReactNode
}

export interface ColumnBrowserProps<C extends BrowserItem> {
  /** Number of columns (default: 3) */
  columns?: number
  /** Column widths as CSS grid template (default: '240px 280px 1fr' for 3-col) */
  columnWidths?: string
  /** Categories for column 1 */
  categories: ColumnCategory<C>[]
  /** Column 1 header title */
  title?: string
  /** Tabs above the detail panel */
  viewTabs?: ColumnTab[]
  /** Optional secondary tabs (e.g. library variants) */
  secondaryTabs?: ColumnTab[]
  /** Render the detail panel content for a selected item */
  renderDetail: (item: C, viewTab: string, secondaryTab: string) => ReactNode
  /** Optional render for each item in column 2 (default: name + description) */
  renderItem?: (item: C, isSelected: boolean) => ReactNode
  /** Optional render for each category in column 1 (default: icon + name + count) */
  renderCategory?: (category: ColumnCategory<C>, isSelected: boolean) => ReactNode
  /** Header height (default: 64px) */
  headerHeight?: number
  /** Additional class */
  className?: string
}

// ─── Default Column Widths ────────────────────────────────────

const defaultColumnWidths: Record<number, string> = {
  2: '280px 1fr',
  3: '240px 280px 1fr',
  4: '200px 240px 280px 1fr',
}

// ─── ColumnBrowser Component ──────────────────────────────────

/**
 * ColumnBrowser -- N-column master-detail browser.
 *
 * Generalizes ThreeColumnBrowser (001) and FourColumnBrowser (006)
 * from Component-Browser-Public-v1.0 into a single configurable component.
 *
 * Pattern: Category list -> Item list -> Detail panel
 * Used for: component browsers, file managers, CMS panels, API reference browsers.
 *
 * Each column has:
 *   - Fixed header with title/breadcrumb
 *   - Scrollable body
 *   - Border separator on the right
 *
 * The last column renders the detail panel with optional tab navigation.
 *
 * @example
 * ```tsx
 * <ColumnBrowser
 *   columns={3}
 *   categories={componentCategories}
 *   viewTabs={[
 *     { id: 'preview', name: 'Preview' },
 *     { id: 'code', name: 'Code' },
 *   ]}
 *   renderDetail={(item, tab) =>
 *     tab === 'preview' ? <Preview item={item} /> : <CodeBlock item={item} />
 *   }
 * />
 * ```
 */
export function ColumnBrowser<C extends BrowserItem>({
  columns = 3,
  columnWidths,
  categories,
  title = 'Items',
  viewTabs,
  secondaryTabs,
  renderDetail,
  renderItem,
  renderCategory,
  headerHeight = 64,
  className,
}: ColumnBrowserProps<C>) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<C | null>(null)
  const [viewTab, setViewTab] = useState<string>(viewTabs?.[0]?.id ?? '')
  const [secondaryTab, setSecondaryTab] = useState<string>(secondaryTabs?.[0]?.id ?? '')

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const items = selectedCategory?.items ?? []
  const widths = columnWidths ?? defaultColumnWidths[columns] ?? defaultColumnWidths[3]

  const handleCategorySelect = (id: string) => {
    const isCurrentlySelected = selectedCategoryId === id
    setSelectedCategoryId(isCurrentlySelected ? null : id)
    setSelectedItem(null)
  }

  return (
    <div
      className={cn('grid h-full w-full', className)}
      style={{ gridTemplateColumns: widths }}
    >
      {/* Column 1: Categories */}
      <div className="border-r border-border flex flex-col h-full">
        <div
          className="px-4 flex items-center border-b border-border flex-shrink-0"
          style={{ height: headerHeight }}
        >
          <span className="text-base font-bold truncate">{title}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id
            if (renderCategory) {
              return (
                <div key={category.id} onClick={() => handleCategorySelect(category.id)}>
                  {renderCategory(category, isSelected)}
                </div>
              )
            }
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  'w-full px-4 py-3 flex items-center gap-3 transition-colors text-left',
                  isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
                )}
              >
                {category.icon && (
                  <div
                    className={cn(
                      'w-9 h-9 border flex items-center justify-center flex-shrink-0',
                      isSelected ? 'border-foreground' : 'border-border'
                    )}
                  >
                    {category.icon}
                  </div>
                )}
                <span className="flex-1 text-sm font-medium truncate">{category.name}</span>
                <span className="text-sm text-muted-foreground w-6 text-right flex-shrink-0">
                  {category.items.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Column 2: Items List */}
      <div className="border-r border-border flex flex-col h-full">
        <div
          className="px-4 flex items-center border-b border-border flex-shrink-0"
          style={{ height: headerHeight }}
        >
          <span className="text-base font-bold truncate">
            {selectedCategory?.name ?? title}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedCategoryId ? (
            items.map((item) => {
              const isSelected = selectedItem?.id === item.id
              if (renderItem) {
                return (
                  <div key={item.id} onClick={() => setSelectedItem(item)}>
                    {renderItem(item, isSelected)}
                  </div>
                )
              }
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    'w-full px-4 py-3 text-left transition-colors',
                    isSelected
                      ? 'bg-muted/50 border-l-2 border-foreground'
                      : 'hover:bg-muted/30 border-l-2 border-transparent'
                  )}
                >
                  <div className="text-sm font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-muted-foreground truncate">{item.description}</div>
                  )}
                </button>
              )
            })
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Select a category
            </div>
          )}
        </div>
      </div>

      {/* Columns 3+ : Detail Panel (spans remaining columns) */}
      <div className="flex flex-col overflow-hidden h-full" style={{ gridColumn: `span ${columns - 2}` }}>
        {/* Breadcrumb header */}
        <div
          className="px-4 flex items-center border-b border-border flex-shrink-0"
          style={{ height: headerHeight }}
        >
          {selectedItem ? (
            <>
              <span className="text-sm text-muted-foreground">{selectedCategory?.name}</span>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-base font-bold truncate">{selectedItem.name}</span>
            </>
          ) : (
            <span className="text-base font-bold">Preview</span>
          )}
        </div>

        {/* Two-level tabs */}
        {selectedItem && (viewTabs || secondaryTabs) && (
          <div className="flex items-center justify-center gap-4 px-4 border-b border-border flex-shrink-0 h-14">
            {secondaryTabs && (
              <>
                <div className="flex gap-1">
                  {secondaryTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSecondaryTab(tab.id)}
                      className={cn(
                        'h-9 px-4 text-sm font-medium whitespace-nowrap transition-all',
                        secondaryTab === tab.id
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
                <div className="w-px h-8 bg-border" />
              </>
            )}
            {viewTabs && (
              <div className="flex gap-2">
                {viewTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setViewTab(tab.id)}
                    className={cn(
                      'h-9 px-4 text-sm font-medium flex items-center gap-2 border transition-all',
                      viewTab === tab.id
                        ? 'bg-foreground text-background border-foreground'
                        : 'text-muted-foreground border-border hover:border-foreground/50'
                    )}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {selectedItem ? (
            <div className="p-6">{renderDetail(selectedItem, viewTab, secondaryTab)}</div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {selectedCategoryId ? 'Select an item from the list' : 'Select a category to begin'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
