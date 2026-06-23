# GitHub Copilot Instructions — P-MAS-v2 Project

## Product
P-MAS-v2: Prompt-based Multi-Agent System Dashboard.
26 AI agents across 8 role groups: Strategy, Tactics, Control, Execution,
Memory, Monitoring, Communication, Learning.
Agent Hierarchy visualization + Workflow Pipeline + real-time monitoring.

## Agents (26)
Architect, Analyst, Visionary, Coordinator, Planner, Communicator,
Inspector, Evaluator, Guard, Executor-A, Executor-B, Debugger,
Tester, Archivist, Observer, Diagnostician, Gateway, Protocolist,
Dispatcher, Trainer, Scorer, Coder, Context-Manager, RAG-Specialist,
Alert-Operator, Adapter

## Architecture
```
src/app/              Pages (dashboard, hierarchy, workflows)
src/components/
  hierarchy/          Agent Hierarchy (React Flow + Dagre DAG)
  workflows/          Workflow Pipeline
  ui/                 shadcn/ui base components
src/hooks/            Custom React hooks
src/lib/              Utilities, Prisma client, API helpers
prisma/               Database schema and seed
```

## Design
- Dark theme: black #000000 background
- Accent: Cyan #06B6D4
- Monochrome grays only, cyan as sole color accent
- React Flow + Dagre for agent hierarchy DAG
- Framer Motion for transitions

## Anti-Monolith Rules
1. Component <= 150 lines, File <= 200 lines, Page <= 40 lines
2. Max 3 useState per component -> extract to hook
3. Components don't fetch data directly -> use hooks or props
4. Barrel exports for every module
5. Static imports only (Turbopack incompatible with next/dynamic)
6. Layer separation enforced by ESLint

## Import Patterns
- `import { AgentNode } from '@/components/hierarchy/agent-node'`
- `import { WorkflowCard } from '@/components/workflows/workflow-card'`
- `import { db } from '@/lib/db'`
- `import { fetchWithRetry } from '@/lib/client-fetch'`

## API Endpoints
- `/api/agents` — Agent CRUD
- `/api/agents/prompt` — Send prompt to agent
- `/api/tasks` — Task management
- `/api/hierarchy` — Agent hierarchy graph data
- `/api/stats` — Dashboard statistics
- `/api/health` — System health check
- `/api/seed` — Database seeding

## Stack
Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui,
Prisma SQLite, React Flow, Framer Motion, Zustand
