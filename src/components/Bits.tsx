import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { DONATE_URL } from "@/config/site";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ to, prefix = "", duration = 2 }: { to: number; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => prefix + Math.round(v).toLocaleString("en-GB"));
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { mv.set(to); return; }
    const c = animate(mv, to, { duration, ease: "easeOut" });
    return () => c.stop();
  }, [inView, to, duration, mv]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

export function DonateButton({ children = "Donate", size = "md", className = "" }: { children?: ReactNode; size?: "md" | "lg"; className?: string }) {
  const sizes = size === "lg" ? "px-10 py-5 text-xl" : "px-5 py-2.5 text-base";
  return (
    <motion.a
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`glow-pulse inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-warm)] font-bold text-primary-foreground ${sizes} ${className}`}
    >
      <span aria-hidden>♥</span> {children}
    </motion.a>
  );
}

// Small line shown under the main Donate buttons.
export function DonateNote({ className = "" }: { className?: string }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>Donate securely on GoFundMe</p>;
}

export function PoppyFlower({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 70" className={`sway ${className}`} style={style} aria-hidden>
      <path d="M20 70 C20 55 18 40 20 28" stroke="#3E6B3A" strokeWidth="2.5" fill="none" />
      <path d="M20 50 C12 46 8 48 6 52 C12 54 16 53 20 50Z" fill="#4E8146" />
      {[0, 90, 180, 270].map((r) => (
        <ellipse key={r} cx="20" cy="14" rx="9" ry="11" transform={`rotate(${r} 20 20) translate(0 0)`} fill="#E0313B" opacity="0.92" />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#2B2B33" />
    </svg>
  );
}

export function LeafDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 py-6 ${flip ? "rotate-180" : ""}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-berry/40 sm:w-32" />
      <svg viewBox="0 0 120 30" className="h-7 w-28">
        <path d="M60 15 C45 2 30 2 18 12 C30 14 45 18 60 15Z" fill="#2F4FBF" opacity="0.7" />
        <path d="M60 15 C75 2 90 2 102 12 C90 14 75 18 60 15Z" fill="#2F4FBF" opacity="0.7" />
        <circle cx="60" cy="15" r="7" fill="#F26A1B" />
        <circle cx="60" cy="15" r="3" fill="#8E1B3A" />
        <circle cx="10" cy="14" r="3" fill="#F2A0B5" />
        <circle cx="110" cy="14" r="3" fill="#F2A0B5" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-berry/40 sm:w-32" />
    </div>
  );
}

export function PageHeader({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <section className="pattern-tropical px-5 pb-10 pt-14 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="title-gradient font-display text-5xl font-black italic sm:text-6xl"
      >
        {title}
      </motion.h1>
      {intro && <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{intro}</p>}
    </section>
  );
}
