'use client'

import { useState, forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface SearchPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Placeholder text */
  placeholder?: string
  /** Callback on search submit */
  onSearch?: (query: string) => void
  /** Suggested queries */
  suggestions?: string[]
  /** Recent searches */
  recent?: string[]
  /** Custom result renderer */
  renderResult?: (query: string) => ReactNode
}

/**
 * SearchPanel — Search input with suggestions and recent searches.
 * Layer 4: Has own state (search query).
 *
 * @example
 * ```tsx
 * <SearchPanel
 *   onSearch={(q) => doSearch(q)}
 *   suggestions={['Dashboard layout', 'Bento grid', 'Admin panel']}
 * />
 * ```
 */
export const SearchPanel = forwardRef<HTMLDivElement, SearchPanelProps>(
  ({ placeholder = 'Search...', onSearch, suggestions, recent, renderResult, className, ...props }, ref) => {
    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)

    const handleSubmit = () => {
      if (query.trim()) onSearch?.(query.trim())
    }

    return (
      <div ref={ref} className={cn('w-full max-w-md', className)} {...props}>
        <div className={cn('flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 transition-colors', focused ? 'border-accent/50 ring-2 ring-accent/10' : 'border-border')}>
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {focused && !query && recent && recent.length > 0 && (
          <div className="mt-2 rounded-lg border border-border bg-background p-2">
            <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent</div>
            {recent.map(r => (
              <button key={r} onMouseDown={() => { setQuery(r); onSearch?.(r) }}
                className="flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {r}
              </button>
            ))}
          </div>
        )}

        {query && suggestions && (
          <div className="mt-2 rounded-lg border border-border bg-background p-2">
            {suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).map(s => (
              <button key={s} onMouseDown={() => { setQuery(s); onSearch?.(s) }}
                className="flex w-full items-center rounded-md px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
        )}

        {query && renderResult && renderResult(query)}
      </div>
    )
  }
)
SearchPanel.displayName = 'SearchPanel'
