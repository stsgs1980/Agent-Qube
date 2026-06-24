import { ROLE_ORDER, type AgentData, type ConnectionData, type EdgeType } from './types'

function buildCommandConns(agents: AgentData[], addConn: (id: string, from: string, to: string, type: EdgeType, strength: number) => void) {
  for (const agent of agents) {
    if (agent.parentId) addConn(`cmd-${agent.id}`, agent.parentId, agent.id, 'command', 1)
  }
}

function buildSyncConns(agents: AgentData[], addConn: (id: string, from: string, to: string, type: EdgeType, strength: number) => void) {
  for (const group of ROLE_ORDER) {
    const groupAgents = agents.filter(a => a.roleGroup === group)
    for (let i = 0; i < groupAgents.length; i++) {
      for (let j = i + 1; j < groupAgents.length; j++) {
        if (groupAgents[i].parentId === groupAgents[j].parentId) {
          const key = [groupAgents[i].id, groupAgents[j].id].sort().join('-')
          addConn(`sync-${key}`, groupAgents[i].id, groupAgents[j].id, 'sync', 0.5)
        }
      }
    }
  }
}

function buildTwinConns(agents: AgentData[], addConn: (id: string, from: string, to: string, type: EdgeType, strength: number) => void) {
  const twinSeen = new Set<string>()
  for (const agent of agents) {
    if (agent.twinId) {
      const key = [agent.id, agent.twinId].sort().join('-')
      if (!twinSeen.has(key)) {
        twinSeen.add(key)
        addConn(`twin-${key}`, agent.id, agent.twinId!, 'twin', 1)
      }
    }
  }
}

function buildDelegateConns(agents: AgentData[], addConn: (id: string, from: string, to: string, type: EdgeType, strength: number) => void) {
  const taktikaAgents = agents.filter(a => a.roleGroup === 'Tactics')
  const ispolnenieAgents = agents.filter(a => a.roleGroup === 'Execution')
  for (const t of taktikaAgents) {
    if (t.role.toLowerCase().includes('coordinator')) {
      for (const e of ispolnenieAgents) {
        if (!e.parentId) addConn(`delegate-${t.id}-${e.id}`, t.id, e.id, 'delegate', 0.7)
      }
    }
  }
}

function buildSuperviseConns(agents: AgentData[], conns: ConnectionData[], addConn: (id: string, from: string, to: string, type: EdgeType, strength: number) => void) {
  const kontrolAgents = agents.filter(a => a.roleGroup === 'Control')
  const ispolnenieAgents = agents.filter(a => a.roleGroup === 'Execution')
  for (const c of kontrolAgents) {
    for (const e of ispolnenieAgents) {
      if (conns.filter(cn => cn.type === 'supervise' && cn.to === e.id).length === 0) {
        addConn(`supervise-${c.id}-${e.id}`, c.id, e.id, 'supervise', 0.4)
        break
      }
    }
  }
}

function buildBroadcastConns(agents: AgentData[], addConn: (id: string, from: string, to: string, type: EdgeType, strength: number) => void) {
  const rootStrategy = agents.filter(a => a.roleGroup === 'Strategy' && !a.parentId)
  for (const s of rootStrategy) {
    const groupLeads = agents.filter(a => !a.parentId && a.roleGroup !== 'Strategy')
    for (const lead of groupLeads) {
      addConn(`broadcast-${s.id}-${lead.id}`, s.id, lead.id, 'broadcast', 0.5)
    }
  }
}

export function buildConnections(agents: AgentData[]): ConnectionData[] {
  const conns: ConnectionData[] = []
  const seen = new Set<string>()
  const addConn = (id: string, from: string, to: string, type: EdgeType, strength: number) => {
    if (seen.has(id)) return
    seen.add(id)
    conns.push({ id, from, to, type, strength })
  }

  buildCommandConns(agents, addConn)
  buildSyncConns(agents, addConn)
  buildTwinConns(agents, addConn)
  buildDelegateConns(agents, addConn)
  buildSuperviseConns(agents, conns, addConn)
  buildBroadcastConns(agents, addConn)

  return conns
}