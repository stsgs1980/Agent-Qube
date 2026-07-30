import { z } from 'zod'

// ─── Agent Validation Schemas ─────────────────────────────────────────────────

const VALID_ROLE_GROUPS = ['Strategy', 'Tactics', 'Control', 'Execution', 'Memory', 'Monitoring', 'Communication', 'Learning']
const VALID_FORMULAS = ['ToT', 'CoVe', 'ReWOO', 'Reflexion', 'ReAct', 'MoA']
const VALID_STATUSES = ['active', 'idle', 'error', 'offline', 'paused', 'standby']

export const AgentCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  roleGroup: z.enum(VALID_ROLE_GROUPS as [string, ...string[]]),
  formula: z.enum(VALID_FORMULAS as [string, ...string[]]),
  status: z.enum(VALID_STATUSES as [string, ...string[]]).optional().default('active'),
  parentId: z.string().optional().nullable(),
  twinId: z.string().optional().nullable(),
  skills: z.string().max(1000).optional().default(''),
  description: z.string().max(5000).optional().default(''),
  avatar: z.string().max(500).optional().default(''),
}).refine(
  (data) => data.parentId !== data.twinId || (!data.parentId && !data.twinId),
  { message: 'parentId and twinId cannot be the same' }
)

export const AgentUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.string().min(1).max(100).optional(),
  roleGroup: z.enum(VALID_ROLE_GROUPS as [string, ...string[]]).optional(),
  status: z.enum(VALID_STATUSES as [string, ...string[]]).optional(),
  formula: z.enum(VALID_FORMULAS as [string, ...string[]]).optional(),
  skills: z.string().max(1000).optional(),
  description: z.string().max(5000).optional(),
  avatar: z.string().max(500).optional(),
  parentId: z.string().optional().nullable(),
  twinId: z.string().optional().nullable(),
})

// ─── Task Validation Schemas ──────────────────────────────────────────────────

const VALID_TASK_STATUSES = ['pending', 'running', 'completed', 'failed']
const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical']

export const TaskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().default(''),
  status: z.enum(VALID_TASK_STATUSES as [string, ...string[]]).optional().default('pending'),
  priority: z.enum(VALID_PRIORITIES as [string, ...string[]]).optional().default('medium'),
  agentId: z.string().optional().nullable(),
})

export const TaskUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(VALID_TASK_STATUSES as [string, ...string[]]).optional(),
  priority: z.enum(VALID_PRIORITIES as [string, ...string[]]).optional(),
  agentId: z.string().optional().nullable(),
})

// ─── Workflow Validation Schemas ──────────────────────────────────────────────

const VALID_WORKFLOW_STATUSES = ['draft', 'active', 'paused', 'archived']
const VALID_TRIGGER_TYPES = ['manual', 'event', 'schedule', 'webhook', 'agent']
const VALID_ACTIONS = ['process', 'review', 'transform', 'delegate', 'broadcast', 'decision']

export const WorkflowCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(5000).optional().default(''),
  triggerType: z.enum(VALID_TRIGGER_TYPES as [string, ...string[]]).optional().default('manual'),
  triggerConfig: z.record(z.string(), z.unknown()).optional().default({}),
  tags: z.array(z.string()).optional().default([]),
  steps: z.array(z.object({
    order: z.number().int().min(0).optional(),
    name: z.string().min(1).max(200).optional(),
    agentId: z.string().optional().nullable(),
    roleGroup: z.string().optional().nullable(),
    action: z.enum(VALID_ACTIONS as [string, ...string[]]).optional().default('process'),
    inputSchema: z.record(z.string(), z.unknown()).optional().default({}),
    outputSchema: z.record(z.string(), z.unknown()).optional().default({}),
    condition: z.record(z.string(), z.unknown()).optional().default({}),
    fallbackStepId: z.string().optional().nullable(),
    timeout: z.number().int().min(1).max(3600).optional().default(300),
    retryPolicy: z.record(z.string(), z.unknown()).optional().default({}),
    config: z.record(z.string(), z.unknown()).optional().default({}),
  })).optional(),
})

export const WorkflowUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(VALID_WORKFLOW_STATUSES as [string, ...string[]]).optional(),
  triggerType: z.enum(VALID_TRIGGER_TYPES as [string, ...string[]]).optional(),
  triggerConfig: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  steps: z.array(z.object({
    order: z.number().int().min(0).optional(),
    name: z.string().min(1).max(200).optional(),
    agentId: z.string().optional().nullable(),
    roleGroup: z.string().optional().nullable(),
    action: z.enum(VALID_ACTIONS as [string, ...string[]]).optional(),
    inputSchema: z.record(z.string(), z.unknown()).optional(),
    outputSchema: z.record(z.string(), z.unknown()).optional(),
    condition: z.record(z.string(), z.unknown()).optional(),
    fallbackStepId: z.string().optional().nullable(),
    timeout: z.number().int().min(1).max(3600).optional(),
    retryPolicy: z.record(z.string(), z.unknown()).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
})

// ─── Prompt History Validation Schemas ────────────────────────────────────────

export const PromptHistoryCreateSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(10000),
  intent: z.string().max(500).optional().default(''),
  confidence: z.number().min(0).max(100).optional().default(0),
  formula: z.string().max(100).optional().default(''),
  avgScore: z.number().min(0).max(100).optional().default(0),
  verdict: z.string().max(500).optional().default(''),
  stepCount: z.number().int().min(0).optional().default(0),
  executionId: z.string().optional().nullable(),
})

// ─── Validation Helper ────────────────────────────────────────────────────────

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  error: string
} {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const errorMessage = result.error.issues.map(issue => issue.message).join(', ')
  return { success: false, error: errorMessage }
}
