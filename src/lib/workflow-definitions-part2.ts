/**
 * Workflow Definitions — Part 2
 * Incident Response, Knowledge Update, and Agent Coordination workflows.
 */

import type { WorkflowDefinition } from './workflow-definition-types'

// ─── Workflow 3: Incident Response ────────────────────────────────────
// Monitoring alert → Diagnosis → Decision → Fix → Verify → Learn

export const INCIDENT_PIPELINE: WorkflowDefinition = {
  name: 'Incident Response',
  description: 'Реагирование на инциденты: алерт → диагностика → решение → проверка → обучение',
  status: 'active',
  triggerType: 'event',
  triggerConfig: JSON.stringify({ eventPattern: 'alert:*', severity: 'critical' }),
  tags: 'incident,response,critical,monitoring',
  steps: {
    create: [
      {
        order: 0,
        name: 'Detect Incident',
        roleGroup: 'Monitoring',
        action: 'process',
        inputSchema: JSON.stringify({ type: 'object', properties: { alertType: { type: 'string' }, severity: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { incidentId: { type: 'string' }, classification: { type: 'string' } } }),
        config: JSON.stringify({ promptTemplate: 'Classify and triage incoming alert' }),
        timeout: 60,
      },
      {
        order: 1,
        name: 'Diagnose',
        roleGroup: 'Monitoring',
        action: 'transform',
        inputSchema: JSON.stringify({ type: 'object', properties: { incidentId: { type: 'string' }, classification: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { rootCause: { type: 'string' }, affectedComponents: { type: 'array' } } }),
        config: JSON.stringify({ transformType: 'diagnose' }),
        timeout: 180,
      },
      {
        order: 2,
        name: 'Decide Action',
        roleGroup: 'Strategy',
        action: 'decision',
        inputSchema: JSON.stringify({ type: 'object', properties: { rootCause: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { action: { type: 'string' }, priority: { type: 'string' } } }),
        condition: JSON.stringify({ field: 'severity', operator: 'eq', value: 'critical' }),
        config: JSON.stringify({ condition: 'quality_check' }),
        timeout: 60,
      },
      {
        order: 3,
        name: 'Execute Fix',
        roleGroup: 'Execution',
        action: 'process',
        inputSchema: JSON.stringify({ type: 'object', properties: { action: { type: 'string' }, rootCause: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { fixApplied: { type: 'boolean' }, changes: { type: 'array' } } }),
        config: JSON.stringify({ promptTemplate: 'Apply fix based on diagnosis' }),
        timeout: 300,
      },
      {
        order: 4,
        name: 'Verify Fix',
        roleGroup: 'Control',
        action: 'review',
        config: JSON.stringify({ reviewCriteria: 'fix_verified,no_regression,performance_ok' }),
        timeout: 180,
      },
      {
        order: 5,
        name: 'Learn & Adapt',
        roleGroup: 'Learning',
        action: 'transform',
        config: JSON.stringify({ transformType: 'learn', promptTemplate: 'Extract lessons from incident' }),
        timeout: 120,
      },
    ],
  },
}

// ─── Workflow 4: Knowledge Update Pipeline ────────────────────────────

export const KNOWLEDGE_PIPELINE: WorkflowDefinition = {
  name: 'Knowledge Update',
  description: 'Обновление знаний: поиск → верификация → индексация → распространение',
  status: 'active',
  triggerType: 'webhook',
  triggerConfig: JSON.stringify({ url: '/api/webhooks/knowledge-update' }),
  tags: 'knowledge,memory,rag,update',
  steps: {
    create: [
      {
        order: 0,
        name: 'Retrieve Knowledge',
        roleGroup: 'Memory',
        action: 'process',
        config: JSON.stringify({ promptTemplate: 'Search and retrieve relevant knowledge' }),
        timeout: 300,
      },
      {
        order: 1,
        name: 'Verify Accuracy',
        roleGroup: 'Control',
        action: 'review',
        config: JSON.stringify({ reviewCriteria: 'factual_accuracy,source_reliability,recency' }),
        timeout: 180,
      },
      {
        order: 2,
        name: 'Index & Store',
        roleGroup: 'Memory',
        action: 'transform',
        config: JSON.stringify({ transformType: 'index_embed' }),
        timeout: 120,
      },
      {
        order: 3,
        name: 'Propagate Updates',
        roleGroup: 'Communication',
        action: 'broadcast',
        config: JSON.stringify({ channels: ['agents', 'dashboard', 'knowledge_graph'] }),
        timeout: 60,
      },
    ],
  },
}

// ─── Workflow 5: Agent Coordination (decision-heavy) ──────────────────

export const COORDINATION_PIPELINE: WorkflowDefinition = {
  name: 'Agent Coordination',
  description: 'Координация агентов: запрос → маршрутизация → делегирование → агрегация',
  status: 'draft',
  triggerType: 'agent',
  triggerConfig: JSON.stringify({ sourceAgent: 'any', condition: 'needs_coordination' }),
  tags: 'coordination,delegation,routing',
  steps: {
    create: [
      {
        order: 0,
        name: 'Classify Request',
        roleGroup: 'Strategy',
        action: 'decision',
        config: JSON.stringify({ condition: 'task_type', branches: ['coding', 'analysis', 'quality', 'general'] }),
        timeout: 60,
      },
      {
        order: 1,
        name: 'Route to Team',
        roleGroup: 'Tactics',
        action: 'delegate',
        config: JSON.stringify({ routingRules: { coding: 'Execution', analysis: 'Strategy', quality: 'Control', general: 'Execution' } }),
        timeout: 60,
      },
      {
        order: 2,
        name: 'Execute Task',
        roleGroup: 'Execution',
        action: 'process',
        config: JSON.stringify({ promptTemplate: 'Execute assigned task' }),
        timeout: 600,
      },
      {
        order: 3,
        name: 'Aggregate Results',
        roleGroup: 'Tactics',
        action: 'transform',
        config: JSON.stringify({ transformType: 'aggregate' }),
        timeout: 120,
      },
    ],
  },
}
