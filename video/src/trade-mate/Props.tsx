import { RoundedBox, Sky } from "@react-three/drei";
import { useMemo } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";
import type { Vec3 } from "./Builder";

export const Hammer: React.FC<{ position?: Vec3; rotation?: Vec3 }> = ({
  position,
  rotation,
}) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <cylinderGeometry args={[0.018, 0.022, 0.34, 12]} />
      <meshStandardMaterial color="#8b5a2b" />
    </mesh>
    <mesh position={[0, 0.17, 0]}>
      <boxGeometry args={[0.16, 0.05, 0.05]} />
      <meshStandardMaterial color="#7d8590" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

export const Spanner: React.FC<{ position?: Vec3; rotation?: Vec3 }> = ({
  position,
  rotation,
}) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <boxGeometry args={[0.035, 0.28, 0.014]} />
      <meshStandardMaterial color="#c0c6cc" metalness={0.9} roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.16, 0]}>
      <torusGeometry args={[0.035, 0.013, 8, 16]} />
      <meshStandardMaterial color="#c0c6cc" metalness={0.9} roughness={0.25} />
    </mesh>
  </group>
);

export const Phone: React.FC<{ glow: number }> = ({ glow }) => (
  // Rotation solved so the screen faces the camera in the phone shot.
  <group
    position={[0, -0.06, 0.03]}
    rotation={[Math.PI / 4, -Math.PI / 4, 0]}
    scale={1.6}
  >
    <mesh>
      <boxGeometry args={[0.085, 0.17, 0.012]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
    <mesh position={[0, 0, 0.007]}>
      <planeGeometry args={[0.075, 0.15]} />
      <meshStandardMaterial
        color="#ff8a00"
        emissive="#ff8a00"
        emissiveIntensity={glow}
      />
    </mesh>
  </group>
);

export const Workbench: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.85, 0]}>
      <boxGeometry args={[1.3, 0.06, 0.7]} />
      <meshStandardMaterial color="#b98a55" />
    </mesh>
    {[
      [-0.58, -0.3],
      [0.58, -0.3],
      [-0.58, 0.3],
      [0.58, 0.3],
    ].map(([x, z]) => (
      <mesh key={`${x}-${z}`} position={[x, 0.41, z]}>
        <boxGeometry args={[0.07, 0.82, 0.07]} />
        <meshStandardMaterial color="#8b6a43" />
      </mesh>
    ))}
    {/* Plans and a calculator for pricing the job */}
    <mesh position={[-0.15, 0.885, 0]} rotation={[-Math.PI / 2, 0, 0.15]}>
      <planeGeometry args={[0.6, 0.42]} />
      <meshStandardMaterial color="#3a6fb0" />
    </mesh>
    <mesh position={[0.38, 0.9, 0.05]} rotation={[0, -0.3, 0]}>
      <boxGeometry args={[0.14, 0.03, 0.2]} />
      <meshStandardMaterial color="#2b2b2b" />
    </mesh>
    <mesh position={[0.38, 0.917, 0.05]} rotation={[-Math.PI / 2, 0, 0.3]}>
      <planeGeometry args={[0.1, 0.05]} />
      <meshStandardMaterial color="#9bc49b" />
    </mesh>
  </group>
);

// Small deterministic random generator so every render looks identical.
export const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const useConcreteTexture = () =>
  useMemo(() => {
    const rand = seeded(3);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#bdb6aa";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2500; i++) {
      const g = 150 + rand() * 60;
      ctx.fillStyle = `rgba(${g},${g - 5},${g - 12},0.35)`;
      ctx.fillRect(rand() * 256, rand() * 256, 1 + rand() * 3, 1 + rand() * 3);
    }
    ctx.strokeStyle = "rgba(90,85,78,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 256, 256);
    const tex = new CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(4, 3);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);

