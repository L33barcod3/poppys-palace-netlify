"""Synthesize the music bed and sound effects for the TradeMate video.

Everything is generated from scratch with numpy (no samples, no licensing).
Event times match src/trade-mate/timeline.ts at 30 fps; if you change the
timeline, update the times below and re-run:

    python3 scripts/make-trade-mate-audio.py
"""

import wave
from pathlib import Path

import numpy as np

SR = 44100
DURATION = 19.0
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
rng = np.random.default_rng(7)


def silence(seconds=DURATION):
    return np.zeros(int(seconds * SR))


def t_axis(seconds):
    return np.arange(int(seconds * SR)) / SR


def place(track, clip, at, gain=1.0):
    start = int(at * SR)
    end = min(len(track), start + len(clip))
    if start < len(track):
        track[start:end] += clip[: end - start] * gain


def note_hz(name):
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names.index(pitch) + 12 * (octave - 4) - 9) / 12)


def lowpass(x, amount):
    # One-pole low-pass; amount in (0, 1], smaller = darker.
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += amount * (v - acc)
        y[i] = acc
    return y


# ---------- Instruments ----------

def pluck(freq, seconds=0.45, bright=6):
    t = t_axis(seconds)
    wave_ = sum(np.sin(2 * np.pi * freq * k * t) / k ** 1.3 for k in range(1, bright))
    return wave_ * np.exp(-t * 7) * np.minimum(1, t * 400)


def bass(freq, seconds=0.4):
    t = t_axis(seconds)
    wave_ = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)
    return wave_ * np.exp(-t * 5) * np.minimum(1, t * 300)


def kick():
    t = t_axis(0.35)
    pitch = 50 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 9)


def hat(seconds=0.06):
    t = t_axis(seconds)
    noise = np.diff(rng.standard_normal(len(t) + 1))
    return noise * np.exp(-t * 60) * 0.3


def clap():
    t = t_axis(0.2)
    noise = lowpass(rng.standard_normal(len(t)), 0.5) - lowpass(rng.standard_normal(len(t)), 0.05)
    env = np.exp(-t * 25) * (1 + 0.6 * np.sin(2 * np.pi * 90 * t).clip(0))
    return noise * env * 0.6


def chord(names, seconds=0.45):
    return sum(pluck(note_hz(n), seconds) for n in names) / len(names)


# ---------- Sound effects ----------

def whoosh(seconds=0.5, rising=True):
    t = t_axis(seconds)
    noise = rng.standard_normal(len(t))
    sweep = np.linspace(0.02, 0.35, len(t)) if rising else np.linspace(0.35, 0.02, len(t))
    y = np.empty_like(noise)
    acc = 0.0
    for i, v in enumerate(noise):
        acc += sweep[i] * (v - acc)
        y[i] = acc
    env = np.sin(np.pi * t / seconds) ** 2
    return y * env * 1.5


def clang(base, seconds=0.9):
    # Inharmonic partials = metallic tool hitting concrete.
    t = t_axis(seconds)
    ratios = [1.0, 2.76, 5.4, 8.93, 13.3]
    tone = sum(np.sin(2 * np.pi * base * r * t) * np.exp(-t * (6 + 3 * i)) / (i + 1)
               for i, r in enumerate(ratios))
    click = rng.standard_normal(len(t)) * np.exp(-t * 200) * 0.6
    return (tone + click) * 0.8


def thud():
    t = t_axis(0.3)
    pitch = 40 + 60 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 14)


def boom():
    # The logo stamp: deep sub drop, a slap of noise and a metallic ring.
    t = t_axis(1.8)
    pitch = 32 + 90 * np.exp(-t * 18)
    sub = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 2.6)
    slap = lowpass(rng.standard_normal(len(t)), 0.25) * np.exp(-t * 30) * 1.4
    ring = clang(180, 1.8) * 0.25
    return sub * 1.2 + slap + ring


def blip(freq, seconds=0.12):
    t = t_axis(seconds)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 30) * np.minimum(1, t * 800)


def pop():
    t = t_axis(0.15)
    freq = 300 + 900 * (1 - np.exp(-t * 40))
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 25)


def bell(freq, seconds=1.2):
    t = t_axis(seconds)
    return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.4 * t)) * np.exp(-t * 4)


def cha_ching():
    out = silence(1.3)
    place(out, rng.standard_normal(int(0.08 * SR)) * np.exp(-t_axis(0.08) * 50) * 0.5, 0)
    place(out, bell(note_hz("E6")), 0.0, 0.6)
    place(out, bell(note_hz("B6")), 0.09, 0.6)
    return out


