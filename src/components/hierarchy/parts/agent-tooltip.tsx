import type { Agent } from './types'
import { ROLE_CONFIG, STATUS_COLORS } from './types'

export function AgentTooltip({
  agent,
  x,
  y,
}: {
  agent: Agent
  x: number
  y: number
}) {
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435']
  const statusColor = STATUS_COLORS[agent.status] || STATUS_COLORS.offline
  const skills = agent.skills ? agent.skills.split(',').filter(Boolean) : []

  return (
    <g transform={`translate(${x - 75}, ${y - 80})`}>
      <rect
        width={150}
        height={52}
        rx={8}
        fill="rgba(13, 13, 13, 0.95)"
        stroke={config.color}
        strokeWidth={0.15}
        strokeOpacity={0.15}
      />
      <text
        x={12}
        y={16}
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="700"
        style={{ pointerEvents: 'none' }}
      >
        {agent.name}
      </text>
      <text
        x={12}
        y={28}
        fill={config.color}
        fontSize="8"
        style={{ pointerEvents: 'none' }}
      >
        {agent.role}
      </text>
      <circle cx={120} cy={12} r={4} fill={statusColor} />
      <text
        x={128}
        y={15}
        fill="#B0B0B0"
        fontSize="7"
        style={{ pointerEvents: 'none' }}
      >
        {agent.status}
      </text>
      <text
        x={12}
        y={42}
        fill="#B0B0B0"
        fontSize="7"
        style={{ pointerEvents: 'none' }}
      >
        {skills.length} skills | {agent.formula}
      </text>
    </g>
  )
}

// ─── Agent Icon Helper (for HTML context) ────────────────────────────────────

