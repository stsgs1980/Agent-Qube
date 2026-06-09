'use client'

import { useState, useCallback } from 'react'
import {
  DashboardHeader, DashboardSidebar, KPIStrip, StatusDistributionCard,
  TopPerformersCard, SystemHealthCard, NetworkActivityChart,
  RecentActivityTimeline, ConnectionHeatmap, FormulaAgentMappingGrid,
  WorkflowStatsSection, AgentEditModal,
} from '@/components/dashboard'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAgentEdit } from '@/hooks/use-agent-edit'
import { useDashboardWs } from '@/hooks/use-dashboard-ws'

export default function DashboardPanel({ onOpenHierarchy, onOpenWorkflows }: { onOpenHierarchy: () => void; onOpenWorkflows?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const data = useDashboardData()
  const edit = useAgentEdit(data.statsData, data.handleRefresh)
  const { wsConnected } = useDashboardWs(useCallback(() => { data.fetchStatsRef.current() }, [data.fetchStatsRef]))

  if (data.loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center" style={{ background: '#000000' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-transparent" style={{ borderTopColor: '#06B6D4', borderRightColor: '#06B6D4', animation: 'spin 1s linear infinite' }} />
          </div>
          <div className="text-[#64748B] text-sm font-medium">Loading dashboard data...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#000000' }}>
      <style>{`
        .activity-scroll::-webkit-scrollbar { width: 4px; }
        .activity-scroll::-webkit-scrollbar-track { background: transparent; }
        .activity-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .activity-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(6, 182, 212, 0); } 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); } }
      `}</style>

      <DashboardHeader onOpenHierarchy={onOpenHierarchy} onOpenWorkflows={onOpenWorkflows} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onRefresh={data.handleRefresh} wsConnected={wsConnected} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} agentListProp={data.agentList} roleGroupsProp={data.roleGroups} onAgentClick={edit.handleAgentClick} />
        <main className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          {data.statsData && (
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#22D3EE' }} /><span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#22D3EE' }} /></span>
              <span className="text-[9px] text-[#64748B]">Live data</span>
              <span className="text-[9px] text-[#4B5563]">•</span>
              <span className="text-[9px] text-[#64748B]" suppressHydrationWarning>Updated {data.lastUpdated || '—'}</span>
            </div>
          )}
          <KPIStrip quickStats={data.quickStats} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            <StatusDistributionCard statusDistribution={data.statusDistribution} />
            <TopPerformersCard topPerformersProp={data.topPerformers} roleGroupsProp={data.roleGroups} />
            <SystemHealthCard />
            <div className="xl:col-span-2"><NetworkActivityChart data={data.networkActivityData} /></div>
            <RecentActivityTimeline events={data.activityEvents} />
            <ConnectionHeatmap data={data.connectionHeatmapData} />
            <div className="xl:col-span-2"><FormulaAgentMappingGrid /></div>
          </div>
          <div className="mt-6"><WorkflowStatsSection workflowsData={data.workflowsData} onOpenWorkflows={onOpenWorkflows} /></div>
        </main>
      </div>

      <footer className="flex-shrink-0 flex items-center justify-between px-5 py-2" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(51,51,51,0.3)' }}>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold tracking-wider" style={{ color: '#64748B' }}>Agent Qube</span>
          <span className="text-[9px]" style={{ color: '#4B5563' }}>v5.2</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} /><span className="text-[8px] font-bold" style={{ color: '#22C55E' }}>ONLINE</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px]" style={{ color: '#4B5563' }} suppressHydrationWarning>{data.lastUpdated ? `Updated ${data.lastUpdated}` : '—'}</span>
          <span className="text-[9px]" style={{ color: '#3F3F46' }}>•</span>
          <span className="text-[9px]" style={{ color: '#4B5563' }}>26 agents</span>
          <span className="text-[9px]" style={{ color: '#3F3F46' }}>•</span>
          <span className="text-[9px]" style={{ color: '#4B5563' }}>Next.js 16 + Turbopack</span>
        </div>
      </footer>

      <AgentEditModal
        editingAgent={edit.editingAgent} setEditingAgent={edit.setEditingAgent}
        editForm={edit.editForm} setEditForm={edit.setEditForm}
        editSaving={edit.editSaving} editDeleting={edit.editDeleting}
        showDeleteConfirm={edit.showDeleteConfirm} setShowDeleteConfirm={edit.setShowDeleteConfirm}
        handleEditSave={edit.handleEditSave} handleEditDelete={edit.handleEditDelete}
      />
    </div>
  )
}
