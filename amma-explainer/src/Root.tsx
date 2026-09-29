import React from 'react';
import {Composition} from 'remotion';
import {Explainer} from './Explainer';
import {FPS, TOTAL_FRAMES} from './script';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Main 16:9 cut. Subtitles ship separately as an .srt file. */}
    <Composition
      id="AMMAExplainer"
      component={Explainer}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{captions: false}}
    />
    {/* 9:16 social cut with burned-in captions for muted autoplay. */}
    <Composition
      id="AMMAExplainerVertical"
      component={Explainer}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{captions: true}}
    />
  </>
);
