'use client'

/**
 * App Shell — extracted from page.tsx (composition root).
 * Contains nav bar + variant switching logic.
 */

import { useState } from 'react'
import { Wand2, LayoutGrid, Monitor } from 'lucide-react'
import type { LayoutRecipe } from '@/lib/layout/types'
import recipesData from '@/data/recipes.json'
import { VariantPromptStudio } from '@/components/layout/prompt-studio'
import { VariantLayoutExplorer } from '@/components/layout/layout-explorer'
import { VariantAICanvas } from '@/components/layout/ai-canvas'
import { useLayoutTheme } from '@/lib/layout/theme'
import { ThemePresetSelector } from '@/components/layout/theme-preset-selector'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

type Variant = 'studio' | 'explorer' | 'canvas'

const VARIANT_META: Record<Variant, { label: string; icon: typeof Wand2; desc: string }> = {
  studio: { label: 'Prompt Studio', icon: Wand2, desc: 'Minimal & focused' },
  explorer: { label: 'Layout Explorer', icon: LayoutGrid, desc: 'Browse all 51 layouts' },
  canvas: { label: 'AI Canvas', icon: Monitor, desc: 'Command palette' },
}

const recipes = recipesData as LayoutRecipe[]

export function AppShell() {
  const [variant, setVariant] = useState<Variant>('explorer')
  const { tokens } = useLayoutTheme()

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: tokens.bgDeep, color: tokens.textPrimary,
      transition: 'background 0.3s, color 0.3s',
    }}>
      {/* Nav */}
      <nav style={{
        borderBottom: `1px solid ${tokens.borderSubtle}`,
        background: tokens.bgBase,
        position: 'sticky', top: 0, zIndex: 20,
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          padding: '14px 32px',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <Brand tokens={tokens} />
          <span style={{ color: tokens.borderBright, fontSize: fontSize.base }}>/</span>
          <VariantTabs variant={variant} setVariant={setVariant} tokens={tokens} />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <ThemePresetSelector />
            <RecipeBadge tokens={tokens} />
          </div>
        </div>
      </nav>

      {variant === 'studio' && <VariantPromptStudio recipes={recipes} />}
      {variant === 'explorer' && <VariantLayoutExplorer recipes={recipes} />}
      {variant === 'canvas' && <VariantAICanvas recipes={recipes} />}
    </div>
  )
}

function Brand({ tokens }: { tokens: ReturnType<typeof useLayoutTheme>['tokens'] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <div style={{
        width: 34, height: 34, borderRadius: tokens.cornerRadius,
        background: tokens.accentPrimary, color: tokens.textOnAccent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: fontWeight.black, fontFamily: tokens.fontFamilyDisplay,
      }}>S</div>
      <span style={{ fontWeight: fontWeight.bold, fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody, color: tokens.textMuted }}>@stsgs/ui</span>
    </div>
  )
}

function VariantTabs({ variant, setVariant, tokens }: {
  variant: Variant; setVariant: (v: Variant) => void
  tokens: ReturnType<typeof useLayoutTheme>['tokens']
}) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {(Object.entries(VARIANT_META) as [Variant, typeof VARIANT_META[Variant]][]).map(([key, meta]) => {
        const Icon = meta.icon
        const active = variant === key
        return (
          <button key={key} onClick={() => setVariant(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px',
              borderRadius: tokens.cornerRadius,
              fontSize: fontSize.md, fontWeight: fontWeight.medium,
              background: active ? tokens.bgOnAccent : 'transparent',
              color: active ? tokens.textOnAccent : tokens.textMuted,
              border: 'none', cursor: 'pointer',
              fontFamily: tokens.fontFamilyBody,
              transition: 'all 0.15s',
            }}>
            <Icon style={{ width: 16, height: 16 }} />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}

function RecipeBadge({ tokens }: { tokens: ReturnType<typeof useLayoutTheme>['tokens'] }) {
  return (
    <span style={{
      fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: tokens.textDim,
      background: tokens.bgBase,
      padding: '6px 14px',
      borderRadius: tokens.cornerRadius,
      border: `1px solid ${tokens.borderSubtle}`,
      fontFamily: tokens.fontFamilyBody,
    }}>
      51 recipes
    </span>
  )
}
