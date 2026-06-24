// ─── Keyboard shortcut handler for use-hierarchy-state ────

import { ROLE_ORDER, type EdgeType } from '@/components/hierarchy/types'

export function createKeyboardHandler(
  setSelectedAgentId: (id: string | null) => void,
  setActiveFilter: (f: string | null) => void,
) {
  return (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
    if (e.key === 'Escape') {
      setSelectedAgentId(null)
      return
    }
    if (e.key >= '1' && e.key <= '8') {
      const index = parseInt(e.key) - 1
      if (index < ROLE_ORDER.length) {
        const group = ROLE_ORDER[index]
        setActiveFilter(prev => prev === group ? null : group)
      }
      return
    }
    if (e.key === '9') {
      setActiveFilter(null)
      return
    }
  }
}