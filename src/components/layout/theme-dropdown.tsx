'use client'

import { Sun, Moon, Palette } from 'lucide-react'
import { useProjectTheme } from '@/lib/layout/project-theme'
import { useLayoutTheme } from '@/lib/layout/theme'
import { getByMode, getAllPresets } from '@/lib/layout/theme'
import type { PresetDefinition } from '@/lib/layout/theme-types'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Preset List (Dark or Light section) ──────────────────────

function PresetList({
  presets,
  activeId,
  onSelect,
  icon: SectionIcon,
}: {
  presets: PresetDefinition[]
  activeId: string
  onSelect: (id: string) => void
  icon: typeof Sun
}) {
  const { tokens: studioTokens } = useLayoutTheme()
  return (
    <div style={{ padding: `${spacing.xs}px 0` }}>
      <div style={{
        fontSize: fontSize.xs, fontWeight: fontWeight.bold,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        color: studioTokens.textDim,
        padding: `${spacing.xs}px ${spacing.md}px`,
        fontFamily: studioTokens.fontFamilyBody,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <SectionIcon style={{ width: 10, height: 10 }} />
        {presets[0]?.mode === 'dark' ? 'Dark' : 'Light'}
      </div>
      {presets.map((p) => {
        const active = p.id === activeId
        return (
          <button key={p.id} onClick={() => onSelect(p.id)}
            role="option" aria-selected={active} aria-label={p.label}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: `${spacing.sm}px ${spacing.md}px`,
              background: active ? `${p.accent}10` : 'transparent',
              border: 'none', cursor: 'pointer',
              transition: 'background 0.15s', textAlign: 'left',
            }}>
            <Swatch active={active} accent={p.accent} bg={p.bg} />
            <PresetInfo active={active} preset={p} />
            {active && <ActiveDot accent={p.accent} />}
          </button>
        )
      })}
    </div>
  )
}

// ─── Color Swatch ─────────────────────────────────────────────

function Swatch({ active, accent, bg }: { active: boolean; accent: string; bg: string }) {
  const { tokens: studioTokens } = useLayoutTheme()
  return (
    <div style={{
      width: 24, height: 24, borderRadius: 4,
      background: bg,
      border: `2px solid ${active ? accent : studioTokens.borderDefault}`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: accent, opacity: 0.3 }} />
    </div>
  )
}

// ─── Preset Info (label + description) ────────────────────────

function PresetInfo({ active, preset }: { active: boolean; preset: PresetDefinition }) {
  const { tokens: studioTokens } = useLayoutTheme()
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: fontSize.base,
        fontWeight: active ? fontWeight.bold : fontWeight.medium,
        color: active ? preset.accent : studioTokens.textPrimary,
        fontFamily: studioTokens.fontFamilyBody,
      }}>{preset.label}</div>
      <div style={{
        fontSize: fontSize.xs, color: studioTokens.textDim,
        fontFamily: studioTokens.fontFamilyMono, marginTop: 1,
      }}>{preset.description}</div>
    </div>
  )
}

// ─── Active Dot Indicator ─────────────────────────────────────

function ActiveDot({ accent }: { accent: string }) {
  return (
    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: accent }} />
  )
}

// ─── Dropdown Content ─────────────────────────────────────────

export function ThemeDropdown({
  preset,
  onSelect,
  onClose,
}: {
  preset: string
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const { tokens: studioTokens } = useLayoutTheme()
  const darkPresets = getByMode('dark')
  const lightPresets = getByMode('light')

  const handleSelect = (id: string) => { onSelect(id); onClose() }

  return (
    <div role="listbox" aria-label="Theme selector" style={{
      position: 'absolute', top: '100%', right: 0, marginTop: 6,
      width: 260, background: studioTokens.bgBase,
      border: `1px solid ${studioTokens.borderDefault}`,
      borderRadius: studioTokens.cornerRadius, overflow: 'hidden',
      boxShadow: studioTokens.cardShadow, zIndex: 50,
    }}>
      {/* Header */}
      <div style={{
        padding: `${spacing.sm}px ${spacing.md}px`,
        borderBottom: `1px solid ${studioTokens.borderSubtle}`,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Palette style={{ width: 12, height: 12, color: studioTokens.textMuted }} />
        <span style={{
          fontSize: fontSize.sm, fontWeight: fontWeight.bold,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: studioTokens.textDim, fontFamily: studioTokens.fontFamilyBody,
        }}>Theme</span>
      </div>

      <PresetList presets={darkPresets} activeId={preset} onSelect={handleSelect} icon={Moon} />

      <div style={{ height: 1, background: studioTokens.borderSubtle, margin: `0 ${spacing.md}px` }} />

      <PresetList presets={lightPresets} activeId={preset} onSelect={handleSelect} icon={Sun} />

      {/* Footer hint */}
      <div style={{
        padding: `${spacing.sm}px ${spacing.md}px`,
        borderTop: `1px solid ${studioTokens.borderSubtle}`,
        fontSize: fontSize.xs, color: studioTokens.textDim,
        fontFamily: studioTokens.fontFamilyBody,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span>Toggle:</span>
        <kbd style={{
          fontSize: fontSize.xs, background: studioTokens.bgSurface,
          padding: '1px 4px', borderRadius: 2,
          border: `1px solid ${studioTokens.borderDefault}`,
        }} />
        <span style={{ marginLeft: 'auto' }}>paired dark/light</span>
      </div>
    </div>
  )
}
