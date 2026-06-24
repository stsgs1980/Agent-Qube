'use client'

import { Sun, Moon, Palette } from 'lucide-react'
import { useLayoutTheme } from '@/lib/layout/theme'
import { getByMode } from '@/lib/layout/theme'
import { PresetList } from './preset-list'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Dropdown Content ─────────────────────────────────────────

function ThemeDropdownFooter({ tokens }: { tokens: any }) {
  return (
    <div style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderTop: `1px solid ${tokens.borderSubtle}`, fontSize: fontSize.xs, color: tokens.textDim, fontFamily: tokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span>Toggle:</span>
      <kbd style={{ fontSize: fontSize.xs, background: tokens.bgSurface, padding: '1px 4px', borderRadius: 2, border: `1px solid ${tokens.borderDefault}` }} />
      <span style={{ marginLeft: 'auto' }}>paired dark/light</span>
    </div>
  )
}

export function ThemeDropdown({ preset, onSelect, onClose }: { preset: string; onSelect: (id: string) => void; onClose: () => void }) {
  const { tokens } = useLayoutTheme()
 const handleSelect = (id: string) => {
    onSelect(id)
    onClose()
  }
  return (
    <div role="listbox" aria-label="Theme selector" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, width: 260, background: tokens.bgBase, border: `1px solid ${tokens.borderDefault}`, borderRadius: tokens.cornerRadius, overflow: 'hidden', boxShadow: tokens.cardShadow, zIndex: 50 }}>
      <div style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderBottom: `1px solid ${tokens.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Palette style={{ width: 12, height: 12, color: tokens.textMuted }} />
        <span style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.textDim, fontFamily: tokens.fontFamilyBody }}>Theme</span>
      </div>
      <PresetList presets={getByMode('dark')} activeId={preset} onSelect={handleSelect} icon={Moon} />
      <div style={{ height: 1, background: tokens.borderSubtle, margin: `0 ${spacing.md}px` }} />
      <PresetList presets={getByMode('light')} activeId={preset} onSelect={handleSelect} icon={Sun} />
      <ThemeDropdownFooter tokens={tokens} />
    </div>
  )
}
