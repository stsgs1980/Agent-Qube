'use client'

import type { LayoutRecipe } from '@/lib/layout/types'
import { WireframePreview } from '@/components/layout/wireframe-preview'
import { GridPreview } from '@/components/layout/grid-preview'
import { categoryMeta } from '@/lib/layout/types'

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 4: Side-by-Side Compare — Two wireframes side by side
// Compare two layouts interactively with independent viewports
// ═══════════════════════════════════════════════════════════════

interface CompareProps {
  recipeA: LayoutRecipe
  recipeB: LayoutRecipe
  scoreA?: number
  scoreB?: number
}

export function WireframeCompare({ recipeA, recipeB, scoreA, scoreB }: CompareProps) {
  const catA = categoryMeta[recipeA.category]
  const catB = categoryMeta[recipeB.category]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Wireframe Preview — Side-by-Side Compare</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Two layouts with independent viewport switching. Useful for A/B comparison.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layout A */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">A</span>
            <span className="text-sm font-semibold">{recipeA.name}</span>
            {catA && <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${catA.bg} ${catA.color}`}>{catA.label}</span>}
          </div>
          <WireframePreview recipe={recipeA} score={scoreA} />
        </div>

        {/* Layout B */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">B</span>
            <span className="text-sm font-semibold">{recipeB.name}</span>
            {catB && <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${catB.bg} ${catB.color}`}>{catB.label}</span>}
          </div>
          <WireframePreview recipe={recipeB} score={scoreB} />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 5: Compact Card Grid — All layouts in a compact grid
// Uses GridPreview for thumbnails, click to see WireframePreview
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'

interface CompactGridProps {
  recipes: LayoutRecipe[]
  scores?: Record<string, number>
}

export function WireframeCompactGrid({ recipes, scores }: CompactGridProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const picked = selected ? recipes.find(r => r.structure === selected) : null

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Wireframe Preview — Compact Grid + Detail</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Click any card to open it in a full WireframePreview with viewport switching.
      </p>

      {picked ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to grid
          </button>
          <WireframePreview recipe={picked} score={scores?.[picked.structure]} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {recipes.map(r => {
            const catMeta = categoryMeta[r.category]
            return (
              <button key={r.structure} onClick={() => setSelected(r.structure)}
                className="text-left rounded-xl border border-border/50 bg-card p-3 hover:border-foreground/20 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold truncate">{r.name}</span>
                  {catMeta && <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${catMeta.bg} ${catMeta.color}`}>{catMeta.label}</span>}
                </div>
                <GridPreview recipe={r} compact />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
