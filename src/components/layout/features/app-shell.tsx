'use client'

/**
 * App Shell — extracted from page.tsx (composition root).
 * Contains nav bar + variant switching logic.
 *
 * Heavy variant components are lazy-loaded (anti-monolith Rule 6).
 */

import { useState, lazy, Suspense } from 'react'
import { Wand2, LayoutGrid, Monitor, Loader2 } from 'lucide-react'
import type { LayoutRecipe } from '@/lib/layout/types'
import { recipes } from '@/lib/layout'
import { ThemePresetSelector } from '.'
import { useLayoutTheme } from '@/lib/layout/theme'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// Lazy imports — barrel re-exports via named export (Rule 6)
const VariantPromptStudio = lazy(() => import('.').then(m => ({ default: m.VariantPromptStudio })))
const VariantLayoutExplorer = lazy(() => import('.').then(m => ({ default: m.VariantLayoutExplorer })))
const VariantAICanvas = lazy(() => import('.').then(m => ({ default: m.VariantAICanvas })))

type Variant = 'studio' | 'explorer' | 'canvas'

const VARIANT_META: Record<Variant, { label: string; icon: typeof Wand2; desc: string }> = {
  studio: { label: 'Prompt Studio', icon: Wand2, desc: 'Minimal & focused' },
  explorer: { label: 'Layout Explorer', icon: LayoutGrid, desc: 'Browse all 51 layouts' },
  canvas: { label: 'AI Canvas', icon: Monitor, desc: 'Command palette' },
}

/** Minimal Suspense fallback using theme tokens */
function VariantSkeleton({ tokens }: { tokens: ReturnType<typeof useLayoutTheme>['tokens'] }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
      color: tokens.textMuted, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody,
    }}>
      <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
      Loading…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

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

      <Suspense fallback={<VariantSkeleton tokens={tokens} />}>
        {variant === 'studio' && <VariantPromptStudio recipes={recipes} />}
        {variant === 'explorer' && <VariantLayoutExplorer recipes={recipes} />}
        {variant === 'canvas' && <VariantAICanvas recipes={recipes} />}
      </Suspense>
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
