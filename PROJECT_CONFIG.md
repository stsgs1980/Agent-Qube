# Project Configuration

> Project-specific settings for P-MAS-v2.
> This file is NOT part of the toolkit standards -- it is created per project.
>
> Toolkit version: v1.8.3

---

## Stack Signature

```
Built with: Next.js 16 + TypeScript + Tailwind CSS
```

> Full stack: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui + Prisma SQLite + React Flow + Dagre + Framer Motion + Zustand

---

## Dev Server

| Setting | Value |
|---------|-------|
| Command | `npx next dev -p 3000` |
| Health check | `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000` |
| Host | `127.0.0.1` (NOT `localhost`) |
| Startup wait | 6 seconds (Turbopack compile time) |
| Output redirect | `</dev/null >/tmp/zdev.log 2>&1 &` |

### Error Handling

| Response | Action |
|----------|--------|
| 200 | Server running, proceed |
| 000 | Server down, restart with `dev-watchdog` skill |
| 500 | Server error, check logs, fix error, then restart |

---

## Project Paths

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router entry points and routes |
| `src/components/hierarchy/` | Agent Hierarchy (React Flow + Dagre DAG) |
| `src/components/workflows/` | Workflow Pipeline (CRUD, execution) |
| `src/components/dashboard/` | Dashboard components (stats, KPIs) |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Utilities, Prisma client, API helpers |
| `src/lib/prompting/` | @stsgs/prompting library |
| `src/data/` | Dashboard configuration constants |
| `prisma/` | Database schema and seed |
| `mini-services/ws-service/` | WebSocket service (port 3003) |
| `instructions/` | Agent behavioral instructions |
| `skills/` | Automated agent skills |
| `standards/` | Governance documents (Group B) |
| `templates/` | Operational templates (Group A) |

---

## Component Library

- Use **shadcn/ui** components, do not build from scratch
- TypeScript throughout with strict typing
- Anti-monolith: component max 150 lines, file max 200 lines

---

## Environment Variables

All environment variables must be documented in `.env.example`
per `REPRODUCIBILITY-STANDARD`.

See `.env.example`:
```env
DATABASE_URL="file:./db/dev.db"
```

---

## Notes

- This file is the single source of truth for project-specific configuration
- When switching to a different stack, update only this file
- AGENT_RULES.md references this file for all project-dependent settings
