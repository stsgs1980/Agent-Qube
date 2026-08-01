# Agent-Qube Promo Video — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a 30-60 second motion-graphics promo video for Agent-Qube using Remotion, showcasing the agent hierarchy, workflow pipeline, and real-time monitoring — styled after Fuselab's Control AI Policy Platform demo.

**Architecture:** Remotion as a separate package (`packages/promo-video/`) in the pnpm workspace. Video composed of 5 scenes with smooth camera transitions, glowing nodes, animated connection lines, and glassmorphism cards. Renders to MP4 at 1920x1080 30fps.

**Tech Stack:** Remotion 4.x, React 19, TypeScript 5, Framer Motion (for component animations), Tailwind CSS 4 (for card styling)

---

## File Structure

```
packages/promo-video/
├── package.json
├── remotion.config.ts
├── tsconfig.json
├── src/
│   ├── Root.tsx                    # Remotion entry, defines compositions
│   ├── Video.tsx                   # Main video component, scene sequencing
│   ├── scenes/
│   │   ├── IntroScene.tsx          # Logo reveal + title (0-5s)
│   │   ├── HierarchyScene.tsx      # Agent graph flythrough (5-15s)
│   │   ├── WorkflowScene.tsx       # Pipeline animation (15-25s)
│   │   ├── StatsScene.tsx          # Dashboard metrics (25-35s)
│   │   └── OutroScene.tsx          # CTA + logo (35-40s)
│   ├── components/
│   │   ├── AgentNode.tsx           # Glowing sphere node
│   │   ├── ConnectionLine.tsx      # Animated bezier curves
│   │   ├── MetricCard.tsx          # Glassmorphism stat card
│   │   ├── GlowEffect.tsx         # Cyan glow aura
│   │   └── ParallaxLayer.tsx       # Depth effect
│   ├── lib/
│   │   ├── agents-data.ts          # Static agent hierarchy data
│   │   ├── animations.ts          # Shared spring/timing configs
│   │   └── colors.ts              # Design tokens (#06B6D4 accent)
│   └── types.ts
├── out/                            # Rendered videos (gitignored)
└── .gitignore
```

---

## Task 1: Scaffold Remotion Package

**Files:**
- Create: `packages/promo-video/package.json`
- Create: `packages/promo-video/tsconfig.json`
- Create: `packages/promo-video/remotion.config.ts`
- Create: `packages/promo-video/src/Root.tsx`
- Create: `packages/promo-video/src/Video.tsx`
- Modify: `pnpm-workspace.yaml` (no change needed, already has `packages/*`)

**Interfaces:**
- Consumes: None (first task)
- Produces: `Root.tsx` exports `RemotionRoot` composition

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@agent-qube/promo-video",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "studio": "remotion studio src/index.ts",
    "render": "remotion render src/index.ts PromoVideo out/promo.mp4",
    "preview": "remotion preview src/index.ts"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create remotion.config.ts**

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
```

- [ ] **Step 4: Create src/index.ts**

```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
```

- [ ] **Step 5: Create src/Root.tsx**

```tsx
import { Composition } from "remotion";
import { Video } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PromoVideo"
      component={Video}
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

- [ ] **Step 6: Create src/Video.tsx (placeholder)**

```tsx
import { AbsoluteFill } from "remotion";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Scenes will be added in subsequent tasks */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 7: Install dependencies**

Run: `cd packages/promo-video && pnpm install`

- [ ] **Step 8: Verify studio launches**

Run: `cd packages/promo-video && pnpm run studio`
Expected: Opens browser at localhost:3000 with blank black composition

- [ ] **Step 9: Commit**

```bash
git add packages/promo-video/
git commit -m "feat: scaffold Remotion promo-video package"
```

---

## Task 2: Design Tokens & Agent Data

**Files:**
- Create: `packages/promo-video/src/lib/colors.ts`
- Create: `packages/promo-video/src/lib/animations.ts`
- Create: `packages/promo-video/src/lib/agents-data.ts`
- Create: `packages/promo-video/src/types.ts`

**Interfaces:**
- Consumes: None
- Produces: Constants used by all scenes and components

- [ ] **Step 1: Create src/types.ts**

```ts
export interface AgentNode {
  id: string;
  name: string;
  role: string;
  group: RoleGroup;
  x: number;
  y: number;
  connections: string[];
}

