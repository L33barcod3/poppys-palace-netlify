export default {
  audioPrefix: "vinted-",
  captionsFile: "public/vinted-captions.json",
  timingsFile: "src/vinted/voice-lines.ts",
  voices: {
    lee: "8Qks38ENjPxXSdubdeg8", // Harry: Northern with a Scouse twang
    gf: "gazjvOPtrvBQahMjDLP1", // "Scouse woman (Vinted video)", designed in ElevenLabs
  },
  lines: [
    { id: "gf1", speaker: "gf", start: 3.4, say: "[furious] Oh my god, more fuckin' Cable Guy things off Vinted?!", caption: "Oh my god, more fuckin' Cable Guy things off Vinted?!" },
    { id: "lee1", speaker: "lee", start: 8.0, say: "[sheepishly] But they were six quid.", caption: "But they were six quid." },
  ],
};
