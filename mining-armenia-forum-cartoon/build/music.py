"""Original score for the film: warm pad, bass, bell arpeggio, low hits.

usage: music.py OUT.wav TOTAL_SECONDS '{"arp":t,"hits":[..],"final":t}'
"""
import json
import subprocess
import sys

import numpy as np

SR = 48000
out, total, mk = sys.argv[1], float(sys.argv[2]), json.loads(sys.argv[3])
N = int(SR * total)
mix = np.zeros((2, N), np.float32)
rng = np.random.default_rng(7)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(start, sig):
    s = int(start * SR)
    if s < 0:
        sig, s = sig[:, -s:], 0
    e = min(N, s + sig.shape[1])
    if e > s:
        mix[:, s:e] += sig[:, : e - s]


CHORDS = {
    "Bm": (35, [54, 59, 62, 66]),
    "G": (43, [55, 59, 62, 67]),
    "D": (38, [57, 62, 66, 69]),
    "A": (45, [57, 61, 64, 69]),
}
BAR = 3.0
fin = mk["final"]
seq, t, k = [], 0.0, 0
while t < fin - 0.01:
    seq.append((t, ["Bm", "G", "D", "A"][k % 4], BAR))
    t, k = t + BAR, k + 1
seq += [(fin, "G", BAR), (fin + BAR, "A", BAR), (fin + 2 * BAR, "D", total - fin - 2 * BAR)]


def envelope(n, rise, fall):
    e = np.ones(n, np.float32)
    r, f = int(rise * SR), int(fall * SR)
    e[:r] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, r))
    e[-f:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, f))
    return e


def tone(m, dur, harmonics, tilt, detune):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = np.zeros((2, n), np.float32)
    for ch, d in enumerate((-detune, detune)):
        s = np.zeros(n)
        for h in range(1, harmonics + 1):
            s += np.sin(2 * np.pi * hz(m) * (1 + d) * h * tt + rng.uniform(0, 6.28)) / h ** tilt
        sig[ch] = s
    return sig


for start, name, length in seq:
    root, voicing = CHORDS[name]
    dur = length + 2.2
    env = envelope(int(dur * SR), 1.2, 1.8)
    late = start >= fin
    for m in voicing:
        add(start - 0.6, tone(m, dur, 6, 1.5, 0.0025) * env * 0.045)
        if late:
            add(start - 0.6, tone(m + 12, dur, 3, 1.8, 0.004) * env * 0.02)
    bass = tone(root + 12 if root < 40 else root, dur, 2, 2.0, 0.0) * env
    add(start - 0.6, bass * (0.10 if start >= mk["arp"] else 0.05))

# bell arpeggio
bell_cache = {}


def bell(m):
    if m not in bell_cache:
        n = int(2.4 * SR)
        tt = np.arange(n) / SR
        s = np.zeros(n)
        for ratio, amp, dec in ((1, 1, 1.6), (2, 0.42, 0.9), (3.01, 0.22, 0.55), (4.07, 0.1, 0.35)):
            s += amp * np.sin(2 * np.pi * hz(m) * ratio * tt) * np.exp(-tt / dec)
        s *= np.minimum(1, tt / 0.004)
        bell_cache[m] = s.astype(np.float32)
    return bell_cache[m]


pattern = [0, 2, 1, 3, 2, 1, 3, 2]
step, i = 0.375, 0
t = mk["arp"]
while t < fin + 2 * BAR:
    name = next(c for s, c, l in reversed(seq) if s <= t + 1e-6)
    m = CHORDS[name][1][pattern[i % 8]] + 12
    vel = 0.55 + 0.35 * (i % 4 == 0) + 0.1 * rng.random()
    pan = 0.35 if i % 2 else 0.65
    b = bell(m) * vel * 0.05
    add(t, np.stack([b * (1 - pan) * 1.4, b * pan * 1.4]))
    t, i = t + step, i + 1

# low hits with an airy riser before each
for h in mk["hits"]:
    n = int(2.6 * SR)
    tt = np.arange(n) / SR
    freq = 38 + 34 * np.exp(-tt / 0.18)
    boom = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt / 0.9)
    thump = np.convolve(rng.standard_normal(n), np.ones(40) / 40, "same") * np.exp(-tt / 0.08)
    s = (boom * 0.42 + thump * 0.25).astype(np.float32)
    add(h, np.stack([s, s]))
    rn = int(1.6 * SR)
    noise = np.diff(rng.standard_normal(rn + 1)) * (np.linspace(0, 1, rn) ** 2.2) * 0.022
    add(h - 1.6, np.stack([noise, np.roll(noise, 97)]).astype(np.float32))

# dynamics across the film
pts = [(0, 0.55), (mk["arp"], 0.75), (mk["hits"][0], 0.9), (fin, 1.05), (total, 1.0)]
curve = np.interp(np.arange(N) / SR, [p[0] for p in pts], [p[1] for p in pts]).astype(np.float32)
mix *= curve
mix = np.tanh(mix * 1.1) / 1.1
mix /= np.abs(mix).max() / 0.8

dry = out.replace(".wav", "_dry.wav")
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
     "-c:a", "pcm_s24le", dry],
    input=mix.T.astype(np.float32).tobytes(), check=True)
subprocess.run(
    ["sox", dry, out, "reverb", "55", "45", "95", "100", "18", "-1",
     "gain", "-n", "-1", "fade", "t", "0.8", f"{total:.3f}", "3"], check=True)
