# Changelog

All notable changes to P-MAS-v2 (Multi-Agent System Dashboard & Hierarchy Visualization) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] — 2025-06-15

### Changed

- Renamed all 26 agents from transliterated Russian to proper English (Arkhitektor → Architect, Analitik → Analyst, Strateg → Strategist, Taktik → Tactician, Kontroller → Controller, Ispolnitel → Executor, and 20 more)
- Replaced all Russian `roleGroup` names with English equivalents (Стратегия → Strategy, Тактика → Tactics, Контроль → Control, Исполнение → Execution, Аналитика → Analytics, Инновации → Innovation, Поддержка → Support, Исследования → Research) across 16+ files (schema, seed data, sidebar, hierarchy, API routes, constants)
- Replaced `next/dynamic` imports with static imports to fix `ChunkLoadError` caused by Turbopack incompatibility with dynamic imports in Next.js 16

### Fixed

- Agent name mismatch: 12 of 26 names in frontend `AGENT_LIST` did not match database entries — all 26 now consistent
- Status counts displayed incorrectly (showed 16 active agents instead of 21) — counts now derived from live `/api/stats` endpoint
- Server crash after database schema changes — resolved by running `prisma db push` and reseeding

## [0.2.0] — 2025-06-14

### Added

- Workflow Pipeline: CRUD operations for workflows, pipeline steps, and executions; status management (draft/active/paused/archived); trigger types (manual/event/schedule/webhook/agent); execution tracking with per-step status and agent messages
- Agent Hierarchy v2: React Flow + Dagre auto-layout replacing the old hand-rolled radial SVG renderer
- 5-layer DAG structure (L0–L4) with 6 connection types (hierarchy, twin, delegation, collaboration, supervision, data-flow)
- Sidebar with group filtering, agent stats, and connection legend
- Detail panel showing selected agent info, tasks, cognitive formulas, and skills
- Search with glow highlighting and match count
- Keyboard shortcuts: 1–8 for group filter, 9 to clear, Escape to deselect
- Context menu on right-click (focus, expand, details, highlight connections)
- KPI strip with real-time agent counts per status

### Changed

- Migrated from custom SVG/Canvas rendering to React Flow for the hierarchy view
- Split monolith `agent-hierarchy.tsx` (3,511 lines) into modular components compliant with anti-monolith rules (component ≤ 150 lines, max 3 `useState`)
- Split `workflow-pipeline.tsx` (2,552 lines) into anti-monolith compliant modules (PipelineCanvas, PipelineSidebar, StepDetailPanel, WorkflowList, ExecutionTracker, etc.)

## [0.1.0] — 2025-06-12

### Added

- P-MAS Dashboard with 26 agents across 8 role groups (Strategy, Tactics, Control, Execution, Analytics, Innovation, Support, Research)
- Dark theme design system (#000000 background, Cyan #06B6D4 accent, monochrome + single color)
- Quick Stats row with `AnimatedCounter` and `MiniSparkline` components
- Status Distribution chart with semantic color mapping (Active=Cyan, Idle=Slate, Paused=Amber, Standby=Indigo, Error=Rose, Offline=Zinc)
- Agent sidebar with search and group filtering
- Prisma schema with `Agent` and `Task` models (hierarchy + twin relations)
- SQLite database seeded with 26 agents and 26 tasks
- API endpoints:
  - `GET/POST /api/agents` — List and create agents
  - `GET/PUT/DELETE /api/agents/[id]` — Read, update, delete agent
  - `GET /api/tasks` — List tasks
  - `GET /api/hierarchy` — Tree-structured hierarchy data
  - `GET /api/stats` — Dashboard aggregated data (8 computed sections)
  - `GET /api/health` — System health check
  - `POST /api/seed` — Database seeding/reset
- Anti-monolith enforcement: component ≤ 150 lines, max 3 `useState` per component, no direct `fetch` in components
- No-Unicode Policy: SVG icons only, no emoji in source code
- AI rules for 4 platforms (Cursor `.cursorrules`, Claude `CLAUDE.md`, Zcode `.zcode/rules.md`, Copilot `.github/copilot-instructions.md`)
