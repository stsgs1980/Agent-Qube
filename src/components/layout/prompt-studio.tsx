'use client'

import { Layers } from 'lucide-react'
import type { LayoutRecipe, LayoutAdviceInput } from '@/lib/layout/types'
import { PROMPT_EXAMPLES, GOALS } from '@/lib/layout/types'
import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { PipelineNode } from './pipeline-node'
import { WireframePreview } from './wireframe-preview'
import { useLayoutTheme } from '@/lib/layout/theme'
import { useAiPrompt } from '@/lib/layout/use-ai-prompt'
import { useRankedRecipes } from './use-ranked-recipes'
import { PromptInput } from './prompt-input'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Variant: Prompt Studio ────────────────────────────────────

export function VariantPromptStudio({ recipes }: { recipes: LayoutRecipe[] }) {
  const { tokens } = useLayoutTheme()
  const { prompt, setPrompt, parsed, ai, handleSubmit, toggleAiMode } = useAiPrompt()

  const input: LayoutAdviceInput = parsed
    ? { goal: parsed.goal, contentType: parsed.contentType, itemCount: parsed.itemCount, needsSidebar: parsed.needsSidebar, needsHeader: parsed.needsHeader, needsFooter: parsed.needsFooter }
    : { goal: 'landing', contentType: 'cards', itemCount: 6, needsHeader: true }

  const goalWeights = parsed?.goalWeights ?? { [input.goal]: 1 }
  const isMultiGoal = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length > 1
  const ranked = useRankedRecipes(recipes, input, goalWeights, isMultiGoal)
  const best = ranked[0] ?? null
  const top3 = ranked.filter(r => r.verdict === 'recommended').slice(0, 3)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: spacing['3xl'], paddingBottom: spacing['4xl'], paddingInline: spacing.xl,
      background: tokens.bgDeep, color: tokens.textPrimary,
      transition: 'background 0.3s, color 0.3s',
    }}>
      <StudioHero tokens={tokens} />
      <PromptInput prompt={prompt} onPromptChange={setPrompt} onSubmit={handleSubmit} aiMode={ai.aiMode} aiLoading={ai.aiLoading} onToggleAiMode={toggleAiMode} />

      {!ai.submitted && <ExampleChips tokens={tokens} onSelect={(ex) => { setPrompt(ex); handleSubmit() }} />}
      {ai.submitted && parsed && <ParsePipeline tokens={tokens} prompt={prompt} parsed={parsed} ranked={ranked} goalWeights={goalWeights} isMultiGoal={isMultiGoal} ai={ai} />}
      {ai.submitted && best && <BestMatch tokens={tokens} best={best} top3={top3} />}
      {!ai.submitted && <EmptyState tokens={tokens} />}
    </div>
  )
}

// ─── Studio Hero ───────────────────────────────────────────────

function StudioHero({ tokens }: { tokens: Record<string, string> }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: spacing['3xl'], maxWidth: 640 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.full,
        background: `${tokens.accentAI}10`, border: `1px solid ${tokens.accentAI}20`,
        fontSize: fontSize.sm, color: tokens.accentAI, fontFamily: tokens.fontFamilyMono, marginBottom: 20,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: tokens.accentAI }} />
        AI-Powered Layout Advisor
      </div>
      <h1 style={{ fontSize: fontSize['3xl'], fontWeight: fontWeight.black, letterSpacing: '-1.2px', marginBottom: 14, lineHeight: 1.15, fontFamily: tokens.fontFamilyDisplay }}>
        Describe it.<br /><span style={{ color: tokens.accentPrimary }}>We&apos;ll layout it.</span>
      </h1>
      <p style={{ color: tokens.textMuted, fontSize: fontSize.lg, lineHeight: 1.7, maxWidth: 520, margin: '0 auto', fontFamily: tokens.fontFamilyBody }}>
        Type what you want to build. The system parses your intent, scores all 51 layout recipes, and picks the perfect one.
      </p>
    </div>
  )
}

// ─── Example Chips ─────────────────────────────────────────────

