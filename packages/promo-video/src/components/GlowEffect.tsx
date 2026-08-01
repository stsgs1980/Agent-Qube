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
