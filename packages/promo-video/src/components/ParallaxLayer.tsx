import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth: number;
  centerX?: number;
  centerY?: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children, depth, centerX = 960, centerY = 540,
}) => {
  const frame = useCurrentFrame();

  const offsetX = interpolate(frame, [0, 1200], [0, -50 * depth], {
    extrapolateRight: "clamp",
  });

  const offsetY = interpolate(frame, [0, 1200], [0, -20 * depth], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(depth, [0, 2], [1, 0.8]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        transformOrigin: `${centerX}px ${centerY}px`,
      }}
    >
      {children}
    </div>
  );
};
