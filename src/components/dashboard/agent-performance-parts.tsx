import { ROLE_GROUPS, PERFORMANCE_METRICS, SPARKLINE_DATA } from '@/data/dashboard-constants'
import { MiniSparkline } from './mini-sparkline'
import { TrendingUp } from 'lucide-react'

export function TopPerformersSection({ topPerformers, barWidths }: {
  topPerformers: any[]; barWidths: number[]
}) {
  const getGroupColor = (groupName: string): string => {
    const group = ROLE_GROUPS.find(g => g.name === groupName)
    return group?.color || '#94a3b8'
  }

  return (
    <div className="lg:col-span-2">
      <p className="text-[10px] text-[#B0B0B0] mb-3 font-medium uppercase tracking-wider">Top Performers</p>
      <div className="space-y-2.5">
        {topPerformers.map((agent, i) => (
          <div key={agent.name} className="flex items-center gap-3 group">
            <span className="text-[10px] font-medium w-24 sm:w-28 truncate text-right flex-shrink-0 transition-colors duration-200"
              style={{ color: getGroupColor(agent.group) }}>{agent.name}</span>
            <div className="flex-1 h-5 rounded-sm relative overflow-hidden transition-all duration-200 group-hover:h-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-sm transition-all duration-700 ease-out"
                style={{ width: `${barWidths[i]}%`, background: `linear-gradient(90deg, ${getGroupColor(agent.group)}44, ${getGroupColor(agent.group)}aa)`,
                  boxShadow: `0 0 8px ${getGroupColor(agent.group)}22` }} />
            </div>
            <span className="text-[10px] font-bold w-8 text-right flex-shrink-0"
              style={{ color: getGroupColor(agent.group) }}>{barWidths[i] > 0 ? agent.score : ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PerformanceMetricsGrid() {
  return (
    <div className="mt-5">
      <p className="text-[10px] text-[#B0B0B0] mb-3 font-medium uppercase tracking-wider">Performance Metrics</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PERFORMANCE_METRICS.map((metric) => {
          const MetricIcon = metric.icon
          const sparkData = SPARKLINE_DATA[metric.label]
          return (
            <div key={metric.label} className="rounded-lg p-3 relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'rgba(13, 13, 13, 0.8)', border: '1px solid rgba(51, 51, 51, 0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${metric.color}44`; e.currentTarget.style.boxShadow = `0 0 12px ${metric.color}15` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51, 51, 51, 0.4)'; e.currentTarget.style.boxShadow = 'none' }}>
              <div className="absolute left-0 top-0 bottom-0 rounded-l-lg" style={{ width: 2, background: metric.color, opacity: 0.6 }} />
              <div className="flex items-center gap-2 ml-2 mb-1.5">
                <MetricIcon size={11} style={{ color: metric.color }} />
                <span className="text-[9px] text-[#B0B0B0] leading-tight">{metric.label}</span>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.value}</span>
                {sparkData && <MiniSparkline data={sparkData} color={metric.color} />}
                {metric.trendUp && <TrendingUp size={12} style={{ color: metric.color }} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}