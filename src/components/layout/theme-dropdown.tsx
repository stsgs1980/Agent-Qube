'use client'

import { Sun, Moon, Palette } from 'lucide-react'
import { useLayoutTheme } from '@/lib/layout/theme'
import { getByMode } from '@/lib/layout/theme'
import { PresetList } from './preset-list'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

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
