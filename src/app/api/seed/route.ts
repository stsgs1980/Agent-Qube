import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed-data'

export async function POST() {
  // Block in production unless explicitly allowed
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
    return NextResponse.json(
      { error: 'Seed endpoint is disabled in production' },
      { status: 403 }
    )
  }

  try {
    const result = await seedDatabase()
    return NextResponse.json({
      message: 'Agents and tasks seeded successfully',
      ...result,
    })
  } catch (error) {
    console.error('Failed to seed agents:', error)
    return NextResponse.json({ error: 'Failed to seed agents' }, { status: 500 })
  }
}
