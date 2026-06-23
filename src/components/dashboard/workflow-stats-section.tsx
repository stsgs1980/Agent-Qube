'use client'

import { Workflow, ChevronRight } from 'lucide-react'
import { CollapsibleSection } from './collapsible-section'

const STATUS_COLORS: Record<string, string> = {
  active: '#22D3EE', draft: '#64748B', paused: '#EAB308', completed: '#06B6D4', error: '#F43F5E',
}

const STEP_COLOR_MAP: Record<string, string> = {
  process: '#06B6D4', validate: '#22D3EE', delegate: '#0891B2', aggregate: '#0E7490',
  analyze: '#67E8F9', report: '#155E75', alert: '#EAB308', resolve: '#06B6D4',
  verify: '#22D3EE', learn: '#164E63', search: '#0891B2', index: '#0E7490',
  distribute: '#155E75', request: '#67E8F9', route: '#06B6D4', code: '#22D3EE',
  review: '#0891B2', test: '#0E7490', deploy: '#06B6D4', collect: '#67E8F9',
  evaluate: '#0891B2',
}

export function WorkflowStatsSection({ workflowsData, onOpenWorkflows }: { workflowsData: any; onOpenWorkflows?: () => void }) {
  const workflows = workflowsData?.workflows || []
  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter((w: any) => w.status === 'active').length
  const totalExecutions = workflows.reduce((sum: number, w: any) => sum + (w.stats?.totalExecutions || 0), 0)
  const workflowsWithExecutions = workflows.filter((w: any) => (w.stats?.totalExecutions || 0) > 0)
  const avgSuccessRate = workflowsWithExecutions.length > 0
    ? Math.round(workflowsWithExecutions.reduce((sum: number, w: any) => sum + (w.stats?.successRate || 0), 0) / workflowsWithExecutions.length)
    : 0

  const summaryCards = [
    { label: 'Total Workflows', value: totalWorkflows, color: '#06B6D4' },
    { label: 'Active', value: activeWorkflows, color: '#22D3EE' },
    { label: 'Total Executions', value: totalExecutions, color: '#0891B2' },
    { label: 'Avg Success Rate', value: avgSuccessRate + '%', color: avgSuccessRate >= 80 ? '#22D3EE' : '#EAB308' },
  ]

  return (
    <CollapsibleSection title="Workflow Pipeline" icon={<Workflow className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />} count={totalWorkflows} accentColor="#06B6D4" defaultOpen={true} dataSrc="src/components/dashboard/workflow-stats-section.tsx">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-lg p-3.5 relative overflow-hidden" style={{ background: 'rgba(13, 13, 13, 0.8)', border: '1px solid rgba(51, 51, 51, 0.4)' }}>
            <div className="absolute left-0 top-0 bottom-0 rounded-l-lg" style={{ width: 2, background: card.color, opacity: 0.6 }} />
            <div className="text-[10px] text-[#64748B] mb-1 ml-2">{card.label}</div>
            <div className="text-lg font-bold ml-2" style={{ color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6,182,212,0.35) transparent' }}>
        {workflows.length === 0 && (
          <div className="text-center py-8">
            <Workflow className="w-8 h-8 mx-auto mb-2" style={{ color: '#4B5563' }} />
            <p className="text-[11px] text-[#64748B]">No workflows found</p>
            <p className="text-[9px] text-[#4B5563]">Create workflows from the Workflow Pipeline view</p>
          </div>
        )}
        {workflows.map((wf: any) => {
          const wfStatusColor = STATUS_COLORS[wf.status] || '#64748B'
          const steps = wf.steps || []
          return (
            <div key={wf.id} className="rounded-lg p-4 relative overflow-hidden transition-all duration-200 hover:border-opacity-70"
              style={{ background: 'rgba(13, 13, 13, 0.6)', border: '1px solid rgba(51, 51, 51, 0.35)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${wfStatusColor}44`; e.currentTarget.style.boxShadow = `0 0 12px ${wfStatusColor}10` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51,51,51,0.35)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white truncate">{wf.name}</span>
                    <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${wfStatusColor}18`, color: wfStatusColor, border: `1px solid ${wfStatusColor}30` }}>{wf.status}</span>
                  </div>
                  <p className="text-[9px] text-[#64748B] mt-0.5 truncate">{wf.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right"><div className="text-[9px] text-[#64748B]">Executions</div><div className="text-[11px] font-bold" style={{ color: '#06B6D4' }}>{wf.stats?.totalExecutions || 0}</div></div>
                  <div className="text-right"><div className="text-[9px] text-[#64748B]">Success</div><div className="text-[11px] font-bold" style={{ color: (wf.stats?.successRate || 0) >= 80 ? '#22D3EE' : (wf.stats?.totalExecutions || 0) > 0 ? '#EAB308' : '#64748B' }}>{(wf.stats?.totalExecutions || 0) > 0 ? `${wf.stats.successRate}%` : '—'}</div></div>
                </div>
              </div>
              <div className="flex items-center gap-0 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {steps.map((step: any, idx: number) => {
                  const actionKey = step.action || 'process'
                  const dotColor = STEP_COLOR_MAP[actionKey] || '#06B6D4'
                  const isLast = idx === steps.length - 1
                  return (
                    <div key={step.id || idx} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: `${dotColor}20`, border: `1.5px solid ${dotColor}`, boxShadow: `0 0 6px ${dotColor}30` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
                        </span>
                        <span className="text-[7px] text-[#64748B] mt-1 text-center truncate w-12" title={step.name}>{step.name.length > 8 ? step.name.substring(0, 7) + '...' : step.name}</span>
                      </div>
                      {!isLast && <div className="flex-shrink-0" style={{ width: 16, height: 1, background: `linear-gradient(90deg, ${dotColor}, ${STEP_COLOR_MAP[steps[idx + 1]?.action || 'process'] || '#06B6D4'})`, opacity: 0.4 }} />}
                    </div>
                  )
                })}
              </div>
              {wf.tags && wf.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {wf.tags.map((tag: string) => (<span key={tag} className="text-[7px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.08)', color: '#64748B', border: '1px solid rgba(51,51,51,0.3)' }}>{tag}</span>))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {onOpenWorkflows && (
        <div className="mt-4 flex justify-center">
          <button onClick={onOpenWorkflows} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.03]"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.15)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)' }}
          >
            <Workflow className="w-3.5 h-3.5" />View Workflows<ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </CollapsibleSection>
  )
}
