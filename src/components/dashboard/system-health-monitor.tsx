'use client'

import { useState, useEffect } from 'react'
import { Activity, Cpu, HardDrive, Wifi, TrendingDown } from 'lucide-react'

export function SystemHealthMonitor() {
  const [cpuWidth, setCpuWidth] = useState(0)
  const [memWidth, setMemWidth] = useState(0)
  const [netWidth, setNetWidth] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setCpuWidth(34), 100)
    const timer2 = setTimeout(() => setMemWidth(67), 200)
    const timer3 = setTimeout(() => setNetWidth(23), 300)
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3) }
  }, [])

  const metrics = [
    { label: 'CPU Usage', value: 34, color: '#06B6D4', width: cpuWidth, icon: Cpu },
    { label: 'Memory Usage', value: 67, color: '#0891B2', width: memWidth, icon: HardDrive },
    { label: 'Network I/O', value: 23, color: '#0E7490', width: netWidth, icon: Wifi },
  ]

  return (
    <div
      className="rounded-xl p-4 sm:p-6 relative overflow-hidden"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(103,232,249,0.04), rgba(6,182,212,0.03), rgba(14,116,144,0.03))',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
        }}
      />
      <div className="relative z-10">
        <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
          System Health Monitor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {metrics.map((m) => {
            const MetricIcon = m.icon
            return (
              <div key={m.label} className="rounded-lg p-3 transition-colors duration-200 hover:bg-white/[0.02]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MetricIcon size={12} style={{ color: m.color }} />
                    <span className="text-slate-400 text-[10px]">{m.label}</span>
                  </div>
                  <span className="font-bold text-xs" style={{ color: m.color }}>{m.value}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${m.width}%`, background: `linear-gradient(90deg, ${m.color}88, ${m.color})` }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s ease infinite',
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-slate-400 text-[10px]">Agent Uptime</span>
            <span className="text-cyan-400 font-bold text-xs" style={{ textShadow: '0 0 8px rgba(6, 182, 212, 0.4)', animation: 'pulseGlow 2s ease-in-out infinite' }}>99.7%</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
            <Activity className="w-3 h-3" style={{ color: '#06B6D4' }} />
            <span className="text-slate-400 text-[10px]">Active Connections</span>
            <span className="font-bold text-xs" style={{ color: '#06B6D4' }}>55</span>
            <svg width="32" height="12" className="ml-1">
              <polyline points="0,8 4,6 8,9 12,4 16,7 20,3 24,5 28,2 32,6" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
            <TrendingDown className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-400 text-[10px]">Error Rate</span>
            <span className="text-cyan-400 font-bold text-xs">0.3%</span>
            <TrendingDown className="w-2.5 h-2.5 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
