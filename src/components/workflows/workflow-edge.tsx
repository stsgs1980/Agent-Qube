'use client'

export function PipelineArrow({ color = 'rgba(255,255,255,0.1)', animated = false }: { color?: string; animated?: boolean }) {
  return (
    <div className="flex items-center flex-shrink-0 mx-1">
      <svg width="20" height="12" viewBox="0 0 20 12">
        <line x1="0" y1="6" x2="14" y2="6" stroke={color} strokeWidth="1.5" strokeDasharray={animated ? '4 3' : 'none'}>
          {animated && (
            <animate attributeName="stroke-dashoffset" from="0" to="-7" dur="0.5s" repeatCount="indefinite" />
          )}
        </line>
        <polygon points="14,2 20,6 14,10" fill={color} />
      </svg>
    </div>
  )
}

export function FeedbackLoopArrow({
  fromIndex, toIndex, stepWidth, isActive,
}: {
  fromIndex: number
  toIndex: number
  stepWidth: number
  isActive?: boolean
}) {
  const gap = 20
  const fromX = fromIndex * (stepWidth + gap) + stepWidth / 2
  const toX = toIndex * (stepWidth + gap) + stepWidth / 2
  const curveHeight = 50
  const midX = (fromX + toX) / 2

  const pathD = `M ${fromX} -5 C ${fromX} ${-curveHeight}, ${toX} ${-curveHeight}, ${toX} -5`

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: `${fromX + stepWidth / 2 + 10}px`,
        height: `${curveHeight + 20}px`,
        transform: `translateY(-${curveHeight + 10}px)`,
        overflow: 'visible',
      }}
    >
      <defs>
        <marker id={`feedback-arrow-${fromIndex}-${toIndex}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill="#EAB308" />
        </marker>
      </defs>
      <path
        d={pathD} fill="none" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="6 3"
        markerEnd={`url(#feedback-arrow-${fromIndex}-${toIndex})`}
        style={{ animation: isActive ? 'feedbackPulse 1s ease-in-out infinite' : 'none', opacity: isActive ? 1 : 0.7 }}
      />
      <text x={midX} y={-curveHeight + 5} textAnchor="middle" fill="#EAB308" fontSize="8" fontWeight="600" style={{ opacity: 0.9 }}>
        feedback
      </text>
    </svg>
  )
}
