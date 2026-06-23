/**
 * Preset: Ember — dark warm, #FF6B35 coral/orange.
 * Inter body, JetBrains Mono, medium rounded (8px).
 */

import { registerPreset } from '../theme-registry'
import type { PresetDefinition } from '../theme-types'

const definition: PresetDefinition = {
  id: 'ember',
  label: 'Ember',
  description: 'Coral ember + warm creative',
  accent: '#FF6B35',
  bg: '#0F0908',
  mode: 'dark',
  pair: 'sand-light',
  tokens: {
    bgDeep: '#0F0908', bgBase: '#16100E', bgSurface: '#1E1714', bgElevated: '#2A1E19',
    textPrimary: '#F5EDE8', textSecondary: '#D4C4B8', textMuted: '#8C7568', textDim: '#6B5849',
    borderSubtle: 'rgba(255,107,53,0.08)', borderDefault: 'rgba(255,107,53,0.12)', borderBright: 'rgba(255,107,53,0.3)',
    accentPrimary: '#FF6B35', accentAI: '#FFB347', accentGlow: '#FF6B3514', accentAIGlow: '#FFB34714',
    sidebarBg: '#120D0B', sidebarText: '#F5EDE8', sidebarMuted: '#8C7568', sidebarHover: '#1E1714', sidebarBorder: 'rgba(255,107,53,0.08)',
    codeBg: '#120D0B', codeText: '#D4C4B8', codeMuted: '#8C7568', codeAccent: '#FF6B35',
    cardBorder: 'rgba(255,107,53,0.1)', cardSelected: '#FF6B35', cardHover: '#1E1714',
    cellBg: '#1E171480', cellFeaturedBg: '#FF6B3510', cellText: '#6B5849', cellFeaturedText: '#FF6B35',
    textOnAccent: '#0F0908', bgOnAccent: '#F5EDE8',
    cardShadow: '0 4px 24px rgba(255,107,53,0.08)',
    fontFamilyBody: "'Inter', -apple-system, sans-serif",
    fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono','SF Mono',monospace",
    fontWeightBody: 400, cornerRadius: 8,
  },
}

registerPreset(definition)

export default definition
