/**
 * Presets barrel export — registers all presets into the registry.
 *
 * Import this file to ensure all 5 presets are registered:
 *   import '@/lib/layout/presets'
 *
 * After import, use theme-registry functions:
 *   getPreset('champagne'), getByMode('dark'), getPair('cyan-night'), etc.
 */

import './champagne'
import './cyan-night'
import './zinc'
import './champagne-light'
import './cyan-morning'

// Re-export registry functions for convenience
export { getPreset, getAllPresets, getByMode, getPair, getOppositeMode } from '../theme-registry'
export type { PresetDefinition } from '../theme-types'
