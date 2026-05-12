import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are a layout advisor AI for @stsgs/ui component library. Your job is to parse a user's natural language description of what they want to build and extract structured layout context parameters.

You MUST respond with ONLY valid JSON (no markdown, no explanation). The JSON must have this exact shape:

{
  "goal": "<one of: landing | dashboard-app | blog | ecommerce | documentation | portfolio | social | media | saas | crm | analytics | admin-panel>",
  "contentType": "<one of: cards | text | data | media | forms | mixed>",
  "itemCount": <number 1-50>,
  "needsSidebar": <boolean>,
  "needsHeader": <boolean>,
  "needsFooter": <boolean>,
  "confidence": <number 0-100>,
  "detected": ["<list of what you detected from the prompt>"],
  "explanation": "<brief explanation of your choices>"
}

Rules:
- goal: What KIND of project is this? Landing pages, dashboards, blogs, etc.
- contentType: What type of CONTENT will dominate? Cards/grids, text/articles, data/charts, media/images, forms/inputs, or mixed.
- itemCount: How many content items? If user says "catalog" or "many", guess 24-50. If "a few", guess 3-6. If single page, 1.
- needsSidebar: True for dashboards, docs, admin, CRM. False for landing, portfolio, media.
- needsHeader: True for most pages. False for login/auth pages.
- needsFooter: True for blogs, e-commerce, docs, landing. False for dashboards, admin.
- confidence: How confident are you in your parsing? 0-100.
- detected: List of keywords/concepts you found.
- explanation: One sentence explaining your reasoning.

If the prompt is vague (like "create something"), make reasonable defaults and set low confidence.
If the prompt is specific, set high confidence.
Support both English and Russian prompts.`

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const zai = await getZAI()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt.trim() },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    try {
      let jsonStr = content
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }

      const parsed = JSON.parse(jsonStr)

      // Validate the required fields
      const validGoals = ['landing', 'dashboard-app', 'blog', 'ecommerce', 'documentation', 'portfolio', 'social', 'media', 'saas', 'crm', 'analytics', 'admin-panel']
      const validContentTypes = ['cards', 'text', 'data', 'media', 'forms', 'mixed']

      if (!validGoals.includes(parsed.goal)) parsed.goal = 'landing'
      if (!validContentTypes.includes(parsed.contentType)) parsed.contentType = 'cards'
      parsed.itemCount = Math.max(1, Math.min(50, Number(parsed.itemCount) || 6))
      parsed.needsSidebar = Boolean(parsed.needsSidebar)
      parsed.needsHeader = Boolean(parsed.needsHeader)
      parsed.needsFooter = Boolean(parsed.needsFooter)
      parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 50))

      return NextResponse.json({
        success: true,
        source: 'llm',
        result: parsed,
      })
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        raw: content,
      })
    }
  } catch (error) {
    console.error('Interpret prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
