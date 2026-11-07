# 3D video studio (Three.js + Remotion)

A standalone Remotion project for making 3D animated videos. It is separate
from the Netlify site: it has its own `package.json` and is not part of the
site build.

- **Three.js / React Three Fiber** (`three`, `@react-three/fiber`, `@react-three/drei`, `@remotion/three`): the 3D scene
- **`@remotion/captions`**: subtitles from `.srt` or word-level JSON, with word highlighting
- **`@remotion/media`**: audio (voiceover, music) and video clips
- **`@remotion/google-fonts`**: caption font
- **Remotion CLI**: preview studio and MP4 rendering (uses ffmpeg, bundled)

## Commands

Run these from the `video/` folder:

```bash
npm install       # first time only
npm run dev       # open Remotion Studio to preview and tweak
npm run render    # render out/video.mp4
npm run lint      # eslint + typecheck
```

## Project layout

| File | What it does |
| --- | --- |
| `src/Root.tsx` | Registers the `ThreeDVideo` composition (1920×1080, 30 fps, 10 s) |
| `src/ThreeDVideo.tsx` | Stacks the 3D scene, captions and audio |
| `src/scene/Scene3D.tsx` | The Three.js scene. Edit this to build your animation |
| `src/captions/Captions.tsx` | Loads and displays the captions |
| `public/captions.srt` | Sample subtitles |

## Adding your own audio and captions

1. Put files in `public/`, for example `voiceover.mp3` and `captions.srt`.
2. In `src/Root.tsx`, set `audioFile: "voiceover.mp3"` and `captionsFile: "captions.srt"`.
   You can also change these in the Studio's props panel.
3. Set `durationInFrames` to match your audio length (seconds × 30).

Captions can be an `.srt` file, or a `.json` array of word-level
[`Caption`](https://www.remotion.dev/docs/captions/caption) objects. To get
word-level timings automatically from a voiceover, see
[`@remotion/install-whisper-cpp`](https://www.remotion.dev/docs/install-whisper-cpp).

## Rules for the 3D scene

- Drive **all** motion from `useCurrentFrame()`. Never use R3F's `useFrame()`
  or anything that animates on its own clock: it flickers when rendered.
- Keep 3D content inside `<ThreeCanvas>` with explicit `width` and `height`.
- Any `<Sequence>` inside `<ThreeCanvas>` needs `layout="none"`.

## Rendering on a machine without a GPU

`remotion.config.ts` uses the `angle` OpenGL renderer, which works on normal
desktops. On a server or container with no GPU, use software rendering:

```bash
npx remotion render ThreeDVideo out/video.mp4 --gl=swangle
```
