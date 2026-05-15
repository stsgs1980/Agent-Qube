'use client'

import { useMemo } from 'react'
import type { ProjectGoal, LayoutStructure, LayoutAdviceInput, BreakpointName } from '../tokens/types'
import type { LayoutRecipe, LayoutAdvice } from '../tokens/types'
import { layoutRegistry } from '../tokens/layout-registry'
import { useLayoutContext } from '../providers/layout-provider'

// ─── Types ────────────────────────────────────────────────────

export interface LayoutRecommendation {
  /** Layout structure name */
  structure: LayoutStructure
  /** Recipe details */
  recipe: LayoutRecipe
  /** Score from 0 to 100 (how well this layout matches the input) */
  score: number
  /** Whether this is recommended, a warning, or an error for the given goal */
  verdict: 'recommended' | 'warning' | 'error'
  /** Explanation of the verdict */
  reason: string
}

export interface UseLayoutAdviceResult {
  /** All layouts ranked by score */
  ranked: LayoutRecommendation[]
  /** Top 3 recommended layouts */
  recommended: LayoutRecommendation[]
  /** Layouts that conflict with the given goal */
  warnings: LayoutRecommendation[]
  /** Best match */
  best: LayoutRecommendation | null
  /** Total number of layouts evaluated */
  total: number
}

// ─── Scoring Weights ──────────────────────────────────────────
// Each factor has a weight that determines its influence on the final score.
// Total possible bonus: 100 (base) + 25 (goal) - 35 (conflict) + 15 (content)
//   + 10 (items) + 15 (structure) + 10 (viewport) = ~140 max

const WEIGHTS = {
  /** Goal match: layout is optimized for this project type */
  goalMatch: 25,
  /** Goal conflict: layout is not recommended for this project type */
  goalConflict: -35,
  /** Content type affinity: layout is good for this content type */
  contentAffinity: 15,
  /** Item count fit: layout matches the number of content items */
  itemCountFit: 10,
  /** Structural requirement match: layout has the required regions */
  structureMatch: 15,
  /** Viewport awareness: bonus/penalty based on current breakpoint */
  viewportAwareness: 10,
} as const

// ─── Content Affinity Map ─────────────────────────────────────

const contentAffinity: Record<string, LayoutStructure[]> = {
  cards: ['cards-grid', 'responsive-grid', 'bento-grid', 'masonry-grid', 'bento-masonry', 'dense-packing'],
  text: ['blog', 'top-nav', 'holy-grail', 'magazine', 'golden-ratio-grid', 'full-bleed'],
  data: ['dashboard', 'sidebar-left', 'bento-sidebar', 'bento-grid', 'subgrid-sync', 'animated-grid'],
  media: ['masonry-grid', 'bento-masonry', 'fullscreen-hero', 'split-screen', 'bento-hero', 'scroll-snap-grid'],
  forms: ['sidebar-left', 'top-nav', 'two-columns', 'dashboard', 'form-label-input', 'login-split'],
  mixed: ['dashboard', 'holy-grail', 'sidebar-left', 'bento-grid', 'container-query-grid'],
}

// ─── Goal-specific layout preferences ─────────────────────────

