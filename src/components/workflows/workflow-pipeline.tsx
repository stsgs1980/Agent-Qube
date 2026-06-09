'use client'

import { Workflow, Plus, Loader2, Beaker, RefreshCw, ArrowLeft, Cpu, Search, Network, X } from 'lucide-react'
import type { WorkflowPipelineProps } from './workflow-types'
import { useWorkflowData } from '@/hooks/use-workflow-data'
import { useWorkflowState } from '@/hooks/use-workflow-state'
import { WorkflowCard } from './workflow-card'
import { ExecutionModal } from './workflow-execution-modal'
import { CreateWorkflowDialog } from './workflow-create-dialog'
import { DeleteConfirmDialog } from './workflow-delete-dialog'
import { WorkflowSidebar } from './workflow-sidebar'
import { LoadingSkeleton, EmptyState, EmptyStateFull } from './workflow-empty-states'

const KEYFRAMES = `@keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(6,182,212,0.4)}70%{box-shadow:0 0 0 8px rgba(6,182,212,0)}100%{box-shadow:0 0 0 0 rgba(6,182,212,0)}}@keyframes feedbackPulse{0%,100%{opacity:0.7;stroke-width:1.5}50%{opacity:1;stroke-width:2.5}}`

export default function WorkflowPipeline({ fullPage, onBack, onOpenHierarchy }: WorkflowPipelineProps) {
  const data = useWorkflowData()
  const state = useWorkflowState(data.workflows)
  const onRun = async (id: string) => { const exec = await data.handleRun(id); if (exec) state.setExecutionModal({ execution: exec, workflow: data.workflows.find(w => w.id === id) || null }) }
  const onViewHistory = async (wid: string, eid: string) => { const exec = await data.handleViewHistory(wid, eid); if (exec) state.setExecutionModal({ execution: exec, workflow: data.workflows.find(w => w.id === wid) || null }) }
  const onDelete = (id: string) => data.handleDelete(id).then(() => state.setDeleteTarget(null))

  const modals = (
    <>
      {state.executionModal.execution && <ExecutionModal execution={state.executionModal.execution} workflow={state.executionModal.workflow} onClose={() => state.setExecutionModal({ execution: null, workflow: null })} />}
      {state.showCreateDialog && <CreateWorkflowDialog onClose={() => state.setShowCreateDialog(false)} onCreated={data.fetchWorkflows} />}
      {state.deleteTarget && <DeleteConfirmDialog workflowName={state.deleteTarget.name} onConfirm={() => onDelete(state.deleteTarget!.id)} onCancel={() => state.setDeleteTarget(null)} />}
    </>
  )

  if (fullPage) return (
    <div className="h-screen bg-black">
      <style>{KEYFRAMES}</style>
      <div className="w-full h-full flex flex-col relative overflow-hidden select-none">
        <div className="relative z-40 flex items-center h-12 flex-shrink-0 px-4 gap-4" style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(51,51,51,0.5)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #06B6D4, transparent)' }} />
          <div className="flex items-center gap-2 flex-shrink-0">
            {onBack && <button onClick={onBack} className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)' }} title="Back"><ArrowLeft size={13} style={{ color: '#06B6D4' }} /></button>}
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)' }}><Cpu size={13} style={{ color: '#06B6D4' }} /></div>
            <span className="text-[11px] font-bold" style={{ color: '#06B6D4' }}>Agent Qube</span><span className="text-[9px]" style={{ color: '#475569' }}>|</span><span className="text-[10px] font-medium text-white">Workflow Pipeline</span>
          </div>
          <div className="flex-1 max-w-xs mx-auto"><div className="relative"><Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} /><input type="text" value={state.searchQuery} onChange={(e) => state.setSearchQuery(e.target.value)} placeholder="Search workflows..." className="w-full pl-7 pr-3 py-1.5 rounded-md text-[10px] text-white outline-none" style={{ background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(51,51,51,0.4)' }} onFocus={(e) => e.target.style.borderColor = 'rgba(6,182,212,0.4)'} onBlur={(e) => e.target.style.borderColor = 'rgba(51,51,51,0.4)'} /></div></div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onOpenHierarchy && <button onClick={onOpenHierarchy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-medium transition-all duration-200 hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}><Network size={10} />Hierarchy</button>}
            <button onClick={data.fetchWorkflows} className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-180" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)' }} title="Refresh"><RefreshCw size={11} style={{ color: '#64748B' }} /></button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <WorkflowSidebar sidebarOpen={state.sidebarOpen} setSidebarOpen={state.setSidebarOpen} pipelineStats={state.pipelineStats} workflows={data.workflows} filterStatus={state.filterStatus} setFilterStatus={state.setFilterStatus} filterTrigger={state.filterTrigger} setFilterTrigger={state.setFilterTrigger} seeding={data.seeding} onSeed={data.handleSeed} onRefresh={data.fetchWorkflows} />
          <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2"><span className="w-1 h-4 rounded-full" style={{ background: '#06B6D4' }} /><Workflow size={14} style={{ color: '#06B6D4' }} />Workflows<span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}>{state.filteredWorkflows.length}</span></h2>
                {(state.filterStatus || state.filterTrigger || state.searchQuery) && <button onClick={() => { state.setFilterStatus(null); state.setFilterTrigger(null); state.setSearchQuery('') }} className="flex items-center gap-1 px-2 py-1 rounded-md text-[8px] transition-all duration-200 hover:scale-105" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', color: '#EAB308' }}><X size={8} />Clear filters</button>}
              </div>
              <button onClick={() => state.setShowCreateDialog(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold transition-all duration-200 hover:scale-105" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}><Plus size={10} />New Workflow</button>
            </div>
            {data.loading ? <LoadingSkeleton /> : state.filteredWorkflows.length === 0 ? <EmptyStateFull workflows={data.workflows} seeding={data.seeding} onSeed={data.handleSeed} /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{state.filteredWorkflows.map((wf) => <WorkflowCard key={wf.id} workflow={wf} isExpanded={state.expandedId === wf.id} onToggle={() => state.toggleExpand(wf.id)} onRun={() => onRun(wf.id)} onViewHistory={onViewHistory} onDelete={() => state.setDeleteTarget(wf)} running={data.runningIds.has(wf.id)} />)}</div>
            )}
          </div>
        </div>
        {modals}
      </div>
    </div>
  )

  if (data.loading) return <div className="rounded-xl p-6" style={{ background: 'rgba(45,45,45,0.3)', border: '1px solid rgba(51,51,51,0.5)' }}><div className="flex items-center gap-3 mb-4"><Workflow size={14} style={{ color: '#06B6D4' }} /><h2 className="text-white font-semibold text-sm">Workflow Pipeline</h2></div><LoadingSkeleton /></div>

  return (
    <div className="rounded-xl p-4 sm:p-6" style={{ background: 'rgba(45,45,45,0.3)', border: '1px solid rgba(51,51,51,0.5)' }}>
      <style>{KEYFRAMES}</style>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm flex items-center gap-2"><span className="w-1 h-4 rounded-full" style={{ background: '#06B6D4' }} /><Workflow size={14} style={{ color: '#06B6D4' }} />Workflow Pipeline<span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}>{data.workflows.length}</span></h2>
        <div className="flex items-center gap-2">
          <button onClick={() => state.setShowCreateDialog(true)} className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium transition-all duration-200 hover:scale-105" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}><Plus size={9} />New</button>
          <button onClick={data.handleSeed} disabled={data.seeding} className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>{data.seeding ? <Loader2 size={9} className="animate-spin" /> : <Beaker size={9} />}{data.seeding ? 'Seeding...' : 'Seed'}</button>
          <button onClick={data.fetchWorkflows} className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] transition-all duration-200 hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}><RefreshCw size={9} />Refresh</button>
        </div>
      </div>
      {data.workflows.length === 0 ? <EmptyState seeding={data.seeding} onSeed={data.handleSeed} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{data.workflows.map((wf) => <WorkflowCard key={wf.id} workflow={wf} isExpanded={state.expandedId === wf.id} onToggle={() => state.toggleExpand(wf.id)} onRun={() => onRun(wf.id)} onViewHistory={onViewHistory} onDelete={() => state.setDeleteTarget(wf)} running={data.runningIds.has(wf.id)} />)}</div>
      )}
      {modals}
    </div>
  )
}
