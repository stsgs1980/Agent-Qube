'use client'

import { Network } from 'lucide-react'

export function ArchitectureDiagram() {
  const groups = [
    { name: 'Strategy', x: 200, y: 30, color: '#67E8F9' },
    { name: 'Tactics', x: 400, y: 30, color: '#22D3EE' },
    { name: 'Execution', x: 600, y: 30, color: '#06B6D4' },
    { name: 'Control', x: 200, y: 110, color: '#06B6D4' },
    { name: 'Monitoring', x: 600, y: 110, color: '#0E7490' },
    { name: 'Memory', x: 200, y: 190, color: '#0891B2' },
    { name: 'Communication', x: 400, y: 190, color: '#155E75' },
    { name: 'Learning', x: 600, y: 190, color: '#164E63' },
  ]

  const connections = [
    { from: 0, to: 1, label: 'delegate', color: '#0891B2' },
    { from: 1, to: 2, label: 'command', color: '#06B6D4' },
    { from: 3, to: 2, label: 'supervise', color: '#475569' },
    { from: 4, to: 2, label: 'supervise', color: '#475569' },
    { from: 5, to: 6, label: 'sync', color: '#64748B' },
    { from: 6, to: 2, label: 'delegate', color: '#0891B2' },
    { from: 7, to: 2, label: 'delegate', color: '#0891B2' },
    { from: 7, to: 5, label: 'sync', color: '#64748B' },
    { from: 0, to: 4, label: 'broadcast', color: '#0E7490' },
  ]

  const boxW = 140
  const boxH = 36

  return (
    <div className="rounded-xl p-4 sm:p-6 overflow-x-auto" style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}>
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Network className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
        Architecture Overview
      </h3>
      <svg viewBox="0 0 800 250" className="w-full" style={{ minHeight: '200px' }}>
        {connections.map((conn, i) => {
          const from = groups[conn.from]
          const to = groups[conn.to]
          const fx = from.x + boxW / 2
          const fy = from.y + boxH / 2
          const tx = to.x + boxW / 2
          const ty = to.y + boxH / 2
          const mx = (fx + tx) / 2
          const my = (fy + ty) / 2
          return (
            <g key={i}>
              <line x1={fx} y1={fy} x2={tx} y2={ty} stroke={conn.color} strokeWidth="1" strokeOpacity="0.4" strokeDasharray={conn.label === 'sync' ? '4 3' : conn.label === 'broadcast' ? '8 3 2 3' : 'none'} />
              <text x={mx} y={my - 4} textAnchor="middle" fill={conn.color} fontSize="7" fontWeight="600" style={{ pointerEvents: 'none' }}>{conn.label}</text>
            </g>
          )
        })}
        {groups.map((g, i) => (
          <g key={i}>
            <rect x={g.x} y={g.y} width={boxW} height={boxH} rx={6} fill={`${g.color}12`} stroke={g.color} strokeWidth="0.8" strokeOpacity="0.4" />
            <text x={g.x + boxW / 2} y={g.y + boxH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={g.color} fontSize="10" fontWeight="600" style={{ pointerEvents: 'none' }}>{g.name}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
