'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLayoutTheme } from '@/lib/layout/theme'
import { useProjectTheme } from '@/lib/layout/project-theme'
import { getAllPresets } from '@/lib/layout/theme'
import { ThemeModeToggle } from './theme-mode-toggle'
import { ThemeDropdown } from './theme-dropdown'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Theme Preset Selector (trigger + dropdown) ───────────────
// Styled by Studio theme, controls Project theme.

export function ThemePresetSelector() {
  const { preset, setPreset } = useProjectTheme()
  const { tokens: studioTokens } = useLayoutTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = getAllPresets().find((p) => p.id === preset)
  if (!current) return null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* Current preset trigger */}
      <button onClick={() => setOpen(!open)}
        aria-label="Select theme" aria-haspopup="listbox" aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: `${spacing.xs}px ${spacing.md}px`,
          borderRadius: studioTokens.cornerRadius,
          border: `1px solid ${studioTokens.borderDefault}`,
          background: studioTokens.bgSurface,
          color: studioTokens.textSecondary,
          cursor: 'pointer', transition: 'all 0.2s',
          fontSize: fontSize.sm, fontWeight: fontWeight.semibold,
          fontFamily: studioTokens.fontFamilyBody,
        }}>
        <div style={{
          width: 10, height: 10, borderRadius: 2,
          background: current.accent,
          border: `1px solid ${studioTokens.borderBright}`,
        }} />
        {current.label}
        <ChevronDown style={{
          width: 12, height: 12,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }} />
      </button>

      <ThemeModeToggle />

      {open && <ThemeDropdown preset={preset} onSelect={setPreset} onClose={() => setOpen(false)} />}
    </div>
  )
}
