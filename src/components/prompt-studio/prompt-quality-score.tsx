'use client'

import { useMemo } from 'react'
import { scorePrompt, type PromptScore, type ScoreDimension, type Grade } from '@/lib/prompting'

const GRADE_COLORS: Record<Grade, { bg: string; color: string; border: string }> = {
  S: { bg: 'rgba(6,182,212,0.15)', color: '#06B6D4', border: 'rgba(6,182,212,0.3)' },
  A: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', border: 'rgba(34,197,94,0.3)' },
  B: { bg: 'rgba(234,179,8,0.15)', color: '#EAB308', border: 'rgba(234,179,8,0.3)' },
  C: { bg: 'rgba(249,115,22,0.15)', color: '#F97316', border: 'rgba(249,115,22,0.3)' },
  D: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  F: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
}

function barColor(grade: Grade): string {
  return GRADE_COLORS[grade].color
}

export function PromptQualityScore({ prompt }: { prompt: string }) {
  const score: PromptScore = useMemo(() => scorePrompt(prompt), [prompt])
  const gc = GRADE_COLORS[score.overall]

  return (
    <div className="space-y-5 mt-6">
      <SectionLabel>Quality Score</SectionLabel>
      <div className="rounded-xl p-5" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.3)' }}>
        {/* Top row: Grade + Numeric + Label */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black"
            style={{ background: gc.bg, color: gc.color, border: `1px solid ${gc.border}` }}>
            {score.overall}
          </div>
          <div>
            <span className="text-2xl font-black text-white">{score.numeric}</span>
            <span className="text-sm ml-1" style={{ color: '#475569' }}>/100</span>
            <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: '#64748B' }}>Quality Score</p>
          </div>
        </div>

        {/* 6 Dimension Bars */}
        <div className="space-y-3">
          {score.dimensions.map((dim: ScoreDimension) => (
            <div key={dim.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{dim.name}</span>
                <span className="text-xs font-bold" style={{ color: barColor(dim.grade) }}>{dim.score}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${dim.score}%`, background: barColor(dim.grade) }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#475569' }}>{dim.feedback}</p>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {score.suggestions.length > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(51,51,51,0.2)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#06B6D4' }}>Top Suggestions</span>
            <ul className="mt-2 space-y-1.5">
              {score.suggestions.map((s, i) => (
                <li key={i} className="text-[11px] flex items-start gap-2" style={{ color: '#94A3B8' }}>
                  <span style={{ color: '#06B6D4' }}>&bull;</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="h-px flex-1" style={{ background: 'rgba(51,51,51,0.3)' }} />
      <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#64748B' }}>{children}</span>
      <div className="h-px flex-1" style={{ background: 'rgba(51,51,51,0.3)' }} />
    </div>
  )
}
