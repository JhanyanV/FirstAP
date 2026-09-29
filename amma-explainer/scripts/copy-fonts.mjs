// Copies the Noto Sans / Noto Sans Armenian woff2 files from @fontsource into
// public/fonts so the video loads them locally (no network at render time).
import {copyFileSync, mkdirSync} from 'node:fs';

const files = [
  ['noto-sans', 'noto-sans-latin-400-normal.woff2'],
  ['noto-sans', 'noto-sans-latin-600-normal.woff2'],
  ['noto-sans', 'noto-sans-latin-700-normal.woff2'],
  ['noto-sans', 'noto-sans-latin-800-normal.woff2'],
  ['noto-sans-armenian', 'noto-sans-armenian-armenian-400-normal.woff2'],
  ['noto-sans-armenian', 'noto-sans-armenian-armenian-700-normal.woff2'],
];

mkdirSync('public/fonts', {recursive: true});
for (const [pkg, file] of files) {
  copyFileSync(`node_modules/@fontsource/${pkg}/files/${file}`, `public/fonts/${file}`);
}
copyFileSync('node_modules/@fontsource/noto-sans/LICENSE', 'public/fonts/OFL-LICENSE.txt');
console.log(`Copied ${files.length} font files to public/fonts`);
