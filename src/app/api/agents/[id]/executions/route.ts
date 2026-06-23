import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/agents/[id]/executions
// Returns execution history for a specific agent,
// including stats (total runs, success rate, avg score) and recent step executions.

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params

    const agent = await db.agent.findUnique({ where: { id: agentId } })
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Fetch step executions for this agent, most recent first
    const stepExecutions = await db.stepExecution.findMany({
      where: { agentId },
      include: {
        step: { select: { id: true, name: true, action: true, order: true, workflowId: true } },
        messages: {
          select: { id: true, type: true, content: true, timestamp: true, fromAgentId: true, toAgentId: true },
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
    })

    // Extract scores from outputData JSON
    const scores: number[] = []
    const recentExecutions = stepExecutions.map(se => {
      let parsed: Record<string, unknown> = {}
      try {
        parsed = JSON.parse(se.outputData || '{}')
      } catch { /* ignore */ }

      const score = typeof parsed.score === 'number'
        ? parsed.score
        : typeof parsed.score === 'string'
          ? parseFloat(parsed.score) || 0
          : 0

      if (se.status === 'completed' && score > 0) {
        scores.push(score)
      }

      return {
        id: se.id,
        stepName: se.step?.name || 'Unknown Step',
        stepAction: se.step?.action || 'process',
        status: se.status,
        score,
        summary: typeof parsed.summary === 'string' ? parsed.summary : '',
        verdict: typeof parsed.verdict === 'string' ? parsed.verdict : '',
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        startedAt: se.startedAt,
        completedAt: se.completedAt,
        workflowId: se.step?.workflowId || null,
      }
    })

    // Compute stats
    const totalRuns = stepExecutions.length
    const completedRuns = stepExecutions.filter(se => se.status === 'completed').length
    const failedRuns = stepExecutions.filter(se => se.status === 'failed').length
    const skippedRuns = stepExecutions.filter(se => se.status === 'skipped').length
    const successRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0
    const avgScore = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0
    const lastExecutedAt = stepExecutions.length > 0
      ? stepExecutions[0].startedAt || stepExecutions[0].completedAt
      : null

    return NextResponse.json({
      agentId,
      agentName: agent.name,
      stats: {
        totalRuns,
        completedRuns,
        failedRuns,
        skippedRuns,
        successRate,
        avgScore,
        lastExecutedAt,
      },
      recentExecutions,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[/api/agents/[id]/executions GET]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
