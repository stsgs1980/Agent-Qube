import React from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'

export function SidebarSection({
  icon: Icon,
  title,
  count,
  isOpen,
  onToggle,
  sidebarOpen,
  children,
}: {
  icon: LucideIcon
  title: string
  count: number
  isOpen: boolean
  onToggle: () => void
  sidebarOpen: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mb-1 relative">
      {/* Left accent line */}
      <div
        className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
        style={{
          background: isOpen ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.1)',
          transition: 'background 0.2s ease',
        }}
      />
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-1.5 py-1.5 px-2 rounded-md transition-colors hover:bg-white/5"
      >
        <Icon className="w-3 h-3 flex-shrink-0" style={{ color: isOpen ? '#06B6D4' : '#555' }} />
        {sidebarOpen && (
          <>
            <span className="text-[10px] font-semibold uppercase tracking-wider flex-1 text-left" style={{ color: isOpen ? '#FFFFFF' : '#888' }}>
              {title}
            </span>
            <span
              className="text-[8px] px-1 py-0.5 rounded font-medium"
              style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4', border: '1px solid rgba(6, 182, 212, 0.15)' }}
            >
              {count}
            </span>
            <ChevronRight
              className="w-2.5 h-2.5 text-[#555] transition-transform"
              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </>
        )}
      </button>
      {isOpen && sidebarOpen && (
        <div className="px-2 pb-2 pl-3" style={{ overflow: 'hidden' }}>
          {children}
        </div>
      )}
    </div>
  )
}

