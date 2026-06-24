'use client'

import { useState, useEffect } from 'react'
import { Terminal, Search, Sparkles, ArrowRight, Box } from 'lucide-react'
import type { LayoutRecipe } from '@/lib/layout/types'
import { GOALS, PROMPT_EXAMPLES } from '@/lib/layout/types'
import { useCanvasPrompt } from '@/lib/layout/use-canvas-prompt'
import { GridPreview, ScoreGauge } from '../ui'
import { WireframePreview } from '.'
import { useLayoutTheme } from '@/lib/layout/theme'
import { colors, radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

function FeatureTopBar({ tokens, setShowPalette }: { tokens: any; setShowPalette: (v: boolean) => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${tokens.borderSubtle}60`, padding: `${spacing.md}px ${spacing.xl}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <Terminal style={{ width: 16, height: 16, color: tokens.accentPrimary }} />
        <span style={{ fontFamily: tokens.fontFamilyMono, fontSize: fontSize.md, fontWeight: fontWeight.bold }}>stsgs://layout-advisor</span>
      </div>
      <button onClick={() => setShowPalette(true)} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.lg, border: `1px solid ${tokens.borderDefault}`, color: tokens.textMuted, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody, background: 'transparent', cursor: 'pointer' }}>
        <Search style={{ width: 16, height: 16 }} />Command
        <kbd style={{ padding: '2px 6px', background: tokens.bgSurface, fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, borderRadius: radius.sm }}>⌘K</kbd>
      </button>
    </div>
  )
}

