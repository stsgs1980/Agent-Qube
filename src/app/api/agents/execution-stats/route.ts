import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/agents/execution-stats
// Returns aggregated execution stats for ALL agents.
// Used by Hierarchy to show badges (run count, avg score) on agent nodes.

export async function GET() {
  try {
    // Aggregate per-agent stats from StepExecution
    const stepExecutions = await db.stepExecution.findMany({
      select: {
        id: true,
        agentId: true,
        status: true,
        outputData: true,
        startedAt: true,
        completedAt: true,
      },
      orderBy: { startedAt: 'desc' },
    })

    // Group by agent
    const agentStats: Record<string, {
      totalRuns: number
      completedRuns: number
      failedRuns: number
      avgScore: number
      lastExecutedAt: string | null
      isRunning: boolean
    }> = {}

    for (const se of stepExecutions) {
      if (!se.agentId) continue

      if (!agentStats[se.agentId]) {
        agentStats[se.agentId] = {
          totalRuns: 0,
          completedRuns: 0,
          failedRuns: 0,
          avgScore: 0,
          lastExecutedAt: null,
          isRunning: false,
        }
      }

      const stats = agentStats[se.agentId]
      stats.totalRuns++

      if (se.status === 'completed') stats.completedRuns++
      if (se.status === 'failed') stats.failedRuns++
      if (se.status === 'running') stats.isRunning = true

      if (se.startedAt) {
        if (!stats.lastExecutedAt || se.startedAt > stats.lastExecutedAt) {
          stats.lastExecutedAt = se.startedAt.toISOString()
        }
      }
    }

    // Compute avg scores
    const scoresByAgent: Record<string, number[]> = {}
    for (const se of stepExecutions) {
      if (!se.agentId || se.status !== 'completed') continue
      let parsed: Record<string, unknown> = {}
      try { parsed = JSON.parse(se.outputData || '{}') } catch { continue }
      const score = typeof parsed.score === 'number'
        ? parsed.score
        : typeof parsed.score === 'string'
          ? parseFloat(parsed.score) || 0
          : 0
      if (score > 0) {
        if (!scoresByAgent[se.agentId]) scoresByAgent[se.agentId] = []
        scoresByAgent[se.agentId].push(score)
      }
    }

    for (const [agentId, scores] of Object.entries(scoresByAgent)) {
      if (agentStats[agentId]) {
        agentStats[agentId].avgScore = Math.round(
          (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
        ) / 10
      }
    }

    return NextResponse.json({ agentStats })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[/api/agents/execution-stats GET]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
