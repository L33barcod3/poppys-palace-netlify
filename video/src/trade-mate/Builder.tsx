import { RoundedBox } from "@react-three/drei";
import type { ReactNode } from "react";
import { Euler, Vector3 } from "three";

export type Mood = "angry" | "neutral" | "happy";
export type Vec3 = [number, number, number];

export type Pose = {
  // Euler rotation of each arm at the shoulder. Negative x swings the arm forward/up.
  leftArm: Vec3;
  rightArm: Vec3;
  headTilt: number;
  headTurn: number;
  mood: Mood;
  // 0 = closed, 1 = wide open
  mouthOpen: number;
  bodyY: number;
  // 0 = eyes open, 1 = shut
  blink?: number;
};

export const SHOULDER_Y = 1.45;
export const SHOULDER_X = 0.32;
export const ARM_LENGTH = 0.62;

const SKIN = "#e8b08a";
const SKIN_SHADE = "#d4956e";
const TROUSERS = "#353a47";
const BOOTS = "#5a3b22";
const SOLE = "#2a1d12";
const BELT = "#3a2a1a";
const GLOVE = "#d9a441";
const STRIPE = "#f2f2f2";

// World position of a hand, for handing a held object over to physics.
export const handWorldPosition = (
  builderPosition: Vec3,
  rotationY: number,
  side: "left" | "right",
  arm: Vec3,
  bodyY: number,
) => {
  const shoulder = new Vector3(
    side === "right" ? -SHOULDER_X : SHOULDER_X,
    SHOULDER_Y + bodyY,
    0,
  );
  return new Vector3(0, -ARM_LENGTH, 0)
    .applyEuler(new Euler(...arm))
    .add(shoulder)
    .applyAxisAngle(new Vector3(0, 1, 0), rotationY)
    .add(new Vector3(...builderPosition));
};

const Arm: React.FC<{
  side: "left" | "right";
  rotation: Vec3;
  sleeve: string;
  item?: ReactNode;
}> = ({ side, rotation, sleeve, item }) => (
  <group
    position={[side === "right" ? -SHOULDER_X : SHOULDER_X, SHOULDER_Y, 0]}
    rotation={rotation}
  >
    <mesh>
      <sphereGeometry args={[0.095, 20, 20]} />
      <meshStandardMaterial color={sleeve} roughness={0.8} />
    </mesh>
    <mesh position={[0, -0.16, 0]}>
      <capsuleGeometry args={[0.075, 0.2, 8, 16]} />
      <meshStandardMaterial color={sleeve} roughness={0.8} />
    </mesh>
    <mesh position={[0, -0.42, 0]}>
      <capsuleGeometry args={[0.06, 0.2, 8, 16]} />
      <meshStandardMaterial color={SKIN} roughness={0.55} />
    </mesh>
    <group position={[0, -ARM_LENGTH, 0]}>
      {/* Rigger glove */}
      <mesh scale={[1, 1.15, 0.85]}>
        <sphereGeometry args={[0.078, 20, 20]} />
        <meshStandardMaterial color={GLOVE} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.072, 0.068, 0.05, 16]} />
        <meshStandardMaterial color="#b5832c" roughness={0.9} />
      </mesh>
      {item}
    </group>
  </group>
);

