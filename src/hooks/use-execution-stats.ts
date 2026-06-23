'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { io as socketIO, Socket } from 'socket.io-client'

// ─── Execution stats per agent ──────────────────────────────────────────────

export interface AgentExecStats {
  totalRuns: number
  completedRuns: number
  failedRuns: number
  avgScore: number
  lastExecutedAt: string | null
  isRunning: boolean
}

export type ExecStatsMap = Record<string, AgentExecStats>

// ─── Hook: useExecutionStats ────────────────────────────────────────────────
// Fetches aggregated execution stats for all agents,
// then subscribes to WebSocket events for real-time updates.

export function useExecutionStats() {
  const [stats, setStats] = useState<ExecStatsMap>({})
  const [loading, setLoading] = useState(true)
  const socketRef = useRef<Socket | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/execution-stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.agentStats || {})
      }
    } catch (err) {
      console.error('[useExecutionStats] fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => { fetchStats() }, [fetchStats])

  // WebSocket for real-time execution events
  useEffect(() => {
    const socket = socketIO('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    // Agent step execution started
    socket.on('agent:executing', (data: { agentId: string; stepName: string; workflowId: string }) => {
      setStats(prev => {
        const existing = prev[data.agentId] || { totalRuns: 0, completedRuns: 0, failedRuns: 0, avgScore: 0, lastExecutedAt: null, isRunning: false }
        return {
          ...prev,
          [data.agentId]: {
            ...existing,
            isRunning: true,
            totalRuns: existing.totalRuns + 1,
            lastExecutedAt: new Date().toISOString(),
          },
        }
      })
    })

    // Agent step execution completed
    socket.on('agent:step-completed', (data: { agentId: string; score?: number; status: string }) => {
      setStats(prev => {
        const existing = prev[data.agentId]
        if (!existing) return prev
        return {
          ...prev,
          [data.agentId]: {
            ...existing,
            isRunning: false,
            completedRuns: existing.completedRuns + 1,
            // Update avg score incrementally
            avgScore: data.score !== undefined
              ? Math.round(((existing.avgScore * existing.completedRuns + data.score) / (existing.completedRuns + 1)) * 10) / 10
              : existing.avgScore,
          },
        }
      })
    })

    // Agent step execution failed
    socket.on('agent:step-failed', (data: { agentId: string; error: string }) => {
      setStats(prev => {
        const existing = prev[data.agentId]
        if (!existing) return prev
        return {
          ...prev,
          [data.agentId]: {
            ...existing,
            isRunning: false,
            failedRuns: existing.failedRuns + 1,
          },
        }
      })
    })

    // Refresh all stats periodically (every 30s)
    const interval = setInterval(fetchStats, 30000)

    return () => {
      socket.disconnect()
      socketRef.current = null
      clearInterval(interval)
    }
  }, [fetchStats])

  return { stats, loading, refetch: fetchStats }
}
