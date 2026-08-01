import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <HierarchyScene />
      </Sequence>
      {/* WorkflowScene will be added in Task 6 */}
      {/* StatsScene will be added in Task 7 */}
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
