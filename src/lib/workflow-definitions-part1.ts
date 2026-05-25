/**
 * Workflow Definitions — Part 1
 * Development Pipeline and Analysis & Reporting workflows.
 */

import type { WorkflowDefinition } from './workflow-definition-types'

// ─── Workflow 1: Full Development Pipeline ────────────────────────────
// Request → Analyst → Coordinator → Coder → Tester → Inspector
// With feedback loop: if Tester finds bugs → back to Coder

export const DEVELOPMENT_PIPELINE: WorkflowDefinition = {
  name: 'Development Pipeline',
  description: 'Полный цикл разработки: от запроса до готового кода с проверкой качества',
  status: 'active',
  triggerType: 'manual',
  tags: 'development,coding,core',
  steps: {
    create: [
      {
        order: 0,
        name: 'Receive Request',
        roleGroup: 'Strategy',
        action: 'process',
        inputSchema: JSON.stringify({ type: 'object', properties: { taskDescription: { type: 'string' }, priority: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { taskPlan: { type: 'string' }, requirements: { type: 'array' } } }),
        config: JSON.stringify({ promptTemplate: 'Analyze request and create execution plan' }),
        timeout: 120,
      },
      {
        order: 1,
        name: 'Plan & Decompose',
        roleGroup: 'Tactics',
        action: 'transform',
        inputSchema: JSON.stringify({ type: 'object', properties: { taskPlan: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { subtasks: { type: 'array' }, assignments: { type: 'object' } } }),
        config: JSON.stringify({ transformType: 'decompose', promptTemplate: 'Break down plan into subtasks and assign agents' }),
        timeout: 180,
      },
      {
        order: 2,
        name: 'Implement Code',
        roleGroup: 'Execution',
        action: 'process',
        inputSchema: JSON.stringify({ type: 'object', properties: { subtasks: { type: 'array' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { code: { type: 'string' }, files: { type: 'array' } } }),
        config: JSON.stringify({ promptTemplate: 'Write code according to specifications' }),
        timeout: 600,
      },
      {
        order: 3,
        name: 'Test & Debug',
        roleGroup: 'Execution',
        action: 'review',
        inputSchema: JSON.stringify({ type: 'object', properties: { code: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { testResults: { type: 'object' }, bugs: { type: 'array' } } }),
        config: JSON.stringify({ reviewCriteria: 'correctness,edge_cases,performance' }),
        timeout: 300,
      },
      {
        order: 4,
        name: 'Quality Review',
        roleGroup: 'Control',
        action: 'review',
        inputSchema: JSON.stringify({ type: 'object', properties: { code: { type: 'string' }, testResults: { type: 'object' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { approved: { type: 'boolean' }, reviewNotes: { type: 'string' } } }),
        config: JSON.stringify({ reviewCriteria: 'architecture,security,maintainability', strictness: 'high' }),
        timeout: 180,
      },
      {
        order: 5,
        name: 'Store & Index',
        roleGroup: 'Memory',
        action: 'transform',
        inputSchema: JSON.stringify({ type: 'object', properties: { code: { type: 'string' }, reviewNotes: { type: 'string' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { archived: { type: 'boolean' }, indexId: { type: 'string' } } }),
        config: JSON.stringify({ transformType: 'archive_index' }),
        timeout: 120,
      },
      {
        order: 6,
        name: 'Notify Completion',
        roleGroup: 'Communication',
        action: 'broadcast',
        inputSchema: JSON.stringify({ type: 'object', properties: { archived: { type: 'boolean' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { notified: { type: 'boolean' } } }),
        config: JSON.stringify({ channels: ['team', 'dashboard'] }),
        timeout: 60,
      },
    ],
  },
}

// ─── Workflow 2: Analysis & Reporting Pipeline ────────────────────────

export const ANALYSIS_PIPELINE: WorkflowDefinition = {
  name: 'Analysis & Reporting',
  description: 'Аналитический конвейер: сбор данных → анализ → оценка → отчёт',
  status: 'active',
  triggerType: 'schedule',
  triggerConfig: JSON.stringify({ cron: '0 9 * * *', timezone: 'Europe/Moscow' }),
  tags: 'analysis,reporting,scheduled',
  steps: {
    create: [
      {
        order: 0,
        name: 'Gather Data',
        roleGroup: 'Memory',
        action: 'process',
        inputSchema: JSON.stringify({ type: 'object', properties: { query: { type: 'string' }, sources: { type: 'array' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { rawData: { type: 'array' }, sourceCount: { type: 'number' } } }),
        config: JSON.stringify({ promptTemplate: 'Retrieve relevant data from knowledge base' }),
        timeout: 300,
      },
      {
        order: 1,
        name: 'Analyze',
        roleGroup: 'Strategy',
        action: 'transform',
        inputSchema: JSON.stringify({ type: 'object', properties: { rawData: { type: 'array' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { analysis: { type: 'object' }, insights: { type: 'array' } } }),
        config: JSON.stringify({ transformType: 'analyze', promptTemplate: 'Perform deep analysis on gathered data' }),
        timeout: 600,
      },
      {
        order: 2,
        name: 'Evaluate Quality',
        roleGroup: 'Control',
        action: 'review',
        inputSchema: JSON.stringify({ type: 'object', properties: { analysis: { type: 'object' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { qualityScore: { type: 'number' }, issues: { type: 'array' } } }),
        config: JSON.stringify({ reviewCriteria: 'accuracy,completeness,relevance' }),
        timeout: 180,
      },
      {
        order: 3,
        name: 'Generate Report',
        roleGroup: 'Execution',
        action: 'transform',
        inputSchema: JSON.stringify({ type: 'object', properties: { analysis: { type: 'object' }, qualityScore: { type: 'number' } } }),
        outputSchema: JSON.stringify({ type: 'object', properties: { report: { type: 'string' }, format: { type: 'string' } } }),
        config: JSON.stringify({ transformType: 'format_report' }),
        timeout: 300,
      },
      {
        order: 4,
        name: 'Distribute Report',
        roleGroup: 'Communication',
        action: 'broadcast',
        config: JSON.stringify({ channels: ['stakeholders', 'dashboard', 'archive'] }),
        timeout: 60,
      },
    ],
  },
}
