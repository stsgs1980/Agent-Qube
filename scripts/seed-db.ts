import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleAgents = [
  // === Strategy ===
  { name: 'Architect', role: 'Chief Strategy Agent', roleGroup: 'Strategy', status: 'active', formula: 'ToT', skills: 'planning,architecture,strategy', description: 'Chief strategic agent that formulates goals and paths to achieve them', avatar: 'building-2' },
  { name: 'Analyst', role: 'Strategy Analyst', roleGroup: 'Strategy', status: 'active', formula: 'CoVe', skills: 'analysis,forecasting,modeling', description: 'Analyzes input data and forms strategic recommendations', avatar: 'bar-chart-3' },
  { name: 'Visionary', role: 'Vision Agent', roleGroup: 'Strategy', status: 'active', formula: 'GoT', skills: 'creativity,vision,innovation', description: 'Generates long-term visions and explores branching possibilities via graph reasoning', avatar: 'sparkles' },

  // === Tactics ===
  { name: 'Coordinator', role: 'Tactical Coordinator', roleGroup: 'Tactics', status: 'active', formula: 'ReWOO', skills: 'coordination,delegation,management', description: 'Coordinates the tactical group and distributes tasks', avatar: 'target' },
  { name: 'Planner', role: 'Task Planner', roleGroup: 'Tactics', status: 'active', formula: 'ReAct', skills: 'planning,estimation,prioritization', description: 'Breaks down strategic goals into concrete tasks', avatar: 'clipboard-list' },
  { name: 'Communicator', role: 'Inter-Agent Comm', roleGroup: 'Tactics', status: 'idle', formula: 'SelfConsistency', skills: 'communication,synchronization,transfer', description: 'Ensures communication between agents and groups, uses majority vote for message consistency', avatar: 'radio' },

  // === Control ===
  { name: 'Inspector', role: 'Quality Controller', roleGroup: 'Control', status: 'active', formula: 'Reflexion', skills: 'inspection,validation,quality_control', description: 'Controls task execution quality and standard compliance', avatar: 'search' },
  { name: 'Evaluator', role: 'Performance Evaluator', roleGroup: 'Control', status: 'active', formula: 'CoVe', skills: 'evaluation,metrics,reporting', description: 'Evaluates agent performance and result quality', avatar: 'trending-up' },
  { name: 'Guard', role: 'Safety Guard', roleGroup: 'Control', status: 'active', formula: 'ReAct', skills: 'security,filtering,protection', description: 'Ensures security and prevents undesirable actions', avatar: 'shield-check' },

  // === Execution ===
  { name: 'Executor-A', role: 'Primary Executor', roleGroup: 'Execution', status: 'active', formula: 'ReAct', skills: 'execution,coding,generation', description: 'Primary execution agent for content and code generation', avatar: 'zap' },
  { name: 'Executor-B', role: 'Secondary Executor', roleGroup: 'Execution', status: 'active', formula: 'MoA', skills: 'execution,analysis,processing', description: 'Secondary execution agent, works in tandem with Executor-A', avatar: 'flame' },
  { name: 'Debugger', role: 'Debug Agent', roleGroup: 'Execution', status: 'idle', formula: 'SelfRefine', skills: 'debugging,correction,optimization', description: 'Fixes errors and iteratively refines results from other executors', avatar: 'bug' },
  { name: 'Tester', role: 'Test Agent', roleGroup: 'Execution', status: 'active', formula: 'PoT', skills: 'testing,verification,validation', description: 'Tests work results via programmatic reasoning and code execution', avatar: 'check-circle' },
  { name: 'Coder', role: 'Code Generator', roleGroup: 'Execution', status: 'active', formula: 'PoT', skills: 'coding,implementation,generation', description: 'Generates code via Program of Thought reasoning', avatar: 'binary' },

  // === Memory ===
  { name: 'Archivist', role: 'Knowledge Archivist', roleGroup: 'Memory', status: 'active', formula: 'CoT', skills: 'indexing,retrieval,archiving', description: 'Maintains the knowledge base and indexes information for retrieval', avatar: 'book-open' },
  { name: 'RAG-Specialist', role: 'RAG Retrieval Agent', roleGroup: 'Memory', status: 'active', formula: 'AoT', skills: 'retrieval,augmentation,context', description: 'Retrieves relevant context via algorithmic reasoning and augments agent inputs', avatar: 'file-search' },
  { name: 'Context-Manager', role: 'Context Manager', roleGroup: 'Memory', status: 'standby', formula: 'SoT', skills: 'context,window,prioritization', description: 'Manages context windows and prioritizes information within token limits', avatar: 'hard-drive' },

  // === Monitoring ===
  { name: 'Observer', role: 'System Observer', roleGroup: 'Monitoring', status: 'active', formula: 'CoT', skills: 'observation,logging,metrics', description: 'Observes all agent activity and collects runtime metrics', avatar: 'monitor' },
  { name: 'Alert-Operator', role: 'Alert Agent', roleGroup: 'Monitoring', status: 'paused', formula: 'LATS', skills: 'alerting,escalation,notification', description: 'Monitors for anomalies and triggers alerts using tree search reasoning', avatar: 'bell' },
  { name: 'Diagnostician', role: 'Diagnostics Agent', roleGroup: 'Monitoring', status: 'active', formula: 'GoT', skills: 'diagnostics,root-cause,analysis', description: 'Diagnoses issues by modeling failure graphs and tracing root causes', avatar: 'gauge' },

  // === Communication ===
  { name: 'Gateway', role: 'Gateway Agent', roleGroup: 'Communication', status: 'active', formula: 'PromptChaining', skills: 'gateway,routing,protocol-translation', description: 'API gateway agent that routes requests and translates protocols between agent groups', avatar: 'network' },
  { name: 'Protocolist', role: 'Protocol Agent', roleGroup: 'Communication', status: 'active', formula: 'StepBack', skills: 'formatting,serialization,messaging', description: 'Handles message formatting, inter-agent protocol, and data serialization by abstracting before solving', avatar: 'workflow' },
  { name: 'Dispatcher', role: 'Dispatcher Agent', roleGroup: 'Communication', status: 'active', formula: 'PlanAndSolve', skills: 'dispatching,load-balancing,queue', description: 'Dispatches tasks, balances load, and manages queues using plan-then-execute reasoning', avatar: 'git-branch' },

  // === Learning ===
  { name: 'Trainer', role: 'Trainer Agent', roleGroup: 'Learning', status: 'active', formula: 'DSPy', skills: 'fine-tuning,feedback,skill-improvement', description: 'Fine-tunes agent behavior, integrates feedback loops, and improves skills via declarative self-improving optimization', avatar: 'refresh-ccw' },
  { name: 'Adapter', role: 'Adapter Agent', roleGroup: 'Learning', status: 'active', formula: 'MetaCoT', skills: 'adaptation,transfer,knowledge-acquisition', description: 'Acquires new skills and transfers knowledge across domains using meta-reasoning over chain of thought', avatar: 'sparkles' },
  { name: 'Scorer', role: 'Evaluator Agent', roleGroup: 'Learning', status: 'idle', formula: 'LeastToMost', skills: 'scoring,reward-modeling,benchmarking', description: 'Evaluates performance, models rewards, and tracks benchmarks using progressive complexity reasoning', avatar: 'bar-chart-3' },
]

