import { VOICE_LINES } from "./voice-lines";

export const FPS = 30;

export const T = {
  doorBang: 38,
  walkStart: 40,
  walkEnd: 100,
  rant: 102,
  leeReplies: 228,
  deadpan: 300,
  total: 375,
} as const;

const toFrames = (speaker: "lee" | "gf") =>
  VOICE_LINES.filter((l) => l.speaker === speaker).map(
    (l) => [Math.round(l.start * FPS), Math.round(l.end * FPS)] as const,
  );

export const SPEECH = { lee: toFrames("lee"), gf: toFrames("gf") };

export const isSpeaking = (
  frame: number,
  ranges: readonly (readonly [number, number])[],
) => ranges.some(([from, to]) => frame >= from && frame <= to);
