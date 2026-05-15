// Layout Lib — master barrel export

// Scoring
export { scoreLayout, scoreLayoutMulti, parsePrompt, WEIGHTS, goalPreferences } from './scoring'

// Theme Engine
export { LayoutThemeProvider, useLayoutTheme, StudioThemeProvider, useStudioTheme } from './theme'
export { ProjectThemeProvider, useProjectTheme } from './project-theme'
export type { ThemeMode, ThemePreset, ThemeTokens, PresetDefinition, ThemeRecommendation, ThemeContextValue } from './theme-types'
export { registerPreset, getPreset, getPresetOrThrow, getByMode, getPair, getOppositeMode, getAllPresets } from './theme-registry'
export { recommendTheme, recommendThemes } from './recommend-theme'
export { auditThemeContrast, getContrastRatio, meetsWcagAA } from './contrast'

// Color
export { generateHarmony, deriveDarkPalette, deriveLightPalette } from './color-harmony'
export type { HSL, RGB, PaletteColor, HarmonyMode } from './color-harmony'

// Tokens
export { colors, radius, spacing, fontSize, fontWeight } from './tokens'

// Hooks
export { useMounted } from './use-mounted'
export { useAiPrompt } from './use-ai-prompt'

// Types
export type { LayoutRecipe, LayoutAdviceInput, LayoutRecommendation, ParsedPrompt, LayoutRegion } from './types'
export { GOALS, PROMPT_EXAMPLES, categoryMeta } from './types'
