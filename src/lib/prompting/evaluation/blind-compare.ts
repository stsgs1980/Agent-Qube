/**
 * @stsgs/prompting -- Blind Comparison Engine
 * Compare two prompts without knowing which is A or B.
 * Returns a winner with detailed reasoning and per-dimension deltas.
 */

import type { PromptScore, BlindCompareResult } from '../core/types'
import { scorePrompt } from './scoring'

// ─── Comparison Logic ────────────────────────────────────────

/**
 * Blind-compare two prompts and determine which is better.
 * The comparison is based on weighted scores across all 6 dimensions.
 *
 * @param promptA - First prompt text
 * @param promptB - Second prompt text
 * @returns BlindCompareResult with winner, reason, scores, and deltas
 */
export function blindCompare(promptA: string, promptB: string): BlindCompareResult {
  const scoreA = scorePrompt(promptA)
  const scoreB = scorePrompt(promptB)

  // Calculate per-dimension deltas (A - B, positive = A is better)
  const deltas: Record<string, number> = {}
  for (let i = 0; i < scoreA.dimensions.length; i++) {
    const dimA = scoreA.dimensions[i]
    const dimB = scoreB.dimensions[i]
    deltas[dimA.name] = dimA.score - dimB.score
  }

  // Determine winner
  const diff = scoreA.numeric - scoreB.numeric
  let winner: 'a' | 'b' | 'tie'

  if (Math.abs(diff) <= 3) {
    winner = 'tie'
  } else {
    winner = diff > 0 ? 'a' : 'b'
  }

  // Generate reason
  const reason = generateCompareReason(scoreA, scoreB, winner, deltas)

  return {
    winner,
    reason,
    scores: { a: scoreA, b: scoreB },
    deltas,
  }
}

/**
 * Generate a human-readable comparison reason.
 */
function generateCompareReason(
  scoreA: PromptScore,
  scoreB: PromptScore,
  winner: 'a' | 'b' | 'tie',
  deltas: Record<string, number>
): string {
  if (winner === 'tie') {
    const avgScore = Math.round((scoreA.numeric + scoreB.numeric) / 2)
    return `Both prompts are roughly equivalent (avg: ${avgScore}/100). ` +
      `Consider combining the strongest aspects of each.`
  }

  const winnerScore = winner === 'a' ? scoreA : scoreB
  const loserScore = winner === 'a' ? scoreB : scoreA
  const winnerLabel = winner.toUpperCase()

  // Find the dimensions where the winner excels most
  const dimDeltas = Object.entries(deltas).sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
  const topDeltas = dimDeltas.slice(0, 3)

  const strengths = topDeltas
    .filter(([, delta]) => (winner === 'a' ? delta > 0 : delta < 0))
    .map(([name, delta]) => `${name} (${winner === 'a' ? '+' : ''}${delta})`)
    .join(', ')

  return `Prompt ${winnerLabel} wins (${winnerScore.numeric} vs ${loserScore.numeric}). ` +
    `Key advantages: ${strengths}. ` +
    `Winner grade: ${winnerScore.overall}, Loser grade: ${loserScore.overall}.`
}

/**
 * Compare multiple prompts and return a ranked list.
 *
 * @param prompts - Array of prompt texts to compare
 * @returns Array sorted from best to worst with scores
 */
export function rankPrompts(prompts: string[]): Array<{ index: number; prompt: string; score: PromptScore }> {
  return prompts
    .map((prompt, index) => ({ index, prompt, score: scorePrompt(prompt) }))
    .sort((a, b) => b.score.numeric - a.score.numeric)
}

/**
 * Find the weakest dimension across prompts and suggest improvements.
 */
export function findWeakestLink(prompts: string[]): string {
  const scores = prompts.map(p => scorePrompt(p))
  const dimNames = scores[0]?.dimensions.map(d => d.name) ?? []

  let weakestDim = ''
  let lowestAvg = Infinity

  for (const name of dimNames) {
    const avg = scores.reduce((sum, s) => {
      const dim = s.dimensions.find(d => d.name === name)
      return sum + (dim?.score ?? 0)
    }, 0) / scores.length

    if (avg < lowestAvg) {
      lowestAvg = avg
      weakestDim = name
    }
  }

  return weakestDim
}
