'use client'

import { useState } from 'react'
import type { ParsedPrompt } from '@/lib/layout/types'

interface CanvasPromptState {
  prompt: string
  parsed: ParsedPrompt | null
  submitted: boolean
}

const initialState: CanvasPromptState = {
  prompt: '',
  parsed: null,
  submitted: false,
}

export function useCanvasPrompt() {
  const [state, setState] = useState<CanvasPromptState>(initialState)

  const setPrompt = (v: string) => setState(s => ({ ...s, prompt: v }))
  const setParsed = (v: ParsedPrompt | null) => setState(s => ({ ...s, parsed: v }))
  const setSubmitted = (v: boolean) => setState(s => ({ ...s, submitted: v }))

  return {
    prompt: state.prompt, setPrompt,
    parsed: state.parsed, setParsed,
    submitted: state.submitted, setSubmitted,
  }
}
