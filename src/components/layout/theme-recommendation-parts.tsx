'use client'

import { Palette, ArrowRight } from 'lucide-react'
import { useLayoutTheme, getAllPresets } from '@/lib/layout/theme'
import { recommendThemes } from '@/lib/layout/recommend-theme'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'
import type { ThemeTokens } from '@/lib/layout/theme-types'

// ─── Top Recommendation Card ──────────────────────────────

export function TopRecommendation({ tokens, preset, setPreset, onApply, rec, meta, isActive }: {
  tokens: ThemeTokens; preset: string; setPreset: (id: string) => void
  onApply?: (id: string) => void; rec: any; meta: any; isActive: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, background: tokens.bgBase, borderRadius: radius.xl, border: `1px solid ${isActive ? tokens.accentPrimary : tokens.borderSubtle}`, marginBottom: 0 }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: meta?.bg ?? tokens.bgDeep, border: `2px solid ${meta?.accent ?? tokens.accentPrimary}`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: meta?.accent ?? tokens.accentPrimary, opacity: 0.4 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody, color: meta?.accent ?? tokens.accentPrimary }}>{meta?.label ?? rec.presetId}</span>
          <span style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, padding: '2px 8px', borderRadius: radius.lg, background: `${tokens.accentPrimary}15`, color: tokens.accentPrimary }}>{Math.round(rec.confidence * 100)}%</span>
        </div>
        <div style={{ fontSize: fontSize.sm, color: tokens.textMuted, fontFamily: tokens.fontFamilyMono, marginTop: 2 }}>{rec.reason} · mood: {rec.mood}</div>
      </div>
      {!isActive ? (
        <button onClick={() => { setPreset(rec.presetId); onApply?.(rec.presetId) }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `${spacing.sm}px ${spacing.lg}px`, borderRadius: radius.lg, background: tokens.accentPrimary, color: tokens.textOnAccent, border: 'none', cursor: 'pointer', fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody, transition: 'all 0.15s' }}>
          Apply <ArrowRight style={{ width: 12, height: 12 }} />
        </button>
      ) : (
        <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, color: tokens.accentPrimary, padding: `${spacing.sm}px ${spacing.lg}px` }}>Active</div>
      )}
    </div>
  )
}

// ─── Other Recommendations ────────────────────────────────

export function OtherRecommendations({ tokens, preset, setPreset, recs }: {
  tokens: ThemeTokens; preset: string; setPreset: (id: string) => void; recs: any[]
}) {
  if (recs.length <= 1) return null
  return (
    <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.md }}>
      {recs.slice(1, 4).map(r => (
        <RecommendationChip key={r.presetId} r={r} preset={preset} setPreset={setPreset} tokens={tokens} />
      ))}
    </div>
  )
}

function RecommendationChip({ r, preset, setPreset, tokens }: { r: any; preset: string; setPreset: (id: string) => void; tokens: ThemeTokens }) {
  const m = getAllPresets().find(p => p.id === r.presetId)
  const active = preset === r.presetId
  const chipAccent = m?.accent ?? tokens.accentPrimary
  const bg = active ? `${chipAccent}15` : tokens.bgSurface
  const border = active ? chipAccent : tokens.borderDefault
  const textColor = active ? (m?.accent ?? tokens.textPrimary) : tokens.textSecondary
  const fw = active ? fontWeight.bold : fontWeight.medium
  return (
    <button onClick={() => setPreset(r.presetId)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.lg, background: bg, border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.15s' }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, background: m?.bg, border: `1px solid ${m?.accent}`, flexShrink: 0 }} />
      <span style={{ fontSize: fontSize.sm, fontWeight: fw, color: textColor, fontFamily: tokens.fontFamilyBody }}>{m?.label ?? r.presetId}</span>
      <span style={{ fontSize: fontSize.xs, color: tokens.textDim, fontFamily: tokens.fontFamilyMono }}>{Math.round(r.confidence * 100)}%</span>
    </button>
  )
}

// ─── Panel Shell ──────────────────────────────────────────

export function ThemeRecsShell({ tokens, children, goal }: {
  tokens: ThemeTokens; children: React.ReactNode; goal: string
}) {
  return (
    <div style={{ padding: spacing.lg, background: `${tokens.accentPrimary}06`, border: `1px solid ${tokens.accentPrimary}18`, borderRadius: radius['2xl'], transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Palette style={{ width: 14, height: 14, color: tokens.accentPrimary }} />
        <span style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.accentPrimary, fontFamily: tokens.fontFamilyMono }}>Recommended Theme</span>
        <span style={{ marginLeft: 'auto', fontSize: fontSize.xs, fontFamily: tokens.fontFamilyMono, color: tokens.textDim }}>for &quot;{goal}&quot;</span>
      </div>
      {children}
    </div>
  )
}