/**
 * @stsgs/prompting -- AI Rules (Architectural)
 * 4 architectural rule entries: core, enforcement, library, project.
 */

import type { InstructionEntry } from './instructions-types'

export const AI_RULES: InstructionEntry[] = [
  {
    id: 'ai-rules-core',
    title: 'Agent Qube AI Rules (Core)',
    category: 'ai-rules',
    description: 'Agent Qube core rules: 26 agents, 8 role groups, 6 connection types, 5 hierarchy layers, anti-monolith rules, import patterns, tech stack.',
    version: '2.0.0',
    keywords: ['architecture', 'agents', 'hierarchy', 'anti-monolith', 'agent-qube', 'import-patterns'],
    lineCount: 140,
    content: `# Agent Qube -- AI Rules (Core)

## Product: Agent Qube (Prompt-based Multi-Agent System)
Multi-Agent System Dashboard with 26 AI agents across 8 role groups.
Three views: Dashboard, Agent Hierarchy (React Flow + Dagre), Workflow Pipeline.

## 26 Agents / 8 Role Groups
- Strategy: Architect, Analyst, Visionary
- Tactics: Coordinator, Planner, Communicator
- Control: Inspector, Evaluator, Guard
- Execution: Executor-A, Executor-B, Debugger, Tester
- Memory: Archivist, Observer, Diagnostician
- Monitoring: Gateway, Protocolist, Dispatcher
- Communication: Trainer, Scorer, Coder
- Learning: Context-Manager, RAG-Specialist, Alert-Operator, Adapter

## 6 Connection Types
command, sync, twin, delegate, supervise, broadcast

## 5 Hierarchy Layers (DAG)
L0: Strategy | L1: Tactics | L2: Control | L3: Execution | L4: Memory/Monitoring/Communication/Learning

## Anti-Monolith Rules (7 Rules)
1. Line Limits: component <= 150 lines, any file <= 200, page.tsx <= 40
2. Max useState: 3 per component, extract to custom hook if more
3. Component Doesn't Fetch Data: data via hooks or props only
4. Barrel Exports: import from barrel, not individual files
5. Layer Separation: components/, hooks/, lib/ separation
6. Static Imports: use ES module imports (NOT next/dynamic with Turbopack)
7. Enforce with Tooling: ESLint + anti-monolith rules

## Import Patterns
\`\`\`typescript
import { AgentNode } from '@/components/hierarchy/agent-node'
import { WorkflowCard } from '@/components/workflows/workflow-card'
import { db } from '@/lib/db'
import { fetchWithRetry } from '@/lib/client-fetch'
\`\`\`

## Tech Stack
Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, Prisma SQLite, React Flow, Framer Motion, Zustand`,
  },
  {
    id: 'ai-rules-enforcement',
    title: 'Code Enforcement Rules',
    category: 'ai-rules',
    description: 'Anti-monolith enforcement: max-lines (200), max-use-state (3), no-inline-styles. ESLint configuration for Agent Qube.',
    version: '2.0.0',
    keywords: ['eslint', 'enforcement', 'linting', 'anti-monolith', 'max-lines'],
    lineCount: 37,
    content: `# Code Enforcement Rules

## Anti-Monolith Rules

### max-lines
Severity: warning. Max 200 lines per file (configurable). Exclude: *.test.tsx, *.stories.tsx

### max-use-state
Severity: warning. Max 3 useState per component. Suggests custom hooks.

### no-inline-styles
Prefer Tailwind CSS classes over inline styles where possible.

## Configuration
\`\`\`javascript
export default [{
  rules: {
    'max-lines': ['warn', { max: 200 }],
    'max-use-state': ['warn', { max: 3 }],
  },
}]
\`\`\``,
  },
  {
    id: 'ai-rules-library',
    title: 'Agent Qube Component Rules',
    category: 'ai-rules',
    description: 'Component quality checklist (10 items), adding new components workflow (7 steps), Agent Qube component categories.',
    version: '2.0.0',
    keywords: ['components', 'quality', 'checklist', 'agent-qube', 'library'],
    lineCount: 40,
    content: `# Agent Qube Component Rules

## Component Quality Checklist
- TypeScript interface for all props (no any)
- JSDoc comment describing the component
- Uses cn() for className merging
- Correct directory: hierarchy/, workflows/, or ui/
- Has barrel export in index.ts
- File <= 200 lines (components <= 150)
- No inline styles (Tailwind CSS preferred)
- Supports className prop for customization
- Uses forwardRef where DOM access needed
- Accessible: proper ARIA, keyboard navigation

## Adding New Components
1. Identify correct directory (hierarchy/, workflows/, ui/)
2. Create file with TypeScript props interface + JSDoc
3. Add barrel export in index.ts
4. Run bun run lint to verify
5. Test in dev server

## Component Categories
| Category | Directory | Has State? |
|----------|-----------|------------|
| Agent Hierarchy | components/hierarchy/ | Yes |
| Workflow Pipeline | components/workflows/ | Yes |
| UI Primitives | components/ui/ | No |
| Custom Hooks | hooks/ | Yes |
| Utilities | lib/ | No |`,
  },
  {
    id: 'ai-rules-project',
    title: 'Project-Specific AI Rules Template',
    category: 'ai-rules',
    description: 'Template for project-specific AI rules: stack definition (Next.js 16, Agent Qube, Tailwind CSS 4, TypeScript), custom rules, structure, API endpoints, environment variables.',
    version: '2.0.0',
    keywords: ['project-template', 'stack', 'configuration', 'api-endpoints', 'env-vars'],
    lineCount: 24,
    content: `# Project-Specific AI Rules Template

## Stack
- Framework: Next.js 16 (App Router)
- UI Library: shadcn/ui + Tailwind CSS 4
- Database: Prisma + SQLite
- Visualization: React Flow + Dagre
- Language: TypeScript (strict)

## Sections
- Custom Rules: project-specific behavioral rules
- Project Structure: directory layout
- API Endpoints: /api/agents, /api/tasks, /api/hierarchy, /api/stats, /api/health
- Environment Variables: required env vars (names only, never values)`,
  },
]
