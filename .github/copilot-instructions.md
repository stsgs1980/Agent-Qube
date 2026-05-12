# GitHub Copilot Instructions — @stsgs/ui Project

> Auto-generated from ai-rules/core.md by `npx stsgs ai sync`

## Architecture
6-layer dependency direction: tokens/ → ui/ → sections/ → features/ → hooks/ → providers/
NEVER import from upper layer to lower.

## Anti-Monolith Rules
1. Component ≤ 150 lines, File ≤ 200 lines, Page ≤ 40 lines
2. Max 3 useState per component → extract to hook
3. Component doesn't fetch data → props only
4. Barrel exports for every module
5. Layer separation enforced by eslint-plugin-stsgs
6. Dynamic imports for heavy deps
7. ESLint enforcement active

## Component Discovery
Before creating a component: `npx stsgs list [layer]`
Add existing: `npx stsgs add <component>`
DO NOT recreate existing components.

## Import Patterns
- `import { Button } from '@stsgs/ui'`
- `import { HeroSection } from '@stsgs/ui/sections'`
- `import { useTheme } from '@stsgs/ui/hooks'`
- `import { cn } from '@stsgs/ui/tokens'`

## Stack: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Radix UI
