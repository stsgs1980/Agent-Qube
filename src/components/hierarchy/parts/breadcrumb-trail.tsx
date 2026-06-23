import React from 'react'
import { motion } from 'framer-motion'
import { Home, ChevronRight, X } from 'lucide-react'
import { ROLE_CONFIG } from './types'

export function BreadcrumbTrail({
  activeFilter,
  onClearFilter,
  zoom,
  onResetView,
}: {
  activeFilter: string | null
  onClearFilter: () => void
  zoom: number
  onResetView: () => void
}) {
  if (!activeFilter && zoom >= 0.95 && zoom <= 1.05) return null
  const cfg = activeFilter ? ROLE_CONFIG[activeFilter] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
      style={{
        background: 'rgba(26, 26, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(51,51,51,0.5)',
      }}
    >
      <button
        onClick={onResetView}
        className="flex items-center gap-1 text-[10px] text-[#B0B0B0] hover:text-white transition-colors"
      >
        <Home className="w-3 h-3" />
        <span>All</span>
      </button>
      {(activeFilter || zoom < 0.95 || zoom > 1.05) && (
        <ChevronRight className="w-3 h-3 text-[#555]" />
      )}
      {zoom < 0.95 || zoom > 1.05 ? (
        <span className="text-[10px] text-[#06B6D4] font-medium">
          {Math.round(zoom * 100)}%
        </span>
      ) : null}
      {activeFilter && cfg && (
        <>
          {(zoom < 0.95 || zoom > 1.05) && (
            <ChevronRight className="w-3 h-3 text-[#555]" />
          )}
          <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: cfg.color }}>
            {React.createElement(cfg.icon, { size: 10, color: cfg.color })}
            {cfg.label}
          </span>
          <button
            onClick={onClearFilter}
            className="ml-1 text-[#555] hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      )}
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

// ─── Sidebar Section Component ────────────────────────────────────────────────

