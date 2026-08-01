import { Composition } from "remotion";
import { Video } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PromoVideo"
      component={Video}
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
