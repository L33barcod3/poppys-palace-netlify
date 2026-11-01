import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LeafDivider, PageHeader, Reveal } from "@/components/Bits";
import { formatDate, splitEvents, type PalaceEvent } from "@/config/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Poppy's Palace" },
      { name: "description", content: "Join a Poppy's Palace fundraising event — tea parties, walks, bake sales and more." },
      { property: "og:title", content: "Poppy's Palace Events" },
      { property: "og:description", content: "Join us at an upcoming fundraising event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Events,
});

function EventCard({ e, past }: { e: PalaceEvent; past?: boolean }) {
  return (
    <motion.article
      whileHover={past ? {} : { y: -8, rotate: -1.2 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className={`h-full rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] ${past ? "opacity-80" : "border-t-4 border-sunset"}`}
    >
      <p className="text-sm font-bold uppercase tracking-wider text-royal">{formatDate(e.date)}</p>
      <h3 className="mt-2 font-display text-2xl font-bold text-charcoal">{e.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">🕑 {e.time} · 📍 {e.location}</p>
      <p className="mt-3">{e.description}</p>
      {e.link && !past && (
        <a href={e.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-bold text-berry underline decoration-blush decoration-4 underline-offset-4">
          Find out more →
        </a>
      )}
    </motion.article>
  );
}

function Events() {
  const { upcoming, past } = splitEvents();
  return (
    <>
      <PageHeader title="Events" intro="Come along, bring a friend, wear a crown if you like." />
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="font-display text-3xl font-bold text-berry">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-blush/25 p-8 text-center text-lg">No events just now — something lovely is being planned. Check back soon! ✨</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {upcoming.map((e, i) => <Reveal key={e.title} delay={i * 0.08}><EventCard e={e} /></Reveal>)}
          </div>
        )}
      </section>
      {past.length > 0 && (
        <>
          <LeafDivider />
          <section className="mx-auto max-w-5xl px-5 pb-12">
            <h2 className="font-display text-3xl font-bold text-berry">Past events — thank you!</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {past.map((e) => <Reveal key={e.title}><EventCard e={e} past /></Reveal>)}
            </div>
          </section>
        </>
      )}
    </>
  );
}
