// Generates the TradeMate voiceover with ElevenLabs, plus word-level captions.
//
//   node scripts/make-trade-mate-voices.mjs          # only lines not yet generated
//   node scripts/make-trade-mate-voices.mjs --force  # regenerate everything (uses credits)
//
// The API key is not read from this script. In Claude Code cloud sessions the
// network proxy adds it. Elsewhere, set ELEVENLABS_API_KEY.
//
// Writes:
//   public/audio/voice-<id>.mp3          one file per line
//   public/trade-mate-captions.json      Caption[] (absolute times) for <Captions>
//   src/trade-mate/voice-lines.ts        start/end of each line, for lip-sync + audio placement

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORCE = process.argv.includes("--force");
const MODEL = "eleven_v3";

const VOICES = {
  a: "m3ERpbBFjTAqD5PJozID", // Matthew Paul: Scouse (the frustrated builder)
  b: "7rQX8r6PVq3gfJ8rZzyE", // John North: Northern, slightly gruff (his mate)
};

// `say` is what the voice reads (with v3 emotion tags in [brackets]).
// `caption` is what appears on screen. They must have the same number of words.
const LINES = [
  {
    id: "a1",
    speaker: "a",
    start: 0.4,
    say: "[frustrated] Pricing up this job is doing my head in!",
    caption: "Pricing up this job is doing my head in!",
  },
  // maxDuration trims trailing silence that the alignment counts as part of the word.
  {
    id: "a2",
    speaker: "a",
    start: 4.35,
    say: "[shouting] ARGH!",
    caption: "ARGH!",
    maxDuration: 1.5,
  },
  {
    id: "b1",
    speaker: "b",
    start: 6.2,
    say: "[cheerfully] Try the Trade Mate app, it's great.",
    caption: "Try the Trade M.A.T.E app, it's great.",
  },
  {
    id: "a3",
    speaker: "a",
    start: 13.2,
    say: "[excited] That's boss!",
    caption: "That's boss!",
  },
];

const headers = { "Content-Type": "application/json" };
if (process.env.ELEVENLABS_API_KEY)
  headers["xi-api-key"] = process.env.ELEVENLABS_API_KEY;

// Turn character timings into word timings, skipping [emotion tags].
const toWords = (alignment) => {
  const {
    characters,
    character_start_times_seconds: starts,
    character_end_times_seconds: ends,
  } = alignment;
  const words = [];
  let inTag = false;
  let current = null;
  characters.forEach((ch, i) => {
    if (ch === "[") inTag = true;
    if (inTag) {
      if (ch === "]") inTag = false;
      return;
    }
    if (/\s/.test(ch)) {
      if (current) words.push(current);
      current = null;
      return;
    }
    if (!current) current = { text: "", start: starts[i], end: ends[i] };
    current.text += ch;
    current.end = ends[i];
  });
  if (current) words.push(current);
  return words;
};

const audioDir = join(ROOT, "public", "audio");
const cacheDir = join(ROOT, "scripts", ".voice-cache");
mkdirSync(audioDir, { recursive: true });
mkdirSync(cacheDir, { recursive: true });

const captions = [];
const timings = [];

for (const line of LINES) {
  const mp3 = join(audioDir, `voice-${line.id}.mp3`);
  const cache = join(cacheDir, `${line.id}.json`);
  let words;
  const cached = existsSync(cache)
    ? JSON.parse(readFileSync(cache, "utf8"))
    : null;

  if (
    !FORCE &&
    cached &&
    cached.say === line.say &&
    cached.voice === VOICES[line.speaker] &&
    existsSync(mp3)
  ) {
    words = cached.words;
    console.log(`= ${line.id} (cached)`);
  } else {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICES[line.speaker]}/with-timestamps?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ text: line.say, model_id: MODEL }),
      },
    );
    if (!res.ok)
      throw new Error(`${line.id}: HTTP ${res.status} ${await res.text()}`);
    const data = await res.json();
    writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));
    words = toWords(data.alignment);
    writeFileSync(
      cache,
      JSON.stringify(
        { say: line.say, voice: VOICES[line.speaker], words },
        null,
        2,
      ),
    );
    console.log(`+ ${line.id} generated`);
  }

  if (line.maxDuration) {
    words = words.map((w) => ({
      ...w,
      end: Math.min(w.end, line.maxDuration),
    }));
  }

  const captionWords = line.caption.split(/\s+/);
  if (captionWords.length !== words.length) {
    throw new Error(
      `${line.id}: caption has ${captionWords.length} words, voice has ${words.length}`,
    );
  }
  captionWords.forEach((text, i) => {
    captions.push({
      text: ` ${text}`,
      startMs: Math.round((line.start + words[i].start) * 1000),
      endMs: Math.round((line.start + words[i].end) * 1000),
      timestampMs: null,
      confidence: null,
      pageBreakAfter: i === captionWords.length - 1,
    });
  });
  const end = line.start + words[words.length - 1].end;
  timings.push({
    id: line.id,
    speaker: line.speaker,
    start: line.start,
    end: +end.toFixed(3),
  });
  console.log(`  ${line.id}: ${line.start.toFixed(2)}s -> ${end.toFixed(2)}s`);
}

writeFileSync(
  join(ROOT, "public", "trade-mate-captions.json"),
  JSON.stringify(captions, null, 2) + "\n",
);
writeFileSync(
  join(ROOT, "src", "trade-mate", "voice-lines.ts"),
  `// Generated by scripts/make-trade-mate-voices.mjs. Do not edit by hand.\n` +
    `export const VOICE_LINES = ${JSON.stringify(timings, null, 2)} as const;\n`,
);
