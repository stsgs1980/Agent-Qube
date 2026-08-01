import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
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