export type RoleGroup =
  | "strategy"
  | "tactics"
  | "control"
  | "execution"
  | "memory"
  | "monitoring"
  | "communication"
  | "learning";

export interface MetricCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}
```

- [ ] **Step 2: Create src/lib/colors.ts**

```ts
export const colors = {
  background: "#000000",
  accent: "#06B6D4",
  accentGlow: "rgba(6, 182, 212, 0.4)",
  surface: "rgba(255, 255, 255, 0.05)",
  surfaceBorder: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  groupColors: {
    strategy: "#F472B6",
    tactics: "#A78BFA",
    control: "#34D399",
    execution: "#60A5FA",
    memory: "#FBBF24",
    monitoring: "#F87171",
    communication: "#2DD4BF",
    learning: "#FB923C",
  } as Record<RoleGroup, string>,
} as const;
```

- [ ] **Step 3: Create src/lib/animations.ts**

```ts
export const spring = {
  default: { damping: 20, stiffness: 100, mass: 0.8 },
  gentle: { damping: 30, stiffness: 80, mass: 1 },
  snappy: { damping: 15, stiffness: 200, mass: 0.5 },
} as const;

export const timing = {
  fast: 10,
  normal: 20,
  slow: 40,
} as const;

export const ease = {
  inOut: [0.4, 0, 0.2, 1],
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
} as const;
```

- [ ] **Step 4: Create src/lib/agents-data.ts**

```ts
import type { AgentNode } from "../types";

export const agents: AgentNode[] = [
  { id: "architect", name: "Architect", role: "System Design", group: "strategy", x: 960, y: 300, connections: ["planner", "analyst"] },
  { id: "analyst", name: "Analyst", role: "Data Analysis", group: "strategy", x: 700, y: 200, connections: ["coder"] },
  { id: "visionary", name: "Visionary", role: "Future Planning", group: "strategy", x: 1200, y: 200, connections: ["architect"] },
  { id: "coordinator", name: "Coordinator", role: "Task Distribution", group: "tactics", x: 960, y: 500, connections: ["executor-a", "executor-b"] },
  { id: "planner", name: "Planner", role: "Step Planning", group: "tactics", x: 700, y: 450, connections: ["coordinator"] },
  { id: "communicator", name: "Communicator", role: "Agent Messaging", group: "communication", x: 1200, y: 450, connections: ["coordinator"] },
  { id: "inspector", name: "Inspector", role: "Code Review", group: "control", x: 400, y: 500, connections: ["guard"] },
  { id: "evaluator", name: "Evaluator", role: "Quality Check", group: "control", x: 400, y: 650, connections: ["inspector"] },
  { id: "guard", name: "Guard", role: "Security Audit", group: "control", x: 250, y: 575, connections: [] },
  { id: "executor-a", name: "Executor A", role: "Task Execution", group: "execution", x: 800, y: 700, connections: ["tester"] },
  { id: "executor-b", name: "Executor B", role: "Task Execution", group: "execution", x: 1100, y: 700, connections: ["tester"] },
  { id: "debugger", name: "Debugger", role: "Error Resolution", group: "execution", x: 960, y: 800, connections: ["executor-a", "executor-b"] },
  { id: "tester", name: "Tester", role: "Test Writing", group: "execution", x: 960, y: 650, connections: ["evaluator"] },
  { id: "archivist", name: "Archivist", role: "Memory Storage", group: "memory", x: 1500, y: 400, connections: ["context-manager"] },
  { id: "observer", name: "Observer", role: "System Monitoring", group: "monitoring", x: 1500, y: 600, connections: ["diagnostician"] },
  { id: "diagnostician", name: "Diagnostician", role: "Issue Analysis", group: "monitoring", x: 1650, y: 500, connections: [] },
  { id: "gateway", name: "Gateway", role: "API Gateway", group: "communication", x: 250, y: 350, connections: ["protocolist"] },
  { id: "protocolist", name: "Protocolist", role: "Protocol Design", group: "communication", x: 250, y: 250, connections: [] },
  { id: "dispatcher", name: "Dispatcher", role: "Event Routing", group: "tactics", x: 500, y: 300, connections: ["coordinator"] },
  { id: "trainer", name: "Trainer", role: "Model Training", group: "learning", x: 700, y: 850, connections: ["scorer"] },
  { id: "scorer", name: "Scorer", role: "Performance Scoring", group: "learning", x: 960, y: 900, connections: [] },
  { id: "coder", name: "Coder", role: "Code Generation", group: "execution", x: 500, y: 150, connections: ["architect"] },
  { id: "context-manager", name: "Context Manager", role: "Context Tracking", group: "memory", x: 1650, y: 300, connections: [] },
  { id: "rag-specialist", name: "RAG Specialist", role: "Retrieval Augmented", group: "memory", x: 1500, y: 250, connections: ["context-manager"] },
  { id: "alert-operator", name: "Alert Operator", role: "Alert Management", group: "monitoring", x: 1650, y: 650, connections: ["observer"] },
  { id: "adapter", name: "Adapter", role: "Environment Adaptation", group: "learning", x: 500, y: 850, connections: ["trainer"] },
];

