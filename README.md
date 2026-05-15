# P-MAS-v2

Prompt-based Multi-Agent System Dashboard. 26 AI agents across 8 role groups and 5 hierarchy layers, with interactive hierarchy visualization, workflow pipeline execution, and an integrated prompting library.

Repository: [github.com/stsgs1980/P-MAS-v2](https://github.com/stsgs1980/P-MAS-v2)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square)

## Features

- **Dashboard** - Agent stats, status distribution, KPIs, activity timeline, system health monitoring
- **Agent Hierarchy** - Interactive React Flow + Dagre DAG layout with node search, context menus, layer bands, and connection strength visualization
- **Workflow Pipeline** - Full CRUD for multi-step agent workflows with simulated and LLM-powered execution, step-level status, feedback loops, and agent message logs
- **26 AI Agents** across 8 role groups and 5 hierarchy layers (L0--L4)
- **6 Connection Types** - command, sync, twin, delegate, supervise, broadcast
- **@stsgs/prompting Library** - 5 modules (core, templates, evaluation, agents, instructions) with 20 cognitive formulas, 12 orchestration patterns, 6-dimension scoring, and behavioral/architectural instructions
- **20 Cognitive Formulas** - ToT, CoVe, GoT, CoT, ReAct, Reflexion, ReWOO, MoA, and more, mapped to agents
- **LLM-Powered Workflow Execution** - Real AI execution via z-ai-web-dev-sdk with resilience (retry, circuit breaker, timeout) at `/api/workflows/execute-llm`
- **AI Prompt Interpretation** - z-ai-web-dev-sdk integration at `/api/interpret-prompt` with intent matching
- **7 Theme Presets** - Champagne, Cyan Night, Zinc (dark) + Champagne Light, Cyan Morning, Sand Light, Ember (light) via CSS custom properties
- **Dark Design System** - Black (#000000) background, monochrome + Cyan (#06B6D4) accent, glow effects on active nodes
- **WebSocket Real-time** - Socket.IO service (port 3003) for live agent status updates

## 26 Agents / 8 Role Groups

| Role Group | Agents | Layer |
|------------|--------|-------|
| **Strategy** | Architect, Analyst, Visionary | L0--L1 |
| **Tactics** | Coordinator, Planner, Communicator | L1--L2 |
| **Control** | Inspector, Evaluator, Guard | L1--L2 |
| **Execution** | Executor-A, Executor-B, Debugger, Tester, Coder | L2--L3 |
| **Memory** | Archivist, RAG-Specialist, Context-Manager | L2--L3 |
| **Monitoring** | Observer, Alert-Operator, Diagnostician | L2--L3 |
| **Communication** | Gateway, Protocolist, Dispatcher | L2--L3 |
| **Learning** | Trainer, Adapter, Scorer | L3--L4 |

## 6 Connection Types

| Type | Description |
|------|-------------|
| **command** | Direct instruction from superior to subordinate |
| **sync** | Bidirectional data synchronization between peers |
| **twin** | Mirrored agent pair for redundancy |
| **delegate** | Task delegation across role groups |
| **supervise** | Oversight connection from controller to executor |
| **broadcast** | One-to-many notification channel |

## 5 Hierarchy Layers

- **L0** System Controller - Architect
- **L1** Strategic Layer - Analyst, Visionary, Inspector, Evaluator, Guard, Coordinator
- **L2** Operational Layer - Planner, Communicator, Executor-A, Executor-B, Debugger
- **L3** Specialist Layer - Tester, Archivist, Observer, Diagnostician, Gateway, Coder
- **L4** Interface Layer - Trainer, Scorer, Context-Manager, RAG-Specialist, Alert-Operator, Adapter

## Tech Stack

- **Framework** - Next.js 16 (App Router) + React 19
- **Language** - TypeScript 5 (strict mode)
- **Styling** - Tailwind CSS 4 + shadcn/ui
- **Database** - SQLite via Prisma ORM
- **Visualization** - React Flow (@xyflow/react) + Dagre (DAG layout) + Recharts
- **Animation** - Framer Motion
- **State** - Zustand (client) + TanStack Query (server)
- **Forms** - React Hook Form + Zod validation
- **Real-time** - Socket.IO (WebSocket mini-service, port 3003)
- **Icons** - Lucide React
- **Prompting** - @stsgs/prompting library (5 modules, 21 files)
- **AI Integration** - z-ai-web-dev-sdk for chat completions with resilience

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- Git

### Installation

```bash
git clone https://github.com/stsgs1980/P-MAS-v2.git
cd P-MAS-v2
bun install
cp .env.example .env
bun run db:push
bun run dev
```

The application will be available at `http://localhost:3000`.

### Seeding the Database

The seed endpoint populates the database with 26 agents, their associated tasks, and 8 role groups:

```bash
curl -X POST http://localhost:3000/api/seed
```

## Configuration

### Environment Variables

See `.env.example`:

```env
DATABASE_URL="file:./db/dev.db"
```

## Project Structure

- `src/app/` - Next.js App Router pages and API routes (18 API endpoints)
- `src/app/themes/` - 7 CSS theme presets (Champagne, Cyan Night, Zinc, etc.)
- `src/components/hierarchy/` - Agent Hierarchy (React Flow + Dagre DAG, 24 files)
- `src/components/workflows/` - Workflow Pipeline (CRUD, execution, tracking, 18 files)
- `src/components/dashboard/` - Dashboard components (stats, KPIs, health, 19 files)
- `src/components/ui/` - shadcn/ui base components (37 files)
- `src/hooks/` - Custom React hooks (14 hooks)
- `src/lib/` - Utilities, Prisma client, API helpers
- `src/lib/prompting/` - @stsgs/prompting library (5 modules, 21 files)
  - `core/` - Types, 20 techniques, 11 frameworks, 5-layer system-prompt architect
  - `templates/` - 12 intents, 12 agent roles, 8 flow templates
  - `evaluation/` - 6-dim scoring (S/A/B/C/D/F), blind compare, CORE-EEAT 40 checks
  - `agents/` - 20 cognitive formulas, 12 orchestration patterns, resilience (retry/circuit-breaker/timeout)
  - `instructions.ts` - 6 behavioral + 4 architectural instructions (inline)
- `src/data/` - Dashboard constants and layout recipes
- `prisma/` - Database schema (7 models: Agent, Task, Workflow, PipelineStep, WorkflowExecution, StepExecution, AgentMessage)
- `mini-services/ws-service/` - WebSocket service (port 3003, Socket.IO)
- `mini-services/watchdog/` - Dev server keepalive (port 3031)
- `standards/` - 14 governance documents
- `instructions/` - 7 behavioral instructions
- `skills/` - 63 agent skills (10 toolkit + 53 project)
- `templates/` - Operational templates (worklog, task template, e2e, workflows)

## API Reference

### Agents

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents` | GET, POST | List all agents / Create agent |
| `/api/agents/[id]` | GET, PUT, DELETE | Get / Update / Delete agent |
| `/api/agents/prompt` | POST | Generate system prompt for agent using @stsgs/prompting |

### Tasks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET, POST | List all tasks / Create task |
| `/api/tasks/[id]` | GET, PUT, DELETE | Get / Update / Delete task |

### Workflows

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workflows` | GET, POST | List / Create workflows |
| `/api/workflows/[id]` | GET, PUT, DELETE | Get / Update / Delete workflow |
| `/api/workflows/execute` | POST | Execute workflow with step-by-step simulation, feedback loops, agent messages |
| `/api/workflows/execute-llm` | POST | Execute workflow with real LLM calls via z-ai-web-dev-sdk + resilience |
| `/api/workflows/seed` | POST | Seed sample workflows |

### System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hierarchy` | GET | Full hierarchy tree with connections |
| `/api/stats` | GET | Aggregated dashboard statistics |
| `/api/health` | GET | System health check |
| `/api/seed` | POST | Seed database (26 agents + 26 tasks) |

### Prompting and AI

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prompting` | GET | Prompting library API (12 sections: formulas, patterns, techniques, frameworks, roles, intent, score, quick-score, benchmark, flows, instructions, apply-formula) |
| `/api/interpret-prompt` | POST | AI-powered prompt interpretation via z-ai-web-dev-sdk + intent matching |
| `/api/recipes` | GET | Layout recipes for the Layout Explorer |

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Development server on port 3000 |
| `bun run build` | Production build |
| `bun run lint` | ESLint check |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:reset` | Reset database |

## Development Rules

### Required Technologies

- Next.js 16 with App Router (REQUIRED)
- TypeScript 5 (REQUIRED)
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM with SQLite
- React Flow + Dagre for hierarchy visualization

### Anti-Monolith Rules

- Component: max 150 lines, File: max 200 lines, Page: max 40 lines
- Max 3 `useState` per component - extract to custom hook
- Components do not fetch data directly - use hooks or props
- Barrel exports for every module
- Static imports only (no `next/dynamic` with Turbopack)
- ESLint layer separation enforced

### Design System

- Dark background (#000000) - graphs and nodes "glow" on black
- Monochrome + one accent (Cyan #06B6D4) - no rainbow, data-first
- Status colors: Active=Cyan, Idle=Slate, Paused=Amber, Standby=Indigo, Error=Rose, Offline=Zinc
- Glow effects - active nodes "breathe" with subtle animation
- High contrast - everything reads instantly against the dark canvas

### @stsgs/prompting Library

The prompting library is located at `src/lib/prompting/` and consists of 5 modules across 21 files:

- **core** - Type definitions, 20 prompting techniques, 11 frameworks, 5-layer system-prompt architect
- **templates** - 12 intent templates, 12 agent role templates, 8 flow templates
- **evaluation** - 6-dimension scoring (S/A/B/C/D/F grades), blind comparison, CORE-EEAT 40-point checklist
- **agents** - 20 cognitive formulas (ToT, CoVe, GoT, CoT, ReAct, Reflexion, ReWOO, MoA, etc.), 12 orchestration patterns, resilience patterns (retry, circuit-breaker, timeout)
- **instructions** - 6 behavioral instructions + 4 architectural instructions (inline, no filesystem dependency)

### Database Models

7 Prisma models: Agent, Task, Workflow, PipelineStep, WorkflowExecution, StepExecution, AgentMessage

### Toolkit Version

v1.9.1

## Agent Rules (Mandatory)

Any AI agent working on this project MUST read and follow `AGENT_RULES.md` before performing any operations.

- See `AGENT_RULES.md` for full behavioral rules
- See `PROJECT_CONFIG.md` for project-specific settings (stack, server, paths)
- See `instructions/` for complete rule descriptions (7 instructions)
- See `skills/` for automated tooling (63 skills)
- See `standards/` for governance documents (14 standards)

---

Built with: Next.js 16 + TypeScript + Tailwind CSS
