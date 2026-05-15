import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'

export async function GET() {
  const data = readFileSync('/home/z/my-project/src/data/recipes.json', 'utf-8')
  return NextResponse.json(JSON.parse(data))
}
