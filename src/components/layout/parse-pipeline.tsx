'use client'

import { GridPreview } from './grid-preview'
import { ScoreGauge } from './score-gauge'
import { PipelineNode } from './pipeline-node'
import { WireframePreview } from './wireframe-preview'
import type { LayoutRecipe } from '@/lib/layout/types'
import { GOALS } from '@/lib/layout/types'
import { spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Shared Types ───────────────────────────────────────────

export interface ParsedData {
  goal: string; contentType: string; detected: string[]
  goalWeights?: Record<string, number>
}

export interface AiData {
  aiConfidence: number | null; submitted: boolean; aiExplanation?: string
}

// ─── Parse Pipeline ─────────────────────────────────────────

export function ParsePipeline({ tokens, prompt, parsed, ranked, goalWeights, isMultiGoal, ai }: {
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
      {ai.aiExplanation && <div style={{ marginTop: spacing.md, padding: spacing.md, background: `${tokens.accentAI}08`, border: `1px solid ${tokens.accentAI}15`, borderRadius: spacing.md, fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody }}><span style={{ fontWeight: fontWeight.bold, color: tokens.accentAI }}>AI: </span><span style={{ color: String(tokens.accentAI) + 'bb' }}>{ai.aiExplanation}</span></div>}
    </div>
  )
}

// ─── Multi-Goal Composition Bar ─────────────────────────────

function MultiGoalBar({ tokens, goalWeights }: { tokens: Record<string, string>; goalWeights: Record<string, number> }) {
  return (
    <div style={{ marginTop: spacing.md, padding: spacing.md, background: tokens.bgBase, border: `1px solid ${tokens.borderSubtle}`, borderRadius: spacing.md }}>
      <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Multi-Goal Composition</div>
      <div style={{ display: 'flex', height: 24, borderRadius: 8, overflow: 'hidden' }}>
        {Object.entries(goalWeights).filter(([, w]) => w > 0).sort(([, a], [, b]) => b - a).map(([g, w]) => {
          const m = GOALS.find(gm => gm.value === g)
          return <div key={g} style={{ width: `${w * 100}%`, backgroundColor: m?.color ?? tokens.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: fontSize.xs, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, minWidth: 40, transition: 'width 0.5s' }}>{m?.label ?? g} {Math.round(w * 100)}%</div>
        })}
      </div>
    </div>
  )
}

// ─── Best Match + Also Recommended ──────────────────────────

export function BestMatch({ tokens, best, top3 }: { tokens: Record<string, string>; best: { recipe: LayoutRecipe; score: number; structure: string }; top3: { structure: string; recipe: LayoutRecipe; score: number }[] }) {
  const others = top3.filter(r => r.structure !== best.structure).slice(0, 2)
  return (
    <div style={{ width: '100%', maxWidth: 896 }}>
      <WireframePreview recipe={best.recipe} score={best.score} />
      {others.length > 1 && (
        <div style={{ marginTop: spacing.xl }}>
          <h3 style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: tokens.textMuted, marginBottom: spacing.md, fontFamily: tokens.fontFamilyBody }}>Also recommended</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: spacing.md }}>
            {others.map(r => (
              <div key={r.structure} role="button" tabIndex={0} aria-label={`${r.recipe.name}, score ${r.score}`} style={{ border: `1px solid ${tokens.borderSubtle}`, background: tokens.bgBase, borderRadius: spacing.md, overflow: 'hidden', minHeight: 44 }}>
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
