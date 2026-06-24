'use client'
import { type EdgeType, EDGE_CONFIG } from './types'

export function ConnectionHoverLabel({ midX, midY, strokeColor, type, fromName, toName }: {
  midX: number; midY: number; strokeColor: string; type: EdgeType; fromName: string; toName: string
}) {
  return (
    <g>
      <rect x={midX - 32} y={midY - 20} width={64} height={16} rx={4}
        fill="rgba(26, 26, 26, 0.92)" stroke={strokeColor} strokeWidth={0.15} strokeOpacity={0.2} />
      <text x={midX} y={midY - 10} textAnchor="middle" fill={strokeColor} fontSize="8" fontWeight="600"
        style={{ pointerEvents: 'none' }}>{EDGE_CONFIG[type].label}</text>
      <rect x={midX - 60} y={midY + 8} width={120} height={28} rx={6}
        fill="rgba(13, 13, 13, 0.95)" stroke="rgba(51,51,51,0.5)" strokeWidth={0.15} />
      <text x={midX} y={midY + 20} textAnchor="middle" fill="#FFFFFF" fontSize="8"
        style={{ pointerEvents: 'none' }}>{fromName} {' -> '} {toName}</text>
      <text x={midX} y={midY + 32} textAnchor="middle" fill={strokeColor} fontSize="7"
        style={{ pointerEvents: 'none' }}>[{EDGE_CONFIG[type].label}]</text>
    </g>
  )
}