/**
 * Dark theme preset definitions — Zinc, Champagne, Cyan Night.
 * Extracted from presets.ts for single-responsibility.
 */

import { darkTokens } from './tokens'
import type { ThemeTokens } from './theme'

// ─── Preset: Zinc (classic dark) ────────────────────────────

export const zincPreset: ThemeTokens = {
  ...darkTokens,

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
  cellText: '#71717a',
  cellFeaturedText: '#34d399',

  textOnAccent: '#0A0A0F',
  bgOnAccent: '#fafafa',

  cardShadow: '0 4px 24px rgba(0,0,0,0.08)',

  fontFamilyBody: "'Inter', -apple-system, sans-serif",
  fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
  fontFamilyMono: "'SF Mono','Fira Code',monospace",
  fontWeightBody: 400,
  cornerRadius: 12,
}

// ─── Preset: Champagne (dark premium, #C8A97E gold) ──────────

export const champagnePreset: ThemeTokens = {
  bgDeep: '#0B0B0F',
  bgBase: '#111114',
  bgSurface: '#16161A',
  bgElevated: '#1E1E23',

  textPrimary: '#EDEDEF',
  textSecondary: '#C8C8CC',
  textMuted: '#72727E',
  textDim: '#55555E',

  borderSubtle: 'rgba(255,255,255,0.08)',
  borderDefault: 'rgba(255,255,255,0.1)',
  borderBright: 'rgba(200,169,126,0.3)',

  accentPrimary: '#C8A97E',
  accentAI: '#9A8468',
  accentGlow: '#C8A97E14',
  accentAIGlow: '#9A846814',

  sidebarBg: '#0F0F13',
  sidebarText: '#EDEDEF',
  sidebarMuted: '#72727E',
  sidebarHover: '#16161A',
  sidebarBorder: 'rgba(200,169,126,0.08)',

  codeBg: '#0F0F13',
  codeText: '#B0B0B8',
  codeMuted: '#72727E',
  codeAccent: '#C8A97E',

  cardBorder: 'rgba(255,255,255,0.08)',
  cardSelected: '#C8A97E',
  cardHover: '#16161A',

  cellBg: '#16161A',
  cellFeaturedBg: '#C8A97E10',
  cellText: '#55555E',
  cellFeaturedText: '#C8A97E',

  textOnAccent: '#0B0B0F',
  bgOnAccent: '#EDEDEF',

  cardShadow: '0 4px 24px rgba(0,0,0,0.12)',

  fontFamilyBody: "'Inter', -apple-system, sans-serif",
  fontFamilyDisplay: "'Playfair Display', Georgia, serif",
  fontFamilyMono: "'JetBrains Mono','SF Mono',monospace",
  fontWeightBody: 300,
  cornerRadius: 2,
}

// ─── Preset: Cyan Night (dark, #00E5FF) ─────────────────────

export const cyanNightPreset: ThemeTokens = {
  bgDeep: '#080810',
  bgBase: '#0C0F1A',
  bgSurface: '#161B2E',
  bgElevated: '#1E2540',

  textPrimary: '#FFFFFF',
  textSecondary: '#E2E8F0',
  textMuted: '#94A3B8',
  textDim: '#64748B',

  borderSubtle: 'rgba(255,255,255,0.08)',
  borderDefault: 'rgba(255,255,255,0.1)',
  borderBright: 'rgba(255,255,255,0.2)',

  accentPrimary: '#00E5FF',
  accentAI: '#FF6D00',
  accentGlow: '#00E5FF14',
  accentAIGlow: '#FF6D0014',

  sidebarBg: '#0C0F1A',
  sidebarText: '#E2E8F0',
  sidebarMuted: '#64748B',
  sidebarHover: '#161B2E',
  sidebarBorder: 'rgba(0,229,255,0.1)',

  codeBg: '#0C0F1A',
  codeText: '#E2E8F0',
  codeMuted: '#94A3B8',
  codeAccent: '#00E5FF',

  cardBorder: 'rgba(255,255,255,0.1)',
  cardSelected: '#00E5FF',
  cardHover: '#161B2E',

  cellBg: '#161B2E80',
  cellFeaturedBg: '#00E5FF12',
  cellText: '#64748B',
  cellFeaturedText: '#00E5FF',

  textOnAccent: '#080810',
  bgOnAccent: '#FFFFFF',

  cardShadow: '0 4px 24px rgba(0,229,255,0.06)',

  fontFamilyBody: "'Inter', -apple-system, sans-serif",
  fontFamilyDisplay: "'Inter', -apple-system, sans-serif",
  fontFamilyMono: "'JetBrains Mono','Fira Code',monospace",
  fontWeightBody: 400,
  cornerRadius: 2,
}
