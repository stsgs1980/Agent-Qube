import { Workflow } from 'lucide-react'

const NODES = [
  { id: 'CoT', x: 60, y: 30, color: '#999999' }, { id: 'ToT', x: 170, y: 30, color: '#999999' },
  { id: 'GoT', x: 280, y: 30, color: '#999999' }, { id: 'MetaCoT', x: 60, y: 90, color: '#666666' },
  { id: 'AoT', x: 280, y: 90, color: '#999999' }, { id: 'SoT', x: 390, y: 90, color: '#999999' },
  { id: 'CoVe', x: 60, y: 150, color: '#888888' }, { id: 'Reflexion', x: 170, y: 150, color: '#888888' },
  { id: 'SelfConsistency', x: 280, y: 150, color: '#888888' }, { id: 'SelfRefine', x: 390, y: 150, color: '#888888' },
  { id: 'ReAct', x: 60, y: 210, color: '#777777' }, { id: 'ReWOO', x: 170, y: 210, color: '#777777' },
  { id: 'PromptChaining', x: 280, y: 210, color: '#777777' }, { id: 'PlanAndSolve', x: 390, y: 210, color: '#777777' },
  { id: 'PoT', x: 60, y: 270, color: '#666666' }, { id: 'StepBack', x: 170, y: 270, color: '#777777' },
  { id: 'LeastToMost', x: 280, y: 270, color: '#777777' }, { id: 'DSPy', x: 60, y: 330, color: '#666666' },
  { id: 'MoA', x: 170, y: 330, color: '#666666' }, { id: 'LATS', x: 280, y: 330, color: '#666666' },
]

const EDGES = [
  { from: 'CoT', to: 'ToT' }, { from: 'ToT', to: 'GoT' }, { from: 'CoT', to: 'MetaCoT' },
  { from: 'GoT', to: 'AoT' }, { from: 'AoT', to: 'SoT' }, { from: 'MetaCoT', to: 'CoVe' },
  { from: 'CoVe', to: 'Reflexion' }, { from: 'Reflexion', to: 'SelfConsistency' },
  { from: 'SelfConsistency', to: 'SelfRefine' }, { from: 'Reflexion', to: 'ReAct' },
  { from: 'ReAct', to: 'ReWOO' }, { from: 'ReWOO', to: 'PromptChaining' },
  { from: 'PromptChaining', to: 'PlanAndSolve' }, { from: 'ReAct', to: 'PoT' },
  { from: 'ReWOO', to: 'StepBack' }, { from: 'PromptChaining', to: 'LeastToMost' },
  { from: 'PoT', to: 'DSPy' }, { from: 'DSPy', to: 'MoA' }, { from: 'MoA', to: 'LATS' },
]

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))
const nodeRadius = 14

function EdgeArrow({ from, to }: { from: typeof NODES[0]; to: typeof NODES[0] }) {
  const dx = to.x - from.x, dy = to.y - from.y, dist = Math.sqrt(dx * dx + dy * dy)
  const startX = from.x + (dx / dist) * nodeRadius, startY = from.y + (dy / dist) * nodeRadius
  const endX = to.x - (dx / dist) * nodeRadius, endY = to.y - (dy / dist) * nodeRadius
  const arrowLen = 5, angle = Math.atan2(dy, dx)
  return (
    <g>
      <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />
      <polygon points={`${endX},${endY} ${endX - arrowLen * Math.cos(angle - Math.PI / 6)},${endY - arrowLen * Math.sin(angle - Math.PI / 6)} ${endX - arrowLen * Math.cos(angle + Math.PI / 6)},${endY - arrowLen * Math.sin(angle + Math.PI / 6)}`}
        fill="rgba(6, 182, 212, 0.3)" />
    </g>
  )
}

export function FormulaFlowDiagram() {
  return (
    <div className="rounded-xl p-4 sm:p-6 overflow-x-auto"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)' }}>
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Workflow className="w-3.5 h-3.5 text-cyan-400" />Formula Flow Diagram
      </h3>
      <svg viewBox="0 0 440 370" className="w-full max-w-2xl mx-auto" style={{ minHeight: '280px' }}>
        {EDGES.map((edge, i) => {
          const f = nodeMap[edge.from];
          const t = nodeMap[edge.to];
          return f && t ? <EdgeArrow key={i} from={f} to={t} /> : null;
        } )}
        {NODES.map(node => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={nodeRadius + 3} fill={`${node.color}10`} stroke={node.color} strokeWidth="0.3" strokeOpacity="0.2" />
            {node.id === 'CoT' && <circle cx={node.x} cy={node.y} r={nodeRadius + 6} fill="none" stroke={node.color} strokeWidth="0.5" strokeOpacity="0.15">
              <animate attributeName="r" from={`${nodeRadius + 6}`} to={`${nodeRadius + 14}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="strokeOpacity" from="0.15" to="0" dur="2s" repeatCount="indefinite" />
            </circle>}
            <circle cx={node.x} cy={node.y} r={nodeRadius} fill={`${node.color}18`} stroke={node.color} strokeWidth="0.8" strokeOpacity="0.5" />
            <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill={node.color} fontSize="6" fontWeight="700" style={{ pointerEvents: 'none' }}>
              {node.id.length > 6 ? node.id.substring(0, 6) : node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}