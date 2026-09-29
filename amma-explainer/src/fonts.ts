import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/fonts (see scripts/copy-fonts.mjs) and loaded
// locally; nothing is fetched from the network at render time.
const FACES: {family: string; file: string; weight: string}[] = [
  {family: 'Noto Sans', file: 'noto-sans-latin-400-normal.woff2', weight: '400'},
  {family: 'Noto Sans', file: 'noto-sans-latin-600-normal.woff2', weight: '600'},
  {family: 'Noto Sans', file: 'noto-sans-latin-700-normal.woff2', weight: '700'},
  {family: 'Noto Sans', file: 'noto-sans-latin-800-normal.woff2', weight: '800'},
  {family: 'Noto Sans Armenian', file: 'noto-sans-armenian-armenian-400-normal.woff2', weight: '400'},
  {family: 'Noto Sans Armenian', file: 'noto-sans-armenian-armenian-700-normal.woff2', weight: '700'},
];

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const f of FACES) {
    loadFont({family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, format: 'woff2'});
  }
};
