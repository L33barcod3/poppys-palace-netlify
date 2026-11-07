import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";
import { seeded } from "../trade-mate/Props";
import type { Vec3 } from "./Person";

const WALL = "#d9c9b3";
const TRIM = "#f3eee6";

export const DOOR_HINGE: Vec3 = [3.2, 0, -1.15];
export const DOOR_WIDTH = 0.9;

const useWoodFloor = () =>
  useMemo(() => {
    const rand = seeded(5);
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const plankH = 64;
    for (let row = 0; row < 512 / plankH; row++) {
      let x = -rand() * 200;
      while (x < 512) {
        const w = 180 + rand() * 160;
        const tone = 120 + rand() * 40;
        ctx.fillStyle = `rgb(${tone + 40},${tone - 2},${tone - 45})`;
        ctx.fillRect(x, row * plankH, w, plankH);
        for (let g = 0; g < 14; g++) {
          ctx.strokeStyle = `rgba(70,40,20,${0.08 + rand() * 0.1})`;
          ctx.beginPath();
          const y = row * plankH + rand() * plankH;
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(
            x + w / 3,
            y + rand() * 6 - 3,
            x + (2 * w) / 3,
            y + rand() * 6 - 3,
            x + w,
            y,
          );
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(40,22,10,0.6)";
        ctx.fillRect(x, row * plankH, 2, plankH);
        x += w;
      }
      ctx.fillStyle = "rgba(40,22,10,0.6)";
      ctx.fillRect(0, row * plankH, 512, 2);
    }
    const tex = new CanvasTexture(c);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);

const useRug = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#8c5a4a";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#e7d7bf";
    ctx.lineWidth = 10;
    ctx.strokeRect(18, 18, 220, 220);
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 176, 176);
    ctx.fillStyle = "#d1a35a";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(128, 128, 20 + i * 18, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 ? "#e7d7bf" : "#d1a35a";
      ctx.stroke();
    }
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, []);

const Sofa: React.FC<{ position: Vec3 }> = ({ position }) => {
  const fabric = "#5d6b6a";
  const cushion = "#6b7a78";
  return (
    <group position={position}>
      <RoundedBox args={[2.3, 0.36, 0.95]} radius={0.06} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={fabric} roughness={0.95} />
      </RoundedBox>
      {[-0.52, 0.52].map((x) => (
        <RoundedBox
          key={x}
          args={[1.02, 0.14, 0.78]}
          radius={0.06}
          position={[x, 0.42, 0.06]}
        >
          <meshStandardMaterial color={cushion} roughness={0.95} />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[2.3, 0.62, 0.22]}
        radius={0.08}
        position={[0, 0.66, -0.38]}
      >
        <meshStandardMaterial color={fabric} roughness={0.95} />
      </RoundedBox>
      {[-0.52, 0.52].map((x) => (
        <RoundedBox
          key={x}
          args={[1.0, 0.44, 0.18]}
          radius={0.08}
          position={[x, 0.7, -0.22]}
          rotation={[-0.15, 0, 0]}
        >
          <meshStandardMaterial color={cushion} roughness={0.95} />
        </RoundedBox>
      ))}
      {[-1.12, 1.12].map((x) => (
        <RoundedBox
          key={x}
          args={[0.2, 0.62, 0.95]}
          radius={0.08}
          position={[x, 0.36, 0]}
        >
          <meshStandardMaterial color={fabric} roughness={0.95} />
        </RoundedBox>
      ))}
      {/* Throw pillows */}
      <RoundedBox
        args={[0.4, 0.38, 0.12]}
        radius={0.06}
        position={[0.82, 0.68, -0.12]}
        rotation={[-0.2, -0.3, 0.15]}
      >
        <meshStandardMaterial color="#d9a441" roughness={0.9} />
      </RoundedBox>
      <RoundedBox
        args={[0.38, 0.36, 0.12]}
        radius={0.06}
        position={[-0.86, 0.68, -0.12]}
        rotation={[-0.2, 0.3, -0.1]}
      >
        <meshStandardMaterial color="#c86f4c" roughness={0.9} />
      </RoundedBox>
      {[-1.05, 1.05].flatMap((x) =>
        [-0.38, 0.38].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.02, z]}>
            <cylinderGeometry args={[0.025, 0.02, 0.06, 8]} />
            <meshStandardMaterial color="#3a2a1e" />
          </mesh>
        )),
      )}
    </group>
  );
};

