'use client'

import { QUICK_STATS } from '@/data/dashboard-constants'
import { MiniSparkline } from './mini-sparkline'

export function KPIStrip({ quickStats }: { quickStats?: typeof QUICK_STATS }) {
  const stats = quickStats || QUICK_STATS
  const kpis = [
    { label: 'Total Agents', value: String(stats[0]?.numericValue ?? '26'), color: '#06B6D4', change: '+2 this week', changeColor: '#22D3EE', sparkData: [22, 23, 24, 24, 25, 26] },
    { label: 'Active Now', value: String(stats[4]?.numericValue ?? '16'), color: '#22D3EE', change: `${stats[5]?.numericValue ?? 4} idle / ${stats[2] ? '' : '1 paused'}`, changeColor: '#64748B' },
    { label: 'Tasks Running', value: String(stats[6]?.numericValue ?? '12'), color: '#0891B2', change: '187 completed', changeColor: '#22D3EE' },
    { label: 'Success Rate', value: '94.7%', color: '#22D3EE', change: '+0.3%', changeColor: '#22D3EE', sparkData: [90, 92, 91, 93, 94, 95] },
    { label: 'Avg Response', value: '1.2s', color: '#B0B0B0', change: '-0.3s', changeColor: '#22D3EE' },
  ]

  return (
    <div data-src="src/components/dashboard/kpi-strip.tsx" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-lg p-3.5 relative overflow-hidden" style={{ background: 'rgba(26,26,26,0.4)', border: '1px solid rgba(51,51,51,0.3)' }}>
          <div className="text-[10px] text-[#64748B] mb-1">{kpi.label}</div>
          <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
          <div className="text-[10px] mt-1" style={{ color: kpi.changeColor }}>{kpi.change}</div>
          {kpi.sparkData && (
            <div className="absolute right-2.5 bottom-2.5">
              <MiniSparkline data={kpi.sparkData} color={kpi.color} width={48} height={16} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
