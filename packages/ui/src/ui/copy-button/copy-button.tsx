'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** Text to copy to clipboard */
  value: string
  /** Timeout in ms for "copied" feedback (default 2000) */
  timeout?: number
  /** Icon shown in default state */
  copyIcon?: ReactNode
  /** Icon shown in copied state */
  checkIcon?: ReactNode
  /** Size variant */
  size?: 'sm' | 'md'
}

// ─── CopyButton Component ─────────────────────────────────────

/**
 * CopyButton -- one-click copy to clipboard with visual feedback.
 *
 * Shows a copy icon by default and swaps to a check icon after copying.
 * Resets automatically after the configured timeout.
 *
 * @example
 * ```tsx
 * <CopyButton value="npm install @stsgs/ui" />
 * ```
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ value, timeout, copyIcon, checkIcon, size = 'sm', className, ...props }, ref) => {
    const { copied, copy } = useCopyToClipboard({ timeout })

    const sizeClasses = size === 'sm'
      ? 'h-6 w-6 text-xs'
      : 'h-8 w-8 text-sm'

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => copy(value)}
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-border transition-colors',
          copied
            ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          sizeClasses,
          className
        )}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        {...props}
      >
        {copied
          ? checkIcon ?? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}>
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          )
          : copyIcon ?? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}>
              <path d="M7.25 2.25a.75.75 0 011 0l.563.563a.75.75 0 01-1.06 1.06L7 3.06V7a.75.75 0 01-1.5 0V3.06l-.254.253a.75.75 0 01-1.06-1.06l.563-.563a2.25 2.25 0 013 0zM3.75 7a.75.75 0 011.5 0v6a1.5 1.5 0 003 0V7A.75.75 0 0110 7v6a3 3 0 01-6 0V7zM10 3.25a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0V4a.75.75 0 01.75-.75zM13 7a.75.75 0 011.5 0v6a1.5 1.5 0 003 0V7a.75.75 0 011.5 0v6a3 3 0 01-6 0V7z" />
            </svg>
          )
        }
      </button>
    )
  }
)
CopyButton.displayName = 'CopyButton'
