import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Direct PrismaClient instantiation for this route to avoid global cache issues
const prisma = new PrismaClient({ log: ['error'] })

// ─── GET /api/prompt-history — last 50 prompts ordered by createdAt desc ──

export async function GET() {
  try {
    const history = await prisma.promptHistory.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ history })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch history'
    console.error('[/api/prompt-history GET]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// ─── POST /api/prompt-history — save a new prompt history entry ────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, intent, confidence, formula, avgScore, verdict, stepCount, executionId } = body

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const entry = await prisma.promptHistory.create({
      data: {
        prompt: prompt.trim(),
        intent: intent || '',
        confidence: typeof confidence === 'number' ? Math.min(100, Math.max(0, confidence)) : 0,
        formula: formula || '',
        avgScore: typeof avgScore === 'number' ? Math.min(100, Math.max(0, avgScore)) : 0,
        verdict: verdict || '',
        stepCount: typeof stepCount === 'number' ? stepCount : 0,
        executionId: executionId || null,
      },
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to save history'
    console.error('[/api/prompt-history POST]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// ─── DELETE /api/prompt-history — delete a prompt history entry by id ───

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.promptHistory.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete history'
    console.error('[/api/prompt-history DELETE]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
