import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {CaptionBox} from './components/ui';
import {loadFonts} from './fonts';
import {useLayout} from './layout';
import {About} from './scenes/About';
import {Advocacy} from './scenes/Advocacy';
import {Closing} from './scenes/Closing';
import {Forum} from './scenes/Forum';
import {History} from './scenes/History';
import {International} from './scenes/International';
import {NextGen} from './scenes/NextGen';
import {Opening} from './scenes/Opening';
import {Sector} from './scenes/Sector';
import {Standards} from './scenes/Standards';
import {FPS, TIMED_SCENES} from './script';
import {COLORS} from './theme';

loadFonts();

const SCENE_COMPONENTS: Record<string, React.FC<{duration: number}>> = {
  opening: Opening,
  history: History,
  sector: Sector,
  about: About,
  advocacy: Advocacy,
  international: International,
  standards: Standards,
  forum: Forum,
  nextgen: NextGen,
  closing: Closing,
};

const currentCue = (frame: number) => {
  const scene = TIMED_SCENES.find((s) => frame >= s.from && frame < s.from + s.durationInFrames);
  if (!scene) return null;
  const t = (frame - scene.from) / FPS;
  return scene.cues.find((c) => t >= c.start && t < c.end)?.text ?? null;
};

export type ExplainerProps = {captions: boolean};

export const Explainer: React.FC<ExplainerProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  return (
    <AbsoluteFill style={{background: COLORS.navy}}>
      {TIMED_SCENES.map((s) => {
        const Scene = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} name={s.name} from={s.from} durationInFrames={s.durationInFrames}>
            <Scene duration={s.durationInFrames} />
          </Sequence>
        );
      })}
      {captions ? (
        <CaptionBox
          text={currentCue(frame)}
          bottom={vertical ? 90 : 50}
          fontSize={vertical ? 40 : 38}
          maxWidth={vertical ? 940 : 1400}
        />
      ) : null}
    </AbsoluteFill>
  );
};
