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

const EMPTY_STATS: AgentExecStats = {
  totalRuns: 0, completedRuns: 0, failedRuns: 0,
  avgScore: 0, lastExecutedAt: null, isRunning: false,
}

function handleExecuting(setStats: React.Dispatch<React.SetStateAction<ExecStatsMap>>, agentId: string) {
  setStats(prev => {
    const existing = prev[agentId] || EMPTY_STATS
    return { ...prev, [agentId]: { ...existing, isRunning: true, totalRuns: existing.totalRuns + 1, lastExecutedAt: new Date().toISOString() } }
  })
}

function handleStepCompleted(setStats: React.Dispatch<React.SetStateAction<ExecStatsMap>>, agentId: string, score?: number) {
  setStats(prev => {
    const existing = prev[agentId]
    if (!existing) return prev
    const avgScore = score !== undefined
      ? Math.round(((existing.avgScore * existing.completedRuns + score) / (existing.completedRuns + 1)) * 10) / 10
      : existing.avgScore
    return { ...prev, [agentId]: { ...existing, isRunning: false, completedRuns: existing.completedRuns + 1, avgScore } }
  })
}

function handleStepFailed(setStats: React.Dispatch<React.SetStateAction<ExecStatsMap>>, agentId: string) {
  setStats(prev => {
    const existing = prev[agentId]
    if (!existing) return prev
    return { ...prev, [agentId]: { ...existing, isRunning: false, failedRuns: existing.failedRuns + 1 } }
  })
}

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

  useEffect(() => { fetchStats() }, [fetchStats])

  useEffect(() => {
    const socket = socketIO('/?XTransformPort=3003', { transports: ['websocket', 'polling'], forceNew: false, reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 2000 })
    socketRef.current = socket
    socket.on('agent:executing', (d: { agentId: string }) => handleExecuting(setStats, d.agentId))
    socket.on('agent:step-completed', (d: { agentId: string; score?: number }) => handleStepCompleted(setStats, d.agentId, d.score))
    socket.on('agent:step-failed', (d: { agentId: string }) => handleStepFailed(setStats, d.agentId))
    const interval = setInterval(fetchStats, 30000)
      return () => { socket.disconnect()
      socketRef.current = null
      clearInterval(interval) }
  }, [fetchStats])

  return { stats, loading, refetch: fetchStats }
}
