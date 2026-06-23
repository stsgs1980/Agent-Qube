'use client'

import { useState, useMemo } from 'react'
import type { LayoutAdviceInput, LayoutRecommendation, ParsedPrompt } from '@/lib/layout/types'
import { scoreLayout } from '@/lib/layout/scoring'
import { scoreLayoutMulti } from '@/lib/layout/scoring-multi'
import { parsePrompt } from '@/lib/layout/prompt-parser'
import type { LayoutRecipe } from '@/lib/layout/types'

interface CanvasPromptState {
  prompt: string
  parsed: ParsedPrompt | null
  submitted: boolean
}

interface CanvasPromptActions {
  setPrompt: (p: string) => void
  submitFromPalette: (text: string) => void
  submitCurrent: () => void
}

interface CanvasPromptResult {
  state: CanvasPromptState
  actions: CanvasPromptActions
  input: LayoutAdviceInput
  ranked: LayoutRecommendation[]
  best: LayoutRecommendation | null
  top5: LayoutRecommendation[]
}

export function useCanvasPrompt(recipes: LayoutRecipe[]): CanvasPromptResult {
  const [prompt, setPrompt] = useState('')
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null)
  const [submitted, setSubmitted] = useState(false)

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
  const top5 = ranked.filter(r => r.verdict === 'recommended').slice(0, 5)

  const submitFromPalette = (text: string) => {
    setPrompt(text)
    setParsed(parsePrompt(text))
    setSubmitted(true)
  }

  const submitCurrent = () => {
    if (!prompt.trim()) return
    setParsed(parsePrompt(prompt))
    setSubmitted(true)
  }

  return {
    state: { prompt, parsed, submitted },
    actions: { setPrompt, submitFromPalette, submitCurrent },
    input, ranked, best, top5,
  }
}
