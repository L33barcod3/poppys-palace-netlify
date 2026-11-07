import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";

const ORANGE = "#ff8a00";
const NAVY = "#14213d";

// Placeholder app screen. Swap in real Trade M.A.T.E screenshots or branding.
const LINES = [
  ["Materials", "£2,180"],
  ["Labour (3 days)", "£1,800"],
  ["Skip hire", "£270"],
] as const;

export const PhoneOverlay: React.FC<{ exitAt: number }> = ({ exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });
  const exit = interpolate(frame, [exitAt, exitAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(enter, [0, 1], [1100, 0]) + exit * 1100;

  const itemIn = (i: number) =>
    spring({ frame: frame - 18 - i * 9, fps, config: { damping: 200 } });
  const totalIn = itemIn(LINES.length + 0.5);
  const pulse = 1 + 0.04 * Math.max(0, Math.sin((frame - 60) * 0.25));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 200,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px) rotate(${-4 + enter * 4}deg)`,
          width: 440,
          height: 900,
          borderRadius: 60,
          background: "#0d0d0d",
          padding: 18,
          boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 44,
            background: "#f5f6f8",
            overflow: "hidden",
            fontFamily,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ background: NAVY, padding: "56px 32px 28px" }}>
            <div style={{ color: ORANGE, fontSize: 38, fontWeight: 800 }}>
              Trade M.A.T.E
            </div>
            <div
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: 500,
                marginTop: 6,
              }}
            >
              New quote
            </div>
          </div>
          <div
            style={{
              padding: 32,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, color: NAVY }}>
              Kitchen extension
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#6b7280",
                marginTop: 4,
                marginBottom: 24,
              }}
            >
              14 Elm Road
            </div>
            {LINES.map(([label, price], i) => (
              <div
                key={label}
                style={{
                  opacity: itemIn(i),
                  transform: `translateX(${(1 - itemIn(i)) * 60}px)`,
                  display: "flex",
                  justifyContent: "space-between",
                  background: "white",
                  borderRadius: 16,
                  padding: "18px 20px",
                  marginBottom: 14,
                  fontSize: 22,
                  fontWeight: 500,
                  color: NAVY,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                <span>{label}</span>
                <span style={{ fontWeight: 700 }}>{price}</span>
              </div>
            ))}
            <div
              style={{
                opacity: totalIn,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: 10,
                color: NAVY,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 48, fontWeight: 800 }}>£4,250</span>
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                opacity: totalIn,
                transform: `scale(${pulse})`,
                background: ORANGE,
                color: "white",
                textAlign: "center",
                borderRadius: 20,
                padding: "22px 0",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Send quote ✓
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
