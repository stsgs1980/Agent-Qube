'use client'

/**
 * Theme Recommendation Panel — shows recommended preset based on goal.
 * Uses recommendTheme() engine with confidence scoring.
 */

import { useMemo } from 'react'
import { Palette, Sparkles, ArrowRight } from 'lucide-react'
import { useLayoutTheme, getAllPresets } from '@/lib/layout/theme'
import { recommendThemes } from '@/lib/layout/recommend-theme'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

interface ThemeRecommendationPanelProps {
  goal: string
  onApply?: (presetId: string) => void
}

export function ThemeRecommendationPanel({ goal, onApply }: ThemeRecommendationPanelProps) {
  const { tokens, preset, setPreset } = useLayoutTheme()

  const recs = useMemo(() => recommendThemes(goal, undefined, undefined), [goal])
  const topRec = recs[0]
  const allPresets = useMemo(() => {
    const map = new Map<string, { label: string; accent: string; bg: string }>()
    for (const p of getAllPresets()) map.set(p.id, { label: p.label, accent: p.accent, bg: p.bg })
    return map
  }, [])

  if (!topRec) return null

  const isActive = preset === topRec.presetId
  const meta = allPresets.get(topRec.presetId)

  return (
    <div style={{
      padding: spacing.lg,
      background: `${tokens.accentPrimary}06`,
      border: `1px solid ${tokens.accentPrimary}18`,
      borderRadius: radius['2xl'],
      transition: 'all 0.3s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Palette style={{ width: 14, height: 14, color: tokens.accentPrimary }} />
        <span style={{
          fontSize: fontSize.sm, fontWeight: fontWeight.bold,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: tokens.accentPrimary, fontFamily: tokens.fontFamilyMono,
        }}>
          Recommended Theme
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: fontSize.xs, fontFamily: tokens.fontFamilyMono,
          color: tokens.textDim,
        }}>
          for &quot;{goal}&quot;
        </span>
      </div>

      {/* Top recommendation */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: spacing.md,
        padding: spacing.md,
        background: tokens.bgBase,
        borderRadius: radius.xl,
        border: `1px solid ${isActive ? tokens.accentPrimary : tokens.borderSubtle}`,
        marginBottom: recs.length > 1 ? spacing.md : 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: meta?.bg ?? tokens.bgDeep,
          border: `2px solid ${meta?.accent ?? tokens.accentPrimary}`,
          position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: meta?.accent ?? tokens.accentPrimary, opacity: 0.4 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody, color: meta?.accent ?? tokens.accentPrimary }}>
              {meta?.label ?? topRec.presetId}
            </span>
            <span style={{
              fontSize: fontSize.xs, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono,
              padding: '2px 8px', borderRadius: radius.lg,
              background: `${tokens.accentPrimary}15`, color: tokens.accentPrimary,
            }}>
              {Math.round(topRec.confidence * 100)}%
            </span>
          </div>
          <div style={{ fontSize: fontSize.sm, color: tokens.textMuted, fontFamily: tokens.fontFamilyMono, marginTop: 2 }}>
            {topRec.reason} · mood: {topRec.mood}
          </div>
        </div>
        {!isActive && (
          <button onClick={() => { setPreset(topRec.presetId); onApply?.(topRec.presetId) }} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: `${spacing.sm}px ${spacing.lg}px`,
            borderRadius: radius.lg,
            background: tokens.accentPrimary, color: tokens.textOnAccent,
            border: 'none', cursor: 'pointer',
            fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody,
            transition: 'all 0.15s',
          }}>
            Apply <ArrowRight style={{ width: 12, height: 12 }} />
          </button>
        )}
        {isActive && (
          <div style={{
            fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono,
            color: tokens.accentPrimary, padding: `${spacing.sm}px ${spacing.lg}px`,
          }}>
            Active
          </div>
        )}
      </div>

      {/* Other recommendations */}
      {recs.length > 1 && (
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          {recs.slice(1, 4).map(r => {
            const m = allPresets.get(r.presetId)
            const active = preset === r.presetId
            return (
              <button key={r.presetId} onClick={() => setPreset(r.presetId)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: `${spacing.xs}px ${spacing.md}px`,
                borderRadius: radius.lg,
                background: active ? `${m?.accent ?? tokens.accentPrimary}15` : tokens.bgSurface,
                border: `1px solid ${active ? (m?.accent ?? tokens.accentPrimary) : tokens.borderDefault}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: m?.bg, border: `1px solid ${m?.accent}`, flexShrink: 0 }} />
                <span style={{ fontSize: fontSize.sm, fontWeight: active ? fontWeight.bold : fontWeight.medium, color: active ? (m?.accent ?? tokens.textPrimary) : tokens.textSecondary, fontFamily: tokens.fontFamilyBody }}>
                  {m?.label ?? r.presetId}
                </span>
                <span style={{ fontSize: fontSize.xs, color: tokens.textDim, fontFamily: tokens.fontFamilyMono }}>
                  {Math.round(r.confidence * 100)}%
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
