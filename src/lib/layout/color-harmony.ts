/**
 * Color Harmony — barrel re-export.
 * Split into color-convert.ts and harmony-algorithms.ts for anti-monolith compliance.
 * All existing imports from '@/lib/layout/color-harmony' continue to work.
 */

export type { HSL, RGB, PaletteColor, HarmonyMode } from './color-convert'
export { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, hslToHex, hexToHsl, makePaletteColor } from './color-convert'
export { getComplementary, getAnalogous, getTriadic, getSplitComplementary, getMonochromatic, getTetradic, generateRandomPalette, generateHarmony, deriveDarkPalette, deriveLightPalette } from './harmony-algorithms'
