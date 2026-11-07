import { Composition } from "remotion";
import { ThreeDVideo, threeDVideoSchema } from "./ThreeDVideo";
import { TradeMate } from "./trade-mate/TradeMate";
import { Vinted } from "./vinted/Vinted";
import { T as VT } from "./vinted/timeline";
import { T } from "./trade-mate/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Vinted"
        component={Vinted}
        durationInFrames={VT.total}
        fps={30}
        width={1920}
        height={1080}
      />
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
