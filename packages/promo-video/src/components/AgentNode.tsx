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
