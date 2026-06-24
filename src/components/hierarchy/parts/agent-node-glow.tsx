'use client'
import { motion } from 'framer-motion'

type RoleConfig = { color: string; colorRgb: string }

export function AgentNodeGlow({ isHighlighted, isSelected, isActive, config }: {
  isHighlighted: boolean
  isSelected: boolean
  isActive: boolean
  config: RoleConfig
}) {
  return (
    <>
      {isHighlighted && (
        <>
          <motion.circle r={50} fill="none" stroke={config.color} strokeWidth={0.2} strokeOpacity={0.06} filter="url(#searchGlow)"
            animate={{ r: [50, 54, 50], strokeOpacity: [0.06, 0.02, 0.06] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle r={44} fill="none" stroke={config.color} strokeWidth={0.3} strokeOpacity={0.2}
            animate={{ r: [44, 48, 44], strokeOpacity: [0.2, 0.08, 0.2] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle r={38} fill={`rgba(${config.colorRgb}, 0.04)`}
            animate={{ r: [38, 40, 38] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
        </>
      )}
      {isSelected && (
        <>
          <circle r={28} fill="none" stroke={config.color} strokeWidth={0.4} strokeOpacity={0.5}>
            <animate attributeName="r" from="28" to="55" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="strokeOpacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="strokeWidth" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <motion.circle r={40} fill="none" stroke={config.color} strokeWidth={0.25} strokeOpacity={0.3}
            animate={{ r: [40, 43, 40], strokeOpacity: [0.3, 0.15, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
        </>
      )}
      {isActive && (
        <motion.circle r={38} fill="none" stroke={config.color} strokeWidth={0.1} strokeOpacity={0.12} strokeDasharray="3 10"
          animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '0 0' }} />
      )}
      <motion.circle r={35} fill="none" stroke={config.color} strokeWidth={0.12} strokeOpacity={0.06}
        animate={{ r: [35, 38, 35], strokeOpacity: [0.07, 0.12, 0.07] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
    </>
  )
}