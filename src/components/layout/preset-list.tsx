'use client'

import { useLayoutTheme } from '@/lib/layout/theme'
import type { PresetDefinition } from '@/lib/layout/theme-types'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Preset List (Dark or Light section) ──────────────────────

export function PresetList({
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

// Suppress unused import warning — Sun type used in PresetList props
declare const Sun: typeof import('lucide-react').Sun
