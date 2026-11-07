import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { Vec3 } from "./Person";
import { T } from "./timeline";

type Shot = {
  from: number;
  to: number;
  pos: [Vec3, Vec3];
  target: [Vec3, Vec3];
};

const SHOTS: Shot[] = [
  // Lee on the sofa, scrolling.
  {
    from: 0,
    to: T.doorBang,
    pos: [
      [0.5, 1.55, 3.3],
      [0.35, 1.45, 2.9],
    ],
    target: [
      [-0.3, 0.95, -1.2],
      [-0.35, 0.95, -1.25],
    ],
  },
  // Door bangs open; she storms in.
  {
    from: T.doorBang,
    to: T.walkEnd,
    pos: [
      [-1.7, 1.65, 2.5],
      [-1.5, 1.6, 2.2],
    ],
    target: [
      [1.5, 1.1, -0.8],
      [1.0, 1.15, -0.8],
    ],
  },
  // Medium shot of her rant, from Lee's side of the room.
  {
    from: T.walkEnd,
    to: T.leeReplies,
    pos: [
      [-0.35, 1.6, -1.2],
      [-0.15, 1.62, -1.08],
    ],
    target: [
      [1.2, 1.6, -0.55],
      [1.2, 1.62, -0.55],
    ],
  },
  // Her point of view: Lee, sheepish.
  {
    from: T.leeReplies,
    to: T.deadpan,
    pos: [
      [0.6, 1.55, -0.65],
      [0.4, 1.5, -0.8],
    ],
    target: [
      [-0.55, 1.15, -1.6],
      [-0.55, 1.18, -1.6],
    ],
  },
  // Her deadpan stare.
  {
    from: T.deadpan,
    to: T.total,
    pos: [
      [0.05, 1.6, -1.25],
      [0.35, 1.66, -1.05],
    ],
    target: [
      [1.2, 1.68, -0.55],
      [1.2, 1.7, -0.55],
    ],
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
    const mix = (a: Vec3, b: Vec3) =>
      a.map((v, i) => v + (b[i] - v) * p) as Vec3;
    // Little jolt when the door slams into the wall.
    const jolt =
      frame >= T.doorBang + 4 && frame < T.doorBang + 16
        ? 0.035 * (1 - (frame - T.doorBang - 4) / 12)
        : 0;
    const pos = mix(...shot.pos);
    camera.position.set(
      pos[0] + Math.sin(frame * 2.1) * jolt,
      pos[1] + Math.cos(frame * 2.9) * jolt,
      pos[2],
    );
    camera.lookAt(...mix(...shot.target));
  }, [camera, frame]);
  return null;
};
