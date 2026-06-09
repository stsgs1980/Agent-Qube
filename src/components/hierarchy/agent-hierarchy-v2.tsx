'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import { useNodesState, useEdgesState, type Node, type Edge } from '@xyflow/react'
import { RefreshCw, ChevronLeft } from 'lucide-react'

import { useHierarchyData } from '@/hooks/use-hierarchy-data'
import { useHierarchyState } from '@/hooks/use-hierarchy-state'
import { computeDagreLayout, computeRadialLayout, computeGridLayout } from './layout-algorithms'
import { ROLE_CONFIG } from './types'
import { HierarchyHeader } from './hierarchy-header'
import { HierarchyControls } from './hierarchy-controls'
import { HierarchyCanvas } from './hierarchy-canvas'
import { AddAgentModal } from './add-agent-modal'
import { GroupSidebar, DetailPanel, KPIStrip } from './panels'
import type { AgentData } from './types'

// ─── Thin orchestrator — composes hooks + sub-components ────────────────────────

export default function AgentHierarchy({ onBack }: { onBack?: () => void }) {
  const reactFlowInstanceRef = useRef<any>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const { agents, setAgents, loading, connections, wsConnected, fetchAgents } = useHierarchyData(reactFlowInstanceRef)
  const st = useHierarchyState(reactFlowInstanceRef)

  // Compute positions
  const positions = useMemo(() => {
    const layout = st.viewMode === 'radial' ? computeRadialLayout(agents)
      : st.viewMode === 'grid' ? computeGridLayout(agents)
      : computeDagreLayout(agents, connections)
    const map: Record<string, { x: number; y: number }> = {}
    for (const p of layout) map[p.id] = { x: p.x, y: p.y }
    return map
  }, [agents, connections, st.viewMode])

  // Search matches
  const searchMatches = useMemo(() => {
    if (!st.searchQuery.trim()) return new Set<string>()
    const q = st.searchQuery.toLowerCase()
    const matches = new Set<string>()
    for (const a of agents) {
      const sk = a.skills ? a.skills.toLowerCase() : ''
      if (a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || sk.includes(q)) matches.add(a.id)
    }
    return matches
  }, [agents, st.searchQuery])

  // Flow nodes/edges
  const flowNodes: Node[] = useMemo(() => agents.map(a => ({
    id: a.id, type: 'agentNode', position: positions[a.id] || { x: 0, y: 0 },
    data: { ...a, isHighlighted: st.searchQuery.trim() && searchMatches.has(a.id), isDimmed: (st.activeFilter && a.roleGroup !== st.activeFilter) || (st.searchQuery.trim() && !searchMatches.has(a.id)), skillCount: a.skills ? a.skills.split(',').filter(Boolean).length : 0, taskCount: Array.isArray(a.tasks) ? a.tasks.length : 0 },
    selected: a.id === st.selectedAgentId,
  })), [agents, positions, st.activeFilter, st.searchQuery, searchMatches, st.selectedAgentId])

  const flowEdges: Edge[] = useMemo(() => connections.filter(c => st.visibleEdgeTypes.has(c.type)).map(c => ({
    id: c.id, source: c.from, target: c.to, type: 'agentEdge',
    data: { edgeType: c.type, strength: c.strength, flowAnimation: true },
  })), [connections, st.visibleEdgeTypes])

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)
  useEffect(() => { setNodes(flowNodes) }, [flowNodes, setNodes])
  useEffect(() => { setEdges(flowEdges) }, [flowEdges, setEdges])

  const layerPositions = useMemo(() => {
    const ly: Record<number, { minY: number; maxY: number }> = {}
    for (const a of agents) { const cfg = ROLE_CONFIG[a.roleGroup]; if (!cfg) continue; const pos = positions[a.id]; if (!pos) continue; if (!ly[cfg.level]) ly[cfg.level] = { minY: pos.y, maxY: pos.y + 58 }; else { ly[cfg.level].minY = Math.min(ly[cfg.level].minY, pos.y); ly[cfg.level].maxY = Math.max(ly[cfg.level].maxY, pos.y + 58) } }
    return ly
  }, [agents, positions])

  const selectedAgent = useMemo(() => agents.find(a => a.id === st.selectedAgentId) || null, [agents, st.selectedAgentId])

  useEffect(() => { if (st.fitMode && reactFlowInstanceRef.current) { const t = setTimeout(() => reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 500 }), 400); return () => clearTimeout(t) } }, [agents.length, st.fitMode])

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#555', fontSize: 14, gap: 8 }}><RefreshCw size={16} color="#555" className="animate-spin" />Loading hierarchy...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      <HierarchyHeader wsConnected={wsConnected} onRefresh={fetchAgents} onAddAgent={() => st.setShowAddAgent(true)} onBack={onBack} />
      <HierarchyControls viewMode={st.viewMode} setViewMode={st.setViewMode} showLayers={st.showLayers} setShowLayers={st.setShowLayers} searchQuery={st.searchQuery} setSearchQuery={st.setSearchQuery} visibleEdgeTypes={st.visibleEdgeTypes} toggleEdgeType={st.toggleEdgeType} fitMode={st.fitMode} selectedAgentId={st.selectedAgentId} handleFitView={st.handleFitView} handleFocus={st.handleFocus} reactFlowInstanceRef={reactFlowInstanceRef} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', overflowX: 'hidden' }}>
        <div className="custom-scrollbar" style={{ overflowY: 'auto', flexShrink: 0 }}><GroupSidebar agents={agents} activeFilter={st.activeFilter} onFilterChange={st.setActiveFilter} selectedAgentId={st.selectedAgentId} onSelectAgent={st.handleSidebarSelect} /></div>
        <HierarchyCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={st.onNodeClick} onPaneClick={st.onPaneClick} reactFlowInstanceRef={reactFlowInstanceRef} reactFlowWrapper={reactFlowWrapper} viewMode={st.viewMode} showLayers={st.showLayers} agents={agents} layerPositions={layerPositions} />
        {st.fitMode && !st.detailPanelOpen ? (
          <button onClick={() => { st.setDetailPanelOpen(true); st.setFitMode(false) }} title="Open detail panel" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 24, height: 48, borderRadius: 6, border: '1px solid rgba(51,51,51,0.4)', background: 'rgba(10,10,10,0.9)', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, transition: 'color 0.15s, border-color 0.15s' }} onMouseEnter={e => { e.currentTarget.style.color = '#06B6D4'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)' }} onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(51,51,51,0.4)' }}><ChevronLeft size={12} /></button>
        ) : (
          <DetailPanel agent={selectedAgent} allAgents={agents} open={st.detailPanelOpen} onToggle={() => st.setDetailPanelOpen(prev => { const n = !prev; if (n) st.setFitMode(false); return n })} onClose={() => st.setSelectedAgentId(null)} onAgentUpdated={(u: AgentData) => setAgents(prev => prev.map(a => a.id === u.id ? u : a))} onAgentDeleted={(id: string) => { setAgents(prev => prev.filter(a => a.id !== id)); st.setSelectedAgentId(null) }} />
        )}
      </div>
      <KPIStrip agents={agents} />
      <AddAgentModal open={st.showAddAgent} onClose={() => st.setShowAddAgent(false)} onCreated={fetchAgents} />
    </div>
  )
}
