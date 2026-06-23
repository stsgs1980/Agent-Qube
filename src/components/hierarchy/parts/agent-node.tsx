'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { type Agent, ROLE_CONFIG, STATUS_COLORS, FORMULA_COLORS, getAvatarIcon } from './types'

export function AgentNode({
  agent,
  x,
  y,
  isSelected,
  isHighlighted,
  isDimmed,
  isCollapsed,
  skillCount,
  taskCount = 0,
  statusTransition = null,
  onClick,
  onToggleCollapse,
  onHover,
  onContextMenu,
}: {
  agent: Agent
  x: number
  y: number
  isSelected: boolean
  isHighlighted: boolean
  isDimmed: boolean
  isCollapsed: boolean
  skillCount: number
  taskCount?: number
  statusTransition: { status: string; timestamp: number } | null
  onClick: () => void
  onToggleCollapse: () => void
  onHover: (id: string | null) => void
  onContextMenu: (e: React.MouseEvent, agentId: string) => void
}) {
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435']
  const statusColor = STATUS_COLORS[agent.status] || STATUS_COLORS.offline
  const formulaColor = FORMULA_COLORS[agent.formula] || '#888'
  const AvatarIcon = getAvatarIcon(agent.avatar)
  const hasChildren = (agent.children && agent.children.length > 0) || false

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer"
      onClick={onClick}
      onContextMenu={(e) => onContextMenu(e, agent.id)}
      onMouseEnter={() => onHover(agent.id)}
      onMouseLeave={() => onHover(null)}
      style={{ opacity: isDimmed ? 0.2 : isCollapsed ? 0.4 : 1, transition: 'opacity 0.4s ease' }}
    >
      {/* Search match glow effect - enhanced with filter */}
      {isHighlighted && (
        <>
          <motion.circle
            r={50}
            fill="none"
            stroke={config.color}
            strokeWidth={0.2}
            strokeOpacity={0.06}
            filter="url(#searchGlow)"
            animate={{
              r: [50, 54, 50],
              strokeOpacity: [0.06, 0.02, 0.06],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            r={44}
            fill="none"
            stroke={config.color}
            strokeWidth={0.3}
            strokeOpacity={0.2}
            animate={{
              r: [44, 48, 44],
              strokeOpacity: [0.2, 0.08, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            r={38}
            fill={`rgba(${config.colorRgb}, 0.04)`}
            animate={{
              r: [38, 40, 38],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Selection ping animation (expanding ring that fades) */}
      {isSelected && (
        <circle r={28} fill="none" stroke={config.color} strokeWidth={0.4} strokeOpacity={0.5}>
          <animate attributeName="r" from="28" to="55" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="strokeOpacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="strokeWidth" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Activity indicator ring - spins when active */}
      {agent.status === 'active' && (
        <motion.circle
          r={38}
          fill="none"
          stroke={config.color}
          strokeWidth={0.1}
          strokeOpacity={0.12}
          strokeDasharray="3 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0 0' }}
        />
      )}

      {/* Outer glow ring */}
      <motion.circle
        r={35}
        fill="none"
        stroke={config.color}
        strokeWidth={0.12}
        strokeOpacity={0.06}
        animate={{
          r: [35, 38, 35],
          strokeOpacity: [0.07, 0.12, 0.07],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Selection ring */}
      {isSelected && (
        <motion.circle
          r={40}
          fill="none"
          stroke={config.color}
          strokeWidth={0.25}
          strokeOpacity={0.3}
          animate={{
            r: [40, 43, 40],
            strokeOpacity: [0.3, 0.15, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main orb - background */}
      <motion.circle
        r={28}
        fill={`rgba(${config.colorRgb}, 0.12)`}
        stroke={config.color}
        strokeWidth={isHighlighted ? 0.3 : 0.2}
        strokeOpacity={isHighlighted ? 0.4 : 0.2}
        animate={{
          r: [28, 29, 28],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner glow */}
      <circle
        r={20}
        fill={`rgba(${config.colorRgb}, 0.06)`}
        filter="url(#orbGlow)"
      />

      {/* Avatar SVG icon via foreignObject */}
      <foreignObject x={-10} y={-10} width={20} height={20} style={{ pointerEvents: 'none' }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AvatarIcon size={16} color={config.color} strokeWidth={1.5} />
        </div>
      </foreignObject>

      {/* Agent name */}
      <text
        y={40}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="9"
        fontWeight="600"
        style={{ pointerEvents: 'none' }}
      >
        {agent.name}
      </text>

      {/* Task count indicator */}
      <text
        y={48}
        textAnchor="middle"
        fill="#B0B0B0"
        fontSize="6"
        opacity={0.5}
        style={{ pointerEvents: 'none' }}
      >
        {taskCount} tasks
      </text>

      {/* Status transition pulse ring */}
      {statusTransition && (
        <circle
          r={3}
          fill="none"
          stroke={STATUS_COLORS[statusTransition.status] || STATUS_COLORS.offline}
          strokeWidth={0.8}
          transform="translate(18, -20)"
        >
          <animate attributeName="r" from="3" to="14" dur="1s" fill="freeze" />
          <animate attributeName="strokeOpacity" from="0.8" to="0" dur="1s" fill="freeze" />
          <animate attributeName="strokeWidth" from="0.8" to="0" dur="1s" fill="freeze" />
        </circle>
      )}

      {/* Status transition floating label */}
      {statusTransition && (
        <g transform="translate(18, -32)">
          <text
            textAnchor="middle"
            fill={STATUS_COLORS[statusTransition.status] || STATUS_COLORS.offline}
            fontSize="6"
            fontWeight="700"
            style={{ pointerEvents: 'none' }}
          >
            STATUS: {statusTransition.status.toUpperCase()}
            <animate attributeName="opacity" from="1" to="0" dur="2s" fill="freeze" />
          </text>
        </g>
      )}

      {/* Formula badge */}
      <g transform="translate(-15, -19)">
        <rect
          width={30}
          height={12}
          rx={3}
          fill={formulaColor}
          fillOpacity={0.15}
          stroke={formulaColor}
          strokeWidth={0.1}
          strokeOpacity={0.3}
        />
        <text
          x={15}
          y={9}
          textAnchor="middle"
          fill={formulaColor}
          fontSize="7"
          fontWeight="700"
          style={{ pointerEvents: 'none' }}
        >
          {agent.formula}
        </text>
      </g>

      {/* Status indicator dot */}
      <g transform="translate(18, -20)">
        <motion.circle
          r={3}
          fill={statusColor}
          animate={{
            opacity: agent.status === 'active'
              ? [1, 0.4, 1]
              : agent.status === 'idle'
                ? [0.7, 0.4, 0.7]
                : [0.6],
          }}
          transition={{
            duration: agent.status === 'active' ? 2 : agent.status === 'idle' ? 3 : 0,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </g>

      {/* Expand/collapse button for agents with children */}
      {hasChildren && (
        <g
          transform="translate(0, -36)"
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onToggleCollapse() }}
        >
          <circle
            r={5}
            fill="rgba(26, 26, 26, 0.92)"
            stroke={config.color}
            strokeWidth={0.2}
            strokeOpacity={0.3}
          />
          <foreignObject x={-4} y={-4} width={8} height={8} style={{ pointerEvents: 'none' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isCollapsed
                ? React.createElement(ChevronRight, { size: 7, color: config.color })
                : React.createElement(ChevronDown, { size: 7, color: config.color })
              }
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  )
}

// ─── Hover Tooltip ───────────────────────────────────────────────────────────

