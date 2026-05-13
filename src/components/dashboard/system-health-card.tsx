'use client'

import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

export function SystemHealthCard() {
  const [cpuWidth, setCpuWidth] = useState(0)
  const [memWidth, setMemWidth] = useState(0)
  const [netWidth, setNetWidth] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setCpuWidth(34), 100)
    const t2 = setTimeout(() => setMemWidth(67), 200)
    const t3 = setTimeout(() => setNetWidth(23), 300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const bars = [
    { label: 'CPU Usage', value: 34, color: '#06B6D4', width: cpuWidth },
    { label: 'Memory', value: 67, color: '#0891B2', width: memWidth },
    { label: 'Network I/O', value: 23, color: '#0E7490', width: netWidth },
  ]

  return (
    <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(26,26,26,0.6)', border: '1px solid rgba(51,51,51,0.5)' }}>
      <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: '#0891B2', opacity: 0.5 }} />
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" style={{ color: '#0891B2' }} />
        System Health
      </h3>
      <div className="flex flex-col gap-3">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-[#B0B0B0]">{bar.label}</span>
              <span className="text-[10px] font-bold" style={{ color: bar.color }}>{bar.value}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${bar.width}%`, background: `linear-gradient(90deg, ${bar.color}88, ${bar.color})` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(13,13,13,0.8)' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#22D3EE' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#22D3EE' }} />
          </span>
          <span className="text-[9px] text-[#64748B]">Uptime</span>
          <span className="text-[9px] font-bold" style={{ color: '#22D3EE' }}>99.7%</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(13,13,13,0.8)' }}>
          <span className="text-[9px] text-[#64748B]">Connections</span>
          <span className="text-[9px] font-bold" style={{ color: '#06B6D4' }}>55</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(13,13,13,0.8)' }}>
          <span className="text-[9px] text-[#64748B]">Error Rate</span>
          <span className="text-[9px] font-bold" style={{ color: '#22D3EE' }}>0.3%</span>
        </div>
      </div>
    </div>
  )
}
