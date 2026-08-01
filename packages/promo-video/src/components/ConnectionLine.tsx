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
