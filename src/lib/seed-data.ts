import { db } from '@/lib/db'

// ─── Seed data constants ─────────────────────────────────────────────────────

export const sampleAgents = [
  { name: 'Architect', role: 'Chief Strategy Agent', roleGroup: 'Strategy', status: 'active', formula: 'ToT', skills: 'planning,architecture,strategy', description: 'Chief strategic agent that formulates goals and paths to achieve them', avatar: 'building-2' },
  { name: 'Analyst', role: 'Strategy Analyst', roleGroup: 'Strategy', status: 'active', formula: 'CoVe', skills: 'analysis,forecasting,modeling', description: 'Analyzes input data and forms strategic recommendations', avatar: 'bar-chart-3' },
  { name: 'Visionary', role: 'Vision Agent', roleGroup: 'Strategy', status: 'active', formula: 'GoT', skills: 'creativity,vision,innovation', description: 'Generates long-term visions and explores branching possibilities via graph reasoning', avatar: 'sparkles' },
  { name: 'Coordinator', role: 'Tactical Coordinator', roleGroup: 'Tactics', status: 'active', formula: 'ReWOO', skills: 'coordination,delegation,management', description: 'Coordinates the tactical group and distributes tasks', avatar: 'target' },
  { name: 'Planner', role: 'Task Planner', roleGroup: 'Tactics', status: 'active', formula: 'ReAct', skills: 'planning,estimation,prioritization', description: 'Breaks down strategic goals into concrete tasks', avatar: 'clipboard-list' },
  { name: 'Communicator', role: 'Inter-Agent Comm', roleGroup: 'Tactics', status: 'idle', formula: 'SelfConsistency', skills: 'communication,synchronization,transfer', description: 'Ensures communication between agents and groups, uses majority vote for message consistency', avatar: 'radio' },
  { name: 'Inspector', role: 'Quality Controller', roleGroup: 'Control', status: 'active', formula: 'Reflexion', skills: 'inspection,validation,quality_control', description: 'Controls task execution quality and standard compliance', avatar: 'search' },
  { name: 'Evaluator', role: 'Performance Evaluator', roleGroup: 'Control', status: 'active', formula: 'CoVe', skills: 'evaluation,metrics,reporting', description: 'Evaluates agent performance and result quality', avatar: 'trending-up' },
  { name: 'Guard', role: 'Safety Guard', roleGroup: 'Control', status: 'active', formula: 'ReAct', skills: 'security,filtering,protection', description: 'Ensures security and prevents undesirable actions', avatar: 'shield-check' },
  { name: 'Executor-A', role: 'Primary Executor', roleGroup: 'Execution', status: 'active', formula: 'ReAct', skills: 'execution,coding,generation', description: 'Primary execution agent for content and code generation', avatar: 'zap' },
  { name: 'Executor-B', role: 'Secondary Executor', roleGroup: 'Execution', status: 'active', formula: 'MoA', skills: 'execution,analysis,processing', description: 'Secondary execution agent, works in tandem with Executor-A', avatar: 'flame' },
  { name: 'Debugger', role: 'Debug Agent', roleGroup: 'Execution', status: 'idle', formula: 'SelfRefine', skills: 'debugging,correction,optimization', description: 'Fixes errors and iteratively refines results from other executors', avatar: 'bug' },
  { name: 'Tester', role: 'Test Agent', roleGroup: 'Execution', status: 'active', formula: 'PoT', skills: 'testing,verification,validation', description: 'Tests work results via programmatic reasoning and code execution', avatar: 'check-circle' },
  { name: 'Coder', role: 'Code Generator', roleGroup: 'Execution', status: 'active', formula: 'PoT', skills: 'coding,implementation,generation', description: 'Generates code via Program of Thought reasoning', avatar: 'binary' },
  { name: 'Archivist', role: 'Knowledge Archivist', roleGroup: 'Memory', status: 'active', formula: 'CoT', skills: 'indexing,retrieval,archiving', description: 'Maintains the knowledge base and indexes information for retrieval', avatar: 'book-open' },
  { name: 'RAG-Specialist', role: 'RAG Retrieval Agent', roleGroup: 'Memory', status: 'active', formula: 'AoT', skills: 'retrieval,augmentation,context', description: 'Retrieves relevant context via algorithmic reasoning and augments agent inputs', avatar: 'file-search' },
  { name: 'Context-Manager', role: 'Context Manager', roleGroup: 'Memory', status: 'standby', formula: 'SoT', skills: 'context,window,prioritization', description: 'Manages context windows and prioritizes information within token limits', avatar: 'hard-drive' },
  { name: 'Observer', role: 'System Observer', roleGroup: 'Monitoring', status: 'active', formula: 'CoT', skills: 'observation,logging,metrics', description: 'Observes all agent activity and collects runtime metrics', avatar: 'monitor' },
  { name: 'Alert-Operator', role: 'Alert Agent', roleGroup: 'Monitoring', status: 'paused', formula: 'LATS', skills: 'alerting,escalation,notification', description: 'Monitors for anomalies and triggers alerts using tree search reasoning', avatar: 'bell' },
  { name: 'Diagnostician', role: 'Diagnostics Agent', roleGroup: 'Monitoring', status: 'active', formula: 'GoT', skills: 'diagnostics,root-cause,analysis', description: 'Diagnoses issues by modeling failure graphs and tracing root causes', avatar: 'gauge' },
  { name: 'Gateway', role: 'Gateway Agent', roleGroup: 'Communication', status: 'active', formula: 'PromptChaining', skills: 'gateway,routing,protocol-translation', description: 'API gateway agent that routes requests and translates protocols between agent groups', avatar: 'network' },
  { name: 'Protocolist', role: 'Protocol Agent', roleGroup: 'Communication', status: 'active', formula: 'StepBack', skills: 'formatting,serialization,messaging', description: 'Handles message formatting, inter-agent protocol, and data serialization by abstracting before solving', avatar: 'workflow' },
  { name: 'Dispatcher', role: 'Dispatcher Agent', roleGroup: 'Communication', status: 'active', formula: 'PlanAndSolve', skills: 'dispatching,load-balancing,queue', description: 'Dispatches tasks, balances load, and manages queues using plan-then-execute reasoning', avatar: 'git-branch' },
  { name: 'Trainer', role: 'Trainer Agent', roleGroup: 'Learning', status: 'active', formula: 'DSPy', skills: 'fine-tuning,feedback,skill-improvement', description: 'Fine-tunes agent behavior, integrates feedback loops, and improves skills via declarative self-improving optimization', avatar: 'refresh-ccw' },
  { name: 'Adapter', role: 'Adapter Agent', roleGroup: 'Learning', status: 'active', formula: 'MetaCoT', skills: 'adaptation,transfer,knowledge-acquisition', description: 'Acquires new skills and transfers knowledge across domains using meta-reasoning over chain of thought', avatar: 'sparkles' },
  { name: 'Scorer', role: 'Evaluator Agent', roleGroup: 'Learning', status: 'idle', formula: 'LeastToMost', skills: 'scoring,reward-modeling,benchmarking', description: 'Evaluates performance, models rewards, and tracks benchmarks using progressive complexity reasoning', avatar: 'bar-chart-3' },
]

