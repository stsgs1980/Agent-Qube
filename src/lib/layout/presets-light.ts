/**
 * Light theme preset definitions — Champagne Light, Cyan Morning.
 * Extracted from presets.ts for single-responsibility.
 */

import type { ThemeTokens } from './theme'

// ─── Preset: Champagne Light (warm cream + gold) ────────────

export const champagneLightPreset: ThemeTokens = {
  bgDeep: '#FAF8F5',
  bgBase: '#FFFEFB',
  bgSurface: '#F5F0E8',
  bgElevated: '#EBE4D6',

  textPrimary: '#1A1814',
  textSecondary: '#3D3830',
  textMuted: '#7A7164',
  textDim: '#A69E90',

  borderSubtle: '#E8E0D4',
  borderDefault: '#D4C9B8',
  borderBright: 'rgba(200,169,126,0.4)',

  accentPrimary: '#B08D57',
  accentAI: '#9A8468',
  accentGlow: '#B08D5714',
  accentAIGlow: '#9A846814',

  sidebarBg: '#F8F4ED',
  sidebarText: '#1A1814',
  sidebarMuted: '#7A7164',
  sidebarHover: '#F0EAE0',
  sidebarBorder: '#E0D6C6',

  codeBg: '#1A1814',
  codeText: '#E8E0D4',
  codeMuted: '#7A7164',
  codeAccent: '#B08D57',

  cardBorder: '#E8E0D4',
  cardSelected: '#B08D57',
  cardHover: '#F5F0E8',

  cellBg: '#F0EAE0',
  cellFeaturedBg: '#B08D5710',
  cellText: '#A69E90',
  cellFeaturedText: '#B08D57',

  textOnAccent: '#FFFEFB',
  bgOnAccent: '#1A1814',

  cardShadow: '0 4px 24px rgba(0,0,0,0.06)',

  fontFamilyBody: "'Inter', -apple-system, sans-serif",
  fontFamilyDisplay: "'Playfair Display', Georgia, serif",
  fontFamilyMono: "'JetBrains Mono','SF Mono',monospace",
  fontWeightBody: 300,
  cornerRadius: 2,
}

// ─── Preset: Cyan Morning (cool white + cyan) ───────────────

export const cyanMorningPreset: ThemeTokens = {
  bgDeep: '#F0F9FF',
  bgBase: '#FFFFFF',
  bgSurface: '#E0F2FE',
  bgElevated: '#BAE6FD',

  textPrimary: '#0C1222',
  textSecondary: '#1E293B',
  textMuted: '#64748B',
  textDim: '#94A3B8',

  borderSubtle: '#E0F2FE',
  borderDefault: '#BAE6FD',
  borderBright: 'rgba(8,145,178,0.3)',

  accentPrimary: '#0891B2',
  accentAI: '#FF6D00',
  accentGlow: '#0891B214',
  accentAIGlow: '#FF6D0014',

  sidebarBg: '#F0F9FF',
  sidebarText: '#0C1222',
  sidebarMuted: '#64748B',
  sidebarHover: '#E0F2FE',
  sidebarBorder: '#BAE6FD',

  codeBg: '#0C1222',
  codeText: '#E2E8F0',
  codeMuted: '#64748B',
  codeAccent: '#0891B2',

  cardBorder: '#BAE6FD',
  cardSelected: '#0891B2',
  cardHover: '#E0F2FE',

  cellBg: '#E0F2FE',
  cellFeaturedBg: '#0891B210',
  cellText: '#94A3B8',
  cellFeaturedText: '#0891B2',

  textOnAccent: '#FFFFFF',
  bgOnAccent: '#0C1222',

  cardShadow: '0 4px 24px rgba(8,145,178,0.06)',

  fontFamilyBody: "'Inter', -apple-system, sans-serif",
  fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
  fontFamilyMono: "'JetBrains Mono','Fira Code',monospace",
  fontWeightBody: 400,
  cornerRadius: 2,
}
