// ─── Shared sub-components for layout-explorer variants ──

import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'
import type { ThemeTokens, ViewTab, ViewMode } from '@/lib/layout/use-explorer-filters'
import type { LayoutRecipe } from '@/lib/layout/types'
import { categoryMeta, GOALS } from '@/lib/layout/types'
import { Eye, Code2, FileCode, Play, Grid3X3, List } from 'lucide-react'

const VIEW_TABS: { key: ViewTab; label: string; Icon: typeof Eye }[] = [
  { key: 'preview', label: 'Preview', Icon: Eye },
  { key: 'code', label: 'Code', Icon: Code2 },
  { key: 'docs', label: 'Docs', Icon: FileCode },
  { key: 'playground', label: 'Playground', Icon: Play },
]

const VIEW_MODES: { key: ViewMode; label: string; Icon: typeof Grid3X3 }[] = [
  { key: 'grid', label: 'Grid', Icon: Grid3X3 },
  { key: 'list', label: 'List', Icon: List },
]

function getCategoryColor(category: string): string {
  return category === 'bento' ? '#F59E0B' : category === 'artistic' ? '#8B5CF6'
    : category === 'mathematical' ? '#14B8A6' : category === 'application' ? '#06B6D4'
    : category === 'advanced' ? '#F43F5E' : '#10B981'
}

export { getCategoryColor }

// ─── Topbar ────────────────────────────────────────────────

export function ExplorerTopbar({ tokens, viewTab, setViewTab }: {
  tokens: ThemeTokens; viewTab: ViewTab; setViewTab: (v: ViewTab) => void
}) {
  return (
    <div style={{
      height: 56, borderBottom: `1px solid ${tokens.borderSubtle}`,
      display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20,
      background: tokens.bgBase, transition: 'background 0.3s',
    }}>
      <div style={{ fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, color: tokens.textMuted }}>
        @stsgs/ui / <strong style={{ color: tokens.textPrimary }}>layouts/</strong>
      </div>
      <div style={{ display: 'flex', gap: 0, marginLeft: 'auto' }}>
        {VIEW_TABS.map((tab, i, arr) => (
          <button key={tab.key} onClick={() => setViewTab(tab.key)} style={{
            fontSize: fontSize.md, fontWeight: fontWeight.medium, fontFamily: tokens.fontFamilyBody,
            padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s',
            border: `1px solid ${viewTab === tab.key ? tokens.accentPrimary : tokens.borderDefault}`,
            background: viewTab === tab.key ? tokens.accentPrimary : tokens.bgBase,
            color: viewTab === tab.key ? tokens.textOnAccent : tokens.textMuted,
            borderRadius: i === 0 ? '8px 0 0 8px' : i === arr.length - 1 ? '0 8px 8px 0' : 0,
          }}>
            <tab.Icon style={{ width: 14, height: 14 }} />{tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Content Header (title + view mode toggle) ────────────

export function ContentHeader({ tokens, selectedCategory, filtered, ranked, viewMode, setViewMode }: {
  tokens: ThemeTokens; selectedCategory: string | null; filtered: LayoutRecipe[]
  ranked: any[]; viewMode: ViewMode; setViewMode: (v: ViewMode) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <div style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyDisplay }}>
          {selectedCategory ? (categoryMeta[selectedCategory]?.label ?? selectedCategory) : 'Layouts'} — All Recipes
        </div>
        <div style={{ fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, color: tokens.textSecondary, marginTop: 6 }}>
          {filtered.length} layouts ranked. {ranked.filter(r => r.verdict === 'recommended').length} recommended
        </div>
      </div>
      <div style={{ display: 'flex', gap: 0 }}>
        {VIEW_MODES.map((vm, i, arr) => (
          <button key={vm.key} onClick={() => setViewMode(vm.key)} style={{
            fontSize: fontSize.md, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyBody,
            padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s',
            border: `1px solid ${viewMode === vm.key ? tokens.accentPrimary : tokens.borderDefault}`,
            background: viewMode === vm.key ? tokens.accentPrimary : tokens.bgBase,
            color: viewMode === vm.key ? tokens.textOnAccent : tokens.textSecondary,
            borderRadius: i === 0 ? '8px 0 0 8px' : '0 8px 8px 0',
          }}>
            <vm.Icon style={{ width: 16, height: 16 }} />{vm.label}
          </button>
        ))}
      </div>
    </div>
  )
}