import type { RoleGroup } from "../types";

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
