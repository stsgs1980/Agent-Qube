import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Link2, Layers, Focus } from 'lucide-react'
import type { Agent, ContextMenuState } from './types'
import { ROLE_CONFIG } from './types'
import { AgentAvatarIcon } from './agent-avatar-icon'

function MenuItems({ agent, config, hasChildren, onViewDetails, onHighlightConnections, onToggleCollapse, onFocusNode }: {
  agent: Agent; config: typeof ROLE_CONFIG[string]; hasChildren: boolean
  onViewDetails: () => void; onHighlightConnections: () => void; onToggleCollapse: () => void; onFocusNode: () => void
}) {
  const items = [
    { Icon: Eye, label: 'View Details', action: onViewDetails },
    { Icon: Link2, label: 'Highlight Connections', action: onHighlightConnections },
  ]
  if (hasChildren) items.push({ Icon: Layers, label: 'Collapse/Expand', action: onToggleCollapse })
  items.push({ Icon: Focus, label: 'Focus', action: onFocusNode })

  return (
    <div className="py-1">
      {items.map(({ Icon, label, action }) => (
        <button key={label} onClick={action} className="w-full text-left px-3 py-1.5 text-xs text-[#B0B0B0] hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
          <Icon className="w-3 h-3" style={{ color: config.color }} />{label}
        </button>
      ))}
    </div>
  )
}

export function NodeContextMenu({ contextMenu, agent, onClose, onViewDetails, onHighlightConnections, onToggleCollapse, onFocusNode }: {
  contextMenu: ContextMenuState; agent: Agent | null; onClose: () => void
  onViewDetails: () => void; onHighlightConnections: () => void; onToggleCollapse: () => void; onFocusNode: () => void
}) {
  if (!contextMenu.visible || !agent) return null
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435']
  const hasChildren = (agent.children && agent.children.length > 0) || false
  const handleAction = (fn: () => void) => () => {
    fn()
    onClose()
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.12 }}
      className="fixed z-[60] rounded-xl overflow-hidden" style={{ left: contextMenu.x, top: contextMenu.y, background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(16px)', border: `1px solid rgba(${config.colorRgb}, 0.3)`, boxShadow: `0 0 20px rgba(${config.colorRgb}, 0.1), 0 8px 24px rgba(0,0,0,0.5)`, minWidth: 180 }}>
      <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: `1px solid rgba(51,51,51,0.5)` }}>
        <AgentAvatarIcon avatar={agent.avatar} size={14} color={config.color} />
        <span className="text-white text-xs font-semibold truncate">{agent.name}</span>
      </div>
      <MenuItems agent={agent} config={config} hasChildren={hasChildren}
        onViewDetails={handleAction(onViewDetails)} onHighlightConnections={handleAction(onHighlightConnections)}
        onToggleCollapse={handleAction(onToggleCollapse)} onFocusNode={handleAction(onFocusNode)} />
    </motion.div>
  )
}