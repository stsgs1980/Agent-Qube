import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { WorkflowCreateSchema, validateRequest } from '@/lib/validation'

// ─── Response formatting ──────────────────────────────────────────────────

function formatWorkflowResponse(wf: Record<string, unknown>) {
  const totalExecutions = (wf._count as Record<string, number>).executions
  const executions = wf.executions as Array<Record<string, unknown>>
  const completedExecutions = executions.filter((e) => e.status === 'completed').length
  const runningExecutions = executions.filter((e) => e.status === 'running').length
  const failedExecutions = executions.filter((e) => e.status === 'failed').length

  const steps = wf.steps as Array<Record<string, unknown>>

  return {
    id: wf.id, name: wf.name, description: wf.description,
    status: wf.status, triggerType: wf.triggerType,
    triggerConfig: JSON.parse(wf.triggerConfig as string), version: wf.version,
    tags: wf.tags ? (wf.tags as string).split(',').filter(Boolean) : [],
    createdAt: wf.createdAt, updatedAt: wf.updatedAt,
    stepCount: steps.length,
    steps: steps.map((s) => ({
      id: s.id, order: s.order, name: s.name, agentId: s.agentId,
      roleGroup: s.roleGroup, action: s.action,
      inputSchema: JSON.parse(s.inputSchema as string), outputSchema: JSON.parse(s.outputSchema as string),
      condition: JSON.parse(s.condition as string), fallbackStepId: s.fallbackStepId,
      timeout: s.timeout, retryPolicy: JSON.parse(s.retryPolicy as string),
      config: JSON.parse(s.config as string),
    })),
    stats: {
      totalExecutions, completedExecutions, runningExecutions, failedExecutions,
      successRate: totalExecutions > 0 ? Math.round((completedExecutions / totalExecutions) * 100) : 0,
    },
    recentExecutions: executions,
  }
}

// ─── GET /api/workflows ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    const triggerType = req.nextUrl.searchParams.get('triggerType')

    const where: Record<string, string> = {}
    if (status) where.status = status
    if (triggerType) where.triggerType = triggerType

    const workflows = await db.workflow.findMany({
      where,
      include: {
        steps: { orderBy: { order: 'asc' } },
        executions: {
          take: 5, orderBy: { startedAt: 'desc' },
          select: { id: true, status: true, startedAt: true, completedAt: true },
        },
        _count: { select: { executions: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ workflows: workflows.map(formatWorkflowResponse) })
  } catch (error) {
    console.error('[/api/workflows GET]', error)
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 })
  }
}

// ─── POST /api/workflows ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validation = validateRequest(WorkflowCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, description, triggerType, triggerConfig, tags, steps } = validation.data

    const workflow = await db.workflow.create({
      data: {
        name: name.trim(), description: description || '',
        status: 'draft', triggerType: triggerType || 'manual',
        triggerConfig: JSON.stringify(triggerConfig || {}),
        tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
        steps: steps?.length
          ? {
              create: steps.map((s, i: number) => ({
                order: s.order ?? i, name: s.name || `Step ${i + 1}`,
                agentId: s.agentId || null, roleGroup: s.roleGroup || null,
                action: s.action || 'process',
                inputSchema: JSON.stringify(s.inputSchema || {}),
                outputSchema: JSON.stringify(s.outputSchema || {}),
                condition: JSON.stringify(s.condition || {}),
                fallbackStepId: s.fallbackStepId || null,
                timeout: s.timeout || 300,
                retryPolicy: JSON.stringify(s.retryPolicy || {}),
                config: JSON.stringify(s.config || {}),
              })),
            }
          : undefined,
      },
      include: { steps: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json({ workflow }, { status: 201 })
  } catch (error) {
    console.error('[/api/workflows POST]', error)
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 })
  }
}
