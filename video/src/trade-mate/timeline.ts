import { VOICE_LINES } from "./voice-lines";

// All timings in frames at 30 fps. Keep in sync with public/trade-mate.srt.
export const FPS = 30;

export const T = {
  raiseTools: 120,
  slam: 145,
  release: 150,
  bTalks: 180,
  phoneOut: 285,
  overlayIn: 300,
  overlayOut: 372,
  celebrate: 390,
  endCard: 480,
  // The logo stamps onto the screen; the thump knocks both builders over.
  stamp: 488,
  total: 570,
} as const;

// When each character is speaking (frames), from the generated voiceover.
const toFrames = (speaker: "a" | "b") =>
  VOICE_LINES.filter((l) => l.speaker === speaker).map(
    (l) => [Math.round(l.start * FPS), Math.round(l.end * FPS)] as const,
  );

export const SPEECH = { a: toFrames("a"), b: toFrames("b") };

export const isSpeaking = (
  frame: number,
  ranges: readonly (readonly [number, number])[],
) => ranges.some(([from, to]) => frame >= from && frame <= to);
