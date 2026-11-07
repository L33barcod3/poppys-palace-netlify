import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { Vec3 } from "./Builder";
import { T } from "./timeline";

type Shot = { from: number; to: number; pos: [Vec3, Vec3]; target: Vec3 };

// One shot per scene; hard cuts between them, slow push-ins within.
const SHOTS: Shot[] = [
  {
    from: 0,
    to: T.raiseTools,
    pos: [
      [0, 2.0, 6.2],
      [0, 1.75, 4.6],
    ],
    target: [0, 1.15, 0],
  },
  {
    from: T.raiseTools,
    to: T.bTalks,
    pos: [
      [-0.1, 1.5, 3.5],
      [-0.25, 1.45, 3.1],
    ],
    target: [-0.75, 1.2, 0.3],
  },
  {
    from: T.bTalks,
    to: T.phoneOut,
    pos: [
      [-0.25, 1.75, 2.7],
      [-0.1, 1.75, 2.35],
    ],
    target: [0.9, 1.5, 0],
  },
  {
    from: T.phoneOut,
    to: T.celebrate,
    pos: [
      [0.35, 1.8, 2.3],
      [0.2, 1.75, 2.0],
    ],
    target: [-0.85, 1.45, 0.1],
  },
  {
    from: T.celebrate,
    to: T.endCard,
    pos: [
      [0, 1.9, 4.7],
      [0, 1.8, 4.2],
    ],
    target: [0, 1.25, 0],
  },
  // End card: builders in the lower half, room for the logo stamp above.
  {
    from: T.endCard,
    to: T.total,
    pos: [
      [0, 1.5, 5.6],
      [0, 1.45, 5.2],
    ],
    target: [0, 2.0, 0],
  },
];

export const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    const shot = SHOTS.find((s) => frame < s.to) ?? SHOTS[SHOTS.length - 1];
    const p = interpolate(frame, [shot.from, shot.to], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    });
    const [a, b] = shot.pos;
    const decay = (start: number, length: number, amount: number) =>
      frame >= start && frame < start + length
        ? amount * (1 - (frame - start) / length)
        : 0;
    // Shake when the tools hit the ground, and a big one for the logo stamp.
    const shake = decay(T.release + 7, 22, 0.06) + decay(T.stamp, 30, 0.14);
    camera.position.set(
      a[0] + (b[0] - a[0]) * p + Math.sin(frame * 2.3) * shake,
      a[1] + (b[1] - a[1]) * p + Math.cos(frame * 3.1) * shake,
      a[2] + (b[2] - a[2]) * p,
    );
    camera.lookAt(...shot.target);
  }, [camera, frame]);

  return null;
};
