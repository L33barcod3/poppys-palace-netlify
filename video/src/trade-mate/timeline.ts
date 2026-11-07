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
  total: 540,
} as const;

// When each character is speaking (frames), used for mouth movement.
export const SPEECH = {
  a: [
    [12, 114],
    [129, 174],
    [396, 444],
  ],
  b: [[186, 279]],
} as const;

export const isSpeaking = (
  frame: number,
  ranges: readonly (readonly [number, number])[],
) => ranges.some(([from, to]) => frame >= from && frame <= to);
