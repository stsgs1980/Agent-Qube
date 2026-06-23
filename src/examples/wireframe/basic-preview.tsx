'use client'

import type { LayoutRecipe } from '@/lib/layout/types'
import { WireframePreview } from '@/components/layout/wireframe-preview'

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 1: Basic Single Wireframe Preview
// Shows one layout with viewport switching and expand/collapse
// ═══════════════════════════════════════════════════════════════

interface BasicPreviewProps {
  recipe: LayoutRecipe
  score?: number
}

export function WireframeBasicPreview({ recipe, score }: BasicPreviewProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Wireframe Preview — Basic</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Single layout wireframe with viewport switching (Mobile / Tablet / Desktop)
        and expand/collapse for details.
      </p>
      <WireframePreview recipe={recipe} score={score} />
    </div>
  )
}
