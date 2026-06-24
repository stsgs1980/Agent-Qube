'use client'
import { motion } from 'framer-motion'
import type { Agent } from './types'
import { ROLE_CONFIG } from './types'
import { AgentAvatarIcon } from './agent-avatar-icon'

function ConnectionRow({ label, agent }: { label: string; agent: Agent }) {
  const cfg = ROLE_CONFIG[agent.roleGroup]
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-[#B0B0B0] w-16">{label}</span>
      <AgentAvatarIcon avatar={agent.avatar} size={14} color={cfg?.color || '#888'} />
      <span className="text-white">{agent.name}</span>
    </div>
  )
}

function ConnectionGroup({ label, agents }: { label: string; agents: Agent[] }) {
  if (agents.length === 0) return null
  return (
    <div>
      <span className="text-[#B0B0B0] text-xs">{label}</span>
      <div className="ml-2 mt-1 space-y-1">
        {agents.map(a => (
          <div key={a.id} className="flex items-center gap-1.5 text-xs text-[#B0B0B0]">
            <AgentAvatarIcon avatar={a.avatar} size={14} color={ROLE_CONFIG[a.roleGroup]?.color || '#888'} />
            <span>{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AgentConnections({ parent, twin, children, siblings }: {
  parent: Agent | null; twin: Agent | null; children: Agent[]; siblings: Agent[]
}) {
  return (
    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.3 }} className="mb-5">
      <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-2">Connections</h4>
      <div className="space-y-1.5">
        {parent && <ConnectionRow label="Parent" agent={parent} />}
        {twin && <ConnectionRow label="Twin" agent={twin} />}
        <ConnectionGroup label="Children" agents={children} />
        <ConnectionGroup label="Sync peers" agents={siblings} />
      </div>
    </motion.div>
  )
}