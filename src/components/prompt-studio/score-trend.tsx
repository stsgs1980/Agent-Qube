'use client'

import { useMemo } from 'react'

export function ScoreTrend({ history }: { history: Array<{ avgScore: number; createdAt: string }> }) {
  const points = useMemo(() => {
    if (history.length < 2) return null
    const w = 200, h = 40, pad = 4
    const scores = history.map(e => e.avgScore)
    const min = Math.min(...scores), max = Math.max(...scores)
    const range = max - min || 1
    return scores.map((s, i) => ({
      x: pad + (i / (scores.length - 1)) * (w - pad * 2),
      y: h - pad - ((s - min) / range) * (h - pad * 2),
      score: s,
    }))
  }, [history])

  if (!points) return <p className="text-[11px]" style={{ color: '#475569' }}>Need more data (2+ entries)</p>

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line}L${points[points.length - 1].x},40L${points[0].x},40Z`

  return (
    <svg viewBox="0 0 200 40" className="w-full" style={{ height: 40 }}>
      <path d={area} fill="rgba(6,182,212,0.1)" />
      <path d={line} fill="none" stroke="#06B6D4" strokeWidth={1.5} strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2} fill="#06B6D4" />)}
    </svg>
  )
}
