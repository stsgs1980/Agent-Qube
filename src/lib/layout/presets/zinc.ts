/**
 * Preset: Zinc — dark, #10B981 emerald accent.
 * Inter + SF Mono, rounded 12px, weight 400.
 * Best for: admin, enterprise, CRM, neutral tools.
 */

import { registerPreset } from '../theme-registry'
import type { PresetDefinition } from '../theme-types'

const zinc: PresetDefinition = {
  id: 'zinc',
  label: 'Zinc',
  description: 'Monochrome + emerald + amber',
  mode: 'dark',
  accent: '#10B981',
  bg: '#0A0A0F',
  bestFor: ['crm', 'admin-panel', 'application', 'analytics'],
  mood: ['minimal', 'neutral', 'professional', 'enterprise'],
  tokens: {
    bgDeep: '#0A0A0F',
    bgBase: '#111114',
    bgSurface: '#16161A',
    bgElevated: '#1E1E23',

    textPrimary: '#fafafa',
    textSecondary: '#C8C8CC',
    textMuted: '#83838C',
    textDim: '#8A8A94',

    focusRing: '#34d399',

    borderSubtle: 'rgba(255,255,255,0.08)',
    borderDefault: 'rgba(255,255,255,0.1)',
    borderBright: 'rgba(255,255,255,0.2)',

    accentPrimary: '#10b981',
    accentAI: '#f59e0b',
    accentGlow: '#10b98114',
    accentAIGlow: '#f59e0b14',

    sidebarBg: '#1E293B',
    sidebarText: '#E2E8F0',
    sidebarMuted: '#94A3B8',
    sidebarHover: '#334155',
    sidebarBorder: 'rgba(255,255,255,0.08)',

    codeBg: '#0F172A',
    codeText: '#E2E8F0',
    codeMuted: '#94A3B8',
    codeAccent: '#60A5FA',

    cardBorder: '#27272a',
    cardSelected: '#10b981',
    cardHover: '#27272a',

    cellBg: '#27272a80',
    cellFeaturedBg: '#064e3b50',
    cellText: '#83838C',
    cellFeaturedText: '#34d399',

    textOnAccent: '#0A0A0F',
    bgOnAccent: '#fafafa',

    cardShadow: '0 4px 24px rgba(0,0,0,0.08)',

    fontFamilyBody: "'Inter', -apple-system, sans-serif",
    fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
    fontFamilyMono: "'SF Mono','Fira Code',monospace",
    fontWeightBody: 400,
    cornerRadius: 12,
  },
}

registerPreset(zinc)

export { zinc }
