/**
 * LayoutThemeProvider — theme context using the Theme Registry.
 *
 * Architecture:
 *   - Reads preset from registry via getPresetOrThrow()
 *   - Sets data-theme attribute on <html> for CSS variable activation
 *   - Provides tokens via React context for JS-based styling
 *   - toggle() switches between paired dark/light presets
 *   - SSR-safe via useMounted()
 */

'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getPresetOrThrow, getOppositeMode, getAllIds } from './theme-registry'
import { useMounted } from './use-mounted'
import type { ThemeMode, ThemePreset, ThemeTokens, ThemeContextValue } from './theme-types'

// Ensure all presets are registered
import './presets'

// ─── Context ─────────────────────────────────────────────────────

const DEFAULT_PRESET = 'champagne'

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  preset: DEFAULT_PRESET,
  tokens: getPresetOrThrow(DEFAULT_PRESET).tokens,
  toggle: () => {},
  setMode: () => {},
  setPreset: () => {},
})

// ─── Provider ────────────────────────────────────────────────────

export function LayoutThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<ThemePreset>(DEFAULT_PRESET)
  const mounted = useMounted()

  const currentPreset = getPresetOrThrow(preset)
  const tokens = currentPreset.tokens
  const mode = currentPreset.mode

  // Set data-theme attribute on <html> to activate CSS variables
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', preset)
    }
  }, [preset, mounted])

  // WCAG 2.4.7: Set CSS custom property for focus ring color
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty('--stsgs-focus-ring', tokens.focusRing)
    }
  }, [tokens.focusRing, mounted])

  const toggle = useCallback(() => {
    const opposite = getOppositeMode(preset)
    if (opposite) {
      setPresetState(opposite.id)
    }
  }, [preset])

  const setMode = useCallback((m: ThemeMode) => {
    if (m === currentPreset.mode) return
    const opposite = getOppositeMode(preset)
    if (opposite) {
      setPresetState(opposite.id)
    }
  }, [preset, currentPreset.mode])

  const setPreset = useCallback((p: ThemePreset) => {
    if (getAllIds().includes(p)) {
      setPresetState(p)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, preset, tokens, toggle, setMode, setPreset }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────

export function useLayoutTheme() {
  return useContext(ThemeContext)
}

// ─── Re-exports ──────────────────────────────────────────────────

export type { ThemeMode, ThemePreset, ThemeTokens, ThemeContextValue } from './theme-types'
export { getPreset, getAllPresets, getByMode, getPair } from './theme-registry'
