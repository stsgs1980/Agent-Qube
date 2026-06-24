export type EdgeType = 'command' | 'sync' | 'twin' | 'delegate' | 'supervise' | 'broadcast'

export interface TypedConnection {
  id: string
  from: string
  to: string
  type: EdgeType
  strength: number
}

// ─── Build tree structure ─────────────────────────────────────────────────

export function buildAgentTree(agents: any[]) {
  const agentMap = new Map(agents.map(a => [a.id, { ...a, children: [] as any[] }]))
  const roots: any[] = []

  for (const agent of agentMap.values()) {
    if (agent.parentId && agentMap.has(agent.parentId)) {
      agentMap.get(agent.parentId)!.children.push(agent)
    } else {
      roots.push(agent)
    }
  }

  return { agentMap, roots }
}

// ─── Group agents by roleGroup ────────────────────────────────────────────

export function groupByRoleGroup(agents: any[]) {
  return {
    'Strategy': agents.filter(a => a.roleGroup === 'Strategy'),
    'Tactics': agents.filter(a => a.roleGroup === 'Tactics'),
    'Control': agents.filter(a => a.roleGroup === 'Control'),
    'Execution': agents.filter(a => a.roleGroup === 'Execution'),
    'Memory': agents.filter(a => a.roleGroup === 'Memory'),
    'Monitoring': agents.filter(a => a.roleGroup === 'Monitoring'),
    'Communication': agents.filter(a => a.roleGroup === 'Communication'),
    'Learning': agents.filter(a => a.roleGroup === 'Learning'),
  }
}

// ─── Compute stats ────────────────────────────────────────────────────────

export function computeAgentStats(agents: any[]) {
  return {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    idle: agents.filter(a => a.status === 'idle').length,
    error: agents.filter(a => a.status === 'error').length,
    offline: agents.filter(a => a.status === 'offline').length,
    paused: agents.filter(a => a.status === 'paused').length,
    standby: agents.filter(a => a.status === 'standby').length,
    tasks: agents.reduce((sum, a) => sum + (a.tasks?.length || 0), 0),
  }
}

// ─── Add sync edges between siblings ──────────────────────────────────────

export function addSyncEdges(
  group: any[],
  syncSeen: Set<string>,
  connections: TypedConnection[],
) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a1 = group[i]
      const a2 = group[j]
      if (a1.parentId === a2.parentId) {
        const key = [a1.id, a2.id].sort().join('-')
        if (!syncSeen.has(key)) {
          syncSeen.add(key)
          connections.push({
            id: `sync-${key}`, from: a1.id, to: a2.id, type: 'sync', strength: 0.5,
          })
        }
      }
    }
  }
}

// ─── Build all typed connections ──────────────────────────────────────────

function addCommandEdges(agents: any[], connections: TypedConnection[]) {
  for (const agent of agents) {
    if (agent.parentId) {
      connections.push({
        id: `cmd-${agent.id}-${agent.parentId}`,
        from: agent.parentId, to: agent.id, type: 'command', strength: 1,
      })
    }
  }
}

function addTwinEdges(agents: any[], connections: TypedConnection[]) {
  const twinSeen = new Set<string>()
  for (const agent of agents) {
    if (agent.twinId) {
      const key = [agent.id, agent.twinId].sort().join('-')
      if (!twinSeen.has(key)) {
        twinSeen.add(key)
        connections.push({
          id: `twin-${key}`, from: agent.id, to: agent.twinId, type: 'twin', strength: 1,
        })
      }
    }
  }
}

function addDelegateEdges(groups: Record<string, any[]>, connections: TypedConnection[]) {
  const tacticsGroup = groups['Tactics'] || []
  const executionGroup = groups['Execution'] || []
  const coordinator = tacticsGroup.find(a => a.role === 'Tactical Coordinator')
  if (coordinator) {
    for (const execAgent of executionGroup) {
      connections.push({
        id: `delegate-${coordinator.id}-${execAgent.id}`,
        from: coordinator.id, to: execAgent.id, type: 'delegate', strength: 0.8,
      })
    }
  }
}

function addSuperviseEdges(groups: Record<string, any[]>, connections: TypedConnection[]) {
  const controlGroup = groups['Control'] || []
  const executionGroup = groups['Execution'] || []
  for (const controlAgent of controlGroup) {
    for (const execAgent of executionGroup) {
      connections.push({
        id: `supervise-${controlAgent.id}-${execAgent.id}`,
        from: controlAgent.id, to: execAgent.id, type: 'supervise', strength: 0.6,
      })
    }
  }
}

function addBroadcastEdges(groups: Record<string, any[]>, connections: TypedConnection[]) {
  const strategyGroup = groups['Strategy'] || []
  const strategyRoots = strategyGroup.filter(a => !a.parentId)
  const leadIds: string[] = []

  for (const [name, groupAgents] of Object.entries(groups)) {
    if (name === 'Strategy') continue
    const lead = groupAgents.find(a => !a.parentId) || groupAgents[0]
    if (lead) leadIds.push(lead.id)
  }

  for (const root of strategyRoots) {
    for (const leadId of leadIds) {
      connections.push({
        id: `broadcast-${root.id}-${leadId}`,
        from: root.id, to: leadId, type: 'broadcast', strength: 0.7,
      })
    }
  }
}

export function buildAllConnections(agents: any[], groups: Record<string, any[]>) {
  const connections: TypedConnection[] = []

  addCommandEdges(agents, connections)

  const syncSeen = new Set<string>()
  for (const group of Object.values(groups)) {
    addSyncEdges(group, syncSeen, connections)
  }

  addTwinEdges(agents, connections)
  addDelegateEdges(groups, connections)
  addSuperviseEdges(groups, connections)
  addBroadcastEdges(groups, connections)

  return connections
}