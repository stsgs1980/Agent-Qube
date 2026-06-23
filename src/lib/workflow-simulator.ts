/**
 * Workflow Simulator
 * Simulates step execution for workflow runs with realistic patterns.
 */

export interface SimulationStep {
  action: string
  name: string
  roleGroup: string | null
  config: string
}

export interface SimulationAgent {
  name: string
  role: string
  formula: string
}

/**
 * Simulate step execution based on action type.
 * Returns a structured output object depending on the step's action.
 */
export function simulateStepExecution(
  step: SimulationStep,
  input: any,
  agent: SimulationAgent | undefined,
  context: any
): any {
  const config = typeof step.config === 'string' ? JSON.parse(step.config) : step.config

  switch (step.action) {
    case 'process':
      return {
        ...input,
        _processedBy: agent?.name || 'system',
        _processingResult: 'success',
        _timestamp: new Date().toISOString(),
        [step.name.toLowerCase().replace(/\s+/g, '_')]: {
          status: 'processed',
          agent: agent?.name,
          formula: agent?.formula,
        },
      }

    case 'review': {
      // 80% chance of approval, 20% chance of rejection (simulates feedback loop)
      const approved = Math.random() > 0.2
      return {
        ...input,
        _reviewResult: approved ? 'approved' : 'reject',
        _reviewReason: approved ? 'Meets quality standards' : 'Quality threshold not met',
        _reviewedBy: agent?.name || 'system',
        _feedback: approved ? undefined : 'Needs improvement in accuracy and completeness',
        _timestamp: new Date().toISOString(),
      }
    }

    case 'transform':
      return {
        ...input,
        _transformedBy: agent?.name || 'system',
        _transformType: config.transformType || 'format',
        _transformResult: 'transformed',
        _timestamp: new Date().toISOString(),
      }

    case 'delegate':
      return {
        ...input,
        _delegatedBy: agent?.name || 'system',
        _delegatedTo: config.targetGroup || step.roleGroup,
        _delegationReason: config.reason || 'Specialized processing required',
        _timestamp: new Date().toISOString(),
      }

    case 'broadcast':
      return {
        ...input,
        _broadcastBy: agent?.name || 'system',
        _broadcastTargets: context._history?.length || 0,
        _broadcastResult: 'delivered',
        _timestamp: new Date().toISOString(),
      }

    case 'decision': {
      const condition = config.condition || 'default'
      const branch = condition === 'quality_check'
        ? (Math.random() > 0.3 ? 'pass' : 'fail')
        : 'default'
      return {
        ...input,
        _decisionBy: agent?.name || 'system',
        _decisionBranch: branch,
        _decisionReason: `Condition "${condition}" evaluated to "${branch}"`,
        _timestamp: new Date().toISOString(),
      }
    }

    default:
      return {
        ...input,
        _processedBy: agent?.name || 'system',
        _timestamp: new Date().toISOString(),
      }
  }
}
