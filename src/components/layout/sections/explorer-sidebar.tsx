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

function NavItem({ item, tokens, isActive, count, onClick }: { item: any; tokens: any; isActive: boolean; count: number; onClick: () => void }) {
  return (
    <div key={item.key} onClick={onClick}
      style={{
        fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, padding: '9px 28px',
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', transition: 'background 0.15s',
        background: isActive ? `${tokens.accentPrimary}18` : 'transparent',
        borderRight: isActive ? `2px solid ${tokens.accentPrimary}` : '2px solid transparent',
        color: isActive ? tokens.accentPrimary : tokens.sidebarText,
      }}>
      <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.5, width: 24, textAlign: 'center' }}>{item.icon}</span>
      {item.label}
      {count > 0 && (
        <span style={{ fontSize: fontSize.sm, marginLeft: 'auto', background: `${tokens.sidebarBorder}`, padding: '2px 8px', borderRadius: 10, color: tokens.sidebarMuted, fontFamily: tokens.fontFamilyMono }}>{count}</span>
      )}
    </div>
  )
}

function GoalFilter({ g, isActive, tokens, onSelect }: { g: any; isActive: boolean; tokens: any; onSelect: () => void }) {
  return (
    <div key={g.value} onClick={onSelect}
      style={{
        fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, padding: '9px 28px',
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', transition: 'background 0.15s',
        background: isActive ? `${tokens.accentPrimary}18` : 'transparent',
        color: isActive ? tokens.accentPrimary : tokens.sidebarText,
      }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: g.color, opacity: isActive ? 1 : 0.5 }} />
      {g.label}
    </div>
  )
}

function SidebarHeader({ tokens, recipeCount }: { tokens: any; recipeCount: number }) {
  return (
    <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${tokens.sidebarBorder}` }}>
      <div style={{ fontSize: fontSize.xl, fontWeight: fontWeight.black, color: tokens.textPrimary, fontFamily: tokens.fontFamilyDisplay, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: tokens.accentPrimary }} />
        @stsgs/ui
      </div>
      <div style={{ fontSize: fontSize.base, color: tokens.sidebarMuted, marginTop: 6, fontFamily: tokens.fontFamilyBody }}>v1.0.0 · {recipeCount} layouts</div>
    </div>
  )
}

export function ExplorerSidebar({
  recipeCount, selectedCategory, onCategoryChange,
  activeLayer, onLayerChange, input, onGoalSelect, catCounts,
}: ExplorerSidebarProps) {
  const { tokens } = useLayoutTheme()

  return (
    <div style={{
      width: 300, flexShrink: 0,
      background: tokens.sidebarBg, color: tokens.sidebarText,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${tokens.sidebarBorder}`,
      transition: 'background 0.3s',
    }}>
      <SidebarHeader tokens={tokens} recipeCount={recipeCount} />

      <div style={{ margin: '16px 20px', padding: '10px 16px', background: `${tokens.sidebarBorder}`, border: `1px solid ${tokens.sidebarBorder}`, borderRadius: tokens.cornerRadius, fontSize: fontSize.md, color: tokens.sidebarMuted, fontFamily: tokens.fontFamilyBody, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Search style={{ width: 16, height: 16 }} />
        <span>Search...</span>
        <kbd style={{ fontSize: fontSize.sm, background: `${tokens.sidebarBorder}`, padding: '2px 8px', borderRadius: 3, marginLeft: 'auto', fontFamily: tokens.fontFamilyMono }}>/</kbd>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {LAYER_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1.2, color: tokens.sidebarMuted, padding: '16px 28px 8px', fontFamily: tokens.fontFamilyBody }}>{group.title}</div>
            {group.items.map(item => {
              const isCat = CATEGORIES.includes(item.key as typeof CATEGORIES[number])
              const isActive = isCat ? selectedCategory === item.key : activeLayer === item.key
              const count = isCat ? (catCounts[item.key] ?? 0) : item.count
              return (
                <NavItem key={item.key} item={item} tokens={tokens} isActive={isActive} count={count}
                  onClick={() => isCat ? onCategoryChange(selectedCategory === item.key ? null : item.key) : onLayerChange(item.key)} />
              )
            })}
          </div>
        ))}

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 1.2, color: tokens.sidebarMuted, padding: '16px 28px 8px', fontFamily: tokens.fontFamilyBody }}>Best For</div>
          {GOALS.slice(0, 8).map(g => (
            <GoalFilter key={g.value} g={g} isActive={input.goal === g.value} tokens={tokens}
              onSelect={() => onGoalSelect({ goal: g.value, contentType: 'cards', itemCount: 6, needsSidebar: false, needsHeader: true, needsFooter: false, detected: [g.label], goalWeights: { [g.value]: 1 } })} />
          ))}
        </div>
      </div>
    </div>
  )
}