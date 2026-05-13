'use client'

import { useState } from 'react'
import { Workflow, Play, Loader2, FileJson, CornerDownLeft, Cpu } from 'lucide-react'
import { ACTION_COLORS, ACTION_ICONS } from './workflow-types'
import type { WorkflowData } from './workflow-types'
import { PipelineStepNode } from './workflow-node'
import { PipelineArrow, FeedbackLoopArrow } from './workflow-edge'
import { DataContractCard } from './workflow-contracts'

export function ExpandedPipelineView({
  workflow, onRun, running,
}: {
  workflow: WorkflowData
  onRun: () => void
  running: boolean
}) {
  const [showDataContracts, setShowDataContracts] = useState(false)

  const feedbackLoops = workflow.steps
    .map((step, i) => ({ step, index: i }))
    .filter(({ step }) => step.fallbackStepId)

  return (
    <div className="rounded-xl p-4 sm:p-6 mt-3 overflow-x-auto"
      style={{ background: 'rgba(45,45,45,0.3)', border: '1px solid rgba(51,51,51,0.5)' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold text-xs flex items-center gap-2">
          <Workflow size={12} style={{ color: '#06B6D4' }} /> Pipeline Steps
        </h4>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDataContracts(!showDataContracts)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: showDataContracts ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showDataContracts ? 'rgba(6,182,212,0.3)' : 'rgba(51,51,51,0.4)'}`,
              color: showDataContracts ? '#06B6D4' : '#64748B',
            }}>
            <FileJson size={10} /> Data Contracts
          </button>
          <button onClick={onRun} disabled={running || workflow.status === 'draft'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
            {running ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
            {running ? 'Running...' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-0 min-w-max pb-2">
          {workflow.steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <PipelineStepNode step={step} />
              {i < workflow.steps.length - 1 && <PipelineArrow />}
            </div>
          ))}
        </div>
        {feedbackLoops.map(({ step, index }) => {
          const fallbackIdx = workflow.steps.findIndex(s => s.id === step.fallbackStepId)
          if (fallbackIdx < 0) return null
          return <FeedbackLoopArrow key={`feedback-${step.id}`} fromIndex={index} toIndex={fallbackIdx} stepWidth={90} />
        })}
      </div>

      {showDataContracts && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(51,51,51,0.3)' }}>
          <h5 className="text-white font-semibold text-[10px] mb-3 flex items-center gap-1.5">
            <FileJson size={10} style={{ color: '#06B6D4' }} /> Data Contracts
          </h5>
          <div className="space-y-2">
            {workflow.steps.map((step, i) => {
              if (i === workflow.steps.length - 1) return null
              return <DataContractCard key={`contract-${i}`} prevStep={step} nextStep={workflow.steps[i + 1]} stepIndex={i + 1} />
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(51,51,51,0.3)' }}>
        {Object.entries(ACTION_COLORS).map(([action, color]) => {
          const Icon = ACTION_ICONS[action] || Cpu
          return (
            <div key={action} className="flex items-center gap-1.5">
              <Icon size={9} style={{ color }} />
              <span className="text-[8px] capitalize" style={{ color }}>{action}</span>
            </div>
          )
        })}
        {feedbackLoops.length > 0 && (
          <div className="flex items-center gap-1.5">
            <CornerDownLeft size={9} style={{ color: '#EAB308' }} />
            <span className="text-[8px]" style={{ color: '#EAB308' }}>feedback</span>
          </div>
        )}
      </div>
    </div>
  )
}
