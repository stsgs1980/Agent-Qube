# P-MAS-v2 -- Prompt-based Multi-Agent System Dashboard

> Multi-Agent System Dashboard with 26 AI agents across 8 role groups, featuring hierarchy visualization and workflow pipeline.
>
> Repository: [github.com/stsgs1980/P-MAS-v2](https://github.com/stsgs1980/P-MAS-v2)

## Features

- **Dashboard** -- Agent stats, status distribution, KPIs, activity timeline, system health monitoring
- **Agent Hierarchy** -- Interactive React Flow + Dagre DAG layout with node search, context menus, layer bands, and connection strength visualization
- **Workflow Pipeline** -- Full CRUD for multi-step agent workflows with execution tracking, step-level status, and agent message logs
- **26 AI Agents** across 8 role groups and 5 hierarchy layers (L0--L4)
- **6 Connection Types** -- command, sync, twin, delegate, supervise, broadcast
- **Dark Design System** -- Black (#000000) background, monochrome + Cyan (#06B6D4) accent, glow effects on active nodes

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

- **L0** System Controller -- Architect
- **L1** Strategic Layer -- Analyst, Visionary, Inspector, Evaluator, Guard, Coordinator
- **L2** Operational Layer -- Planner, Communicator, Executor-A, Executor-B, Debugger
- **L3** Specialist Layer -- Tester, Archivist, Observer, Diagnostician, Gateway, Coder
- **L4** Interface Layer -- Trainer, Scorer, Context-Manager, RAG-Specialist, Alert-Operator, Adapter

## Tech Stack

- **Framework** -- Next.js 16 (App Router) + React 19
- **Language** -- TypeScript 5 (strict mode)
- **Styling** -- Tailwind CSS 4 + shadcn/ui
- **Database** -- SQLite via Prisma ORM
- **Visualization** -- React Flow (@xyflow/react) + Dagre (DAG layout)
- **Animation** -- Framer Motion
- **State** -- Zustand + TanStack Query
- **Real-time** -- Socket.IO (WebSocket mini-service, port 3003)
- **Icons** -- Lucide React

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

The seed endpoint populates the database with 26 agents, their associated tasks, and 8 role groups. Either use the API:

```bash
curl -X POST http://localhost:3000/api/seed
```

Or the seed script:

```bash
bun run seed
```

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

## Configuration

### Environment Variables

See `.env.example`:

```env
DATABASE_URL="file:./db/dev.db"
```

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents` | GET, POST | List all agents / Create agent |
| `/api/agents/[id]` | GET, PUT, DELETE | Get / Update / Delete agent |
| `/api/agents/prompt` | POST | Prompt an agent (AI integration) |
| `/api/tasks` | GET, POST | List all tasks / Create task |
| `/api/tasks/[id]` | GET, PUT, DELETE | Get / Update / Delete task |
| `/api/hierarchy` | GET | Full hierarchy tree with connections |
| `/api/stats` | GET | Aggregated dashboard statistics |
| `/api/health` | GET | System health check |
| `/api/seed` | POST | Seed database (26 agents + tasks + groups) |
| `/api/workflows` | GET, POST | List / Create workflows |
| `/api/workflows/[id]` | GET, PUT, DELETE | Get / Update / Delete workflow |
| `/api/workflows/execute` | POST | Execute a workflow |
| `/api/workflows/seed` | POST | Seed sample workflows |

## Project Structure

- `src/app/` -- Next.js App Router pages and API routes
- `src/components/hierarchy/` -- Agent Hierarchy (React Flow + Dagre DAG)
- `src/components/workflows/` -- Workflow Pipeline (CRUD, execution, tracking)
- `src/components/dashboard/` -- Dashboard components (stats, KPIs, health)
- `src/components/ui/` -- shadcn/ui base components
- `src/hooks/` -- Custom React hooks
- `src/lib/` -- Utilities, Prisma client, API helpers, prompting library
- `src/data/` -- Dashboard configuration constants
- `prisma/` -- Database schema and seed
- `mini-services/ws-service/` -- WebSocket service (port 3003)
- `mini-services/watchdog/` -- Dev server keepalive
- `standards/` -- Code standards (Unicode Policy, Markdown, Frontend, GitHub, etc.)
- `instructions/` -- Agent behavioral instructions
- `skills/` -- Automated agent skills
- `templates/` -- Operational templates (worklog, task template)

## Development Rules

### Required Technologies

- Next.js 16 with App Router (REQUIRED)
- TypeScript 5 (REQUIRED)
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM with SQLite
- React Flow + Dagre for hierarchy visualization

### Anti-Monolith Rules

- Component: max 150 lines, File: max 200 lines, Page: max 40 lines
- Max 3 `useState` per component -- extract to custom hook
- Components do not fetch data directly -- use hooks or props
- Barrel exports for every module
- Static imports only (no `next/dynamic` with Turbopack)
- ESLint layer separation enforced

### Design System

- Dark background (#000000) -- graphs and nodes "glow" on black
- Monochrome + one accent (Cyan #06B6D4) -- no rainbow, data-first
- Status colors: Active=Cyan, Idle=Slate, Paused=Amber, Standby=Indigo, Error=Rose, Offline=Zinc
- Glow effects -- active nodes "breathe" with subtle animation
- High contrast -- everything reads instantly against the dark canvas

## Agent Rules (Mandatory)

Any AI agent working on this project MUST read and follow `AGENT_RULES.md` before performing any operations.

- See `AGENT_RULES.md` for full behavioral rules
- See `PROJECT_CONFIG.md` for project-specific settings (stack, server, paths)
- See `instructions/` for complete rule descriptions
- See `skills/` for automated tooling
- See `standards/` for governance documents

## Known Issues

- Dev server stability: Process killed periodically in sandbox environment
- Simulated status transitions: Status changes every 15s via client timer, not real events

## License

MIT

---

Built with: Next.js 16 + TypeScript + Tailwind CSS
