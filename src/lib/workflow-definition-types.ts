/**
 * Workflow Definition Types
 * Shared interfaces for workflow seed data.
 */

export interface WorkflowStepData {
  order: number
  name: string
  roleGroup: string
  action: string
  inputSchema?: string
  outputSchema?: string
  config: string
  timeout: number
  condition?: string
}

export interface WorkflowDefinition {
  name: string
  description: string
  status: string
  triggerType: string
  triggerConfig?: string
  tags: string
  steps: { create: WorkflowStepData[] }
}
