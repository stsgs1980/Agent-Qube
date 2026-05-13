'use client'

import { Activity } from 'lucide-react'
import { ROLE_GROUPS, ACTIVITY_EVENTS } from '@/data/dashboard-constants'

export function RecentActivityTimeline({ events }: { events?: typeof ACTIVITY_EVENTS }) {
  const displayEvents = events || ACTIVITY_EVENTS
  return (
    <div
      className="rounded-xl p-4 sm:p-6 flex flex-col"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)', minHeight: '380px' }}
    >
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        Recent Activity
      </h3>
      <div
        className="flex-1 overflow-y-auto space-y-0 activity-scroll"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent', maxHeight: '400px' }}
      >
        {displayEvents.map((event, i) => {
          const groupConfig = ROLE_GROUPS.find(g => g.name === event.group)
          const dotColor = groupConfig?.color || '#94a3b8'
          return (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/[0.03] last:border-b-0 rounded-lg px-2 transition-colors duration-150 hover:bg-white/[0.02]">
              <div className="flex flex-col items-center mt-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}44` }} />
                {i < displayEvents.length - 1 && (
                  <span className="w-px flex-1 mt-1" style={{ background: `linear-gradient(to bottom, ${dotColor}, transparent)`, minHeight: '20px', opacity: 0.4 }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">{event.time}</span>
                  <span className="text-[10px] font-bold" style={{ color: dotColor }}>{event.agent}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${dotColor}15`, color: dotColor }}>{event.group}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">{event.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
