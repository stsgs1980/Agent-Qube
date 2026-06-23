'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function SidebarSection({
  icon, title, count, defaultOpen = true, children,
}: {
  icon: React.ReactNode
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-1">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/[0.02] transition-colors duration-150"
        style={{ borderLeft: '2px solid transparent' }}>
        {icon}
        <span className="text-[10px] font-semibold text-white flex-1">{title}</span>
        {count !== undefined && (
          <span className="text-[8px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}>{count}</span>
        )}
        <ChevronDown size={10} style={{ color: '#475569' }}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-3 pb-2">{children}</div>}
    </div>
  )
}
