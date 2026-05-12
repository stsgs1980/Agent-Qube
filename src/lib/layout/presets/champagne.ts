/**
 * Preset: Champagne — dark premium, gold #C8A97E accent.
 * Playfair Display serif + JetBrains Mono, sharp 2px, weight 300.
 * Best for: SaaS premium, fintech, luxury, editorial.
 */

import { registerPreset } from '../theme-registry'
import type { PresetDefinition } from '../theme-types'

const champagne: PresetDefinition = {
  id: 'champagne',
  label: 'Champagne',
  description: 'Premium gold + Playfair serif',
  mode: 'dark',
  pair: 'champagne-light',
  accent: '#C8A97E',
  bg: '#0B0B0F',
  bestFor: ['saas', 'fintech', 'portfolio', 'landing'],
  mood: ['premium', 'luxury', 'elegant', 'editorial'],
  tokens: {
    bgDeep: '#0B0B0F',
    bgBase: '#111114',
    bgSurface: '#16161A',
    bgElevated: '#1E1E23',

    textPrimary: '#EDEDEF',
    textSecondary: '#C8C8CC',
    textMuted: '#82828E',
    textDim: '#8A8A96',

    focusRing: '#C8A97E',

    borderSubtle: 'rgba(255,255,255,0.08)',
    borderDefault: 'rgba(255,255,255,0.1)',
    borderBright: 'rgba(200,169,126,0.3)',

    accentPrimary: '#C8A97E',
    accentAI: '#9A8468',
    accentGlow: '#C8A97E14',
    accentAIGlow: '#9A846814',

    sidebarBg: '#0F0F13',
    sidebarText: '#EDEDEF',
    sidebarMuted: '#82828E',
    sidebarHover: '#16161A',
    sidebarBorder: 'rgba(200,169,126,0.08)',

    codeBg: '#0F0F13',
    codeText: '#B0B0B8',
    codeMuted: '#82828E',
    codeAccent: '#C8A97E',

    cardBorder: 'rgba(255,255,255,0.08)',
    cardSelected: '#C8A97E',
    cardHover: '#16161A',

    cellBg: '#16161A',
    cellFeaturedBg: '#C8A97E10',
    cellText: '#8A8A96',
    cellFeaturedText: '#C8A97E',

    textOnAccent: '#0B0B0F',
    bgOnAccent: '#EDEDEF',

    cardShadow: '0 4px 24px rgba(0,0,0,0.12)',

    fontFamilyBody: "'Inter', -apple-system, sans-serif",
    fontFamilyDisplay: "'Playfair Display', Georgia, serif",
    fontFamilyMono: "'JetBrains Mono','SF Mono',monospace",
    fontWeightBody: 300,
    cornerRadius: 2,
  },
}

registerPreset(champagne)

export { champagne }
