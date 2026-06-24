'use client'

import { useMemo } from 'react'
import { Terminal, Search, Sparkles, ArrowRight, Box } from 'lucide-react'
import type { LayoutRecipe, LayoutAdviceInput, LayoutRecommendation } from '@/lib/layout/types'
import { GOALS, PROMPT_EXAMPLES } from '@/lib/layout/types'
import { scoreLayout, scoreLayoutMulti, parsePrompt } from '@/lib/layout/scoring'
import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { WireframePreview } from './wireframe-preview'
import { useLayoutTheme } from '@/lib/layout/theme'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'
import { useCanvasPrompt } from './use-canvas-prompt'
import { useCommandPalette } from './use-command-palette'

function CanvasTopBar({ tokens, openPalette }: { tokens: any; openPalette: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${tokens.borderSubtle}60`, padding: `${spacing.md}px ${spacing.xl}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <Terminal style={{ width: 16, height: 16, color: tokens.accentPrimary }} />
        <span style={{ fontFamily: tokens.fontFamilyMono, fontSize: fontSize.md, fontWeight: fontWeight.bold }}>stsgs://layout-advisor</span>
      </div>
      <button onClick={openPalette} aria-label="Command palette" style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.lg, border: `1px solid ${tokens.borderDefault}`, color: tokens.textMuted, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody, background: 'transparent', cursor: 'pointer', minHeight: 44 }}>
        <Search style={{ width: 16, height: 16 }} />Command
        <kbd style={{ padding: '2px 6px', background: tokens.bgSurface, fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, borderRadius: radius.sm }}>⌘K</kbd>
      </button>
    </div>
  )
}

function ContextRow({ label, value, color, tokens }: { label: string; value: string; color: string; tokens: any }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody }}>
      <span style={{ color: tokens.textMuted }}>{label}</span>
      <span style={{ fontWeight: fontWeight.semibold, color }}>{value}</span>
    </div>
  )
}

