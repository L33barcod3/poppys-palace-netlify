import { useCurrentFrame, useVideoConfig } from "remotion";
import { Vector3 } from "three";
import type { Vec3 } from "./Builder";
import { handWorldPosition } from "./Builder";
import { Hammer, Spanner } from "./Props";

const G = 9.8;

// Ballistic flight with a couple of damped bounces, as a pure function of time.
const flight = (
  t: number,
  start: Vector3,
  velocity: Vector3,
  groundY: number,
) => {
  let pos = start.clone();
  let vel = velocity.clone();
  let time = t;
  for (let bounce = 0; bounce < 3; bounce++) {
    const c = pos.y - groundY;
    const hit = (vel.y + Math.sqrt(vel.y * vel.y + 2 * G * c)) / G;
    if (time < hit) {
      return new Vector3(
        pos.x + vel.x * time,
        pos.y + vel.y * time - 0.5 * G * time * time,
        pos.z + vel.z * time,
      );
    }
    pos = new Vector3(pos.x + vel.x * hit, groundY, pos.z + vel.z * hit);
    vel = new Vector3(vel.x * 0.45, -(vel.y - G * hit) * 0.35, vel.z * 0.45);
    time -= hit;
  }
  return pos;
};

export const FallingTools: React.FC<{
  releaseFrame: number;
  builderPosition: Vec3;
  rotationY: number;
  rightArm: Vec3;
  leftArm: Vec3;
  bodyY: number;
}> = ({
  releaseFrame,
  builderPosition,
  rotationY,
  rightArm,
  leftArm,
  bodyY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - releaseFrame) / fps;
  const forward = new Vector3(Math.sin(rotationY), 0, Math.cos(rotationY));
  const side = new Vector3(Math.cos(rotationY), 0, -Math.sin(rotationY));

  const hammer = flight(
    t,
    handWorldPosition(builderPosition, rotationY, "right", rightArm, bodyY),
    forward
      .clone()
      .multiplyScalar(1.1)
      .add(side.clone().multiplyScalar(0.3))
      .setY(-2.5),
    0.03,
  );
  const spanner = flight(
    t,
    handWorldPosition(builderPosition, rotationY, "left", leftArm, bodyY),
    forward
      .clone()
      .multiplyScalar(0.9)
      .add(side.clone().multiplyScalar(-0.4))
      .setY(-2.2),
    0.012,
  );
  const spin = 3 * Math.PI * Math.max(0, 1 - t / 0.55);

  return (
    <>
      <Hammer
        position={hammer.toArray()}
        rotation={[Math.PI / 2 + spin, 0, 0.6 + spin * 0.3]}
      />
      <Spanner
        position={spanner.toArray()}
        rotation={[Math.PI / 2 + spin * 1.2, 0, -0.8]}
      />
    </>
  );
};
