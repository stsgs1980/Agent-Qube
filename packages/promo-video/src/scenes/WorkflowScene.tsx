import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { colors } from "../lib/colors";

const steps = [
  { label: "Plan", icon: "📋" },
  { label: "Execute", icon: "⚡" },
  { label: "Review", icon: "🔍" },
  { label: "Deploy", icon: "🚀" },
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
