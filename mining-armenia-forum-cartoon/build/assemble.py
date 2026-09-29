"""Builds the final film from manifest.json: downloads the Higgsfield clips and
narration, tightens pauses, times every scene to its line, composites the
title cards, scores it and mixes. Output: out/mining-armenia-forum.mp4"""
import concurrent.futures as cf
import json
import os
import re
import subprocess

import numpy as np

SR, FPS, XF = 48000, 30, 0.6
M = json.load(open("manifest.json"))
os.makedirs("in", exist_ok=True)
os.makedirs("out", exist_ok=True)


def sh(*args, **kw):
    return subprocess.run(list(args), check=True, **kw)


def fetch(url_path):
    url, path = url_path
    if not os.path.exists(path):
        sh("curl", "-sSf", "--retry", "3", "-o", path, url)


jobs = [(s["clip"], f"in/c{s['n']:02}.mp4") for s in M["scenes"]]
jobs += [(s["vo"], f"in/v{s['n']:02}.wav") for s in M["scenes"]]
with cf.ThreadPoolExecutor(12) as ex:
    list(ex.map(fetch, jobs))


def load(path):
    raw = sh("ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-",
             capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def tighten(x, max_gap=0.5, keep_gap=0.38):
    """Trim head/tail silence and shorten internal pauses longer than max_gap."""
    fr = SR // 100
    nf = len(x) // fr
    db = 20 * np.log10(np.sqrt((x[: nf * fr].reshape(nf, fr) ** 2).mean(1)) + 1e-9)
    voiced = db > -42
    idx = np.flatnonzero(voiced)
    a, b = max(0, idx[0] - 3), min(nf, idx[-1] + 10)
    keep = np.zeros(nf, bool)
    keep[a:b] = True
    i = a
    while i < b:
        if voiced[i]:
            i += 1
            continue
        j = i
        while j < b and not voiced[j]:
            j += 1
        if j - i > max_gap * 100:
            half = int(keep_gap * 50)
            keep[i + half: j - half] = False
        i = j
    frames = np.flatnonzero(keep)
    y = x[: nf * fr].reshape(nf, fr)[frames].ravel()
    # onsets of words that follow a pause (used to sync the pillar titles)
    v = voiced[frames]
    onsets = [k / 100 for k in range(12, len(v)) if v[k] and not v[k - 12: k].any()]
    return y, onsets


vo, onsets = {}, {}
for s in M["scenes"]:
    vo[s["n"]], onsets[s["n"]] = tighten(load(f"in/v{s['n']:02}.wav"))


def probe(path):
    out = sh("ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
             "stream=width,height,r_frame_rate:format=duration", "-of", "json", path,
             capture_output=True).stdout
    return json.loads(out)


# timeline: each scene lasts at least as long as its line plus air
T, t = {}, 0.0
for s in M["scenes"]:
    n = s["n"]
    s["cl"] = float(probe(f"in/c{n:02}.mp4")["format"]["duration"])
    need = s["off"] + len(vo[n]) / SR + (0.55 if n < 12 else 3.4)
    s["D"] = round(max(s["plan"], need), 2)
    T[n] = t
    t += s["D"] - XF
TOTAL = round(t + XF, 2)

# narration track
voice = np.zeros(int((TOTAL + 1) * SR), np.float32)
for s in M["scenes"]:
    st = int((T[s["n"]] + s["off"]) * SR)
    voice[st: st + len(vo[s["n"]])] += vo[s["n"]]
sh("ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
   "-c:a", "pcm_s24le", "out/voice.wav", input=voice.tobytes())

# titles and score
sh("node", "render_titles.js", env={**os.environ, "NODE_PATH": "/usr/local/lib/node_modules"})
LOGO_AT = 3.8  # lands on "the Mining Armenia Forum"
marks = {"arp": T[3], "hits": [T[4] + LOGO_AT, T[5], T[7], T[11]], "final": T[12]}
music = subprocess.Popen(["python3", "music.py", "out/music.wav", str(TOTAL + 1), json.dumps(marks)])

# overlay cues, seconds from scene start (None = until the scene ends)
p = [M["scenes"][9]["off"] + o for o in onsets[10][-4:]]
if len(p) < 4:
    p = [2.9, 3.8, 4.7, 5.7]
CUES = {
    4: [("s4", LOGO_AT)], 5: [("s5", 0.5)], 6: [("s6", 1.0)], 7: [("s7", 0.8)], 8: [("s8", 1.0)],
    9: [("s9bg", 0.7), ("s9a", 1.1), ("s9b", 1.6), ("s9c", 2.1), ("s9d", 2.6)],
    10: [("s10bg", p[0] - 0.5)] + list(zip(["s10a", "s10b", "s10c", "s10d"], p)),
    11: [("s11", 0.9)], 12: [("s12a", 0.9), ("s12b", 4.2)],
}


def segment(s):
    n, D, cl = s["n"], s["D"], s["cl"]
    slow = min(1.15, max(1.0, D / (cl - 0.05)))
    chain = (f"[0:v]scale=1920:1080:flags=lanczos,setsar=1,setpts=PTS*{slow:.4f},fps={FPS},"
             f"tpad=stop_mode=clone:stop_duration=6,trim=duration={D},vignette=angle=0.42[v0]")
    args, last = ["-i", f"in/c{n:02}.mp4"], "v0"
    for k, (name, a) in enumerate(CUES.get(n, []), 1):
        args += ["-loop", "1", "-t", str(D), "-i", f"t/{name}.png"]
        out_fade = "" if n == 12 else f",fade=t=out:st={D - 0.75:.2f}:d=0.5:alpha=1"
        chain += (f";[{k}:v]format=rgba,fade=t=in:st={a:.2f}:d=0.8:alpha=1{out_fade}[o{k}]"
                  f";[{last}][o{k}]overlay=x=0:y='if(lt(t,{a:.2f}),22,"
                  f"if(lt(t,{a + 0.9:.2f}),22*pow(1-(t-{a:.2f})/0.9,2),0))':eval=frame[v{k}]")
        last = f"v{k}"
    sh("ffmpeg", "-v", "error", "-y", *args, "-filter_complex", chain, "-map", f"[{last}]",
       "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p",
       "-r", str(FPS), f"out/seg{n:02}.mp4")
    return n, slow


with cf.ThreadPoolExecutor(3) as ex:
    slows = dict(ex.map(segment, M["scenes"]))

# dissolve chain, fade from and to black
inputs, chain, prev, off = [], "", "0:v", 0.0
for i, s in enumerate(M["scenes"]):
    inputs += ["-i", f"out/seg{s['n']:02}.mp4"]
    if i:
        off += M["scenes"][i - 1]["D"] - XF
        chain += f"[{prev}][{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}];"
        prev = f"x{i}"
chain += f"[{prev}]fade=t=in:st=0:d=1.0,fade=t=out:st={TOTAL - 1.4:.2f}:d=1.4,format=yuv420p[v]"
sh("ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", chain, "-map", "[v]",
   "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-r", str(FPS), "-t", str(TOTAL),
   "out/picture.mp4")

music.wait()
assert music.returncode == 0, "score failed"


def lufs(path):
    log = sh("ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128", "-f", "null", "-",
             capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", log)[-1])


# sit the score about 11 LU under the narration before ducking
music_gain = 10 ** ((lufs("out/voice.wav") - 11 - lufs("out/music.wav")) / 20)
mix = (f"[1:a]highpass=f=80,acompressor=threshold=0.12:ratio=3:attack=5:release=120,"
       f"equalizer=f=3200:t=q:w=1:g=2,aformat=channel_layouts=stereo,asplit=2[vo][sc];"
       f"[0:a]volume={music_gain:.3f}[m];[m][sc]sidechaincompress=threshold=0.025:ratio=6:attack=25:release=450[md];"
       f"[md][vo]amix=inputs=2:duration=first:normalize=0,atrim=0:{TOTAL},"
       f"loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st={TOTAL - 2:.2f}:d=2[a]")
sh("ffmpeg", "-v", "error", "-y", "-i", "out/music.wav", "-i", "out/voice.wav",
   "-filter_complex", mix, "-map", "[a]", "-ar", str(SR), "out/mix.wav")
sh("ffmpeg", "-v", "error", "-y", "-i", "out/picture.mp4", "-i", "out/mix.wav",
   "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
   "-movflags", "+faststart", "-shortest", "out/mining-armenia-forum.mp4")

report = {
    "total": TOTAL,
    "scenes": [{"n": s["n"], "start": round(T[s["n"]], 2), "dur": s["D"], "clip": round(s["cl"], 2),
                "slow": round(slows[s["n"]], 3), "line": round(len(vo[s["n"]]) / SR, 2)}
               for s in M["scenes"]],
    "pillar_cues": [round(x, 2) for x in p],
    "music_gain_db": round(20 * np.log10(music_gain), 1),
    "source": probe("in/c01.mp4")["streams"][0],
}
json.dump(report, open("out/report.json", "w"), indent=1)
print(json.dumps(report))
