'use client'

import type { LayoutRecommendation } from '@/lib/layout/types'
import type { ThemeTokens } from '@/lib/layout/theme-types'
import { categoryMeta } from '@/lib/layout/types'
import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Shared Props ──────────────────────────────────────────────

export interface ExplorerViewProps {
  filtered: LayoutRecommendation[]
  best: LayoutRecommendation | null
  selectedRecipe: string | null
  setSelectedRecipe: (val: string | null) => void
  tokens: ThemeTokens
}

// ─── Category Color ────────────────────────────────────────────

export function getCategoryColor(category: string): string {
  return category === 'bento' ? '#F59E0B'
    : category === 'artistic' ? '#8B5CF6'
    : category === 'mathematical' ? '#14B8A6'
    : category === 'application' ? '#06B6D4'
    : category === 'advanced' ? '#F43F5E'
    : '#10B981'
}

// ─── Grid View ─────────────────────────────────────────────────

export function ExplorerGridView({ filtered, best, selectedRecipe, setSelectedRecipe, tokens }: ExplorerViewProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32 }}>
      {filtered.slice(0, selectedRecipe ? 12 : 20).map(r => {
        const isBest = r.structure === best?.structure
        const isSelected = r.structure === selectedRecipe
        return (
          <div key={r.structure} onClick={() => setSelectedRecipe(isSelected ? null : r.structure)}
            role="button" tabIndex={0} aria-label={`${r.recipe.name}, score ${r.score}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedRecipe(isSelected ? null : r.structure) } }}
            style={{ border: `1px solid ${isSelected ? tokens.cardSelected : isBest ? `${tokens.accentPrimary}40` : tokens.cardBorder}`, borderRadius: tokens.cornerRadius, overflow: 'hidden', background: tokens.bgBase, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isSelected ? `0 4px 24px ${tokens.accentPrimary}20` : tokens.cardShadow, minHeight: 44 /* WCAG 2.5.5 */ }}>
            <div style={{ height: 220, background: tokens.bgDeep, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${tokens.borderSubtle}` }}>
              <div style={{ width: '82%', height: '82%' }}><GridPreview recipe={r.recipe} compact /></div>
              <div style={{ position: 'absolute', top: 12, right: 12, fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.5px', background: `${getCategoryColor(r.recipe.category)}18`, color: getCategoryColor(r.recipe.category) }}>{categoryMeta[r.recipe.category]?.label ?? r.recipe.category}</div>
              {isBest && <div style={{ position: 'absolute', top: 12, left: 12, fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody, padding: '4px 10px', borderRadius: 6, background: `${tokens.accentPrimary}20`, color: tokens.accentPrimary, display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: tokens.accentPrimary }} />Best Match</div>}
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyBody, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.recipe.name}</div>
                <div style={{ fontSize: fontSize.base, fontFamily: tokens.fontFamilyMono, color: tokens.textMuted, marginTop: 3 }}>{r.recipe.regions.length} regions · gap: {r.recipe.gap}</div>
              </div>
              <ScoreGauge score={r.score} size={38} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
