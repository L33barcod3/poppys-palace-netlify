import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// All motion is derived from useCurrentFrame() — never use R3F's useFrame(),
// or frames will flicker/desync when rendering.
export const Scene3D: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 200 } });
  const rotation = frame * 0.02;
  const cameraZ = interpolate(frame, [0, 300], [7, 5], {
    extrapolateRight: "clamp",
  });

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, cameraZ], fov: 50 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-4, -2, 3]} intensity={20} color={accentColor} />

      <mesh scale={intro} rotation={[rotation * 0.6, rotation, 0]}>
        <torusKnotGeometry args={[1, 0.32, 200, 32]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </ThreeCanvas>
  );
};
