'use client'

import { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────

export interface UseCopyToClipboardOptions {
  /** Timeout in ms before copied state resets (default 2000) */
  timeout?: number
}

export interface UseCopyToClipboardReturn {
  /** Whether text is currently in "copied" state */
  copied: boolean
  /** Copy text to clipboard. Returns true on success. */
  copy: (text: string) => Promise<boolean>
}

// ─── useCopyToClipboard Hook ──────────────────────────────────

/**
 * useCopyToClipboard -- copy text to clipboard with feedback state.
 *
 * Tries the Clipboard API first, falls back to execCommand.
 * Automatically resets the copied state after the configured timeout.
 *
 * @example
 * ```tsx
 * function CopyButton() {
 *   const { copied, copy } = useCopyToClipboard({ timeout: 1500 })
 *   return (
 *     <button onClick={() => copy('Hello, world!')}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const { timeout = 2000 } = options
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
      return true
    } catch {
      // Fallback for older browsers / insecure contexts
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
        return true
      } catch {
        return false
      }
    }
  }, [timeout])

  return { copied, copy }
}
