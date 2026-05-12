'use client'

import type { LayoutRecipe } from '@/lib/layout/types'
import { GOALS, categoryMeta } from '@/lib/layout/types'
import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { CodeDrawer } from './code-drawer'
import { ExplorerSidebar } from './explorer-sidebar'
import { useLayoutTheme } from '@/lib/layout/theme'
import { fontSize, fontWeight } from '@/lib/layout/tokens'
import { useExplorerFilters } from './use-explorer-filters'
import type { ViewTab, ViewMode } from './use-explorer-filters'
import { useExplorerSelection } from './use-explorer-selection'
import { Grid3X3, List, Eye, Code2, FileCode, Play } from 'lucide-react'

// ─── Layout Explorer ─────────────────────────────────────────

export function VariantLayoutExplorer({ recipes }: { recipes: LayoutRecipe[] }) {
  const { tokens } = useLayoutTheme()
  const {
    selectedCategory, setSelectedCategory,
    activeLayer, setActiveLayer,
    viewTab, setViewTab,
    viewMode, setViewMode,
  } = useExplorerFilters()
  const {
    selectedRecipe, setSelectedRecipe,
    parsed, setParsed,
    ranked, filtered, selected, best,
    catCounts, input,
  } = useExplorerSelection(recipes, selectedCategory)

  return (
    <div style={{ flex: 1, display: 'flex', background: tokens.bgDeep, color: tokens.textPrimary, overflow: 'hidden', transition: 'background 0.3s, color 0.3s' }}>
      <ExplorerSidebar
        recipeCount={recipes.length}
        selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}
        activeLayer={activeLayer} onLayerChange={setActiveLayer}
        input={input} onGoalSelect={setParsed}
        catCounts={catCounts}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          height: 56, borderBottom: `1px solid ${tokens.borderSubtle}`,
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20,
          background: tokens.bgBase, transition: 'background 0.3s',
        }}>
          <div style={{ fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, color: tokens.textMuted }}>
            @stsgs/ui / <strong style={{ color: tokens.textPrimary }}>layouts/</strong>
          </div>
          <div role="tablist" aria-label="Вид отображения" style={{ display: 'flex', gap: 0, marginLeft: 'auto' }}>
            {([
              { key: 'preview' as ViewTab, label: 'Preview', Icon: Eye },
              { key: 'code' as ViewTab, label: 'Code', Icon: Code2 },
              { key: 'docs' as ViewTab, label: 'Docs', Icon: FileCode },
              { key: 'playground' as ViewTab, label: 'Playground', Icon: Play },
            ]).map((tab, i, arr) => (
              <button key={tab.key} onClick={() => setViewTab(tab.key)}
                role="tab" aria-selected={viewTab === tab.key} aria-label={tab.label}
                style={{
                fontSize: fontSize.md, fontWeight: fontWeight.medium, fontFamily: tokens.fontFamilyBody, padding: '8px 18px',
                border: `1px solid ${viewTab === tab.key ? tokens.accentPrimary : tokens.borderDefault}`,
                background: viewTab === tab.key ? tokens.accentPrimary : tokens.bgBase,
                color: viewTab === tab.key ? tokens.textOnAccent : tokens.textMuted,
                cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
                borderRadius: i === 0 ? '8px 0 0 8px' : i === arr.length - 1 ? '0 8px 8px 0' : 0,
              }}>
                <tab.Icon style={{ width: 14, height: 14 }} />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyDisplay }}>{selectedCategory ? (categoryMeta[selectedCategory]?.label ?? selectedCategory) : 'Layouts'} — All Recipes</div>
              <div style={{ fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, color: tokens.textSecondary, marginTop: 6 }}>{filtered.length} layouts ranked. {ranked.filter(r => r.verdict === 'recommended').length} recommended for &quot;{GOALS.find(g => g.value === input.goal)?.label ?? input.goal}&quot;</div>
            </div>
          <div role="tablist" aria-label="Режим отображения" style={{ display: 'flex', gap: 0 }}>
            {([
              { key: 'grid' as ViewMode, label: 'Grid', Icon: Grid3X3 },
              { key: 'list' as ViewMode, label: 'List', Icon: List },
            ]).map((vm, i, arr) => (
              <button key={vm.key} onClick={() => setViewMode(vm.key)}
                role="tab" aria-selected={viewMode === vm.key} aria-label={vm.label}
                style={{
                  fontSize: fontSize.md, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyBody, padding: '10px 20px',
                  border: `1px solid ${viewMode === vm.key ? tokens.accentPrimary : tokens.borderDefault}`,
                  background: viewMode === vm.key ? tokens.accentPrimary : tokens.bgBase,
                  color: viewMode === vm.key ? tokens.textOnAccent : tokens.textSecondary,
                  cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
                  borderRadius: i === 0 ? '8px 0 0 8px' : '0 8px 8px 0',
                }}>
                  <vm.Icon style={{ width: 16, height: 16 }} />{vm.label}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32 }}>
              {filtered.slice(0, selected ? 12 : 20).map(r => {
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
          ) : (
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
          )}
        </div>

        {selected && <CodeDrawer recipe={selected.recipe} />}
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  return category === 'bento' ? '#F59E0B'
    : category === 'artistic' ? '#8B5CF6'
    : category === 'mathematical' ? '#14B8A6'
    : category === 'application' ? '#06B6D4'
    : category === 'advanced' ? '#F43F5E'
    : '#10B981'
}