export const stats = {
  totalAgents: 26,
  activeWorkflows: 12,
  tasksCompleted: 1847,
  uptime: 99.7,
};
```

- [ ] **Step 5: Commit**

```bash
git add packages/promo-video/src/types.ts packages/promo-video/src/lib/
git commit -m "feat: add design tokens and agent data for promo video"
```

---

## Task 3: Core Visual Components

**Files:**
- Create: `packages/promo-video/src/components/AgentNode.tsx`
- Create: `packages/promo-video/src/components/ConnectionLine.tsx`
- Create: `packages/promo-video/src/components/MetricCard.tsx`
- Create: `packages/promo-video/src/components/GlowEffect.tsx`
- Create: `packages/promo-video/src/components/ParallaxLayer.tsx`

**Interfaces:**
- Consumes: `colors`, `spring` from lib, `AgentNode` type
- Produces: Reusable visual components for all scenes

- [ ] **Step 1: Create src/components/GlowEffect.tsx**

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

interface GlowEffectProps {
  x: number;
  y: number;
  color: string;
  size?: number;
  intensity?: number;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  x, y, color, size = 200, intensity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 60, [0, 30, 60], [0.8, 1.2, 0.8]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size * pulse,
        height: size * pulse,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />
  );
};
```

- [ ] **Step 2: Create src/components/AgentNode.tsx**

```tsx
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../lib/colors";
import { GlowEffect } from "./GlowEffect";
import type { AgentNode as AgentNodeType } from "../types";

interface AgentNodeProps {
  agent: AgentNodeType;
  enterFrame: number;
  size?: number;
}

export const AgentNode: React.FC<AgentNodeProps> = ({
  agent, enterFrame, size = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - enterFrame;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.5 },
  });

  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const color = colors.groupColors[agent.group];

  return (
    <div style={{ position: "absolute", left: agent.x, top: agent.y, opacity }}>
      <GlowEffect x={0} y={0} color={color} size={size * 3} intensity={0.3} />
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
          border: `2px solid ${color}`,
          transform: `scale(${scale})`,
          boxShadow: `0 0 20px ${color}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, #ffffff44, transparent)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: size + 8,
          left: "50%",
          transform: "translateX(-50%)",
          color: colors.textPrimary,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {agent.name}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create src/components/ConnectionLine.tsx**