// Character-shaped controller holders, the reason for all the parcels.
const CableGuy: React.FC<{ position: Vec3; color: string; rotY?: number }> = ({
  position,
  color,
  rotY = 0,
}) => (
  <group position={position} rotation={[0, rotY, 0]} scale={0.9}>
    <mesh position={[0, 0.008, 0]}>
      <cylinderGeometry args={[0.045, 0.05, 0.016, 16]} />
      <meshStandardMaterial color="#1e1e1e" roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.07, 0]}>
      <capsuleGeometry args={[0.032, 0.06, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.15, 0]}>
      <sphereGeometry args={[0.035, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh
        key={s}
        position={[s * 0.045, 0.13, 0.01]}
        rotation={[0, 0, s * -0.5]}
      >
        <capsuleGeometry args={[0.012, 0.07, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    ))}
    {/* Controller held up in its arms */}
    <RoundedBox
      args={[0.11, 0.035, 0.05]}
      radius={0.015}
      position={[0, 0.17, 0.035]}
    >
      <meshStandardMaterial color="#222" roughness={0.4} />
    </RoundedBox>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.012, 0.16, 0.012]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
    ))}
  </group>
);

export const Parcel: React.FC<{
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
  color?: string;
}> = ({ position, rotation, scale = 1, color = "#c8c8c4" }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <RoundedBox args={[0.26, 0.07, 0.2]} radius={0.03}>
      <meshStandardMaterial color={color} roughness={0.6} />
    </RoundedBox>
    {/* Shipping label */}
    <mesh position={[0.03, 0.036, 0.01]} rotation={[-Math.PI / 2, 0, 0.1]}>
      <planeGeometry args={[0.1, 0.07]} />
      <meshStandardMaterial color="#ffffff" roughness={0.8} />
    </mesh>
    <mesh position={[0.03, 0.037, 0.0]} rotation={[-Math.PI / 2, 0, 0.1]}>
      <planeGeometry args={[0.07, 0.008]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  </group>
);

const Box: React.FC<{ position: Vec3; size: Vec3; rotY?: number }> = ({
  position,
  size,
  rotY = 0,
}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <mesh>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#c49a63" roughness={0.9} />
    </mesh>
    <mesh position={[0, size[1] / 2 + 0.001, 0]}>
      <boxGeometry args={[size[0] + 0.002, 0.002, 0.04]} />
      <meshStandardMaterial color="#d9c8a0" roughness={0.4} />
    </mesh>
  </group>
);

const Door: React.FC<{ open: number }> = ({ open }) => (
  <group position={DOOR_HINGE} rotation={[0, -open, 0]}>
    <group position={[-0.03, 1.02, DOOR_WIDTH / 2]}>
      <mesh>
        <boxGeometry args={[0.05, 2.04, DOOR_WIDTH]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      {[0.45, -0.45].map((y) => (
        <mesh key={y} position={[-0.028, y, 0]}>
          <boxGeometry args={[0.01, 0.75, 0.62]} />
          <meshStandardMaterial color="#e8e2d8" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-0.06, -0.02, 0.36]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial
          color="#c9a85a"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  </group>
);

export const LivingRoom: React.FC<{ doorOpen: number }> = ({ doorOpen }) => {
  const floor = useWoodFloor();
  const rug = useRug();
  const z0 = DOOR_HINGE[2];
  const z1 = z0 + DOOR_WIDTH;
  return (
    <>
      <color attach="background" args={["#1a1410"]} />
      <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#efe6d8" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial map={floor} roughness={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.2, 0.004, -0.75]}>
        <planeGeometry args={[2.8, 1.9]} />
        <meshStandardMaterial map={rug} roughness={1} />
      </mesh>
      {/* Back wall with skirting, pictures and a shelf */}
      <mesh position={[0, 1.35, -2.25]}>
        <boxGeometry args={[9, 2.7, 0.1]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.06, -2.19]}>
        <boxGeometry args={[9, 0.12, 0.03]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      {[
        { x: -0.55, w: 0.5, h: 0.65, c: "#5d7fa1" },
        { x: 0.25, w: 0.7, h: 0.5, c: "#c9895e" },
        { x: 0.95, w: 0.35, h: 0.45, c: "#7e9a6a" },
      ].map((p) => (
        <group key={p.x} position={[p.x, 1.75, -2.19]}>
          <mesh>
            <boxGeometry args={[p.w + 0.06, p.h + 0.06, 0.03]} />
            <meshStandardMaterial color="#2a2420" />
          </mesh>
          <mesh position={[0, 0, 0.017]}>
            <planeGeometry args={[p.w, p.h]} />
            <meshStandardMaterial color={p.c} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Left wall with a dusk window */}
      <mesh position={[-3.4, 1.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7, 2.7, 0.1]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <group position={[-3.34, 1.45, -0.6]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[1.3, 1.1]} />
          <meshBasicMaterial color="#5b77a8" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.04, 1.1, 0.03]} />
          <meshStandardMaterial color={TRIM} />
        </mesh>
        {[-0.8, 0.8].map((x) => (
          <mesh key={x} position={[x, 0, 0.06]}>
            <boxGeometry args={[0.35, 1.5, 0.05]} />
            <meshStandardMaterial color="#7a3e3a" roughness={1} />
          </mesh>
        ))}
      </group>
      {/* Right wall with the front-door opening */}
      <mesh position={[3.25, 1.35, (z0 - 3.5) / 2]}>
        <boxGeometry args={[0.1, 2.7, z0 + 3.5]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[3.25, 1.35, (z1 + 3.5) / 2]}>
        <boxGeometry args={[0.1, 2.7, 3.5 - z1]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[3.25, 2.38, (z0 + z1) / 2]}>
        <boxGeometry args={[0.1, 0.64, DOOR_WIDTH]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      {/* Door frame */}
      {[z0 - 0.03, z1 + 0.03].map((z) => (
        <mesh key={z} position={[3.19, 1.03, z]}>
          <boxGeometry args={[0.04, 2.08, 0.06]} />
          <meshStandardMaterial color={TRIM} />
        </mesh>
      ))}
      <mesh position={[3.19, 2.08, (z0 + z1) / 2]}>
        <boxGeometry args={[0.04, 0.06, DOOR_WIDTH + 0.12]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      {/* Bright hallway beyond the door */}
      <mesh
        position={[4.3, 1.35, (z0 + z1) / 2]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[3, 2.7]} />
        <meshBasicMaterial color="#f3dcb0" />
      </mesh>
      <mesh
        position={[3.8, 0.001, (z0 + z1) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color="#c9a678" />
      </mesh>
      <Door open={doorOpen} />
      <Sofa position={[-0.3, 0, -1.65]} />
      {/* Coffee table loaded with Vinted parcels and Cable Guys */}
      <group position={[-0.25, 0, -0.55]}>
        <RoundedBox
          args={[1.2, 0.05, 0.6]}
          radius={0.02}
          position={[0, 0.42, 0]}
        >
          <meshStandardMaterial color="#7a4e2d" roughness={0.45} />
        </RoundedBox>
        {[-0.54, 0.54].flatMap((x) =>
          [-0.24, 0.24].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.2, z]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial color="#5e3b22" roughness={0.6} />
            </mesh>
          )),
        )}
        <Parcel position={[-0.35, 0.48, 0.05]} rotation={[0, 0.3, 0]} />
        <Parcel
          position={[-0.33, 0.55, 0.02]}
          rotation={[0, -0.2, 0]}
          scale={0.85}
          color="#b9c4c2"
        />
        <Box
          position={[0.38, 0.52, -0.1]}
          size={[0.22, 0.15, 0.18]}
          rotY={0.2}
        />
        <CableGuy position={[0.0, 0.445, 0.12]} color="#d23b3b" rotY={0.2} />
        <CableGuy position={[0.15, 0.445, 0.08]} color="#2f6fd6" rotY={-0.1} />
        <CableGuy position={[-0.12, 0.445, 0.18]} color="#3aa057" rotY={0.4} />
        <CableGuy position={[0.33, 0.445, 0.16]} color="#8b4fc9" rotY={-0.3} />
        <CableGuy position={[0.45, 0.6, -0.1]} color="#f0b429" rotY={0.1} />
      </group>
      {/* More parcels stacked by the sofa */}
      <Box
        position={[1.15, 0.12, -1.75]}
        size={[0.32, 0.24, 0.28]}
        rotY={0.3}
      />
      <Box
        position={[1.17, 0.33, -1.72]}
        size={[0.26, 0.18, 0.22]}
        rotY={-0.2}
      />
      <Parcel position={[1.4, 0.04, -1.45]} rotation={[0, 0.8, 0]} />
      {/* Floor lamp */}
      <group position={[-1.85, 0, -1.85]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
          <meshStandardMaterial
            color="#2a2522"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
          <meshStandardMaterial
            color="#2a2522"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.16, 0.24, 0.3, 24, 1, true]} />
          <meshStandardMaterial
            color="#f4dfb6"
            emissive="#ffcf86"
            emissiveIntensity={0.9}
            side={2}
          />
        </mesh>
      </group>
      {/* Sideboard with a plant */}
      <group position={[2.2, 0, -1.95]}>
        <RoundedBox
          args={[1.1, 0.7, 0.4]}
          radius={0.02}
          position={[0, 0.35, 0]}
        >
          <meshStandardMaterial color="#8a5a36" roughness={0.6} />
        </RoundedBox>
        <mesh position={[0.3, 0.82, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.22, 16]} />
          <meshStandardMaterial color="#e6e1d8" roughness={0.6} />
        </mesh>
        <mesh position={[0.3, 1.05, 0]} scale={[1, 1.2, 1]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#4e7a3d" roughness={0.9} />
        </mesh>
      </group>
    </>
  );
};
