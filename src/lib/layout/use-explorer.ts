'use client'

import { useState, useMemo } from 'react'
import type { LayoutAdviceInput, LayoutRecommendation, ParsedPrompt } from '@/lib/layout/types'
import { scoreLayout } from '@/lib/layout/scoring'
import { scoreLayoutMulti } from '@/lib/layout/scoring-multi'
import type { LayoutRecipe } from '@/lib/layout/types'

type ViewMode = 'grid' | 'list'

interface ExplorerFilters {
  selectedCategory: string | null
  activeLayer: string
  viewMode: ViewMode
  setSelectedCategory: (cat: string | null) => void
  setActiveLayer: (layer: string) => void
  setViewMode: (mode: ViewMode) => void
}

export function useExplorerFilters(): ExplorerFilters {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeLayer, setActiveLayer] = useState<string>('ui')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  return { selectedCategory, activeLayer, viewMode, setSelectedCategory, setActiveLayer, setViewMode }
}

interface ExplorerSelection {
  parsed: ParsedPrompt | null
  selectedRecipe: string | null
  setParsed: (p: ParsedPrompt | null) => void
  setSelectedRecipe: (r: string | null) => void
}

export function useExplorerSelection(): ExplorerSelection {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null)

  return { parsed, selectedRecipe, setParsed, setSelectedRecipe }
}

interface RankedResult {
  ranked: LayoutRecommendation[]
  best: LayoutRecommendation | null
  filtered: LayoutRecommendation[]
  catCounts: Record<string, number>
  selected: LayoutRecommendation | null
  input: LayoutAdviceInput
}

export function useExplorerRanking(
  recipes: LayoutRecipe[],
  parsed: ParsedPrompt | null,
  selectedCategory: string | null,
  selectedRecipe: string | null,
): RankedResult {
  const input: LayoutAdviceInput = parsed
    ? { goal: parsed.goal, contentType: parsed.contentType, itemCount: parsed.itemCount, needsSidebar: parsed.needsSidebar, needsHeader: parsed.needsHeader, needsFooter: parsed.needsFooter }
    : { goal: 'landing', contentType: 'cards', itemCount: 6, needsHeader: true }

  const goalWeights = parsed?.goalWeights ?? { [input.goal]: 1 }
  const isMultiGoal = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length > 1

  const ranked = useMemo(() => {
    if (isMultiGoal && parsed) return recipes.map(r => scoreLayoutMulti(r, input, goalWeights)).sort((a, b) => b.score - a.score) as LayoutRecommendation[]
    return recipes.map(r => scoreLayout(r, input)).sort((a, b) => b.score - a.score)
  }, [recipes, input, isMultiGoal, parsed, goalWeights])

  const best = ranked[0] ?? null
  const filtered = useMemo(() => selectedCategory ? ranked.filter(r => r.recipe.category === selectedCategory) : ranked, [ranked, selectedCategory])
  const selected = selectedRecipe ? ranked.find(r => r.structure === selectedRecipe) ?? null : null
  const catCounts = useMemo(() => {
    const m: Record<string, number> = {}
    for (const r of ranked) m[r.recipe.category] = (m[r.recipe.category] ?? 0) + 1
    return m
  }, [ranked])

  return { ranked, best, filtered, catCounts, selected, input }
}
