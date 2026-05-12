'use client'

import { useState, useCallback } from 'react'
import type { ParsedPrompt } from '@/lib/layout/types'
import { parsePrompt } from '@/lib/layout/scoring'

// ─── AI Prompt Hook ─────────────────────────────────────────
// Extracts AI-related state from prompt-studio.tsx.
// Reduces 7 useState → 3 (prompt, parsed, aiState).

interface AiState {
  submitted: boolean
  aiMode: boolean
  aiLoading: boolean
  aiExplanation: string | null
  aiConfidence: number | null
}

const initialAiState: AiState = {
  submitted: false,
  aiMode: false,
  aiLoading: false,
  aiExplanation: null,
  aiConfidence: null,
}

export function useAiPrompt() {
  const [prompt, setPrompt] = useState('')
  const [parsed, setParsed] = useState<ParsedPrompt | null>(null)
  const [ai, setAi] = useState<AiState>(initialAiState)

  const handleAiSubmit = useCallback(async () => {
    if (!prompt.trim()) return
    setAi(s => ({ ...s, aiLoading: true, aiExplanation: null, aiConfidence: null }))
    try {
      const res = await fetch('/api/interpret-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await res.json()
      if (data.success && data.result) {
        const r = data.result; const kwParsed = parsePrompt(prompt)
        setParsed({ goal: r.goal, contentType: r.contentType, itemCount: r.itemCount, needsSidebar: r.needsSidebar, needsHeader: r.needsHeader, needsFooter: r.needsFooter, detected: r.detected ?? [], goalWeights: kwParsed.goalWeights })
        setAi(s => ({ ...s, aiExplanation: r.explanation ?? null, aiConfidence: r.confidence ?? null, submitted: true, aiLoading: false }))
      } else { setParsed(parsePrompt(prompt)); setAi(s => ({ ...s, submitted: true, aiLoading: false })) }
    } catch { setParsed(parsePrompt(prompt)); setAi(s => ({ ...s, submitted: true, aiLoading: false })) }
  }, [prompt])

  const handleKeywordSubmit = useCallback(() => {
    if (!prompt.trim()) return
    setParsed(parsePrompt(prompt))
    setAi(s => ({ ...s, submitted: true, aiExplanation: null, aiConfidence: null }))
  }, [prompt])

  const handleSubmit = ai.aiMode ? handleAiSubmit : handleKeywordSubmit

  const toggleAiMode = useCallback(() => {
    setAi(s => ({ ...s, aiMode: !s.aiMode }))
  }, [])

  const reset = useCallback(() => {
    setAi(initialAiState)
    setParsed(null)
  }, [])

  return {
    prompt, setPrompt,
    parsed, setParsed,
    ai,
    handleSubmit, toggleAiMode, reset,
  }
}
