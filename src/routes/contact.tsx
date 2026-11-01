import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { useState } from "react";
import { LeafDivider, PageHeader, Reveal } from "@/components/Bits";
import { CHARITY, SHOW_AI_HELPERS } from "@/config/site";
import { enquirySchema, supportRequestSchema, TOPIC_LABELS, type Enquiry } from "@/lib/schemas";
import { askPalaceQuestion, getSupportGuidance } from "@/lib/support.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — Poppy's Palace" },
      { name: "description", content: "Get in touch with Poppy's Palace — whether you're a family looking for support, a supporter, or a fundraising partner. We're here, warmly." },
      { property: "og:title", content: "Contact Poppy's Palace" },
      { property: "og:description", content: "Families, supporters and fundraising partners — we'd love to hear from you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const inputCls =
  "w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base text-charcoal placeholder:text-muted-foreground/70 focus:border-royal focus:outline-none";

/* ---------------- AI support matcher ---------------- */

function SupportMatcher() {
  const ask = useServerFn(getSupportGuidance);
  const [situation, setSituation] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = supportRequestSchema.safeParse({ situation });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please tell us a little more.");
      return;
    }
    setBusy(true);
    setError(null);
    setAnswer(null);
    try {
      const result = await ask({ data: parsed.data });
      if (result.ok) setAnswer(result.guidance);
      else setError(result.error);
    } catch {
      setError("Our little helper couldn't answer just now — please try again in a moment, or use the contact form below.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="pattern-tropical px-5 py-14">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="text-center font-display text-4xl font-bold text-berry">Not sure where to start?</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
          [PLACEHOLDER] If you're a bereaved family, tell us — in your own words — what you're going through and what
          would help. Our little palace helper will gently point you towards the support that fits.
        </p>
        <form onSubmit={onSubmit} className="mt-8 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8" noValidate>
          <label htmlFor="situation" className="block font-bold text-charcoal">
            What's happening, and what would help?
          </label>
          <textarea
            id="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={5}
            maxLength={1500}
            placeholder="There's no right way to say it. Just a few honest sentences is plenty."
            className={`${inputCls} mt-2`}
            aria-describedby="situation-hint"
          />
          <p id="situation-hint" className="mt-1 text-sm text-muted-foreground">
            Private and gentle — nothing you write here is stored or shared.
          </p>
          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-blush/30 px-4 py-3 font-semibold text-berry">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="glow-pulse mt-4 w-full rounded-full bg-[image:var(--gradient-warm)] px-8 py-4 text-lg font-bold text-primary-foreground disabled:opacity-60 sm:w-auto"
          >
            {busy ? "Thinking gently…" : "Suggest what could help"}
          </button>
        </form>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl border-t-4 border-blush bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
            aria-live="polite"
          >
            <h3 className="font-display text-2xl font-bold text-royal">A few thoughts for you</h3>
            <div className="mt-3 space-y-3 text-lg leading-relaxed">
              {answer.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              This is a gentle starting point, not professional advice. For anything urgent, please call Samaritans
              free on <a href="tel:116123" className="font-bold text-berry underline">116 123</a>, any time.
            </p>
          </motion.div>
        )}
      </Reveal>
    </section>
  );
}

/* ---------------- Ask the palace (Q&A helper) ---------------- */

