'use client'

import { useState, useCallback } from 'react'
import {
  DashboardHeader, DashboardSidebar, AgentEditModal,
} from '@/components/dashboard'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAgentEdit } from '@/hooks/use-agent-edit'
import { useDashboardWs } from '@/hooks/use-dashboard-ws'
import {
  DashboardLoadingSpinner, DashboardMainContent, DashboardFooter,
  DASHBOARD_KEYFRAMES,
} from './dashboard-panel-parts'

export default function DashboardPanel({ onOpenHierarchy, onOpenWorkflows }: { onOpenHierarchy: () => void; onOpenWorkflows?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const data = useDashboardData()
  const edit = useAgentEdit(data.statsData, data.handleRefresh)
  const { wsConnected } = useDashboardWs(useCallback(() => { data.fetchStatsRef.current() }, [data.fetchStatsRef]))

  if (data.loading) return <DashboardLoadingSpinner />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      <style>{DASHBOARD_KEYFRAMES}</style>
      <DashboardHeader onOpenHierarchy={onOpenHierarchy} onOpenWorkflows={onOpenWorkflows} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onRefresh={data.handleRefresh} wsConnected={wsConnected} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} agentListProp={data.agentList} roleGroupsProp={data.roleGroups} onAgentClick={edit.handleAgentClick} />
        <DashboardMainContent data={data} onOpenWorkflows={onOpenWorkflows} />
      </div>
      <DashboardFooter lastUpdated={data.lastUpdated} />
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