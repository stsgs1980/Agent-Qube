'use client'

import { Workflow, Play, Eye, Trash2, Loader2, Clock, Gauge, Settings2, Hand } from 'lucide-react'
import { TRIGGER_ICONS, WORKFLOW_STATUS_STYLES, successRateColor, type WorkflowData } from './workflow-types'
import { MiniPipeline } from './workflow-node'
import { ExecutionHistory } from './workflow-history'
import { ExpandedPipelineView } from './workflow-expanded-view'

function TriggerIconDisplay({ type }: { type: string }) {
  const Icon = TRIGGER_ICONS[type] || Hand
  return <Icon size={10} style={{ color: '#0891B2' }} />
}

export function WorkflowCard({
  workflow, isExpanded, onToggle, onRun, onViewHistory, onDelete, running,
}: {
  workflow: WorkflowData
  isExpanded: boolean
  onToggle: () => void
  onRun: () => void
  onViewHistory: (workflowId: string, execId: string) => void
  onDelete: () => void
  running: boolean
}) {
  const statusStyle = WORKFLOW_STATUS_STYLES[workflow.status] || WORKFLOW_STATUS_STYLES.draft
  const rateColor = successRateColor(workflow.stats.successRate)

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(45,45,45,0.3)',
        border: `1px solid ${isExpanded ? 'rgba(6,182,212,0.3)' : 'rgba(51,51,51,0.5)'}`,
        boxShadow: isExpanded ? '0 0 20px rgba(6,182,212,0.08)' : 'none',
      }}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-xs truncate">{workflow.name}</h3>
              <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0"
                style={{ background: statusStyle.bg, color: statusStyle.text }}>{statusStyle.label}</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: '#64748B' }}>{workflow.description}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }} title="Delete workflow">
              <Trash2 size={10} style={{ color: '#EF4444' }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onRun() }} disabled={running || workflow.status === 'draft'}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)' }} title="Run workflow">
              {running ? <Loader2 size={11} className="animate-spin" style={{ color: '#06B6D4' }} />
                : <Play size={11} style={{ color: '#06B6D4' }} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggle() }}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)' }} title="View pipeline">
              {isExpanded ? <Eye size={11} style={{ color: '#06B6D4' }} /> : <Eye size={11} style={{ color: '#64748B' }} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <TriggerIconDisplay type={workflow.triggerType} />
            <span className="text-[9px] capitalize" style={{ color: '#0891B2' }}>{workflow.triggerType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Workflow size={10} style={{ color: '#64748B' }} />
            <span className="text-[9px]" style={{ color: '#64748B' }}>{workflow.stepCount} steps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge size={10} style={{ color: rateColor }} />
            <span className="text-[9px] font-bold" style={{ color: rateColor }}>{workflow.stats.successRate}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 size={10} style={{ color: '#475569' }} />
            <span className="text-[9px]" style={{ color: '#475569' }}>{workflow.stats.totalExecutions} runs</span>
          </div>
        </div>

        <MiniPipeline steps={workflow.steps} />

        {workflow.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {workflow.tags.map((tag) => (
              <span key={tag} className="text-[7px] px-1.5 py-0.5 rounded font-medium"
                style={{ background: 'rgba(6,182,212,0.08)', color: '#0891B2', border: '1px solid rgba(6,182,212,0.1)' }}>{tag}</span>
            ))}
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(51,51,51,0.3)' }}>
            <h4 className="text-white font-semibold text-[10px] mb-2 flex items-center gap-1.5">
              <Clock size={10} style={{ color: '#64748B' }} /> Recent Executions
            </h4>
            <ExecutionHistory executions={workflow.recentExecutions} workflowId={workflow.id} onViewDetails={onViewHistory} />
          </div>
        )}
      </div>

      {isExpanded && <ExpandedPipelineView workflow={workflow} onRun={onRun} running={running} />}
    </div>
  )
}
