const STATUS_COLORS: Record<string, string> = {
  active: '#22D3EE', draft: '#64748B', paused: '#EAB308', completed: '#06B6D4', error: '#F43F5E',
}

export { STATUS_COLORS }

export function computeWorkflowStats(workflows: any[]) {
  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter((w: any) => w.status === 'active').length
  const totalExecutions = workflows.reduce((sum: number, w: any) => sum + (w.stats?.totalExecutions || 0), 0)
  const workflowsWithExecutions = workflows.filter((w: any) => (w.stats?.totalExecutions || 0) > 0)
  const avgSuccessRate = workflowsWithExecutions.length > 0
    ? Math.round(workflowsWithExecutions.reduce((sum: number, w: any) => sum + (w.stats?.successRate || 0), 0) / workflowsWithExecutions.length)
    : 0
  return { totalWorkflows, activeWorkflows, totalExecutions, avgSuccessRate }
}