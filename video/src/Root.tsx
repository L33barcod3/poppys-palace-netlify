import { Composition } from "remotion";
import { ThreeDVideo, threeDVideoSchema } from "./ThreeDVideo";
import { TradeMate } from "./trade-mate/TradeMate";
import { T } from "./trade-mate/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TradeMate"
        component={TradeMate}
        durationInFrames={T.total}
        fps={30}
        width={1920}
        height={1080}
      />
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
    </>
  );
};
