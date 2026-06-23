'use client'

import { ROLE_CONFIG } from '@/components/hierarchy/types'
import type { PipelineStepDraft } from '@/hooks/use-prompt-analysis'
import { ArrowRight, Loader2, Zap } from 'lucide-react'

interface PipelinePreviewProps {
  steps: PipelineStepDraft[]
  executing: boolean
  onExecute: () => void
}

export function PipelinePreview({ steps, executing, onExecute }: PipelinePreviewProps) {
  return (
    <div className="space-y-5 mt-6">
      <SectionLabel>Generated Pipeline</SectionLabel>

      <div className="rounded-xl p-5" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.3)' }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {steps.map((step, i) => {
            const config = ROLE_CONFIG[step.roleGroup] || ROLE_CONFIG.Execution
            return (
              <div key={step.order} className="flex items-center gap-2 flex-shrink-0">
                <StepCard step={step} index={i} config={config} />
                {i < steps.length - 1 && <ArrowRight size={16} style={{ color: '#334155' }} className="flex-shrink-0" />}
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs" style={{ color: '#64748B' }}>{steps.length} steps</span>
            <span className="text-xs" style={{ color: '#334155' }}>|</span>
            <span className="text-xs" style={{ color: '#64748B' }}>{new Set(steps.map((s) => s.agentName)).size} agents</span>
          </div>
          <button
            onClick={onExecute}
            disabled={executing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}
          >
            {executing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {executing ? 'Executing...' : 'Execute'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────

function StepCard({ step, index, config }: { step: PipelineStepDraft; index: number; config: { color: string; colorRgb: string; label: string } }) {
  const actionColors: Record<string, { bg: string; text: string }> = {
    process: { bg: 'rgba(6,182,212,0.08)', text: '#06B6D4' },
    review: { bg: 'rgba(234,179,8,0.08)', text: '#EAB308' },
    transform: { bg: 'rgba(139,92,246,0.08)', text: '#8B5CF6' },
    decision: { bg: 'rgba(34,197,94,0.08)', text: '#22C55E' },
    delegate: { bg: 'rgba(249,115,22,0.08)', text: '#F97316' },
    broadcast: { bg: 'rgba(236,72,153,0.08)', text: '#EC4899' },
  }
  const ac = actionColors[step.action] || actionColors.process

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg min-w-[96px]" style={{ background: `rgba(${config.colorRgb},0.05)`, border: `1px solid rgba(${config.colorRgb},0.15)` }}>
      <div className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `rgba(${config.colorRgb},0.2)`, color: config.color }}>{index + 1}</span>
        <span className="text-xs font-semibold text-white">{step.name}</span>
      </div>
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: ac.bg, color: ac.text, border: `1px solid ${ac.text}22` }}>{step.action}</span>
      <span className="text-[11px] text-center leading-tight" style={{ color: config.color }}>{step.agentName}</span>
      <span className="text-[10px]" style={{ color: '#475569' }}>{step.formulaName}</span>
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