# ---------- Music ----------

def build_music():
    music = silence()
    beat = 0.5  # 120 bpm

    # 0-4 s: grumpy, sparse A minor.
    for i in range(8):
        at = i * beat
        place(music, bass(note_hz("A2" if i % 4 < 2 else "E2")), at, 0.6)
        if i % 2 == 1:
            place(music, chord(["A3", "C4", "E4"], 0.25), at, 0.35)
    # 4-6 s: music cuts out for the tool slam. Comic silence.

    # 6-16 s: upbeat C major groove. One chord per bar.
    progression = [
        (["C4", "E4", "G4"], "C2"),
        (["G3", "B3", "D4"], "G2"),
        (["A3", "C4", "E4"], "A2"),
        (["F3", "A3", "C4"], "F2"),
        (["C4", "E4", "G4"], "C2"),
    ]
    melody = ["E5", "G5", "C6", "G5", "D5", "G5", "B5", "G5",
              "C5", "E5", "A5", "E5", "C5", "F5", "A5", "F5",
              "E5", "G5", "C6", "E6"]
    start = 6.0
    for bar, (notes, root) in enumerate(progression):
        for b in range(4):
            at = start + (bar * 4 + b) * beat
            if at >= 16:
                break
            celebrate = at >= 13
            place(music, bass(note_hz(root)), at, 0.55)
            place(music, chord(notes), at + beat / 2, 0.45)
            place(music, kick(), at, 0.7 if celebrate else 0.45)
            place(music, hat(), at + beat / 2, 0.5)
            if celebrate:
                place(music, hat(), at + beat / 4, 0.3)
                place(music, hat(), at + 3 * beat / 4, 0.3)
                if b % 2 == 1:
                    place(music, clap(), at, 0.6)
                idx = (bar * 4 + b) % len(melody)
                place(music, pluck(note_hz(melody[idx]), 0.4, 8), at, 0.35)
                place(music, pluck(note_hz(melody[(idx + 1) % len(melody)]), 0.4, 8), at + beat / 2, 0.3)

    # 16.27 s: logo stamp lands; big C major chord rings out under it.
    for n in ["C3", "C4", "E4", "G4", "C5", "E5"]:
        place(music, pluck(note_hz(n), 2.5, 8), 16.27, 0.3)
    return music


def build_sfx():
    sfx = silence()
    # Tools raised overhead, then slammed down.
    place(sfx, whoosh(0.6), 4.15, 0.25)
    place(sfx, whoosh(0.25, rising=False), 4.82, 0.5)
    # Impacts (computed from the physics in FallingTools.tsx).
    place(sfx, clang(520), 5.252, 0.55)
    place(sfx, thud(), 5.252, 0.9)
    place(sfx, boom() * 0.25, 5.252, 0.6)
    place(sfx, clang(880), 5.272, 0.45)
    place(sfx, clang(520), 5.607, 0.2)
    place(sfx, clang(880), 5.619, 0.18)
    place(sfx, clang(520), 5.731, 0.08)
    place(sfx, clang(880), 5.741, 0.07)
    # Phone comes out, app screen slides in, quote builds up.
    place(sfx, blip(1320), 9.6, 0.35)
    place(sfx, whoosh(0.35), 9.95, 0.3)
    place(sfx, pop(), 10.1, 0.4)
    for i, at in enumerate([10.6, 10.9, 11.2]):
        place(sfx, blip(1000 + 200 * i), at, 0.4)
    place(sfx, cha_ching(), 11.65, 0.6)
    place(sfx, whoosh(0.3, rising=False), 12.4, 0.3)
    # Celebration sparkle.
    for i, n in enumerate(["C6", "E6", "G6", "C7"]):
        place(sfx, blip(note_hz(n), 0.2), 13.0 + i * 0.06, 0.25)
    # End card: logo falls, STAMPS (frame 488), builders hit the deck.
    place(sfx, whoosh(0.3, rising=True), 15.98, 0.45)
    place(sfx, boom(), 16.267, 1.0)
    place(sfx, thud(), 16.467, 0.8)  # builder A lands (frame 494)
    place(sfx, thud(), 16.567, 0.8)  # builder B lands (frame 497)
    return sfx


def save(name, samples, peak=0.9):
    samples = samples / max(1e-9, np.abs(samples).max()) * peak
    data = (samples * 32767).astype(np.int16)
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / name), "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(data.tobytes())
    print("wrote", OUT / name)


if __name__ == "__main__":
    save("trade-mate-music.wav", build_music(), peak=0.5)
    save("trade-mate-sfx.wav", build_sfx(), peak=0.9)
