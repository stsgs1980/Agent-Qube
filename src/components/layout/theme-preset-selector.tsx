'use client'

import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, ChevronDown, Palette } from 'lucide-react'
import { useLayoutTheme } from '@/lib/layout/theme'
import { useProjectTheme } from '@/lib/layout/project-theme'
import { getByMode, getAllPresets } from '@/lib/layout/theme'
import type { ThemePreset } from '@/lib/layout/theme-types'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Theme Toggle (sun/moon) ──────────────────────────────────
// Controls the PROJECT theme (what the user is designing).

function ThemeModeToggle() {
  const { mode, toggle } = useProjectTheme()
  const { tokens: studioTokens } = useLayoutTheme()

  return (
    <button onClick={toggle} aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} style={{
      width: 36, height: 36, borderRadius: studioTokens.cornerRadius,
      border: `1px solid ${studioTokens.borderDefault}`,
      background: studioTokens.bgSurface,
      color: studioTokens.textMuted,
      cursor: 'pointer', transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }} title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
      <div style={{
        transition: 'transform 0.3s, opacity 0.3s',
        transform: mode === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
        opacity: mode === 'dark' ? 1 : 0,
        position: 'absolute',
      }}>
        <Moon style={{ width: 16, height: 16 }} />
      </div>
      <div style={{
        transition: 'transform 0.3s, opacity 0.3s',
        transform: mode === 'light' ? 'rotate(0deg)' : 'rotate(-180deg)',
        opacity: mode === 'light' ? 1 : 0,
        position: 'absolute',
      }}>
        <Sun style={{ width: 16, height: 16 }} />
      </div>
    </button>
  )
}

// ─── Theme Preset Picker ──────────────────────────────────────
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

  // Use registry functions instead of old themePresets Record
  const allPresets = getAllPresets()
  const darkPresets = getByMode('dark')
  const lightPresets = getByMode('light')
  const current = allPresets.find((p) => p.id === preset)

  if (!current) return null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* Current preset button */}
      <button onClick={() => setOpen(!open)} aria-label='Select theme' aria-haspopup='listbox' aria-expanded={open} style={{
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
        <div style={{ width: 10, height: 10, borderRadius: 2, background: current.accent, border: `1px solid ${studioTokens.borderBright}` }} />
        {current.label}
        <ChevronDown style={{ width: 12, height: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {/* Dark/Light toggle */}
      <ThemeModeToggle />

      {/* Dropdown */}
      {open && (
          <div role="listbox" aria-label="Theme selector" style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 6,
          width: 260, background: studioTokens.bgBase,
          border: `1px solid ${studioTokens.borderDefault}`,
          borderRadius: studioTokens.cornerRadius, overflow: 'hidden',
          boxShadow: studioTokens.cardShadow, zIndex: 50,
        }}>
          {/* Header */}
          <div style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderBottom: `1px solid ${studioTokens.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Palette style={{ width: 12, height: 12, color: studioTokens.textMuted }} />
            <span style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: studioTokens.textDim, fontFamily: studioTokens.fontFamilyBody }}>Theme</span>
          </div>

          {/* Dark section */}
          <div style={{ padding: `${spacing.xs}px 0` }}>
            <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: studioTokens.textDim, padding: `${spacing.xs}px ${spacing.md}px`, fontFamily: studioTokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Moon style={{ width: 10, height: 10 }} /> Dark
            </div>
            {darkPresets.map((p) => {
              const active = p.id === preset
              return (
                <button key={p.id} onClick={() => { setPreset(p.id); setOpen(false) }} role="option" aria-selected={active} aria-label={p.label} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  background: active ? `${p.accent}10` : 'transparent',
                  border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                  textAlign: 'left',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 4,
                    background: p.bg,
                    border: `2px solid ${active ? p.accent : studioTokens.borderDefault}`,
                    position: 'relative', overflow: 'hidden', flexShrink: 0,
                  }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: p.accent, opacity: 0.3 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: fontSize.base, fontWeight: active ? fontWeight.bold : fontWeight.medium, color: active ? p.accent : studioTokens.textPrimary, fontFamily: studioTokens.fontFamilyBody }}>{p.label}</div>
                    <div style={{ fontSize: fontSize.xs, color: studioTokens.textDim, fontFamily: studioTokens.fontFamilyMono, marginTop: 1 }}>{p.description}</div>
                  </div>
                  {active && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: p.accent }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: studioTokens.borderSubtle, margin: `0 ${spacing.md}px` }} />

          {/* Light section */}
          <div style={{ padding: `${spacing.xs}px 0` }}>
            <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: studioTokens.textDim, padding: `${spacing.xs}px ${spacing.md}px`, fontFamily: studioTokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sun style={{ width: 10, height: 10 }} /> Light
            </div>
            {lightPresets.map((p) => {
              const active = p.id === preset
              return (
                <button key={p.id} onClick={() => { setPreset(p.id); setOpen(false) }} role="option" aria-selected={active} aria-label={p.label} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  background: active ? `${p.accent}10` : 'transparent',
                  border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                  textAlign: 'left',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 4,
                    background: p.bg,
                    border: `2px solid ${active ? p.accent : studioTokens.borderDefault}`,
                    position: 'relative', overflow: 'hidden', flexShrink: 0,
                  }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: p.accent, opacity: 0.3 }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: fontSize.base, fontWeight: active ? fontWeight.bold : fontWeight.medium, color: active ? p.accent : studioTokens.textPrimary, fontFamily: studioTokens.fontFamilyBody }}>{p.label}</div>
                    <div style={{ fontSize: fontSize.xs, color: studioTokens.textDim, fontFamily: studioTokens.fontFamilyMono, marginTop: 1 }}>{p.description}</div>
                  </div>
                  {active && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: p.accent }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer hint */}
          <div style={{
            padding: `${spacing.sm}px ${spacing.md}px`,
            borderTop: `1px solid ${studioTokens.borderSubtle}`,
            fontSize: fontSize.xs, color: studioTokens.textDim, fontFamily: studioTokens.fontFamilyBody,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span>Toggle:</span>
            <kbd style={{ fontSize: fontSize.xs, background: studioTokens.bgSurface, padding: '1px 4px', borderRadius: 2, border: `1px solid ${studioTokens.borderDefault}` }}></kbd>
            <span style={{ marginLeft: 'auto' }}>paired dark/light</span>
          </div>
        </div>
      )}
    </div>
  )
}
