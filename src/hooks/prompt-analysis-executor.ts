// ─── Workflow execution for Prompt Studio ──────────────────────
// Uses /api/workflows/execute-llm for REAL LLM-powered execution

import type { ExecutionData } from './prompt-analysis-types'
import { savePromptHistory } from './prompt-history-saver'

// ─── Safe JSON parse — handles HTML error pages gracefully ────

async function safeJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json') && !ct.includes('text/plain')) {
    const text = await res.text()
    throw new Error(`Server returned non-JSON response (HTTP ${res.status}). ${text.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

async function loadAgentNames(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/agents')
    const agents = await safeJson<Array<{ id: string; name: string }>>(res)
    const map: Record<string, string> = {}
    for (const a of agents) {
      map[a.id] = a.name
    }
    return map
  } catch {
    return {}
  }
}

export interface HistoryMeta {
  confidence: number
  formula: string
}

export async function executeWorkflowSimulation(
  intent: string,
  prompt: string,
  pipelineSteps: Array<{ name: string; action: string; roleGroup: string; formulaName: string }>,
  meta?: HistoryMeta,
): Promise<ExecutionData> {
  // Create workflow from analysis
  const createRes = await fetch('/api/workflows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Prompt Studio: ${intent}`,
      description: `Auto-generated from prompt: "${prompt.slice(0, 120)}${prompt.length > 120 ? '...' : ''}"`,
      triggerType: 'manual',
      steps: pipelineSteps.map(step => ({
        name: step.name,
        action: step.action,
        roleGroup: step.roleGroup,
        config: { formula: step.formulaName },
      })),
    }),
  })

  const createData = await safeJson<Record<string, any>>(createRes)

  if (!createRes.ok) {
    throw new Error(createData.error || `Failed to create workflow (HTTP ${createRes.status})`)
  }

  const workflow = createData.workflow

  if (!workflow?.id) {
    throw new Error('Workflow creation returned no valid data')
  }

  const stepNameMap = new Map((workflow.steps || []).map((s: any) => [s.id, s.name]))

  // Execute with REAL LLM via execute-llm endpoint
  const execRes = await fetch('/api/workflows/execute-llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workflowId: workflow.id,
      input: { prompt, intent },
    }),
  })

  const execData = await safeJson<Record<string, any>>(execRes)

  if (!execRes.ok) {
    throw new Error(execData.error || `Failed to execute workflow (HTTP ${execRes.status})`)
  }

  if (!execData.execution) {
    throw new Error('Execution returned no data')
  }

  const exec = execData.execution
  const agents = await loadAgentNames()

  // Step name resolution: workflow steps (primary) → stepNames from execute-llm (fallback)
  const execStepNames: Record<string, string> = exec.stepNames || {}

  const result: ExecutionData = {
    id: exec.id,
    status: exec.status,
    steps: (exec.steps || []).map((s: any) => ({
      id: s.id,
      name: stepNameMap.get(s.stepId) || execStepNames[s.stepId] || 'Step',
      status: s.status,
      agentId: s.agentId,
      agentName: agents[s.agentId] || 'System',
      action: 'process',
      startedAt: s.startedAt,
      completedAt: s.completedAt,
      inputData: s.inputData,
      outputData: s.outputData,
      error: s.error,
    })),
  }

  // Save to prompt history (fire-and-forget)
  savePromptHistory(prompt, intent, meta, result).catch(() => { /* ignore */ })

  return result
}
