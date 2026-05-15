/**
 * Color Conversion Utilities — HSL/RGB/Hex converters and palette types.
 *
 * Extracted from color-harmony.ts for anti-monolith compliance.
 * Used by harmony-algorithms.ts and contrast.ts.
 */

// ─── Types ───────────────────────────────────────────────────────

export interface HSL {
  h: number  // 0-360
  s: number  // 0-100
  l: number  // 0-100
}

export interface RGB {
  r: number  // 0-255
  g: number  // 0-255
  b: number  // 0-255
}

export interface PaletteColor {
  hex: string
  rgb: RGB
  hsl: HSL
}

export type HarmonyMode =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic'
  | 'tetradic'
  | 'random'

// ─── Color Conversion ────────────────────────────────────────────

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100
  const ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)

  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
  }

  return { r: f(0), g: f(8), b: f(4) }
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l)
  return rgbToHex(r, g, b)
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

// ─── Palette Color Factory ───────────────────────────────────────

export function makePaletteColor(h: number, s: number, l: number): PaletteColor {
  const rgb = hslToRgb(h, s, l)
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  return {
    hex,
    rgb,
    hsl: { h: ((h % 360) + 360) % 360, s, l },
  }
}
