'use client'

import { categoryMeta } from '@/lib/layout/types'
import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { fontSize, fontWeight } from '@/lib/layout/tokens'
import type { ExplorerViewProps } from './explorer-grid-view'
import { getCategoryColor } from './explorer-grid-view'

// ─── List View ─────────────────────────────────────────────────

export function ExplorerListView({ filtered, best, selectedRecipe, setSelectedRecipe, tokens }: ExplorerViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 32 }}>
      {filtered.map(r => {
        const isBest = r.structure === best?.structure
        const isSelected = r.structure === selectedRecipe
        return (
          <div key={r.structure} onClick={() => setSelectedRecipe(isSelected ? null : r.structure)}
            role="button" tabIndex={0} aria-label={`${r.recipe.name}, score ${r.score}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedRecipe(isSelected ? null : r.structure) } }}
            style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 20px', border: `1px solid ${isSelected ? tokens.cardSelected : isBest ? `${tokens.accentPrimary}30` : 'transparent'}`, borderRadius: tokens.cornerRadius, background: isSelected ? `${tokens.accentPrimary}08` : isBest ? `${tokens.accentPrimary}04` : 'transparent', cursor: 'pointer', transition: 'all 0.15s', minHeight: 44 /* WCAG 2.5.5 */ }}>
            <div style={{ width: 72, height: 52, borderRadius: 6, background: tokens.bgDeep, border: `1px solid ${tokens.borderSubtle}`, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '84%', height: '84%' }}><GridPreview recipe={r.recipe} compact /></div>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyBody, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {r.recipe.name}
                  {isBest && <span style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, padding: '2px 8px', borderRadius: 4, background: `${tokens.accentPrimary}20`, color: tokens.accentPrimary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best</span>}
                </div>
                <div style={{ fontSize: fontSize.base, fontFamily: tokens.fontFamilyMono, color: tokens.textMuted, marginTop: 2 }}>{r.recipe.regions.length} regions · gap: {r.recipe.gap}</div>
              </div>
              <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.5px', background: `${getCategoryColor(r.recipe.category)}15`, color: getCategoryColor(r.recipe.category), flexShrink: 0 }}>{categoryMeta[r.recipe.category]?.label ?? r.recipe.category}</div>
              <ScoreGauge score={r.score} size={32} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
