import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CountUp, DonateButton, DonateNote, LeafDivider, PageHeader, Reveal } from "@/components/Bits";
import { CHARITY, DONATE_URL, SUGGESTED_AMOUNTS } from "@/config/site";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Poppy's Palace" },
      { name: "description", content: "Every pound helps bereaved parents find comfort and support. Give with love to Poppy's Palace." },
      { property: "og:title", content: "Donate to Poppy's Palace" },
      { property: "og:description", content: "Every pound helps bereaved parents find comfort and support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Donate,
});

function Donate() {
  return (
    <>
      <PageHeader title="Give with love" intro="[PLACEHOLDER] Every gift goes straight to work for bereaved families — helping with headstones and funeral costs, easing day-to-day living after a loss, funding weekend breaks together, and supporting dads' mental health through meet-ups, walks and exercise." />
      <section className="px-5 py-12 text-center">
        <Reveal className="flex flex-col items-center">
          <DonateButton size="lg">Donate now</DonateButton>
          <DonateNote className="mt-3" />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-berry">Choose an amount</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {SUGGESTED_AMOUNTS.map((a) => (
              <motion.a
                key={a}
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.05 }}
                className="min-w-24 rounded-2xl border-2 border-blush bg-card px-6 py-4 font-display text-2xl font-black text-berry shadow-[var(--shadow-soft)] hover:border-sunset"
              >
                <CountUp to={a} prefix="£" duration={1.2} />
              </motion.a>
            ))}
          </div>
          <p className="mt-8 text-lg">[PLACEHOLDER] <strong>£25</strong> could pay for a bereaved parent's first support session.</p>
        </Reveal>
      </section>
      <LeafDivider />
      <Reveal className="mx-auto max-w-xl px-5 pb-10 text-center text-sm text-muted-foreground">
        All donations go to <strong className="text-charcoal">{CHARITY.name}</strong>, registered charity number {CHARITY.number}. You'll be taken to our secure donation partner — this site never asks for your card details.
      </Reveal>
    </>
  );
}