const BrickWall: React.FC = () => {
  const bricks = useMemo(() => {
    const rand = seeded(11);
    return Array.from({ length: 7 }).flatMap((_, row) =>
      Array.from({ length: 14 - row }).map((__, col) => {
        const shade = 0.85 + rand() * 0.25;
        return {
          key: `${row}-${col}`,
          pos: [
            -4.4 + col * 0.46 + (row % 2) * 0.23,
            0.09 + row * 0.18,
            -2.6,
          ] as Vec3,
          color: `rgb(${Math.round(165 * shade)},${Math.round(80 * shade)},${Math.round(58 * shade)})`,
        };
      }),
    );
  }, []);
  return (
    <>
      {bricks.map((b) => (
        <RoundedBox
          key={b.key}
          args={[0.44, 0.16, 0.22]}
          radius={0.015}
          smoothness={2}
          position={b.pos}
        >
          <meshStandardMaterial color={b.color} roughness={0.95} />
        </RoundedBox>
      ))}
    </>
  );
};

const Scaffold: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    {[0, 1.6, 3.2].flatMap((x) =>
      [0, 1].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 1.8, z]}>
          <cylinderGeometry args={[0.03, 0.03, 3.6, 10]} />
          <meshStandardMaterial
            color="#9aa3ab"
            metalness={0.8}
            roughness={0.35}
          />
        </mesh>
      )),
    )}
    {[1.2, 2.4, 3.5].flatMap((y) => [
      <mesh key={`r${y}`} position={[1.6, y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 3.3, 8]} />
        <meshStandardMaterial
          color="#9aa3ab"
          metalness={0.8}
          roughness={0.35}
        />
      </mesh>,
      <mesh key={`p${y}`} position={[1.6, y + 0.04, 0.5]}>
        <boxGeometry args={[3.3, 0.05, 0.9]} />
        <meshStandardMaterial color="#b88a52" roughness={0.9} />
      </mesh>,
    ])}
  </group>
);

const CementMixer: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position} rotation={[0, -0.6, 0]}>
    <mesh position={[0, 0.85, 0]} rotation={[0.6, 0, 0]}>
      <cylinderGeometry args={[0.28, 0.42, 0.7, 24]} />
      <meshStandardMaterial color="#f07a1a" roughness={0.4} metalness={0.2} />
    </mesh>
    <mesh position={[0, 1.2, 0.2]} rotation={[0.6, 0, 0]}>
      <cylinderGeometry args={[0.16, 0.28, 0.25, 24]} />
      <meshStandardMaterial color="#d8661a" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.12, 0.6, 0.12]} />
      <meshStandardMaterial color="#333a40" metalness={0.6} roughness={0.4} />
    </mesh>
    {[-0.3, 0.3].map((x) => (
      <mesh key={x} position={[x, 0.18, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 20]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

const Cone: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.02, 0]}>
      <boxGeometry args={[0.32, 0.04, 0.32]} />
      <meshStandardMaterial color="#e2541c" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.25, 0]}>
      <coneGeometry args={[0.12, 0.46, 20]} />
      <meshStandardMaterial color="#ff6a1f" roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.27, 0]}>
      <cylinderGeometry args={[0.068, 0.082, 0.07, 20]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.3}
      />
    </mesh>
  </group>
);

