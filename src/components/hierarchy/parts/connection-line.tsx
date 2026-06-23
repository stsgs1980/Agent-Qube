'use client'
import { useRef, useEffect, useState } from 'react'
import { type EdgeType, EDGE_CONFIG, type FlowParticle } from './types'

export function ConnectionLine({
  x1, y1, x2, y2, color, colorRgb, type, strength = 1, hoveredEdge, fromName, toName, isPulsing = false,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string; colorRgb: string; type: EdgeType; strength?: number
  hoveredEdge: string | null; fromName: string; toName: string
  isPulsing?: boolean
}) {
  const particlesRef = useRef<FlowParticle[]>([])
  const animationRef = useRef<number>(0)
  const pathRef = useRef<SVGPathElement>(null)

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  const offset = dist * 0.2
  const cx1 = midX - (dy / dist) * offset
  const cy1 = midY + (dx / dist) * offset

  const pathD = `M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2}`

  const edgeId = `edge-${x1}-${y1}-${x2}-${y2}`
  const isHovered = hoveredEdge === edgeId

  const arrowLen = 8
  const endAngle = Math.atan2(y2 - cy1, x2 - cx1)
  const arrowX1 = x2 - arrowLen * Math.cos(endAngle - Math.PI / 6)
  const arrowY1 = y2 - arrowLen * Math.sin(endAngle - Math.PI / 6)
  const arrowX2 = x2 - arrowLen * Math.cos(endAngle + Math.PI / 6)
  const arrowY2 = y2 - arrowLen * Math.sin(endAngle + Math.PI / 6)

  const startAngle = Math.atan2(y1 - cy1, x1 - cx1)
  const sArrowX1 = x1 - arrowLen * Math.cos(startAngle - Math.PI / 6)
  const sArrowY1 = y1 - arrowLen * Math.sin(startAngle - Math.PI / 6)
  const sArrowX2 = x1 - arrowLen * Math.cos(startAngle + Math.PI / 6)
  const sArrowY2 = y1 - arrowLen * Math.sin(startAngle + Math.PI / 6)

  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const count = type === 'twin' ? 2 : type === 'sync' ? 1 : 3
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          id: i,
          progress: i / count,
          speed: 0.002 + Math.random() * 0.003,
        })
      }
    }
  }, [type])

  useEffect(() => {
    const animate = () => {
      for (const p of particlesRef.current) {
        p.progress += p.speed
        if (p.progress > 1) p.progress -= 1
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const FlowParticles = () => {
    const [points, setPoints] = useState<Array<{ x: number; y: number }>>([])

    useEffect(() => {
      const update = () => {
        const path = pathRef.current
        if (!path) return
        const totalLen = path.getTotalLength()
        const pts = particlesRef.current.map(p => {
          const len = p.progress * totalLen
          const pt = path.getPointAtLength(len)
          return { x: pt.x, y: pt.y }
        })
        setPoints(pts)
        requestAnimationFrame(update)
      }
      const raf = requestAnimationFrame(update)
      return () => cancelAnimationFrame(raf)
    }, [])

    return (
      <>
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={isPulsing ? 5 : 3}
            fill={color}
            opacity={isPulsing ? 1.0 : 0.8}
          >
            <animate
              attributeName="opacity"
              values={isPulsing ? "0.6;1;0.6" : "0.4;1;0.4"}
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </>
    )
  }

  // ─── Enhanced Connection Strength Visualization ───
  // Stronger connections = thicker + brighter lines
  const strengthFactor = 0.5 + strength * 0.5 // maps [0,1] → [0.5, 1.0]
  const baseStrokeWidth = type === 'command' ? 0.2
    : type === 'twin' ? 0.2
    : type === 'delegate' ? 0.18
    : type === 'supervise' ? 0.12
    : type === 'broadcast' ? 0.15
    : 0.15
  const strokeWidth = baseStrokeWidth * strengthFactor

  const strokeColor = EDGE_CONFIG[type].color
  const strokeOpacity = isPulsing ? 0.4 * strengthFactor : isHovered ? 0.4 * strengthFactor : 0.18 * strengthFactor

  return (
    <g
      data-edge-id={edgeId}
      style={{ cursor: 'pointer' }}
    >
      {/* Background path for hover detection */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={6}
      />
      {/* Main path */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        strokeDasharray={EDGE_CONFIG[type].strokeDasharray}
      />
      {/* Glow path - stronger for stronger connections */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.5}
        strokeOpacity={isPulsing ? 0.5 * strengthFactor : isHovered ? 0.5 * strengthFactor : 0.25 * strengthFactor}
        strokeDasharray={EDGE_CONFIG[type].strokeDasharray}
      />

      {/* Twin pulsing glow */}
      {type === 'twin' && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={0.2}
          strokeOpacity={0.08}
          strokeDasharray="8 4"
        >
          <animate
            attributeName="strokeOpacity"
            values="0.03;0.1;0.03"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      )}

      {/* End arrow (for all types) */}
      <polygon
        points={`${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
        fill={strokeColor}
        opacity={isHovered ? 0.8 : 0.5}
      />

      {/* Bidirectional arrows for sync */}
      {type === 'sync' && (
        <polygon
          points={`${x1},${y1} ${sArrowX1},${sArrowY1} ${sArrowX2},${sArrowY2}`}
          fill={EDGE_CONFIG.sync.color}
          opacity={isHovered ? 0.8 : 0.5}
        />
      )}

      {/* Diamond markers for twin */}
      {type === 'twin' && (
        <polygon
          points={`${midX},${midY - 5} ${midX + 5},${midY} ${midX},${midY + 5} ${midX - 5},${midY}`}
          fill={color}
          opacity={0.6}
        />
      )}

      {/* Diamond icon at midpoint for delegate edges */}
      {type === 'delegate' && (
        <polygon
          points={`${midX},${midY - 4} ${midX + 4},${midY} ${midX},${midY + 4} ${midX - 4},${midY}`}
          fill={EDGE_CONFIG.delegate.color}
          opacity={0.7}
        />
      )}

      {/* Megaphone icon at midpoint for broadcast edges */}
      {type === 'broadcast' && (
        <g transform={`translate(${midX}, ${midY})`} opacity={0.7}>
          <polygon points="-3,-3 2,-1 2,1 -3,3" fill={EDGE_CONFIG.broadcast.color} />
          <rect x={2} y={-2} width={2} height={4} rx={0.5} fill={EDGE_CONFIG.broadcast.color} />
          <line x1={5} y1={-3} x2={6} y2={-4} stroke={EDGE_CONFIG.broadcast.color} strokeWidth={0.5} />
          <line x1={5} y1={0} x2={7} y2={0} stroke={EDGE_CONFIG.broadcast.color} strokeWidth={0.5} />
          <line x1={5} y1={3} x2={6} y2={4} stroke={EDGE_CONFIG.broadcast.color} strokeWidth={0.5} />
        </g>
      )}

      <FlowParticles />

      {/* Edge label on hover */}
      {isHovered && (
        <g>
          <rect
            x={midX - 32}
            y={midY - 20}
            width={64}
            height={16}
            rx={4}
            fill="rgba(26, 26, 26, 0.92)"
            stroke={strokeColor}
            strokeWidth={0.15}
            strokeOpacity={0.2}
          />
          <text
            x={midX}
            y={midY - 10}
            textAnchor="middle"
            fill={strokeColor}
            fontSize="8"
            fontWeight="600"
            style={{ pointerEvents: 'none' }}
          >
            {EDGE_CONFIG[type].label}
          </text>
          {/* Connection annotation tooltip */}
          <rect
            x={midX - 60}
            y={midY + 8}
            width={120}
            height={28}
            rx={6}
            fill="rgba(13, 13, 13, 0.95)"
            stroke="rgba(51,51,51,0.5)"
            strokeWidth={0.15}
          />
          <text
            x={midX}
            y={midY + 20}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8"
            style={{ pointerEvents: 'none' }}
          >
            {fromName} {' -> '} {toName}
          </text>
          <text
            x={midX}
            y={midY + 32}
            textAnchor="middle"
            fill={strokeColor}
            fontSize="7"
            style={{ pointerEvents: 'none' }}
          >
            [{EDGE_CONFIG[type].label}]
          </text>
        </g>
      )}
    </g>
  )
}

// ─── Agent Node (Enhanced with search glow) ──────────────────────────────────

