'use client'

import { useState, useMemo } from 'react'
import type { LayoutRecipe, LayoutAdviceInput, ParsedPrompt } from '@/lib/layout/types'
import { GOALS, PROMPT_EXAMPLES } from '@/lib/layout/types'
import { parsePrompt, scoreLayout, scoreLayoutMulti } from '@/lib/layout/scoring'
import { WireframePreview } from '@/components/layout/wireframe-preview'
import { GridPreview } from '@/components/layout/grid-preview'
import { ScoreGauge } from '@/components/layout/score-gauge'
import { Wand2 } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 3: Prompt-to-Wireframe — Type a prompt → best wireframe
// Shows the full pipeline: prompt → parse → score → wireframe
// ═══════════════════════════════════════════════════════════════

interface PromptWireframeProps {
  recipes: LayoutRecipe[]
}

export function WireframePromptDemo({ recipes }: PromptWireframeProps) {
  const [prompt, setPrompt] = useState('')
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null)

  const input: LayoutAdviceInput = parsed
    ? { goal: parsed.goal, contentType: parsed.contentType, itemCount: parsed.itemCount, needsSidebar: parsed.needsSidebar, needsHeader: parsed.needsHeader, needsFooter: parsed.needsFooter }
    : { goal: 'landing', contentType: 'cards', itemCount: 6, needsHeader: true }

  const goalWeights = parsed?.goalWeights ?? { [input.goal]: 1 }
  const isMultiGoal = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length > 1

  const ranked = useMemo(() => {
    if (isMultiGoal && parsed) {
      return recipes.map(r => scoreLayoutMulti(r, input, goalWeights)).sort((a, b) => b.score - a.score)
    }
    return recipes.map(r => scoreLayout(r, input)).sort((a, b) => b.score - a.score)
  }, [recipes, input, isMultiGoal, parsed, goalWeights])

  const best = ranked[0] ?? null
  const top5 = ranked.slice(0, 5)
  const goalMeta = GOALS.find(g => g.value === input.goal)

  const handleSubmit = () => {
    if (!prompt.trim()) return
    setParsed(parsePrompt(prompt))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Wireframe Preview — Prompt Demo</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Type a prompt → best matching layout shown as interactive wireframe.
      </p>

      {/* Prompt Input */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Describe what you want to build..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
        </div>
        <button onClick={handleSubmit} disabled={!prompt.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background disabled:opacity-40 transition-all">
          Generate
        </button>
      </div>

      {/* Example Chips */}
      {!parsed && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {PROMPT_EXAMPLES.slice(0, 4).map((ex, i) => (
            <button key={i} onClick={() => { setPrompt(ex); setParsed(parsePrompt(ex)) }}
              className="px-2.5 py-1 text-[11px] rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      {parsed && best && (
        <div className="space-y-6">
          {/* Parsed Info */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center gap-4 text-xs">
            <span style={{ color: goalMeta?.color ?? '#10b981' }} className="font-semibold">{goalMeta?.label ?? parsed.goal}</span>
            <span className="text-muted-foreground">{parsed.contentType}</span>
            <span className="text-muted-foreground">{parsed.itemCount} items</span>
            {parsed.needsSidebar && <span className="text-purple-500 font-medium">+sidebar</span>}
            {parsed.needsHeader && <span className="text-blue-500 font-medium">+header</span>}
            {parsed.needsFooter && <span className="text-indigo-500 font-medium">+footer</span>}
            <ScoreGauge score={best.score} size={36} className="ml-auto" />
          </div>

          {/* Best Wireframe */}
          <WireframePreview recipe={best.recipe} score={best.score} />

          {/* Top 5 Alternatives — Compact */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Other matches</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {top5.filter(r => r.structure !== best.structure).map(r => (
                <div key={r.structure} className="rounded-xl border border-border/50 bg-card p-3 hover:border-foreground/20 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold truncate">{r.recipe.name}</span>
                    <span className="text-[10px] font-mono font-bold">{r.score}</span>
                  </div>
                  <GridPreview recipe={r.recipe} compact />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
