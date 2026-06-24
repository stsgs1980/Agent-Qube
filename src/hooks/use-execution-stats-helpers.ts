// ─── Socket event handlers for use-execution-stats ──────────

import type { ExecStatsMap, AgentExecStats } from './use-execution-stats'

const EMPTY_STATS: AgentExecStats = {
  totalRuns: 0, completedRuns: 0, failedRuns: 0,
  avgScore: 0, lastExecutedAt: null, isRunning: false,
}

export function createAgentExecutingHandler(setStats: React.Dispatch<React.SetStateAction<ExecStatsMap>>) {
  return (data: { agentId: string }) => {
    setStats(prev => ({
      ...prev,
      [data.agentId]: {
        ...(prev[data.agentId] || EMPTY_STATS),
        isRunning: true,
        totalRuns: (prev[data.agentId]?.totalRuns || 0) + 1,
        lastExecutedAt: new Date().toISOString(),
      },
    }))
  }
}

export function createStepCompletedHandler(setStats: React.Dispatch<React.SetStateAction<ExecStatsMap>>) {
  return (data: { agentId: string; score?: number }) => {
    setStats(prev => {
      const existing = prev[data.agentId]
      if (!existing) return prev
      return {
        ...prev,
        [data.agentId]: {
          ...existing, isRunning: false,
          completedRuns: existing.completedRuns + 1,
          avgScore: data.score !== undefined
            ? Math.round(((existing.avgScore * existing.completedRuns + data.score) / (existing.completedRuns + 1)) * 10) / 10
            : existing.avgScore,
        },
      }
    })
  }
}

export function createStepFailedHandler(setStats: React.Dispatch<React.SetStateAction<ExecStatsMap>>) {
  return (data: { agentId: string }) => {
    setStats(prev => {
      const existing = prev[data.agentId]
      if (!existing) return prev
      return { ...prev, [data.agentId]: { ...existing, isRunning: false, failedRuns: existing.failedRuns + 1 } }
    })
  }
}