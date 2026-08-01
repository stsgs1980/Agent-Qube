import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { IntroScene } from "./scenes/IntroScene";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>
      {/* HierarchyScene will be added in Task 5 */}
      {/* WorkflowScene will be added in Task 6 */}
      {/* StatsScene will be added in Task 7 */}
      {/* OutroScene will be added in Task 8 */}
    </AbsoluteFill>
  );
};
