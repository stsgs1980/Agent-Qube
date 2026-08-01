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
