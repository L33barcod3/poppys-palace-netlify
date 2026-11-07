import { Easing, interpolate } from "remotion";
import type { Pose, Vec3 } from "./Builder";
import { isSpeaking, SPEECH, T } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

const talk = (frame: number, speaking: boolean) =>
  speaking ? 0.2 + 0.8 * Math.abs(Math.sin(frame * 0.55)) : 0;

const arms = (x: number, z: number): { rightArm: Vec3; leftArm: Vec3 } => ({
  rightArm: [x, 0, -z],
  leftArm: [x, 0, z],
});

// Builder A: the frustrated one.
const blinkAt = (frame: number, offset: number) =>
  (frame + offset) % 97 < 4
    ? Math.sin((((frame + offset) % 97) / 4) * Math.PI)
    : 0;

// How far over each builder has been knocked by the logo stamp (0..1, bouncy).
export const knockedOver = (frame: number, delay: number) =>
  interpolate(frame, [T.stamp + 1 + delay, T.stamp + 15 + delay], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.bounce),
  });

// Arms fly up and mouth drops open when the stamp lands.
const shocked = (pose: Pose, frame: number, delay: number): Pose => {
  const k = interpolate(
    frame,
    [T.stamp + delay, T.stamp + 6 + delay],
    [0, 1],
    clamp,
  );
  if (k === 0) return pose;
  return {
    ...pose,
    rightArm: [-2.6, 0, -0.7],
    leftArm: [-2.6, 0, 0.7],
    mood: "neutral",
    mouthOpen: 0.8,
    headTilt: -0.3,
    bodyY: 0,
  };
};

export const poseA = (frame: number): Pose => ({
  ...shocked(basePoseA(frame), frame, 0),
  blink: blinkAt(frame, 20),
});

const basePoseA = (frame: number): Pose => {
  const speaking = isSpeaking(frame, SPEECH.a);
  const breathe = 0.008 * Math.sin(frame * 0.12);

  if (frame < T.raiseTools) {
    return {
      ...arms(-0.35 + 0.18 * Math.sin(frame * 0.25), 0.15),
      headTilt: 0.05,
      headTurn: frame > 40 ? 0.28 * Math.sin(frame * 0.3) : 0,
      mood: "angry",
      mouthOpen: talk(frame, speaking),
      bodyY: breathe,
    };
  }

  if (frame < T.bTalks) {
    // Raise both tools overhead, then slam them down.
    const raised = interpolate(frame, [T.raiseTools, T.slam], [-0.35, -2.9], {
      ...clamp,
      easing: ease,
    });
    const x = interpolate(
      frame,
      [T.slam, T.release + 2, T.bTalks],
      [raised, -0.45, -0.15],
      {
        ...clamp,
        easing: Easing.out(Easing.quad),
      },
    );
    return {
      ...arms(frame < T.slam ? raised : x, 0.25),
      headTilt: frame < T.slam ? -0.15 : 0.15,
      headTurn: 0,
      mood: "angry",
      mouthOpen: speaking ? 0.95 : 0,
      bodyY: frame < T.slam ? 0.03 : breathe,
    };
  }

  if (frame < T.phoneOut) {
    // Sulking while B talks.
    return {
      ...arms(-0.12, 0.1),
      headTilt: 0.18,
      headTurn: 0.15,
      mood: frame < 240 ? "angry" : "neutral",
      mouthOpen: 0,
      bodyY: breathe,
    };
  }

  if (frame < T.celebrate) {
    // Looking at the phone.
    const lift = interpolate(
      frame,
      [T.phoneOut, T.phoneOut + 15],
      [-0.12, -1.05],
      {
        ...clamp,
        easing: ease,
      },
    );
    return {
      rightArm: [lift, 0.5, 0.75],
      leftArm: [-0.12, 0, 0.1],
      headTilt: 0.3,
      headTurn: 0,
      mood: frame < 355 ? "neutral" : "happy",
      mouthOpen: 0,
      bodyY: breathe,
    };
  }

  // Celebrating.
  const up = interpolate(
    frame,
    [T.celebrate, T.celebrate + 10],
    [-1.05, -2.75],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.5)),
    },
  );
  const wave = 0.15 * Math.sin(frame * 0.4);
  return {
    rightArm: [up + wave, 0, -0.4],
    leftArm: [up - wave, 0, 0.4],
    headTilt: -0.1,
    headTurn: 0,
    mood: "happy",
    mouthOpen: talk(frame, speaking),
    bodyY: 0.07 * Math.abs(Math.sin(frame * 0.32)),
  };
};

// Builder B: the one who knows about the app.
export const poseB = (frame: number): Pose => ({
  ...shocked(basePoseB(frame), frame, 3),
  blink: blinkAt(frame, 61),
});

const basePoseB = (frame: number): Pose => {
  const speaking = isSpeaking(frame, SPEECH.b);
  const breathe = 0.008 * Math.sin(frame * 0.12 + 1);

  if (frame < T.bTalks) {
    return {
      ...arms(-0.1, 0.1),
      headTilt: frame > T.release ? -0.05 : 0.05,
      headTurn: 0,
      mood: "neutral",
      mouthOpen: 0,
      bodyY: breathe,
    };
  }

  if (frame < T.phoneOut) {
    const gesture = interpolate(
      frame,
      [T.bTalks, T.bTalks + 12],
      [-0.1, -1.15],
      {
        ...clamp,
        easing: ease,
      },
    );
    return {
      rightArm: [gesture + 0.15 * Math.sin(frame * 0.2), 0, -0.25],
      leftArm: [-0.1, 0, 0.1],
      headTilt: 0,
      headTurn: 0.08 * Math.sin(frame * 0.15),
      mood: "happy",
      mouthOpen: talk(frame, speaking),
      bodyY: breathe,
    };
  }

  return {
    ...arms(-0.1, 0.1),
    headTilt: frame >= T.celebrate ? 0.12 * Math.sin(frame * 0.3) : 0.1,
    headTurn: 0,
    mood: "happy",
    mouthOpen: 0,
    bodyY: breathe,
  };
};
