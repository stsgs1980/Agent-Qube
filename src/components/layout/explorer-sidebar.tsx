'use client'

import { Search } from 'lucide-react'
import type { LayoutAdviceInput, ParsedPrompt } from '@/lib/layout/types'
import { GOALS, CATEGORIES, categoryMeta } from '@/lib/layout/types'
import { useLayoutTheme } from '@/lib/layout/theme'
import { fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Layer Groups ────────────────────────────────────────────

const LAYER_GROUPS = [
  { title: 'Layers', items: [
    { icon: '◆', label: 'ui/', count: 50, key: 'ui' },
    { icon: '◇', label: 'sections/', count: 100, key: 'sections' },
    { icon: '◈', label: 'features/', count: 50, key: 'features' },
    { icon: '⟳', label: 'hooks/', count: 8, key: 'hooks' },
    { icon: '▢', label: 'providers/', count: 4, key: 'providers' },
  ]},
  { title: 'Categories', items: CATEGORIES.map(cat => ({
    icon: categoryMeta[cat]?.label === 'Classic' ? '▤'
      : categoryMeta[cat]?.label === 'Bento' ? '⬡'
      : categoryMeta[cat]?.label === 'Artistic' ? '◈'
      : categoryMeta[cat]?.label === 'Math' ? '△'
      : categoryMeta[cat]?.label === 'App' ? '◉'
      : '⬚',
    label: categoryMeta[cat]?.label ?? cat,
    count: 0,
    key: cat,
  }))},
]

// ─── Explorer Sidebar ────────────────────────────────────────

interface ExplorerSidebarProps {
  recipeCount: number
  selectedCategory: string | null
  onCategoryChange: (cat: string | null) => void
  activeLayer: string
  onLayerChange: (layer: string) => void
  input: LayoutAdviceInput
  onGoalSelect: (parsed: ParsedPrompt) => void
  catCounts: Record<string, number>
}

export function ExplorerSidebar({
  recipeCount, selectedCategory, onCategoryChange,
  activeLayer, onLayerChange, input, onGoalSelect, catCounts,
}: ExplorerSidebarProps) {
  const { tokens } = useLayoutTheme()

  return (
    <nav aria-label="Навигация по компонентам" style={{
      width: 300, flexShrink: 0,
      background: tokens.sidebarBg, color: tokens.sidebarText,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${tokens.sidebarBorder}`,
      transition: 'background 0.3s',
    }}>
      {/* Header */}
      <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${tokens.sidebarBorder}` }}>
        <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.black, color: tokens.textPrimary, fontFamily: tokens.fontFamilyDisplay, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: tokens.accentPrimary }} />
          @stsgs/ui
        </div>
        <div style={{ fontSize: fontSize.base, color: tokens.sidebarMuted, marginTop: 6, fontFamily: tokens.fontFamilyBody }}>v1.0.0 · {recipeCount} layouts</div>
      </div>

      {/* Search */}
      <div role="search" style={{ margin: '16px 20px', padding: '10px 16px', background: `${tokens.sidebarBorder}`, border: `1px solid ${tokens.sidebarBorder}`, borderRadius: tokens.cornerRadius, fontSize: fontSize.md, color: tokens.sidebarMuted, fontFamily: tokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Search style={{ width: 16, height: 16 }} aria-hidden="true" />
        <span>Search...</span>
        <kbd style={{ fontSize: fontSize.sm, background: `${tokens.sidebarBorder}`, padding: '2px 8px', borderRadius: 3, marginLeft: 'auto', fontFamily: tokens.fontFamilyMono }}>/</kbd>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {LAYER_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1.2, color: tokens.sidebarMuted, padding: '16px 28px 8px', fontFamily: tokens.fontFamilyBody }}>{group.title}</div>
            {group.items.map(item => {
              const isCat = CATEGORIES.includes(item.key as typeof CATEGORIES[number])
              const isActive = isCat ? selectedCategory === item.key : activeLayer === item.key
              const count = isCat ? (catCounts[item.key] ?? 0) : item.count
              return (
                <button key={item.key}
                  onClick={() => isCat ? onCategoryChange(selectedCategory === item.key ? null : item.key) : onLayerChange(item.key)}
                  aria-pressed={isActive}
                  aria-label={item.label}
                  style={{
                    fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, padding: '9px 28px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: isActive ? `${tokens.accentPrimary}18` : 'transparent',
                    borderRight: isActive ? `2px solid ${tokens.accentPrimary}` : '2px solid transparent',
                    borderLeft: 'none', borderTop: 'none', borderBottom: 'none',
                    color: isActive ? tokens.accentPrimary : tokens.sidebarText,
                    width: '100%', textAlign: 'left', minHeight: 44 /* WCAG 2.5.5 */,
                  }}>
                  <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.5, width: 24, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                  {count > 0 && (
                    <span style={{ fontSize: fontSize.sm, marginLeft: 'auto', background: `${tokens.sidebarBorder}`, padding: '2px 8px', borderRadius: 10, color: tokens.sidebarMuted, fontFamily: tokens.fontFamilyMono }}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}

        {/* Goal Filters */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1.2, color: tokens.sidebarMuted, padding: '16px 28px 8px', fontFamily: tokens.fontFamilyBody }}>Best For</div>
          {GOALS.slice(0, 8).map(g => {
            const isActive = input.goal === g.value
            return (
              <button key={g.value}
                onClick={() => onGoalSelect({ goal: g.value, contentType: 'cards', itemCount: 6, needsSidebar: false, needsHeader: true, needsFooter: false, detected: [g.label], goalWeights: { [g.value]: 1 } })}
                aria-pressed={isActive}
                aria-label={g.label}
                style={{
                  fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, padding: '9px 28px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', transition: 'background 0.15s',
                  background: isActive ? `${tokens.accentPrimary}18` : 'transparent',
                  border: 'none', color: isActive ? tokens.accentPrimary : tokens.sidebarText,
                  width: '100%', textAlign: 'left', minHeight: 44 /* WCAG 2.5.5 */,
                }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: g.color, opacity: isActive ? 1 : 0.5 }} />
                {g.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
