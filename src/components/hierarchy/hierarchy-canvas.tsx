'use client'

import React from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { AgentNode } from './agent-node'
import { AgentEdge } from './agent-edge'
import { LayerLabels } from './layer-labels'
import { ROLE_CONFIG, type AgentData, type ViewMode } from './types'
import type { Node, Edge } from '@xyflow/react'

const nodeTypes = { agentNode: AgentNode }
const edgeTypes = { agentEdge: AgentEdge }

// ─── ReactFlow canvas with MiniMap, Background, layer labels ───────────────────

export function HierarchyCanvas({
  nodes, edges, onNodesChange, onEdgesChange,
  onNodeClick, onPaneClick, reactFlowInstanceRef, reactFlowWrapper,
  viewMode, showLayers, agents, layerPositions,
}: {
  nodes: Node[]; edges: Edge[]
  onNodesChange: any; onEdgesChange: any
  onNodeClick: any; onPaneClick: any
  reactFlowInstanceRef: React.MutableRefObject<any>
  reactFlowWrapper: React.RefObject<HTMLDivElement | null>
  viewMode: ViewMode; showLayers: boolean
  agents: AgentData[]
  layerPositions: Record<number, { minY: number; maxY: number }>
}) {
  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick} onPaneClick={onPaneClick}
        nodeTypes={nodeTypes} edgeTypes={edgeTypes}
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance
          setTimeout(() => instance.fitView({ padding: 0.15, duration: 500 }), 300)
        }}
        fitView={false} fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2} maxZoom={3}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#000' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={40} size={0.5} color="rgba(51,51,51,0.3)" />
        <MiniMap
          nodeColor={node => {
            const data = node.data as AgentData
            const cfg = ROLE_CONFIG[data?.roleGroup] || ROLE_CONFIG['Execution']
            return cfg.color
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(51,51,51,0.3)', borderRadius: 8 }}
        />
        {viewMode === 'hierarchy' && showLayers && (
          <LayerLabels agents={agents} layerPositions={layerPositions} />
        )}
      </ReactFlow>
    </div>
  )
}
