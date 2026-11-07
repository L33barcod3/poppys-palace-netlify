"""Synthesize the sound effects for the Vinted video (no samples, no licensing).

Times match src/vinted/timeline.ts and poses.ts at 30 fps. Re-run after
changing the timeline:

    python3 scripts/make-vinted-audio.py
"""

import importlib.util
from pathlib import Path

import numpy as np

# Reuse the instruments and helpers from the TradeMate audio script.
_spec = importlib.util.spec_from_file_location(
    "tm_audio", Path(__file__).with_name("make-trade-mate-audio.py")
)
tm = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tm)

FPS = 30
DURATION = 12.5
SR = tm.SR
rng = np.random.default_rng(23)
place, t_axis, lowpass, note_hz = tm.place, tm.t_axis, tm.lowpass, tm.note_hz


def f2s(frame):
    return frame / FPS


def tap():
    t = t_axis(0.03)
    return rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.25


def stomp():
    t = t_axis(0.25)
    pitch = 55 + 70 * np.exp(-t * 40)
    body = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 18)
    heel = lowpass(rng.standard_normal(len(t)), 0.6) * np.exp(-t * 90) * 0.5
    return body + heel


def door_slam():
    t = t_axis(1.0)
    pitch = 45 + 80 * np.exp(-t * 25)
    boom = np.sin(2 * np.pi * np.cumsum(pitch) / SR) * np.exp(-t * 7)
    crack = lowpass(rng.standard_normal(len(t)), 0.5) * np.exp(-t * 45) * 1.2
    wood = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(180, 14), (310, 18), (520, 25)]) * 0.4
    return boom + crack + wood


def rattle():
    # Plastic figures knocking about inside a parcel.
    out = np.zeros(int(0.12 * SR))
    for _ in range(4):
        t = t_axis(0.02)
        click = np.sin(2 * np.pi * (1800 + rng.random() * 1500) * t) * np.exp(-t * 400)
        place(out, click, rng.random() * 0.09, 0.4 + rng.random() * 0.4)
    return out


def womp(freq, seconds):
    # Muted brass-ish note with a wobble, for the sad trombone.
    t = t_axis(seconds)
    vib = 1 + 0.012 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t * 3)
    phase = 2 * np.pi * np.cumsum(freq * vib) / SR
    saw = sum(np.sin(k * phase) / k for k in range(1, 9))
    env = np.minimum(1, t * 20) * np.minimum(1, (seconds - t) * 6)
    return lowpass(saw * env, 0.18)


def build():
    sfx = np.zeros(int(DURATION * SR))

    # Room tone throughout.
    place(sfx, lowpass(rng.standard_normal(len(sfx)), 0.01) * 0.6, 0, 0.5)

    # Chilled sitcom bass + snaps while Lee scrolls; cut dead by the door.
    for i, n in enumerate(["D2", "D2", "F2", "G2"]):
        place(sfx, tm.bass(note_hz(n)), 0.05 + i * 0.3, 0.45)
    for i in range(4):
        place(sfx, tm.hat(), 0.2 + i * 0.3, 0.6)
    for at in [0.35, 0.62, 0.95]:
        place(sfx, tap(), at, 0.8)

    # Door: handle whoosh, then it slams into the wall (frame ~41).
    place(sfx, tm.whoosh(0.25), f2s(35), 0.35)
    place(sfx, door_slam(), f2s(41), 1.0)

    # Stomping footsteps: steps where the walk phase crosses each half-cycle.
    steps = 6
    for k in range(1, steps + 1):
        p = 1 - np.sqrt(1 - k / steps)
        place(sfx, stomp(), f2s(40 + 60 * p), 0.7)

    # Parcel shaken during the rant (shake cycle ~7 frames).
    for f in range(108, 222, 7):
        place(sfx, rattle(), f2s(f), 0.25)

    # Parcel dumped on the table.
    place(sfx, stomp(), f2s(229), 0.4)
    place(sfx, rattle(), f2s(229), 0.6)

    # Sad trombone after "But they were six quid."
    for i, (n, d) in enumerate([("D4", 0.32), ("C#4", 0.32), ("C4", 0.32), ("B3", 1.1)]):
        place(sfx, womp(note_hz(n), d), 10.05 + i * 0.34, 0.5)
    return sfx


if __name__ == "__main__":
    tm.OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
    tm.save("vinted-sfx.wav", build(), peak=0.85)
