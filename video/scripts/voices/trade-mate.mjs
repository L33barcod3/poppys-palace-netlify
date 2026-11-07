export default {
  audioPrefix: "voice-",
  captionsFile: "public/trade-mate-captions.json",
  timingsFile: "src/trade-mate/voice-lines.ts",
  voices: {
    a: "m3ERpbBFjTAqD5PJozID", // Matthew Paul: Scouse (the frustrated builder)
    b: "7rQX8r6PVq3gfJ8rZzyE", // John North: Northern, slightly gruff (his mate)
  },
  // `say` is what the voice reads (with v3 emotion tags in [brackets]).
  // `caption` is what appears on screen. They must have the same number of words.
  lines: [
    { id: "a1", speaker: "a", start: 0.4, say: "[frustrated] Pricing up this job is doing my head in!", caption: "Pricing up this job is doing my head in!" },
    // maxDuration trims trailing silence that the alignment counts as part of the word.
    { id: "a2", speaker: "a", start: 4.35, say: "[shouting] ARGH!", caption: "ARGH!", maxDuration: 1.5 },
    { id: "b1", speaker: "b", start: 6.2, say: "[cheerfully] Try the Trade Mate app, it's great.", caption: "Try the Trade M.A.T.E app, it's great." },
    { id: "a3", speaker: "a", start: 13.2, say: "[excited] That's boss!", caption: "That's boss!" },
  ],
};
