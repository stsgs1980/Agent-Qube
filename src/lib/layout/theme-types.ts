/**
 * Theme Engine types — open, extensible preset definitions.
 *
 * Key design decisions:
 * - ThemePreset = string (open, not closed union) — adding a theme = 1 file + registerPreset()
 * - PresetDefinition contains its own pair reference, no separate DARK_TO_LIGHT maps
 * - CSS variables use --stsgs-* prefix, mapped via @theme inline for shadcn compatibility
 */

import type { LucideIcon } from 'lucide-react'

// ─── Core Types ──────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light'

/**
 * ThemePreset is an open string type.
 * Adding a new preset requires only:
 *   1. Create a new file in presets/ with PresetDefinition
 *   2. Call registerPreset() to add it to the registry
 * No need to edit union types or multiple files.
 */
export type ThemePreset = string

// ─── Token Interface ─────────────────────────────────────────────

export interface ThemeTokens {
  // Backgrounds
  bgDeep: string
  bgBase: string
  bgSurface: string
  bgElevated: string

  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string
  textDim: string

  // Borders
  borderSubtle: string
  borderDefault: string
  borderBright: string

  // Accents
  accentPrimary: string
  accentAI: string
  accentGlow: string
  accentAIGlow: string

  // Sidebar (Component Browser)
  sidebarBg: string
  sidebarText: string
  sidebarMuted: string
  sidebarHover: string
  sidebarBorder: string

  // Code drawer
  codeBg: string
  codeText: string
  codeMuted: string
  codeAccent: string

  // Cards
  cardBorder: string
  cardSelected: string
  cardHover: string

  // Grid cells
  cellBg: string
  cellFeaturedBg: string
  cellText: string
  cellFeaturedText: string

  // Inverted (for buttons that flip)
  textOnAccent: string
  bgOnAccent: string

  // Shadow
  cardShadow: string

  // Focus — WCAG 2.4.7 visible focus indicator
  focusRing: string

  // Typography — 3 font families
  fontFamilyBody: string    // UI text, labels, buttons, sidebar
  fontFamilyDisplay: string // headings, titles, hero
  fontFamilyMono: string    // code, grid cells, technical labels
  fontWeightBody: number
  cornerRadius: number      // px — 2=sharp, 12=default
}

// ─── Preset Definition ───────────────────────────────────────────

export interface PresetDefinition {
  /** Unique preset identifier — used as data-theme attribute value */
  id: ThemePreset

  /** Human-readable name for UI */
  label: string

  /** Short description for theme selector */
  description: string

  /** Dark or light mode */
  mode: ThemeMode

  /** Paired preset ID for dark/light toggle (e.g. champagne -> champagne-light) */
  pair?: ThemePreset

  /** Accent color swatch for visual identification */
  accent: string

  /** Background color swatch for visual identification */
  bg: string

  /** Icon for theme selector (optional — defaults to mode icon) */
  icon?: LucideIcon

  /** Best use cases — for recommendTheme() mapping */
  bestFor: string[]

  /** Mood keywords — for recommendTheme() mapping */
  mood: string[]

  /** Complete token set */
  tokens: ThemeTokens
}

// ─── Theme Context ───────────────────────────────────────────────

export interface ThemeContextValue {
  mode: ThemeMode
  preset: ThemePreset
  tokens: ThemeTokens
  toggle: () => void
  setMode: (m: ThemeMode) => void
  setPreset: (p: ThemePreset) => void
}

// ─── Theme Recommendation ────────────────────────────────────────

export interface ThemeRecommendationInput {
  /** Goal category (saas, ecommerce, blog, etc.) */
  goal: string
  /** Mood preference (premium, tech, playful, minimal) */
  mood?: string
  /** Target audience (developers, consumers, enterprise) */
  audience?: string
}

export interface ThemeRecommendation {
  presetId: ThemePreset
  confidence: number    // 0-1
  reason: string
}
