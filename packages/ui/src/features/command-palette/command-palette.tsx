'use client'

import { useState, useEffect, forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface CommandPaletteProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the palette is open */
  open: boolean
  /** Callback when palette should close */
  onClose: () => void
  /** Placeholder text */
  placeholder?: string
  /** Suggestion items */
  suggestions?: Array<{ id: string; label: string; icon?: ReactNode; onSelect?: () => void }>
  /** Keyboard shortcut to open (e.g. 'k') */
  shortcutKey?: string
}

/**
 * CommandPalette — ⌘K-style command palette with search and suggestions.
 * Layer 4: Has own state (search query). Controlled open/close via props.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   open={showPalette}
 *   onClose={() => setShowPalette(false)}
 *   suggestions={[
 *     { id: '1', label: 'Open Dashboard', onSelect: () => navigate('/dashboard') },
 *   ]}
 * />
 * ```
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ open, onClose, placeholder = 'Type a command...', suggestions, shortcutKey = 'k', className, ...props }, ref) => {
    const [query, setQuery] = useState('')

    useEffect(() => {
      if (!open) { setQuery(''); return }
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }, [open, onClose])

    if (!open) return null

    const filtered = suggestions
      ? suggestions.filter(s => s.label.toLowerCase().includes(query.toLowerCase()))
      : []

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[20vh] backdrop-blur-sm" onClick={onClose}>
        <div ref={ref} className={cn('w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl', className)} onClick={e => e.stopPropagation()} {...props}>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">Esc</kbd>
          </div>
          {suggestions && (
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggestions</div>
              {filtered.map(s => (
                <button key={s.id} onClick={() => { s.onSelect?.(); onClose() }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {s.icon} {s.label}
                </button>
              ))}
              {filtered.length === 0 && <div className="px-3 py-4 text-center text-sm text-muted-foreground">No results</div>}
            </div>
          )}
        </div>
      </div>
    )
  }
)
CommandPalette.displayName = 'CommandPalette'
