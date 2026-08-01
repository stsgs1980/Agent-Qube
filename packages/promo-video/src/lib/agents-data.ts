import type { AgentNode } from "../types";

export const agents: AgentNode[] = [
  { id: "architect", name: "Architect", role: "System Design", group: "strategy", x: 960, y: 300, connections: ["planner", "analyst"] },
  { id: "analyst", name: "Analyst", role: "Data Analysis", group: "strategy", x: 700, y: 200, connections: ["coder"] },
  { id: "visionary", name: "Visionary", role: "Future Planning", group: "strategy", x: 1200, y: 200, connections: ["architect"] },
  { id: "coordinator", name: "Coordinator", role: "Task Distribution", group: "tactics", x: 960, y: 500, connections: ["executor-a", "executor-b"] },
  { id: "planner", name: "Planner", role: "Step Planning", group: "tactics", x: 700, y: 450, connections: ["coordinator"] },
  { id: "communicator", name: "Communicator", role: "Agent Messaging", group: "communication", x: 1200, y: 450, connections: ["coordinator"] },
  { id: "inspector", name: "Inspector", role: "Code Review", group: "control", x: 400, y: 500, connections: ["guard"] },
  { id: "evaluator", name: "Evaluator", role: "Quality Check", group: "control", x: 400, y: 650, connections: ["inspector"] },
  { id: "guard", name: "Guard", role: "Security Audit", group: "control", x: 250, y: 575, connections: [] },
  { id: "executor-a", name: "Executor A", role: "Task Execution", group: "execution", x: 800, y: 700, connections: ["tester"] },
  { id: "executor-b", name: "Executor B", role: "Task Execution", group: "execution", x: 1100, y: 700, connections: ["tester"] },
  { id: "debugger", name: "Debugger", role: "Error Resolution", group: "execution", x: 960, y: 800, connections: ["executor-a", "executor-b"] },
  { id: "tester", name: "Tester", role: "Test Writing", group: "execution", x: 960, y: 650, connections: ["evaluator"] },
  { id: "archivist", name: "Archivist", role: "Memory Storage", group: "memory", x: 1500, y: 400, connections: ["context-manager"] },
  { id: "observer", name: "Observer", role: "System Monitoring", group: "monitoring", x: 1500, y: 600, connections: ["diagnostician"] },
  { id: "diagnostician", name: "Diagnostician", role: "Issue Analysis", group: "monitoring", x: 1650, y: 500, connections: [] },
  { id: "gateway", name: "Gateway", role: "API Gateway", group: "communication", x: 250, y: 350, connections: ["protocolist"] },
  { id: "protocolist", name: "Protocolist", role: "Protocol Design", group: "communication", x: 250, y: 250, connections: [] },
  { id: "dispatcher", name: "Dispatcher", role: "Event Routing", group: "tactics", x: 500, y: 300, connections: ["coordinator"] },
  { id: "trainer", name: "Trainer", role: "Model Training", group: "learning", x: 700, y: 850, connections: ["scorer"] },
  { id: "scorer", name: "Scorer", role: "Performance Scoring", group: "learning", x: 960, y: 900, connections: [] },
  { id: "coder", name: "Coder", role: "Code Generation", group: "execution", x: 500, y: 150, connections: ["architect"] },
  { id: "context-manager", name: "Context Manager", role: "Context Tracking", group: "memory", x: 1650, y: 300, connections: [] },
  { id: "rag-specialist", name: "RAG Specialist", role: "Retrieval Augmented", group: "memory", x: 1500, y: 250, connections: ["context-manager"] },
  { id: "alert-operator", name: "Alert Operator", role: "Alert Management", group: "monitoring", x: 1650, y: 650, connections: ["observer"] },
  { id: "adapter", name: "Adapter", role: "Environment Adaptation", group: "learning", x: 500, y: 850, connections: ["trainer"] },
];

export const stats = {
  totalAgents: 26,
  activeWorkflows: 12,
  tasksCompleted: 1847,
  uptime: 99.7,
};
