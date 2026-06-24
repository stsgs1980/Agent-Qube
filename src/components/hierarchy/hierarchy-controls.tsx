'use client'

import React from 'react'
import { Search, LayoutGrid, Circle, Grid3X3, Layers, ArrowUpDown, ZoomIn, ZoomOut, Maximize2, Crosshair } from 'lucide-react'
import { EDGE_CONFIG, type EdgeType, type ViewMode } from './types'

const VIEW_MODES = [
  { mode: 'hierarchy' as const, Icon: LayoutGrid, label: 'Hierarchy' },
  { mode: 'radial' as const, Icon: Circle, label: 'Radial' },
  { mode: 'grid' as const, Icon: Grid3X3, label: 'Grid' },
]

function ViewModeButtons({ viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (m: ViewMode) => void }) {
  return (
    <>
      {VIEW_MODES.map(({ mode, Icon, label }) => (
        <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: viewMode === mode ? 'rgba(6,182,212,0.06)' : 'transparent', border: viewMode === mode ? '1px solid rgba(6,182,212,0.15)' : '1px solid transparent', color: viewMode === mode ? '#06B6D4' : '#555', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Icon size={9} />{label}
        </button>
      ))}
    </>
  )
}

function SearchBox({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', border: '1px solid rgba(51,51,51,0.25)', borderRadius: 6, padding: '3px 8px', flex: '1 1 120px', maxWidth: 180, minWidth: 120 }}>
      <Search size={10} color="#555" />
      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search agents..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 10, width: '100%' }} />
      <span style={{ fontSize: 8, color: '#555', background: 'rgba(51,51,51,0.4)', padding: '1px 4px', borderRadius: 3 }}>Cmd+K</span>
    </div>
  )
}

function EdgeFilterToggles({ visibleEdgeTypes, toggleEdgeType }: { visibleEdgeTypes: Set<EdgeType>; toggleEdgeType: (t: EdgeType) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {(Object.entries(EDGE_CONFIG) as [EdgeType, typeof EDGE_CONFIG[EdgeType]][]).map(([type, cfg]) => (
        <button key={type} onClick={() => toggleEdgeType(type)} style={{ padding: '2px 6px', borderRadius: 3, fontSize: 8, fontWeight: 600, cursor: 'pointer', color: cfg.color, opacity: visibleEdgeTypes.has(type) ? 1 : 0.35, background: visibleEdgeTypes.has(type) ? `${cfg.color}10` : 'transparent', border: visibleEdgeTypes.has(type) ? `1px solid ${cfg.color}30` : '1px solid transparent', transition: 'opacity 0.2s' }}>{cfg.label}</button>
      ))}
    </div>
  )
}

function ZoomControls({ reactFlowInstanceRef, fitMode, selectedAgentId, handleFitView, handleFocus }: { reactFlowInstanceRef: React.MutableRefObject<any>; fitMode: boolean; selectedAgentId: string | null; handleFitView: () => void; handleFocus: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <button onClick={() => reactFlowInstanceRef.current?.zoomIn({ duration: 300 })} style={{ padding: '3px 5px', borderRadius: 3, background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(51,51,51,0.3)', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Zoom In"><ZoomIn size={11} /></button>
      <button onClick={() => reactFlowInstanceRef.current?.zoomOut({ duration: 300 })} style={{ padding: '3px 5px', borderRadius: 3, background: 'rgba(13,13,13,0.95)', border: '1px solid rgba(51,51,51,0.3)', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Zoom Out"><ZoomOut size={11} /></button>
      <div style={{ width: 1, height: 14, background: 'rgba(51,51,51,0.25)', margin: '0 2px' }} />
      <button onClick={handleFitView} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: fitMode ? 'rgba(6,182,212,0.1)' : 'rgba(13,13,13,0.95)', border: fitMode ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(51,51,51,0.3)', color: fitMode ? '#06B6D4' : '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, textTransform: 'uppercase', transition: 'all 0.15s' }} title={fitMode ? 'Fit mode ON' : 'Fit mode OFF'}><Maximize2 size={9} />Fit<span style={{ fontSize: 7, opacity: 0.7, marginLeft: 1 }}>{fitMode ? 'ON' : 'OFF'}</span></button>
      <button onClick={handleFocus} style={{ padding: '3px 8px', borderRadius: 4, background: selectedAgentId ? 'rgba(6,182,212,0.06)' : 'rgba(13,13,13,0.95)', border: selectedAgentId ? '1px solid rgba(6,182,212,0.15)' : '1px solid rgba(51,51,51,0.3)', color: selectedAgentId ? '#06B6D4' : '#555', cursor: selectedAgentId ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 600, textTransform: 'uppercase' }} title="Focus on selected node"><Crosshair size={9} />Focus</button>
    </div>
  )
}

export function HierarchyControls({ viewMode, setViewMode, showLayers, setShowLayers, searchQuery, setSearchQuery, visibleEdgeTypes, toggleEdgeType, fitMode, selectedAgentId, handleFitView, handleFocus, reactFlowInstanceRef }: {
  viewMode: ViewMode; setViewMode: (m: ViewMode) => void; showLayers: boolean; setShowLayers: (s: boolean) => void
  searchQuery: string; setSearchQuery: (q: string) => void; visibleEdgeTypes: Set<EdgeType>; toggleEdgeType: (t: EdgeType) => void
  fitMode: boolean; selectedAgentId: string | null; handleFitView: () => void; handleFocus: () => void; reactFlowInstanceRef: React.MutableRefObject<any>
}) {
  return (
    <div style={{ background: '#0A0A0A', borderBottom: '1px solid rgba(51,51,51,0.25)', padding: '0 20px', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <ViewModeButtons viewMode={viewMode} setViewMode={setViewMode} />
        <div style={{ width: 1, height: 16, background: 'rgba(51,51,51,0.25)', margin: '0 4px' }} />
        <button onClick={() => setShowLayers(!showLayers)} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: showLayers ? 'rgba(6,182,212,0.06)' : 'transparent', border: showLayers ? '1px solid rgba(6,182,212,0.15)' : '1px solid transparent', color: showLayers ? '#06B6D4' : '#555', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 3 }} title="Toggle layer labels"><Layers size={9} />Layers</button>
        <button onClick={() => {
          const m = viewMode
          setViewMode('grid')
          setTimeout(() => setViewMode(m), 50)
        }} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: 'transparent', border: '1px solid transparent', color: '#555', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 3 }} title="Re-layout"><ArrowUpDown size={9} />Layout</button>
        <div style={{ width: 1, height: 16, background: 'rgba(51,51,51,0.25)', margin: '0 4px' }} />
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div style={{ width: 1, height: 16, background: 'rgba(51,51,51,0.25)', margin: '0 4px' }} />
        <EdgeFilterToggles visibleEdgeTypes={visibleEdgeTypes} toggleEdgeType={toggleEdgeType} />
      </div>
      <ZoomControls reactFlowInstanceRef={reactFlowInstanceRef} fitMode={fitMode} selectedAgentId={selectedAgentId} handleFitView={handleFitView} handleFocus={handleFocus} />
    </div>
  )
}