import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { resolvePromptingMeta, resolveFormulaMeta, resolveSystemPrompt } from '@/lib/agent-helpers'
import { AgentCreateSchema, validateRequest } from '@/lib/validation'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeRelations = searchParams.get('include') === 'true'

    const agents = await db.agent.findMany({
      ...(includeRelations && {
        include: {
          children: { select: { id: true, name: true, status: true } },
          tasks: { select: { id: true, title: true, status: true } },
        },
      }),
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validation = validateRequest(AgentCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const [promptingMeta, formulaMeta, generatedSystemPrompt] = await Promise.all([
      resolvePromptingMeta(validation.data.role, validation.data.description),
      resolveFormulaMeta(validation.data.formula),
      resolveSystemPrompt(validation.data.role),
    ])

    const agent = await db.agent.create({
      data: {
        name: validation.data.name,
        role: validation.data.role,
        roleGroup: validation.data.roleGroup,
        status: validation.data.status,
        formula: validation.data.formula,
        parentId: validation.data.parentId || null,
        twinId: validation.data.twinId || null,
        skills: validation.data.skills,
        description: validation.data.description,
        avatar: validation.data.avatar,
      },
    })

    return NextResponse.json({
      ...agent,
      prompting: { ...promptingMeta, formulaMeta, generatedSystemPrompt },
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
