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

const BRICK = "#a5523a";

export const BuildingSite: React.FC = () => (
  <>
    <color attach="background" args={["#a8d0f0"]} />
    <fog attach="fog" args={["#a8d0f0", 9, 26]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#8d806a" />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.3]}>
      <planeGeometry args={[5, 3.4]} />
      <meshStandardMaterial color="#b5b0a6" />
    </mesh>
    {/* Timber frame of the house going up */}
    {[-4, -2.6, -1.2, 0.2, 1.6, 3, 4.4].map((x) => (
      <mesh key={x} position={[x, 1.5, -4]}>
        <boxGeometry args={[0.12, 3, 0.12]} />
        <meshStandardMaterial color="#c9a26b" />
      </mesh>
    ))}
    {[1.5, 3].map((y) => (
      <mesh key={y} position={[0.2, y, -4]}>
        <boxGeometry args={[8.6, 0.12, 0.12]} />
        <meshStandardMaterial color="#c9a26b" />
      </mesh>
    ))}
    {/* Half-built brick wall */}
    {Array.from({ length: 6 }).flatMap((_, row) =>
      Array.from({ length: 12 - row }).map((__, col) => (
        <mesh
          key={`${row}-${col}`}
          position={[
            -4.2 + col * 0.46 + (row % 2) * 0.23,
            0.09 + row * 0.18,
            -2.6,
          ]}
        >
          <boxGeometry args={[0.44, 0.16, 0.22]} />
          <meshStandardMaterial color={BRICK} />
        </mesh>
      )),
    )}
    {/* Pallet of bricks */}
    <group position={[3, 0, -1.8]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1, 0.12, 1]} />
        <meshStandardMaterial color="#b98a55" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.6, 0.9]} />
        <meshStandardMaterial color={BRICK} />
      </mesh>
    </group>
  </>
);
