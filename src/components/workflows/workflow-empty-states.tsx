'use client'

import { Workflow, Loader2, Beaker } from 'lucide-react'

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-lg p-4 animate-pulse"
          style={{ background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(51,51,51,0.3)' }}>
          <div className="h-3 w-2/3 rounded mb-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="h-2 w-full rounded mb-1" style={{ background: 'rgba(255,255,255,0.03)' }} />
          <div className="h-2 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ seeding, onSeed }: { seeding: boolean; onSeed: () => void }) {
  return (
    <div className="text-center py-8">
      <Workflow size={24} style={{ color: '#475569' }} className="mx-auto mb-2" />
      <p className="text-[11px]" style={{ color: '#475569' }}>No workflows found</p>
      <p className="text-[9px] mt-1" style={{ color: '#3F3F46' }}>Create workflows or seed sample data</p>
    </div>
  )
}

export function EmptyStateFull({ workflows, seeding, onSeed }: { workflows: any[]; seeding: boolean; onSeed: () => void }) {
  return (
    <div className="text-center py-12">
      <Workflow size={28} style={{ color: '#475569' }} className="mx-auto mb-3" />
      <p className="text-[11px]" style={{ color: '#475569' }}>{workflows.length === 0 ? 'No workflows found' : 'No workflows match your filters'}</p>
      <p className="text-[9px] mt-1" style={{ color: '#3F3F46' }}>{workflows.length === 0 ? 'Create workflows or seed sample data' : 'Try adjusting your filters'}</p>
      {workflows.length === 0 && (
        <button onClick={onSeed} disabled={seeding}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-md text-[10px] font-bold mx-auto transition-all duration-200 hover:scale-105 disabled:opacity-50"
          style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
          {seeding ? <Loader2 size={10} className="animate-spin" /> : <Beaker size={10} />}{seeding ? 'Seeding...' : 'Seed Demo Workflows'}
        </button>
      )}
    </div>
  )
}
