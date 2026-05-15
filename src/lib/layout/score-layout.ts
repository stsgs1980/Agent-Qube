/**
 * Layout scoring engine — single-goal and multi-goal scoring.
 * Extracted from scoring.ts for anti-monolith compliance.
 */

import type {
  LayoutRecipe, LayoutAdviceInput, LayoutRecommendation,
} from './types'

// ─── Scoring Weights ──────────────────────────────────────────

export const WEIGHTS = {
  goalMatch: 25,
  goalConflict: -35,
  contentAffinity: 15,
  itemCountFit: 10,
  structureMatch: 15,
  viewportAwareness: 10,
} as const

// ─── Content Affinity Map ─────────────────────────────────────

const contentAffinity: Record<string, string[]> = {
  cards: ['cards-grid', 'responsive-grid', 'bento-grid', 'masonry-grid', 'bento-masonry', 'dense-packing'],
  text: ['blog', 'top-nav', 'holy-grail', 'magazine', 'golden-ratio-grid', 'full-bleed'],
  data: ['dashboard', 'sidebar-left', 'bento-grid', 'subgrid-sync', 'animated-grid'],
  media: ['masonry-grid', 'bento-masonry', 'fullscreen-hero', 'split-screen', 'bento-hero', 'scroll-snap-grid'],
  forms: ['sidebar-left', 'top-nav', 'two-columns', 'dashboard', 'form-label-input', 'login-split'],
  mixed: ['dashboard', 'holy-grail', 'sidebar-left', 'bento-grid', 'container-query-grid'],
}

// ─── Goal-specific Layout Preferences ─────────────────────────

export const goalPreferences: Record<string, { prefer: string[]; avoid: string[] }> = {
  landing: { prefer: ['fullscreen-hero', 'split-screen', 'bento-hero', 'magazine', 'scroll-snap-grid', 'nav-logo-action'], avoid: ['dashboard', 'sidebar-left', 'sidebar-right', 'bento-sidebar', 'form-label-input'] },
  'admin-panel': { prefer: ['dashboard', 'sidebar-left', 'bento-sidebar', 'animated-grid', 'form-label-input'], avoid: ['fullscreen-hero', 'split-screen', 'bento-hero', 'honeycomb-grid', 'overlap-grid'] },
  blog: { prefer: ['top-nav', 'holy-grail', 'magazine', 'full-bleed', 'golden-ratio-grid', 'asymmetric-grid'], avoid: ['dashboard', 'bento-sidebar', 'login-split'] },
  ecommerce: { prefer: ['cards-grid', 'responsive-grid', 'holy-grail', 'scroll-snap-grid', 'dense-packing', 'nav-logo-action'], avoid: ['fullscreen-hero', 'overlap-grid', 'login-split'] },
  'dashboard-app': { prefer: ['dashboard', 'sidebar-left', 'bento-grid', 'bento-sidebar', 'animated-grid', 'subgrid-sync'], avoid: ['fullscreen-hero', 'split-screen', 'honeycomb-grid', 'overlap-grid'] },
  documentation: { prefer: ['sidebar-left', 'holy-grail', 'top-nav', 'full-bleed', 'nav-logo-action', 'golden-ratio-grid'], avoid: ['fullscreen-hero', 'overlap-grid', 'honeycomb-grid'] },
  portfolio: { prefer: ['bento-grid', 'bento-hero', 'masonry-grid', 'asymmetric-grid', 'grid-overlap', 'bento-masonry'], avoid: ['dashboard', 'sidebar-left', 'form-label-input', 'login-split'] },
  social: { prefer: ['auto-flow-column', 'cards-grid', 'responsive-grid', 'scroll-snap-grid', 'top-nav'], avoid: ['fullscreen-hero', 'form-label-input', 'login-split'] },
  media: { prefer: ['masonry-grid', 'scroll-snap-grid', 'bento-masonry', 'fullscreen-hero', 'split-screen', 'dense-packing'], avoid: ['sidebar-left', 'form-label-input', 'dashboard'] },
  saas: { prefer: ['login-split', 'dashboard', 'sidebar-left', 'animated-grid', 'container-query-grid', 'nav-logo-action'], avoid: ['honeycomb-grid', 'overlap-grid'] },
  crm: { prefer: ['dashboard', 'sidebar-left', 'three-columns', 'form-label-input', 'animated-grid', 'subgrid-sync'], avoid: ['fullscreen-hero', 'overlap-grid', 'honeycomb-grid'] },
  analytics: { prefer: ['dashboard', 'bento-grid', 'subgrid-sync', 'bento-sidebar', 'container-query-grid', 'grid-overlap'], avoid: ['fullscreen-hero', 'split-screen', 'honeycomb-grid', 'overlap-grid'] },
  application: { prefer: ['dashboard', 'sidebar-left', 'container-query-grid', 'animated-grid', 'bento-sidebar', 'subgrid-sync', 'nav-logo-action'], avoid: ['fullscreen-hero', 'split-screen', 'login-split', 'honeycomb-grid'] },
}