export const sampleTasks = [
  { title: 'Define Q1 Strategy', description: 'Create comprehensive Q1 strategic plan', status: 'completed', priority: 'high', agentIndex: 0 },
  { title: 'Analyze Market Trends', description: 'Review and analyze current market data', status: 'running', priority: 'high', agentIndex: 1 },
  { title: 'Generate Vision Report', description: 'Draft 3-year vision document', status: 'pending', priority: 'medium', agentIndex: 2 },
  { title: 'Coordinate Sprint Planning', description: 'Organize sprint planning sessions', status: 'running', priority: 'high', agentIndex: 3 },
  { title: 'Create Task Breakdown', description: 'Break down epics into implementable tasks', status: 'completed', priority: 'medium', agentIndex: 4 },
  { title: 'Sync Agent States', description: 'Synchronize state across agent groups', status: 'pending', priority: 'low', agentIndex: 5 },
  { title: 'Review Code Quality', description: 'Audit codebase for quality compliance', status: 'running', priority: 'high', agentIndex: 6 },
  { title: 'Generate Performance Report', description: 'Compile weekly performance metrics', status: 'completed', priority: 'medium', agentIndex: 7 },
  { title: 'Security Audit', description: 'Perform security review of outputs', status: 'running', priority: 'critical', agentIndex: 8 },
  { title: 'Implement Feature A', description: 'Develop feature A according to spec', status: 'running', priority: 'high', agentIndex: 9 },
  { title: 'Process Data Pipeline', description: 'Run data processing pipeline', status: 'completed', priority: 'medium', agentIndex: 10 },
  { title: 'Debug Module X', description: 'Fix reported issues in module X', status: 'pending', priority: 'high', agentIndex: 11 },
  { title: 'Test Integration Suite', description: 'Run integration test suite', status: 'running', priority: 'high', agentIndex: 12 },
  { title: 'Generate Utility Code', description: 'Create utility functions per specification', status: 'running', priority: 'medium', agentIndex: 13 },
  { title: 'Index Knowledge Base', description: 'Update knowledge base index with latest docs', status: 'running', priority: 'high', agentIndex: 14 },
  { title: 'Retrieve Context for Task', description: 'Fetch relevant context for current task', status: 'completed', priority: 'medium', agentIndex: 15 },
  { title: 'Optimize Context Window', description: 'Trim and prioritize context within limits', status: 'pending', priority: 'low', agentIndex: 16 },
  { title: 'Monitor Agent Health', description: 'Check all agent statuses and collect metrics', status: 'running', priority: 'high', agentIndex: 17 },
  { title: 'Alert: Memory Threshold', description: 'Notify when memory usage exceeds 80%', status: 'pending', priority: 'critical', agentIndex: 18 },
  { title: 'Diagnose Latency Spike', description: 'Root-cause analysis of response latency increase', status: 'running', priority: 'high', agentIndex: 19 },
  { title: 'Route API Requests', description: 'Configure gateway routing rules for inter-group communication', status: 'running', priority: 'high', agentIndex: 20 },
  { title: 'Format Protocol Messages', description: 'Standardize message format for cross-agent protocol', status: 'pending', priority: 'medium', agentIndex: 21 },
  { title: 'Balance Task Queue', description: 'Redistribute pending tasks across available agents', status: 'running', priority: 'high', agentIndex: 22 },
  { title: 'Fine-Tune Agent Responses', description: 'Apply feedback loops to improve agent output quality', status: 'pending', priority: 'medium', agentIndex: 23 },
  { title: 'Adapt Skills to New Domain', description: 'Transfer knowledge from existing domain to new task area', status: 'pending', priority: 'low', agentIndex: 24 },
  { title: 'Benchmark Agent Performance', description: 'Score agents on standardized benchmarks and track improvements', status: 'pending', priority: 'medium', agentIndex: 25 },
]

