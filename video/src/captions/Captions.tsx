import type { Caption, TikTokPage } from "@remotion/captions";
import { createTikTokStyleCaptions, parseSrt } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Inter";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

// SRT files only have line-level timing. Split each line into words with
// evenly distributed timings so pages and word highlighting work.
// Word-level JSON (e.g. from Whisper via @remotion/install-whisper-cpp)
// is used as-is.
const toWordCaptions = (lines: Caption[]): Caption[] =>
  lines.flatMap((line) => {
    const words = line.text.trim().split(/\s+/);
    const step = (line.endMs - line.startMs) / words.length;
    return words.map((word, i) => ({
      text: ` ${word}`,
      startMs: line.startMs + i * step,
      endMs: line.startMs + (i + 1) * step,
      timestampMs: null,
      confidence: null,
      // Never merge words from different subtitle lines onto one page.
      pageBreakAfter: i === words.length - 1,
    }));
  });

// Higher = more words on screen at once
const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const Captions: React.FC<{ src: string; highlightColor: string }> = ({
  src,
  highlightColor,
}) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading captions"));
  const { fps } = useVideoConfig();

  const load = useCallback(async () => {
    try {
      const text = await (await fetch(src)).text();
      const parsed: Caption[] = src.endsWith(".json")
        ? JSON.parse(text)
        : toWordCaptions(parseSrt({ input: text }).captions);
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [src, continueRender, cancelRender, handle]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({
            captions,
            combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
          }).pages
        : [],
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          Math.min(
            next ? (next.startMs / 1000) * fps : Infinity,
            (page.tokens[page.tokens.length - 1].toMs / 1000) * fps,
          ),
        );
        const durationInFrames = endFrame - startFrame;
        if (durationInFrames <= 0) return null;
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <CaptionPage page={page} highlightColor={highlightColor} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage; highlightColor: string }> = ({
  page,
  highlightColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          whiteSpace: "pre-wrap",
          textAlign: "center",
          maxWidth: "80%",
          textShadow: "0 4px 16px rgba(0,0,0,0.8)",
        }}
      >
        {page.tokens.map((token, i) => (
          <span
            key={`${token.fromMs}-${i}`}
            style={{
              color:
                token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs
                  ? highlightColor
                  : "white",
            }}
          >
            {token.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
