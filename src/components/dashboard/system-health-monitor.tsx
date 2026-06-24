'use client'

import { useState, useEffect } from 'react'
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react'
import { MetricBar, StatusChips } from './health-monitor-parts'

function useMetricAnimation() {
  const [widths, setWidths] = useState([0, 0, 0])
  useEffect(() => {
    const timers = [
      setTimeout(() => setWidths(prev => {
        const n = [...prev];
        n[0] = 34;
        return n;
      } ), 100),
      setTimeout(() => setWidths(prev => {
        const n = [...prev]
        n[1] = 67
        return n
      }), 200),
      setTimeout(() => setWidths(prev => {
        const n = [...prev]
        n[2] = 23
        return n
      }), 300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])
  return widths
}

const METRICS: Array<{ label: string; value: number; color: string; icon: typeof Cpu }> = [
  { label: 'CPU Usage', value: 34, color: '#06B6D4', icon: Cpu },
  { label: 'Memory Usage', value: 67, color: '#0891B2', icon: HardDrive },
  { label: 'Network I/O', value: 23, color: '#0E7490', icon: Wifi },
]

export function SystemHealthMonitor() {
  const widths = useMetricAnimation()

  return (
    <div className="rounded-xl p-4 sm:p-6 relative overflow-hidden"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}>
      <div className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(103,232,249,0.04), rgba(6,182,212,0.03), rgba(14,116,144,0.03))',
          backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite' }} />
      <div className="relative z-10">
        <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />System Health Monitor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {METRICS.map((m, i) => <MetricBar key={m.label} label={m.label} value={m.value} color={m.color} width={widths[i]} Icon={m.icon} />)}
        </div>
        <StatusChips />
      </div>
    </div>
  )
}