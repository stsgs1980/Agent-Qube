'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ExecutionStats {
  totalRuns: number
  completedRuns: number
  failedRuns: number
  skippedRuns: number
  successRate: number
  avgScore: number
  lastExecutedAt: string | null
}

export interface RecentExecution {
  id: string
  stepName: string
  stepAction: string
  status: string
  score: number
  summary: string
  verdict: string
  issues: string[]
  startedAt: string | null
  completedAt: string | null
  workflowId: string | null
}

// ─── Hook: useExecutionHistory ─────────────────────────────────────────────
// Fetches execution history for a specific agent.

export function useExecutionHistory(agentId: string) {
  const [stats, setStats] = useState<ExecutionStats | null>(null)
  const [executions, setExecutions] = useState<RecentExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/agents/${agentId}/executions`)
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats || null)
        setExecutions(data.recentExecutions || [])
      } else {
        setError(`HTTP ${res.status}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch execution history'
      setError(message)
      console.error('[useExecutionHistory] fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/agents/${agentId}/executions`)
        if (res.ok && !cancelled) {
          const data = await res.json()
          setStats(data.stats || null)
          setExecutions(data.recentExecutions || [])
        } else if (!cancelled) {
          setError(`HTTP ${res.status}`)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch execution history'
          setError(message)
          console.error('[useExecutionHistory] fetch failed:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [agentId])

  return { stats, executions, loading, error, refetch }
}
