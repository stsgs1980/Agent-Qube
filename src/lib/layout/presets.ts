/**
 * Theme preset definitions — 5 presets (3 dark, 2 light).
 * Extracted from theme.tsx for single-responsibility.
 */

import { darkTokens, lightTokens } from './tokens'
import type { ThemeTokens, ThemeMode, ThemePreset } from './theme'

// ─── Preset: Zinc (classic dark) ────────────────────────────

const zincPreset: ThemeTokens = {
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

const champagnePreset: ThemeTokens = {
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

const cyanNightPreset: ThemeTokens = {
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

// ─── Preset: Champagne Light (warm cream + gold) ────────────

const champagneLightPreset: ThemeTokens = {
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

const cyanMorningPreset: ThemeTokens = {
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

// ─── Preset Metadata ─────────────────────────────────────────

export interface ThemePresetMeta {
  tokens: ThemeTokens
  label: string
  description: string
  accent: string
  bg: string
  mode: ThemeMode
  pair?: ThemePreset
}

export const themePresets: Record<ThemePreset, ThemePresetMeta> = {
  champagne: {
    tokens: champagnePreset,
    label: 'Champagne',
    description: 'Premium gold + Playfair serif',
    accent: '#C8A97E',
    bg: '#0B0B0F',
    mode: 'dark',
    pair: 'champagne-light',
  },
  'cyan-night': {
    tokens: cyanNightPreset,
    label: 'Cyan Night',
    description: '#00E5FF cyan + sharp edges',
    accent: '#00E5FF',
    bg: '#080810',
    mode: 'dark',
    pair: 'cyan-morning',
  },
  zinc: {
    tokens: zincPreset,
    label: 'Zinc',
    description: 'Monochrome + emerald + amber',
    accent: '#10B981',
    bg: '#0A0A0F',
    mode: 'dark',
  },
  'champagne-light': {
    tokens: champagneLightPreset,
    label: 'Champagne Light',
    description: 'Warm cream + gold + Playfair',
    accent: '#B08D57',
    bg: '#FAF8F5',
    mode: 'light',
    pair: 'champagne',
  },
  'cyan-morning': {
    tokens: cyanMorningPreset,
    label: 'Cyan Morning',
    description: 'Cool white + cyan + sharp',
    accent: '#0891B2',
    bg: '#F0F9FF',
    mode: 'light',
    pair: 'cyan-night',
  },
}

// ─── Preset pairs for dark/light toggle ─────────────────────

export const DARK_TO_LIGHT: Partial<Record<ThemePreset, ThemePreset>> = {
  champagne: 'champagne-light',
  'cyan-night': 'cyan-morning',
  zinc: 'champagne-light',
}

export const LIGHT_TO_DARK: Partial<Record<ThemePreset, ThemePreset>> = {
  'champagne-light': 'champagne',
  'cyan-morning': 'cyan-night',
}
