// Single source of truth for the explainer: scene order, durations, voice-over
// lines (which double as subtitles) and the brochure pages each fact comes
// from. The scenes, the .srt file and VOICEOVER.md are all generated from this.
//
// Source: "AMMA 2026" partner brochure, EN print edition (FINAL r2).
// Page numbers below refer to that brochure.

export const FPS = 30;

export type Cue = {
  /** Seconds from the start of the scene. */
  start: number;
  end: number;
  text: string;
};

export type SceneDef = {
  id: string;
  name: string;
  /** Seconds. */
  duration: number;
  cues: Cue[];
  /** Direction notes for the voice artist. */
  delivery: string;
  /** What the viewer sees. */
  visuals: string;
  /** Brochure pages backing every fact used in the scene. */
  sources: string[];
};

export const SCENES: SceneDef[] = [
  {
    id: 'opening',
    name: 'Opening',
    duration: 5,
    cues: [
      {start: 0.6, end: 4.4, text: 'Meet AMMA: the Armenian Mining and Metallurgy Association.'},
    ],
    delivery: 'Warm, confident, unhurried. Slight pause after "AMMA".',
    visuals:
      'Navy background. The gold triangle logo rises in, followed by the English and Armenian names of the Association.',
    sources: ['p. 1 (cover: name, logo)', 'p. 42 (Armenian name)'],
  },
  {
    id: 'history',
    name: 'A centuries-old tradition',
    duration: 15,
    cues: [
      {start: 0.3, end: 2.7, text: "Armenia's mining story spans centuries."},
      {start: 2.8, end: 6.7, text: 'The Akhtala copper mines were first recorded in the 13th century.'},
      {start: 6.8, end: 9.0, text: 'Then came Alaverdi in the 1770s,'},
      {start: 9.0, end: 10.9, text: 'Kapan in the 1840s,'},
      {start: 10.9, end: 12.8, text: 'Kajaran in the 1950s,'},
      {start: 12.8, end: 14.6, text: 'and Agarak in 1963.'},
    ],
    delivery: 'Storyteller tone. Give each date its own beat; the markers pop in on the date.',
    visuals:
      'A geologist walks along a timeline through the mountains. Markers pop up: 13th c. Akhtala, 1770s Alaverdi, 1840s Kapan, 1950s Kajaran, 1963 Agarak.',
    sources: ['p. 9 ("A centuries-old tradition" timeline; Kirakos Gandzaketsi record of Akhtala)'],
  },
  {
    id: 'sector',
    name: 'The sector today',
    duration: 12,
    cues: [
      {
        start: 0.3,
        end: 5.3,
        text: "Armenia lies on the Tethyan belt, one of the world's major copper–gold provinces.",
      },
      {
        start: 5.4,
        end: 11.6,
        text: 'Eight metallic deposits are in operation, and mining is about 30–35% of merchandise exports.',
      },
    ],
    delivery: 'Factual, matter-of-fact. Read "30–35%" as "thirty to thirty-five percent".',
    visuals:
      'An engineer beside a terraced open pit. Copper, molybdenum and gold tokens float up. Stat tiles: 8 metallic deposits in operation; 30–35% of merchandise exports.',
    sources: ['p. 8 (copper, molybdenum and gold)', 'p. 9 (Tethyan Metallogenic Belt; 8 deposits in operation; 30–35% of merchandise exports)'],
  },
  {
    id: 'about',
    name: 'Who AMMA is',
    duration: 14,
    cues: [
      {
        start: 0.3,
        end: 4.4,
        text: 'Since 2006, AMMA has been the unifying link of the industry.',
      },
      {
        start: 4.5,
        end: 9.2,
        text: 'Its 42 member organisations span mining, metallurgy, services, science and education,',
      },
      {start: 9.3, end: 13.6, text: 'including every metal mining company operating in Armenia.'},
    ],
    delivery: 'Proud but plain. Stress "42" and "every".',
    visuals:
      'Counter runs to 42 while 42 member icons fill a grid, coloured by group: Mining 18, Metallurgy and processing 5, Services and technology 13, Science and education 6.',
    sources: ['p. 13 (active since 2006; unifying link; 42 members)', 'p. 15 (member groups 18 / 5 / 13 / 6; all metal mining companies are members)', 'p. 16'],
  },
  {
    id: 'advocacy',
    name: 'Legislative advocacy 2024–2026',
    duration: 16,
    cues: [
      {start: 0.3, end: 4.3, text: "From 2024 to 2026, AMMA took the sector's voice to government:"},
      {start: 4.4, end: 6.8, text: "at the Prime Minister's workshops,"},
      {start: 6.9, end: 10.6, text: 'in a standing working group with the ministry,'},
      {
        start: 10.7,
        end: 15.7,
        text: 'and with proposals on subsoil and land rights, waste, and environmental impact assessment.',
      },
    ],
    delivery: 'Steady, list-like rhythm. Each item lands as its card ticks.',
    visuals:
      'Proposal cards (document icons, not ticks) stack up while papers fly from an engineer into a government building: PM workshops 2025; MTAI–AMMA working group; subsoil and land rights; Law "On Waste"; EIA reform. A memorandum stamp: 2 July 2026.',
    sources: [
      'p. 20 (Prime Minister\'s workshops, Dilijan 18.04.2025 and Jermuk 29.11.2025)',
      'p. 18, 25 (MTAI–AMMA working group since 2023; memorandum 2 July 2026)',
      'p. 27–28 (subsoil and land rights; Law "On Waste"; EIA regulatory reform)',
    ],
  },
  {
    id: 'international',
    name: 'International integration',
    duration: 15,
    cues: [
      {
        start: 0.3,
        end: 6.3,
        text: 'In May 2026, AMMA became an association member of ICMM, the International Council on Mining and Metals.',
      },
      {start: 6.4, end: 10.6, text: 'Its partners include Eurometaux and the Mining Association of Canada,'},
      {start: 10.7, end: 14.7, text: 'and it represents Armenia at events from London to Lima.'},
    ],
    delivery: 'Outward-looking and upbeat. Spell out I-C-M-M.',
    visuals:
      'Night-blue globe grid. Gold arcs fly from Yerevan to London, Brussels, Toronto, Riyadh and Lima. Badge: ICMM association member, May 2026. Partner chips and ">10 MoUs and international memberships".',
    sources: ['p. 30 (ICMM association member, May 2026)', 'p. 31 (Eurometaux memorandum 2026; MAC; Critical Minerals Association (USA); event cities)', 'p. 16 (>10 MoUs and international memberships)'],
  },
  {
    id: 'standards',
    name: 'Standards',
    duration: 16,
    cues: [
      {
        start: 0.3,
        end: 5.6,
        text: 'On standards, AMMA completed TSM preparatory work with the Mining Association of Canada,',
      },
      {start: 5.7, end: 9.4, text: 'and is now working towards national adoption of CMSI.'},
      {
        start: 9.5,
        end: 15.6,
        text: 'It also champions the move from the Soviet reserve classification to CRIRSCO-aligned reporting.',
      },
    ],
    delivery: 'Clear and deliberate; acronyms read as letters: T-S-M, C-M-S-I, CRIRSCO as "cris-co".',
    visuals:
      'A geologist with a clipboard beside three badges: TSM (2025, preparatory work), CMSI (towards national adoption), CRIRSCO (JORC, NI 43-101). A card flips from "Soviet reserve classification" to "CRIRSCO-aligned reporting", labelled "The goal".',
    sources: ['p. 21 (two directions: CRIRSCO reporting; TSM / CMSI)', 'p. 22–23 (Soviet GKZ classification vs CRIRSCO; government working group 2026)', 'p. 24 (2025 TSM preparatory work with MAC; towards national adoption of CMSI)'],
  },
  {
    id: 'forum',
    name: 'Mining Armenia Forum 2026',
    duration: 11,
    cues: [
      {start: 0.3, end: 5.4, text: 'On 16–17 October, the third Mining Armenia Forum meets in Tsaghkadzor,'},
      {start: 5.5, end: 10.6, text: 'expecting over 300 participants from more than 20 countries.'},
    ],
    delivery: 'Inviting, a little more energy. Read "16–17 October" as "the sixteenth and seventeenth of October".',
    visuals:
      'A conference stage with the AMMA logo on screen and an audience. Titles: Mining Armenia Forum 2026, 16–17 October, Tsaghkadzor, "From Resources to Opportunities"; 300+ participants, 20+ countries, ~50 speakers; just before COP17 in Armenia.',
    sources: ['p. 33 (dates, venue, theme, 300+ participants, 20+ countries, ~50 speakers, just before COP17)'],
  },
  {
    id: 'nextgen',
    name: 'The next generation',
    duration: 8,
    cues: [
      {start: 0.3, end: 3.3, text: "AMMA is also building the next generation's capabilities,"},
      {
        start: 3.4,
        end: 7.7,
        text: 'with Yerevan State University and the National Polytechnic University of Armenia.',
      },
    ],
    delivery: 'Warm, forward-looking.',
    visuals: 'A student waves, books in hand, between two university buildings labelled YSU and Polytechnic.',
    sources: ['p. 39 (cooperation with YSU; planned joint programme with the Polytechnic)'],
  },
  {
    id: 'closing',
    name: 'Closing',
    duration: 7,
    cues: [
      {start: 0.3, end: 3.4, text: "AMMA: a single window to Armenia's mining sector."},
      {start: 3.5, end: 6.4, text: 'Learn more at armmining.am.'},
    ],
    delivery: 'Confident sign-off. Read the address as "arm-mining dot A-M".',
    visuals:
      'Navy background, gold triangle logo, the vision line "A stronger, more competitive, responsible and internationally integrated mining industry", and armmining.am. The three characters wave goodbye.',
    sources: ['p. 41 ("single window" for global partners)', 'p. 42 (vision line; armmining.am)'],
  },
];

export type TimedScene = SceneDef & {from: number; durationInFrames: number};

export const TIMED_SCENES: TimedScene[] = (() => {
  let from = 0;
  return SCENES.map((s) => {
    const durationInFrames = Math.round(s.duration * FPS);
    const timed = {...s, from, durationInFrames};
    from += durationInFrames;
    return timed;
  });
})();

export const TOTAL_FRAMES = TIMED_SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);

/** Frame (relative to scene start) at which a cue begins; used to sync visuals to the voice-over. */
export const cueFrame = (sceneId: string, index: number) => {
  const scene = SCENES.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Unknown scene ${sceneId}`);
  return Math.round(scene.cues[index].start * FPS);
};
