import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";

const ORANGE = "#ff8a00";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The logo drops in from huge and stamps onto the screen at `impactAt`.
export const EndCard: React.FC<{ impactAt: number }> = ({ impactAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drop = interpolate(frame, [0, impactAt], [5, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const squash =
    frame < impactAt
      ? 1
      : 1 +
        0.12 *
          Math.exp(-(frame - impactAt) * 0.35) *
          Math.cos((frame - impactAt) * 0.9);
  const opacity = interpolate(frame, [0, 3], [0, 1], clamp);
  const after = frame - impactAt;
  const shakeAmt = after >= 0 && after < 14 ? (1 - after / 14) * 18 : 0;
  const shakeX = Math.sin(frame * 2.7) * shakeAmt;
  const shakeY = Math.cos(frame * 3.3) * shakeAmt;

  const ring = interpolate(after, [0, 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const flash = interpolate(after, [0, 6], [0.55, 0], clamp);
  const tagline = spring({
    frame: frame - impactAt - 12,
    fps,
    config: { damping: 200 },
  });
  const shine = interpolate(after, [10, 40], [-120, 220], clamp);
  const shade = interpolate(frame, [0, impactAt], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Darken the top of the frame so the logo reads over the sky */}
      <AbsoluteFill
        style={{
          opacity: shade,
          background:
            "linear-gradient(180deg, rgba(12,18,38,0.75) 0%, rgba(12,18,38,0.35) 45%, rgba(12,18,38,0) 70%)",
        }}
      />
      {after >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 300,
            width: 1400 * ring,
            height: 1400 * ring * 0.45,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: `${14 * (1 - ring) + 2}px solid rgba(255,138,0,${0.8 * (1 - ring)})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 300,
          opacity,
          transform: `translate(calc(-50% + ${shakeX}px), calc(-50% + ${shakeY}px)) scale(${drop * squash}) rotate(-5deg)`,
          padding: "26px 64px 30px",
          border: `10px solid ${ORANGE}`,
          outline: `4px solid ${ORANGE}`,
          outlineOffset: 8,
          borderRadius: 26,
          background: "rgba(12,18,38,0.82)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,138,0,${0.5 * Math.max(0, 1 - after / 30)})`,
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
            color: "white",
          }}
        >
          Trade{" "}
          <span
            style={{
              background: `linear-gradient(180deg, #ffd27a 0%, ${ORANGE} 55%, #e05a00 100%)`,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            M.A.T.E
          </span>
        </div>
        {/* Light sweep across the stamp */}
        <div
          style={{
            position: "absolute",
            top: -40,
            bottom: -40,
            left: `${shine}%`,
            width: 140,
            transform: "skewX(-20deg)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          textAlign: "center",
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 30}px)`,
          fontSize: 56,
          fontWeight: 700,
          color: "white",
          textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        Try it today.
      </div>
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};
