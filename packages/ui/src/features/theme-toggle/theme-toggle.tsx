'use client'

import { useState, forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

export interface ThemeToggleProps extends HTMLAttributes<HTMLButtonElement> {
  /** Current theme mode */
  mode: 'light' | 'dark'
  /** Callback when toggled */
  onToggle: () => void
  /** Show label next to icon */
  showLabel?: boolean
}

/**
 * ThemeToggle — Light/dark mode toggle button with animated icon transition.
 * Layer 4: Controlled component (state comes from parent via mode/onToggle).
 */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ mode, onToggle, showLabel = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
          className,
        )}
        {...props}
      >
        <span className="relative h-4 w-4">
          {/* Sun icon */}
          <svg className={cn('absolute inset-0 h-4 w-4 transition-all', mode === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          {/* Moon icon */}
          <svg className={cn('absolute inset-0 h-4 w-4 transition-all', mode === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
        {showLabel && <span className="text-muted-foreground">{mode === 'dark' ? 'Dark' : 'Light'}</span>}
      </button>
    )
  }
)
ThemeToggle.displayName = 'ThemeToggle'
