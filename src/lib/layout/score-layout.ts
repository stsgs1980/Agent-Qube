/**
 * Layout scoring engine — single-goal and multi-goal scoring.
 * Extracted from scoring.ts for anti-monolith compliance.
 */

import type {
  LayoutRecipe, LayoutAdviceInput, LayoutRecommendation,
} from './types'

export type MultiGoalRecommendation = LayoutRecommendation & { goalBreakdown: Record<string, number> }

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

function scoreGoalMatch(recipe: LayoutRecipe, input: LayoutAdviceInput): { score: number; reasons: string[] } {
  let score = 0
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
    if (prefs.prefer.includes(recipe.structure)) {
      score += 8
      reasons.push(`Popular for ${input.goal}`)
    }
    if (prefs.avoid.includes(recipe.structure)) {
      score -= 5
      reasons.push(`Rarely used for ${input.goal}`)
    }
  }
  return { score, reasons }
}

function scoreContentAffinity(recipe: LayoutRecipe, input: LayoutAdviceInput): { score: number; reasons: string[] } {
  if (!input.contentType) return { score: 0, reasons: [] }
  const preferred = contentAffinity[input.contentType] ?? []
  if (preferred.includes(recipe.structure)) return { score: WEIGHTS.contentAffinity, reasons: [`Good for ${input.contentType}`] }
  return { score: 0, reasons: [] }
}

function scoreItemCountFit(recipe: LayoutRecipe, itemCount: number | undefined): { score: number; reasons: string[] } {
  if (itemCount === undefined) return { score: 0, reasons: [] }
  if (itemCount <= 1 && ['fullscreen-hero', 'split-screen', 'top-nav', 'login-split'].includes(recipe.structure))
    return { score: WEIGHTS.itemCountFit, reasons: ['Single-item focus'] }
  if (itemCount <= 6 && ['bento-grid', 'bento-hero', 'span-grid', 'magazine', 'grid-overlap', 'dense-packing'].includes(recipe.structure))
    return { score: WEIGHTS.itemCountFit, reasons: ['Small collection'] }
  if (itemCount > 6 && ['cards-grid', 'responsive-grid', 'masonry-grid', 'blog', 'auto-flow-column', 'container-query-grid'].includes(recipe.structure))
    return { score: WEIGHTS.itemCountFit, reasons: ['Large collection'] }
  return { score: 0, reasons: [] }
}

function scoreStructureMatch(recipe: LayoutRecipe, input: LayoutAdviceInput): { bonus: number; reasons: string[] } {
  let bonus = 0
  const reasons: string[] = []
  if (input.needsSidebar) {
    const has = recipe.regions.some(r => r.name === 'sidebar')
    bonus += has ? 5 : -5
    if (has) reasons.push('Has sidebar')
  }
  if (input.needsHeader) bonus += recipe.regions.some(r => r.name === 'header') ? 5 : -3
  if (input.needsFooter) bonus += recipe.regions.some(r => r.name === 'footer') ? 5 : -3
  return { bonus: Math.max(-WEIGHTS.structureMatch, Math.min(WEIGHTS.structureMatch, bonus)), reasons }
}

function computeVerdict(recipe: LayoutRecipe, score: number): LayoutRecommendation['verdict'] {
  if (recipe.conflicts.includes(recipe.structure)) return 'error'
  if (score >= 70) return 'recommended'
  if (score >= 40) return 'warning'
  return 'error'
}

export function scoreLayout(recipe: LayoutRecipe, input: LayoutAdviceInput): LayoutRecommendation {
  let score = 50
  const reasons: string[] = []

    const gm = scoreGoalMatch(recipe, input);
    score += gm.score;
    reasons.push(...gm.reasons)
    const ca = scoreContentAffinity(recipe, input);
    score += ca.score;
    reasons.push(...ca.reasons)
    const ic = scoreItemCountFit(recipe, input.itemCount);
    score += ic.score;
    reasons.push(...ic.reasons)
    const sm = scoreStructureMatch(recipe, input);
    score += sm.bonus;
    reasons.push(...sm.reasons)

  score = Math.max(0, Math.min(100, score))
  const verdict = computeVerdict(recipe, score)

  return {
    structure: recipe.structure, recipe, score, verdict,
    reason: reasons.length > 0 ? reasons.join('. ') : 'Neutral match',
  }
}

// ─── Multi-goal Scoring ───────────────────────────────────────

function applyConflictMitigation(
  recipe: LayoutRecipe, goal: string, goalCount: number,
  goalWeights: Record<string, number>, singleScore: number,
): number {
  if (!recipe.conflicts.includes(goal) || goalCount <= 1) return singleScore
  const nonConflicting = Object.keys(goalWeights).filter(
    g => g !== goal && goalWeights[g] > 0 && !recipe.conflicts.includes(g),
  )
  const restoreRatio = nonConflicting.length / (goalCount - 1)
  const penaltyRestore = Math.round(Math.abs(WEIGHTS.goalConflict) * restoreRatio * 0.7)
  return Math.min(100, singleScore + penaltyRestore)
}

function applyStructuralPenalty(
  input: LayoutAdviceInput, recipe: LayoutRecipe, score: number, goalCount: number,
): number {
  if (goalCount <= 1) return score
  const regionNames = recipe.regions.map(r => r.name)
  let missing = 0
  if (input.needsSidebar && !regionNames.includes('sidebar')) missing++
  if (input.needsHeader && !regionNames.includes('header')) missing++
  if (input.needsFooter && !regionNames.includes('footer')) missing++
  return missing > 0 ? Math.max(0, score - missing * 8) : score
}

function applySynergyAndPenalties(
  goalBreakdown: Record<string, number>, goalWeights: Record<string, number>,
  score: number, goalCount: number,
): number {
  let s = score
  const highScoring = Object.values(goalBreakdown).filter(v => v >= 65).length
  if (highScoring >= 2) s = Math.min(100, s + Math.min(8, highScoring * 3))
  if (Object.values(goalBreakdown).every(v => v >= 50) && goalCount >= 2) s = Math.min(100, s + 4)
  if (Object.entries(goalBreakdown).some(([g, v]) => (goalWeights[g] ?? 0) > 0.25 && v < 25)) s = Math.max(0, s - 12)
  return s
}

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
    const single = scoreLayout(recipe, { ...input, goal })
    const adjusted = applyConflictMitigation(recipe, goal, goalCount, goalWeights, single.score)
    goalBreakdown[goal] = adjusted
    weightedScore += adjusted * weight
    totalWeight += weight
    if (single.reason && single.reason !== 'Neutral match') allReasons.push(`[${goal}] ${single.reason}`)
  }

  let finalScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 50
  finalScore = applyStructuralPenalty(input, recipe, finalScore, goalCount)
  finalScore = applySynergyAndPenalties(goalBreakdown, goalWeights, finalScore, goalCount)

  const dominantConflict = Object.entries(goalWeights).some(([g, w]) => w > 0.5 && recipe.conflicts.includes(g))
  let verdict: LayoutRecommendation['verdict'] = 'warning'
  if (dominantConflict) verdict = 'error'
  else if (finalScore >= 70) verdict = 'recommended'

  return {
    structure: recipe.structure, recipe, score: finalScore, verdict,
    reason: allReasons.length > 0 ? allReasons.join('. ') : 'Neutral match',
    goalBreakdown,
  }
}
