'use client'

import { useMemo } from 'react'
import type { LayoutRecipe, LayoutAdviceInput, LayoutRecommendation } from '@/lib/layout/types'
import { scoreLayout, scoreLayoutMulti } from '@/lib/layout/scoring'

// ─── Ranking Engine ────────────────────────────────────────────

export function useRankedRecipes(
  recipes: LayoutRecipe[],
  input: LayoutAdviceInput,
  goalWeights: Record<string, number>,
  isMultiGoal: boolean,
): LayoutRecommendation[] {
  return useMemo(() => {
    if (isMultiGoal) {
      return recipes.map(r => scoreLayoutMulti(r, input, goalWeights)).sort((a, b) => b.score - a.score) as LayoutRecommendation[]
    }
    return recipes.map(r => scoreLayout(r, input)).sort((a, b) => b.score - a.score)
  }, [recipes, input, isMultiGoal, goalWeights])
}
