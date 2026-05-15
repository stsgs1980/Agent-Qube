/**
 * Theme Registry — open, extensible preset storage.
 *
 * Architecture:
 *   - Map<string, PresetDefinition> for O(1) lookup by preset ID
 *   - registerPreset() for adding new presets (1 file + 1 call)
 *   - getByMode() for filtering dark/light presets
 *   - getPair() for dark/light toggle
 *
 * Key: open, not closed.
 *   WRONG: type ThemePreset = 'zinc' | 'champagne' | ...
 *   RIGHT: type ThemePreset = string + registerPreset()
 */

import type { PresetDefinition, ThemeMode, ThemePreset } from './theme-types'

// ─── Registry Storage ────────────────────────────────────────────

const registry = new Map<string, PresetDefinition>()

// ─── Register ────────────────────────────────────────────────────

/**
 * Register a theme preset.
 * Call this once per preset file, typically at module load time.
 *
 * Example:
 *   // presets/champagne.ts
 *   registerPreset({ id: 'champagne', mode: 'dark', ... })
 */
export function registerPreset(preset: PresetDefinition): void {
  if (registry.has(preset.id)) {
    console.warn(`[ThemeRegistry] Preset "${preset.id}" already registered. Overwriting.`)
  }
  registry.set(preset.id, preset)
}

// ─── Getters ─────────────────────────────────────────────────────

/** Get a preset by ID. Returns undefined if not found. */
export function getPreset(id: ThemePreset): PresetDefinition | undefined {
  return registry.get(id)
}

/** Get a preset by ID. Throws if not found. */
export function getPresetOrThrow(id: ThemePreset): PresetDefinition {
  const preset = registry.get(id)
  if (!preset) {
    throw new Error(`[ThemeRegistry] Preset "${id}" not found. Registered: ${getAllIds().join(', ')}`)
  }
  return preset
}

/** Get all registered presets. */
export function getAllPresets(): PresetDefinition[] {
  return Array.from(registry.values())
}

/** Get all registered preset IDs. */
export function getAllIds(): string[] {
  return Array.from(registry.keys())
}

/** Get all presets of a specific mode. */
export function getByMode(mode: ThemeMode): PresetDefinition[] {
  return Array.from(registry.values()).filter((p) => p.mode === mode)
}

/** Get the paired preset for dark/light toggle. */
export function getPair(id: ThemePreset): PresetDefinition | undefined {
  const preset = registry.get(id)
  if (!preset?.pair) return undefined
  return registry.get(preset.pair)
}

/** Get dark preset for a light preset, or vice versa. */
export function getOppositeMode(id: ThemePreset): PresetDefinition | undefined {
  const current = registry.get(id)
  if (!current) return undefined
  const pair = current.pair ? registry.get(current.pair) : undefined
  if (pair) return pair

  // Fallback: find any preset of the opposite mode
  const oppositeMode: ThemeMode = current.mode === 'dark' ? 'light' : 'dark'
  const opposites = getByMode(oppositeMode)
  return opposites[0]
}

/** Check if a preset is registered. */
export function hasPreset(id: ThemePreset): boolean {
  return registry.has(id)
}

/** Total number of registered presets. */
export function getPresetCount(): number {
  return registry.size
}

// ─── Bulk Registration ───────────────────────────────────────────

/**
 * Register multiple presets at once.
 * Useful for initial setup.
 */
export function registerPresets(presets: PresetDefinition[]): void {
  for (const preset of presets) {
    registerPreset(preset)
  }
}

/**
 * Clear all registered presets.
 * Primarily for testing.
 */
export function clearRegistry(): void {
  registry.clear()
}
