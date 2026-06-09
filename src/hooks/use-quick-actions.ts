'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/client-fetch'

// ─── Hook: useQuickActions ─────────────────────────────────────────────────
// Provides action callbacks for database seeding and hierarchy export/refresh.

export function useQuickActions() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const seedDatabase = useCallback(async () => {
    setIsSeeding(true)
    try {
      const res = await fetchWithRetry('/api/seed', { method: 'POST' })
      if (res.ok) {
        toast.success('Database reseeded successfully')
      } else {
        toast.error('Failed to reseed database')
      }
    } catch {
      toast.error('Failed to reseed database')
    } finally {
      setIsSeeding(false)
    }
  }, [])

  const refreshHierarchy = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetchWithRetry('/api/hierarchy')
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'p-mas-hierarchy.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Config exported successfully')
    } catch {
      toast.error('Failed to export config')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  return { seedDatabase, refreshHierarchy, isSeeding, isRefreshing }
}
