import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PromptHistoryCreateSchema, validateRequest } from '@/lib/validation'

// ─── GET /api/prompt-history — last 50 prompts ordered by createdAt desc ──

export async function GET() {
  try {
    const history = await db.promptHistory.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ history })
  } catch (error) {
    console.error('[/api/prompt-history GET]', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

// ─── POST /api/prompt-history — save a new prompt history entry ────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validation = validateRequest(PromptHistoryCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const entry = await db.promptHistory.create({
      data: {
        prompt: validation.data.prompt,
        intent: validation.data.intent,
        confidence: validation.data.confidence,
        formula: validation.data.formula,
        avgScore: validation.data.avgScore,
        verdict: validation.data.verdict,
        stepCount: validation.data.stepCount,
        executionId: validation.data.executionId || null,
      },
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('[/api/prompt-history POST]', error)
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 })
  }
}

// ─── DELETE /api/prompt-history — delete a prompt history entry by id ───

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db.promptHistory.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/prompt-history DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 })
  }
}
