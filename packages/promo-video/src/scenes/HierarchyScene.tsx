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