const goalPreferences: Record<ProjectGoal, { prefer: LayoutStructure[]; avoid: LayoutStructure[] }> = {
  landing: {
    prefer: ['fullscreen-hero', 'split-screen', 'bento-hero', 'magazine', 'scroll-snap-grid', 'nav-logo-action'],
    avoid: ['dashboard', 'sidebar-left', 'sidebar-right', 'bento-sidebar', 'form-label-input'],
  },
  'admin-panel': {
    prefer: ['dashboard', 'sidebar-left', 'bento-sidebar', 'animated-grid', 'form-label-input'],
    avoid: ['fullscreen-hero', 'split-screen', 'bento-hero', 'honeycomb-grid', 'overlap-grid'],
  },
  blog: {
    prefer: ['top-nav', 'holy-grail', 'magazine', 'full-bleed', 'golden-ratio-grid', 'asymmetric-grid'],
    avoid: ['dashboard', 'bento-sidebar', 'login-split'],
  },
  ecommerce: {
    prefer: ['cards-grid', 'responsive-grid', 'holy-grail', 'scroll-snap-grid', 'dense-packing', 'nav-logo-action'],
    avoid: ['fullscreen-hero', 'overlap-grid', 'login-split'],
  },
  'dashboard-app': {
    prefer: ['dashboard', 'sidebar-left', 'bento-grid', 'bento-sidebar', 'animated-grid', 'subgrid-sync'],
    avoid: ['fullscreen-hero', 'split-screen', 'honeycomb-grid', 'overlap-grid'],
  },
  documentation: {
    prefer: ['sidebar-left', 'holy-grail', 'top-nav', 'full-bleed', 'nav-logo-action', 'golden-ratio-grid'],
    avoid: ['fullscreen-hero', 'overlap-grid', 'honeycomb-grid'],
  },
  portfolio: {
    prefer: ['bento-grid', 'bento-hero', 'masonry-grid', 'asymmetric-grid', 'grid-overlap', 'bento-masonry'],
    avoid: ['dashboard', 'sidebar-left', 'form-label-input', 'login-split'],
  },
  social: {
    prefer: ['auto-flow-column', 'cards-grid', 'responsive-grid', 'scroll-snap-grid', 'top-nav'],
    avoid: ['fullscreen-hero', 'form-label-input', 'login-split'],
  },
  media: {
    prefer: ['masonry-grid', 'scroll-snap-grid', 'bento-masonry', 'fullscreen-hero', 'split-screen', 'dense-packing'],
    avoid: ['sidebar-left', 'form-label-input', 'dashboard'],
  },
  saas: {
    prefer: ['login-split', 'dashboard', 'sidebar-left', 'animated-grid', 'container-query-grid', 'nav-logo-action'],
    avoid: ['honeycomb-grid', 'overlap-grid', 'honeycomb-grid'],
  },
  crm: {
    prefer: ['dashboard', 'sidebar-left', 'three-columns', 'form-label-input', 'animated-grid', 'subgrid-sync'],
    avoid: ['fullscreen-hero', 'overlap-grid', 'honeycomb-grid'],
  },
  analytics: {
    prefer: ['dashboard', 'bento-grid', 'subgrid-sync', 'bento-sidebar', 'container-query-grid', 'grid-overlap'],
    avoid: ['fullscreen-hero', 'split-screen', 'honeycomb-grid', 'overlap-grid'],
  },
}

// ─── Scoring Logic ────────────────────────────────────────────

function scoreLayout(
  recipe: LayoutRecipe,
  input: LayoutAdviceInput,
  breakpoint: BreakpointName | 'base'
): LayoutRecommendation {
  let score = 50 // base score
  const reasons: string[] = []

  // 1. Goal match (most important factor)
  if (recipe.bestFor.includes(input.goal)) {
    score += WEIGHTS.goalMatch
    reasons.push(`Optimized for ${input.goal}`)
  }

  // 2. Goal conflict (strong penalty)
  if (recipe.conflicts.includes(input.goal)) {
    score += WEIGHTS.goalConflict // negative value
    reasons.push(`Not recommended for ${input.goal}`)
  }

  // 3. Goal-specific preferences (bonus for known good layouts)
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

  // 4. Content type match
  if (input.contentType) {
    const preferred = contentAffinity[input.contentType] ?? []
    if (preferred.includes(recipe.structure)) {
      score += WEIGHTS.contentAffinity
      reasons.push(`Good for ${input.contentType} content`)
    }
  }

  // 5. Item count fit
  if (input.itemCount !== undefined) {
    if (input.itemCount <= 1) {
      if (['fullscreen-hero', 'split-screen', 'top-nav', 'login-split'].includes(recipe.structure)) {
        score += WEIGHTS.itemCountFit
        reasons.push('Good for single-item focus')
      }
    } else if (input.itemCount <= 6) {
      if (['bento-grid', 'bento-hero', 'span-grid', 'magazine', 'grid-overlap', 'dense-packing'].includes(recipe.structure)) {
        score += WEIGHTS.itemCountFit
        reasons.push('Good for small collections')
      }
    } else {
      if (['cards-grid', 'responsive-grid', 'masonry-grid', 'blog', 'auto-flow-column', 'container-query-grid'].includes(recipe.structure)) {
        score += WEIGHTS.itemCountFit
        reasons.push('Good for large collections')
      }
    }
  }

  // 6. Structural requirements
  let structBonus = 0
  if (input.needsSidebar) {
    const hasSidebar = recipe.regions.some((r) => r.name === 'sidebar')
    structBonus += hasSidebar ? 5 : -5
    if (hasSidebar) reasons.push('Has sidebar')
    else reasons.push('No sidebar')
  }
  if (input.needsHeader) {
    const hasHeader = recipe.regions.some((r) => r.name === 'header')
    structBonus += hasHeader ? 5 : -3
  }
  if (input.needsFooter) {
    const hasFooter = recipe.regions.some((r) => r.name === 'footer')
    structBonus += hasFooter ? 5 : -3
  }
  score += Math.max(-WEIGHTS.structureMatch, Math.min(WEIGHTS.structureMatch, structBonus))

  // 7. Viewport awareness — penalize layouts that don't work well on current breakpoint
  const isMobile = breakpoint === 'base' || breakpoint === 'sm'
  const isTablet = breakpoint === 'md'
  if (isMobile) {
    // On mobile, layouts without mobile template get a penalty
    if (!recipe.gridTemplateMobile && recipe.gridTemplate.areas) {
      score -= WEIGHTS.viewportAwareness
      reasons.push('No mobile variant')
    }
    // Fullscreen layouts work well on mobile
    if (['fullscreen-hero', 'login-split', 'top-nav'].includes(recipe.structure)) {
      score += 5
    }
  }
  if (isTablet) {
    // On tablet, layouts without tablet template get a smaller penalty
    if (!recipe.gridTemplateTablet && recipe.gridTemplate.areas) {
      score -= 5
      reasons.push('No tablet variant')
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score))

  // Determine verdict
  let verdict: LayoutRecommendation['verdict']
  if (recipe.conflicts.includes(input.goal)) {
    verdict = 'error'
  } else if (score >= 70) {
    verdict = 'recommended'
  } else if (score >= 40) {
    verdict = 'warning'
  } else {
    verdict = 'error'
  }

  return {
    structure: recipe.structure,
    recipe,
    score,
    verdict,
    reason: reasons.length > 0 ? reasons.join('. ') : 'Neutral match',
  }
}

