# Agent Qube

**Agent Qube** — Visualize and manage 26 AI agents across 8 role groups with cognitive formulas, real-time WebSocket updates, and LLM-powered workflow execution.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square)](https://www.prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Overview

Agent Qube is an interactive dashboard for a multi-agent AI system. It renders a real-time, zoomable hierarchy of 26 agents organized into 8 role groups across 5 layers (L0--L4), connected by 6 edge types. The system integrates a prompting library with 20 cognitive formulas, supports LLM-powered workflow execution via the Z.ai SDK, and streams agent status changes over WebSocket.

## Architecture

### 8 Role Groups

| Role Group     | Count | Agents                                          | Layer   |
|----------------|-------|-------------------------------------------------|---------|
| **Strategy**   | 3     | Architect, Analyst, Visionary                   | L0--L1  |
| **Tactics**    | 3     | Coordinator, Planner, Communicator              | L1--L2  |
| **Control**    | 3     | Inspector, Evaluator, Guard                     | L1--L2  |
| **Execution**  | 5     | Executor-A, Executor-B, Debugger, Tester, Coder | L2--L3  |
| **Memory**     | 3     | Archivist, RAG-Specialist, Context-Manager      | L2--L3  |
| **Monitoring** | 3     | Observer, Alert-Operator, Diagnostician         | L2--L3  |
| **Communication** | 3 | Gateway, Protocolist, Dispatcher                | L2--L3  |
| **Learning**   | 3     | Trainer, Adapter, Scorer                        | L3--L4  |

**Total: 26 agents, 8 groups, 5 hierarchy layers**

### 6 Edge Types

| Type          | Description                                    |
|---------------|------------------------------------------------|
| `command`     | Direct instruction from superior to subordinate |
| `sync`        | Bidirectional data synchronization between peers |
| `twin`        | Mirrored agent pair for redundancy              |
| `delegate`    | Task delegation across role groups              |
| `supervise`   | Oversight connection from controller to executor |
| `broadcast`   | One-to-many notification channel                |

### 20 Cognitive Formulas

CoT, ToT, GoT, CoVe, ReAct, Reflexion, ReWOO, MoA, and 12 more -- each mapped to specific agents via the `@stsgs/prompting` library.

### 3 Layout Modes

- **Radial** -- Center-out circular arrangement
- **Hierarchy (Dagre)** -- Directed acyclic graph auto-layout
- **Grid** -- Uniform grid placement

---

## Tech Stack

| Category        | Technology                                          |
|-----------------|-----------------------------------------------------|
| Framework       | Next.js 16 (App Router) + React 19                  |
| Language        | TypeScript 5 (strict)                               |
| Styling         | Tailwind CSS 4 + shadcn/ui (New York)               |
| Database        | Prisma ORM + SQLite                                 |
| Visualization   | React Flow (`@xyflow/react`) + Dagre + Recharts     |
| Animation       | Framer Motion                                       |
| State           | Zustand (client) + TanStack Query (server)          |
| Real-time       | Socket.IO (WebSocket mini-service, port 3003)       |
| AI Integration  | z-ai-web-dev-sdk (chat completions, resilience)     |
| Forms           | React Hook Form + Zod                               |
| Icons           | Lucide React                                        |

---

## Features

- **Interactive hierarchy visualization** -- Zoom, pan, fit-to-view, mini-map overview
- **3 layout modes** -- Radial, Hierarchy (Dagre), Grid
- **Real-time status transitions** via WebSocket (Socket.IO)
- **LLM-powered workflow execution** -- `/api/interpret-prompt` to `/api/workflows/execute-llm`
- **Agent CRUD** -- Create, edit, and delete agents from the UI
- **Search & filter** -- By name, role group, or skills with glow highlighting
- **Keyboard shortcuts** -- 1--8 group filter, 9 clear, Escape deselect
- **Context menus** -- Right-click for focus, expand, details, highlight connections
- **Detail panels** -- Agent info, tasks, cognitive formulas, skills
- **KPI strip** -- Real-time agent counts per status
- **Layer bands** -- L0--L4 visual hierarchy indicators
- **Connection strength** -- Stroke width + opacity visualization
- **7 theme presets** -- 3 dark (Champagne, Cyan Night, Zinc) + 4 light
- **Responsive design** -- Mobile-friendly layout

---

## Getting Started

### Prerequisites

- Node.js 20+ or [Bun](https://bun.sh)
- Git

### Installation

```bash
git clone https://github.com/stsgs1980/agent-qube.git
cd agent-qube
bun install
bun run db:push
bun run dev
```

Open the **Preview Panel** to view the application.

### Seed the Database

Populate the database with 26 agents, 26 tasks, and 8 role groups:

```bash
curl -X POST http://localhost:3000/api/seed
```

---

## Project Structure

```
src/
  app/                    # Next.js App Router pages and API routes
  components/
    hierarchy/            # Agent hierarchy visualization (24 files)
    workflows/            # Workflow pipeline (18 files)
    dashboard/            # Dashboard components (19 files)
    ui/                   # shadcn/ui base components (37 files)
  hooks/                  # Custom React hooks (14 hooks)
  lib/
    prompting/            # @stsgs/prompting library (5 modules, 21 files)
    db.ts                 # Prisma client singleton
  data/                   # Dashboard constants and layout recipes
prisma/
  schema.prisma           # 7 models (Agent, Task, Workflow, PipelineStep, ...)
mini-services/
  ws-service/             # WebSocket service (Socket.IO, port 3003)
```

---

## API Reference

### Hierarchy & Stats

| Endpoint             | Method | Description                        |
|----------------------|--------|------------------------------------|
| `/api/hierarchy`     | GET    | Full hierarchy tree with connections |
| `/api/stats`         | GET    | Aggregated dashboard statistics    |
| `/api/health`        | GET    | System health check                |
| `/api/seed`          | POST   | Seed database (26 agents + tasks)  |

### Agents

| Endpoint              | Method          | Description                      |
|-----------------------|-----------------|----------------------------------|
| `/api/agents`         | GET, POST       | List all / Create agent          |
| `/api/agents/[id]`   | GET, PUT, DELETE| Read / Update / Delete agent     |
| `/api/agents/prompt` | POST            | Generate system prompt for agent |

### Tasks

| Endpoint            | Method          | Description                   |
|---------------------|-----------------|-------------------------------|
| `/api/tasks`        | GET, POST       | List all / Create task        |
| `/api/tasks/[id]`  | GET, PUT, DELETE| Read / Update / Delete task   |

### Workflows

| Endpoint                      | Method | Description                                    |
|-------------------------------|--------|------------------------------------------------|
| `/api/workflows`              | GET, POST | List / Create workflows                     |
| `/api/workflows/[id]`        | GET, PUT, DELETE | Read / Update / Delete workflow       |
| `/api/workflows/execute`     | POST   | Execute workflow (step-by-step simulation)     |
| `/api/workflows/execute-llm` | POST   | Execute with real LLM calls + resilience       |
| `/api/workflows/seed`        | POST   | Seed sample workflows                          |

### Prompting & AI

| Endpoint               | Method | Description                                       |
|------------------------|--------|---------------------------------------------------|
| `/api/prompting`       | GET    | Prompting library (formulas, patterns, frameworks) |
| `/api/interpret-prompt`| POST   | AI prompt interpretation via z-ai-web-dev-sdk     |
| `/api/recipes`         | GET    | Layout recipes for the Layout Explorer             |

---

## @stsgs/prompting Library

Located at `src/lib/prompting/` with 5 modules across 21 files:

| Module          | Contents                                                         |
|-----------------|------------------------------------------------------------------|
| **core**        | Types, 20 techniques, 11 frameworks, 5-layer system-prompt architect |
| **templates**   | 12 intent templates, 12 agent role templates, 8 flow templates   |
| **evaluation**  | 6-dimension scoring (S/A/B/C/D/F), blind comparison, CORE-EEAT  |
| **agents**      | 20 cognitive formulas, 12 orchestration patterns, resilience     |
| **instructions**| 6 behavioral + 4 architectural instructions (inline)             |

---

## Design System

- **Background**: Black (`#000000`) -- nodes and edges "glow" against dark canvas
- **Accent**: Cyan (`#06B6D4`) -- monochrome + single color, no rainbow
- **Status colors**: Active=Cyan, Idle=Slate, Paused=Amber, Standby=Indigo, Error=Rose, Offline=Zinc
- **Glow effects**: Active nodes breathe with subtle pulsing animation
- **High contrast**: Everything reads instantly against the dark background

---

## Scripts

| Script             | Description                        |
|--------------------|------------------------------------|
| `bun run dev`      | Development server on port 3000    |
| `bun run build`    | Production build                   |
| `bun run lint`     | ESLint check                       |
| `bun run db:push`  | Push Prisma schema to database     |
| `bun run db:generate` | Generate Prisma client          |
| `bun run db:migrate`  | Run Prisma migrations            |
| `bun run db:reset`    | Reset database                   |

---

## License

[MIT](LICENSE)

Built with: Next.js 15 + TypeScript + Tailwind CSS + Prisma
