import type { Agent, Connection } from './types'
import { ROLE_CONFIG, ROLE_ORDER, EDGE_CONFIG } from './types'

export function MiniMap({
  agents,
  positions,
  connections,
  dimensions,
  pan,
  zoom,
  onClickMap,
  selectedAgentId,
}: {
  agents: Agent[]
  positions: Record<string, { x: number; y: number }>
  connections: Connection[]
  dimensions: { width: number; height: number }
  pan: { x: number; y: number }
  zoom: number
  onClickMap: (ratioX: number, ratioY: number) => void
  selectedAgentId: string | null
}) {
  const scale = 160 / Math.max(dimensions.width, dimensions.height)
  const mapW = dimensions.width * scale
  const mapH = dimensions.height * scale

  const vpW = (dimensions.width / zoom) * scale
  const vpH = (dimensions.height / zoom) * scale
  const vpX = (-pan.x / zoom) * scale
  const vpY = (-pan.y / zoom) * scale

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(26, 26, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(51,51,51,0.5)',
        width: 180,
        padding: 10,
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[8px] text-[#555] uppercase tracking-wider font-semibold">Overview</span>
        <span className="text-[8px] text-[#555]">{Math.round(zoom * 100)}%</span>
      </div>
      <svg
        width={mapW}
        height={mapH}
        className="cursor-pointer rounded"
        style={{ background: 'rgba(0,0,0,0.3)' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const rx = (e.clientX - rect.left) / mapW
          const ry = (e.clientY - rect.top) / mapH
          onClickMap(rx, ry)
        }}
      >
        {/* Cluster rings */}
        {ROLE_ORDER.map((group, gi) => {
          const cfg = ROLE_CONFIG[group]
          const minDim = Math.min(dimensions.width, dimensions.height)
          const baseRadius = minDim * 0.14
          const ringSpacing = minDim * 0.14
          const radius = (baseRadius + ringSpacing * gi) * scale
          const cx = dimensions.width * scale / 2
          const cy = dimensions.height * scale / 2
          return (
            <circle
              key={group}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={cfg.color}
              strokeWidth={0.15}
              strokeOpacity={0.12}
              strokeDasharray="2 4"
            />
          )
        })}

        {/* Connection lines */}
        {connections.map(conn => {
          const from = positions[conn.from]
          const to = positions[conn.to]
          if (!from || !to) return null
          return (
            <line
              key={conn.id}
              x1={from.x * scale}
              y1={from.y * scale}
              x2={to.x * scale}
              y2={to.y * scale}
              stroke={EDGE_CONFIG[conn.type].color}
              strokeWidth={0.15}
              strokeOpacity={0.15}
              strokeDasharray={conn.type === 'sync' ? '1 2' : conn.type === 'twin' ? '2 1' : undefined}
            />
          )
        })}

        {/* Agent dots */}
        {agents.map(agent => {
          const pos = positions[agent.id]
          if (!pos) return null
          const cfg = ROLE_CONFIG[agent.roleGroup]
          const isSelected = agent.id === selectedAgentId
          return (
            <circle
              key={agent.id}
              cx={pos.x * scale}
              cy={pos.y * scale}
              r={isSelected ? 3 : 1.5}
              fill={isSelected ? '#FFFFFF' : cfg.color}
              opacity={isSelected ? 1 : 0.8}
            />
          )
        })}

        {/* Viewport indicator glow */}
        <rect
          x={vpX - 1}
          y={vpY - 1}
          width={vpW + 2}
          height={vpH + 2}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={1}
          strokeOpacity={0.1}
          rx={2}
          filter="url(#orbGlow)"
        />
        {/* Viewport indicator */}
        <rect
          x={vpX}
          y={vpY}
          width={vpW}
          height={vpH}
          fill="rgba(6,182,212,0.04)"
          stroke="#06B6D4"
          strokeWidth={0.3}
          strokeOpacity={0.4}
          rx={1}
        />
      </svg>
    </div>
  )
}

// ─── Agent Creation Dialog ───────────────────────────────────────────────────

