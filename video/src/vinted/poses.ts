import { Easing, interpolate } from "remotion";
import type { PersonPose, Vec3 } from "./Person";
import { isSpeaking, SPEECH, T } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const lerp = (frame: number, range: [number, number], out: [number, number]) =>
  interpolate(frame, range, out, { ...clamp, easing: ease });

const talk = (frame: number, speaking: boolean) =>
  speaking ? 0.15 + 0.85 * Math.abs(Math.sin(frame * 0.6)) : 0;

const blinkAt = (frame: number, offset: number) =>
  (frame + offset) % 89 < 4
    ? Math.sin((((frame + offset) % 89) / 4) * Math.PI)
    : 0;

// ---------- Lee, on the sofa ----------

export const LEE_POS: Vec3 = [-0.55, 0, -1.58];
export const LEE_ROT = 0;

export const poseLee = (frame: number): PersonPose => {
  const speaking = isSpeaking(frame, SPEECH.lee);
  const startled = lerp(frame, [T.doorBang, T.doorBang + 8], [0, 1]);
  const shrug = lerp(frame, [T.leeReplies + 4, T.leeReplies + 16], [0, 1]);
  const shrugDown = lerp(frame, [T.deadpan, T.deadpan + 20], [0, 1]);
  const s = shrug * (1 - shrugDown * 0.6);
  return {
    hipL: 1.5,
    hipR: 1.5,
    kneeL: 1.45,
    kneeR: 1.5,
    spine:
      -0.14 -
      0.08 * lerp(frame, [T.rant, T.rant + 40], [0, 1]) -
      0.08 * shrugDown,
    torsoTurn: 0.15 * startled,
    // Phone in the right hand, lowered when the door bangs, out for the shrug.
    armR: {
      shoulder: [-0.45 + 0.25 * startled - 0.05 * s, 0, 0.1 - 0.55 * s],
      elbow: -1.25 + 0.35 * startled - 0.2 * s,
    },
    armL: {
      shoulder: [-0.25 - 0.05 * s, 0, -0.08 + 0.55 * s],
      elbow: -0.9 - 0.5 * s,
    },
    headTilt: 0.35 * (1 - startled) - 0.12 * startled + 0.05 * s,
    headTurn:
      0.85 * startled - 0.1 * lerp(frame, [T.rant, T.rant + 20], [0, 1]),
    mood:
      frame < T.doorBang
        ? "neutral"
        : frame < T.rant + 50
          ? "neutral"
          : "sheepish",
    mouthOpen: talk(frame, speaking),
    blink:
      frame >= T.doorBang && frame < T.doorBang + 40 ? 0 : blinkAt(frame, 13),
    bodyY: -0.42 + 0.025 * s,
  };
};

// ---------- Girlfriend, storming in ----------

const DOOR_OUTSIDE: [number, number] = [3.9, -0.7];
const STOP: [number, number] = [1.2, -0.55];
const FACE_LEE = Math.atan2(-0.55 - 1.2 + 0.0, -1.58 + 0.55) - 0.0;

export const gfPlacement = (frame: number): { pos: Vec3; rotY: number } => {
  const p = interpolate(frame, [T.walkStart, T.walkEnd], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const x = DOOR_OUTSIDE[0] + (STOP[0] - DOOR_OUTSIDE[0]) * p;
  const z = DOOR_OUTSIDE[1] + (STOP[1] - DOOR_OUTSIDE[1]) * p;
  const walkDir = Math.atan2(
    STOP[0] - DOOR_OUTSIDE[0],
    STOP[1] - DOOR_OUTSIDE[1],
  );
  const turn = lerp(frame, [T.walkEnd - 18, T.walkEnd + 4], [0, 1]);
  return { pos: [x, 0, z], rotY: walkDir + (FACE_LEE - walkDir) * turn };
};

// Stride phase for the walk cycle; also used to time footstep sounds.
export const STEPS = 6;
export const walkPhase = (frame: number) =>
  interpolate(frame, [T.walkStart, T.walkEnd], [0, STEPS * Math.PI], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });

export const poseGf = (frame: number): PersonPose => {
  const speaking = isSpeaking(frame, SPEECH.gf);
  const walking = frame >= T.walkStart && frame < T.walkEnd;
  const ph = walkPhase(frame);
  const stride = walking
    ? 1 - lerp(frame, [T.walkEnd - 10, T.walkEnd], [0, 1])
    : 0;
  const sw = Math.sin(ph) * stride;

  const base: PersonPose = {
    hipL: 0.45 * sw,
    hipR: -0.45 * sw,
    kneeL: 0.08 + 0.6 * Math.max(0, -Math.sin(ph)) * stride,
    kneeR: 0.08 + 0.6 * Math.max(0, Math.sin(ph)) * stride,
    spine: 0.08 * stride,
    torsoTurn: 0.08 * sw,
    // Carrying the parcel in her left hand, right arm swinging.
    armL: { shoulder: [-0.35, 0, 0.12], elbow: -1.25 },
    armR: { shoulder: [0.35 * sw - 0.05, 0, -0.12], elbow: -0.35 },
    headTilt: 0,
    headTurn: 0,
    mood: "angry",
    mouthOpen: talk(frame, speaking),
    blink: blinkAt(frame, 40),
    bodyY: 0.025 * Math.abs(Math.cos(ph)) * stride,
  };

  if (frame < T.rant - 2) return base;

  if (frame < T.leeReplies) {
    // Brandishing the parcel, jabbing a finger at the table.
    const up = lerp(frame, [T.rant - 2, T.rant + 10], [0, 1]);
    const shake = Math.sin(frame * 0.9) * 0.12 * up;
    return {
      ...base,
      armL: {
        shoulder: [-0.35 - 1.15 * up + shake, 0, 0.12 + 0.2 * up],
        elbow: -1.25 + 0.6 * up,
      },
      armR: {
        shoulder: [-0.05 - 0.8 * up, 0.3 * up, -0.12 - 0.1 * up],
        elbow: -0.35 + 0.15 * up,
      },
      spine: 0.06,
      headTilt: -0.04 + 0.05 * Math.sin(frame * 0.45),
      headTurn: 0.06 * Math.sin(frame * 0.3),
    };
  }

  // Arms drop to her sides, unimpressed; slow head shake at the end.
  const drop = lerp(frame, [T.leeReplies, T.leeReplies + 12], [0, 1]);
  const shakeHead =
    frame > T.deadpan + 35
      ? 0.13 * Math.sin((frame - T.deadpan - 35) * 0.25)
      : 0;
  return {
    ...base,
    armL: {
      shoulder: [-0.35 + 0.33 * drop, 0, 0.12 - 0.04 * drop],
      elbow: -1.25 + 1.1 * drop,
    },
    armR: {
      shoulder: [-0.05 + 0.03 * drop, 0, -0.12 + 0.04 * drop],
      elbow: -0.35 + 0.2 * drop,
    },
    spine: -0.03,
    headTilt: 0.06,
    headTurn: shakeHead,
    // Long, slow "are you serious" blink.
    blink:
      frame >= T.deadpan + 12 && frame < T.deadpan + 26
        ? Math.sin(((frame - T.deadpan - 12) / 14) * Math.PI)
        : 0,
  };
};

export const gfHoldsParcel = (frame: number) => frame < T.leeReplies;
