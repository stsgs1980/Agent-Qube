'use client'

import { Cpu, Timer } from 'lucide-react'
import { ACTION_COLORS, STATUS_COLORS, ACTION_ICONS, type WorkflowStep } from './workflow-types'

export function MiniPipeline({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex items-center gap-0.5 overflow-hidden">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
            style={{
              background: ACTION_COLORS[step.action] || '#475569',
              boxShadow: `0 0 4px ${ACTION_COLORS[step.action]}44`,
            }}
            title={`${step.name} (${step.action})`}
          />
          {i < steps.length - 1 && (
            <div className="w-3 h-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function StepMeta({ step, actionColor }: { step: WorkflowStep; actionColor: string }) {
  return (
    <>
      {step.roleGroup && (
        <span className="text-[7px] px-1 py-0.5 rounded font-medium"
          style={{ background: `${actionColor}15`, color: actionColor }}>
          {step.roleGroup}
        </span>
      )}
      <div className="flex items-center gap-0.5">
        <Timer size={7} style={{ color: '#64748B' }} />
        <span className="text-[7px]" style={{ color: '#64748B' }}>{step.timeout}s</span>
      </div>
    </>
  )
}

export function PipelineStepNode({
  step, execStatus, isAnimating, isHighlighted, onClick,
}: {
  step: WorkflowStep
  execStatus?: string
  isAnimating?: boolean
  isHighlighted?: boolean
  onClick?: () => void
}) {
  const actionColor = ACTION_COLORS[step.action] || '#475569'
  const statusColor = execStatus ? (STATUS_COLORS[execStatus] || '#475569') : actionColor
  const ActionIcon = ACTION_ICONS[step.action] || Cpu

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 p-2.5 rounded-lg transition-all duration-300 hover:scale-105 min-w-[90px] max-w-[120px] text-left"
      style={{
        background: isHighlighted ? `${statusColor}15` : 'rgba(13,13,13,0.8)',
        border: `1px solid ${isHighlighted ? `${statusColor}40` : 'rgba(51,51,51,0.4)'}`,
        boxShadow: isAnimating ? `0 0 12px ${statusColor}40` : isHighlighted ? `0 0 8px ${statusColor}20` : 'none',
      }}
    >
      {isAnimating && (
        <div className="absolute inset-0 rounded-lg" style={{
          border: `1.5px solid ${statusColor}`, animation: 'pulseRing 1.5s ease-out infinite',
        }} />
      )}
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: `${actionColor}20` }}>
        <ActionIcon size={12} style={{ color: actionColor }} />
      </div>
      <span className="text-[9px] font-medium text-center leading-tight truncate w-full"
        style={{ color: isHighlighted ? statusColor : '#B0B0B0' }}>
        {step.name}
      </span>
      <StepMeta step={step} actionColor={actionColor} />
      {execStatus && (
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
          background: STATUS_COLORS[execStatus], boxShadow: `0 0 4px ${STATUS_COLORS[execStatus]}44`,
        }} />
      )}
    </button>
  )
}
