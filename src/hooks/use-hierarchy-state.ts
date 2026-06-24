'use client'

import { useState, useCallback, useEffect, type MutableRefObject } from 'react'
import { type Node } from '@xyflow/react'
import { EDGE_CONFIG, type EdgeType, type ViewMode } from '@/components/hierarchy/types'
import { createKeyboardHandler } from './use-hierarchy-state-helpers'

function useEdgeToggle() {
  const [visibleEdgeTypes, setVisibleEdgeTypes] = useState<Set<EdgeType>>(
    new Set(Object.entries(EDGE_CONFIG).filter(([, v]) => v.defaultVisible).map(([k]) => k as EdgeType)),
  )
  const toggleEdgeType = useCallback((type: EdgeType) => {
    setVisibleEdgeTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }, [])
  return { visibleEdgeTypes, toggleEdgeType }
}

export function useHierarchyState(reactFlowInstanceRef: MutableRefObject<any>) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)
  const [fitMode, setFitMode] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { visibleEdgeTypes, toggleEdgeType } = useEdgeToggle()
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy')
  const [showLayers, setShowLayers] = useState(true)
  const [showAddAgent, setShowAddAgent] = useState(false)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
      setSelectedAgentId(node.id);
      setFitMode(false);
      setDetailPanelOpen(true)
  }, [])

  const onPaneClick = useCallback(() => setSelectedAgentId(null), [])

  const handleSidebarSelect = useCallback((id: string) => {
      setSelectedAgentId(id);
      setFitMode(false);
      setDetailPanelOpen(true)
  }, [])

  const handleFocus = useCallback(() => {
    if (selectedAgentId && reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({ nodes: [{ id: selectedAgentId }], padding: 0.3, duration: 500 })
    }
  }, [selectedAgentId, reactFlowInstanceRef])

  const handleFitView = useCallback(() => {
    setFitMode(prev => {
      const next = !prev;
      if (next) setDetailPanelOpen(false);
      return next;
    } )
  }, [])

  useEffect(() => {
    if (fitMode && reactFlowInstanceRef.current) {
      const timer = setTimeout(() => reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 500 }), 500)
      return () => clearTimeout(timer)
    }
  }, [fitMode, detailPanelOpen, reactFlowInstanceRef])

  useEffect(() => {
    const handler = createKeyboardHandler(setSelectedAgentId, setActiveFilter)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return {
    selectedAgentId, setSelectedAgentId, activeFilter, setActiveFilter,
    searchQuery, setSearchQuery, visibleEdgeTypes, toggleEdgeType,
    viewMode, setViewMode, showLayers, setShowLayers,
    detailPanelOpen, setDetailPanelOpen, fitMode, setFitMode,
    showAddAgent, setShowAddAgent, onNodeClick, onPaneClick,
    handleSidebarSelect, handleFocus, handleFitView,
  }
}