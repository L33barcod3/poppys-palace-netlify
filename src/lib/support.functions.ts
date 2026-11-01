import { createServerFn } from "@tanstack/react-start";
import { supportRequestSchema } from "./schemas";
import { z } from "zod";

const SERVICES = `
Poppy's Palace is a project run under the charity "In Your Shoes", set up in loving memory of Poppy.
It raises money to support bereaved parents and families who have lost a child. What donations fund:
1. Contributions towards headstones and funeral costs.
2. Financial support with day-to-day living after a loss.
3. Restful weekend breaks so grieving families can be together.
4. Support for dads' mental health through regular meet-ups, walks and exercise activities.
The site also has: a GoFundMe fundraiser (https://www.gofundme.com/f/poppy-kay-clarke), community
events (tea parties, lantern walks, bake sales, fun runs), and a contact form for enquiries.
`.trim();

// Read a streamed AI reply and stitch the text pieces together.
async function readStreamedText(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") text += evt.delta;
      } catch {
        // ignore incomplete frames
      }
    }
  }
  return text.trim();
}

const FALLBACK_ERROR = "Our little helper couldn't answer just now — please try again in a moment, or use the contact form below.";

async function askGateway(instructions: string, input: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ok: false, error: "Our little helper isn't set up yet — please use the contact form below and a real person will reply." };
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({ model: "openai/gpt-6-astra", instructions, input, stream: true }),
    });
    if (!res.ok) return { ok: false, error: FALLBACK_ERROR };
    const text = await readStreamedText(res);
    if (!text) return { ok: false, error: FALLBACK_ERROR };
    return { ok: true, text };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}

/* ---------- Support matcher: "what could help our family?" ---------- */

const MATCHER_INSTRUCTIONS = `${SERVICES}

You are the gentle helper on the Poppy's Palace website. A bereaved family member has described
their situation. Reply with warm, dignified, hopeful guidance — never clinical, never cheesy.

Rules:
- Open with one short sentence of warmth acknowledging their situation. Never use their name.
- Suggest which of the Poppy's Palace services above could help them, and say why in one line each.
  Only suggest services that genuinely fit; it is fine to suggest just one or two.
- Give 2–3 gentle, practical next steps (e.g. use the contact form on this page, mention the
  GoFundMe only if money worries are central, suggest an event only if connection seems welcome).
- If they mention a crisis, self-harm or feeling unsafe, gently encourage them to call Samaritans
  on 116 123 (UK, free, 24/7) before anything else.
- Keep the whole reply under 180 words. Use short paragraphs. No bullet symbols, no headings —
  plain warm prose only. Never diagnose, never give medical or legal advice.`;

export type SupportGuidance = { ok: true; guidance: string } | { ok: false; error: string };

export const getSupportGuidance = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => supportRequestSchema.parse(input))
  .handler(async ({ data }): Promise<SupportGuidance> => {
    const result = await askGateway(MATCHER_INSTRUCTIONS, data.situation);
    return result.ok ? { ok: true, guidance: result.text } : result;
  });

/* ---------- Q&A helper: "ask the palace a question" ---------- */

const questionSchema = z.object({
  question: z.string().trim().min(5, "Please write a little more so we can help").max(500, "Please keep your question under 500 characters"),
});

const QA_INSTRUCTIONS = `${SERVICES}

You answer visitor questions on the Poppy's Palace website. Tone: warm, gentle, dignified, a
little playful (a princess's palace), never corporate or cheesy.

Rules:
- Answer only from the information above and general knowledge of how GoFundMe donations work.
- Keep answers under 100 words, plain warm prose, no headings or bullet symbols.
- If you are not sure of the answer, or the question needs a real person (specific money amounts,
  personal circumstances, complaints, safeguarding, medical or legal topics), do NOT guess.
  Instead reply with exactly this line on its own first line: HANDOFF
  followed by one kind sentence inviting them to use the contact form so a real person can help.
- If someone seems in crisis, gently point them to Samaritans on 116 123 (UK, free, 24/7).`;

export type QuestionAnswer =
  | { ok: true; answer: string; handoff: boolean }
  | { ok: false; error: string };

export const askPalaceQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => questionSchema.parse(input))
  .handler(async ({ data }): Promise<QuestionAnswer> => {
    const result = await askGateway(QA_INSTRUCTIONS, data.question);
    if (!result.ok) return result;
    const handoff = result.text.startsWith("HANDOFF");
    const answer = handoff ? result.text.slice("HANDOFF".length).trim() : result.text;
    return { ok: true, answer, handoff };
  });
