'use client'

import { useState, useEffect, useCallback } from 'react'
import { Brain, Search, RefreshCw, Bell, X, Workflow, Menu } from 'lucide-react'
import { toast } from 'sonner'

function WsBadge({ wsConnected }: { wsConnected: boolean }) {
  const color = wsConnected ? '#22C55E' : '#EF4444'
  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: wsConnected ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: wsConnected ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)' }}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: color }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: color }} />
      </span>
      <span className="text-[8px] font-bold tracking-wider" style={{ color: color }}>{wsConnected ? 'LIVE' : 'OFFLINE'}</span>
    </div>
  )
}

const ALERTS = [
  { text: 'Memory threshold warning', time: '25s ago', color: '#EAB308' },
  { text: 'Escalation protocol triggered', time: '1m ago', color: '#06B6D4' },
  { text: 'Agent latency spike traced', time: '2m ago', color: '#0891B2' },
]

function NotificationsDropdown({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null
  return (
    <div className="absolute right-0 top-9 w-56 rounded-lg p-2.5 z-50" style={{ background: 'rgba(20,20,20,0.98)', border: '1px solid rgba(51,51,51,0.5)', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-[10px] font-semibold uppercase tracking-wider">Alerts</span>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-3 h-3" /></button>
      </div>
      {ALERTS.map((alert, i) => (
        <div key={i} className="flex items-start gap-2 p-1.5 rounded-md mb-1" style={{ background: 'rgba(13,13,13,0.6)' }}>
          <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: alert.color }} />
          <div><p className="text-[9px] text-[#B0B0B0]">{alert.text}</p><p className="text-[7px] text-slate-600">{alert.time}</p></div>
        </div>
      ))}
    </div>
  )
}

function HeaderActions({ refreshing, handleRefresh, showNotifications, setShowNotifications, onOpenWorkflows, onOpenHierarchy, lastUpdated }: {
  refreshing: boolean; handleRefresh: () => void; showNotifications: boolean; setShowNotifications: (v: boolean) => void;
  onOpenWorkflows?: () => void; onOpenHierarchy: () => void; lastUpdated: string
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[9px] text-[#64748B] font-mono hidden sm:inline" suppressHydrationWarning>{lastUpdated || '--:--:--'}</span>
      <button onClick={handleRefresh} disabled={refreshing} className="px-2.5 py-1 rounded-md text-[11px] transition-all duration-200 hover:scale-105 disabled:opacity-50" style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>
        <RefreshCw className={`w-3 h-3 inline mr-1 ${refreshing ? 'animate-spin' : ''}`} />Refresh
      </button>
      <div className="relative">
        <button onClick={() => setShowNotifications(!showNotifications)} className="px-2.5 py-1 rounded-md text-[11px] transition-all duration-200 hover:scale-105 relative" style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>
          <Bell className="w-3 h-3 inline mr-1" />Alerts
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: '#EAB308', color: '#000' }}>3</span>
        </button>
        <NotificationsDropdown show={showNotifications} onClose={() => setShowNotifications(false)} />
      </div>
      {onOpenWorkflows && (
        <button onClick={onOpenWorkflows} className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 hover:scale-105" style={{ background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.3)', color: '#0891B2' }}>
          <Workflow className="w-3 h-3 inline mr-1" />Workflows
        </button>
      )}
      <button onClick={onOpenHierarchy} className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 hover:scale-105" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>Hierarchy</button>
    </div>
  )
}

export function DashboardHeader({ onOpenHierarchy, onOpenWorkflows, onToggleSidebar, onRefresh, wsConnected }: {
  onOpenHierarchy: () => void; onOpenWorkflows?: () => void; onToggleSidebar: () => void; onRefresh?: () => void; wsConnected?: boolean
}) {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const formatTime = useCallback((date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), [])

  useEffect(() => {
    const updateTime = () => setLastUpdated(formatTime(new Date()))
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [formatTime])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    onRefresh?.()
    setTimeout(() => {
      setLastUpdated(formatTime(new Date()));
      setRefreshing(false);
      toast.success('Dashboard data refreshed');
    } , 1200)
  }, [formatTime, onRefresh])

  return (
    <header data-src="src/components/dashboard/dashboard-header.tsx" className="px-4 sm:px-6 py-2.5 border-b relative flex-shrink-0" style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(51,51,51,0.5)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={onToggleSidebar} className="p-1.5 rounded-md transition-colors hover:bg-white/5 lg:hidden" style={{ color: '#64748B' }}><Menu className="w-4 h-4" /></button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}><Brain className="w-4 h-4" style={{ color: '#06B6D4' }} /></div>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-bold text-sm tracking-wide">Agent Qube</h1>
            <WsBadge wsConnected={!!wsConnected} />
            <span className="text-slate-600 text-[10px] hidden md:inline">Multi-Agent System</span>
          </div>
        </div>
        <div className="relative flex-1 max-w-[280px] hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: '#64748B' }} />
          <div className="w-full pl-7 pr-3 py-1.5 rounded-md text-[11px]" style={{ background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>Search agents, formulas, tasks...</div>
        </div>
        <HeaderActions refreshing={refreshing} handleRefresh={handleRefresh} showNotifications={showNotifications} setShowNotifications={setShowNotifications} onOpenWorkflows={onOpenWorkflows} onOpenHierarchy={onOpenHierarchy} lastUpdated={lastUpdated} />
      </div>
    </header>
  )
}