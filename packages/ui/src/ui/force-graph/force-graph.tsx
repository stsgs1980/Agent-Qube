'use client'

import { forwardRef, useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'
import { useForceGraph } from './use-force-graph'
import type { ForceGraphNode, ForceGraphEdge, PhysicsConfig } from './types'
import type { ForceGraphProps } from './types'

// ─── useContainerSize hook (internal) ─────────────────────────

function useContainerSize() {
  const [size, setSize] = useState({ width: 800, height: 500 })
  const obs = useRef<ResizeObserver | null>(null)
  const ref = useCallback((el: HTMLDivElement | null) => {
    obs.current?.disconnect()
    if (!el) return
    obs.current = new ResizeObserver(([e]) => setSize({ width: e.contentRect.width, height: e.contentRect.height }))
    obs.current.observe(el)
  }, [])
  useEffect(() => () => obs.current?.disconnect(), [])
  return { ...size, ref }
}

// ─── ForceGraph Component ─────────────────────────────────────

/**
 * ForceGraph -- interactive force-directed graph with physics, zoom/pan, hover, legend.
 *
 * Zero external animation deps -- uses requestAnimationFrame + ResizeObserver.
 *
 * @example
 * ```tsx
 * <ForceGraph
 *   nodes={nodes} edges={edges}
 *   groupColors={{ frontend: '#3b82f6', backend: '#10b981' }}
 *   onNodeClick={(n) => setSelected(n.data)}
 * />
 * ```
 */
export const ForceGraph = forwardRef<HTMLDivElement, ForceGraphProps>(
  ({ nodes, edges, groupColors, defaultColor = '#6b7280', onNodeClick, renderTooltip, showLegend, physics, maxFrames, className, svgWidth, svgHeight }, ref) => {
    const { width, height, ref: containerRef } = useContainerSize()
    const g = useForceGraph({ nodes, edges, width, height, physics, maxFrames })

    const groups = useMemo(() => {
      const m = new Map<string, string>()
      for (const n of nodes) if (n.group && !m.has(n.group)) m.set(n.group, n.color || groupColors?.[n.group] || defaultColor)
      return Array.from(m.entries())
    }, [nodes, groupColors, defaultColor])

    const color = useCallback((n: ForceGraphNode) =>
      n.color || (n.group && groupColors?.[n.group]) || defaultColor, [groupColors, defaultColor])

    const dimmed = (id: string) => g.hoveredNode && !g.highlightedNodes.has(id)

    return (
      <div ref={(el) => { containerRef(el); if (typeof ref === 'function') ref(el) }}
        className={cn('relative overflow-hidden rounded-lg border border-border bg-card', className)}>
        {/* Zoom toolbar */}
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          {([
            ['+', g.zoomIn],
            ['-', g.zoomOut],
            ['0', g.resetView],
          ] as const).map(([label, fn]) => (
            <button key={label} type="button" onClick={fn}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
              {label}
            </button>
          ))}
        </div>

        {/* SVG canvas */}
        <svg width={svgWidth ?? '100%'} height={svgHeight ?? '100%'} viewBox={`0 0 ${width} ${height}`}
          onWheel={g.handleWheel} onMouseDown={g.handlePanStart}
          className="cursor-grab active:cursor-grabbing" style={{ minHeight: (typeof svgHeight === 'number' ? svgHeight : 400) }}>
          <defs>
            <filter id="fg-glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g transform={`translate(${g.pan.x + width / 2},${g.pan.y + height / 2}) scale(${g.zoom}) translate(${-width / 2},${-height / 2})`}>
            {/* Edges */}
            {edges.map((edge, i) => {
              const s = g.positions.find(n => n.id === edge.source)
              const t = g.positions.find(n => n.id === edge.target)
              if (!s || !t) return null
              const k = `${edge.source}-${edge.target}`
              const hi = g.highlightedEdges.has(k)
              return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={hi ? color(s) : 'var(--color-border)'} strokeWidth={hi ? 2 : 1}
                opacity={g.hoveredNode ? (hi ? 0.8 : 0.1) : 0.3} />
            })}
            {/* Nodes */}
            {g.positions.map(n => (
              <g key={n.id} transform={`translate(${n.x},${n.y})`}
                onClick={() => onNodeClick?.(n)} onMouseEnter={() => g.setHoveredNode(n.id)} onMouseLeave={() => g.setHoveredNode(null)}
                className="cursor-pointer" opacity={dimmed(n.id) ? 0.2 : 1}>
                {g.hoveredNode === n.id && <circle r={n.radius + 4} fill="none" stroke={color(n)} strokeWidth={1} opacity={0.4} filter="url(#fg-glow)" />}
                <circle r={n.radius} fill={color(n)} stroke="var(--color-background)" strokeWidth={1.5} />
                {renderTooltip && g.hoveredNode === n.id && (
                  <g transform={`translate(0,${-n.radius - 10})`}>
                    <rect x={-60} y={-12} width={120} height={24} rx={6} fill="var(--color-popover)" stroke="var(--color-border)" />
                    <foreignObject x={-58} y={-10} width={116} height={20}>
                      <div className="flex items-center justify-center text-[10px] text-popover-foreground">{renderTooltip(n)}</div>
                    </foreignObject>
                  </g>
                )}
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        {showLegend && groups.length > 0 && (
          <div className="flex flex-wrap gap-3 border-t border-border bg-background/80 px-4 py-2 backdrop-blur-sm">
            {groups.map(([name, c]) => (
              <span key={name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: c }} />{name}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
)
ForceGraph.displayName = 'ForceGraph'
