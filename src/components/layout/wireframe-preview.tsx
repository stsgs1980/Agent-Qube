'use client'

import { useState } from 'react'
import { Monitor, Smartphone, Tablet, Maximize2 } from 'lucide-react'
import type { LayoutRecipe } from '@/lib/layout/types'
import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { categoryMeta } from '@/lib/layout/types'
import { useLayoutTheme } from '@/lib/layout/theme'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Variant: Wireframe Preview ───────────────────────────────

export function WireframePreview({ recipe, score, showDetails = true }: { recipe: LayoutRecipe; score?: number; showDetails?: boolean }) {
  const { tokens } = useLayoutTheme()
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [expanded, setExpanded] = useState(false)
  const catMeta = categoryMeta[recipe.category]

  return (
    <div style={{
      backgroundColor: tokens.bgBase, border: `1px solid ${tokens.borderSubtle}`,
      borderRadius: radius['3xl'], overflow: 'hidden', color: tokens.textPrimary,
      boxShadow: tokens.cardShadow, transition: 'all 0.3s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing.md}px ${spacing.xl}px`, borderBottom: `1px solid ${tokens.borderSubtle}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          {score !== undefined && <ScoreGauge score={score} size={40} />}
          <div>
            <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody, color: tokens.textPrimary }}>{recipe.name}</div>
            {showDetails && <div style={{ fontSize: fontSize.sm, color: tokens.textMuted, fontFamily: tokens.fontFamilyMono }}>{recipe.structure}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          {catMeta && <CategoryBadge label={catMeta.label} tokens={tokens} />}
          <button onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Collapse' : 'Expand'} style={{ width: 28, height: 28, borderRadius: radius.md, border: `1px solid ${tokens.borderDefault}`, background: tokens.bgSurface, color: tokens.textSecondary, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Maximize2 style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      <ViewportSwitcher viewport={viewport} onViewportChange={setViewport} tokens={tokens} />

      {/* Canvas */}
      <div style={{ padding: spacing.xl, display: 'flex', justifyContent: 'center', background: tokens.bgDeep, minHeight: expanded ? 400 : 200, transition: 'background 0.3s' }}>
        <div style={{ width: viewportWidth(viewport), maxWidth: '100%', transition: 'width 0.5s' }}>
          <GridPreview recipe={viewRecipe(recipe, viewport)} compact={!expanded} showCode={expanded} />
        </div>
      </div>

      {/* Info Bar */}
      {showDetails && expanded && <RegionsLegend recipe={recipe} tokens={tokens} />}
      {showDetails && score !== undefined && <ScoreFooter recipe={recipe} score={score} tokens={tokens} />}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────

function viewportWidth(vp: string): string {
  return vp === 'mobile' ? '375px' : vp === 'tablet' ? '768px' : '100%'
}

function viewRecipe(recipe: LayoutRecipe, viewport: string): LayoutRecipe {
  const key = viewport === 'mobile' ? 'gridTemplateMobile' : viewport === 'tablet' ? 'gridTemplateTablet' : 'gridTemplate'
  return { ...recipe, gridTemplate: (recipe[key as keyof LayoutRecipe] as LayoutRecipe['gridTemplate']) ?? recipe.gridTemplate }
}

function CategoryBadge({ label, tokens }: { label: string; tokens: Record<string, string> }) {
  return (
    <span style={{ padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.sm, fontSize: fontSize.xs, fontWeight: fontWeight.bold, background: `${tokens.accentPrimary}14`, color: tokens.accentPrimary, border: `1px solid ${tokens.accentPrimary}25`, fontFamily: tokens.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
  )
}

function RegionsLegend({ recipe, tokens }: { recipe: LayoutRecipe; tokens: Record<string, string> }) {
  return (
    <div style={{ padding: `${spacing.md}px ${spacing.xl}px`, borderTop: `1px solid ${tokens.borderSubtle}`, background: tokens.bgBase, transition: 'background 0.3s' }}>
      <div style={{ marginBottom: spacing.md }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textMuted, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Regions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
          {recipe.regions.map(r => (
            <span key={r.name} style={{ padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.sm, fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, fontWeight: fontWeight.semibold, background: tokens.bgSurface, color: tokens.textSecondary, border: `1px solid ${tokens.borderDefault}` }}>
              {r.name}{r.required && <span style={{ color: tokens.accentAI, marginLeft: 3 }}>*</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScoreFooter({ recipe, score, tokens }: { recipe: LayoutRecipe; score: number; tokens: Record<string, string> }) {
  return (
    <div style={{ padding: `${spacing.md}px ${spacing.xl}px`, borderTop: `1px solid ${tokens.borderSubtle}`, background: tokens.bgBase, transition: 'background 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, color: tokens.textMuted }}>
        <span>Score: <strong style={{ color: tokens.textPrimary }}>{score}/100</strong></span>
        <span style={{ color: tokens.borderDefault }}>|</span>
        <span>{recipe.regions.length} regions</span>
        <span style={{ color: tokens.borderDefault }}>|</span>
        <span>Gap: {recipe.gap}</span>
        {recipe.techNotes && <><span style={{ color: tokens.borderDefault }}>|</span><span style={{ color: tokens.textSecondary }}>{recipe.techNotes}</span></>}
      </div>
    </div>
  )
}

// ─── Viewport Switcher ─────────────────────────────────────────

function ViewportSwitcher({ viewport, onViewportChange, tokens }: { viewport: string; onViewportChange: (v: 'mobile' | 'tablet' | 'desktop') => void; tokens: Record<string, string> }) {
  const VIEWPORTS = [
    { key: 'mobile', label: 'Mobile', icon: Smartphone },
    { key: 'tablet', label: 'Tablet', icon: Tablet },
    { key: 'desktop', label: 'Desktop', icon: Monitor },
  ] as const

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm}px ${spacing.xl}px`, background: `${tokens.bgDeep}80`, borderBottom: `1px solid ${tokens.borderSubtle}` }}>
      {VIEWPORTS.map(v => {
        const Icon = v.icon
        const active = viewport === v.key
        return (
          <button key={v.key} onClick={() => onViewportChange(v.key)} aria-label={`Viewport: ${v.label}`} aria-pressed={active} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.md,
            fontSize: fontSize.sm, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyMono,
            background: active ? `${tokens.bgSurface}80` : 'transparent',
            color: active ? tokens.textPrimary : tokens.textMuted,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
          }}>
            <Icon style={{ width: 12, height: 12 }} />
            {v.label}
          </button>
        )
      })}
      <span style={{ marginLeft: 'auto', fontSize: fontSize.xs, fontFamily: tokens.fontFamilyMono, color: tokens.textDim }}>{viewportWidth(viewport)}</span>
    </div>
  )
}
