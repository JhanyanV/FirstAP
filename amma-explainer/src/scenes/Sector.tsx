import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {ENGINEER} from '../characters/cast';
import {Person} from '../characters/Person';
import {ArtSvg, Row, SceneShell, Split, Stack} from '../components/layout';
import {Backdrop, Body, Eyebrow, FadeUp, Heading, StatTile} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

const TOKENS = [
  {sym: 'Cu', name: 'Copper', color: '#C8743D', x: 470, y: 250},
  {sym: 'Mo', name: 'Molybdenum', color: '#6F819A', x: 670, y: 160},
  {sym: 'Au', name: 'Gold', color: COLORS.gold, x: 860, y: 280},
];

const PIT_SHADES = ['#C3A36B', '#B0905A', '#9B7C4B', '#86693D', '#735832'];

const PitArt: React.FC<{frame: number}> = ({frame}) => {
  const truckX = 420 + (Math.sin(frame * 0.035) + 1) * 170;
  return (
    <ArtSvg panel={COLORS.sky}>
      <path d="M -40 700 L 230 390 L 400 560 L 620 300 L 1040 700 Z" fill={COLORS.mist} />
      <rect x={-40} y={690} width={1080} height={320} fill="#D8C49B" />
      {PIT_SHADES.map((c, k) => {
        const w = 780 - k * 130;
        return <rect key={k} x={620 - w / 2} y={700 + k * 46} width={w} height={46} fill={c} />;
      })}
      <rect x={-40} y={690} width={1080} height={10} fill="#E6D6B2" />
      {/* haul truck on the first bench */}
      <g transform={`translate(${truckX} 716)`}>
        <rect x={0} y={-4} width={78} height={30} rx={4} fill="#E8B53C" />
        <rect x={60} y={-22} width={26} height={22} rx={4} fill="#E8B53C" />
        <rect x={64} y={-18} width={16} height={10} rx={2} fill="#9CC3E6" />
        <circle cx={16} cy={28} r={10} fill={COLORS.navy} />
        <circle cx={66} cy={28} r={10} fill={COLORS.navy} />
      </g>
      {TOKENS.map((t, i) => {
        const p = pop(frame, 14 + i * 10, 11);
        const bob = Math.sin(frame * 0.06 + i * 1.7) * 10;
        return (
          <g key={t.sym} transform={`translate(${t.x} ${t.y + bob}) scale(${p})`}>
            <circle r={70} fill={t.color} />
            <circle r={70} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />
            <text textAnchor="middle" y={18} fontFamily={FONT_LATIN} fontWeight={800} fontSize={56} fill="#FFFFFF">
              {t.sym}
            </text>
            <text textAnchor="middle" y={112} fontFamily={FONT_LATIN} fontWeight={700} fontSize={28} fill={COLORS.navy}>
              {t.name}
            </text>
          </g>
        );
      })}
      <Person {...ENGINEER} frame={frame} x={170} y={960} scale={1.02} seed={2} />
    </ArtSvg>
  );
};

export const Sector: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const c1 = cueFrame('sector', 1);
  const tileW = vertical ? 440 : 360;
  return (
    <SceneShell background={<Backdrop kind="paper" />} duration={duration}>
      <Split
        text={
          <Stack gap={vertical ? 22 : 26}>
            <FadeUp delay={4}>
              <Eyebrow>Armenia today</Eyebrow>
            </FadeUp>
            <FadeUp delay={10}>
              <Heading size={vertical ? 68 : 72}>Copper, molybdenum and gold</Heading>
            </FadeUp>
            <FadeUp delay={24}>
              <Body size={vertical ? 34 : 34}>On the Tethyan Metallogenic Belt, a major copper–gold province</Body>
            </FadeUp>
            <div style={{height: 8}} />
            <Row gap={24}>
              <StatTile countTo={8} label="metallic deposits in operation" delay={c1} width={tileW} valueSize={72} />
              <StatTile value="30–35%" label="of merchandise exports" delay={c1 + 45} width={tileW} valueSize={72} />
            </Row>
          </Stack>
        }
        art={<PitArt frame={frame} />}
      />
    </SceneShell>
  );
};
