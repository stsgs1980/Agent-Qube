/**
 * Harmony Algorithms — 7 color harmony generators + palette derivation.
 *
 * Extracted from color-harmony.ts for anti-monolith compliance.
 * Imports color conversion from ./color-convert.
 */

import type { PaletteColor, HarmonyMode } from './color-convert'
import { makePaletteColor, hexToHsl, hslToHex } from './color-convert'

// ─── Harmony Algorithms ──────────────────────────────────────────

export function getComplementary(h: number, s: number, l: number): PaletteColor[] {
  return [
    makePaletteColor(h, s, l),
    makePaletteColor(h, s, Math.min(l + 15, 95)),
    makePaletteColor((h + 180) % 360, s, l),
    makePaletteColor((h + 180) % 360, s, Math.min(l + 15, 95)),
    makePaletteColor(h, s, Math.max(l - 15, 5)),
  ]
}

export function getAnalogous(h: number, s: number, l: number): PaletteColor[] {
  return [
    makePaletteColor((h - 30 + 360) % 360, s, l),
    makePaletteColor((h - 15 + 360) % 360, s, Math.min(l + 10, 95)),
    makePaletteColor(h, s, l),
    makePaletteColor((h + 15) % 360, s, Math.min(l + 10, 95)),
    makePaletteColor((h + 30) % 360, s, l),
  ]
}

export function getTriadic(h: number, s: number, l: number): PaletteColor[] {
  return [
    makePaletteColor(h, s, l),
    makePaletteColor(h, s, Math.min(l + 15, 95)),
    makePaletteColor((h + 120) % 360, s, l),
    makePaletteColor((h + 240) % 360, s, l),
    makePaletteColor((h + 240) % 360, s, Math.min(l + 15, 95)),
  ]
}

export function getSplitComplementary(h: number, s: number, l: number): PaletteColor[] {
  return [
    makePaletteColor(h, s, l),
    makePaletteColor(h, s, Math.min(l + 15, 95)),
    makePaletteColor((h + 150) % 360, s, l),
    makePaletteColor((h + 210) % 360, s, l),
    makePaletteColor((h + 180) % 360, s, Math.max(l - 10, 5)),
  ]
}

export function getMonochromatic(h: number, s: number, l: number): PaletteColor[] {
  return [
    makePaletteColor(h, s, Math.min(l + 25, 95)),
    makePaletteColor(h, s, Math.min(l + 12, 90)),
    makePaletteColor(h, s, l),
    makePaletteColor(h, s, Math.max(l - 12, 10)),
    makePaletteColor(h, s, Math.max(l - 25, 5)),
  ]
}

export function getTetradic(h: number, s: number, l: number): PaletteColor[] {
  return [
    makePaletteColor(h, s, l),
    makePaletteColor((h + 90) % 360, s, l),
    makePaletteColor((h + 180) % 360, s, l),
    makePaletteColor((h + 270) % 360, s, l),
    makePaletteColor((h + 180) % 360, s, Math.min(l + 15, 95)),
  ]
}

export function generateRandomPalette(): PaletteColor[] {
  const baseHue = Math.random() * 360
  const baseSat = 50 + Math.random() * 40
  const baseLight = 40 + Math.random() * 20
  const modes: HarmonyMode[] = [
    'complementary', 'analogous', 'triadic',
    'split-complementary', 'monochromatic', 'tetradic',
  ]
  const mode = modes[Math.floor(Math.random() * modes.length)]
  return generateHarmony(baseHue, baseSat, baseLight, mode)
}

// ─── Unified Generator ───────────────────────────────────────────

export function generateHarmony(
  h: number, s: number, l: number, mode: HarmonyMode
): PaletteColor[] {
  switch (mode) {
    case 'complementary':       return getComplementary(h, s, l)
    case 'analogous':           return getAnalogous(h, s, l)
    case 'triadic':             return getTriadic(h, s, l)
    case 'split-complementary': return getSplitComplementary(h, s, l)
    case 'monochromatic':       return getMonochromatic(h, s, l)
    case 'tetradic':            return getTetradic(h, s, l)
    case 'random':              return generateRandomPalette()
  }
}

// ─── Theme-aware Helpers ─────────────────────────────────────────

/**
 * Derive a complete dark palette from an accent hex color.
 * Returns 5 colors suitable for a dark theme background hierarchy.
 */
export function deriveDarkPalette(accentHex: string): {
  bgDeep: string
  bgBase: string
  bgSurface: string
  bgElevated: string
  accent: string
} {
  const { h, s } = hexToHsl(accentHex)

  return {
    bgDeep:     hslToHex(h, Math.min(s, 15), 4),
    bgBase:     hslToHex(h, Math.min(s, 12), 7),
    bgSurface:  hslToHex(h, Math.min(s, 10), 10),
    bgElevated: hslToHex(h, Math.min(s, 8), 14),
    accent:     accentHex,
  }
}

/**
 * Derive a complete light palette from an accent hex color.
 * Returns 5 colors suitable for a light theme background hierarchy.
 */
export function deriveLightPalette(accentHex: string): {
  bgDeep: string
  bgBase: string
  bgSurface: string
  bgElevated: string
  accent: string
} {
  const { h, s } = hexToHsl(accentHex)

  return {
    bgDeep:     hslToHex(h, Math.min(s, 30), 97),
    bgBase:     hslToHex(h, Math.min(s, 25), 100),
    bgSurface:  hslToHex(h, Math.min(s, 35), 94),
    bgElevated: hslToHex(h, Math.min(s, 40), 90),
    accent:     accentHex,
  }
}
