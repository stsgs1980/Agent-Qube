/**
 * Color palettes and semantic color tokens for @stsgs/ui.
 * Extracted from tokens.ts per STD-FE-001 (200-line limit).
 */

// ─── Color Palettes ──────────────────────────────────────────

export const colors = {
  // Zinc scale (monochrome — cool undertone at 240°)
  zinc: {
    50:  '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#0A0A0F',
  },

  // Primary accent — Emerald
  emerald: {
    50:  '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  // AI / secondary accent — Amber
  amber: {
    50:  '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
} as const

// ─── Semantic Tokens (Dark Theme) ─────────────────────────────

export const darkTokens = {
  bgDeep:     colors.zinc[950],
  bgBase:     colors.zinc[900],
  bgSurface:  colors.zinc[800],
  bgElevated: colors.zinc[700],

  textPrimary:   colors.zinc[50],
  textSecondary: colors.zinc[300],
  textMuted:     colors.zinc[500],
  textDim:       colors.zinc[600],

  borderSubtle:  `${colors.zinc[800]}80`,
  borderDefault: colors.zinc[700],
  borderBright:  colors.zinc[600],

  accentPrimary: colors.emerald[500],
  accentAI:      colors.amber[500],

  accentGlow:    `${colors.emerald[500]}14`,
  accentAIGlow:  `${colors.amber[500]}14`,
} as const

// ─── Semantic Tokens (Light Theme) ────────────────────────────

export const lightTokens = {
  bgDeep:     colors.zinc[50],
  bgBase:     colors.zinc[100],
  bgSurface:  colors.zinc[200],
  bgElevated: colors.zinc[300],

  textPrimary:   colors.zinc[950],
  textSecondary: colors.zinc[700],
  textMuted:     colors.zinc[500],
  textDim:       colors.zinc[400],

  borderSubtle:  `${colors.zinc[200]}80`,
  borderDefault: colors.zinc[300],
  borderBright:  colors.zinc[400],

  accentPrimary: colors.emerald[600],
  accentAI:      colors.amber[600],

  accentGlow:    `${colors.emerald[600]}14`,
  accentAIGlow:  `${colors.amber[600]}14`,
} as const

// ─── CSS Custom Properties Generator ──────────────────────────

export function tokensToCSS(tokens: typeof darkTokens): Record<string, string> {
  return {
    '--stsgs-bg-deep':     tokens.bgDeep,
    '--stsgs-bg-base':     tokens.bgBase,
    '--stsgs-bg-surface':  tokens.bgSurface,
    '--stsgs-bg-elevated': tokens.bgElevated,
    '--stsgs-text-primary':   tokens.textPrimary,
    '--stsgs-text-secondary': tokens.textSecondary,
    '--stsgs-text-muted':     tokens.textMuted,
    '--stsgs-text-dim':       tokens.textDim,
    '--stsgs-border-subtle':  tokens.borderSubtle,
    '--stsgs-border-default': tokens.borderDefault,
    '--stsgs-border-bright':  tokens.borderBright,
    '--stsgs-accent':   tokens.accentPrimary,
    '--stsgs-accent-ai': tokens.accentAI,
    '--stsgs-accent-glow':   tokens.accentGlow,
    '--stsgs-accent-ai-glow': tokens.accentAIGlow,
  }
}