function CommandPalette({ tokens, prompt, setPrompt, parsed, setParsed, setSubmitted, closePalette }: { tokens: any; prompt: string; setPrompt: (v: string) => void; parsed: any; setParsed: (v: any) => void; setSubmitted: (v: boolean) => void; closePalette: () => void }) {
  const handleSubmit = () => {
    if (!prompt.trim()) return
    setParsed(parsePrompt(prompt))
    setSubmitted(true)
    closePalette()
  }
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh' }} onClick={closePalette}>
      <div style={{ width: 480, background: tokens.bgBase, border: `1px solid ${tokens.borderDefault}`, borderRadius: radius['2xl'], overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.base}px ${spacing.xl}px`, borderBottom: `1px solid ${tokens.borderSubtle}` }}>
          <Sparkles style={{ width: 20, height: 20, color: tokens.accentAI }} />
          <input autoFocus type="text" value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && prompt.trim()) handleSubmit(); if (e.key === 'Escape') closePalette() }}
            placeholder="Опишите что вы хотите построить..." style={{ flex: 1, background: 'transparent', fontSize: fontSize.lg, outline: 'none', color: tokens.textPrimary, fontFamily: tokens.fontFamilyBody }} />
          <button onClick={handleSubmit} style={{ padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radius.lg, background: tokens.accentPrimary, color: tokens.textOnAccent, fontWeight: fontWeight.bold, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody, border: 'none', cursor: 'pointer', minHeight: 44 }}>Go</button>
        </div>
        <div style={{ padding: `${spacing.md}px ${spacing.xl}px`, maxHeight: 256, overflowY: 'auto' }}>
          <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Suggestions</div>
          {PROMPT_EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => {
              setPrompt(ex);
              setParsed(parsePrompt(ex));
              setSubmitted(true);
              closePalette();
            } } style={{ width: '100%', textAlign: 'left', padding: `${spacing.sm}px ${spacing.md}px`, fontSize: fontSize.md, fontFamily: tokens.fontFamilyBody, color: tokens.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, transition: 'background 0.15s', minHeight: 44 }}>
              <ArrowRight style={{ width: 12, height: 12, color: tokens.accentPrimary }} /> {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RankingsSidebar({ tokens, parsed, contextRows, ranked, best }: { tokens: any; parsed: any; contextRows: [string, string, string][]; ranked: LayoutRecommendation[]; best: LayoutRecommendation | null }) {
  return (
    <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${tokens.borderSubtle}60`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: `${spacing.base}px ${spacing.xl}px`, borderBottom: `1px solid ${tokens.borderSubtle}60` }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.md, fontFamily: tokens.fontFamilyMono }}>Context</div>
        {parsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {contextRows.map(([label, value, color]) => <ContextRow key={label} label={label} value={value} color={color} tokens={tokens} />)}
          </div>
        ) : <div style={{ fontSize: fontSize.base, fontFamily: tokens.fontFamilyMono, color: tokens.textDim, textAlign: 'center', padding: `${spacing.base}px 0` }}>Press ⌘K to start</div>}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: `${spacing.md}px ${spacing.xl}px` }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Rankings</div>
        {ranked.slice(0, 15).map((r, i) => (
          <div key={r.structure} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm}px ${spacing.md}px`, marginBottom: 2, borderRadius: radius.lg, background: r.structure === best?.structure ? `${tokens.accentPrimary}10` : 'transparent', border: r.structure === best?.structure ? `1px solid ${tokens.accentPrimary}20` : '1px solid transparent', cursor: 'pointer', transition: 'background 0.15s', minHeight: 44 }}>
            <span style={{ fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, width: 18, color: i < 3 ? tokens.accentPrimary : tokens.textDim }}>{i + 1}</span>
            <span style={{ fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: r.structure === best?.structure ? tokens.accentPrimary : tokens.textMuted, fontWeight: r.structure === best?.structure ? fontWeight.semibold : fontWeight.regular }}>{r.recipe.name}</span>
            <span style={{ fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, fontWeight: fontWeight.bold, color: r.score >= 70 ? tokens.accentPrimary : r.score >= 40 ? tokens.accentAI : '#ef4444' }}>{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CanvasContent({ tokens, submitted, best, top5 }: { tokens: any; submitted: boolean; best: LayoutRecommendation | null; top5: LayoutRecommendation[] }) {
  if (!submitted || !best) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: tokens.textDim }}>
        <Box style={{ width: 80, height: 80, marginBottom: spacing.xl, opacity: 0.15 }} />
        <p style={{ fontSize: fontSize.xl, fontWeight: fontWeight.light, fontFamily: tokens.fontFamilyBody }}>Press <kbd style={{ padding: `${spacing.xs}px ${spacing.md}px`, background: tokens.bgSurface, fontFamily: tokens.fontFamilyMono, fontSize: fontSize.xl, borderRadius: radius.md, color: tokens.textSecondary }}>⌘K</kbd> to begin</p>
        <p style={{ fontSize: fontSize.lg, marginTop: spacing.xs, fontFamily: tokens.fontFamilyBody, color: tokens.textDim }}>Describe what you want to build</p>
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
  const { prompt, setPrompt, parsed, setParsed, submitted, setSubmitted } = useCanvasPrompt()
  const { showPalette, openPalette, closePalette } = useCommandPalette()

  const input: LayoutAdviceInput = parsed
    ? { goal: parsed.goal, contentType: parsed.contentType, itemCount: parsed.itemCount, needsSidebar: parsed.needsSidebar, needsHeader: parsed.needsHeader, needsFooter: parsed.needsFooter }
    : { goal: 'landing', contentType: 'cards', itemCount: 6, needsHeader: true }

  const goalWeightsArc = parsed?.goalWeights ?? { [input.goal]: 1 }
  const isMultiGoalArc = Object.keys(goalWeightsArc).filter(g => goalWeightsArc[g] > 0).length > 1
  const ranked = useMemo(() => {
    if (isMultiGoalArc && parsed) return recipes.map(r => scoreLayoutMulti(r, input, goalWeightsArc)).sort((a, b) => b.score - a.score) as LayoutRecommendation[]
    return recipes.map(r => scoreLayout(r, input)).sort((a, b) => b.score - a.score)
  }, [recipes, input, isMultiGoalArc, parsed, goalWeightsArc])
  const best = ranked[0] ?? null
  const top5 = ranked.filter(r => r.verdict === 'recommended').slice(0, 5)
  const goalMeta = GOALS.find(g => g.value === input.goal)
  const contextRows = parsed ? [
    ['Goal', parsed.goal, goalMeta?.color ?? tokens.accentPrimary], ['Content', parsed.contentType, tokens.textSecondary],
    ['Items', String(parsed.itemCount), tokens.textSecondary], ['Sidebar', parsed.needsSidebar ? 'Yes' : 'No', parsed.needsSidebar ? tokens.accentPrimary : tokens.textDim],
    ['Header', parsed.needsHeader ? 'Yes' : 'No', parsed.needsHeader ? tokens.accentPrimary : tokens.textDim],
    ['Footer', parsed.needsFooter ? 'Yes' : 'No', parsed.needsFooter ? tokens.accentPrimary : tokens.textDim],
  ] : []

  return (
    <div style={{ minHeight: '100vh', background: tokens.bgDeep, color: tokens.textPrimary, display: 'flex', flexDirection: 'column', transition: 'background 0.3s, color 0.3s' }}>
      <CanvasTopBar tokens={tokens} openPalette={openPalette} />
      {showPalette && <CommandPalette tokens={tokens} prompt={prompt} setPrompt={setPrompt} parsed={parsed} setParsed={setParsed} setSubmitted={setSubmitted} closePalette={closePalette} />}
      <div style={{ flex: 1, display: 'flex' }}>
        <RankingsSidebar tokens={tokens} parsed={parsed} contextRows={contextRows} ranked={ranked} best={best} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: spacing['2xl'], overflowY: 'auto' }}>
          <CanvasContent tokens={tokens} submitted={submitted} best={best} top5={top5} />
        </div>
      </div>
    </div>
  )
}