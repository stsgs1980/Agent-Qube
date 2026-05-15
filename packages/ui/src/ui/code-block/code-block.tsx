'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'
import { CopyButton } from '../copy-button'

// ─── Types ────────────────────────────────────────────────────

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Code content to display */
  code: string
  /** Language identifier for syntax hint (display only) */
  language?: string
  /** Filename shown in the chrome bar */
  filename?: string
  /** Whether to show line numbers (default true) */
  showLineNumbers?: boolean
  /** Whether to show the copy button (default true) */
  showCopyButton?: boolean
  /** Whether to show the window chrome (default true) */
  showChrome?: boolean
  /** Maximum height with overflow scroll */
  maxHeight?: string
  /** Custom header content replacing the chrome bar */
  header?: ReactNode
}

// ─── CodeBlock Component ──────────────────────────────────────

/**
 * CodeBlock -- VS Code-style code display with chrome, line numbers, and copy.
 *
 * A self-contained code viewer with optional window chrome bar (dots + filename),
 * line numbers, and an integrated copy button. Designed for presenting
 * generated code (CSS, HTML, JS, etc.) in tool and documentation pages.
 *
 * Note: This component does NOT include syntax highlighting. Wrap code in a
 * highlighting library (e.g. highlight.js, Prism) or pass pre-highlighted
 * markup via children.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   filename="button.tsx"
 *   language="tsx"
 *   code={`const Button = () => <button>Click</button>`}
 * />
 * ```
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language,
      filename,
      showLineNumbers = true,
      showCopyButton = true,
      showChrome = true,
      maxHeight,
      header,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const lines = code.split('\n')

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden rounded-lg border border-border bg-zinc-950 dark:bg-zinc-900', className)}
        {...props}
      >
        {/* Chrome bar */}
        {(showChrome || header) && (
          <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2 dark:border-zinc-800">
            {header ?? (
              <>
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-yellow-500/80" />
                  <span className="size-2.5 rounded-full bg-green-500/80" />
                </div>
                {filename && (
                  <span className="text-xs text-zinc-400">{filename}</span>
                )}
                <div className="flex-1" />
                {language && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {language}
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {/* Code area */}
        <div
          className="overflow-auto text-xs leading-relaxed"
          style={maxHeight ? { maxHeight } : undefined}
        >
          <pre className="p-4 font-mono">
            <code>
              {children ?? (
                lines.map((line, i) => (
                  <div key={i} className="flex">
                    {showLineNumbers && (
                      <span className="mr-4 inline-block w-6 shrink-0 select-none text-right text-zinc-600">
                        {i + 1}
                      </span>
                    )}
                    <span className="text-zinc-300">{line || ' '}</span>
                  </div>
                ))
              )}
            </code>
          </pre>
        </div>

        {/* Copy button */}
        {showCopyButton && (
          <div className="flex justify-end border-t border-zinc-800 bg-zinc-900/50 px-3 py-1.5">
            <CopyButton value={code} size="sm" className="border-zinc-700 text-zinc-400 hover:text-zinc-200" />
          </div>
        )}
      </div>
    )
  }
)
CodeBlock.displayName = 'CodeBlock'
