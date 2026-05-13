// Barrel exports for hierarchy components

export { default as AgentHierarchy } from './agent-hierarchy-v2'
export { AgentNode } from './agent-node'
export { AgentEdge } from './agent-edge'
export { HierarchyHeader } from './hierarchy-header'
export { HierarchyControls } from './hierarchy-controls'
export { HierarchyCanvas } from './hierarchy-canvas'
export { LayerLabels } from './layer-labels'
export { AddAgentModal } from './add-agent-modal'
export { GroupSidebar, DetailPanel, KPIStrip } from './panels'

// Types
export type { AgentData, EdgeType, ViewMode, ConnectionData, NodePosition, AgentNodeData } from './types'
export { ROLE_CONFIG, ROLE_ORDER, STATUS_COLORS, EDGE_CONFIG, FORMULA_DESC } from './types'

// Layout algorithms
export { computeDagreLayout, computeRadialLayout, computeGridLayout } from './layout-algorithms'
export { buildConnections } from './build-connections'

// Icon map
export { AVATAR_ICONS } from './agent-icons'

// Edge particles
export { EdgeParticles, EDGE_DURATIONS } from './edge-particles'
