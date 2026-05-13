import { ROLE_CONFIG, ROLE_ORDER, type AgentData, type ConnectionData, type EdgeType } from './types'

// ─── Dagre layout ──────────────────────────────────────────────────────────────

export function computeDagreLayout(
  agents: AgentData[],
  connections: ConnectionData[],
  direction: 'TB' | 'LR' = 'TB'
) {
  const nodeWidth = 160
  const nodeHeight = 58
  const layerGap = 100
  const nodeSep = 50

  // Group agents by level
  const layers: Record<number, AgentData[]> = {}
  for (const agent of agents) {
    const cfg = ROLE_CONFIG[agent.roleGroup]
    const level = cfg ? cfg.level : 4
    if (!layers[level]) layers[level] = []
    layers[level].push(agent)
  }

  const sortedLevels = Object.keys(layers).map(Number).sort((a, b) => a - b)

  const positions: Record<string, { x: number; y: number }> = {}
  const totalLevels = sortedLevels.length
  const totalHeight = totalLevels * nodeHeight + (totalLevels - 1) * layerGap
  let currentY = -totalHeight / 2

  for (const level of sortedLevels) {
    const layerAgents = layers[level]
    if (layerAgents.length === 0) continue

    const totalWidth = layerAgents.length * nodeWidth + (layerAgents.length - 1) * nodeSep
    const startX = -totalWidth / 2

    for (let i = 0; i < layerAgents.length; i++) {
      positions[layerAgents[i].id] = {
        x: startX + i * (nodeWidth + nodeSep),
        y: currentY,
      }
    }
    currentY += nodeHeight + layerGap
  }

  return agents.map(agent => {
    const pos = positions[agent.id] || { x: 0, y: 0 }
    return { id: agent.id, x: pos.x, y: pos.y, width: nodeWidth, height: nodeHeight }
  })
}

// ─── Radial layout ──────────────────────────────────────────────────────────────

export function computeRadialLayout(agents: AgentData[]) {
  const nodeWidth = 160
  const nodeHeight = 58
  const baseRadius = 120
  const radiusStep = 180

  const layers: Record<number, AgentData[]> = {}
  for (const agent of agents) {
    const cfg = ROLE_CONFIG[agent.roleGroup]
    const level = cfg ? cfg.level : 4
    if (!layers[level]) layers[level] = []
    layers[level].push(agent)
  }

  const positions: Record<string, { x: number; y: number }> = {}
  const sortedLevels = Object.keys(layers).map(Number).sort((a, b) => a - b)

  for (const level of sortedLevels) {
    const layerAgents = layers[level]
    if (layerAgents.length === 0) continue

    if (level === 0) {
      for (let i = 0; i < layerAgents.length; i++) {
        const angle = (2 * Math.PI * i) / Math.max(layerAgents.length, 1) - Math.PI / 2
        const r = layerAgents.length === 1 ? 0 : 80
        positions[layerAgents[i].id] = {
          x: r * Math.cos(angle) - nodeWidth / 2,
          y: r * Math.sin(angle) - nodeHeight / 2,
        }
      }
    } else {
      const radius = baseRadius + level * radiusStep
      const count = layerAgents.length
      const angleOffset = level * 0.3
      for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2 + angleOffset
        positions[layerAgents[i].id] = {
          x: radius * Math.cos(angle) - nodeWidth / 2,
          y: radius * Math.sin(angle) - nodeHeight / 2,
        }
      }
    }
  }

  return agents.map(agent => {
    const pos = positions[agent.id] || { x: 0, y: 0 }
    return { id: agent.id, x: pos.x, y: pos.y, width: nodeWidth, height: nodeHeight }
  })
}

// ─── Grid layout ────────────────────────────────────────────────────────────────

export function computeGridLayout(agents: AgentData[]) {
  const nodeWidth = 160
  const nodeHeight = 58
  const cellW = nodeWidth + 30
  const cellH = nodeHeight + 30

  const groupSlots: { group: string; agents: AgentData[] }[] = []
  for (const group of ROLE_ORDER) {
    const groupAgents = agents.filter(a => a.roleGroup === group)
    if (groupAgents.length > 0) groupSlots.push({ group, agents: groupAgents })
  }

  const cols = Math.ceil(Math.sqrt(agents.length))
  const rows = Math.ceil(agents.length / cols)
  const positions: Record<string, { x: number; y: number }> = {}

  let idx = 0
  for (const slot of groupSlots) {
    for (const agent of slot.agents) {
      const col = idx % cols
      const row = Math.floor(idx / cols)
      positions[agent.id] = {
        x: col * cellW - ((cols - 1) * cellW) / 2,
        y: row * cellH - ((rows - 1) * cellH) / 2,
      }
      idx++
    }
  }

  return agents.map(agent => {
    const pos = positions[agent.id] || { x: 0, y: 0 }
    return { id: agent.id, x: pos.x, y: pos.y, width: nodeWidth, height: nodeHeight }
  })
}
