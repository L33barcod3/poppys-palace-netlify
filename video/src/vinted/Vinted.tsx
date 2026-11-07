import { Environment, Lightformer } from "@react-three/drei";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions } from "../captions/Captions";
import { ShadowSetup } from "../trade-mate/Effects";
import { CameraRig } from "./CameraRig";
import { LivingRoom, Parcel } from "./LivingRoom";
import type { Look } from "./Person";
import { Person } from "./Person";
import {
  gfHoldsParcel,
  gfPlacement,
  LEE_POS,
  LEE_ROT,
  poseGf,
  poseLee,
} from "./poses";
import { FPS, T } from "./timeline";
import { VOICE_LINES } from "./voice-lines";

const LEE: Look = { kind: "lee", skin: "#e6b192" };
const GF: Look = { kind: "gf", skin: "#efb894" };

const PhoneInHand: React.FC = () => (
  <group position={[0, -0.04, 0.05]} rotation={[-0.9, 0, 0]}>
    <mesh>
      <boxGeometry args={[0.075, 0.15, 0.01]} />
      <meshStandardMaterial color="#111" roughness={0.3} />
    </mesh>
    <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[0.066, 0.135]} />
      <meshStandardMaterial
        color="#9fd8ff"
        emissive="#9fd8ff"
        emissiveIntensity={1.4}
      />
    </mesh>
  </group>
);

export const Vinted: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lee = poseLee(frame);
  const gf = poseGf(frame);
  const place = gfPlacement(frame);
  // Door flies open and bounces off the wall.
  const doorOpen = interpolate(
    frame,
    [T.doorBang - 3, T.doorBang + 3, T.doorBang + 9, T.doorBang + 16],
    [0, 1.95, 1.7, 1.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );
  const fadeIn = interpolate(frame, [0, 10], [1, 0], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [T.total - 12, T.total], [0, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, position: [0, 1.5, 3] }}
        shadows
      >
        {/* Warm evening interior: lamp, hallway spill, ceiling bounce, cool phone/TV fill */}
        <hemisphereLight args={["#ffe6c7", "#5a4636", 0.55]} />
        <directionalLight
          position={[1.5, 4.5, 2.5]}
          intensity={1.4}
          color="#ffe9cf"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />
        <pointLight
          position={[-1.85, 1.55, -1.85]}
          intensity={3.5}
          distance={6}
          decay={1.6}
          color="#ffbe6e"
        />
        <pointLight
          position={[3.9, 1.9, -0.7]}
          intensity={2.5 + 2 * Math.min(1, doorOpen)}
          distance={5}
          decay={1.6}
          color="#ffdba0"
        />
        <pointLight
          position={[0, 1.2, 2.6]}
          intensity={1.2}
          distance={6}
          decay={1.5}
          color="#a9c8ff"
        />
        <Environment resolution={128} frames={1}>
          <Lightformer
            intensity={1.2}
            color="#ffd9b0"
            position={[0, 4, 0]}
            scale={[6, 6, 1]}
            rotation-x={Math.PI / 2}
          />
          <Lightformer
            intensity={0.6}
            color="#a8c8ff"
            position={[-4, 2, 0]}
            scale={[3, 2, 1]}
          />
        </Environment>
        <ShadowSetup />
        <CameraRig />
        <LivingRoom doorOpen={doorOpen} />
        <Person
          look={LEE}
          position={LEE_POS}
          rotationY={LEE_ROT}
          pose={lee}
          rightHand={<PhoneInHand />}
        />
        {frame >= T.walkStart - 2 ? (
          <Person
            look={GF}
            position={place.pos}
            rotationY={place.rotY}
            pose={gf}
            leftHand={
              gfHoldsParcel(frame) ? (
                <Parcel
                  position={[0, -0.03, 0.06]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={0.85}
                  color="#b9c4c2"
                />
              ) : null
            }
          />
        ) : null}
        {/* Once her hands go to her hips, the parcel has been dumped on the table */}
        {gfHoldsParcel(frame) ? null : (
          <Parcel
            position={[0.25, 0.49, -0.35]}
            rotation={[0, -0.6, 0.05]}
            color="#b9c4c2"
          />
        )}
      </ThreeCanvas>
      {/* Sound: scripts/make-vinted-audio.py; voices: scripts/make-voices.mjs vinted */}
      <Audio src={staticFile("audio/vinted-sfx.wav")} />
      {VOICE_LINES.map((line) => (
        <Sequence
          key={line.id}
          from={Math.round(line.start * FPS)}
          layout="none"
        >
          <Audio src={staticFile(`audio/vinted-${line.id}.mp3`)} />
        </Sequence>
      ))}
      <Captions
        src={staticFile("vinted-captions.json")}
        highlightColor="#ff5c8a"
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ backgroundColor: "black", opacity: Math.max(fadeIn, fadeOut) }}
      />
    </AbsoluteFill>
  );
};
