'use client'

import { useState, useCallback, useEffect } from 'react'
import { useMounted } from './use-mounted'

// ─── Types ────────────────────────────────────────────────────

export interface UseLocalStorageOptions<T> {
  /** Custom serializer (default JSON.stringify) */
  serializer?: (value: T) => string
  /** Custom deserializer (default JSON.parse) */
  deserializer?: (raw: string) => T
}

export interface UseLocalStorageReturn<T> {
  /** Current stored value (or initial value during SSR) */
  value: T
  /** Update the stored value */
  setValue: (value: T | ((prev: T) => T)) => void
  /** Remove the key from localStorage */
  remove: () => void
}

// ─── useLocalStorage Hook ─────────────────────────────────────

/**
 * useLocalStorage -- reactive localStorage binding with SSR safety.
 *
 * Returns the current value, a setter (accepts value or updater function),
 * and a remove function. Hydrates lazily on mount to prevent mismatches.
 *
 * @example
 * ```tsx
 * function Settings() {
 *   const { value: theme, setValue: setTheme } = useLocalStorage('theme', 'dark')
 *   return <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>{theme}</button>
 * }
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const { serializer = JSON.stringify, deserializer = JSON.parse } = options
  const mounted = useMounted()

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? deserializer(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue(prev => {
        const resolved = typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(key, serializer(resolved))
          } catch {
            // Storage full or disabled
          }
        }
        return resolved
      })
    },
    [key, serializer]
  )

  const remove = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
    setValue(initialValue)
  }, [key, initialValue])

  // Sync across tabs via storage event
  useEffect(() => {
    if (!mounted) return
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return
      if (e.newValue === null) {
        setValue(initialValue)
      } else {
        try { setValue(deserializer(e.newValue)) } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, mounted, initialValue, deserializer])

  return { value, setValue: setStoredValue, remove }
}
