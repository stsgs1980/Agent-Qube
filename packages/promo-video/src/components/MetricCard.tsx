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
