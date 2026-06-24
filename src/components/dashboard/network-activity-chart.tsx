'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, BarChart3 } from 'lucide-react'
import { NETWORK_ACTIVITY_DATA } from '@/data/dashboard-constants'

const CHART_W = 500
const CHART_H = 140
const PAD_X = 35
const PAD_Y = 15
const GRID_LEVELS = [0, 0.25, 0.5, 0.75, 1]
const X_LABELS = [0, 4, 8, 12, 16, 20, 23]

function ChartStats({ peaks, avgVal, currentVal }: { peaks: { v: number; i: number }[]; avgVal: string; currentVal: number }) {
  const stats = [
    { icon: <TrendingUp size={10} style={{ color: '#06B6D4' }} />, label: 'Peak', value: `${peaks[0]?.v ?? 0} at ${peaks[0]?.i ?? 0}h` },
    { icon: <BarChart3 size={10} style={{ color: '#06B6D4' }} />, label: 'Average', value: avgVal },
    { icon: <Activity size={10} style={{ color: '#06B6D4' }} />, label: 'Current', value: String(currentVal) },
  ]
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(51,51,51,0.3)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 6, background: 'rgba(13,13,13,0.9)', border: '1px solid rgba(51,51,51,0.3)' }}>
          {stat.icon}
          <span style={{ fontSize: 8, color: '#64748B' }}>{stat.label}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#06B6D4', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

function AreaGradient() {
  return (
    <defs>
      <linearGradient id="areaGradMain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(6,182,212,0.2)">
          <animate attributeName="stop-color" values="rgba(6,182,212,0.2);rgba(6,182,212,0.12);rgba(6,182,212,0.2)" dur="3s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="rgba(6,182,212,0.01)" />
      </linearGradient>
    </defs>
  )
}

function ChartSVG({ data, animated, minVal, maxVal, range }: { data: number[]; animated: boolean; minVal: number; maxVal: number; range: number }) {
  const plotW = CHART_W - PAD_X - 10
  const plotH = CHART_H - PAD_Y * 2
  const toX = (i: number) => PAD_X + (i / (data.length - 1)) * plotW
  const toY = (v: number) => PAD_Y + plotH - ((v - minVal) / range) * plotH
  const linePoints = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPath = `M${toX(0)},${CHART_H - PAD_Y} ${data.map((v, i) => `L${toX(i)},${toY(v)}`).join(' ')} L${toX(data.length - 1)},${CHART_H - PAD_Y} Z`
  const indexed = data.map((v, i) => ({ v, i }))
  const peaks = indexed.sort((a, b) => b.v - a.v).slice(0, 3)

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="xMinYMin meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <AreaGradient />
      {GRID_LEVELS.map((level, i) => {
        const y = PAD_Y + plotH * (1 - level)
        return (
          <g key={i}>
            <line x1={PAD_X} y1={y} x2={CHART_W - 10} y2={y} stroke="#333333" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray={level === 0 || level === 1 ? 'none' : '2,3'} />
            <text x={PAD_X - 5} y={y + 3} textAnchor="end" fill="#64748B" fontSize="7" opacity="0.6">{Math.round(minVal + level * range)}</text>
          </g>
        )
      })}
      <path d={areaPath} fill="url(#areaGradMain)" style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.8s ease' }} />
      <polyline points={linePoints} fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinejoin="round"
        style={{ strokeDasharray: animated ? 'none' : '1000', strokeDashoffset: animated ? '0' : '1000', transition: 'stroke-dashoffset 1.5s ease' }} />
      {X_LABELS.map((hour) => (
        <text key={hour} x={toX(hour)} y={CHART_H - 2} textAnchor="middle" fill="#64748B" fontSize="7" opacity="0.5">{hour}h</text>
      ))}
      {peaks.map((peak, i) => (
        <g key={i}>
          <circle cx={toX(peak.i)} cy={toY(peak.v)} r="4" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.4">
            <animate attributeName="r" from="4" to="10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="strokeOpacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={toX(peak.i)} cy={toY(peak.v)} r="2.5" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.5">
            <title>{`${peak.i}h: ${peak.v} activities`}</title>
          </circle>
        </g>
      ))}
      {data.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="8" fill="transparent" stroke="none"><title>{`${i}h: ${v} activities`}</title></circle>
      ))}
    </svg>
  )
}

export function NetworkActivityChart({ data: activityData }: { data?: number[] }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const data = activityData || NETWORK_ACTIVITY_DATA
  const minVal = Math.min(...data)
  const maxVal = Math.max(...data)
  const range = maxVal - minVal || 1
  const indexed = data.map((v, i) => ({ v, i }))
  const peaks = indexed.sort((a, b) => b.v - a.v).slice(0, 3)
  const avgVal = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)
  const currentVal = data[data.length - 1]

  return (
    <div data-src="src/components/dashboard/network-activity-chart.tsx" style={{ background: 'rgba(20, 20, 20, 0.7)', border: '1px solid rgba(51, 51, 51, 0.4)', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <Activity style={{ width: 13, height: 13, color: '#06B6D4' }} />
        <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>Network Activity</span>
      </div>
      <div><ChartSVG data={data} animated={animated} minVal={minVal} maxVal={maxVal} range={range} /></div>
      <ChartStats peaks={peaks} avgVal={avgVal} currentVal={currentVal} />
    </div>
  )
}