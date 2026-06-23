'use client'

/**
 * Theme Preset Selector — uses registry API.
 * Grouped by mode (Dark / Light), with paired toggle.
 */

import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, ChevronDown, Palette } from 'lucide-react'
import { useLayoutTheme, getAllPresets, getByMode } from '@/lib/layout/theme'
import type { PresetDefinition } from '@/lib/layout/theme-types'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Theme Toggle (sun/moon) ──────────────────────────────────

function ThemeModeToggle() {
  const { mode, toggle, tokens } = useLayoutTheme()

  return (
    <button onClick={toggle} style={{
      width: 36, height: 36, borderRadius: tokens.cornerRadius,
      border: `1px solid ${tokens.borderDefault}`,
      background: tokens.bgSurface,
      color: tokens.textMuted,
      cursor: 'pointer', transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }} title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
      <div style={{
        transition: 'transform 0.3s, opacity 0.3s',
        transform: mode === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
        opacity: mode === 'dark' ? 1 : 0, position: 'absolute',
      }}><Moon style={{ width: 16, height: 16 }} /></div>
      <div style={{
        transition: 'transform 0.3s, opacity 0.3s',
        transform: mode === 'light' ? 'rotate(0deg)' : 'rotate(-180deg)',
        opacity: mode === 'light' ? 1 : 0, position: 'absolute',
      }}><Sun style={{ width: 16, height: 16 }} /></div>
    </button>
  )
}

// ─── Preset Row ──────────────────────────────────────────────

function PresetRow({ def, active, onSelect, tokens }: {
  def: PresetDefinition; active: boolean; onSelect: () => void
  tokens: ReturnType<typeof useLayoutTheme>['tokens']
}) {
  return (
    <button onClick={onSelect} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: `${spacing.sm}px ${spacing.md}px`,
      background: active ? `${def.accent}10` : 'transparent',
      border: 'none', cursor: 'pointer', transition: 'background 0.15s',
      textAlign: 'left',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 4,
        background: def.bg,
        border: `2px solid ${active ? def.accent : tokens.borderDefault}`,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: def.accent, opacity: 0.3 }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: fontSize.base, fontWeight: active ? fontWeight.bold : fontWeight.medium, color: active ? def.accent : tokens.textPrimary, fontFamily: tokens.fontFamilyBody }}>{def.label}</div>
        <div style={{ fontSize: fontSize.xs, color: tokens.textDim, fontFamily: tokens.fontFamilyMono, marginTop: 1 }}>{def.description}</div>
      </div>
      {active && (
        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: def.accent }} />
      )}
    </button>
  )
}

// ─── Theme Preset Selector ───────────────────────────────────

export function ThemePresetSelector() {
  const { preset, setPreset, tokens } = useLayoutTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = getAllPresets().find(p => p.id === preset)
  const darkPresets = getByMode('dark')
  const lightPresets = getByMode('light')

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: `${spacing.xs}px ${spacing.md}px`,
        borderRadius: tokens.cornerRadius,
        border: `1px solid ${tokens.borderDefault}`,
        background: tokens.bgSurface, color: tokens.textSecondary,
        cursor: 'pointer', transition: 'all 0.2s',
        fontSize: fontSize.sm, fontWeight: fontWeight.semibold,
        fontFamily: tokens.fontFamilyBody,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: current?.accent ?? '#C8A97E', border: `1px solid ${tokens.borderBright}` }} />
        {current?.label ?? 'Theme'}
        <ChevronDown style={{ width: 12, height: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <ThemeModeToggle />

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 6,
          width: 260, background: tokens.bgBase,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: tokens.cornerRadius, overflow: 'hidden',
          boxShadow: tokens.cardShadow, zIndex: 50,
        }}>
          <div style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderBottom: `1px solid ${tokens.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Palette style={{ width: 12, height: 12, color: tokens.textMuted }} />
            <span style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.textDim, fontFamily: tokens.fontFamilyBody }}>Theme</span>
          </div>

          <div style={{ padding: `${spacing.xs}px 0` }}>
            <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.textDim, padding: `${spacing.xs}px ${spacing.md}px`, fontFamily: tokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Moon style={{ width: 10, height: 10 }} /> Dark
            </div>
            {darkPresets.map(def => (
              <PresetRow key={def.id} def={def} active={def.id === preset} onSelect={() => { setPreset(def.id); setOpen(false) }} tokens={tokens} />
            ))}
          </div>

          <div style={{ height: 1, background: tokens.borderSubtle, margin: `0 ${spacing.md}px` }} />

          <div style={{ padding: `${spacing.xs}px 0` }}>
            <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.textDim, padding: `${spacing.xs}px ${spacing.md}px`, fontFamily: tokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sun style={{ width: 10, height: 10 }} /> Light
            </div>
            {lightPresets.map(def => (
              <PresetRow key={def.id} def={def} active={def.id === preset} onSelect={() => { setPreset(def.id); setOpen(false) }} tokens={tokens} />
            ))}
          </div>

          <div style={{
            padding: `${spacing.sm}px ${spacing.md}px`,
            borderTop: `1px solid ${tokens.borderSubtle}`,
            fontSize: fontSize.xs, color: tokens.textDim, fontFamily: tokens.fontFamilyBody,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span>Toggle:</span>
            <kbd style={{ fontSize: fontSize.xs, background: tokens.bgSurface, padding: '1px 4px', borderRadius: 2, border: `1px solid ${tokens.borderDefault}` }}>sun/moon</kbd>
            <span style={{ marginLeft: 'auto' }}>paired dark/light</span>
          </div>
        </div>
      )}
    </div>
  )
}
