'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Eye, EyeOff } from 'lucide-react'
import type { EdgeType } from './types'
import { EDGE_CONFIG } from './types'

export function ConnectionFilterPanel({
  hiddenEdgeTypes,
  onToggleEdgeType,
}: {
  hiddenEdgeTypes: Set<EdgeType>
  onToggleEdgeType: (type: EdgeType) => void
}) {
  const [open, setOpen] = useState(false)
  const visibleCount = (Object.keys(EDGE_CONFIG) as EdgeType[]).length - hiddenEdgeTypes.size

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
        style={{
          background: visibleCount < 6 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(45, 45, 45, 0.5)',
          color: visibleCount < 6 ? '#06B6D4' : '#B0B0B0',
          border: `1px solid ${visibleCount < 6 ? 'rgba(6,182,212,0.3)' : 'rgba(51,51,51,0.5)'}`,
        }}
      >
        <Filter className="w-3 h-3" />
        <span className="hidden md:inline">Edges</span>
        <span className="text-[9px] opacity-60">{visibleCount}/{(Object.keys(EDGE_CONFIG) as EdgeType[]).length}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 rounded-xl overflow-hidden z-50"
            style={{
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(51,51,51,0.5)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              width: 170,
            }}
          >
            <div className="px-2.5 py-1.5" style={{ borderBottom: '1px solid rgba(51,51,51,0.5)' }}>
              <span className="text-[9px] text-[#555] uppercase tracking-wider font-semibold">Connection Types</span>
            </div>
            <div className="py-1">
              {(Object.entries(EDGE_CONFIG) as [EdgeType, typeof EDGE_CONFIG[EdgeType]][]).map(([type, cfg]) => {
                const isHidden = hiddenEdgeTypes.has(type)
                return (
                  <button
                    key={type}
                    onClick={() => onToggleEdgeType(type)}
                    className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 text-xs transition-colors hover:bg-white/5"
                    style={{ color: isHidden ? '#555' : cfg.color }}
                  >
                    {isHidden ? (
                      <EyeOff className="w-3 h-3" style={{ color: '#555' }} />
                    ) : (
                      <Eye className="w-3 h-3" style={{ color: cfg.color }} />
                    )}
                    {React.createElement(cfg.icon, { size: 10, color: isHidden ? '#555' : cfg.color })}
                    <span className={isHidden ? 'line-through' : ''}>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Breadcrumb Trail ────────────────────────────────────────────────────────

