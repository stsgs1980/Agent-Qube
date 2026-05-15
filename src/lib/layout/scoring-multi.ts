/**
 * Multi-goal scoring engine.
 * Extracted from scoring.ts per anti-monolith Rule 1.
 */

import type {
  LayoutRecipe, LayoutAdviceInput, LayoutRecommendation,
} from './types'
import { scoreLayout, WEIGHTS } from './scoring'

export type MultiGoalRecommendation = LayoutRecommendation & { goalBreakdown: Record<string, number> }

export function scoreLayoutMulti(
  recipe: LayoutRecipe,
  input: LayoutAdviceInput,
  goalWeights: Record<string, number>,
): MultiGoalRecommendation {
  const goalBreakdown: Record<string, number> = {}
  let totalWeight = 0
  let weightedScore = 0
  const allReasons: string[] = []
  const goalCount = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length

  for (const [goal, weight] of Object.entries(goalWeights)) {
    if (weight <= 0) continue
    const singleInput = { ...input, goal }
    const single = scoreLayout(recipe, singleInput)

    // Multi-goal conflict mitigation
    let adjustedScore = single.score
    if (recipe.conflicts.includes(goal) && goalCount > 1) {
      const nonConflictingGoals = Object.keys(goalWeights).filter(
        g => g !== goal && goalWeights[g] > 0 && !recipe.conflicts.includes(g),
      )
      const restoreRatio = nonConflictingGoals.length / (goalCount - 1)
      const penaltyRestore = Math.round(Math.abs(WEIGHTS.goalConflict) * restoreRatio * 0.7)
      adjustedScore = Math.min(100, single.score + penaltyRestore)
    }

    goalBreakdown[goal] = adjustedScore
    weightedScore += adjustedScore * weight
    totalWeight += weight
    if (single.reason && single.reason !== 'Neutral match') allReasons.push(`[${goal}] ${single.reason}`)
  }

  let finalScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 50

  // Structural adequacy penalty in multi-goal mode
  const regionNames = recipe.regions.map(r => r.name)
  const structMissing: string[] = []
  if (input.needsSidebar && !regionNames.includes('sidebar')) structMissing.push('sidebar')
  if (input.needsHeader && !regionNames.includes('header')) structMissing.push('header')
  if (input.needsFooter && !regionNames.includes('footer')) structMissing.push('footer')
  if (structMissing.length > 0 && goalCount > 1) {
    finalScore = Math.max(0, finalScore - structMissing.length * 8)
  }

  // Synergy bonus
  const highScoringGoals = Object.entries(goalBreakdown).filter(([, s]) => s >= 65).length
  if (highScoringGoals >= 2) {
    finalScore = Math.min(100, finalScore + Math.min(8, highScoringGoals * 3))
  }

  // Versatility bonus
  const allGoalsModerate = Object.values(goalBreakdown).every(s => s >= 50)
  if (allGoalsModerate && goalCount >= 2) {
    finalScore = Math.min(100, finalScore + 4)
  }

  // Critical miss penalty
  const hasCriticalMiss = Object.entries(goalBreakdown).some(
    ([g, s]) => (goalWeights[g] ?? 0) > 0.25 && s < 25,
  )
  if (hasCriticalMiss) finalScore = Math.max(0, finalScore - 12)

  // Conflict verdict: only error if conflicting goal has dominant weight
  const dominantConflict = Object.entries(goalWeights).some(
    ([g, w]) => w > 0.5 && recipe.conflicts.includes(g),
  )

  let verdict: LayoutRecommendation['verdict'] = 'warning'
  if (dominantConflict) verdict = 'error'
  else if (finalScore >= 70) verdict = 'recommended'
  else if (finalScore >= 40) verdict = 'warning'

  return {
    structure: recipe.structure, recipe, score: finalScore, verdict,
    reason: allReasons.length > 0 ? allReasons.join('. ') : 'Neutral match',
    goalBreakdown,
  }
}
