import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHeader, Reveal } from "@/components/Bits";
import { GALLERY } from "@/config/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Poppy's Palace" },
      { name: "description", content: "Happy moments from Poppy's Palace fundraising events." },
      { property: "og:title", content: "Poppy's Palace Gallery" },
      { property: "og:description", content: "Happy moments from our fundraising events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});

const tints = ["bg-blush/50", "bg-royal/25", "bg-sunset/30", "bg-berry/25"];

function Tile({ i, tall }: { i: number; tall?: boolean | undefined }) {
  const item = GALLERY[i]!;
  if (item.src) return <img src={item.src} alt={item.alt} width={item.w} height={item.h} className="h-auto w-full rounded-2xl object-cover" loading="lazy" />;
  return (
    <div className={`flex w-full items-center justify-center rounded-2xl ${tints[i % 4]} ${tall ? "aspect-[3/4]" : "aspect-[4/3]"} text-sm font-bold text-charcoal/70`}>
      {item.alt}
    </div>
  );
}

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % GALLERY.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + GALLERY.length) % GALLERY.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <PageHeader title="Gallery" intro="Little moments of joy from our events." />
      <section className="mx-auto max-w-6xl columns-2 gap-4 px-4 py-12 md:columns-3">
        {GALLERY.map((g, i) => (
          <Reveal key={i} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid">
            <button onClick={() => setOpen(i)} className="block w-full transition-transform hover:scale-[1.02]" aria-label={`Open ${g.alt}`}>
              <Tile i={i} tall={g.tall} />
            </button>
          </Reveal>
        ))}
      </section>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[open]!.alt}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/85 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <Tile i={open} tall={GALLERY[open]!.tall} />
              <div className="mt-4 flex justify-between gap-2">
                <button className="rounded-full bg-cream px-5 py-2 font-bold text-berry" onClick={() => setOpen((open - 1 + GALLERY.length) % GALLERY.length)}>← Prev</button>
                <button autoFocus className="rounded-full bg-cream px-5 py-2 font-bold text-berry" onClick={() => setOpen(null)}>Close</button>
                <button className="rounded-full bg-cream px-5 py-2 font-bold text-berry" onClick={() => setOpen((open + 1) % GALLERY.length)}>Next →</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
