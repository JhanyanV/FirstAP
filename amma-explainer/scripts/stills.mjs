// Renders review stills: node scripts/stills.mjs <outDir> <composition> <frame> [<frame>...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, compId, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});
for (const f of frames) {
  const output = path.join(outDir, `${compId}_${String(f).padStart(4, '0')}.png`);
  await renderStill({serveUrl, composition, frame: Number(f), output, browserExecutable});
  console.log(output);
}
