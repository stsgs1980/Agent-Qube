'use client'

import React from 'react'
import { Panel } from '@xyflow/react'
import { ROLE_CONFIG, type AgentData } from './types'

// ─── Layer label definitions for DAG visualization ──────────────────────────────

const LAYER_LABELS = [
  { level: 0, label: 'L0', fullLabel: 'Strategy', color: '#67E8F9', colorRgb: '103,232,249' },
  { level: 1, label: 'L1', fullLabel: 'Tactics', color: '#22D3EE', colorRgb: '34,211,238' },
  { level: 2, label: 'L2', fullLabel: 'Control', color: '#06B6D4', colorRgb: '6,182,212' },
  { level: 3, label: 'L3', fullLabel: 'Execution', color: '#0891B2', colorRgb: '8,145,178' },
  { level: 4, label: 'L4', fullLabel: 'Support', color: '#0E7490', colorRgb: '14,116,144' },
]

// ─── Layer labels overlay Panel ─────────────────────────────────────────────────

export function LayerLabels({
  agents,
  layerPositions,
}: {
  agents: AgentData[]
  layerPositions: Record<number, { minY: number; maxY: number }>
}) {
  return (
    <Panel position="top-left" style={{ pointerEvents: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {LAYER_LABELS.map(layer => {
          const pos = layerPositions[layer.level]
          if (!pos) return null
          const agentCount = agents.filter(a => {
            const cfg = ROLE_CONFIG[a.roleGroup]
            return cfg && cfg.level === layer.level
          }).length
          const activeCount = agents.filter(a => {
            const cfg = ROLE_CONFIG[a.roleGroup]
            return cfg && cfg.level === layer.level && a.status === 'active'
          }).length
          return (
            <div key={layer.level} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 4, background: `rgba(${layer.colorRgb}, 0.08)`, border: `1px solid rgba(${layer.colorRgb}, 0.15)` }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: layer.color, letterSpacing: 0.5 }}>{layer.label}</span>
                <span style={{ fontSize: 8, fontWeight: 600, color: layer.color, opacity: 0.7 }}>{layer.fullLabel}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: layer.color }}>{activeCount}/{agentCount}</span>
                <span style={{ fontSize: 7, color: '#555' }}>active</span>
              </div>
              <div style={{ flex: 1, height: 1, minWidth: 40, background: `linear-gradient(90deg, ${layer.color}30, transparent)` }} />
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
