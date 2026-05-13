'use client'

import { BarChart3 } from 'lucide-react'
import { STATUS_DISTRIBUTION } from '@/data/dashboard-constants'

export function StatusDistributionCard({ statusDistribution }: { statusDistribution?: typeof STATUS_DISTRIBUTION }) {
  const distributionData = statusDistribution || STATUS_DISTRIBUTION
  const donutRadius = 50
  const donutStroke = 12
  const donutCircumference = 2 * Math.PI * donutRadius
  const totalAgents = distributionData.reduce((sum, s) => sum + s.count, 0)

  const donutSegments = distributionData.filter(s => s.count > 0).reduce<Array<{
    label: string; count: number; color: string; segmentLength: number; offset: number
  }>>((acc, status) => {
    const segmentLength = (status.count / totalAgents) * donutCircumference
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].segmentLength : 0
    acc.push({ ...status, segmentLength, offset })
    return acc
  }, [])

  return (
    <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(26,26,26,0.6)', border: '1px solid rgba(51,51,51,0.5)' }}>
      <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: '#06B6D4', opacity: 0.5 }} />
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-3 flex items-center gap-1.5">
        <BarChart3 className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
        Status Distribution
      </h3>
      <div className="flex items-center justify-center h-[160px]">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={donutRadius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={donutStroke} />
          {donutSegments.map((segment, i) => (
            <circle key={i} cx="80" cy="80" r={donutRadius} fill="none" stroke={segment.color} strokeWidth={donutStroke}
              strokeDasharray={`${segment.segmentLength} ${donutCircumference - segment.segmentLength}`}
              strokeDashoffset={-segment.offset} strokeLinecap="butt" transform="rotate(-90 80 80)" style={{ opacity: 0.8 }} />
          ))}
          <text x="80" y="75" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="22" fontWeight="700">{totalAgents}</text>
          <text x="80" y="90" textAnchor="middle" dominantBaseline="middle" fill="#B0B0B0" fontSize="8">agents</text>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
        {distributionData.map((status) => (
          <div key={status.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: status.color, opacity: status.count > 0 ? 1 : 0.3 }} />
            <span className="text-[9px] text-[#B0B0B0]">{status.label}</span>
            <span className="text-[9px] font-bold" style={{ color: status.count > 0 ? status.color : '#555' }}>{status.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
