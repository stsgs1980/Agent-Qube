import { ROLE_ORDER, type AgentData, type ConnectionData, type EdgeType } from './types'

// ─── Build connections from agent data ──────────────────────────────────────────

export function buildConnections(agents: AgentData[]): ConnectionData[] {
  const conns: ConnectionData[] = []
  const seen = new Set<string>()

  const addConn = (id: string, from: string, to: string, type: EdgeType, strength: number) => {
    if (seen.has(id)) return
    seen.add(id)
    conns.push({ id, from, to, type, strength })
  }

  // Command: parent -> child
  for (const agent of agents) {
    if (agent.parentId) {
      addConn(`cmd-${agent.id}`, agent.parentId, agent.id, 'command', 1)
    }
  }

  // Sync: same roleGroup + same parent
  for (const group of ROLE_ORDER) {
    const groupAgents = agents.filter(a => a.roleGroup === group)
    for (let i = 0; i < groupAgents.length; i++) {
      for (let j = i + 1; j < groupAgents.length; j++) {
        const a1 = groupAgents[i]
        const a2 = groupAgents[j]
        if (a1.parentId === a2.parentId) {
          const key = [a1.id, a2.id].sort().join('-')
          addConn(`sync-${key}`, a1.id, a2.id, 'sync', 0.5)
        }
      }
    }
  }

  // Twin
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

  // Delegate: coordinators -> agents without parent
  const taktikaAgents = agents.filter(a => a.roleGroup === 'Тактика')
  const ispolnenieAgents = agents.filter(a => a.roleGroup === 'Исполнение')
  for (const t of taktikaAgents) {
    if (t.role.toLowerCase().includes('coordinator')) {
      for (const e of ispolnenieAgents) {
        if (!e.parentId) addConn(`delegate-${t.id}-${e.id}`, t.id, e.id, 'delegate', 0.7)
      }
    }
  }

  // Supervise: Kontrol -> Ispolnenie
  const kontrolAgents = agents.filter(a => a.roleGroup === 'Контроль')
  for (const c of kontrolAgents) {
    for (const e of ispolnenieAgents) {
      const superviseCount = conns.filter(cn => cn.type === 'supervise' && cn.to === e.id).length
      if (superviseCount === 0) {
        addConn(`supervise-${c.id}-${e.id}`, c.id, e.id, 'supervise', 0.4)
        break
      }
    }
  }

  // Broadcast: root Strategy -> all group leads
  const rootStrategy = agents.filter(a => a.roleGroup === 'Стратегия' && !a.parentId)
  for (const s of rootStrategy) {
    const groupLeads = agents.filter(a => !a.parentId && a.roleGroup !== 'Стратегия')
    for (const lead of groupLeads) {
      addConn(`broadcast-${s.id}-${lead.id}`, s.id, lead.id, 'broadcast', 0.5)
    }
  }

  return conns
}
