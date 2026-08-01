# Core Visual Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 5 reusable visual components for Agent-Qube promo video with glow effects, glassmorphism styling, and Remotion animations.

**Architecture:** Each component is a standalone React component using Remotion's animation hooks (spring, interpolate, Easing). Components follow the design system: dark theme, cyan accent, no comments.

**Tech Stack:** React 19, TypeScript 5, Remotion 4, Tailwind CSS 4

## Global Constraints
- Component <= 150 lines, File <= 200 lines
- No emoji in code (STD-DOC-003, ESLint checked)
- Dark theme: black #000000 background
- Accent: Cyan #06B6D4
- Code style: follow existing conventions in `src/lib/colors.ts`
- TypeScript strict mode enabled

## File Structure

| File | Responsibility |
|------|---------------|
| `src/components/GlowEffect.tsx` | Animated radial glow effect |
| `src/components/AgentNode.tsx` | Agent node with glow and label |
| `src/components/ConnectionLine.tsx` | Animated SVG connection lines |
| `src/components/MetricCard.tsx` | Glassmorphism metric display card |
| `src/components/ParallaxLayer.tsx` | Parallax scroll layer wrapper |

---

### Task 1: Create GlowEffect Component

**Files:**
- Create: `packages/promo-video/src/components/GlowEffect.tsx`

**Interfaces:**
- Consumes: `useCurrentFrame`, `interpolate` from `remotion`
- Produces: `GlowEffect` component (x, y, color, size, intensity props)

- [ ] **Step 1: Create the GlowEffect component**

```tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd packages/promo-video && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/promo-video/src/components/GlowEffect.tsx
git commit -m "feat: add GlowEffect component"
```

---

### Task 2: Create AgentNode Component

**Files:**
- Create: `packages/promo-video/src/components/AgentNode.tsx`

**Interfaces:**
- Consumes: `GlowEffect` from `./GlowEffect`, `colors` from `../lib/colors`, `AgentNode` type from `../types`
- Produces: `AgentNode` component (agent, enterFrame, size props)

- [ ] **Step 1: Create the AgentNode component**

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd packages/promo-video && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/promo-video/src/components/AgentNode.tsx
git commit -m "feat: add AgentNode component"
```

---

### Task 3: Create ConnectionLine Component

**Files:**
- Create: `packages/promo-video/src/components/ConnectionLine.tsx`

**Interfaces:**
- Consumes: `useCurrentFrame`, `interpolate`, `Easing` from `remotion`, `colors` from `../lib/colors`
- Produces: `ConnectionLine` component (x1, y1, x2, y2, enterFrame, duration, color props)

- [ ] **Step 1: Create the ConnectionLine component**

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd packages/promo-video && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/promo-video/src/components/ConnectionLine.tsx
git commit -m "feat: add ConnectionLine component"
```

---

### Task 4: Create MetricCard Component

**Files:**
- Create: `packages/promo-video/src/components/MetricCard.tsx`

**Interfaces:**
- Consumes: `useCurrentFrame`, `spring`, `useVideoConfig`, `interpolate` from `remotion`, `colors` from `../lib/colors`
- Produces: `MetricCard` component (label, value, suffix, enterFrame, x, y props)

- [ ] **Step 1: Create the MetricCard component**

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd packages/promo-video && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/promo-video/src/components/MetricCard.tsx
git commit -m "feat: add MetricCard component"
```

---

### Task 5: Create ParallaxLayer Component

**Files:**
- Create: `packages/promo-video/src/components/ParallaxLayer.tsx`

**Interfaces:**
- Consumes: `useCurrentFrame`, `interpolate` from `remotion`
- Produces: `ParallaxLayer` component (children, depth, centerX, centerY props)

- [ ] **Step 1: Create the ParallaxLayer component**

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd packages/promo-video && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/promo-video/src/components/ParallaxLayer.tsx
git commit -m "feat: add ParallaxLayer component"
```

---

### Task 6: Final Verification and Report

- [ ] **Step 1: Run full TypeScript check**

Run: `cd packages/promo-video && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Create task report**

Write report to `C:\Users\stsgr\AppData\Local\Temp\opencode\task-3-report.md`

- [ ] **Step 3: Final commit with all components**

```bash
git status
git commit -m "feat: add core visual components for promo video"
```
