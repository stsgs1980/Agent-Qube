'use client'

import type { LayoutRecipe } from '@/lib/layout/types'
import { WireframePreview } from '@/components/layout/wireframe-preview'
import { categoryMeta } from '@/lib/layout/types'

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 2: Category Grid — Wireframes grouped by category
// Shows all layouts of a selected category as wireframe cards
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { CATEGORIES } from '@/lib/layout/types'

interface CategoryGridProps {
  recipes: LayoutRecipe[]
  scores?: Record<string, number>
}

export function WireframeCategoryGrid({ recipes, scores }: CategoryGridProps) {
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const filtered = recipes.filter(r => r.category === category)
  const catMeta = categoryMeta[category]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Wireframe Preview — Category Grid</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Browse layouts by category. Each card is a full WireframePreview with viewport switching.
      </p>

      {/* Category Tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              category === cat
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}>
            {categoryMeta[cat]?.label ?? cat}
          </button>
        ))}
      </div>

      {/* Category Header */}
      {catMeta && (
        <div className="mb-4 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${catMeta.bg} ${catMeta.color}`}>
            {catMeta.label}
          </span>
          <span className="text-xs text-muted-foreground">{filtered.length} layouts</span>
        </div>
      )}

      {/* Wireframe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(r => (
          <WireframePreview key={r.structure} recipe={r} score={scores?.[r.structure]} />
        ))}
      </div>
    </div>
  )
}
