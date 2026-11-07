import { Audio } from "@remotion/media";
import { Environment, Lightformer } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  interpolate,
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
import { Confetti, DustBurst, ShadowSetup } from "./Effects";
import { knockedOver, poseA, poseB } from "./poses";
import { BuildingSite, Hammer, Phone, Spanner, Workbench } from "./Props";
import { FPS, isSpeaking, SPEECH, T } from "./timeline";
import { VOICE_LINES } from "./voice-lines";

const A_POS: Vec3 = [-0.95, 0, 0];
const A_ROT = 0.7;
const B_POS: Vec3 = [0.95, 0, 0];
const B_ROT = -0.7;

// Where things hit the ground (frames + positions), for dust and flashes.
const TOOLS_LAND = T.release + 8;
const A_LANDS = T.stamp + 6;
const B_LANDS = T.stamp + 9;
const behind = (pos: Vec3, rotY: number, d: number): Vec3 => [
  pos[0] - Math.sin(rotY) * d,
  0,
  pos[2] - Math.cos(rotY) * d,
];

// 1 on an impact frame, fading out over `length` frames.
const kick = (frame: number, at: number, length: number) =>
  frame >= at && frame < at + length ? 1 - (frame - at) / length : 0;

export const TradeMate: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const a = poseA(frame);
  const b = poseB(frame);
  const atRelease = poseA(T.release);
  const holdingTools = frame < T.release;
  const holdingPhone = frame >= T.phoneOut;
  const fadeIn = interpolate(frame, [0, 12], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 50, position: [0, 2, 6] }}
        shadows
      >
        {/* Golden-hour sun with soft shadows, plus studio-style reflections */}
        <hemisphereLight args={["#ffe2c4", "#6b5a44", 0.9]} />
        <directionalLight
          position={[9, 5, 7]}
          intensity={3.2}
          color="#ffd2a1"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <directionalLight
          position={[-6, 4, 3]}
          intensity={0.6}
          color="#9ec3ff"
        />
        <Environment resolution={128} frames={1}>
          <Lightformer
            intensity={2}
            color="#ffd9b0"
            position={[5, 5, 5]}
            scale={[6, 3, 1]}
          />
          <Lightformer
            intensity={1}
            color="#a8c8ff"
            position={[-5, 3, 2]}
            scale={[4, 3, 1]}
          />
          <Lightformer
            intensity={0.6}
            color="#ffffff"
            position={[0, 6, -5]}
            scale={[8, 2, 1]}
          />
        </Environment>
        <ShadowSetup />
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
          fall={knockedOver(frame, 0)}
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
          fall={knockedOver(frame, 3)}
          moustache
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
        <DustBurst
          at={TOOLS_LAND}
          origin={[-0.7, 0, 0.3]}
          size={0.7}
          seed={1}
        />
        <DustBurst at={A_LANDS} origin={behind(A_POS, A_ROT, 0.9)} seed={2} />
        <DustBurst at={B_LANDS} origin={behind(B_POS, B_ROT, 0.9)} seed={3} />
        <Confetti from={T.celebrate + 2} />
      </ThreeCanvas>
      {/* Music + SFX: scripts/make-trade-mate-audio.py */}
      <Audio
        src={staticFile("audio/trade-mate-music.wav")}
        volume={(f) =>
          isSpeaking(f, SPEECH.a) || isSpeaking(f, SPEECH.b) ? 0.45 : 1
        }
      />
      <Audio src={staticFile("audio/trade-mate-sfx.wav")} />
      {/* Voiceover + captions: scripts/make-trade-mate-voices.mjs */}
      {VOICE_LINES.map((line) => (
        <Sequence
          key={line.id}
          from={Math.round(line.start * FPS)}
          layout="none"
        >
          <Audio src={staticFile(`audio/voice-${line.id}.mp3`)} />
        </Sequence>
      ))}
      <Captions
        src={staticFile("trade-mate-captions.json")}
        highlightColor="#ff8a00"
      />
      <Sequence
        from={T.overlayIn}
        durationInFrames={T.overlayOut - T.overlayIn + 15}
      >
        <PhoneOverlay exitAt={T.overlayOut - T.overlayIn} />
      </Sequence>
      <Sequence from={T.endCard}>
        <EndCard impactAt={T.stamp - T.endCard} />
      </Sequence>
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: 0.35 * kick(frame, TOOLS_LAND, 5),
        }}
      />
      {/* Cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fadeIn }} />
    </AbsoluteFill>
  );
};
