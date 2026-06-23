'use client'

import { useLayoutTheme } from '@/lib/layout/theme'
import { colors, radius } from '@/lib/layout/tokens'

// ─── Score Radial Gauge ───────────────────────────────────────

interface ScoreGaugeProps {
  score: number
  size?: number
}

export function ScoreGauge({ score, size = 64 }: ScoreGaugeProps) {
  const { tokens } = useLayoutTheme()
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const color = score >= 70 ? tokens.accentPrimary
    : score >= 40 ? tokens.accentAI
    : '#ef4444'

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tokens.borderDefault} strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="butt"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        style={{
          fontSize: size * 0.28, fontWeight: 700,
          fontFamily: tokens.fontFamilyMono,
          fill: tokens.textPrimary,
          transform: 'rotate(90deg)', transformOrigin: 'center',
        }}>
        {score}
      </text>
    </svg>
  )
}
