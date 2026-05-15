/**
 * Preset: Champagne Light — warm cream + dark gold.
 * Playfair Display serif + JetBrains Mono, sharp 2px, weight 300.
 * Best for: editorial, premium light, blog, portfolio.
 */

import { registerPreset } from '../theme-registry'
import type { PresetDefinition } from '../theme-types'

const champagneLight: PresetDefinition = {
  id: 'champagne-light',
  label: 'Champagne Light',
  description: 'Warm cream + gold + Playfair',
  mode: 'light',
  pair: 'champagne',
  accent: '#856930',
  bg: '#FAF8F5',
  bestFor: ['blog', 'portfolio', 'editorial', 'landing'],
  mood: ['premium', 'elegant', 'warm', 'editorial'],
  tokens: {
    bgDeep: '#FAF8F5',
    bgBase: '#FFFEFB',
    bgSurface: '#F5F0E8',
    bgElevated: '#EBE4D6',

    textPrimary: '#1A1814',
    textSecondary: '#3D3830',
    textMuted: '#7A7164',
    textDim: '#746956',

    focusRing: '#856930',

    borderSubtle: '#E8E0D4',
    borderDefault: '#D4C9B8',
    borderBright: 'rgba(200,169,126,0.4)',

    accentPrimary: '#856930',
    accentAI: '#9A8468',
    accentGlow: '#B08D5714',
    accentAIGlow: '#9A846814',

    sidebarBg: '#F8F4ED',
    sidebarText: '#1A1814',
    sidebarMuted: '#706758',
    sidebarHover: '#F0EAE0',
    sidebarBorder: '#E0D6C6',

    codeBg: '#1A1814',
    codeText: '#E8E0D4',
    codeMuted: '#9A9080',
    codeAccent: '#B08D57',

    cardBorder: '#E8E0D4',
    cardSelected: '#B08D57',
    cardHover: '#F5F0E8',

    cellBg: '#F0EAE0',
    cellFeaturedBg: '#B08D5710',
    cellText: '#746956',
    cellFeaturedText: '#856930',

    textOnAccent: '#FFFEFB',
    bgOnAccent: '#1A1814',

    cardShadow: '0 4px 24px rgba(0,0,0,0.06)',

    fontFamilyBody: "'Inter', -apple-system, sans-serif",
    fontFamilyDisplay: "'Playfair Display', Georgia, serif",
    fontFamilyMono: "'JetBrains Mono','SF Mono',monospace",
    fontWeightBody: 300,
    cornerRadius: 2,
  },
}

registerPreset(champagneLight)

export { champagneLight }
