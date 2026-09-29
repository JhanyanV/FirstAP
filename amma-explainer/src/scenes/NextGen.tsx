import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {STUDENT} from '../characters/cast';
import {Person} from '../characters/Person';
import {ArtSvg, SceneShell, Split, Stack} from '../components/layout';
import {Backdrop, Chip, Eyebrow, FadeUp, Heading} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

const Plate: React.FC<{x: number; y: number; w: number; label: string}> = ({x, y, w, label}) => (
  <g>
    <rect x={x - w / 2} y={y - 30} width={w} height={54} rx={12} fill={COLORS.gold} />
    <text x={x} y={y + 8} textAnchor="middle" fontFamily={FONT_LATIN} fontWeight={800} fontSize={30} fill={COLORS.navy}>
      {label}
    </text>
  </g>
);

const CampusArt: React.FC<{frame: number}> = ({frame}) => {
  const arrive = 55;
  const x = interpolate(frame, [0, arrive], [1080, 500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const walking = frame < arrive;
  return (
    <ArtSvg>
      <rect x={-1200} y={900} width={3400} height={500} fill="#D5DFEB" />
      {/* classical university building */}
      <polygon points="30,500 210,400 390,500" fill={COLORS.navy} />
      <rect x={50} y={500} width={320} height={400} fill="#FFFFFF" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={78 + i * 76} y={560} width={40} height={300} fill={COLORS.mist} />
      ))}
      <rect x={40} y={860} width={340} height={40} fill={COLORS.mist} />
      <Plate x={210} y={470} w={120} label="YSU" />
      {/* modern polytechnic block */}
      <rect x={640} y={430} width={320} height={470} fill={COLORS.navySoft} />
      {Array.from({length: 4}, (_, r) =>
        Array.from({length: 4}, (_, c) => (
          <rect key={`${r}-${c}`} x={666 + c * 72} y={520 + r * 86} width={48} height={56} rx={6} fill={COLORS.goldLight} opacity={0.85} />
        )),
      )}
      <Plate x={800} y={470} w={220} label="Polytechnic" />
      <Person {...STUDENT} frame={frame} x={x} y={960} scale={1.02} walking={walking} waving={!walking} seed={5} />
    </ArtSvg>
  );
};

export const NextGen: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const c1 = cueFrame('nextgen', 1);
  return (
    <SceneShell background={<Backdrop kind="sky" />} duration={duration}>
      <Split
        text={
          <Stack gap={vertical ? 22 : 28}>
            <FadeUp delay={4}>
              <Eyebrow>Knowledge and the next generation</Eyebrow>
            </FadeUp>
            <FadeUp delay={10}>
              <Heading size={vertical ? 68 : 76}>Building the next generation</Heading>
            </FadeUp>
            <Chip delay={c1}>Yerevan State University</Chip>
            <Chip delay={c1 + 14}>National Polytechnic University of Armenia</Chip>
          </Stack>
        }
        art={<CampusArt frame={frame} />}
      />
    </SceneShell>
  );
};
