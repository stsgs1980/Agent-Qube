import { useMemo } from 'react'
import type { ForceGraphEdge } from './types'

// ─── Types ────────────────────────────────────────────────────

export interface UseGraphHighlightReturn {
  highlightedEdges: Set<string>
  highlightedNodes: Set<string>
}

// ─── useGraphHighlight Hook ───────────────────────────────────

/**
 * useGraphHighlight -- compute highlighted edges/nodes for a hovered node.
 *
 * Pure computation, no state. Returns Sets of connected edge keys and
 * neighboring node IDs. Empty sets when nothing is hovered.
 *
 * @example
 * ```tsx
 * const { highlightedEdges, highlightedNodes } = useGraphHighlight(hoveredId, edges)
 * ```
 */
export function useGraphHighlight(
  hoveredNode: string | null,
  edges: ForceGraphEdge[]
): UseGraphHighlightReturn {
  return useMemo(() => {
    if (!hoveredNode) return { highlightedEdges: new Set<string>(), highlightedNodes: new Set<string>() }
    const hEdges = new Set<string>()
    const hNodes = new Set<string>([hoveredNode])
    for (const edge of edges) {
      const key = `${edge.source}-${edge.target}`
      if (edge.source === hoveredNode) { hEdges.add(key); hNodes.add(edge.target) }
      if (edge.target === hoveredNode) { hEdges.add(key); hNodes.add(edge.source) }
    }
    return { highlightedEdges: hEdges, highlightedNodes: hNodes }
  }, [hoveredNode, edges])
}
