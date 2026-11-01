import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Crown } from "./Crown";
import { DonateButton } from "./Bits";
import { CHARITY, SOCIALS } from "@/config/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
  { to: "/donate", label: "Donate" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/85 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-card focus:p-2">Skip to content</a>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5" aria-label="Main">
        <Link to="/" className="flex items-center gap-2">
          <Crown animated={false} className="h-9 w-12" />
          <span className="title-gradient font-display text-xl font-black italic">Poppy's Palace</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.slice(0, 4).map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: true }} className="font-semibold text-charcoal/80 hover:text-berry" activeProps={{ className: "text-berry underline decoration-blush decoration-4 underline-offset-8" }}>
              {l.label}
            </Link>
          ))}
          <DonateButton />
        </div>
        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 rounded bg-berry" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-0.5 w-6 rounded bg-berry" />
          <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="h-0.5 w-6 rounded bg-berry" />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {links.map((l, i) => (
                <motion.li key={l.to} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                  <Link to={l.to} activeOptions={{ exact: true }} className="block rounded-xl px-3 py-3 font-display text-2xl font-bold text-charcoal" activeProps={{ className: "bg-blush/30 text-berry" }}>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-3"><DonateButton className="w-full">Donate now</DonateButton></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 bg-berry text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Crown animated={false} className="h-10 w-14" />
            <span className="font-display text-2xl font-black italic">Poppy's Palace</span>
          </div>
          <p className="mt-3 text-sm text-cream/85">[PLACEHOLDER] A project run under the charity In Your Shoes, set up in loving memory of Poppy — raising money, with love, for families who have lost a child.</p>
        </div>
        <div className="text-sm">
          <h2 className="mb-2 font-display text-lg font-bold">Our charity</h2>
          <p>{CHARITY.name}</p>
          <p>Registered charity no. {CHARITY.number}</p>
          <p>{CHARITY.email}</p>
        </div>
        <div className="text-sm">
          <h2 className="mb-2 font-display text-lg font-bold">Follow along</h2>
          <div className="flex gap-3">
            <a className="rounded-full bg-cream/15 px-4 py-2 hover:bg-cream/25" href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className="rounded-full bg-cream/15 px-4 py-2 hover:bg-cream/25" href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
          <p className="mt-4 text-cream/80">Privacy: this site doesn't collect personal details or take payments. Donations are handled securely by our donation partner.</p>
        </div>
      </div>
      <p className="border-t border-cream/15 py-4 text-center text-xs text-cream/70">Made with love for Poppy ♥</p>
    </footer>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.main
      id="main"
      key={path}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
