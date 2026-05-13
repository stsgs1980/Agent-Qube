'use client'

import {
  ChevronLeft, ChevronRight, Activity, Shield, Zap,
  Settings2, Beaker, Loader2, RefreshCw, Cpu,
} from 'lucide-react'
import {
  WORKFLOW_STATUS_STYLES, TRIGGER_ICONS, ACTION_ICONS, ACTION_COLORS,
  successRateColor, type WorkflowData,
} from './workflow-types'
import { SidebarSection } from './workflow-sidebar-section'

export function WorkflowSidebar({
  sidebarOpen, setSidebarOpen, pipelineStats, workflows,
  filterStatus, setFilterStatus, filterTrigger, setFilterTrigger,
  seeding, onSeed, onRefresh,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  pipelineStats: { total: number; active: number; draft: number; totalSteps: number; totalExecutions: number; avgSuccessRate: number }
  workflows: WorkflowData[]
  filterStatus: string | null; setFilterStatus: (v: string | null) => void
  filterTrigger: string | null; setFilterTrigger: (v: string | null) => void
  seeding: boolean; onSeed: () => void; onRefresh: () => void
}) {
  return (
    <div className="flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300 relative"
      style={{ width: sidebarOpen ? 280 : 48, background: '#0D0D0D', borderRight: '1px solid rgba(51,51,51,0.3)' }}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-8 rounded-r-md flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ right: -20, background: '#0D0D0D', border: '1px solid rgba(51,51,51,0.4)', borderLeft: 'none' }}>
        {sidebarOpen ? <ChevronLeft size={10} style={{ color: '#06B6D4' }} /> : <ChevronRight size={10} style={{ color: '#06B6D4' }} />}
      </button>
      <div className="flex-1 overflow-y-auto pt-2 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {sidebarOpen ? <SidebarOpenContent pipelineStats={pipelineStats} workflows={workflows} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterTrigger={filterTrigger} setFilterTrigger={setFilterTrigger} seeding={seeding} onSeed={onSeed} /> : (
          <div className="flex flex-col items-center gap-3 pt-2">
            <button onClick={onRefresh} className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.3)' }} title="Refresh"><RefreshCw size={11} style={{ color: '#64748B' }} /></button>
            <button onClick={onSeed} disabled={seeding} className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }} title="Seed Demo Workflows">
              {seeding ? <Loader2 size={11} className="animate-spin" style={{ color: '#06B6D4' }} /> : <Beaker size={11} style={{ color: '#06B6D4' }} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SidebarOpenContent(props: any) {
  const { pipelineStats, workflows, filterStatus, setFilterStatus, filterTrigger, setFilterTrigger, seeding, onSeed } = props
  return (
    <>
      <SidebarSection icon={<Activity size={11} style={{ color: '#06B6D4' }} />} title="Pipeline Stats" count={pipelineStats.total}>
        <div className="space-y-2">
          {[{ label: 'Total Workflows', value: pipelineStats.total, color: '#06B6D4' }, { label: 'Active', value: pipelineStats.active, color: '#22C55E' }, { label: 'Draft', value: pipelineStats.draft, color: '#64748B' }, { label: 'Total Steps', value: pipelineStats.totalSteps, color: '#0891B2' }, { label: 'Total Executions', value: pipelineStats.totalExecutions, color: '#0E7490' }, { label: 'Avg Success Rate', value: `${pipelineStats.avgSuccessRate}%`, color: successRateColor(pipelineStats.avgSuccessRate) }].map(s => (
            <div key={s.label} className="flex items-center justify-between"><span className="text-[9px]" style={{ color: '#64748B' }}>{s.label}</span><span className="text-[9px] font-bold" style={{ color: s.color }}>{s.value}</span></div>
          ))}
        </div>
      </SidebarSection>
      <div className="mx-3 my-2" style={{ borderTop: '1px solid rgba(51,51,51,0.2)' }} />
      <SidebarSection icon={<Shield size={11} style={{ color: '#06B6D4' }} />} title="Filter by Status">
        <div className="space-y-1">
          <button onClick={() => setFilterStatus(null)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[9px] text-left transition-colors hover:bg-white/[0.02]" style={{ background: !filterStatus ? 'rgba(6,182,212,0.1)' : 'transparent', color: !filterStatus ? '#06B6D4' : '#64748B', border: `1px solid ${!filterStatus ? 'rgba(6,182,212,0.2)' : 'transparent'}` }}>All Statuses</button>
          {Object.entries(WORKFLOW_STATUS_STYLES).map(([key, style]) => (
            <button key={key} onClick={() => setFilterStatus(filterStatus === key ? null : key)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[9px] text-left transition-colors hover:bg-white/[0.02]" style={{ background: filterStatus === key ? `${style.text}15` : 'transparent', color: filterStatus === key ? style.text : '#64748B', border: `1px solid ${filterStatus === key ? `${style.text}30` : 'transparent'}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: style.text }} />{style.label}<span className="ml-auto" style={{ color: '#475569' }}>{workflows.filter((w: any) => w.status === key).length}</span>
            </button>
          ))}
        </div>
      </SidebarSection>
      <SidebarSection icon={<Zap size={11} style={{ color: '#06B6D4' }} />} title="Filter by Trigger">
        <div className="space-y-1">
          <button onClick={() => setFilterTrigger(null)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[9px] text-left transition-colors hover:bg-white/[0.02]" style={{ background: !filterTrigger ? 'rgba(6,182,212,0.1)' : 'transparent', color: !filterTrigger ? '#06B6D4' : '#64748B', border: `1px solid ${!filterTrigger ? 'rgba(6,182,212,0.2)' : 'transparent'}` }}>All Types</button>
          {(['manual', 'event', 'schedule', 'webhook', 'agent'] as const).map(type => { const Icon = TRIGGER_ICONS[type]; return (
            <button key={type} onClick={() => setFilterTrigger(filterTrigger === type ? null : type)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[9px] text-left transition-colors hover:bg-white/[0.02]" style={{ background: filterTrigger === type ? 'rgba(6,182,212,0.1)' : 'transparent', color: filterTrigger === type ? '#06B6D4' : '#64748B', border: `1px solid ${filterTrigger === type ? 'rgba(6,182,212,0.2)' : 'transparent'}` }}>
              <Icon size={9} style={{ color: '#0891B2' }} />{type}<span className="ml-auto" style={{ color: '#475569' }}>{workflows.filter((w: any) => w.triggerType === type).length}</span>
            </button>
          )})}
        </div>
      </SidebarSection>
      <div className="mx-3 my-2" style={{ borderTop: '1px solid rgba(51,51,51,0.2)' }} />
      <SidebarSection icon={<Settings2 size={11} style={{ color: '#06B6D4' }} />} title="Action Types" defaultOpen={false}>
        <div className="space-y-1.5">{Object.entries(ACTION_COLORS).map(([action, color]) => { const Icon = ACTION_ICONS[action] || Cpu; return (
          <div key={action} className="flex items-center gap-2"><div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${color}15` }}><Icon size={9} style={{ color }} /></div><span className="text-[9px] capitalize" style={{ color }}>{action}</span></div>
        )})}</div>
      </SidebarSection>
      <div className="mx-3 my-2" style={{ borderTop: '1px solid rgba(51,51,51,0.2)' }} />
      <SidebarSection icon={<Beaker size={11} style={{ color: '#06B6D4' }} />} title="Quick Actions" defaultOpen={false}>
        <div className="space-y-2"><button onClick={onSeed} disabled={seeding} className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[9px] font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}>{seeding ? <Loader2 size={10} className="animate-spin" /> : <Beaker size={10} />}{seeding ? 'Seeding...' : 'Seed Demo Workflows'}</button></div>
      </SidebarSection>
    </>
  )
}
