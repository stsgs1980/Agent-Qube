/**
 * ProjectThemeProvider -- dynamic theme for the user's project preview.
 *
 * Architecture (Dual Theme):
 *   StudioThemeProvider (outer, stable -- Zinc)
 *     |-- Nav, sidebar, controls -- useStudioTheme()
 *     +-- ProjectThemeProvider (inner, dynamic -- Champagne/Cyan/etc.)
 *           |-- GridPreview, WireframePreview canvas -- useProjectTheme()
 *
 * Key points:
 *   - Shares the same registry as StudioTheme (same PresetDefinition)
 *   - Independent state: changing project theme does NOT affect studio chrome
 *   - Sets data-project-theme on wrapper div for CSS variable activation
 *   - SSR-safe via useMounted()
 */

'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { getPresetOrThrow, getOppositeMode, getAllIds } from './theme-registry'
import { useMounted } from './use-mounted'
import type { ThemeMode, ThemePreset, ThemeTokens, ThemeContextValue } from './theme-types'

// Ensure all presets are registered
import './presets'

// ─── Defaults ──────────────────────────────────────────────────

const DEFAULT_PROJECT_PRESET = 'champagne'

// ─── Context ───────────────────────────────────────────────────

const ProjectThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  preset: DEFAULT_PROJECT_PRESET,
  tokens: getPresetOrThrow(DEFAULT_PROJECT_PRESET).tokens,
  toggle: () => {},
  setMode: () => {},
  setPreset: () => {},
})

// ─── Provider ──────────────────────────────────────────────────

interface ProjectThemeProviderProps {
  children: ReactNode
  /** Initial project preset. Defaults to 'champagne'. */
  defaultPreset?: ThemePreset
}

export function ProjectThemeProvider({ children, defaultPreset }: ProjectThemeProviderProps) {
  const [preset, setPresetState] = useState<ThemePreset>(defaultPreset ?? DEFAULT_PROJECT_PRESET)
  const mounted = useMounted()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const currentPreset = getPresetOrThrow(preset)
  const tokens = currentPreset.tokens
  const mode = currentPreset.mode

  // Set data-project-theme on wrapper div for CSS variable activation
  useEffect(() => {
    if (mounted && wrapperRef.current) {
      wrapperRef.current.setAttribute('data-project-theme', preset)
    }
  }, [preset, mounted])

  // WCAG 2.4.7: Project-scoped focus ring color
  useEffect(() => {
    if (mounted && wrapperRef.current) {
      wrapperRef.current.style.setProperty('--project-focus-ring', tokens.focusRing)
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
    <ProjectThemeContext.Provider value={{ mode, preset, tokens, toggle, setMode, setPreset }}>
      <div ref={wrapperRef} id="project-theme-wrapper" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </ProjectThemeContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────

export function useProjectTheme() {
  return useContext(ProjectThemeContext)
}
