'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { runPhysics } from './physics'
import { useGraphHighlight } from './use-graph-highlight'
import type { ForceGraphNode, ForceGraphEdge, PhysicsConfig } from './types'
import type { UseForceGraphOptions, UseForceGraphReturn } from './types'

// ─── useForceGraph Hook ───────────────────────────────────────

/**
 * useForceGraph -- force-directed simulation with zoom/pan and hover highlighting.
 *
 * Encapsulates: physics loop, node positions, zoom/pan controls, hover, settling.
 * Pure hook -- no rendering.
 *
 * @example
 * ```tsx
 * const { positions, zoom, pan, zoomIn, zoomOut, hoveredNode, setHoveredNode } =
 *   useForceGraph({ nodes, edges, width: 800, height: 500 })
 * ```
 */
export function useForceGraph(options: UseForceGraphOptions): UseForceGraphReturn {
  const { nodes, edges, width = 800, height = 500, physics, maxFrames = 300 } = options

  const nodesRef = useRef<ForceGraphNode[]>([])
  const rafRef = useRef<number>(0)
  const frameRef = useRef(0)
  const dragRef = useRef({ active: false, x: 0, y: 0 })

  const [positions, setPositions] = useState<ForceGraphNode[]>([])
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isSettled, setIsSettled] = useState(false)

  const { highlightedEdges, highlightedNodes } = useGraphHighlight(hoveredNode, edges)

  // Initialize nodes
  useEffect(() => {
    const init = nodes.map(n => ({
      ...n,
      x: n.x || Math.random() * (width - 80) + 40,
      y: n.y || Math.random() * (height - 80) + 40,
      vx: 0, vy: 0,
    }))
    nodesRef.current = init
    setPositions([...init])
    frameRef.current = 0
    setIsSettled(false)
  }, [nodes, width, height])

  // Animation loop
  useEffect(() => {
    const tick = () => {
      runPhysics(nodesRef.current, edges, width, height, physics)
      setPositions([...nodesRef.current])
      if (++frameRef.current >= maxFrames) { setIsSettled(true); return }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [nodes, edges, width, height, physics, maxFrames])

  // Zoom controls
  const zoomIn = useCallback(() => setZoom(z => Math.min(z * 1.3, 5)), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(z / 1.3, 0.2)), [])
  const resetView = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }) }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.2, Math.min(5, z - e.deltaY * 0.001)))
  }, [])

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    const d = dragRef.current
    d.active = true; d.x = e.clientX; d.y = e.clientY
    const onMove = (ev: MouseEvent) => {
      if (!d.active) return
      setPan(p => ({ x: p.x + (ev.clientX - d.x) / zoom, y: p.y + (ev.clientY - d.y) / zoom }))
      d.x = ev.clientX; d.y = ev.clientY
    }
    const onUp = () => { d.active = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [zoom])

  return {
    positions, zoom, pan, zoomIn, zoomOut, resetView,
    handleWheel, handlePanStart,
    highlightedEdges, highlightedNodes,
    hoveredNode, setHoveredNode, isSettled,
  }
}
