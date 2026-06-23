'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { ROLE_GROUPS, TOP_PERFORMERS } from '@/data/dashboard-constants'

export function TopPerformersCard({ topPerformers: topPerformersProp, roleGroups: roleGroupsProp }: { topPerformersProp?: typeof TOP_PERFORMERS; roleGroupsProp?: typeof ROLE_GROUPS }) {
  const topPerformers = topPerformersProp || TOP_PERFORMERS
  const roleGroupsData = roleGroupsProp || ROLE_GROUPS
  const [barWidths, setBarWidths] = useState<number[]>(topPerformers.map(() => 0))

  useEffect(() => {
    const timers = topPerformers.map((_, i) =>
      setTimeout(() => {
        setBarWidths(prev => { const next = [...prev]; next[i] = topPerformers[i].score; return next })
      }, 100 + i * 80)
    )
    return () => timers.forEach(clearTimeout)
  }, [topPerformers])

  const getGroupColor = (groupName: string): string => {
    const group = roleGroupsData.find(g => g.name === groupName)
    return group?.color || '#94a3b8'
  }

  return (
    <div data-src="src/components/dashboard/top-performers-card.tsx" className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(26,26,26,0.6)', border: '1px solid rgba(51,51,51,0.5)' }}>
      <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: '#0891B2', opacity: 0.5 }} />
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
        <BarChart3 className="w-3.5 h-3.5" style={{ color: '#0891B2' }} />
        Top Performers
      </h3>
      <div className="flex flex-col gap-2">
        {topPerformers.map((agent, i) => {
          const barColor = getGroupColor(agent.group)
          const width = barWidths[i]
          return (
            <div key={agent.name} className="flex items-center gap-2">
              <span className="text-[10px] font-medium w-[80px] truncate text-right flex-shrink-0" style={{ color: barColor }}>{agent.name}</span>
              <div className="flex-1 h-[6px] rounded-sm relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="h-full rounded-sm transition-all duration-700 ease-out" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${barColor}44, ${barColor}aa)` }} />
              </div>
              <span className="text-[9px] font-bold w-7 text-right flex-shrink-0" style={{ color: barColor }}>{width > 0 ? agent.score : ''}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
