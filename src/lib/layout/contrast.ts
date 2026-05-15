/**
 * WCAG Contrast Utility — from Code-Realm palette.tsx
 *
 * Provides contrast ratio calculation and WCAG 2.1 compliance checks.
 * Used to validate theme presets and generated palettes.
 *
 * WCAG 2.1 AA requirements:
 *   - Normal text (< 18px): 4.5:1 minimum
 *   - Large text (>= 18px bold or >= 24px): 3:1 minimum
 *   - UI components / graphical objects: 3:1 minimum
 *
 * WCAG 2.1 AAA requirements:
 *   - Normal text: 7:1 minimum
 *   - Large text: 4.5:1 minimum
 */

import { hexToRgb, type RGB } from './color-convert'

// ─── Luminance Calculation ───────────────────────────────────────

/**
 * Calculate relative luminance of an RGB color per WCAG 2.1 spec.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function linearize(channel: number): number {
  const srgb = channel / 255
  return srgb <= 0.04045
    ? srgb / 12.92
    : Math.pow((srgb + 0.055) / 1.055, 2.4)
}

export function getLuminance(rgb: RGB): number {
  const r = linearize(rgb.r)
  const g = linearize(rgb.g)
  const b = linearize(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// ─── Contrast Ratio ──────────────────────────────────────────────

/**
 * Calculate contrast ratio between two RGB colors.
 * Returns a value from 1:1 (same color) to 21:1 (black vs white).
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Calculate contrast ratio from two hex color strings.
 */
export function getContrastRatioHex(fg: string, bg: string): number {
  return getContrastRatio(hexToRgb(fg), hexToRgb(bg))
}

// ─── WCAG Compliance Checks ──────────────────────────────────────

export interface ContrastResult {
  ratio: number
  aa: boolean       // WCAG 2.1 AA (4.5:1 for normal text)
  aaLarge: boolean  // WCAG 2.1 AA for large text (3:1)
  aaa: boolean      // WCAG 2.1 AAA (7:1 for normal text)
  aaaLarge: boolean // WCAG 2.1 AAA for large text (4.5:1)
  level: 'fail' | 'AA-large' | 'AA' | 'AAA-large' | 'AAA'
}

export function checkContrast(fg: string, bg: string): ContrastResult {
  const ratio = getContrastRatioHex(fg, bg)

  const aaLarge = ratio >= 3
  const aa = ratio >= 4.5
  const aaaLarge = ratio >= 4.5
  const aaa = ratio >= 7

  let level: ContrastResult['level'] = 'fail'
  if (aaa) level = 'AAA'
  else if (aaaLarge) level = 'AAA-large'
  else if (aa) level = 'AA'
  else if (aaLarge) level = 'AA-large'

  return { ratio: Math.round(ratio * 100) / 100, aa, aaLarge, aaa, aaaLarge, level }
}

// ─── Convenience Helpers ─────────────────────────────────────────

/**
 * Check if two hex colors meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text).
 * Convenience wrapper around checkContrast().
 */
export function meetsWcagAA(fg: string, bg: string): boolean {
  return checkContrast(fg, bg).aa
}

// ─── Theme Validation ────────────────────────────────────────────

export interface ThemeContrastAudit {
  presetId: string
  mode: 'dark' | 'light'
  checks: ContrastCheck[]
  failures: ContrastCheck[]
  passRate: number  // 0-1
}

export interface ContrastCheck {
  name: string
  fg: string
  bg: string
  result: ContrastResult
}

/**
 * Key token pairs to check for WCAG compliance.
 * Each pair maps to a semantic use case.
 */
const CRITICAL_TOKEN_PAIRS: Array<{
  name: string
  fgKey: keyof import('./theme-types').ThemeTokens
  bgKey: keyof import('./theme-types').ThemeTokens
}> = [
  { name: 'Primary text on deep bg',   fgKey: 'textPrimary',   bgKey: 'bgDeep' },
  { name: 'Secondary text on deep bg', fgKey: 'textSecondary', bgKey: 'bgDeep' },
  { name: 'Muted text on deep bg',     fgKey: 'textMuted',     bgKey: 'bgDeep' },
  { name: 'Dim text on deep bg',       fgKey: 'textDim',       bgKey: 'bgDeep' },
  { name: 'Sidebar text on sidebar',   fgKey: 'sidebarText',   bgKey: 'sidebarBg' },
  { name: 'Sidebar muted on sidebar',  fgKey: 'sidebarMuted',  bgKey: 'sidebarBg' },
  { name: 'Cell text on cell bg',      fgKey: 'cellText',      bgKey: 'cellBg' },
  { name: 'Accent on deep bg',         fgKey: 'accentPrimary', bgKey: 'bgDeep' },
  { name: 'Code text on code bg',      fgKey: 'codeText',      bgKey: 'codeBg' },
  { name: 'Code muted on code bg',     fgKey: 'codeMuted',     bgKey: 'codeBg' },
]

/**
 * Audit a theme preset for WCAG contrast compliance.
 */
export function auditThemeContrast(
  presetId: string,
  mode: 'dark' | 'light',
  tokens: import('./theme-types').ThemeTokens
): ThemeContrastAudit {
  const checks: ContrastCheck[] = CRITICAL_TOKEN_PAIRS.map(({ name, fgKey, bgKey }) => {
    const fg = String(tokens[fgKey])
    const bg = String(tokens[bgKey])
    return { name, fg, bg, result: checkContrast(fg, bg) }
  })

  const failures = checks.filter((c) => !c.result.aa)

  return {
    presetId,
    mode,
    checks,
    failures,
    passRate: (checks.length - failures.length) / checks.length,
  }
}
