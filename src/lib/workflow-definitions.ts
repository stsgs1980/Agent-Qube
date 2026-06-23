/**
 * Workflow Definitions
 * Types and barrel export for seed workflow data objects.
 */

import type { WorkflowDefinition } from './workflow-definition-types'
import { DEVELOPMENT_PIPELINE, ANALYSIS_PIPELINE } from './workflow-definitions-part1'
import { INCIDENT_PIPELINE, KNOWLEDGE_PIPELINE, COORDINATION_PIPELINE } from './workflow-definitions-part2'

export type { WorkflowStepData, WorkflowDefinition } from './workflow-definition-types'
export { DEVELOPMENT_PIPELINE, ANALYSIS_PIPELINE } from './workflow-definitions-part1'
export { INCIDENT_PIPELINE, KNOWLEDGE_PIPELINE, COORDINATION_PIPELINE } from './workflow-definitions-part2'

export const ALL_WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  DEVELOPMENT_PIPELINE,
  ANALYSIS_PIPELINE,
  INCIDENT_PIPELINE,
  KNOWLEDGE_PIPELINE,
  COORDINATION_PIPELINE,
]
