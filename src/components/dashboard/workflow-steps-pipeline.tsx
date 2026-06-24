const STEP_COLOR_MAP: Record<string, string> = {
  process: '#06B6D4', validate: '#22D3EE', delegate: '#0891B2', aggregate: '#0E7490',
  analyze: '#67E8F9', report: '#155E75', alert: '#EAB308', resolve: '#06B6D4',
  verify: '#22D3EE', learn: '#164E63', search: '#0891B2', index: '#0E7490',
  distribute: '#155E75', request: '#67E8F9', route: '#06B6D4', code: '#22D3EE',
  review: '#0891B2', test: '#0E7490', deploy: '#06B6D4', collect: '#67E8F9',
  evaluate: '#0891B2',
}

export function WorkflowStepsPipeline({ steps }: { steps: any[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
      {steps.map((step: any, idx: number) => {
        const actionKey = step.action || 'process'
        const dotColor = STEP_COLOR_MAP[actionKey] || '#06B6D4'
        const isLast = idx === steps.length - 1
        return (
          <div key={step.id || idx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48 }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${dotColor}18`, border: `1.5px solid ${dotColor}`, boxShadow: `0 0 6px ${dotColor}25` }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor }} />
              </span>
              <span style={{ fontSize: 7, color: '#64748B', marginTop: 4, textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 48 }}
                title={step.name}>
                {step.name.length > 8 ? step.name.substring(0, 7) + '…' : step.name}
              </span>
            </div>
            {!isLast && (
              <div style={{ width: 16, height: 1,
                background: `linear-gradient(90deg, ${dotColor}, ${STEP_COLOR_MAP[steps[idx + 1]?.action || 'process'] || '#06B6D4'})`,
                opacity: 0.35, flexShrink: 0 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}