'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PromptHistoryEntry {
  id: string
  prompt: string
  intent: string
  confidence: number
  formula: string
  avgScore: number
  verdict: string
  stepCount: number
  executionId: string | null
  createdAt: string
}

// ─── Hook: usePromptHistory ────────────────────────────────────────────────
// Fetches prompt history and provides a method to delete individual entries.

export function usePromptHistory() {
  const [history, setHistory] = useState<PromptHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/prompt-history')
      if (res.ok) {
        const data = await res.json()
        setHistory(data.history || [])
      } else {
        setError(`HTTP ${res.status}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch prompt history'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/prompt-history?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setHistory(prev => prev.filter(entry => entry.id !== id))
      }
    } catch {
      // silently ignore delete errors like the original component
    }
  }, [])

  const clearAll = useCallback(async () => {
    try {
      for (const entry of history) {
        await fetch(`/api/prompt-history?id=${entry.id}`, { method: 'DELETE' })
      }
      setHistory([])
    } catch {
      // silently ignore
    }
  }, [history])

  return { history, loading, error, refetch, deleteEntry, clearAll }
}
