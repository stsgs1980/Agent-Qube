# Agent Qube Roadmap

> Multi-Agent System Dashboard & Hierarchy Visualization

## Status Legend
- [OK] Done
- [!!] In Progress / Priority
- [..] Planned
- [ ] Backlog

---

## Phase 1: UI/UX Core (COMPLETE)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1.1 | Quick Stats row collapsible | HIGH | [OK] |
| 1.2 | Fix Legend/Stats overlap in hierarchy view | HIGH | [OK] |
| 1.3 | Compact header redesign | HIGH | [OK] |
| 1.4 | Sidebar layout (collapsible, no floating overlays) | HIGH | [OK] |
| 1.5 | W1280 centered layout (dashboard + hierarchy) | HIGH | [OK] |

## Phase 2: Visual & Design System (COMPLETE)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 2.1 | Monochrome Cyan design system (#06B6D4) | HIGH | [OK] |
| 2.2 | AnimatedCounter, MiniSparkline, CollapsibleSection components | MEDIUM | [OK] |
| 2.3 | Status colors semantic mapping (Active=Cyan, Idle=Slate, Paused=Amber, Standby=Indigo, Error=Rose, Offline=Zinc) | MEDIUM | [OK] |
| 2.4 | Node right-click context menu | MEDIUM | [OK] |
| 2.5 | Connection strength visualization (stroke width + opacity) | MEDIUM | [OK] |
| 2.6 | Search glow + match count | MEDIUM | [OK] |
| 2.7 | Fit/Focus/Layout/Layers toolbar | MEDIUM | [OK] |
| 2.8 | L0-L4 layer bands visualization | MEDIUM | [OK] |

## Phase 3: Data Layer (COMPLETE)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 3.1 | /api/stats endpoint (8 computed sections from DB) | HIGH | [OK] |
| 3.2 | Dashboard migration: hardcoded → /api/stats with fallbacks | HIGH | [OK] |
| 3.3 | Add Agent modal (POST /api/agents) | HIGH | [OK] |
| 3.4 | Agent hierarchy 100% API-driven (/api/hierarchy) | HIGH | [OK] |
| 3.5 | Prisma schema: Agent + Task + hierarchy/twin relations | HIGH | [OK] |
| 3.6 | DB seeded: 26 agents, 26 tasks, 8 role groups | HIGH | [OK] |

## Phase 4: Animation & Interaction (IN PROGRESS)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 4.1 | Connection flow animation (edges "flow" -- particles/dots moving along paths) | HIGH | [OK] |
| 4.2 | Node depth/3D shadow effects | MEDIUM | [..] |
| 4.3 | Pulsing concentric waves from central node | LOW | [ ] |
| 4.4 | Semi-transparent cluster backgrounds for role groups | LOW | [ ] |

## Phase 5: Real-Time & CRUD (IN PROGRESS)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 5.1 | WebSocket real-time agent status updates | HIGH | [OK] |
| 5.2 | Edit agents from UI (PATCH /api/agents/[id] + edit form + toast) | HIGH | [OK] |
| 5.3 | Delete agents from UI | MEDIUM | [OK] |
| 5.4 | Task management from UI | LOW | [ ] |
| 5.5 | Interactive formula dependency explorer | LOW | [ ] |

## Phase 6: Quality & Production (PLANNED)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 6.1 | Agent name unification (all 26 agents renamed to English) | HIGH | [OK] |
| 6.2 | Export dashboard as PDF/image | LOW | [ ] |
| 6.3 | Mobile-responsive improvements | MEDIUM | [..] |
| 6.4 | Performance optimization (large agent counts) | LOW | [ ] |
| 6.5 | Authentication (NextAuth.js v4) | LOW | [ ] |

## Known Issues

- **Agent names**: All 26 agents unified to English names (previously 12/26 mismatched)
- **Dev server stability**: Process killed periodically in sandbox environment
- **Real-time status transitions**: WebSocket pushes status changes from ws-service every 10-15s; client fallback when disconnected

## Architecture

```
Frontend (Next.js 16 + React 19)
├── / (Dashboard) — page.tsx
├── /hierarchy (Agent Hierarchy) — agent-hierarchy-v2.tsx (static import)
├── API Routes
│   ├── /api/agents — CRUD
│   ├── /api/tasks — CRUD
│   ├── /api/hierarchy — Tree data
│   ├── /api/stats — Dashboard aggregated data
│   ├── /api/health — System health
│   └── /api/seed — Database seeding
├── Mini Services
│   └── ws-service (port 3003) — WebSocket real-time
└── Database (SQLite + Prisma)
    ├── Agent (26 records)
    └── Task (26 records)
```

## Design Principles

- Dark background (#000000) — graphs "glow" on black
- Monochrome + one accent color (Cyan #06B6D4) — no rainbow
- Radial/hierarchical layout — structure over chaos
- Glow effects — nodes "breathe", not flat circles
- Thin, semi-transparent edges — edges don't dominate
- High contrast — everything reads instantly
- Minimalism — no decoration, data-first