const House: React.FC<{
  position: Vec3;
  color: string;
  roof: string;
  w: number;
}> = ({ position, color, roof, w }) => (
  <group position={position}>
    <mesh position={[0, 1.6, 0]}>
      <boxGeometry args={[w, 3.2, 3]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    <mesh
      position={[0, 3.9, 0]}
      rotation={[0, Math.PI / 4, 0]}
      scale={[w / 2.4, 1, 3 / 2.4]}
    >
      <coneGeometry args={[1.75, 1.4, 4]} />
      <meshStandardMaterial color={roof} roughness={0.8} />
    </mesh>
  </group>
);

const Tree: React.FC<{ position: Vec3; s: number }> = ({ position, s }) => (
  <group position={position} scale={s}>
    <mesh position={[0, 0.8, 0]}>
      <cylinderGeometry args={[0.12, 0.16, 1.6, 8]} />
      <meshStandardMaterial color="#5b4030" />
    </mesh>
    <mesh position={[0, 2.1, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#4f7a3a" roughness={0.9} />
    </mesh>
  </group>
);

export const BuildingSite: React.FC = () => {
  const concrete = useConcreteTexture();
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[60, 9, 40]}
        turbidity={7}
        rayleigh={1.6}
        mieCoefficient={0.006}
        mieDirectionalG={0.86}
      />
      <fog attach="fog" args={["#e9c8a6", 14, 45]} />
      {/* Grass, site dirt, concrete slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#6b8a45" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 11]} />
        <meshStandardMaterial color="#9a8466" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -0.3]}>
        <planeGeometry args={[5, 3.4]} />
        <meshStandardMaterial map={concrete} roughness={0.9} />
      </mesh>
      {/* Timber frame of the house going up, with braces */}
      {[-4, -2.6, -1.2, 0.2, 1.6, 3, 4.4].map((x) => (
        <mesh key={x} position={[x, 1.5, -4]}>
          <boxGeometry args={[0.12, 3, 0.12]} />
          <meshStandardMaterial color="#d2a86e" roughness={0.8} />
        </mesh>
      ))}
      {[1.5, 3].map((y) => (
        <mesh key={y} position={[0.2, y, -4]}>
          <boxGeometry args={[8.6, 0.12, 0.12]} />
          <meshStandardMaterial color="#d2a86e" roughness={0.8} />
        </mesh>
      ))}
      {[-3.3, -0.5, 2.3].map((x) => (
        <mesh key={x} position={[x, 0.75, -4]} rotation={[0, 0, 0.82]}>
          <boxGeometry args={[0.08, 2, 0.08]} />
          <meshStandardMaterial color="#c49a60" roughness={0.8} />
        </mesh>
      ))}
      <BrickWall />
      <Scaffold position={[-7.5, 0, -4.6]} />
      <CementMixer position={[3.1, 0, -1.4]} />
      <Cone position={[-2.4, 0, 1.4]} />
      <Cone position={[2.3, 0, 1.6]} />
      <Cone position={[2.8, 0, 1.1]} />
      {/* Pallet of bricks */}
      <group position={[3.2, 0, -2.8]}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[1, 0.12, 1]} />
          <meshStandardMaterial color="#b98a55" />
        </mesh>
        <RoundedBox
          args={[0.9, 0.6, 0.9]}
          radius={0.03}
          position={[0, 0.42, 0]}
        >
          <meshStandardMaterial color="#a5523a" roughness={0.95} />
        </RoundedBox>
      </group>
      {/* Stack of timber planks */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[-2.9, 0.05 + i * 0.07, 0.4 + (i % 2) * 0.03]}
          rotation={[0, 0.25, 0]}
        >
          <boxGeometry args={[1.8, 0.06, 0.22]} />
          <meshStandardMaterial
            color={i % 2 ? "#c79a62" : "#d6aa70"}
            roughness={0.85}
          />
        </mesh>
      ))}
      {/* Neighbourhood in the distance */}
      <House position={[-9, 0, -15]} color="#c9b8a0" roof="#5a3e36" w={4} />
      <House position={[-3.5, 0, -17]} color="#b5654a" roof="#3e3232" w={5} />
      <House position={[2.5, 0, -16]} color="#d8cdb8" roof="#4a3a36" w={4.2} />
      <House position={[8, 0, -15]} color="#a65a42" roof="#3a2e2a" w={4.5} />
      <Tree position={[-6.2, 0, -10]} s={1.1} />
      <Tree position={[5.6, 0, -9]} s={1.3} />
      <Tree position={[11, 0, -8]} s={1.5} />
      <Tree position={[-12, 0, -9]} s={1.4} />
    </>
  );
};
