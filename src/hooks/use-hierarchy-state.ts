'use client'

import { useState, useCallback, useEffect, type MutableRefObject } from 'react'
import { type Node } from '@xyflow/react'
import { ROLE_ORDER, EDGE_CONFIG, type EdgeType, type ViewMode } from '@/components/hierarchy/types'

// ─── UI state + callbacks for agent hierarchy ───────────────────────────────────

export function useHierarchyState(reactFlowInstanceRef: MutableRefObject<any>) {
  // Selection state (3 useState)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [fitMode, setFitMode] = useState(true)

  // Filter / view state (5 useState)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleEdgeTypes, setVisibleEdgeTypes] = useState<Set<EdgeType>>(
    new Set(Object.entries(EDGE_CONFIG).filter(([, v]) => v.defaultVisible).map(([k]) => k as EdgeType))
  )
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy')
  const [showLayers, setShowLayers] = useState(true)

  // Modal toggle (1 useState)
  const [showAddAgent, setShowAddAgent] = useState(false)

  // Selection callbacks
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedAgentId(node.id); setFitMode(false); setDetailPanelOpen(true)
  }, [])

  const onPaneClick = useCallback(() => setSelectedAgentId(null), [])

  const handleSidebarSelect = useCallback((id: string) => {
    setSelectedAgentId(id); setFitMode(false); setDetailPanelOpen(true)
  }, [])

  const handleFocus = useCallback(() => {
    if (selectedAgentId && reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({ nodes: [{ id: selectedAgentId }], padding: 0.3, duration: 500 })
    }
  }, [selectedAgentId, reactFlowInstanceRef])

  const handleFitView = useCallback(() => {
    setFitMode(prev => { const next = !prev; if (next) setDetailPanelOpen(false); return next })
  }, [])

  const toggleEdgeType = useCallback((type: EdgeType) => {
    setVisibleEdgeTypes(prev => { const next = new Set(prev); if (next.has(type)) { next.delete(type) } else { next.add(type) } return next })
  }, [])

  // Fit view when fitMode or panel state changes
  useEffect(() => {
    if (fitMode && reactFlowInstanceRef.current) {
      const timer = setTimeout(() => reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 500 }), 500)
      return () => clearTimeout(timer)
    }
  }, [fitMode, detailPanelOpen, reactFlowInstanceRef])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key === 'Escape') { setSelectedAgentId(null); return }
      if (e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key) - 1
        if (index < ROLE_ORDER.length) {
          const group = ROLE_ORDER[index]
          setActiveFilter(prev => prev === group ? null : group)
        }
        return
      }
      if (e.key === '9') { setActiveFilter(null); return }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    selectedAgentId, setSelectedAgentId,
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    visibleEdgeTypes, toggleEdgeType,
    viewMode, setViewMode,
    showLayers, setShowLayers,
    detailPanelOpen, setDetailPanelOpen,
    fitMode, setFitMode,
    showAddAgent, setShowAddAgent,
    onNodeClick, onPaneClick, handleSidebarSelect, handleFocus, handleFitView,
  }
}
