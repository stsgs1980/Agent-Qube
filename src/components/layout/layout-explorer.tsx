'use client'

import type { LayoutRecipe } from '@/lib/layout/types'
import { GOALS, categoryMeta } from '@/lib/layout/types'
import { CodeDrawer } from './code-drawer'
import { ExplorerSidebar } from './explorer-sidebar'
import { useLayoutTheme } from '@/lib/layout/theme'
import { fontSize, fontWeight } from '@/lib/layout/tokens'
import { useExplorerFilters } from './use-explorer-filters'
import type { ViewTab, ViewMode } from './use-explorer-filters'
import { useExplorerSelection } from './use-explorer-selection'
import { ExplorerGridView } from './explorer-grid-view'
import { ExplorerListView } from './explorer-list-view'
import { Eye, Code2, FileCode, Play, Grid3X3, List } from 'lucide-react'

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

  const viewProps = { filtered, best, selectedRecipe, setSelectedRecipe, tokens }

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

          {viewMode === 'grid'
            ? <ExplorerGridView {...viewProps} />
            : <ExplorerListView {...viewProps} />
          }
        </div>

        {selected && <CodeDrawer recipe={selected.recipe} />}
      </div>
    </div>
  )
}