// ─── Single-goal Scoring ──────────────────────────────────────

export function scoreLayout(recipe: LayoutRecipe, input: LayoutAdviceInput): LayoutRecommendation {
  let score = 50
  const reasons: string[] = []

  if (recipe.bestFor.includes(input.goal)) {
    score += WEIGHTS.goalMatch
    reasons.push(`Optimized for ${input.goal}`)
  }
  if (recipe.conflicts.includes(input.goal)) {
    score += WEIGHTS.goalConflict
    reasons.push(`Conflicts with ${input.goal}`)
  }

  const prefs = goalPreferences[input.goal]
  if (prefs) {
    if (prefs.prefer.includes(recipe.structure)) { score += 8; reasons.push(`Popular for ${input.goal}`) }
    if (prefs.avoid.includes(recipe.structure)) { score -= 5; reasons.push(`Rarely used for ${input.goal}`) }
  }

  if (input.contentType) {
    const preferred = contentAffinity[input.contentType] ?? []
    if (preferred.includes(recipe.structure)) {
      score += WEIGHTS.contentAffinity
      reasons.push(`Good for ${input.contentType}`)
    }
  }

  if (input.itemCount !== undefined) {
    if (input.itemCount <= 1 && ['fullscreen-hero', 'split-screen', 'top-nav', 'login-split'].includes(recipe.structure)) {
      score += WEIGHTS.itemCountFit; reasons.push('Single-item focus')
    } else if (input.itemCount <= 6 && ['bento-grid', 'bento-hero', 'span-grid', 'magazine', 'grid-overlap', 'dense-packing'].includes(recipe.structure)) {
      score += WEIGHTS.itemCountFit; reasons.push('Small collection')
    } else if (input.itemCount > 6 && ['cards-grid', 'responsive-grid', 'masonry-grid', 'blog', 'auto-flow-column', 'container-query-grid'].includes(recipe.structure)) {
      score += WEIGHTS.itemCountFit; reasons.push('Large collection')
    }
  }

  let structBonus = 0
  if (input.needsSidebar) {
    const has = recipe.regions.some(r => r.name === 'sidebar')
    structBonus += has ? 5 : -5
    if (has) reasons.push('Has sidebar')
  }
  if (input.needsHeader) {
    structBonus += recipe.regions.some(r => r.name === 'header') ? 5 : -3
  }
  if (input.needsFooter) {
    structBonus += recipe.regions.some(r => r.name === 'footer') ? 5 : -3
  }
  score += Math.max(-WEIGHTS.structureMatch, Math.min(WEIGHTS.structureMatch, structBonus))

  score = Math.max(0, Math.min(100, score))

  let verdict: LayoutRecommendation['verdict'] = 'error'
  if (recipe.conflicts.includes(input.goal)) verdict = 'error'
  else if (score >= 70) verdict = 'recommended'
  else if (score >= 40) verdict = 'warning'

  return {
    structure: recipe.structure, recipe, score, verdict,
    reason: reasons.length > 0 ? reasons.join('. ') : 'Neutral match',
  }
}

// ─── Multi-goal Scoring ───────────────────────────────────────

export function scoreLayoutMulti(
  recipe: LayoutRecipe,
  input: LayoutAdviceInput,
  goalWeights: Record<string, number>,
): LayoutRecommendation & { goalBreakdown: Record<string, number> } {
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
