import { Audio } from "@remotion/media";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, staticFile } from "remotion";
import { z } from "zod";
import { Captions } from "./captions/Captions";
import { Scene3D } from "./scene/Scene3D";

export const threeDVideoSchema = z.object({
  // .srt file inside public/
  captionsFile: z.string(),
  // Audio file inside public/ (e.g. "voiceover.mp3"), or null for silence
  audioFile: z.string().nullable(),
  accentColor: zColor(),
});

export const ThreeDVideo: React.FC<z.infer<typeof threeDVideoSchema>> = ({
  captionsFile,
  audioFile,
  accentColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b14" }}>
      <Scene3D accentColor={accentColor} />
      <Captions src={staticFile(captionsFile)} highlightColor={accentColor} />
      {audioFile ? <Audio src={staticFile(audioFile)} /> : null}
    </AbsoluteFill>
  );
};
