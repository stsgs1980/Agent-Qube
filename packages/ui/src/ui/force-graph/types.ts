// ─── Force Graph Types ────────────────────────────────────────

/** A node in the force graph */
export interface ForceGraphNode {
  /** Unique identifier */
  id: string
  /** Current x position (set by physics engine) */
  x: number
  /** Current y position (set by physics engine) */
  y: number
  /** Velocity x (internal) */
  vx: number
  /** Velocity y (internal) */
  vy: number
  /** Node circle radius */
  radius: number
  /** Fill color (hex string) */
  color: string
  /** Optional group key for clustering (e.g. category name) */
  group?: string
  /** Opaque data attached to this node */
  data?: unknown
}

/** An edge connecting two nodes */
export interface ForceGraphEdge {
  /** Source node id */
  source: string
  /** Target node id */
  target: string
}

/** Physics simulation configuration */
export interface PhysicsConfig {
  /** Repulsion force between nodes (default 500) */
  repulsion?: number
  /** Attraction force along edges (default 0.01) */
  attraction?: number
  /** Pull toward center (default 0.005) */
  centerGravity?: number
  /** Group clustering force (default 0.03) */
  groupGravity?: number
  /** Velocity damping per frame 0-1 (default 0.85) */
  damping?: number
  /** Maximum velocity magnitude (default 10) */
  maxVelocity?: number
  /** Boundary padding in px (default 40) */
  padding?: number
}

export interface UseForceGraphOptions {
  nodes: ForceGraphNode[]
  edges: ForceGraphEdge[]
  width?: number
  height?: number
  physics?: PhysicsConfig
  maxFrames?: number
}

export interface UseForceGraphReturn {
  positions: ForceGraphNode[]
  zoom: number
  pan: { x: number; y: number }
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  handleWheel: (e: React.WheelEvent) => void
  handlePanStart: (e: React.MouseEvent) => void
  highlightedEdges: Set<string>
  highlightedNodes: Set<string>
  hoveredNode: string | null
  setHoveredNode: (id: string | null) => void
  isSettled: boolean
}

export interface ForceGraphProps {
  nodes: ForceGraphNode[]
  edges: ForceGraphEdge[]
  groupColors?: Record<string, string>
  defaultColor?: string
  onNodeClick?: (node: ForceGraphNode) => void
  renderTooltip?: (node: ForceGraphNode) => React.ReactNode
  showLegend?: boolean
  physics?: PhysicsConfig
  maxFrames?: number
  className?: string
  svgWidth?: number | string
  svgHeight?: number | string
}
