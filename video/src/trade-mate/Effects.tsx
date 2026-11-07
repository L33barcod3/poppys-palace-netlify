import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { Mesh, ShaderMaterial } from "three";
import type { Vec3 } from "./Builder";
import { seeded } from "./Props";

// Every solid mesh casts and receives shadows (skips the sky and see-through FX).
export const ShadowSetup: React.FC = () => {
  const scene = useThree((s) => s.scene);
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const m = o.material as { transparent?: boolean };
      const solid = !(o.material instanceof ShaderMaterial) && !m.transparent;
      o.castShadow = solid;
      o.receiveShadow = solid;
    });
  }, [scene, frame]);
  return null;
};

// A ring of dust puffs kicked up at `at` frame.
export const DustBurst: React.FC<{
  at: number;
  origin: Vec3;
  count?: number;
  size?: number;
  seed?: number;
  duration?: number;
}> = ({ at, origin, count = 14, size = 1, seed = 1, duration = 30 }) => {
  const frame = useCurrentFrame();
  const puffs = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }).map((_, i) => ({
      angle: (i / count) * Math.PI * 2 + rand() * 0.4,
      speed: 0.6 + rand() * 0.8,
      rise: 0.15 + rand() * 0.35,
      r: 0.06 + rand() * 0.06,
    }));
  }, [count, seed]);
  const t = (frame - at) / duration;
  if (t < 0 || t > 1) return null;
  const ease = 1 - (1 - t) ** 3;
  return (
    <group position={origin} scale={size}>
      {puffs.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * p.speed * ease * 0.8,
            0.05 + p.rise * ease,
            Math.sin(p.angle) * p.speed * ease * 0.8,
          ]}
          scale={1 + ease * 3}
        >
          <sphereGeometry args={[p.r, 10, 10]} />
          <meshStandardMaterial
            color="#c9b190"
            transparent
            opacity={0.65 * (1 - t)}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
};

const CONFETTI_COLORS = ["#ff8a00", "#ffd400", "#ffffff", "#14213d", "#d7f22b"];

// Confetti falling from above, driven purely by the frame number.
export const Confetti: React.FC<{ from: number; count?: number }> = ({
  from,
  count = 160,
}) => {
  const frame = useCurrentFrame();
  const pieces = useMemo(() => {
    const rand = seeded(42);
    return Array.from({ length: count }).map(() => ({
      x: (rand() - 0.5) * 5,
      z: (rand() - 0.5) * 2.5 + 0.2,
      delay: rand() * 50,
      fall: 0.9 + rand() * 0.7,
      sway: rand() * Math.PI * 2,
      spin: 4 + rand() * 6,
      color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
    }));
  }, [count]);
  return (
    <>
      {pieces.map((p, i) => {
        const t = (frame - from - p.delay) / 30;
        if (t < 0) return null;
        const y = 4 - p.fall * t;
        if (y < 0.02) return null;
        return (
          <mesh
            key={i}
            position={[p.x + Math.sin(t * 2 + p.sway) * 0.25, y, p.z]}
            rotation={[t * p.spin, t * p.spin * 0.7, p.sway]}
          >
            <planeGeometry args={[0.07, 0.04]} />
            <meshStandardMaterial
              color={p.color}
              side={2}
              emissive={p.color}
              emissiveIntensity={0.25}
            />
          </mesh>
        );
      })}
    </>
  );
};
