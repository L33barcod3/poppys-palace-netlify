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
};

export const SHOULDER_Y = 1.45;
export const SHOULDER_X = 0.32;
export const ARM_LENGTH = 0.62;

const SKIN = "#e0ac85";
const TROUSERS = "#3b3f4a";
const BOOTS = "#4a3426";
const STRIPE = "#e6e6e6";

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
    <mesh position={[0, -0.15, 0]}>
      <boxGeometry args={[0.16, 0.32, 0.16]} />
      <meshStandardMaterial color={sleeve} />
    </mesh>
    <mesh position={[0, -0.45, 0]}>
      <boxGeometry args={[0.12, 0.32, 0.12]} />
      <meshStandardMaterial color={SKIN} />
    </mesh>
    <group position={[0, -ARM_LENGTH, 0]}>
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>
      {item}
    </group>
  </group>
);

const Face: React.FC<{ mood: Mood; mouthOpen: number }> = ({
  mood,
  mouthOpen,
}) => {
  const browAngle = mood === "angry" ? 0.45 : mood === "happy" ? -0.15 : 0;
  const browY = mood === "happy" ? 0.1 : 0.085;
  return (
    <>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.065, 0.03, 0.155]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial color="#1b1b1b" />
          </mesh>
          <mesh
            position={[side * 0.065, browY, 0.16]}
            rotation={[0, 0, side * browAngle]}
          >
            <boxGeometry args={[0.075, 0.018, 0.015]} />
            <meshStandardMaterial color="#3a2a1e" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.015, 0.175]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color="#d49873" />
      </mesh>
      {mouthOpen > 0.05 ? (
        <mesh position={[0, -0.08, 0.155]} scale={[1, 0.25 + mouthOpen, 0.4]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#5a1f1f" />
        </mesh>
      ) : (
        <mesh
          position={[0, mood === "happy" ? -0.06 : -0.1, 0.158]}
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
  rightHand?: ReactNode;
  leftHand?: ReactNode;
}> = ({
  position,
  rotationY,
  vest,
  sleeve,
  hat,
  pose,
  rightHand,
  leftHand,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Soft contact shadow */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <circleGeometry args={[0.45, 32]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.25} />
    </mesh>
    {[-1, 1].map((side) => (
      <group key={side} position={[side * 0.12, 0, 0]}>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.18, 0.8, 0.2]} />
          <meshStandardMaterial color={TROUSERS} />
        </mesh>
        <mesh position={[0, 0.06, 0.04]}>
          <boxGeometry args={[0.2, 0.12, 0.3]} />
          <meshStandardMaterial color={BOOTS} />
        </mesh>
      </group>
    ))}
    <group position={[0, pose.bodyY, 0]}>
      {/* Hi-vis torso with reflective stripes */}
      <mesh position={[0, 1.18, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.3]} />
        <meshStandardMaterial color={vest} />
      </mesh>
      {[1.02, 1.22].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.56, 0.045, 0.31]} />
          <meshStandardMaterial
            color={STRIPE}
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.57, 0]}>
        <cylinderGeometry args={[0.065, 0.07, 0.12, 16]} />
        <meshStandardMaterial color={SKIN} />
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
        position={[0, 1.78, 0]}
        rotation={[pose.headTilt, pose.headTurn, 0]}
      >
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        {/* Hard hat */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry
            args={[0.195, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color={hat} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.04, 0.03]}>
          <cylinderGeometry args={[0.24, 0.24, 0.022, 32]} />
          <meshStandardMaterial color={hat} roughness={0.35} />
        </mesh>
        <Face mood={pose.mood} mouthOpen={pose.mouthOpen} />
      </group>
    </group>
  </group>
);
