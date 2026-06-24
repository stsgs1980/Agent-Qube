'use client'
import { useRef, useEffect, useState, type RefObject } from 'react'
import { type EdgeType, EDGE_CONFIG, type FlowParticle } from './types'
import { computePath, computeStrokeWidth, computeStrokeOpacity, computeArrows, computeStartArrows } from './connection-line-utils'
import { ConnectionHoverLabel } from './connection-hover-label'

function FlowParticles({ pathRef, particlesRef, color, isPulsing }: { pathRef: RefObject<SVGPathElement | null>; particlesRef: RefObject<FlowParticle[]>; color: string; isPulsing: boolean }) {
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    const update = () => {
      const path = pathRef.current; if (!path) return
      const totalLen = path.getTotalLength()
      setPoints(particlesRef.current.map(p => {
        const pt = path.getPointAtLength(p.progress * totalLen)
        return { x: pt.x, y: pt.y }
      }))
      requestAnimationFrame(update)
    }
    const raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [pathRef, particlesRef])

  return (
    <>
      {points.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={isPulsing ? 5 : 3} fill={color} opacity={isPulsing ? 1.0 : 0.8}>
          <animate attributeName="opacity" values={isPulsing ? "0.6;1;0.6" : "0.4;1;0.4"} dur="1.5s" repeatCount="indefinite" />
        </circle>
      ))}
    </>
  )
}

function EdgeMarkers({ type, midX, midY, color }: { type: EdgeType; midX: number; midY: number; color: string }) {
  if (type === 'twin') return <polygon points={`${midX},${midY - 5} ${midX + 5},${midY} ${midX},${midY + 5} ${midX - 5},${midY}`} fill={color} opacity={0.6} />
  if (type === 'delegate') return <polygon points={`${midX},${midY - 4} ${midX + 4},${midY} ${midX},${midY + 4} ${midX - 4},${midY}`} fill={EDGE_CONFIG.delegate.color} opacity={0.7} />
  if (type === 'broadcast') return (
    <g transform={`translate(${midX}, ${midY})`} opacity={0.7}>
      <polygon points="-3,-3 2,-1 2,1 -3,3" fill={EDGE_CONFIG.broadcast.color} />
      <rect x={2} y={-2} width={2} height={4} rx={0.5} fill={EDGE_CONFIG.broadcast.color} />
      <line x1={5} y1={-3} x2={6} y2={-4} stroke={EDGE_CONFIG.broadcast.color} strokeWidth={0.5} />
      <line x1={5} y1={0} x2={7} y2={0} stroke={EDGE_CONFIG.broadcast.color} strokeWidth={0.5} />
      <line x1={5} y1={3} x2={6} y2={4} stroke={EDGE_CONFIG.broadcast.color} strokeWidth={0.5} />
    </g>
  )
  return null
}

function ConnectionPaths({ pathD, pathRef, type, isPulsing, isHovered, strength, color, particlesRef, x2, y2, cx1, x1, y1, midX, midY, edgeId, strokeColor, fromName, toName }: {
  pathD: string; pathRef: RefObject<SVGPathElement | null>; type: EdgeType; isPulsing: boolean; isHovered: boolean
  strength: number; color: string; particlesRef: RefObject<FlowParticle[]>; x2: number; y2: number; cx1: number
  x1: number; y1: number; midX: number; midY: number; edgeId: string; strokeColor: string
  fromName: string; toName: string; startArrow: { x1: number; y1: number; x2: number; y2: number }
  endArrow: { end: { x1: number; y1: number; x2: number; y2: number } }; strokeWidth: number
}) {
  const glowOpacity = isPulsing || isHovered ? 0.5 * (0.5 + strength * 0.5) : 0.25 * (0.5 + strength * 0.5)
  return (
    <>
      <path d={pathD} fill="none" stroke="transparent" strokeWidth={6} />
      <path ref={pathRef} d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeOpacity={computeStrokeOpacity(isPulsing, isHovered, strength)} strokeDasharray={EDGE_CONFIG[type].strokeDasharray} />
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth * 0.5} strokeOpacity={glowOpacity} strokeDasharray={EDGE_CONFIG[type].strokeDasharray} />
      {type === 'twin' && <path d={pathD} fill="none" stroke={color} strokeWidth={0.2} strokeOpacity={0.08} strokeDasharray="8 4"><animate attributeName="strokeOpacity" values="0.03;0.1;0.03" dur="2s" repeatCount="indefinite" /></path>}
      <polygon points={`${x2},${y2} ${endArrow.end.x1},${endArrow.end.y1} ${endArrow.end.x2},${endArrow.end.y2}`} fill={strokeColor} opacity={isHovered ? 0.8 : 0.5} />
      {type === 'sync' && <polygon points={`${x1},${y1} ${startArrow.x1},${startArrow.y1} ${startArrow.x2},${startArrow.y2}`} fill={EDGE_CONFIG.sync.color} opacity={isHovered ? 0.8 : 0.5} />}
      <EdgeMarkers type={type} midX={midX} midY={midY} color={color} />
      <FlowParticles pathRef={pathRef} particlesRef={particlesRef} color={color} isPulsing={isPulsing} />
      {isHovered && <ConnectionHoverLabel midX={midX} midY={midY} strokeColor={strokeColor} type={type} fromName={fromName} toName={toName} />}
    </>
  )
}

export function ConnectionLine({ x1, y1, x2, y2, color, type, strength = 1, hoveredEdge, fromName, toName, isPulsing = false }: {
  x1: number; y1: number; x2: number; y2: number; color: string; type: EdgeType; strength?: number
  hoveredEdge: string | null; fromName: string; toName: string; isPulsing?: boolean
}) {
  const particlesRef = useRef<FlowParticle[]>([])
  const animationRef = useRef<number>(0)
  const pathRef = useRef<SVGPathElement>(null)

  const { pathD, midX, midY, cx1 } = computePath(x1, y1, x2, y2)
  const edgeId = `edge-${x1}-${y1}-${x2}-${y2}`
  const isHovered = hoveredEdge === edgeId
  const endArrow = computeArrows(x1, y1, x2, cx1)
  const startArrow = computeStartArrows(x1, y1, cx1)
  const strokeWidth = computeStrokeWidth(type, strength)
  const strokeColor = EDGE_CONFIG[type].color

  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const count = type === 'twin' ? 2 : type === 'sync' ? 1 : 3
      for (let i = 0; i < count; i++) particlesRef.current.push({ id: i, progress: i / count, speed: 0.002 + Math.random() * 0.003 })
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

  return (
    <g data-edge-id={edgeId} style={{ cursor: 'pointer' }}>
      <ConnectionPaths pathD={pathD} pathRef={pathRef} type={type} isPulsing={isPulsing} isHovered={isHovered} strength={strength} color={color} particlesRef={particlesRef} x2={x2} y2={y2} cx1={cx1} x1={x1} y1={y1} midX={midX} midY={midY} edgeId={edgeId} strokeColor={strokeColor} fromName={fromName} toName={toName} startArrow={startArrow} endArrow={endArrow} strokeWidth={strokeWidth} />
    </g>
  )
}