```tsx
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { colors } from "../lib/colors";

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  enterFrame: number;
  duration?: number;
  color?: string;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1, y1, x2, y2, enterFrame, duration = 30, color = colors.accent,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - enterFrame;

  const progress = interpolate(relativeFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.2;

  const path = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  const pathLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.2;

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id={`grad-${x1}-${y1}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="50%" stopColor={color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={color} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#grad-${x1}-${y1})`}
        strokeWidth={2}
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - progress)}
        opacity={progress}
      />
    </svg>
  );
};
```

- [ ] **Step 4: Create src/components/MetricCard.tsx**

```tsx
import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { colors } from "../lib/colors";

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  enterFrame: number;
  x: number;
  y: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, suffix = "", enterFrame, x, y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - enterFrame;

  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const countUp = interpolate(relativeFrame, [10, 50], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        opacity,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${colors.surfaceBorder}`,
        borderRadius: 16,
        padding: "20px 28px",
        minWidth: 180,
      }}
    >
      <div style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: colors.textPrimary, fontSize: 36, fontWeight: 700 }}>
        {Math.round(countUp)}
        <span style={{ color: colors.accent, fontSize: 20, marginLeft: 4 }}>{suffix}</span>
      </div>
    </div>
  );
};
```

- [ ] **Step 5: Create src/components/ParallaxLayer.tsx**

```tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth: number;
  centerX?: number;
  centerY?: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children, depth, centerX = 960, centerY = 540,
}) => {
  const frame = useCurrentFrame();

  const offsetX = interpolate(frame, [0, 1200], [0, -50 * depth], {
    extrapolateRight: "clamp",
  });

  const offsetY = interpolate(frame, [0, 1200], [0, -20 * depth], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(depth, [0, 2], [1, 0.8]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        transformOrigin: `${centerX}px ${centerY}px`,
      }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 6: Commit**

```bash
git add packages/promo-video/src/components/
git commit -m "feat: add core visual components (AgentNode, GlowEffect, MetricCard)"
```

---

## Task 4: Intro Scene — Logo Reveal

**Files:**
- Create: `packages/promo-video/src/scenes/IntroScene.tsx`
- Modify: `packages/promo-video/src/Video.tsx`

**Interfaces:**
- Consumes: `colors` from lib
- Produces: First 5 seconds of video

- [ ] **Step 1: Create src/scenes/IntroScene.tsx**

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing, AbsoluteFill } from "remotion";
import { colors } from "../lib/colors";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });

  const titleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = interpolate(frame, [0, 60, 120], [0, 0.8, 0.4], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}${Math.round(glowIntensity * 60).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Logo cube */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          width: 120,
          height: 120,
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}88)`,
          borderRadius: 24,
          boxShadow: `0 0 60px ${colors.accent}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            border: `3px solid ${colors.textPrimary}`,
            borderRadius: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            padding: 8,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                background: colors.textPrimary,
                borderRadius: 4,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          opacity: titleOpacity,
          color: colors.textPrimary,
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        Agent<span style={{ color: colors.accent }}>Qube</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "63%",
          transform: "translate(-50%, -50%)",
          opacity: subtitleOpacity,
          color: colors.textSecondary,
          fontSize: 22,
          fontWeight: 400,
        }}
      >
        Multi-Agent System Dashboard
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Update src/Video.tsx with scene sequencing**

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      {/* HierarchyScene will be added in Task 5 */}
      {/* WorkflowScene will be added in Task 6 */}
      {/* StatsScene will be added in Task 7 */}
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Preview intro scene**

Run: `cd packages/promo-video && pnpm run studio`
Expected: Logo fades in with glow, title appears, subtitle fades in

- [ ] **Step 4: Commit**

```bash
git add packages/promo-video/src/scenes/IntroScene.tsx packages/promo-video/src/Video.tsx
git commit -m "feat: add intro scene with logo reveal animation"
```

---

## Task 5: Hierarchy Scene — Agent Graph Flythrough

**Files:**
- Create: `packages/promo-video/src/scenes/HierarchyScene.tsx`
- Modify: `packages/promo-video/src/Video.tsx`

**Interfaces:**
- Consumes: `AgentNode`, `ConnectionLine`, `GlowEffect`, `agents` data
- Produces: 10-second scene with camera flying through agent graph

- [ ] **Step 1: Create src/scenes/HierarchyScene.tsx**

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { colors } from "../lib/colors";
import { agents } from "../lib/agents-data";
import { AgentNode } from "../components/AgentNode";
import { ConnectionLine } from "../components/ConnectionLine";

export const HierarchyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera movement - fly from top-left to center
  const cameraX = interpolate(frame, [0, 300], [200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const cameraY = interpolate(frame, [0, 300], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const cameraScale = interpolate(frame, [0, 300], [0.7, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Generate connections from agent data
  const connections = agents.flatMap((agent) =>
    agent.connections.map((targetId) => {
      const target = agents.find((a) => a.id === targetId);
      if (!target) return null;
      return { x1: agent.x, y1: agent.y, x2: target.x, y2: target.y };
    }).filter(Boolean)
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `translate(${cameraX}px, ${cameraY}px) scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Connection lines appear first */}
        {connections.map((conn, i) => (
          <ConnectionLine
            key={`conn-${i}`}
            x1={conn!.x1}
            y1={conn!.y1}
            x2={conn!.x2}
            y2={conn!.y2}
            enterFrame={i * 3}
            duration={40}
          />
        ))}

        {/* Agent nodes appear after lines */}
        {agents.map((agent, i) => (
          <AgentNode
            key={agent.id}
            agent={agent}
            enterFrame={20 + i * 5}
            size={36}
          />
        ))}
      </div>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: colors.accent, fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
          AGENT HIERARCHY
        </div>
        <div style={{ color: colors.textPrimary, fontSize: 48, fontWeight: 700, marginTop: 8 }}>
          26 Intelligent Agents
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 18, marginTop: 4 }}>
          8 Role Groups • Real-time Collaboration
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add HierarchyScene to Video.tsx**

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <HierarchyScene />
      </Sequence>
      {/* WorkflowScene will be added in Task 6 */}
      {/* StatsScene will be added in Task 7 */}
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Preview hierarchy scene**

