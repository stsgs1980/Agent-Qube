import { STATUS_COLORS } from './workflow-stats-utils'
import { WorkflowStepsPipeline } from './workflow-steps-pipeline'

function WorkflowItem({ wf }: { wf: any }) {
  const wfStatusColor = STATUS_COLORS[wf.status] || '#64748B'
  return (
    <div style={{ background: 'rgba(13, 13, 13, 0.7)', border: '1px solid rgba(51, 51, 51, 0.35)',
      borderRadius: 8, padding: 14, transition: 'border-color 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${wfStatusColor}44`; e.currentTarget.style.boxShadow = `0 0 16px ${wfStatusColor}10` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51,51,51,0.35)'; e.currentTarget.style.boxShadow = 'none' }}>
      <WorkflowTopRow wf={wf} wfStatusColor={wfStatusColor} />
      <WorkflowStepsPipeline steps={wf.steps || []} />
      {wf.tags && wf.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
          {wf.tags.map((tag: string) => (
            <span key={tag} style={{ fontSize: 7, padding: '2px 6px', borderRadius: 3,
              background: 'rgba(6,182,212,0.06)', color: '#64748B', border: '1px solid rgba(51,51,51,0.3)' }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function WorkflowTopRow({ wf, wfStatusColor }: { wf: any; wfStatusColor: string }) {
  const successRate = wf.stats?.successRate || 0
  const hasExecs = (wf.stats?.totalExecutions || 0) > 0
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.name}</span>
          <span style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
            padding: '2px 6px', borderRadius: 3, background: `${wfStatusColor}15`, color: wfStatusColor,
            border: `1px solid ${wfStatusColor}25` }}>{wf.status}</span>
        </div>
        <p style={{ fontSize: 9, color: '#64748B', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.description}</p>
      </div>
      <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
        <StatCell label="Executions" value={String(wf.stats?.totalExecutions || 0)} color="#06B6D4" />
        <StatCell label="Success" value={hasExecs ? `${successRate}%` : '—'}
          color={successRate >= 80 ? '#22D3EE' : hasExecs ? '#EAB308' : '#64748B'} />
      </div>
    </div>
  )
}

function StatCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 8, color: '#64748B' }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}

export function WorkflowList({ workflows }: { workflows: any[] }) {
  if (workflows.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <p style={{ fontSize: 11, color: '#64748B' }}>No workflows found</p>
        <p style={{ fontSize: 9, color: '#4B5563', marginTop: 4 }}>Create workflows from the Workflow Pipeline view</p>
      </div>
    )
  }
  return <>{workflows.map((wf: any) => <WorkflowItem key={wf.id} wf={wf} />)}</>
}