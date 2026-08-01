import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { StatsScene } from "./scenes/StatsScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      <Sequence from={150} durationInFrames={300}>
        <HierarchyScene />
      </Sequence>
      <Sequence from={450} durationInFrames={300}>
        <WorkflowScene />
      </Sequence>
      <Sequence from={750} durationInFrames={300}>
        <StatsScene />
      </Sequence>
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
