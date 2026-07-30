import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { TaskCreateSchema, validateRequest } from '@/lib/validation'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const where: Record<string, unknown> = {}
    if (agentId) where.agentId = agentId
    if (status) where.status = status
    if (priority) where.priority = priority

    const tasks = await db.task.findMany({
      where,
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateRequest(TaskCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Verify agent exists if agentId provided
    if (validation.data.agentId) {
      const agent = await db.agent.findUnique({ where: { id: validation.data.agentId } })
      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }
    }

    const task = await db.task.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        status: validation.data.status,
        priority: validation.data.priority,
        agentId: validation.data.agentId || null,
      },
      include: { agent: true },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
