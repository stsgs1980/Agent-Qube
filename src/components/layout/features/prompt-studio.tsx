'use client'
import { useMemo } from 'react'
import { Sparkles, Wand2, Layers } from 'lucide-react'
import type { LayoutRecipe, LayoutAdviceInput } from '@/lib/layout/types'
import { GOALS, PROMPT_EXAMPLES } from '@/lib/layout/types'
import { scoreLayout } from '@/lib/layout/scoring'
import { scoreLayoutMulti } from '@/lib/layout/scoring-multi'
import { GridPreview, ScoreGauge, PipelineNode } from '../ui'
import { WireframePreview } from '.'
import { useLayoutTheme } from '@/lib/layout/theme'
import { useAiPrompt } from '@/lib/layout/use-ai-prompt'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'
import { ThemeRecommendationPanel } from '../sections'

export function VariantPromptStudio({ recipes }: { recipes: LayoutRecipe[] }) {
  const { tokens } = useLayoutTheme()
  const { prompt, setPrompt, parsed, ai, handleSubmit, toggleAiMode } = useAiPrompt()

  const input: LayoutAdviceInput = parsed
    ? { goal: parsed.goal, contentType: parsed.contentType, itemCount: parsed.itemCount, needsSidebar: parsed.needsSidebar, needsHeader: parsed.needsHeader, needsFooter: parsed.needsFooter }
    : { goal: 'landing', contentType: 'cards', itemCount: 6, needsHeader: true }

  const goalWeights = parsed?.goalWeights ?? { [input.goal]: 1 }
  const isMultiGoal = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length > 1
  const ranked = useMemo(() => {
    if (isMultiGoal && parsed) return recipes.map(r => scoreLayoutMulti(r, input, goalWeights)).sort((a, b) => b.score - a.score) as LayoutRecommendation[]
    return recipes.map(r => scoreLayout(r, input)).sort((a, b) => b.score - a.score)
  }, [recipes, input, isMultiGoal, parsed, goalWeights])
  const best = ranked[0] ?? null
  const top3 = ranked.filter(r => r.verdict === 'recommended').slice(0, 3)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: spacing['3xl'], paddingBottom: spacing['4xl'], paddingInline: spacing.xl,
      background: tokens.bgDeep, color: tokens.textPrimary,
      transition: 'background 0.3s, color 0.3s',
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: spacing['3xl'], maxWidth: 640 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: `${spacing.xs}px ${spacing.md}px`,
          borderRadius: radius.full,
          background: `${tokens.accentAI}10`, border: `1px solid ${tokens.accentAI}20`,
          fontSize: fontSize.sm, color: tokens.accentAI, fontFamily: tokens.fontFamilyMono, marginBottom: 20,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: tokens.accentAI }} />
          AI-Powered Layout Advisor
        </div>
        <h1 style={{
          fontSize: fontSize['3xl'], fontWeight: fontWeight.black, letterSpacing: '-1.2px', marginBottom: 14, lineHeight: 1.15,
          fontFamily: tokens.fontFamilyDisplay,
        }}>
          Describe it.<br />
          <span style={{ color: tokens.accentPrimary }}>We&apos;ll layout it.</span>
        </h1>
        <p style={{ color: tokens.textMuted, fontSize: fontSize.lg, lineHeight: 1.7, maxWidth: 520, margin: '0 auto', fontFamily: tokens.fontFamilyBody }}>
          Type what you want to build. The system parses your intent, scores all 51 layout recipes, and picks the perfect one.
        </p>
      </div>

      {/* Prompt Input */}
      <div style={{ width: '100%', maxWidth: 600, marginBottom: spacing.xl }}>
        <div style={{
          border: `2px solid ${prompt ? tokens.borderBright : tokens.borderSubtle}`,
          borderRadius: radius['4xl'], background: tokens.bgBase,
          boxShadow: prompt ? `0 4px 24px ${tokens.accentPrimary}10` : tokens.cardShadow,
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.md}px ${spacing.lg}px` }}>
            {ai.aiLoading ? (
              <div style={{ width: 20, height: 20, border: `2px solid ${tokens.borderDefault}`, borderTopColor: tokens.textPrimary, borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            ) : (
              <Wand2 style={{ width: 20, height: 20, flexShrink: 0, color: prompt ? tokens.accentAI : tokens.textMuted, transition: 'color 0.3s' }} />
            )}
            <input type="text" value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !ai.aiLoading && handleSubmit()}
              placeholder="Build me an admin dashboard with sidebar..."
              style={{ flex: 1, background: 'transparent', fontSize: fontSize.lg, outline: 'none', color: tokens.textPrimary, fontFamily: tokens.fontFamilyBody }}
              disabled={ai.aiLoading} />
            <button onClick={handleSubmit} disabled={!prompt.trim() || ai.aiLoading} style={{
              padding: `${spacing.sm}px ${spacing.xl}px`, borderRadius: radius.xl,
              fontSize: fontSize.md, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody,
              background: prompt.trim() && !ai.aiLoading ? tokens.bgOnAccent : tokens.bgSurface,
              color: prompt.trim() && !ai.aiLoading ? tokens.textOnAccent : tokens.textDim,
              border: 'none', cursor: prompt.trim() && !ai.aiLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}>
              {ai.aiLoading ? 'Thinking...' : ai.aiMode ? 'AI Generate' : 'Generate'}
            </button>
          </div>
          <div style={{ padding: `${spacing.sm}px ${spacing.lg}px`, borderTop: `1px solid ${tokens.borderSubtle}`, display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <button onClick={toggleAiMode} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.lg,
              fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono,
              background: ai.aiMode ? `${tokens.accentAI}14` : tokens.bgSurface,
              color: ai.aiMode ? tokens.accentAI : tokens.textMuted,
              border: `1px solid ${ai.aiMode ? `${tokens.accentAI}30` : tokens.borderDefault}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <Sparkles style={{ width: 12, height: 12 }} />
              AI Mode {ai.aiMode ? 'ON' : 'OFF'}
            </button>
            <span style={{ fontSize: fontSize.sm, color: tokens.textDim, fontFamily: tokens.fontFamilyMono }}>
              {ai.aiMode ? 'LLM interprets → structured params' : 'Keyword matching → fast, local'}
            </span>
            {ai.submitted && ai.promptGrade && <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono }}><span style={{ fontWeight: fontWeight.bold, color: 'SA'.includes(ai.promptGrade) ? tokens.accentPrimary : tokens.textSecondary }}>Q:{ai.promptGrade}</span>{ai.aiConfidence !== null && <span style={{ fontWeight: fontWeight.bold, color: tokens.accentAI }}>C:{ai.aiConfidence}%</span>}</span>}
          </div>
        </div>
      </div>

      {/* Example Chips */}
      {!ai.submitted && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', maxWidth: 600, marginBottom: spacing['2xl'] }}>
          {PROMPT_EXAMPLES.slice(0, 5).map((ex, i) => (
            <button key={i} onClick={() => { setPrompt(ex); handleSubmit() }} style={{
              padding: `${spacing.xs}px ${spacing.md}px`, fontSize: fontSize.base, borderRadius: radius.xl,
              border: `1px solid ${tokens.borderDefault}`, color: tokens.textSecondary,
              background: 'transparent', cursor: 'pointer', fontFamily: tokens.fontFamilyBody, transition: 'all 0.15s',
            }}>
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Pipeline */}
      {ai.submitted && parsed && (
        <div style={{ width: '100%', maxWidth: 600, marginBottom: spacing['2xl'] }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: `${spacing.sm}px 0` }}>
            <PipelineNode label="Prompt" value={prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt} color={tokens.accentAI} active />
            <div style={{ flex: 1, margin: `0 ${spacing.sm}px`, borderTop: `1px dashed ${tokens.borderDefault}` }} />
            <PipelineNode label="Parse" value={`${parsed.goal}/${parsed.contentType}`} color={tokens.accentPrimary} active />
            <div style={{ flex: 1, margin: `0 ${spacing.sm}px`, borderTop: `1px dashed ${tokens.borderDefault}` }} />
            <PipelineNode label="Score" value={`${ranked.filter(r => r.verdict === 'recommended').length} match`} color={tokens.textSecondary} active />
            <div style={{ flex: 1, margin: `0 ${spacing.sm}px`, borderTop: `1px dashed ${tokens.borderDefault}` }} />
            <PipelineNode label="Layout" value={best?.structure ?? '...'} color={tokens.accentPrimary} active />
          </div>
          {isMultiGoal && (
            <div style={{ marginTop: spacing.md, padding: spacing.md, background: tokens.bgBase, border: `1px solid ${tokens.borderSubtle}`, borderRadius: radius['2xl'] }}>
              <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textDim, marginBottom: spacing.sm, fontFamily: tokens.fontFamilyMono }}>Multi-Goal Composition</div>
              <div style={{ display: 'flex', height: 24, borderRadius: radius.lg, overflow: 'hidden' }}>
                {Object.entries(goalWeights).filter(([, w]) => w > 0).sort(([, a], [, b]) => b - a).map(([g, w]) => {
                  const m = GOALS.find(gm => gm.value === g)
                  return <div key={g} style={{ width: `${w * 100}%`, backgroundColor: m?.color ?? tokens.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: fontSize.xs, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono, minWidth: 40, transition: 'width 0.5s' }}>{m?.label ?? g} {Math.round(w * 100)}%</div>
                })}
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center', fontSize: fontSize.sm, color: tokens.textDim, marginTop: spacing.md, fontFamily: tokens.fontFamilyMono }}>Detected: {parsed.detected.join(' → ')}</div>
          {ai.aiExplanation && <div style={{ marginTop: spacing.md, padding: spacing.md, background: `${tokens.accentAI}08`, border: `1px solid ${tokens.accentAI}15`, borderRadius: radius['2xl'], fontSize: fontSize.base, fontFamily: tokens.fontFamilyBody }}><span style={{ fontWeight: fontWeight.bold, color: tokens.accentAI }}>AI: </span><span style={{ color: tokens.accentAI + 'bb' }}>{ai.aiExplanation}</span></div>}

          {/* Theme Recommendation */}
          <div style={{ marginTop: spacing.md }}>
            <ThemeRecommendationPanel goal={input.goal} />
          </div>
        </div>
      )}

      {/* Best Match */}
      {ai.submitted && best && (
        <div style={{ width: '100%', maxWidth: 896 }}>
          <WireframePreview recipe={best.recipe} score={best.score} />
          {top3.length > 1 && (
            <div style={{ marginTop: spacing.xl }}>
              <h3 style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: tokens.textMuted, marginBottom: spacing.md, fontFamily: tokens.fontFamilyBody }}>Also recommended</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: spacing.md }}>
                {top3.filter(r => r.structure !== best.structure).slice(0, 2).map(r => (
                  <div key={r.structure} style={{ border: `1px solid ${tokens.borderSubtle}`, background: tokens.bgBase, borderRadius: radius['2xl'], overflow: 'hidden' }}>
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
      )}

      {/* Empty State */}
      {!ai.submitted && (
        <div style={{ marginTop: spacing['3xl'], display: 'flex', flexDirection: 'column', alignItems: 'center', color: tokens.textDim }}>
          <Layers style={{ width: 64, height: 64, marginBottom: spacing.base, opacity: 0.3 }} />
          <p style={{ fontSize: fontSize.lg, fontFamily: tokens.fontFamilyBody }}>Type a prompt above to see the AI layout advisor in action</p>
        </div>
      )}
    </div>
  )
}
