/**
 * Preset: Cyan Morning — cool white + dark cyan.
 * Inter + JetBrains Mono, sharp 2px, weight 400.
 * Best for: documentation, tech light, SaaS, dashboards.
 */

import { registerPreset } from '../theme-registry'
import type { PresetDefinition } from '../theme-types'

const cyanMorning: PresetDefinition = {
  id: 'cyan-morning',
  label: 'Cyan Morning',
  description: 'Cool white + cyan + sharp',
  mode: 'light',
  pair: 'cyan-night',
  accent: '#0E7490',
  bg: '#F0F9FF',
  bestFor: ['documentation', 'saas', 'dashboard-app', 'analytics'],
  mood: ['tech', 'clean', 'fresh', 'professional'],
  tokens: {
    bgDeep: '#F0F9FF',
    bgBase: '#FFFFFF',
    bgSurface: '#E0F2FE',
    bgElevated: '#BAE6FD',

    textPrimary: '#0C1222',
    textSecondary: '#1E293B',
    textMuted: '#5F6D80',
    textDim: '#5E6B7D',

    focusRing: '#0E7490',

    borderSubtle: '#E0F2FE',
    borderDefault: '#BAE6FD',
    borderBright: 'rgba(8,145,178,0.3)',

    accentPrimary: '#0E7490',
    accentAI: '#FF6D00',
    accentGlow: '#0891B214',
    accentAIGlow: '#FF6D0014',

    sidebarBg: '#F0F9FF',
    sidebarText: '#0C1222',
    sidebarMuted: '#586577',
    sidebarHover: '#E0F2FE',
    sidebarBorder: '#BAE6FD',

    codeBg: '#0C1222',
    codeText: '#E2E8F0',
    codeMuted: '#8A99AB',
    codeAccent: '#0891B2',

    cardBorder: '#BAE6FD',
    cardSelected: '#0891B2',
    cardHover: '#E0F2FE',

    cellBg: '#E0F2FE',
    cellFeaturedBg: '#0891B210',
    cellText: '#5E6B7D',
    cellFeaturedText: '#0E7490',

    textOnAccent: '#FFFFFF',
    bgOnAccent: '#0C1222',

    cardShadow: '0 4px 24px rgba(8,145,178,0.06)',

    fontFamilyBody: "'Inter', -apple-system, sans-serif",
    fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
    fontFamilyMono: "'JetBrains Mono','Fira Code',monospace",
    fontWeightBody: 400,
    cornerRadius: 2,
  },
}

registerPreset(cyanMorning)

export { cyanMorning }
