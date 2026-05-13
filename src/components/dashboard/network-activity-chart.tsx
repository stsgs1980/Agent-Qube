'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, BarChart3 } from 'lucide-react'
import { NETWORK_ACTIVITY_DATA } from '@/data/dashboard-constants'

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

  const chartW = 500
  const chartH = 140
  const padX = 35
  const padY = 15
  const plotW = chartW - padX - 10
  const plotH = chartH - padY * 2

  const toX = (i: number) => padX + (i / (data.length - 1)) * plotW
  const toY = (v: number) => padY + plotH - ((v - minVal) / range) * plotH

  const linePoints = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPath = `M${toX(0)},${chartH - padY} ` +
    data.map((v, i) => `L${toX(i)},${toY(v)}`).join(' ') +
    ` L${toX(data.length - 1)},${chartH - padY} Z`

  const indexed = data.map((v, i) => ({ v, i }))
  const peaks = indexed.sort((a, b) => b.v - a.v).slice(0, 3)
  const gridLevels = [0, 0.25, 0.5, 0.75, 1]
  const xLabels = [0, 4, 8, 12, 16, 20, 23]

  return (
    <div className="rounded-xl p-4 sm:p-6" style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}>
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
        Network Activity
      </h3>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ minHeight: '110px' }}>
        <defs>
          <linearGradient id="areaGradientAnimated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(6,182,212,0.25)">
              <animate attributeName="stop-color" values="rgba(6,182,212,0.25);rgba(6,182,212,0.15);rgba(6,182,212,0.25)" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="rgba(6,182,212,0.02)" />
          </linearGradient>
        </defs>
        {gridLevels.map((level, i) => {
          const y = padY + plotH * (1 - level)
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={chartW - 10} y2={y} stroke="#333333" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray={level === 0 || level === 1 ? 'none' : '2,3'} />
              <text x={padX - 4} y={y + 2} textAnchor="end" fill="#B0B0B0" fontSize="6" opacity="0.5">{Math.round(minVal + level * range)}</text>
            </g>
          )
        })}
        <path d={areaPath} fill="url(#areaGradientAnimated)" style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.8s ease' }} />
        <polyline points={linePoints} fill="none" stroke="#06B6D4" strokeWidth="1.5"
          style={{ strokeDasharray: animated ? 'none' : '1000', strokeDashoffset: animated ? '0' : '1000', transition: 'stroke-dashoffset 1.5s ease' }} />
        {xLabels.map((hour) => (
          <text key={hour} x={toX(hour)} y={chartH - 2} textAnchor="middle" fill="#B0B0B0" fontSize="6" opacity="0.5">{hour}h</text>
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
          <circle key={i} cx={toX(i)} cy={toY(v)} r="8" fill="transparent" stroke="none">
            <title>{`${i}h: ${v} activities`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
          <TrendingUp size={11} style={{ color: '#06B6D4' }} /><span className="text-[9px] text-[#B0B0B0]">Peak</span>
          <span className="text-[10px] font-bold" style={{ color: '#06B6D4' }}>55 at 11h</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
          <BarChart3 size={11} style={{ color: '#06B6D4' }} /><span className="text-[9px] text-[#B0B0B0]">Average</span>
          <span className="text-[10px] font-bold" style={{ color: '#06B6D4' }}>36.5</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-white/[0.03]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
          <Activity size={11} style={{ color: '#06B6D4' }} /><span className="text-[9px] text-[#B0B0B0]">Current</span>
          <span className="text-[10px] font-bold" style={{ color: '#06B6D4' }}>15</span>
        </div>
      </div>
    </div>
  )
}