// ─── useLayoutAdvice Hook ─────────────────────────────────────

/**
 * useLayoutAdvice -- context-aware layout recommendations.
 *
 * Given project context (goal, content type, item count, structural needs),
 * ranks all 51 layout structures by how well they match. Returns
 * the best match, top 3 recommendations, and any warnings.
 *
 * Scoring factors (7 total):
 * 1. Goal match (weight: 25) — layout is optimized for this project type
 * 2. Goal conflict (weight: -35) — layout conflicts with project type
 * 3. Goal-specific preferences (weight: +8/-5) — known good/bad layouts per goal
 * 4. Content type affinity (weight: 15) — layout suits the content type
 * 5. Item count fit (weight: 10) — layout matches item quantity
 * 6. Structural requirements (weight: 15) — layout has required regions
 * 7. Viewport awareness (weight: 10) — layout works on current breakpoint
 *
 * Also reads the current breakpoint from LayoutProvider to penalize
 * layouts that lack responsive variants for the current viewport.
 *
 * @example
 * ```tsx
 * function ProjectSetup() {
 *   const { best, recommended, warnings } = useLayoutAdvice({
 *     goal: 'admin-panel',
 *     contentType: 'data',
 *     itemCount: 20,
 *     needsSidebar: true,
 *   })
 *
 *   return (
 *     <div>
 *       <h2>Recommended: {best?.recipe.name}</h2>
 *       <p>{best?.reason}</p>
 *
 *       <Layout structure={best!.structure}>
 *         <Layout.Slot name="sidebar"><Nav /></Layout.Slot>
 *         <Layout.Slot name="main"><Content /></Layout.Slot>
 *       </Layout>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutAdvice(input: LayoutAdviceInput): UseLayoutAdviceResult {
  const allRecipes = Object.values(layoutRegistry)
  const { breakpoint } = useLayoutContext()

  const ranked = useMemo(() => {
    return allRecipes
      .map((recipe) => scoreLayout(recipe, input, breakpoint))
      .sort((a, b) => b.score - a.score)
  }, [
    allRecipes,
    input.goal,
    input.contentType,
    input.itemCount,
    input.needsSidebar,
    input.needsHeader,
    input.needsFooter,
    breakpoint,
  ])

  const recommended = ranked.filter((r) => r.verdict === 'recommended').slice(0, 3)
  const warnings = ranked.filter((r) => r.verdict === 'warning')
  const best = ranked[0] ?? null

  return {
    ranked,
    recommended,
    warnings,
    best,
    total: ranked.length,
  }
}
