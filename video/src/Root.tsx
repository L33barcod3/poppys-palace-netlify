import { Composition } from "remotion";
import { ThreeDVideo, threeDVideoSchema } from "./ThreeDVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ThreeDVideo"
      component={ThreeDVideo}
      schema={threeDVideoSchema}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        captionsFile: "captions.srt",
        audioFile: null,
        accentColor: "#ff6b9d",
      }}
    />
  );
};
