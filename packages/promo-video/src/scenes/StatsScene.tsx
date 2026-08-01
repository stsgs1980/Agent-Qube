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
