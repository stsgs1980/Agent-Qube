'use client'

import React from 'react'
import { Hexagon, PanelRightClose } from 'lucide-react'

export function DetailPanelEmpty({ onToggle }: { onToggle: () => void }) {
  return (
    <div
      style={{
        flexShrink: 0,
        background: '#0A0A0A',
        borderLeft: '1px solid rgba(51,51,51,0.25)',
        display: 'flex', flexDirection: 'column', position: 'relative',
      }}
      className="w-0 lg:w-[280px] overflow-hidden"
    >
      <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onToggle}
          title="Hide detail panel"
          style={{
            width: 24, height: 24, borderRadius: 5,
            border: '1px solid rgba(51,51,51,0.4)',
            background: 'rgba(255,255,255,0.03)',
            color: '#555', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#06B6D4'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(51,51,51,0.4)' }}
        >
          <PanelRightClose size={11} />
        </button>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#555', textAlign: 'center', padding: 20,
      }}>
        <Hexagon size={28} color="#333" strokeWidth={1} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 11, lineHeight: 1.5 }}>Select an agent to view details</div>
      </div>
    </div>
  )
}
