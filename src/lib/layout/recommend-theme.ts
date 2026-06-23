/**
 * Theme Recommendation Engine — maps context to theme preset.
 *
 * This is the "brain" of the Theme Engine.
 * Given a goal, mood, and audience, it recommends the best theme preset.
 *
 * Architecture:
 *   - Context -> Mood mapping (goal + audience -> mood keywords)
 *   - Mood -> Preset matching (mood keywords -> preset.mood[])
 *   - Confidence scoring (how well the preset matches)
 *
 * Future: integrate with color-harmony.ts to generate new presets
 * when no existing preset matches well enough.
 */

import { getAllPresets, getByMode } from './theme-registry'
import type {
  ThemePreset,
  ThemeMode,
  ThemeRecommendationInput,
  ThemeRecommendation,
  PresetDefinition,
} from './theme-types'

// ─── Context -> Mood Mapping ─────────────────────────────────────

const GOAL_MOOD_MAP: Record<string, string[]> = {
  saas:           ['tech', 'professional', 'clean'],
  'dashboard-app':['tech', 'sharp', 'professional'],
  application:    ['neutral', 'professional'],
  blog:           ['elegant', 'editorial', 'warm'],
  ecommerce:      ['premium', 'clean', 'professional'],
  documentation:  ['tech', 'clean', 'sharp'],
  portfolio:      ['premium', 'elegant', 'editorial'],
  social:         ['playful', 'fresh'],
  media:          ['futuristic', 'sharp'],
  crm:            ['minimal', 'neutral', 'enterprise'],
  analytics:      ['tech', 'sharp', 'professional'],
  'admin-panel':  ['neutral', 'minimal', 'enterprise'],
  landing:        ['premium', 'elegant'],
}

const AUDIENCE_MOOD_MAP: Record<string, string[]> = {
  developers:  ['tech', 'sharp', 'futuristic'],
  consumers:   ['warm', 'elegant', 'fresh'],
  enterprise:  ['professional', 'minimal', 'neutral'],
  creatives:   ['premium', 'editorial', 'elegant'],
}

// ─── Recommendation Logic ────────────────────────────────────────

/**
 * Calculate how well a preset matches a set of target moods.
 * Returns a score from 0 to 1.
 */
function scoreMoodMatch(preset: PresetDefinition, targetMoods: string[]): number {
  if (targetMoods.length === 0) return 0.5

  const presetMoods = new Set(preset.mood.map((m) => m.toLowerCase()))
  const matches = targetMoods.filter((m) => presetMoods.has(m.toLowerCase()))

  return matches.length / targetMoods.length
}

/**
 * Calculate how well a preset matches the goal's bestFor.
 */
function scoreGoalMatch(preset: PresetDefinition, goal: string): number {
  return preset.bestFor.includes(goal) ? 1 : 0
}

/**
 * Recommend a theme based on context.
 *
 * @param input - Goal, mood, and audience
 * @param preferredMode - Prefer dark or light themes (default: 'dark')
 * @returns Ordered list of recommendations with confidence scores
 */
export function recommendThemes(
  input: ThemeRecommendationInput,
  preferredMode: ThemeMode = 'dark'
): ThemeRecommendation[] {
  const { goal, mood, audience } = input

  // Build target mood set from goal + explicit mood + audience
  const targetMoods: string[] = [
    ...(GOAL_MOOD_MAP[goal] ?? []),
    ...(mood ? [mood] : []),
    ...(audience ? (AUDIENCE_MOOD_MAP[audience] ?? []) : []),
  ]

  // Score all presets of the preferred mode
  const candidates = getByMode(preferredMode)

  const scored: ThemeRecommendation[] = candidates.map((preset) => {
    const moodScore = scoreMoodMatch(preset, targetMoods)
    const goalScore = scoreGoalMatch(preset, goal)

    // Weighted combination: goal match is most important
    const confidence = Math.min(1, goalScore * 0.6 + moodScore * 0.4)

    // Generate reason
    const matchedMoods = targetMoods.filter((m) =>
      preset.mood.map((pm) => pm.toLowerCase()).includes(m.toLowerCase())
    )
    const goalMatch = preset.bestFor.includes(goal)
    const reasons: string[] = []
    if (goalMatch) reasons.push(`optimized for ${goal}`)
    if (matchedMoods.length > 0) reasons.push(`matches ${matchedMoods.join(', ')} mood`)
    if (reasons.length === 0) reasons.push('neutral choice')

    return {
      presetId: preset.id,
      confidence,
      reason: reasons.join(', '),
    }
  })

  // Sort by confidence descending
  return scored.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Get the single best theme recommendation.
 */
export function recommendTheme(
  input: ThemeRecommendationInput,
  preferredMode: ThemeMode = 'dark'
): ThemeRecommendation {
  const recommendations = recommendThemes(input, preferredMode)
  return recommendations[0] ?? {
    presetId: preferredMode === 'dark' ? 'zinc' : 'champagne-light',
    confidence: 0,
    reason: 'default fallback',
  }
}

// ─── Context-to-Theme Quick Map ──────────────────────────────────

/**
 * Direct mapping table for common contexts.
 * Used by the Studio UI for instant recommendations without scoring.
 */
export const CONTEXT_THEME_MAP: Record<string, { dark: ThemePreset; light: ThemePreset }> = {
  'saas+premium':          { dark: 'champagne',       light: 'champagne-light' },
  'saas+tech':             { dark: 'cyan-night',      light: 'cyan-morning' },
  'saas+minimal':          { dark: 'zinc',            light: 'champagne-light' },
  'ecommerce+premium':     { dark: 'champagne',       light: 'champagne-light' },
  'ecommerce+tech':        { dark: 'cyan-night',      light: 'cyan-morning' },
  'blog+editorial':        { dark: 'champagne',       light: 'champagne-light' },
  'blog+minimal':          { dark: 'zinc',            light: 'cyan-morning' },
  'documentation+dev':     { dark: 'cyan-night',      light: 'cyan-morning' },
  'documentation+clean':   { dark: 'cyan-night',      light: 'cyan-morning' },
  'portfolio+premium':     { dark: 'champagne',       light: 'champagne-light' },
  'portfolio+tech':        { dark: 'cyan-night',      light: 'cyan-morning' },
  'crm+enterprise':        { dark: 'zinc',            light: 'cyan-morning' },
  'dashboard+tech':        { dark: 'cyan-night',      light: 'cyan-morning' },
  'dashboard+minimal':     { dark: 'zinc',            light: 'champagne-light' },
  'analytics+tech':        { dark: 'cyan-night',      light: 'cyan-morning' },
  'admin+enterprise':      { dark: 'zinc',            light: 'cyan-morning' },
  'landing+premium':       { dark: 'champagne',       light: 'champagne-light' },
  'landing+tech':          { dark: 'cyan-night',      light: 'cyan-morning' },
}
