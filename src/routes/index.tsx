import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo } from "react";
import { Crown } from "@/components/Crown";
import { CountUp, DonateButton, DonateNote, LeafDivider, PoppyFlower, Reveal } from "@/components/Bits";
import { DONATE_URL, FUNDRAISING, POPPY_PHOTO, formatDate, splitEvents } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Poppy's Palace — Raising money for bereaved parents" },
      { name: "description", content: "A little palace full of love, raising money for a charity that supports bereaved parents. Donate, join an event, share the magic." },
      { property: "og:title", content: "Poppy's Palace" },
      { property: "og:description", content: "A little palace full of love, raising money for bereaved parents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const TITLE = "Poppy's Palace";
const PHOTO_ALT = "Poppy smiling in her colourful floral dress, holding pink flowers";
const petalColors = ["var(--berry)", "var(--royal)", "var(--sunset)", "var(--blush)"];

function Petals() {
  const petals = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      left: (i * 37) % 100, delay: (i * 1.3) % 9, dur: 10 + (i % 5) * 2, size: 10 + (i % 4) * 4, color: petalColors[i % 4],
    })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-8 block rounded-[60%_0_60%_0] opacity-60"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: ["0vh", "105vh"], x: [0, 30, -20, 10], rotate: [0, 180, 360] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function PhotoSide({ side, y }: { side: "left" | "right"; y: MotionValue<number> | number }) {
  return (
    <motion.div
      aria-hidden={side === "right" ? true : undefined}
      style={{ y }}
      className={`hero-photo hero-photo-${side}`}
    >
      <img src={POPPY_PHOTO} alt={side === "left" ? PHOTO_ALT : ""} className="hero-portrait" fetchPriority="high" />
    </motion.div>
  );
}

function Hero() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 90]);
  return (
    <section className="palace-hero relative flex min-h-[88svh] items-center justify-center overflow-hidden bg-cream px-4 py-12">
      <PhotoSide side="left" y={reducedMotion ? 0 : y} />
      <PhotoSide side="right" y={reducedMotion ? 0 : y} />
      {!reducedMotion && <Petals />}
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <Crown className="h-32 w-44 sm:h-36 sm:w-52" />
        <div className="relative mt-2 w-full">
          <PoppyFlower className="absolute -left-6 bottom-0 h-16 w-9 sm:-left-14 sm:h-24 sm:w-14" />
          <PoppyFlower className="absolute -right-6 bottom-0 h-14 w-8 sm:-right-14 sm:h-20 sm:w-12" style={{ animationDelay: "1s" }} />
          <PoppyFlower className="absolute -top-4 right-4 hidden h-12 w-7 sm:block" style={{ animationDelay: "2s" }} />
          <h1 aria-label={TITLE} className="palace-title font-display font-black italic">
            {TITLE.split(" ").map((word, w) => (
              <span key={w} className="block">
                <span className="palace-title-word title-gradient shimmer inline-block whitespace-nowrap" data-text={word}>
                  {word.split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="inline-block"
                      initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.6 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 14, delay: 1.2 + (w * 8 + i) * 0.06 }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
        </div>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 2 }}
          className="mt-5 max-w-md font-script text-2xl text-royal sm:text-3xl"
        >
          A little palace full of love, for parents who are missing their child.
        </motion.p>
        <motion.div initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : 2.3 }} className="mt-8 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            <DonateButton size="lg">Donate with love</DonateButton>
            <Link to="/events" className="rounded-full border-2 border-royal px-8 py-4 text-lg font-bold text-royal hover:bg-royal hover:text-cream">Our events</Link>
          </div>
          <DonateNote />
        </motion.div>
      </div>
    </section>
  );
}

function Progress() {
  const pct = Math.min(100, Math.round((FUNDRAISING.raised / FUNDRAISING.target) * 100));
  return (
    <section className="px-5 py-14">
      <Reveal className="mx-auto max-w-2xl rounded-3xl bg-card p-7 text-center shadow-[var(--shadow-soft)] sm:p-10">
        <h2 className="font-display text-3xl font-bold text-berry">Our fundraising so far</h2>
        <p className="mt-4 font-display text-5xl font-black text-charcoal">
          <CountUp to={FUNDRAISING.raised} prefix="£" />
        </p>
        <p className="text-muted-foreground">
          raised of our £{FUNDRAISING.target.toLocaleString("en-GB")} goal · {FUNDRAISING.donations} donations
        </p>
        <div className="mt-6 h-5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Fundraising progress">
          <motion.div
            className="h-full rounded-full bg-[image:var(--gradient-warm)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 font-bold text-sunset">{pct}% of the way there</p>
        <p className="mt-1 text-sm text-muted-foreground">As of {FUNDRAISING.asOf}</p>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-bold text-royal underline decoration-blush decoration-4 underline-offset-4"
        >
          See the fundraiser on GoFundMe →
        </a>
      </Reveal>
    </section>
  );
}

function Home() {
  const next = splitEvents().upcoming.slice(0, 2);
  return (
    <>
      <Hero />
      <div className="pattern-tropical">
        <LeafDivider />
        <section className="relative overflow-hidden px-5 py-10">
          <img src={POPPY_PHOTO} alt="" aria-hidden="true" loading="lazy" className="story-portrait" />
          <Reveal className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold text-berry">Our story</h2>
            <p className="mt-5 text-lg leading-relaxed">
              [PLACEHOLDER] Poppy's Palace is a project run under the charity <strong>In Your Shoes</strong>, set up in loving memory of Poppy. Her little palace exists to hold families close on the days that feel impossible — to bring warmth, gentle practical help and the quiet reminder that no parent has to walk this road alone.
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              [PLACEHOLDER] Your donations help bereaved families in quiet, practical ways: contributing towards headstones and funeral costs, easing the weight of day-to-day living after a loss, funding restful weekend breaks so families can simply be together, and supporting dads' mental health through regular meet-ups, walks and exercise activities. Every gift, however small, becomes part of that care.
            </p>
          </Reveal>
        </section>
      </div>
      <Progress />
      <LeafDivider flip />
      <section className="px-5 py-10">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold text-berry">Coming up</h2>
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
          {next.length === 0 && <p className="text-center text-muted-foreground sm:col-span-2">New events are being planned — check back soon!</p>}
          {next.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1}>
              <article className="h-full rounded-3xl border-t-4 border-sunset bg-card p-6 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-bold uppercase tracking-wider text-royal">{formatDate(e.date)} · {e.time}</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{e.title}</h3>
                <p className="mt-1 text-muted-foreground">{e.location}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/events" className="font-bold text-royal underline decoration-blush decoration-4 underline-offset-4">See all events →</Link>
        </div>
      </section>
      <section className="px-5 py-16">
        <Reveal className="relative mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] bg-royal px-6 py-14 text-center text-cream">
          <Crown animated={false} className="mx-auto h-16 w-24" />
          <h2 className="mt-4 font-display text-4xl font-black italic sm:text-5xl">Every gift is a little kindness</h2>
          <p className="mx-auto mt-4 max-w-lg text-cream/90">Your donation helps bereaved parents find comfort, support and someone who understands.</p>
          <div className="mt-8"><DonateButton size="lg">Donate today</DonateButton></div>
          <DonateNote className="mt-3 text-cream/80" />
        </Reveal>
      </section>
    </>
  );
}