function FeaturePalette({ tokens, state, actions, setShowPalette }: { tokens: any; state: any; actions: any; setShowPalette: (v: boolean) => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh' }} onClick={() => setShowPalette(false)}>
      <div style={{ width: 480, background: tokens.bgBase, border: `1px solid ${tokens.borderDefault}`, borderRadius: radius['2xl'], overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.base}px ${spacing.xl}px`, borderBottom: `1px solid ${tokens.borderSubtle}` }}>
          <Sparkles style={{ width: 20, height: 20, color: tokens.accentAI }} />
          <input autoFocus type="text" value={state.prompt} onChange={e => actions.setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && state.prompt.trim()) {
                actions.submitCurrent()
                setShowPalette(false)
              }
              if (e.key === 'Escape') setShowPalette(false)
            }}
            placeholder="Describe what you want to build..." style={{ flex: 1, background: 'transparent', fontSize: fontSize.lg, outline: 'none', color: tokens.textPrimary, fontFamily: tokens.fontFamilyBody }} />
          <button onClick={() => { if (state.prompt.trim()) {
              actions.submitCurrent()
              setShowPalette(false)
            } }} style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.lg, background: tokens.accentPrimary, color: tokens.textOnAccent, fontWeight: fontWeight.bold, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody, border: 'none', cursor: 'pointer' }}>Go</button>
        </div>
        <div style={{ padding: `${spacing.md}px ${spacing.xl}px`, maxHeight: 256, overflowY: 'auto' }}>
          <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Suggestions</div>
          {PROMPT_EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { actions.submitFromPalette(ex); setShowPalette(false) }} style={{ width: '100%', textAlign: 'left', padding: `${spacing.sm}px ${spacing.md}px`, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody, color: tokens.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, transition: 'background 0.15s' }}>
              <ArrowRight style={{ width: 12, height: 12, color: tokens.accentPrimary }} /> {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureContextSidebar({ tokens, state, goalMeta, ranked, best }: { tokens: any; state: any; goalMeta: any; ranked: any[]; best: any }) {
  return (
    <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${tokens.borderSubtle}60`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: `${spacing.base}px ${spacing.xl}px`, borderBottom: `1px solid ${tokens.borderSubtle}60` }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.md, fontFamily: tokens.fontFamilyMono }}>Context</div>
        {state.parsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {[['Goal', state.parsed.goal, goalMeta?.color ?? tokens.accentPrimary], ['Content', state.parsed.contentType, tokens.textSecondary], ['Items', String(state.parsed.itemCount), tokens.textSecondary], ['Sidebar', state.parsed.needsSidebar ? 'Yes' : 'No', state.parsed.needsSidebar ? tokens.accentPrimary : tokens.textDim], ['Header', state.parsed.needsHeader ? 'Yes' : 'No', state.parsed.needsHeader ? tokens.accentPrimary : tokens.textDim], ['Footer', state.parsed.needsFooter ? 'Yes' : 'No', state.parsed.needsFooter ? tokens.accentPrimary : tokens.textDim]].map(([label, value, color]: [string, string, string]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody }}>
                <span style={{ color: tokens.textMuted }}>{label}</span>
                <span style={{ fontWeight: fontWeight.semibold, color }}>{value}</span>
              </div>
            ))}
          </div>
        ) : <div style={{ fontSize: fontSize.base, fontFamily: tokens.fontFamilyMono, color: tokens.textDim, textAlign: 'center', padding: `${spacing.base}px 0` }}>Press ⌘K to start</div>}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: `${spacing.md}px ${spacing.xl}px` }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Rankings</div>
        {ranked.slice(0, 15).map((r, i) => (
          <div key={r.structure} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm}px ${spacing.md}px`, marginBottom: 2, borderRadius: radius.lg, background: r.structure === best?.structure ? `${tokens.accentPrimary}10` : 'transparent', border: r.structure === best?.structure ? `1px solid ${tokens.accentPrimary}20` : '1px solid transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
            <span style={{ fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, width: 18, color: i < 3 ? tokens.accentPrimary : tokens.textDim }}>{i + 1}</span>
            <span style={{ fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: r.structure === best?.structure ? tokens.accentPrimary : tokens.textMuted, fontWeight: r.structure === best?.structure ? fontWeight.semibold : fontWeight.regular }}>{r.recipe.name}</span>
            <span style={{ fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, fontWeight: fontWeight.bold, color: r.score >= 70 ? tokens.accentPrimary : r.score >= 40 ? tokens.accentAI : '#ef4444' }}>{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureMainContent({ tokens, state, best, top5 }: { tokens: any; state: any; best: any; top5: any[] }) {
  if (!state.submitted || !best) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: tokens.textDim }}>
        <Box style={{ width: 80, height: 80, marginBottom: spacing.xl, opacity: 0.15 }} />
        <p style={{ fontSize: fontSize.xl, fontWeight: fontWeight.light, fontFamily: tokens.fontFamilyBody }}>Press <kbd style={{ padding: `${spacing.xs}px ${spacing.md}px`, background: tokens.bgSurface, fontFamily: tokens.fontFamilyMono, fontSize: fontSize.xl, borderRadius: radius.md, color: tokens.textSecondary }}>⌘K</kbd> to begin</p>
      </div>
    )
  }
  return (
    <>
      <div style={{ width: '100%', maxWidth: 768, marginBottom: spacing.xl }}><WireframePreview recipe={best.recipe} score={best.score} /></div>
      <div style={{ width: '100%', maxWidth: 768 }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.md, fontFamily: tokens.fontFamilyMono }}>Top Recommendations</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: spacing.md }}>
          {top5.filter(r => r.structure !== best.structure).map(r => (
            <div key={r.structure} style={{ border: `1px solid ${tokens.borderSubtle}`, background: tokens.bgBase, borderRadius: radius['2xl'], overflow: 'hidden' }}>
              <GridPreview recipe={r.recipe} compact />
              <div style={{ padding: `${spacing.md}px ${spacing.base}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyBody, color: tokens.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.recipe.name}</span>
                <span style={{ fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, fontWeight: fontWeight.bold, color: r.score >= 70 ? tokens.accentPrimary : tokens.accentAI }}>{r.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function VariantAICanvas({ recipes }: { recipes: LayoutRecipe[] }) {
  const { tokens } = useLayoutTheme()
  const { state, actions, input, ranked, best, top5 } = useCanvasPrompt(recipes)
  const [showPalette, setShowPalette] = useState(false)
  const goalMeta = GOALS.find(g => g.value === input.goal)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowPalette(true)
      }
      if (e.key === 'Escape') setShowPalette(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: tokens.bgDeep, color: tokens.textPrimary, display: 'flex', flexDirection: 'column', transition: 'background 0.3s, color 0.3s' }}>
      <FeatureTopBar tokens={tokens} setShowPalette={setShowPalette} />
      {showPalette && <FeaturePalette tokens={tokens} state={state} actions={actions} setShowPalette={setShowPalette} />}
      <div style={{ flex: 1, display: 'flex' }}>
        <FeatureContextSidebar tokens={tokens} state={state} goalMeta={goalMeta} ranked={ranked} best={best} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: spacing['2xl'], overflowY: 'auto' }}>
          <FeatureMainContent tokens={tokens} state={state} best={best} top5={top5} />
        </div>
      </div>
    </div>
  )
}