import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions } from "../captions/Captions";
import type { Vec3 } from "./Builder";
import { Builder } from "./Builder";
import { CameraRig } from "./CameraRig";
import { EndCard } from "./EndCard";
import { FallingTools } from "./FallingTools";
import { PhoneOverlay } from "./PhoneOverlay";
import { poseA, poseB } from "./poses";
import { BuildingSite, Hammer, Phone, Spanner, Workbench } from "./Props";
import { T } from "./timeline";

const A_POS: Vec3 = [-0.95, 0, 0];
const A_ROT = 0.7;
const B_POS: Vec3 = [0.95, 0, 0];
const B_ROT = -0.7;

export const TradeMate: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const a = poseA(frame);
  const b = poseB(frame);
  const atRelease = poseA(T.release);
  const holdingTools = frame < T.release;
  const holdingPhone = frame >= T.phoneOut;

  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 50, position: [0, 2, 6] }}
      >
        <hemisphereLight args={["#dbeeff", "#8d806a", 1.3]} />
        <directionalLight position={[4, 8, 5]} intensity={2.2} />
        <ambientLight intensity={0.25} />
        <CameraRig />
        <BuildingSite />
        <Workbench position={[0, 0, -0.6]} />
        <Builder
          position={A_POS}
          rotationY={A_ROT}
          vest="#ff7a1a"
          sleeve="#2d3a5a"
          hat="#f4f4f4"
          pose={a}
          rightHand={
            holdingTools ? (
              <Hammer position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} />
            ) : holdingPhone ? (
              <Phone glow={1.5} />
            ) : null
          }
          leftHand={
            holdingTools ? (
              <Spanner position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} />
            ) : null
          }
        />
        <Builder
          position={B_POS}
          rotationY={B_ROT}
          vest="#d7f22b"
          sleeve="#3d5a3a"
          hat="#ffcc00"
          pose={b}
        />
        {holdingTools ? null : (
          <FallingTools
            releaseFrame={T.release}
            builderPosition={A_POS}
            rotationY={A_ROT}
            rightArm={atRelease.rightArm}
            leftArm={atRelease.leftArm}
            bodyY={atRelease.bodyY}
          />
        )}
      </ThreeCanvas>
      <Captions src={staticFile("trade-mate.srt")} highlightColor="#ff8a00" />
      <Sequence
        from={T.overlayIn}
        durationInFrames={T.overlayOut - T.overlayIn + 15}
      >
        <PhoneOverlay exitAt={T.overlayOut - T.overlayIn} />
      </Sequence>
      <Sequence from={T.endCard}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
