import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { HierarchyScene } from "./scenes/HierarchyScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { StatsScene } from "./scenes/StatsScene";
import { OutroScene } from "./scenes/OutroScene";

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
      <Sequence from={1050} durationInFrames={150}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
