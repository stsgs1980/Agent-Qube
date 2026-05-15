// ─── Color Utilities ─────────────────────────────────────────
// Shared helpers for parsing and manipulating color strings.

/** RGB channel values from a hex color string */
export interface ColorChannels {
  r: number
  g: number
  b: number
}

/**
 * Parse a hex color string (#RRGGBB) into RGB channel values.
 *
 * @example
 * ```ts
 * hexToChannels('#00e5ff') // { r: 0, g: 229, b: 255 }
 * ```
 */
export function hexToChannels(hex: string): ColorChannels {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}
