// Re-encodes the rendered MP4s to broadcast-range yuv420p with +faststart.
// Remotion's JPEG frame pipeline produces full-range yuvj420p, which some
// players and social platforms handle poorly. Uses the ffmpeg bundled with
// Remotion, so nothing extra needs installing.
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {renameSync} from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const binDir = path.dirname(require.resolve(`@remotion/compositor-${process.platform}-${process.arch}${process.platform === 'linux' ? '-gnu' : ''}/package.json`));
const env = {...process.env, LD_LIBRARY_PATH: binDir, DYLD_LIBRARY_PATH: binDir};

for (const name of ['amma-explainer-16x9.mp4', 'amma-explainer-9x16.mp4']) {
  const src = path.join('out', name);
  const tmp = path.join('out', `.tmp-${name}`);
  execFileSync(
    path.join(binDir, 'ffmpeg'),
    ['-y', '-loglevel', 'error', '-i', src, '-vf', 'scale=in_range=full:out_range=tv,format=yuv420p',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-movflags', '+faststart', '-an', tmp],
    {env, stdio: 'inherit'},
  );
  renameSync(tmp, src);
  console.log(`Finalized ${src}`);
}