const Eye: React.FC<{ x: number; blink: number }> = ({ x, blink }) => (
  <group position={[x, 0.035, 0.15]} scale={[1, Math.max(0.08, 1 - blink), 1]}>
    <mesh scale={[1, 1.15, 0.6]}>
      <sphereGeometry args={[0.042, 20, 20]} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} />
    </mesh>
    <mesh position={[0, -0.004, 0.022]}>
      <sphereGeometry args={[0.024, 16, 16]} />
      <meshStandardMaterial color="#2a1a10" roughness={0.1} />
    </mesh>
    <mesh position={[0.009, 0.01, 0.042]}>
      <sphereGeometry args={[0.007, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  </group>
);

const Face: React.FC<{
  mood: Mood;
  mouthOpen: number;
  blink: number;
  moustache?: boolean;
}> = ({ mood, mouthOpen, blink, moustache }) => {
  const browAngle = mood === "angry" ? 0.5 : mood === "happy" ? -0.18 : 0;
  const browY = mood === "happy" ? 0.115 : mood === "angry" ? 0.085 : 0.1;
  return (
    <>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Eye x={side * 0.068} blink={blink} />
          <mesh
            position={[side * 0.07, browY, 0.165]}
            rotation={[0, 0, side * browAngle]}
          >
            <capsuleGeometry args={[0.012, 0.06, 4, 8]} />
            <meshStandardMaterial color="#4a3020" />
          </mesh>
          {/* Cheeks */}
          <mesh position={[side * 0.11, -0.04, 0.12]} scale={[1, 0.7, 0.5]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial
              color={mood === "angry" ? "#e0705a" : "#eda089"}
              roughness={0.6}
            />
          </mesh>
          {/* Ears */}
          <mesh position={[side * 0.19, 0, 0]} scale={[0.5, 1, 0.8]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={SKIN_SHADE} roughness={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.02, 0.185]} scale={[0.9, 1.1, 1]}>
        <sphereGeometry args={[0.034, 16, 16]} />
        <meshStandardMaterial color={SKIN_SHADE} roughness={0.5} />
      </mesh>
      {moustache ? (
        <mesh position={[0, -0.06, 0.17]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.018, 0.07, 4, 8]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.9} />
        </mesh>
      ) : null}
      {mouthOpen > 0.05 ? (
        <mesh position={[0, -0.1, 0.155]} scale={[1, 0.25 + mouthOpen, 0.4]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#5a1f1f" />
        </mesh>
      ) : (
        <mesh
          position={[0, mood === "happy" ? -0.075 : -0.115, 0.158]}
          rotation={[0, 0, mood === "happy" ? Math.PI : 0]}
        >
          <torusGeometry
            args={[0.05, 0.012, 8, 16, mood === "neutral" ? 0.6 : Math.PI]}
          />
          <meshStandardMaterial color="#5a1f1f" />
        </mesh>
      )}
    </>
  );
};

export const Builder: React.FC<{
  position: Vec3;
  rotationY: number;
  vest: string;
  sleeve: string;
  hat: string;
  pose: Pose;
  moustache?: boolean;
  // 0 = standing, 1 = flat on his back (knocked over)
  fall?: number;
  rightHand?: ReactNode;
  leftHand?: ReactNode;
}> = ({
  position,
  rotationY,
  fall = 0,
  vest,
  sleeve,
  hat,
  pose,
  moustache,
  rightHand,
  leftHand,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Falls backwards, pivoting at the heels; lifted so he lies on the ground */}
    <group
      position={[0, 0.17 * Math.min(1, fall), -0.12 * fall]}
      rotation={[-fall * Math.PI * 0.48, 0, 0]}
    >
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.12, 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.095, 0.55, 8, 16]} />
            <meshStandardMaterial color={TROUSERS} roughness={0.85} />
          </mesh>
          <RoundedBox
            args={[0.2, 0.15, 0.33]}
            radius={0.05}
            position={[0, 0.09, 0.04]}
          >
            <meshStandardMaterial color={BOOTS} roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.015, 0.04]}>
            <boxGeometry args={[0.21, 0.03, 0.34]} />
            <meshStandardMaterial color={SOLE} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <group position={[0, pose.bodyY, 0]}>
        {/* T-shirt torso */}
        <RoundedBox
          args={[0.56, 0.66, 0.34]}
          radius={0.12}
          position={[0, 1.17, 0]}
        >
          <meshStandardMaterial color={sleeve} roughness={0.85} />
        </RoundedBox>
        {/* Hi-vis vest */}
        <RoundedBox
          args={[0.585, 0.5, 0.36]}
          radius={0.09}
          position={[0, 1.16, 0]}
        >
          <meshStandardMaterial
            color={vest}
            emissive={vest}
            emissiveIntensity={0.12}
            roughness={0.55}
          />
        </RoundedBox>
        {[1.03, 1.2].map((y) => (
          <RoundedBox
            key={y}
            args={[0.595, 0.045, 0.37]}
            radius={0.02}
            position={[0, y, 0]}
          >
            <meshStandardMaterial
              color={STRIPE}
              emissive="#ffffff"
              emissiveIntensity={0.35}
              metalness={0.6}
              roughness={0.25}
            />
          </RoundedBox>
        ))}
        {/* Tool belt with pouch and buckle */}
        <RoundedBox
          args={[0.58, 0.08, 0.36]}
          radius={0.03}
          position={[0, 0.86, 0]}
        >
          <meshStandardMaterial color={BELT} roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.86, 0.185]}>
          <boxGeometry args={[0.07, 0.06, 0.01]} />
          <meshStandardMaterial
            color="#c9b37a"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        <RoundedBox
          args={[0.14, 0.16, 0.08]}
          radius={0.03}
          position={[0.24, 0.77, 0.12]}
        >
          <meshStandardMaterial color="#6b4a2b" roughness={0.75} />
        </RoundedBox>
        <mesh position={[0.24, 0.9, 0.12]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
          <meshStandardMaterial color="#e23b2e" />
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.14, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <Arm
          side="right"
          rotation={pose.rightArm}
          sleeve={sleeve}
          item={rightHand}
        />
        <Arm
          side="left"
          rotation={pose.leftArm}
          sleeve={sleeve}
          item={leftHand}
        />
        <group
          position={[0, 1.79, 0]}
          rotation={[pose.headTilt, pose.headTurn, 0]}
        >
          <mesh scale={[1, 1.06, 0.98]}>
            <sphereGeometry args={[0.19, 40, 40]} />
            <meshStandardMaterial color={SKIN} roughness={0.5} />
          </mesh>
          {/* Hard hat: dome, brim, ridge */}
          <mesh position={[0, 0.045, 0]}>
            <sphereGeometry
              args={[0.205, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color={hat}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, 0.045, 0.035]} scale={[1, 1, 1.12]}>
            <cylinderGeometry args={[0.25, 0.255, 0.02, 40]} />
            <meshStandardMaterial color={hat} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.235, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.022, 0.26, 4, 8]} />
            <meshStandardMaterial color={hat} roughness={0.25} />
          </mesh>
          <Face
            mood={pose.mood}
            mouthOpen={pose.mouthOpen}
            blink={pose.blink ?? 0}
            moustache={moustache}
          />
        </group>
      </group>
    </group>
  </group>
);
