'use client'

import { Layers } from 'lucide-react'
import type { LayoutRecipe, LayoutAdviceInput } from '@/lib/layout/types'
import { PROMPT_EXAMPLES } from '@/lib/layout/types'
import { useLayoutTheme } from '@/lib/layout/theme'
import { useAiPrompt } from '@/lib/layout/use-ai-prompt'
import { useRankedRecipes } from './use-ranked-recipes'
import { PromptInput } from './prompt-input'
import { ParsePipeline, BestMatch } from './parse-pipeline'
import type { ParsedData, AiData } from './parse-pipeline'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

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
      {ai.submitted && parsed && <ParsePipeline tokens={tokens} prompt={prompt} parsed={parsed as ParsedData} ranked={ranked} goalWeights={goalWeights} isMultiGoal={isMultiGoal} ai={ai as AiData} />}
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
        padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: 999,
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
          padding: `${spacing.xs}px ${spacing.md}px`, fontSize: fontSize.base, borderRadius: 999,
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
