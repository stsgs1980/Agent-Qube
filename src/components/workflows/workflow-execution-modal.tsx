'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, X, ChevronDown } from 'lucide-react'
import { STATUS_COLORS, ACTION_COLORS, formatDuration } from './workflow-types'
import type { ExecutionData, WorkflowData } from './workflow-types'
import { PipelineStepNode } from './workflow-node'
import { PipelineArrow, FeedbackLoopArrow } from './workflow-edge'
import { TaskContextTimeline } from './workflow-timeline'
import { StepMessages } from './workflow-step-messages'
import { useExecutionAnimation } from '@/hooks/use-execution-animation'

export function ExecutionModal({
  execution, workflow, onClose,
}: {
  execution: ExecutionData | null
  workflow: WorkflowData | null
  onClose: () => void
}) {
  const [showMessages, setShowMessages] = useState<string | null>(null)
  const { animatingStep, visibleSteps } = useExecutionAnimation(execution, workflow)

  if (!execution || !workflow) return null

  const finalStatus = execution.status
  const isCompleted = finalStatus === 'completed'
  const isFailed = finalStatus === 'failed'
  const feedbackLoops = workflow.steps.map((step, i) => ({ step, index: i })).filter(({ step }) => step.fallbackStepId)
  const hasActiveFeedback = execution.steps.some(s => s.status === 'waiting_feedback')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{
          background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.5)',
          boxShadow: `0 0 40px ${isCompleted ? 'rgba(34,197,94,0.1)' : isFailed ? 'rgba(239,68,68,0.1)' : 'rgba(6,182,212,0.1)'}`,
        }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: '#0A0A0A', borderBottom: '1px solid rgba(51,51,51,0.3)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${isCompleted ? '#22C55E' : isFailed ? '#EF4444' : '#06B6D4'}20` }}>
              {isCompleted ? <CheckCircle2 size={16} style={{ color: '#22C55E' }} />
                : isFailed ? <XCircle size={16} style={{ color: '#EF4444' }} />
                : <Loader2 size={16} className="animate-spin" style={{ color: '#06B6D4' }} />}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{workflow.name}</h3>
              <p className="text-[10px]" style={{ color: '#64748B' }}>
                Execution {execution.id.substring(0, 8)} &middot; {formatDuration(execution.startedAt, execution.completedAt)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(51,51,51,0.3)', border: '1px solid rgba(51,51,51,0.4)' }}>
            <X size={14} style={{ color: '#888' }} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-x-auto relative">
          <div className="flex items-center gap-0 min-w-max pb-4 relative">
            {workflow.steps.map((step, i) => {
              const stepExec = execution.steps[i]
              const execStatus = stepExec?.status
              const isThisAnimating = animatingStep === i
              const isRevealed = i < visibleSteps
              if (!isRevealed) return (
                <div key={step.id} className="flex items-center">
                  <div className="w-[90px] h-[80px] rounded-lg opacity-20" style={{ background: 'rgba(51,51,51,0.2)', border: '1px dashed rgba(51,51,51,0.3)' }} />
                  {i < workflow.steps.length - 1 && <PipelineArrow />}
                </div>
              )
              return (
                <div key={step.id} className="flex items-center">
                  <PipelineStepNode step={step} execStatus={execStatus} isAnimating={isThisAnimating}
                    isHighlighted={!!execStatus && execStatus !== 'pending'} onClick={() => stepExec && setShowMessages(stepExec.id)} />
                  {i < workflow.steps.length - 1 && (
                    <PipelineArrow color={execStatus === 'completed' ? STATUS_COLORS.completed : isThisAnimating ? STATUS_COLORS.running : 'rgba(255,255,255,0.1)'}
                      animated={isThisAnimating || execStatus === 'running'} />
                  )}
                </div>
              )
            })}
            {feedbackLoops.map(({ step, index }) => {
              const fallbackIdx = workflow.steps.findIndex(s => s.id === step.fallbackStepId)
              if (fallbackIdx < 0) return null
              return <FeedbackLoopArrow key={`feedback-${step.id}`} fromIndex={index} toIndex={fallbackIdx} stepWidth={90} isActive={execution.steps[index]?.status === 'waiting_feedback' || hasActiveFeedback} />
            })}
          </div>
        </div>

        <div className="px-6 pb-3"><TaskContextTimeline taskContextStr={execution.taskContext} /></div>

        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-4"
            style={{ background: `${isCompleted ? '#22C55E' : isFailed ? '#EF4444' : '#06B6D4'}08`, border: `1px solid ${isCompleted ? '#22C55E' : isFailed ? '#EF4444' : '#06B6D4'}20` }}>
            <span className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: isCompleted ? '#22C55E' : isFailed ? '#EF4444' : '#06B6D4' }}>{finalStatus}</span>
            <span className="text-[10px]" style={{ color: '#64748B' }}>{execution.steps.filter(s => s.status === 'completed').length}/{execution.steps.length} steps completed</span>
            {execution.steps.some(s => s.status === 'waiting_feedback') && (
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#EAB30815', color: '#EAB308' }}>Feedback loop triggered</span>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            {execution.steps.map((stepExec, i) => {
              const step = workflow.steps[i]
              if (!step) return null
              const stepColor = STATUS_COLORS[stepExec.status] || '#475569'
              const isExpanded = showMessages === stepExec.id
              return (
                <div key={stepExec.id} className="rounded-lg transition-colors duration-200"
                  style={{ background: 'rgba(13,13,13,0.8)', border: `1px solid ${stepColor}20` }}>
                  <button onClick={() => setShowMessages(isExpanded ? null : stepExec.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stepColor, boxShadow: `0 0 4px ${stepColor}44` }} />
                    <span className="text-[10px] font-medium" style={{ color: stepColor }}>Step {i + 1}</span>
                    <span className="text-[10px] font-medium text-white flex-1 truncate">{step.name}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${ACTION_COLORS[step.action]}15`, color: ACTION_COLORS[step.action] }}>{step.action}</span>
                    <span className="text-[9px]" style={{ color: '#64748B' }}>{stepExec.startedAt && stepExec.completedAt ? formatDuration(stepExec.startedAt, stepExec.completedAt) : '—'}</span>
                    <ChevronDown size={12} style={{ color: '#64748B' }} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && <StepMessages stepExec={stepExec} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
