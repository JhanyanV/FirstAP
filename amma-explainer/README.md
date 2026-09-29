# AMMA explainer

A 1:59 flat-vector animated explainer about the **Armenian Mining and Metallurgy Association (AMMA / ՀՀՄԱ)** for international partners, built with [Remotion](https://www.remotion.dev/) (React + TypeScript).

## Deliverables

| File | What it is |
|---|---|
| `out/amma-explainer-16x9.mp4` | Main cut, 1920×1080, 30 fps, H.264, clean (no burned-in captions) |
| `out/amma-explainer-9x16.mp4` | Social cut, 1080×1920, 30 fps, H.264, burned-in captions for muted autoplay |
| `out/amma-explainer.srt` | Subtitles (same timeline for both cuts) |
| `VOICEOVER.md` | Timed voice-over script with delivery notes and brochure page references |
| `QUESTIONS.md` | Open questions and editorial decisions for AMMA to confirm |

Both MP4s are **silent**: the voice-over has not been recorded yet (see `QUESTIONS.md`).

## Source of truth

Every fact, date, number and name comes from the *AMMA 2026* partner brochure (EN print edition, FINAL r2). `src/script.ts` lists the brochure pages behind each scene, and the same file drives the scene timings, the subtitles and the voice-over script, so they can't drift apart.

## Scenes

| # | Scene | Time |
|---|---|---|
| 1 | Opening: logo, English and Armenian names | 0:00 |
| 2 | A centuries-old tradition: Akhtala, Alaverdi, Kapan, Kajaran, Agarak | 0:05 |
| 3 | The sector today: Tethyan belt, 8 operating deposits, 30–35% of exports | 0:20 |
| 4 | Who AMMA is: since 2006, 42 member organisations | 0:32 |
| 5 | Legislative advocacy 2024–2026 | 0:46 |
| 6 | International integration: ICMM (May 2026), partners, events | 1:02 |
| 7 | Standards: TSM, CMSI, CRIRSCO | 1:17 |
| 8 | Mining Armenia Forum 2026 | 1:33 |
| 9 | The next generation: YSU and the Polytechnic | 1:44 |
| 10 | Closing: vision, armmining.am | 1:52 |

## Design

- **Palette:** navy `#0E284B`, gold `#D2AC67`, white, plus tints of each (`src/theme.ts`).
- **Type:** Noto Sans (Latin) and Noto Sans Armenian, bundled as woff2 in `public/fonts` (SIL OFL) and loaded locally with `@remotion/fonts`.
- **Logo:** the gold triangle AMMA logo, extracted from the brochure's embedded image (`public/amma-logo.png`). It appears on the opening and closing frames.
- **Characters:** three invented figures (a geologist, an engineer and a student), all drawn from one SVG rig in `src/characters/Person.tsx`. They don't depict real people or existing cartoon characters.
- **One set of scenes, two formats:** each scene reads `useLayout()` and switches between a side-by-side (16:9) and a stacked (9:16) layout.

## Working on it

```bash
npm install
npm run studio          # live preview
npm run subs            # regenerate out/amma-explainer.srt and VOICEOVER.md from src/script.ts
npm run render          # subs + both MP4s + finalize (re-encode to yuv420p, faststart)
npm run typecheck
```

To change a line of narration, edit its cue in `src/script.ts` and run `npm run render`. On-screen reveals are keyed to cue start times, so they move with it.

In a sandbox without internet access, point Remotion at a local headless Chromium:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell npm run render
```

To add the recorded voice-over later, drop the file in `public/` and add `<Audio src={staticFile('voiceover.mp3')} />` to `src/Explainer.tsx`.
