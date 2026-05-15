/**
 * Preset: Sand Light — warm sand, #C4551A burnt orange.
 * Inter body, JetBrains Mono, medium rounded (8px).
 */

import { registerPreset } from '../theme-registry'
import type { PresetDefinition } from '../theme-types'

const definition: PresetDefinition = {
  id: 'sand-light',
  label: 'Sand Light',
  description: 'Warm sand + burnt orange',
  accent: '#C4551A',
  bg: '#FBF7F0',
  mode: 'light',
  pair: 'ember',
  tokens: {
    bgDeep: '#FBF7F0', bgBase: '#FFFDF8', bgSurface: '#F5EDE2', bgElevated: '#EBE0D0',
    textPrimary: '#1A1210', textSecondary: '#3D2E22', textMuted: '#7A6555', textDim: '#A89080',
    borderSubtle: '#F0E6D8', borderDefault: '#E0D0BC', borderBright: 'rgba(196,85,26,0.3)',
    accentPrimary: '#C4551A', accentAI: '#B08D57', accentGlow: '#C4551A14', accentAIGlow: '#B08D5714',
    sidebarBg: '#F8F2E8', sidebarText: '#1A1210', sidebarMuted: '#7A6555', sidebarHover: '#F0E6D8', sidebarBorder: '#E8D8C4',
    codeBg: '#1A1210', codeText: '#E8D8C4', codeMuted: '#7A6555', codeAccent: '#C4551A',
    cardBorder: '#E8D8C4', cardSelected: '#C4551A', cardHover: '#F5EDE2',
    cellBg: '#F0E6D8', cellFeaturedBg: '#C4551A10', cellText: '#A89080', cellFeaturedText: '#C4551A',
    textOnAccent: '#FFFDF8', bgOnAccent: '#1A1210',
    cardShadow: '0 4px 24px rgba(0,0,0,0.06)',
    fontFamilyBody: "'Inter', -apple-system, sans-serif",
    fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono','SF Mono',monospace",
    fontWeightBody: 400, cornerRadius: 8,
  },
}

registerPreset(definition)

export default definition
