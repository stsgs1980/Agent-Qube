// ─── Save execution result to prompt history via API ──────────

import type { ExecutionData } from './prompt-analysis-types'
import type { HistoryMeta } from './prompt-analysis-executor'

function parseEval(data: string): Record<string, unknown> | null {
  try { return JSON.parse(data) } catch { return null }
}

export async function savePromptHistory(
  prompt: string,
  intent: string,
  meta: HistoryMeta | undefined,
  result: ExecutionData,
) {
  const completed = result.steps.filter(s => s.status === 'completed')
  const scores = completed
    .map(s => { const e = parseEval(s.outputData); return typeof e?.score === 'number' ? e.score : null })
    .filter((s): s is number => s !== null)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const verdicts = completed
    .map(s => { const e = parseEval(s.outputData); return typeof e?.verdict === 'string' ? e.verdict : null })
    .filter((v): v is string => v !== null)
  const verdict = verdicts.length > 0 ? verdicts.sort((a, b) =>
    verdicts.filter(v => v === b).length - verdicts.filter(v => v === a).length
  )[0] : ''

  await fetch('/api/prompt-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      intent,
      confidence: meta?.confidence ?? 0,
      formula: meta?.formula ?? '',
      avgScore,
      verdict,
      stepCount: result.steps.length,
      executionId: result.id,
    }),
  })
}