function AskThePalace() {
  const askQuestion = useServerFn(askPalaceQuestion);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<{ answer: string; handoff: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setReply(null);
    setBusy(true);
    try {
      const result = await askQuestion({ data: { question } });
      if (result.ok) setReply({ answer: result.answer, handoff: result.handoff });
      else setError(result.error);
    } catch {
      setError("Our little helper couldn't answer just now — please try again in a moment, or use the contact form below.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-5 py-14">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="text-center font-display text-4xl font-bold text-berry">Ask the palace</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
          [PLACEHOLDER] A quick question about donations, events or how it all works? Ask here. If our helper isn't
          sure, it'll point you to a real person — no guessing.
        </p>
        <form onSubmit={onSubmit} className="mt-8 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8" noValidate>
          <label htmlFor="question" className="block font-bold text-charcoal">Your question</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. Where does my donation actually go?"
            className={`${inputCls} mt-2`}
          />
          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-blush/30 px-4 py-3 font-semibold text-berry">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-full bg-royal px-8 py-4 text-lg font-bold text-cream hover:bg-royal/90 disabled:opacity-60 sm:w-auto"
          >
            {busy ? "Asking…" : "Ask"}
          </button>
        </form>
        {reply && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl border-t-4 border-royal bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
            aria-live="polite"
          >
            <h3 className="font-display text-2xl font-bold text-royal">{reply.handoff ? "A real person can help with this" : "Here's your answer"}</h3>
            <div className="mt-3 space-y-3 text-lg leading-relaxed">
              {reply.answer.split(/\n{2,}|\n/).filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {reply.handoff && (
              <a href="#enquiry-form" className="mt-4 inline-block rounded-full bg-[image:var(--gradient-warm)] px-6 py-3 font-bold text-primary-foreground">
                Message a real person
              </a>
            )}
          </motion.div>
        )}
      </Reveal>
    </section>
  );
}

/* ---------------- Enquiry form ---------------- */

type Errors = Partial<Record<keyof Enquiry, string>>;

function EnquiryForm() {
  const [form, setForm] = useState<Enquiry>({ name: "", email: "", topic: "family", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof Enquiry>(key: K, value: Enquiry[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Enquiry;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    // No inbox is connected yet, so we open the visitor's own email app with
    // everything filled in, ready to send to the charity's address.
    const subject = encodeURIComponent(`Poppy's Palace enquiry — ${TOPIC_LABELS[parsed.data.topic]}`);
    const body = encodeURIComponent(`Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`);
    window.location.href = `mailto:${CHARITY.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="px-5 py-14">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="text-center font-display text-4xl font-bold text-berry">Send us a message</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
          Families, supporters, businesses and kind strangers — all welcome. We read everything and reply as soon as we can.
        </p>
        <form id="enquiry-form" onSubmit={onSubmit} className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8" noValidate>
          <div>
            <label htmlFor="name" className="block font-bold text-charcoal">Your name</label>
            <input id="name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={100} autoComplete="name" className={`${inputCls} mt-2`} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name && <p id="name-error" role="alert" className="mt-1 text-sm font-semibold text-berry">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block font-bold text-charcoal">Your email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={255} autoComplete="email" className={`${inputCls} mt-2`} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <p id="email-error" role="alert" className="mt-1 text-sm font-semibold text-berry">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="topic" className="block font-bold text-charcoal">I am…</label>
            <select id="topic" value={form.topic} onChange={(e) => set("topic", e.target.value as Enquiry["topic"])} className={`${inputCls} mt-2`}>
              {Object.entries(TOPIC_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block font-bold text-charcoal">Your message</label>
            <textarea id="message" value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} maxLength={1000} className={`${inputCls} mt-2`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
            {errors.message && <p id="message-error" role="alert" className="mt-1 text-sm font-semibold text-berry">{errors.message}</p>}
          </div>
          <button type="submit" className="w-full rounded-full bg-royal px-8 py-4 text-lg font-bold text-cream hover:bg-royal/90 sm:w-auto">
            Send your message
          </button>
          {sent && (
            <p role="status" className="rounded-xl bg-blush/30 px-4 py-3 font-semibold text-berry">
              Your email app should have opened with your message ready to send. If it didn't, you can write to us
              directly at <span className="underline">{CHARITY.email}</span>.
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            [PLACEHOLDER] Your message opens in your own email app, addressed to us — nothing is stored on this website.
          </p>
        </form>
      </Reveal>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "How do donations reach families?",
    a: "[PLACEHOLDER] Every pound donated goes to our charity, In Your Shoes. From there it funds quiet, practical help for bereaved families: contributions towards headstones and funeral costs, support with day-to-day living after a loss, restful weekend breaks so families can be together, and dads' mental health meet-ups, walks and exercise activities.",
  },
  {
    q: "How does the GoFundMe fundraiser work?",
    a: "[PLACEHOLDER] When you tap any Donate button, you're taken to our secure GoFundMe page in a new tab. You choose an amount and pay there — this website never sees or stores your card details. GoFundMe passes the money on to the charity, and we update the fundraising total on our home page by hand so you can see how it's going.",
  },
  {
    q: "Can I donate in other ways?",
    a: "[PLACEHOLDER] Yes — you can fundraise for us (a bake sale, a run, a birthday collection), donate raffle prizes or services, or give your time at one of our events. Send us a message using the form above and we'll find something that suits you.",
  },
  {
    q: "I'm a business or group — can we partner with you?",
    a: "[PLACEHOLDER] We'd love that. Whether it's sponsoring an event, matching donations, or hosting a fundraiser, choose 'A fundraising partner or business' in the form above and tell us what you have in mind.",
  },
  {
    q: "How do I get in touch?",
    a: "[PLACEHOLDER] The quickest way is the form above — it opens your email app with everything ready to send. You can also reach us through our Facebook or Instagram pages (links at the bottom of every page). We're a small, volunteer-run project, so please give us a few days to reply.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-5 py-14">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="text-center font-display text-4xl font-bold text-berry">Gentle answers</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-xl font-bold text-charcoal"
                >
                  {f.q}
                  <motion.span aria-hidden animate={{ rotate: isOpen ? 45 : 0 }} className="text-2xl font-black text-sunset">
                    +
                  </motion.span>
                </button>
                <motion.div
                  id={`faq-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{f.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Page ---------------- */

function Contact() {
  return (
    <>
      <PageHeader
        title="Come and say hello"
        intro="Whether you need a little support, want to help, or have an idea for fundraising — the palace door is always open."
      />
      {SHOW_AI_HELPERS && (
        <>
          <SupportMatcher />
          <LeafDivider />
          <AskThePalace />
        </>
      )}
      <LeafDivider />
      <EnquiryForm />
      <LeafDivider flip />
      <Faq />
    </>
  );
}
