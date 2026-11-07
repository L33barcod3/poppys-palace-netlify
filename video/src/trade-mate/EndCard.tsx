import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bg = interpolate(frame, [0, 12], [0, 0.9], {
    extrapolateRight: "clamp",
  });
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 20, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(20, 33, 61, ${bg})`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          fontSize: 160,
          fontWeight: 800,
          color: "white",
          letterSpacing: -2,
        }}
      >
        Trade <span style={{ color: "#ff8a00" }}>M.A.T.E</span>
      </div>
      <div
        style={{
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
          fontSize: 54,
          fontWeight: 500,
          color: "white",
          marginTop: 10,
        }}
      >
        Try it today.
      </div>
    </AbsoluteFill>
  );
};
