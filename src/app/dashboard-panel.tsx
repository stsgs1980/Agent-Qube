'use client'

import { useState, useCallback } from 'react'
import {
  DashboardHeader, DashboardSidebar, KPIStrip, StatusDistributionCard,
  TopPerformersCard, SystemHealthCard, NetworkActivityChart,
  RecentActivityTimeline, ConnectionHeatmap, FormulaAgentMappingGrid,
  WorkflowStatsSection, AgentEditModal,
} from '@/components/dashboard'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { VersionBadge } from '@/components/ui/version-badge'
import { APP_NAME } from '@/lib/version'
import { useAgentEdit } from '@/hooks/use-agent-edit'
import { useDashboardWs } from '@/hooks/use-dashboard-ws'

export default function DashboardPanel({ onOpenHierarchy, onOpenWorkflows }: { onOpenHierarchy: () => void; onOpenWorkflows?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const data = useDashboardData()
  const edit = useAgentEdit(data.statsData, data.handleRefresh)
  const { wsConnected } = useDashboardWs(useCallback(() => { data.fetchStatsRef.current() }, [data.fetchStatsRef]))

  if (data.loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#06B6D4', borderRightColor: '#06B6D4',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>Loading dashboard data...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      <style>{`
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(6, 182, 212, 0); } 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); } }
      `}</style>

      <DashboardHeader onOpenHierarchy={onOpenHierarchy} onOpenWorkflows={onOpenWorkflows} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onRefresh={data.handleRefresh} wsConnected={wsConnected} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} agentListProp={data.agentList} roleGroupsProp={data.roleGroups} onAgentClick={edit.handleAgentClick} />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 20,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.08) transparent',
          }}
        >
          {/* Live indicator */}
          {data.statsData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ position: 'relative', width: 6, height: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  position: 'absolute', width: 6, height: 6, borderRadius: '50%',
                  background: '#22D3EE', animation: 'pulseGlow 2s ease-in-out infinite',
                }} />
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22D3EE', position: 'relative', zIndex: 1 }} />
              </span>
              <span style={{ fontSize: 9, color: '#64748B' }}>Live data</span>
              <span style={{ fontSize: 9, color: '#4B5563' }}>•</span>
              <span style={{ fontSize: 9, color: '#64748B' }} suppressHydrationWarning>
                Updated {data.lastUpdated || '—'}
              </span>
            </div>
          )}

          {/* KPI Strip */}
          <KPIStrip quickStats={data.quickStats} />

          {/* Row 1 — Status / Performers / Health */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            marginTop: 12,
          }}>
            <StatusDistributionCard statusDistribution={data.statusDistribution} />
            <TopPerformersCard topPerformersProp={data.topPerformers} roleGroupsProp={data.roleGroups} />
            <SystemHealthCard />
          </div>

          {/* Row 2 — Network chart (2/3) + Timeline (1/3) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 12,
            marginTop: 12,
          }}>
            <NetworkActivityChart data={data.networkActivityData} />
            <RecentActivityTimeline events={data.activityEvents} />
          </div>

          {/* Row 3 — Heatmap (1/3) + Formula mapping (2/3) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 12,
            marginTop: 12,
          }}>
            <ConnectionHeatmap data={data.connectionHeatmapData} />
            <FormulaAgentMappingGrid />
          </div>

          {/* Row 4 — Workflows full width */}
          <div style={{ marginTop: 4 }}>
            <WorkflowStatsSection workflowsData={data.workflowsData} onOpenWorkflows={onOpenWorkflows} />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px',
        background: '#0A0A0A',
        borderTop: '1px solid rgba(51,51,51,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', color: '#64748B' }}>{APP_NAME}</span>
          <VersionBadge />
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '2px 6px', borderRadius: '9999px',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 4px rgba(34,197,94,0.4)',
            }} />
            <span style={{ fontSize: 8, fontWeight: 700, color: '#22C55E', letterSpacing: '0.5px' }}>ONLINE</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 9, color: '#4B5563' }} suppressHydrationWarning>
            {data.lastUpdated ? `Updated ${data.lastUpdated}` : '—'}
          </span>
          <span style={{ fontSize: 9, color: '#3F3F46' }}>•</span>
          <span style={{ fontSize: 9, color: '#4B5563' }}>26 agents</span>
          <span style={{ fontSize: 9, color: '#3F3F46' }}>•</span>
          <span style={{ fontSize: 9, color: '#4B5563' }}>Next.js 16 + Turbopack</span>
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