Run: `cd packages/promo-video && pnpm run studio`
Expected: Camera flies in, lines animate in, nodes pop in with glow

- [ ] **Step 4: Commit**

```bash
git add packages/promo-video/src/scenes/HierarchyScene.tsx packages/promo-video/src/Video.tsx
git commit -m "feat: add hierarchy scene with agent graph flythrough"
```

---

## Task 6: Workflow Scene — Pipeline Animation

**Files:**
- Create: `packages/promo-video/src/scenes/WorkflowScene.tsx`
- Modify: `packages/promo-video/src/Video.tsx`

**Interfaces:**
- Consumes: `MetricCard`, `colors`, `spring`
- Produces: 10-second workflow pipeline scene

- [ ] **Step 1: Create src/scenes/WorkflowScene.tsx**

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing, AbsoluteFill } from "remotion";
import { colors } from "../lib/colors";

const steps = [
  { label: "Plan", icon: "?" },
  { label: "Execute", icon: "?" },
  { label: "Review", icon: "?" },
  { label: "Deploy", icon: "?" },
];

export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: colors.accent, fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
          WORKFLOW PIPELINE
        </div>
        <div style={{ color: colors.textPrimary, fontSize: 48, fontWeight: 700, marginTop: 8 }}>
          Automated Execution
        </div>
      </div>

      {/* Pipeline steps */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 40,
          alignItems: "center",
        }}
      >
        {steps.map((step, i) => {
          const enterFrame = 20 + i * 25;
          const relativeFrame = frame - enterFrame;

          const scale = spring({
            frame: relativeFrame,
            fps,
            config: { damping: 15, stiffness: 200, mass: 0.5 },
          });

          const glowActive = relativeFrame > 30 && relativeFrame < 80;

          return (
            <React.Fragment key={step.label}>
              <div
                style={{
                  transform: `scale(${scale})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    background: glowActive
                      ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}88)`
                      : colors.surface,
                    border: `2px solid ${glowActive ? colors.accent : colors.surfaceBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    boxShadow: glowActive ? `0 0 40px ${colors.accent}44` : "none",
                    transition: "all 0.3s",
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 600 }}>
                  {step.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 60,
                    height: 2,
                    background: colors.surfaceBorder,
                    opacity: interpolate(frame - (enterFrame + 20), [0, 20], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom stats */}
      <div style={{ position: "absolute", bottom: 100, left: 80, right: 80, display: "flex", gap: 40 }}>
        <div style={{ color: colors.textSecondary, fontSize: 16 }}>
          Active Workflows: <span style={{ color: colors.accent, fontWeight: 700 }}>12</span>
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 16 }}>
          Tasks Completed: <span style={{ color: colors.accent, fontWeight: 700 }}>1,847</span>
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 16 }}>
          Uptime: <span style={{ color: colors.accent, fontWeight: 700 }}>99.7%</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add WorkflowScene to Video.tsx**

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";
import { WorkflowScene } from "./scenes/WorkflowScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <HierarchyScene />
      </Sequence>
      <Sequence from={450} durationInFrames={300}>
        <WorkflowScene />
      </Sequence>
      {/* StatsScene will be added in Task 7 */}
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Preview workflow scene**

Run: `cd packages/promo-video && pnpm run studio`
Expected: Pipeline steps animate in sequentially with glowing highlights

- [ ] **Step 4: Commit**

```bash
git add packages/promo-video/src/scenes/WorkflowScene.tsx packages/promo-video/src/Video.tsx
git commit -m "feat: add workflow scene with pipeline animation"
```

---

## Task 7: Stats Scene — Dashboard Metrics

**Files:**
- Create: `packages/promo-video/src/scenes/StatsScene.tsx`
- Modify: `packages/promo-video/src/Video.tsx`

**Interfaces:**
- Consumes: `MetricCard`, `colors`
- Produces: 10-second stats dashboard scene

- [ ] **Step 1: Create src/scenes/StatsScene.tsx**

```tsx
import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { colors } from "../lib/colors";
import { MetricCard } from "../components/MetricCard";

const metrics = [
  { label: "Total Agents", value: 26, suffix: "", x: 150, y: 400 },
  { label: "Active Workflows", value: 12, suffix: "", x: 500, y: 400 },
  { label: "Tasks Completed", value: 1847, suffix: "", x: 850, y: 400 },
  { label: "Uptime", value: 99.7, suffix: "%", x: 1200, y: 400 },
];

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background grid effect */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${colors.surfaceBorder}11 1px, transparent 1px),
            linear-gradient(90deg, ${colors.surfaceBorder}11 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: colors.accent, fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
          SYSTEM OVERVIEW
        </div>
        <div style={{ color: colors.textPrimary, fontSize: 48, fontWeight: 700, marginTop: 8 }}>
          Real-time Monitoring
        </div>
      </div>

      {/* Metric cards */}
      {metrics.map((metric, i) => (
        <MetricCard
          key={metric.label}
          {...metric}
          enterFrame={30 + i * 15}
        />
      ))}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          right: 80,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${colors.accent}44, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add StatsScene to Video.tsx**

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { StatsScene } from "./scenes/StatsScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <HierarchyScene />
      </Sequence>
      <Sequence from={450} durationInFrames={300}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={750} durationInFrames={300}>
        <StatsScene />
      </Sequence>
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Preview stats scene**

Run: `cd packages/promo-video && pnpm run studio`
Expected: Metric cards pop in with count-up animations

- [ ] **Step 4: Commit**

```bash
git add packages/promo-video/src/scenes/StatsScene.tsx packages/promo-video/src/Video.tsx
git commit -m "feat: add stats scene with dashboard metrics"
```

---

## Task 8: Outro Scene — CTA

**Files:**
- Create: `packages/promo-video/src/scenes/OutroScene.tsx`
- Modify: `packages/promo-video/src/Video.tsx`

**Interfaces:**
- Consumes: `colors`, `spring`
- Produces: Final 5-second outro scene

- [ ] **Step 1: Create src/scenes/OutroScene.tsx**

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { colors } from "../lib/colors";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 1 },
  });

  const ctaOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}22 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}88)`,
          borderRadius: 16,
          boxShadow: `0 0 40px ${colors.accent}44`,
        }}
      />

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          opacity: ctaOpacity,
          textAlign: "center",
        }}
      >
        <div style={{ color: colors.textPrimary, fontSize: 42, fontWeight: 700 }}>
          Start Building
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 20, marginTop: 12 }}>
          agent-qube.dev
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Add OutroScene to Video.tsx**

```tsx
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { StatsScene } from "./scenes/StatsScene";
import { OutroScene } from "./scenes/OutroScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <HierarchyScene />
      </Sequence>
      <Sequence from={450} durationInFrames={300}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={750} durationInFrames={300}>
        <StatsScene />
      </Sequence>
      <Sequence from={1050} durationInFrames={150}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Preview full video**

