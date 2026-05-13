'use client'

import { useState, useCallback } from 'react'
import { Database, Download, ArrowUp, Activity } from 'lucide-react'
import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/client-fetch'

function useQuickActions() {
  const [reseeding, setReseeding] = useState(false)

  const handleReseed = useCallback(async () => {
    setReseeding(true)
    try {
      const res = await fetchWithRetry('/api/seed', { method: 'POST' })
      if (res.ok) { toast.success('Database reseeded successfully') } else { toast.error('Failed to reseed database') }
    } catch { toast.error('Failed to reseed database') } finally { setReseeding(false) }
  }, [])

  const handleExportConfig = useCallback(async () => {
    try {
      const res = await fetchWithRetry('/api/hierarchy')
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'p-mas-hierarchy.json'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url); toast.success('Config exported successfully')
    } catch { toast.error('Failed to export config') }
  }, [])

  return { reseeding, handleReseed, handleExportConfig }
}

export function QuickActionsPanel() {
  const { reseeding, handleReseed, handleExportConfig } = useQuickActions()

  const actions = [
    { label: 'Reseed Data', icon: Database, onClick: handleReseed, loading: reseeding },
    { label: 'Export Config', icon: Download, onClick: handleExportConfig },
    { label: 'Reset View', icon: ArrowUp, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Toggle Theme', icon: Activity, onClick: () => toast.info('Theme toggle coming soon') },
  ]

  return (
    <div className="rounded-xl p-4 sm:p-6" style={{ background: 'rgba(26,26,26,0.92)', border: '1px solid rgba(51,51,51,0.5)' }}>
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: '#06B6D4' }} />
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const ActionIcon = action.icon
          return (
            <button key={action.label} onClick={action.onClick} disabled={action.loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'rgba(45, 45, 45, 0.5)', border: '1px solid rgba(51, 51, 51, 0.5)', color: '#06B6D4' }}
              onMouseEnter={(e) => { if (!action.loading) { e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.15)'; e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(51, 51, 51, 0.5)' }}
            >
              <ActionIcon size={14} />
              <span>{action.loading ? 'Seeding...' : action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
