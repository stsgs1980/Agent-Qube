'use client'
import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { EdgeType } from './types'
import { EDGE_CONFIG, STATUS_COLORS } from './types'

export function LegendPanel() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div
      className="rounded-xl relative overflow-hidden"
      style={{
        background: 'rgba(26, 26, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(51,51,51,0.5)',
        width: 180,
      }}
    >
      {/* Gradient border overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(26,26,26,0.92), rgba(26,26,26,0.92)), linear-gradient(135deg, rgba(6,182,212,0.25), transparent, rgba(6,182,212,0.25))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '1px solid transparent',
          borderRadius: '12px',
        }}
      />
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-2.5 pb-0"
      >
        <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold">Legend</h4>
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-[#555]" />
        ) : (
          <ChevronDown className="w-3 h-3 text-[#555]" />
        )}
      </button>

      {!collapsed && (
        <div className="px-2.5 pb-2.5">
          {/* Edge types with icons */}
          <div className="space-y-1 mb-2 mt-1.5">
            {(Object.entries(EDGE_CONFIG) as [EdgeType, typeof EDGE_CONFIG[EdgeType]][]).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1.5">
                {React.createElement(cfg.icon, { size: 9, color: cfg.color })}
                <div className="w-5 h-0 flex-shrink-0" style={{ borderTop: `1.5px ${type === 'command' ? 'solid' : type === 'sync' ? 'dotted' : 'dashed'} ${cfg.color}`, opacity: 0.7 }} />
                <span className="text-[8px] text-[#B0B0B0]">{cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full my-1.5" style={{ background: 'rgba(51,51,51,0.5)' }} />

          {/* Status colors */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-[8px] text-[#B0B0B0] capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Stats Dashboard ─────────────────────────────────────────────────────────