Run: `cd packages/promo-video && pnpm run studio`
Expected: Complete 40-second video with smooth scene transitions

- [ ] **Step 4: Commit**

```bash
git add packages/promo-video/src/scenes/OutroScene.tsx packages/promo-video/src/Video.tsx
git commit -m "feat: add outro scene with CTA"
```

---

## Task 9: Render Final Video

**Files:**
- Modify: `packages/promo-video/package.json` (verify render script)

**Interfaces:**
- Consumes: All scenes
- Produces: `out/promo.mp4` file

- [ ] **Step 1: Render video**

Run: `cd packages/promo-video && pnpm run render`
Expected: Creates `out/promo.mp4` at 1920x1080 30fps

- [ ] **Step 2: Add out/ to .gitignore**

```
echo "out/" >> packages/promo-video/.gitignore
```

- [ ] **Step 3: Final commit**

```bash
git add packages/promo-video/.gitignore
git commit -m "chore: ignore rendered video output"
```

---

## Self-Review Checklist

- [x] All 26 agents represented in hierarchy scene
- [x] 5 scenes total (Intro, Hierarchy, Workflow, Stats, Outro)
- [x] Consistent color scheme (#06B6D4 accent, dark theme)
- [x] Spring animations for natural motion
- [x] Glow effects matching Fuselab style
- [x] No placeholders — all code complete
- [x] Each task independently testable via `pnpm run studio`
