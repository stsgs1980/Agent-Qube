'use client'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { AgentAvatarIcon } from './agent-avatar-icon'

type RoleConfig = { color: string; colorRgb: string }

export function AgentDetailHeader({ agent, config, onClose }: {
  agent: { name: string; role: string; avatar: string }; config: RoleConfig; onClose: () => void
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${config.colorRgb}, 0.15)`, border: `1px solid rgba(${config.colorRgb}, 0.3)` }}>
          <AgentAvatarIcon avatar={agent.avatar} size={24} color={config.color} />
        </div>
        <div>
          <h3 className="text-white font-bold text-base">{agent.name}</h3>
          <p className="text-xs" style={{ color: config.color }}>{agent.role}</p>
        </div>
      </motion.div>
      <button onClick={onClose}
        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:scale-110"
        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(51,51,51,0.5)', color: '#B0B0B0' }}
        title="Close panel">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function AgentDetailBadges({ agent, config, formulaColor, statusColor }: {
  agent: { status: string; formula: string; roleGroup: string }
  config: RoleConfig; formulaColor: string; statusColor: string
}) {
  return (
    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.3 }} className="flex items-center gap-2 mb-4">
      <Badge className="text-[10px] font-semibold"
        style={{ background: `${statusColor}20`, color: statusColor, borderColor: `${statusColor}40` }}>
        <span className="w-1.5 h-1.5 rounded-full mr-1 inline-block" style={{ background: statusColor }} />
        {agent.status.toUpperCase()}
      </Badge>
      <Badge className="text-[10px] font-bold"
        style={{ background: `${formulaColor}20`, color: formulaColor, borderColor: `${formulaColor}40` }}>
        {agent.formula}
      </Badge>
      <Badge variant="outline" className="text-[10px]"
        style={{ color: config.color, borderColor: `rgba(${config.colorRgb}, 0.4)` }}>
        {agent.roleGroup}
      </Badge>
    </motion.div>
  )
}