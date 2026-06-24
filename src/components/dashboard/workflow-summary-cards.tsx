import { Workflow, ChevronRight } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  active: '#22D3EE', draft: '#64748B', paused: '#EAB308', completed: '#06B6D4', error: '#F43F5E',
}

export function WorkflowSummaryCards({ cards }: { cards: Array<{ label: string; value: string | number; color: string }> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
      {cards.map((card) => (
        <SummaryCard key={card.label} card={card} />
      ))}
    </div>
  )
}

function SummaryCard({ card }: { card: { label: string; value: string | number; color: string } }) {
  return (
    <div style={{ position: 'relative', background: 'rgba(13, 13, 13, 0.9)',
      border: '1px solid rgba(51, 51, 51, 0.35)', borderRadius: 8, padding: '12px 14px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: card.color, opacity: 0.6 }} />
      <div style={{ fontSize: 9, color: '#64748B', marginBottom: 4, marginLeft: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: card.color, marginLeft: 8, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{card.value}</div>
    </div>
  )
}

export function WorkflowCTA({ onOpenWorkflows }: { onOpenWorkflows: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
      <button onClick={onOpenWorkflows}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8,
          fontSize: 11, fontWeight: 600, background: 'rgba(6,182,212,0.1)',
          border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.15)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)' }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)' }}>
        <Workflow style={{ width: 14, height: 14 }} />View Workflows<ChevronRight style={{ width: 12, height: 12 }} />
      </button>
    </div>
  )
}