const sampleTasks = [
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

async function main() {
  console.log('Seeding database...')

  // Delete existing data
  await prisma.task.deleteMany()
  await prisma.agent.deleteMany()

  // Create agents
  const created = []
  for (const agent of sampleAgents) {
    const record = await prisma.agent.create({ data: agent })
    created.push(record)
  }
  console.log(`Created ${created.length} agents`)

  // Set up hierarchy relationships
  // Strategy: Architect -> Analyst, Visionary
  if (created[0] && created[1]) await prisma.agent.update({ where: { id: created[1].id }, data: { parentId: created[0].id } })
  if (created[0] && created[2]) await prisma.agent.update({ where: { id: created[2].id }, data: { parentId: created[0].id } })
  // Tactics: Coordinator -> Planner, Communicator
  if (created[3] && created[4]) await prisma.agent.update({ where: { id: created[4].id }, data: { parentId: created[3].id } })
  if (created[3] && created[5]) await prisma.agent.update({ where: { id: created[5].id }, data: { parentId: created[3].id } })
  // Control: Inspector -> Evaluator, Guard
  if (created[6] && created[7]) await prisma.agent.update({ where: { id: created[7].id }, data: { parentId: created[6].id } })
  if (created[6] && created[8]) await prisma.agent.update({ where: { id: created[8].id }, data: { parentId: created[6].id } })
  // Execution: Executor-A twin Executor-B
  if (created[9] && created[10]) {
    await prisma.agent.update({ where: { id: created[9].id }, data: { twinId: created[10].id } })
    await prisma.agent.update({ where: { id: created[10].id }, data: { twinId: created[9].id } })
  }
  // Execution: Tester parent = Executor-A
  if (created[12] && created[9]) await prisma.agent.update({ where: { id: created[12].id }, data: { parentId: created[9].id } })
  // Execution: Coder parent = Executor-A
  if (created[13] && created[9]) await prisma.agent.update({ where: { id: created[13].id }, data: { parentId: created[9].id } })
  // Memory: Archivist -> RAG-Specialist, Context-Manager
  if (created[14] && created[15]) await prisma.agent.update({ where: { id: created[15].id }, data: { parentId: created[14].id } })
  if (created[14] && created[16]) await prisma.agent.update({ where: { id: created[16].id }, data: { parentId: created[14].id } })
  // Monitoring: Observer -> Alert-Operator, Diagnostician
  if (created[17] && created[18]) await prisma.agent.update({ where: { id: created[18].id }, data: { parentId: created[17].id } })
  if (created[17] && created[19]) await prisma.agent.update({ where: { id: created[19].id }, data: { parentId: created[17].id } })
  // Communication: Gateway -> Protocolist, Dispatcher
  if (created[20] && created[21]) await prisma.agent.update({ where: { id: created[21].id }, data: { parentId: created[20].id } })
  if (created[20] && created[22]) await prisma.agent.update({ where: { id: created[22].id }, data: { parentId: created[20].id } })
  // Learning: Trainer -> Adapter, Scorer
  if (created[23] && created[24]) await prisma.agent.update({ where: { id: created[24].id }, data: { parentId: created[23].id } })
  if (created[23] && created[25]) await prisma.agent.update({ where: { id: created[25].id }, data: { parentId: created[23].id } })

  // Create tasks
  let taskCount = 0
  for (const task of sampleTasks) {
    const agentRecord = created[task.agentIndex]
    if (agentRecord) {
      await prisma.task.create({
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
  console.log(`Created ${taskCount} tasks`)
  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
