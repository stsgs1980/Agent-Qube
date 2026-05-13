# P-MAS-v2 -- Prompt-based Multi-Agent System Dashboard

> Multi-Agent System Dashboard with 26 AI agents across 8 role groups, featuring hierarchy visualization and workflow pipeline.
>
> Repository: [github.com/stsgs1980/P-MAS-v2](https://github.com/stsgs1980/P-MAS-v2)

## Overview

P-MAS-v2 is a real-time dashboard for managing and visualizing a Prompt-based Multi-Agent System. It renders 26 specialized AI agents organized into 8 role groups across 5 hierarchy layers (L0--L4), with interactive DAG visualization, workflow pipeline management, and live status simulation.

The system provides three core views:

1. **Dashboard** -- Agent stats, status distribution, KPIs, activity timeline, system health monitoring
2. **Agent Hierarchy** -- Interactive React Flow + Dagre DAG layout with node search, context menus, layer bands, and connection strength visualization
3. **Workflow Pipeline** -- Full CRUD for multi-step agent workflows with execution tracking, step-level status, and agent message logs

## 26 Agents / 8 Role Groups

| Role Group | Agents | Layer |
|------------|--------|-------|
| **Strategy** | Architect, Analyst, Visionary | L0--L1 |
| **Tactics** | Coordinator, Planner, Communicator | L1--L2 |
| **Control** | Inspector, Evaluator, Guard | L1--L2 |
| **Execution** | Executor-A, Executor-B, Debugger, Tester | L2--L3 |
| **Memory** | Archivist, Observer, Diagnostician | L2--L3 |
| **Monitoring** | Gateway, Protocolist, Dispatcher | L2--L3 |
| **Communication** | Trainer, Scorer, Coder | L3--L4 |
| **Learning** | Context-Manager, RAG-Specialist, Alert-Operator, Adapter | L3--L4 |

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

```
L0  System Controller    (Architect)
L1  Strategic Layer      (Analyst, Visionary, Inspector, Evaluator, Guard, Coordinator)
L2  Operational Layer    (Planner, Communicator, Executor-A, Executor-B, Debugger, ...)
L3  Specialist Layer     (Tester, Archivist, Observer, Diagnostician, Gateway, ...)
L4  Interface Layer      (Trainer, Scorer, Coder, Context-Manager, RAG-Specialist, ...)
```

## Features

### Dashboard

- Quick Stats row (total agents, active tasks, success rate, avg response time)
- Status distribution chart (Active, Idle, Paused, Standby, Error, Offline)
- Agent performance metrics with sparklines
- Activity timeline with real-time events
- Connection heatmap between role groups
- System health monitor
- Architecture diagram
- Add/Edit agent modals with form validation

### Agent Hierarchy

- Interactive DAG visualization via React Flow + Dagre layout
- 5 hierarchy layer bands (L0--L4) with visual separation
- 6 edge/connection types with distinct styling and strength indicators
- Node search with glow highlighting and match count
- Right-click context menu on nodes
- Fit/Focus/Layout/Layers toolbar
- Agent detail panel (status, formula, skills, connections)
- Group sidebar filtering by role group
- Connection flow animation (particle dots along edges)

### Workflow Pipeline

- Create workflows with multi-step pipelines
- Assign agents or role groups to steps
- Step actions: process, review, transform, delegate, broadcast, decision
- Workflow execution with step-level status tracking
- Agent message log per step execution
- Workflow timeline and history views
- Expanded view with detailed step configuration
- Delete dialog with confirmation

### Design System

- Dark theme: black (#000000) background, monochrome + Cyan (#06B6D4) accent
- Status colors: Active=Cyan, Idle=Slate, Paused=Amber, Standby=Indigo, Error=Rose, Offline=Zinc
- Glow effects on active nodes ("breathing" animation)
- Semi-transparent edges with strength-based stroke width
- Real-time status simulation (15-second intervals)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite via Prisma ORM |
| Visualization | React Flow (@xyflow/react) + Dagre (DAG layout) |
| Animation | Framer Motion |
| State | Zustand + TanStack Query |
| Real-time | Socket.IO (WebSocket mini-service, port 3003) |
| Icons | Lucide React |

## API Endpoints

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

## Database Schema

```
Agent
  - id, name, role, roleGroup, status, formula
  - parentId (hierarchy relation)
  - twinId (twin agent relation)
  - skills, description, avatar
  - tasks[]

Task
  - id, title, description, status, priority
  - agentId (assigned agent)
  - createdAt, updatedAt

Workflow
  - id, name, description, status
  - triggerType, triggerConfig, version, tags
  - steps[], executions[]

PipelineStep
  - id, workflowId, order, name
  - agentId, roleGroup, action
  - inputSchema, outputSchema, condition
  - fallbackStepId, timeout, retryPolicy, config

WorkflowExecution
  - id, workflowId, status
  - taskContext, input, output, error
  - steps[]

StepExecution
  - id, executionId, stepId, agentId, status
  - inputData, outputData, error
  - messages[]

AgentMessage
  - id, stepExecutionId, fromAgentId, toAgentId
  - type, content, metadata, timestamp
```

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- Git

### Installation

```bash
git clone https://github.com/stsgs1980/P-MAS-v2.git
cd P-MAS-v2
bun install
bun run db:push
bun run seed
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

## Project Structure

```
P-MAS-v2/
  src/
    app/
      page.tsx                    # Main entry (Dashboard + Hierarchy + Workflows)
      dashboard-panel.tsx         # Dashboard panel component
      layout.tsx                  # Root layout
      globals.css                 # Global styles (dark theme)
      api/
        agents/                   # Agent CRUD + prompt endpoint
        tasks/                    # Task CRUD
        hierarchy/                # Hierarchy tree data
        stats/                    # Aggregated dashboard stats
        health/                   # System health check
        seed/                     # Database seeding
        workflows/                # Workflow CRUD + execute + seed
        prompting/                # Prompting library endpoint
    components/
      hierarchy/                  # Agent Hierarchy (React Flow + Dagre)
        agent-hierarchy-v2.tsx    # Main hierarchy component
        agent-node.tsx            # Custom React Flow node
        agent-edge.tsx            # Custom edge with strength styling
        agent-detail-header.tsx   # Agent detail panel header
        agent-detail-info.tsx     # Agent detail panel info
        agent-edit-form.tsx       # Agent edit form
        agent-icons.ts            # Agent icon mappings
        build-connections.ts      # Connection builder (6 types)
        edge-particles.tsx        # Flow animation particles
        group-sidebar.tsx         # Role group filter sidebar
        hierarchy-canvas.tsx      # React Flow canvas wrapper
        hierarchy-controls.tsx    # Fit/Focus/Layout toolbar
        hierarchy-header.tsx      # Hierarchy view header
        kpi-strip.tsx             # KPI metrics strip
        layer-labels.tsx          # L0-L4 layer band labels
        layout-algorithms.ts      # Dagre layout configuration
        panels.tsx                # Detail panel components
        add-agent-modal.tsx       # Add agent dialog
        stat-card.tsx             # Stat card component
        types.ts                  # Hierarchy type definitions
      workflows/                  # Workflow Pipeline
        workflow-pipeline.tsx     # Pipeline visualization (React Flow)
        workflow-card.tsx         # Workflow list card
        workflow-node.tsx         # Custom pipeline node
        workflow-edge.tsx         # Custom pipeline edge
        workflow-create-dialog.tsx # Create workflow dialog
        workflow-delete-dialog.tsx # Delete confirmation dialog
        workflow-execution-modal.tsx # Execution status modal
        workflow-expanded-view.tsx # Expanded step detail view
        workflow-timeline.tsx     # Execution timeline
        workflow-history.tsx      # Workflow run history
        workflow-sidebar.tsx      # Workflow list sidebar
        workflow-types.ts         # Type definitions
        workflow-contracts.tsx    # Step contract schemas
      dashboard/                  # Dashboard components
        dashboard-header.tsx      # Dashboard header
        dashboard-sidebar.tsx     # Navigation sidebar
        kpi-strip.tsx             # KPI metrics row
        status-distribution-card.tsx # Status pie/bar chart
        agent-performance.tsx     # Agent performance table
        activity-timeline.tsx     # Real-time activity feed
        system-health-monitor.tsx # System health gauge
        connection-heatmap.tsx    # Role group connection matrix
        architecture-diagram.tsx  # System architecture visual
        agent-edit-modal.tsx      # Agent edit dialog
        animated-counter.tsx      # Animated number counter
        mini-sparkline.tsx        # Mini sparkline chart
        collapsible-section.tsx   # Collapsible section wrapper
      ui/                         # shadcn/ui base components
    hooks/                        # Custom React hooks
      use-dashboard-data.ts       # Dashboard data fetching
      use-dashboard-ws.ts         # WebSocket connection
      use-hierarchy-data.ts       # Hierarchy data fetching
      use-hierarchy-state.ts      # Hierarchy UI state
      use-agent-edit.ts           # Agent edit logic
      use-agent-edit-form.ts      # Agent edit form state
      use-agent-mutations.ts      # Agent CRUD mutations
      use-workflow-data.ts        # Workflow data fetching
      use-workflow-state.ts       # Workflow UI state
      use-workflow-create.ts      # Workflow creation logic
      use-execution-animation.ts  # Step execution animation
    lib/
      db.ts                       # Prisma client singleton
      utils.ts                    # Utility functions (cn, etc.)
      client-fetch.ts             # Client-side fetch wrapper
      api-retry.ts                # API retry with backoff
      resilience.ts               # Circuit breaker pattern
      health-check.ts             # Health check utilities
      circuit-breaker.ts          # Circuit breaker implementation
      fallback-manager.ts         # Fallback provider strategy
      prompting/                  # @stsgs/prompting library
    data/
      dashboard-constants.ts      # Dashboard configuration constants
  prisma/
    schema.prisma                 # Database schema (7 models)
  mini-services/
    ws-service/                   # WebSocket service (port 3003)
    watchdog/                     # Dev server keepalive
  docs/                           # Project documentation
  standards/                      # Code standards (No-Unicode, Markdown, etc.)
  instructions/                   # Agent behavioral instructions
  assets/                         # Static assets (logo, favicon)
```

## Architecture

```
Frontend (Next.js 16 + React 19)
  |
  +-- / (Dashboard) -- page.tsx
  |     +-- Dashboard Panel (stats, KPIs, health, timeline)
  |     +-- Agent Hierarchy (React Flow + Dagre DAG)
  |     +-- Workflow Pipeline (CRUD, execution, tracking)
  |
  +-- API Routes (Next.js App Router)
  |     +-- /api/agents      -- Agent CRUD + prompt
  |     +-- /api/tasks       -- Task CRUD
  |     +-- /api/hierarchy   -- Tree data with connections
  |     +-- /api/stats       -- Aggregated dashboard data
  |     +-- /api/health      -- System health check
  |     +-- /api/seed        -- Database seeding
  |     +-- /api/workflows   -- Workflow CRUD + execute
  |
  +-- Mini Services
  |     +-- ws-service (port 3003) -- WebSocket real-time updates
  |     +-- watchdog              -- Dev server keepalive
  |
  +-- Database (SQLite + Prisma)
        +-- Agent (26 records)
        +-- Task (26 records)
        +-- Workflow + PipelineStep + WorkflowExecution
        +-- StepExecution + AgentMessage
```

## Design Principles

- **Dark background** (#000000) -- graphs and nodes "glow" on black
- **Monochrome + one accent** (Cyan #06B6D4) -- no rainbow, data-first
- **Radial/hierarchical layout** -- structure over chaos
- **Glow effects** -- active nodes "breathe" with subtle animation
- **Thin, semi-transparent edges** -- connections don't dominate the view
- **High contrast** -- everything reads instantly against the dark canvas
- **Minimalism** -- no decoration, data-first design

## Development Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | UI/UX Core (sidebar, W1280 layout, compact header) | Done |
| 2 | Visual & Design System (Cyan accent, status colors, layer bands, search glow) | Done |
| 3 | Data Layer (API endpoints, Prisma schema, DB seeding, 100% API-driven) | Done |
| 4 | Animation & Interaction (edge flow, 3D shadows, cluster backgrounds) | In Progress |
| 5 | Real-Time & CRUD (WebSocket, edit/delete agents, task management) | In Progress |
| 6 | Quality & Production (name fixes, PDF export, mobile, performance, auth) | Planned |

See [ROADMAP.md](ROADMAP.md) for the full task-level roadmap with status.

## Known Issues

- Dev server stability: Process killed periodically in sandbox environment
- Simulated status transitions: Status changes every 15s via client timer, not real events

## License

MIT

---

Built with: Next.js 16 + TypeScript + Tailwind CSS 4 + Prisma + shadcn/ui + React Flow + Framer Motion + Zustand