function ExampleChips({ tokens, onSelect }: { tokens: Record<string, string>; onSelect: (ex: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', maxWidth: 600, marginBottom: spacing['2xl'] }}>
      {PROMPT_EXAMPLES.slice(0, 5).map((ex, i) => (
        <button key={i} onClick={() => onSelect(ex)} aria-label={ex} style={{
          padding: `${spacing.xs}px ${spacing.md}px`, fontSize: fontSize.base, borderRadius: radius.xl,
          border: `1px solid ${tokens.borderDefault}`, color: tokens.textSecondary,
          background: 'transparent', cursor: 'pointer', fontFamily: tokens.fontFamilyBody, transition: 'all 0.15s', minHeight: 44,
        }}>{ex}</button>
      ))}
    </div>
  )
}

// ─── Empty State ───────────────────────────────────────────────

function EmptyState({ tokens }: { tokens: Record<string, string> }) {
  return (
    <div style={{ marginTop: spacing['3xl'], display: 'flex', flexDirection: 'column', alignItems: 'center', color: tokens.textDim }}>
      <Layers style={{ width: 64, height: 64, marginBottom: spacing.base, opacity: 0.3 }} />
      <p style={{ fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody }}>Type a prompt above to see the AI layout advisor in action</p>
    </div>
  )
}

// ─── Types for Parse Pipeline ──────────────────────────────────

interface ParsedData {
  goal: string; contentType: string; detected: string[]
  goalWeights?: Record<string, number>
}

interface AiData {
  aiConfidence: number | null; submitted: boolean; aiExplanation?: string
}

// ─── Parse Pipeline ────────────────────────────────────────────

function ParsePipeline({ tokens, prompt, parsed, ranked, goalWeights, isMultiGoal, ai }: {
  tokens: Record<string, string>; prompt: string; parsed: ParsedData; ranked: { verdict: string; structure: string }[]; goalWeights: Record<string, number>; isMultiGoal: boolean; ai: AiData
}) {
  const recommended = ranked.filter(r => r.verdict === 'recommended').length
  const bestStructure = ranked[0]?.structure ?? '...'
  return (
    <div style={{ width: '100%', maxWidth: 600, marginBottom: spacing['2xl'] }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: `${spacing.sm}px 0` }}>
        <PipelineNode label="Prompt" value={prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt} color={tokens.accentAI} active />
        <div style={{ flex: 1, margin: `0 ${spacing.sm}px`, borderTop: `1px dashed ${tokens.borderDefault}` }} />
        <PipelineNode label="Parse" value={`${parsed.goal}/${parsed.contentType}`} color={tokens.accentPrimary} active />
        <div style={{ flex: 1, margin: `0 ${spacing.sm}px`, borderTop: `1px dashed ${tokens.borderDefault}` }} />
        <PipelineNode label="Score" value={`${recommended} match`} color={tokens.textSecondary} active />
        <div style={{ flex: 1, margin: `0 ${spacing.sm}px`, borderTop: `1px dashed ${tokens.borderDefault}` }} />
        <PipelineNode label="Layout" value={bestStructure} color={tokens.accentPrimary} active />
      </div>
      {isMultiGoal && <MultiGoalBar tokens={tokens} goalWeights={goalWeights} />}
      <div style={{ textAlign: 'center', fontSize: fontSize.sm, color: tokens.textDim, marginTop: spacing.md, fontFamily: tokens.fontFamilyMono }}>Detected: {parsed.detected.join(' -> ')}</div>
      {ai.aiExplanation && <div style={{ marginTop: spacing.md, padding: spacing.md, background: `${tokens.accentAI}08`, border: `1px solid ${tokens.accentAI}15`, borderRadius: radius['2xl'], fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody }}><span style={{ fontWeight: fontWeight.bold, color: tokens.accentAI }}>AI: </span><span style={{ color: String(tokens.accentAI) + 'bb' }}>{ai.aiExplanation}</span></div>}
    </div>
  )
}

// ─── Multi-Goal Composition Bar ────────────────────────────────

function MultiGoalBar({ tokens, goalWeights }: { tokens: Record<string, string>; goalWeights: Record<string, number> }) {
  return (
    <div style={{ marginTop: spacing.md, padding: spacing.md, background: tokens.bgBase, border: `1px solid ${tokens.borderSubtle}`, borderRadius: radius['2xl'] }}>
      <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Multi-Goal Composition</div>
      <div style={{ display: 'flex', height: 24, borderRadius: radius.lg, overflow: 'hidden' }}>
        {Object.entries(goalWeights).filter(([, w]) => w > 0).sort(([, a], [, b]) => b - a).map(([g, w]) => {
          const m = GOALS.find(gm => gm.value === g)
          return <div key={g} style={{ width: `${w * 100}%`, backgroundColor: m?.color ?? tokens.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: fontSize.xs, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, minWidth: 40, transition: 'width 0.5s' }}>{m?.label ?? g} {Math.round(w * 100)}%</div>
        })}
      </div>
    </div>
  )
}

// ─── Best Match + Also Recommended ─────────────────────────────

function BestMatch({ tokens, best, top3 }: { tokens: Record<string, string>; best: { recipe: LayoutRecipe; score: number; structure: string }; top3: { structure: string; recipe: LayoutRecipe; score: number }[] }) {
  const others = top3.filter(r => r.structure !== best.structure).slice(0, 2)
  return (
    <div style={{ width: '100%', maxWidth: 896 }}>
      <WireframePreview recipe={best.recipe} score={best.score} />
      {others.length > 1 && (
        <div style={{ marginTop: spacing.xl }}>
          <h3 style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: tokens.textMuted, marginBottom: spacing.md, fontFamily: tokens.fontFamilyBody }}>Also recommended</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: spacing.md }}>
            {others.map(r => (
              <div key={r.structure} role="button" tabIndex={0} aria-label={`${r.recipe.name}, score ${r.score}`} style={{ border: `1px solid ${tokens.borderSubtle}`, background: tokens.bgBase, borderRadius: radius['2xl'], overflow: 'hidden', minHeight: 44 }}>
                <GridPreview recipe={r.recipe} compact />
                <div style={{ padding: `${spacing.md}px ${spacing.base}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, fontFamily: tokens.fontFamilyBody, color: tokens.textPrimary }}>{r.recipe.name}</div>
                    <div style={{ fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, color: tokens.textMuted, marginTop: 2 }}>{r.recipe.description}</div>
                  </div>
                  <ScoreGauge score={r.score} size={36} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