// ─── Hierarchy relationships: [parentIndex, childIndex] ─────────────────────

const PARENT_CHILD_PAIRS: [number, number][] = [
  [0, 1], [0, 2],       // Strategy: Architect -> Analyst, Visionary
  [3, 4], [3, 5],       // Tactics: Coordinator -> Planner, Communicator
  [6, 7], [6, 8],       // Control: Inspector -> Evaluator, Guard
  [9, 12], [9, 13],     // Execution: Executor-A -> Tester, Coder
  [14, 15], [14, 16],   // Memory: Archivist -> RAG-Specialist, Context-Manager
  [17, 18], [17, 19],   // Monitoring: Observer -> Alert-Operator, Diagnostician
  [20, 21], [20, 22],   // Communication: Gateway -> Protocolist, Dispatcher
  [23, 24], [23, 25],   // Learning: Trainer -> Adapter, Scorer
]

const TWIN_PAIRS: [number, number][] = [
  [9, 10], // Executor-A twin Executor-B
]

async function setParentChild(created: any[], parentIdx: number, childIdx: number) {
  if (created[parentIdx] && created[childIdx]) {
    await db.agent.update({
      where: { id: created[childIdx].id },
      data: { parentId: created[parentIdx].id },
    })
  }
}

async function setTwins(created: any[], a: number, b: number) {
  if (created[a] && created[b]) {
    await db.agent.update({ where: { id: created[a].id }, data: { twinId: created[b].id } })
    await db.agent.update({ where: { id: created[b].id }, data: { twinId: created[a].id } })
  }
}

export async function setupHierarchy(created: any[]) {
  await Promise.all(PARENT_CHILD_PAIRS.map(([p, c]) => setParentChild(created, p, c)))
  await Promise.all(TWIN_PAIRS.map(([a, b]) => setTwins(created, a, b)))
}

export async function seedDatabase() {
  await db.task.deleteMany()
  await db.agent.deleteMany()

  const created = []
  for (const agent of sampleAgents) {
    const record = await db.agent.create({ data: agent })
    created.push(record)
  }

  await setupHierarchy(created)

  let taskCount = 0
  for (const task of sampleTasks) {
    const agentRecord = created[task.agentIndex]
    if (agentRecord) {
      await db.task.create({
        data: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          agentId: agentRecord.id,
        },
      })
      taskCount++
    }
  }

  return {
    agentCount: created.length,
    taskCount,
    roleGroups: [...new Set(sampleAgents.map(a => a.roleGroup))],
    formulas: [...new Set(sampleAgents.map(a => a.formula))],
  }
}