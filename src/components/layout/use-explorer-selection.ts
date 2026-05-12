'use client'

import { useState, useMemo } from 'react'
import type { LayoutRecipe, LayoutAdviceInput, LayoutRecommendation, ParsedPrompt } from '@/lib/layout/types'
import { scoreLayout, scoreLayoutMulti } from '@/lib/layout/scoring'

export function useExplorerSelection(recipes: LayoutRecipe[], selectedCategory: string | null) {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null)

  const input: LayoutAdviceInput = parsed
    ? { goal: parsed.goal, contentType: parsed.contentType, itemCount: parsed.itemCount, needsSidebar: parsed.needsSidebar, needsHeader: parsed.needsHeader, needsFooter: parsed.needsFooter }
    : { goal: 'landing', contentType: 'cards', itemCount: 6, needsHeader: true }

  const goalWeightsExp = parsed?.goalWeights ?? { [input.goal]: 1 }
  const isMultiGoalExp = Object.keys(goalWeightsExp).filter(g => goalWeightsExp[g] > 0).length > 1

  const ranked = useMemo(() => {
    if (isMultiGoalExp && parsed) return recipes.map(r => scoreLayoutMulti(r, input, goalWeightsExp)).sort((a, b) => b.score - a.score) as LayoutRecommendation[]
    return recipes.map(r => scoreLayout(r, input)).sort((a, b) => b.score - a.score)
  }, [recipes, input, isMultiGoalExp, parsed, goalWeightsExp])

  const best = ranked[0] ?? null

  const filtered = useMemo(() => selectedCategory ? ranked.filter(r => r.recipe.category === selectedCategory) : ranked, [ranked, selectedCategory])

  const selected = selectedRecipe ? ranked.find(r => r.structure === selectedRecipe) ?? null : null

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {}
    for (const r of ranked) m[r.recipe.category] = (m[r.recipe.category] ?? 0) + 1
    return m
  }, [ranked])

  return {
    selectedRecipe, setSelectedRecipe,
    parsed, setParsed,
    ranked, filtered, selected, best,
    catCounts, input,
  }
}
