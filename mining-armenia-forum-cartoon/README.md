# Mining Armenia Forum: "From Resources to Opportunities"

A roughly 90-second animated story film about the
[Mining Armenia Forum](https://miningforum.am/): its history (2024, 2025,
2026), its participants and why it matters. It is drawn in an elegant 2D
illustrated style in the forum's indigo and gold, with English narration.

- **Watch / download:** see the link in [`FILM.md`](FILM.md). The rendered MP4
  lives in the Higgsfield project "Mining Armenia Forum — Cartoon Film".
- **Script and sources:** [`SCRIPT.md`](SCRIPT.md). Every fact is taken from miningforum.am.

## How it was made

| Layer | Tool |
|-------|------|
| Style frame and 12 keyframes | Higgsfield image generation (Nano Banana), with one style frame as the reference for all scenes |
| Animation | Higgsfield video generation (Kling 3.0 Pro, image-to-video), one clip per scene |
| Narration | Higgsfield text-to-speech (Seed Audio, voice "Imogen") |
| Score | Original, synthesized in [`build/music.py`](build/music.py) (pad, bass, bell arpeggio, low hits, reverb) |
| Titles | [`build/titles.html`](build/titles.html), set in Cormorant Garamond and Montserrat and rendered to transparent PNGs by [`build/render_titles.js`](build/render_titles.js); the official logo and sponsor logos come from miningforum.am |
| Edit | [`build/assemble.py`](build/assemble.py): tightens pauses in the narration, times each scene to its line, composites the titles, dissolves between scenes, ducks the music under the voice, loudness-normalizes to −16 LUFS |

## Rebuilding

The pipeline needs `ffmpeg`, `sox`, Python 3 with NumPy, and Node with
Playwright (Chromium). [`build/manifest.json`](build/manifest.json) lists every
Higgsfield asset URL.

```sh
cd build
NODE_PATH=$(npm root -g) python3 assemble.py   # writes out/mining-armenia-forum.mp4
```
