// ─── Socket event handlers for use-hierarchy-data ──────────

import type { AgentData } from '@/components/hierarchy/types'

export function createSocketHandlers(
  setAgents: React.Dispatch<React.SetStateAction<AgentData[]>>,
  fetchAgents: () => Promise<void>,
) {
  const handleStatus = (data: { agentId: string; newStatus: string }) => {
    setAgents(prev => prev.map(a => a.id === data.agentId ? { ...a, status: data.newStatus } : a))
  }
  const handleCreated = () => { fetchAgents() }
  const handleUpdated = (data: { agent: AgentData }) => {
    setAgents(prev => prev.map(a => a.id === data.agent.id ? { ...a, ...data.agent } : a))
  }
  const handleDeleted = (data: { agentId: string }) => {
    setAgents(prev => prev.filter(a => a.id !== data.agentId))
  }
  return { handleStatus, handleCreated, handleUpdated, handleDeleted }
}