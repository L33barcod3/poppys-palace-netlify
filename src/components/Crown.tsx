import { motion, useReducedMotion } from "framer-motion";

const stars = [
  { x: "4%", y: "20%", d: 0, s: 14 }, { x: "92%", y: "14%", d: 0.6, s: 12 },
  { x: "14%", y: "78%", d: 1.2, s: 10 }, { x: "86%", y: "72%", d: 0.3, s: 14 },
  { x: "50%", y: "-6%", d: 0.9, s: 12 }, { x: "-2%", y: "50%", d: 1.6, s: 9 },
  { x: "100%", y: "44%", d: 1.9, s: 9 },
];

export function Crown({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  const reducedMotion = useReducedMotion();
  const svg = (
    <svg viewBox="0 0 240 170" className="h-full w-full overflow-visible" role="img" aria-label="Poppy's Palace crown">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1B8" />
          <stop offset="0.35" stopColor="#F5C842" />
          <stop offset="0.7" stopColor="#D9961A" />
          <stop offset="1" stopColor="#A8650E" />
        </linearGradient>
        <linearGradient id="goldBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCE38A" />
          <stop offset="0.5" stopColor="#E0A526" />
          <stop offset="1" stopColor="#9C5A0A" />
        </linearGradient>
        <radialGradient id="pearl" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor="#FBEFF2" />
          <stop offset="1" stopColor="#D9C3CB" />
        </radialGradient>
        {[["berry", "#E04B6E", "#8E1B3A"], ["royal", "#7B94F0", "#2F4FBF"], ["orange", "#FFB070", "#F26A1B"], ["pink", "#FFD3DE", "#F2A0B5"]].map(([id, a, b]) => (
          <radialGradient key={id} id={`gem-${id}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="0.25" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </radialGradient>
        ))}
      </defs>
      {/* crown body with tall curved points */}
      <path
        d="M30 128 C26 95 18 70 10 52 C32 66 44 80 52 98 C56 70 60 46 74 26 C82 52 88 76 92 96 C98 64 108 36 120 10 C132 36 142 64 148 96 C152 76 158 52 166 26 C180 46 184 70 188 98 C196 80 208 66 230 52 C222 70 214 95 210 128 Z"
        fill="url(#gold)" stroke="#9C5A0A" strokeWidth="2" strokeLinejoin="round"
      />
      {/* highlight */}
      <path d="M44 120 C42 100 38 86 32 74 M120 24 C114 50 108 80 106 110" stroke="#FFF6D0" strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none" />
      {/* hearts between points */}
      {[[64, 92], [176, 92]].map(([x, y]) => (
        <path key={x} transform={`translate(${x} ${y}) scale(0.9)`} d="M0 4 C-6 -4 -14 2 0 12 C14 2 6 -4 0 4 Z" fill="url(#gem-pink)" stroke="#8E1B3A" strokeWidth="1" />
      ))}
      {/* flowers between points */}
      {[[100, 100], [140, 100]].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} rx="3.2" ry="6" cy="-5" transform={`rotate(${r})`} fill="url(#gem-orange)" />
          ))}
          <circle r="3" fill="#8E1B3A" />
        </g>
      ))}
      {/* pearls */}
      {[[10, 52], [74, 26], [120, 10], [166, 26], [230, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 9 : 7} fill="url(#pearl)" stroke="#C9A9B2" strokeWidth="0.8" />
      ))}
      {/* jewelled band */}
      <rect x="24" y="124" width="192" height="30" rx="10" fill="url(#goldBand)" stroke="#9C5A0A" strokeWidth="2" />
      <rect x="30" y="127" width="180" height="5" rx="2.5" fill="#FFF3C4" opacity="0.6" />
      {[["berry", 48], ["royal", 84], ["orange", 120], ["royal", 156], ["berry", 192]].map(([c, x], i) => (
        <g key={i}>
          {i === 2 ? (
            <path d={`M${x} 129 l10 10 -10 10 -10 -10z`} fill={`url(#gem-${c})`} stroke="#7a3d05" strokeWidth="1" />
          ) : (
            <ellipse cx={x as number} cy="139" rx="8" ry="7" fill={`url(#gem-${c})`} stroke="#7a3d05" strokeWidth="1" />
          )}
        </g>
      ))}
      {[66, 102, 138, 174].map((x) => <circle key={x} cx={x} cy="139" r="3" fill="url(#pearl)" />)}
    </svg>
  );

  if (!animated || reducedMotion) return <div className={className}>{svg}</div>;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ y: -160, opacity: 0, rotate: -8 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 9, mass: 0.9 }}
    >
      <motion.div
        className="h-full w-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        {svg}
      </motion.div>
      {stars.map((s, i) => (
        <svg key={i} aria-hidden viewBox="0 0 20 20" width={s.s} height={s.s} className="twinkle absolute" style={{ left: s.x, top: s.y, animationDelay: `${s.d}s` }}>
          <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#F5C842" />
        </svg>
      ))}
    </motion.div>
  );
}
