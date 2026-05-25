'use client'

import { useState, useCallback } from 'react'
import type { IntentMatch, AgentRole, CognitiveFormula } from '@/lib/prompting'
import type { PromptAnalysis, ExecutionData } from './prompt-analysis-types'
import { getRunnerUpIntents, buildAgentChain, buildPipelineSteps } from './prompt-analysis-mappings'
import { executeWorkflowSimulation } from './prompt-analysis-executor'

// Re-export types for consumers
export type { PipelineStepDraft, PromptAnalysis, StepResult, ExecutionData } from './prompt-analysis-types'

// ─── Safe JSON parse — handles HTML error pages gracefully ────

async function safeJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json') && !ct.includes('text/plain')) {
    const text = await res.text()
    throw new Error(`Server returned non-JSON (HTTP ${res.status}). ${text.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

export function usePromptAnalysis() {
  const [prompt, setPrompt] = useState('')
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async () => {
    if (!prompt.trim()) return
    setAnalyzing(true)
    setError(null)
    setExecutionResult(null)

    try {
      // Try LLM-powered analysis first
      const llmRes = await fetch('/api/prompting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!llmRes.ok) {
        throw new Error(`LLM analysis failed (HTTP ${llmRes.status})`)
      }

      const llmData = await safeJson(llmRes)

      // Build analysis from LLM response
      const intent: IntentMatch = {
        intent: llmData.intent?.intent || 'explanation',
        confidence: llmData.intent?.confidence || 50,
        keywords: llmData.intent?.keywords || [],
      }

      const bestRole: AgentRole = llmData.bestRole || {
        id: 'code-architect', name: 'Code Architect', temperature: 0.7,
        systemPrompt: '', expertise: [], preferredIntents: [],
      }

      const recommendedFormula: CognitiveFormula | null = llmData.recommendedFormula || null
      const formulaReason = llmData.llmAnalysis?.reasoning || 'General structured reasoning improves output quality'
      const runnerUpIntents = getRunnerUpIntents(intent)

      // Build agent chain
      const agentChain = buildAgentChain(intent.intent, bestRole)

      // Use LLM-suggested steps if available, otherwise fall back to mapping
      const pipelineSteps = buildPipelineSteps(
        intent.intent,
        agentChain,
        recommendedFormula,
      )

      // Override with LLM-suggested steps/actions if available
      if (llmData.llmAnalysis?.suggestedSteps?.length > 0) {
        const llmSteps = llmData.llmAnalysis.suggestedSteps as string[]
        const llmActions = (llmData.llmAnalysis.suggestedActions as string[]) || []
        for (let i = 0; i < llmSteps.length; i++) {
          if (i < pipelineSteps.length) {
            pipelineSteps[i].name = llmSteps[i]
            if (llmActions[i]) pipelineSteps[i].action = llmActions[i]
          }
        }
      }

      setAnalysis({
        intent,
        bestRole,
        runnerUpIntents,
        recommendedFormula,
        formulaReason,
        agentChain,
        pipelineSteps,
      })
    } catch (err) {
      console.error('Analysis failed:', err)

      // Fallback: keyword-based analysis via GET
      try {
        const [intentRes, rolesRes, formulasRes] = await Promise.all([
          fetch(`/api/prompting?section=intent&query=${encodeURIComponent(prompt)}`),
          fetch(`/api/prompting?section=roles&query=${encodeURIComponent(prompt)}`),
          fetch('/api/prompting?section=formulas'),
        ])

        const intentData: IntentMatch = await safeJson(intentRes)
        const rolesData: { intent: IntentMatch; bestRole: AgentRole } = await safeJson(rolesRes)
        const formulasData: { formulas: CognitiveFormula[]; categories: string[] } = await safeJson(formulasRes)

        const runnerUpIntents = getRunnerUpIntents(intentData)
        const agentChain = buildAgentChain(intentData.intent, rolesData.bestRole)
        const pipelineSteps = buildPipelineSteps(intentData.intent, agentChain, formulasData.formulas[0])

        const INTENT_REASONS: Record<string, string> = {
          debugging: 'Debugging needs iterative exploration',
          'code-review': 'Review benefits from structured verification',
          'code-generation': 'Generation works best with decomposition',
          'data-analysis': 'Analysis requires systematic thinking',
          explanation: 'Explanations benefit from structured reasoning',
          refactoring: 'Refactoring needs first-principles thinking',
          testing: 'Testing benefits from boundary checks',
          'creative-writing': 'Creativity thrives under constraint-driven thinking',
        }

        setAnalysis({
          intent: intentData,
          bestRole: rolesData.bestRole,
          runnerUpIntents,
          recommendedFormula: formulasData.formulas[0] || null,
          formulaReason: INTENT_REASONS[intentData.intent] || 'General structured reasoning',
          agentChain,
          pipelineSteps,
        })
      } catch (fallbackErr) {
        setError(fallbackErr instanceof Error ? fallbackErr.message : 'Analysis failed')
      }
    } finally {
      setAnalyzing(false)
    }
  }, [prompt])

  const clear = useCallback(() => {
    setPrompt('')
    setAnalysis(null)
    setExecutionResult(null)
    setError(null)
  }, [])

  const executeSimulation = useCallback(async () => {
    if (!analysis) return
    setExecuting(true)
    setError(null)

    try {
      const result = await executeWorkflowSimulation(
        analysis.intent.intent,
        prompt,
        analysis.pipelineSteps,
        { confidence: analysis.intent.confidence, formula: analysis.recommendedFormula?.name || '' },
      )
      setExecutionResult(result)
    } catch (err) {
      console.error('Execution failed:', err)
      setError(err instanceof Error ? err.message : 'Execution failed')
    } finally {
      setExecuting(false)
    }
  }, [analysis, prompt])

  return {
    prompt,
    setPrompt,
    analysis,
    analyzing,
    executing,
    executionResult,
    error,
    analyze,
    clear,
    executeSimulation,
  }
}
