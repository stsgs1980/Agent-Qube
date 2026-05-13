'use client'

import { Pencil } from 'lucide-react'
import { ROLE_GROUPS, AGENT_LIST, STATUS_DOT_COLORS } from '@/data/dashboard-constants'

export function DashboardSidebar({ open, onClose, agentListProp, roleGroupsProp, onAgentClick }: {
  open: boolean; onClose: () => void; agentListProp?: typeof AGENT_LIST; roleGroupsProp?: typeof ROLE_GROUPS; onAgentClick?: (agent: any) => void
}) {
  const roleGroupsData = roleGroupsProp || ROLE_GROUPS
  const agentsList = agentListProp || AGENT_LIST
  const agentsByGroup = roleGroupsData.map(group => ({
    ...group,
    agents: agentsList.filter(a => a.group === group.name),
  }))

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:relative z-40 top-0 left-0 h-full w-[280px] flex-shrink-0 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#0D0D0D', borderRight: '1px solid rgba(51,51,51,0.5)' }}
      >
        <div className="p-4 h-full overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-3 px-2">Agent Navigation</div>
          <div className="flex flex-col gap-1">
            {agentsByGroup.map((group) => (
              <div key={group.name}>
                <div className="text-[10px] font-semibold px-2 py-1.5 rounded mt-2 mb-0.5" style={{ color: group.color, background: `${group.color}12` }}>
                  {group.name} ({group.agents.length})
                </div>
                {group.agents.map((agent) => {
                  const dotColor = STATUS_DOT_COLORS[agent.status] || '#3F3F46'
                  return (
                    <div key={agent.name} onClick={() => onAgentClick?.(agent)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 hover:bg-white/[0.05] group"
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor, boxShadow: agent.status === 'active' ? `0 0 4px ${dotColor}` : 'none' }} />
                      <span className="text-[11px] text-[#B0B0B0] flex-1 truncate group-hover:text-white transition-colors" title={agent.name}>{agent.name}</span>
                      <span className="text-[8px] text-[#64748B] group-hover:text-[#B0B0B0] transition-colors truncate max-w-[60px]">{agent.role}</span>
                      <Pencil size={8} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
