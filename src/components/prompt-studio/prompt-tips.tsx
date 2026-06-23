'use client'

import { useMemo } from 'react'
import { scorePrompt, type PromptScore } from '@/lib/prompting'
import { Target, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'

const GENERIC_TIPS = [
  { id: 'specific', icon: Target, title: 'Be Specific', desc: 'Instead of "fix bugs", say "fix null pointer in auth.ts line 42"' },
  { id: 'context', icon: TrendingUp, title: 'Add Context', desc: 'Include your tech stack, file names, or error messages' },
  { id: 'constraints', icon: Target, title: 'Set Constraints', desc: 'Specify format, language, or framework requirements' },
  { id: 'output', icon: TrendingUp, title: 'Define Output', desc: 'Tell the system what you expect as a result' },
]

export function PromptTips({ prompt }: { prompt: string }) {
  const score: PromptScore | null = useMemo(() => prompt.trim() ? scorePrompt(prompt) : null, [prompt])

  if (!score) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
      {GENERIC_TIPS.map(t => (
        <div key={t.id} className="rounded-lg p-3.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(51,51,51,0.25)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <t.icon size={14} style={{ color: '#06B6D4' }} />
            </div>
            <span className="text-xs font-semibold text-white">{t.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>{t.desc}</p>
        </div>
      ))}
    </div>
  )

  const isGood = score.numeric >= 65
  const dims = [...score.dimensions].sort((a, b) => isGood ? b.score - a.score : a.score - b.score).slice(0, 3)
  const color = isGood ? '#22C55E' : '#EF4444'
  const Icon = isGood ? CheckCircle2 : AlertTriangle

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold mb-2.5" style={{ color }}>
        {isGood ? 'Your prompt is looking good!' : 'Ways to improve your prompt'}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {dims.map(d => (
          <div key={d.name} className="rounded-lg p-3.5" style={{ background: `rgba(${isGood ? '34,197,94' : '239,68,68'},0.04)`, border: `1px solid ${color}22` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-white">{d.name}</span>
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}20`, color }}>{d.grade} {d.score}</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: '#94A3B8' }}>{d.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
