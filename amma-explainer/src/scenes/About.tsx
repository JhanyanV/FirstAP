import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {ArtSvg, SceneShell, Split, Stack} from '../components/layout';
import {Backdrop, Body, Chip, Eyebrow, FadeUp, Heading, StatTile} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

// Brochure p. 15: 18 + 5 + 13 + 6 = 42 member organisations.
const GROUPS = [
  {label: 'Mining', count: 18, color: COLORS.navy, glyph: 'mountain'},
  {label: 'Metallurgy & processing', count: 5, color: COLORS.goldDeep, glyph: 'ingot'},
  {label: 'Services & technology', count: 13, color: COLORS.navySoft, glyph: 'gear'},
  {label: 'Science & education', count: 6, color: COLORS.gold, glyph: 'cap'},
] as const;

type Glyph = (typeof GROUPS)[number]['glyph'];

const GlyphIcon: React.FC<{glyph: Glyph}> = ({glyph}) => {
  switch (glyph) {
    case 'mountain':
      return <path d="M -30 22 L -6 -22 L 6 -4 L 12 -12 L 32 22 Z" fill="#FFFFFF" />;
    case 'ingot':
      return (
        <g fill="#FFFFFF">
          <path d="M -30 22 L -22 4 L 22 4 L 30 22 Z" />
          <path d="M -18 0 L -11 -16 L 11 -16 L 18 0 Z" opacity={0.8} />
        </g>
      );
    case 'gear':
      return (
        <g fill="#FFFFFF">
          {[0, 45, 90, 135].map((a) => (
            <rect key={a} x={-5} y={-27} width={10} height={54} rx={3} transform={`rotate(${a})`} />
          ))}
          <circle r={18} />
          <circle r={8} fill={COLORS.navySoft} />
        </g>
      );
    case 'cap':
      return (
        <g fill="#FFFFFF">
          <path d="M -32 -6 L 0 -20 L 32 -6 L 0 8 Z" />
          <path d="M -18 2 L -18 16 Q 0 26 18 16 L 18 2 L 0 10 Z" />
        </g>
      );
  }
};

const MemberGrid: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const tiles: {color: string; glyph: Glyph}[] = GROUPS.flatMap((g) => Array.from({length: g.count}, () => ({color: g.color, glyph: g.glyph})));
  return (
    <ArtSvg>
      {tiles.map((t, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const p = pop(frame, start + i * 1.5, 12);
        return (
          <g key={i} transform={`translate(${140 + col * 120} ${110 + row * 120}) scale(${p})`}>
            <rect x={-50} y={-50} width={100} height={100} rx={22} fill={t.color} />
            <GlyphIcon glyph={t.glyph} />
          </g>
        );
      })}
      {GROUPS.map((g, i) => {
        const p = pop(frame, start + 20 + i * 8, 14);
        const x = i % 2 === 0 ? 90 : 540;
        const y = 850 + Math.floor(i / 2) * 64;
        return (
          <g key={g.label} opacity={Math.min(1, p)} transform={`translate(${x} ${y})`}>
            <rect x={0} y={-24} width={34} height={34} rx={9} fill={g.color} />
            <text x={50} y={2} fontFamily={FONT_LATIN} fontWeight={700} fontSize={30} fill={COLORS.navy}>
              {g.label} <tspan fill={COLORS.goldDeep}>· {g.count}</tspan>
            </text>
          </g>
        );
      })}
    </ArtSvg>
  );
};

export const About: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const c1 = cueFrame('about', 1);
  const c2 = cueFrame('about', 2);
  return (
    <SceneShell background={<Backdrop kind="paper" />} duration={duration}>
      <Split
        text={
          <Stack gap={vertical ? 22 : 28}>
            <FadeUp delay={4}>
              <Eyebrow>About AMMA</Eyebrow>
            </FadeUp>
            <FadeUp delay={10}>
              <Heading size={vertical ? 68 : 76}>A single voice for the sector</Heading>
            </FadeUp>
            <Chip delay={24}>Active since 2006</Chip>
            <div style={{display: 'flex', gap: 24, alignItems: 'stretch', flexDirection: vertical ? 'row' : 'column'}}>
              <StatTile countTo={42} label="member organisations" delay={c1} width={vertical ? 360 : 360} valueSize={96} />
              <FadeUp delay={c2} style={{alignSelf: 'center', maxWidth: vertical ? 520 : 620}}>
                <Body size={vertical ? 32 : 34} color={COLORS.navy} style={{fontWeight: 600}}>
                  Including all metal mining companies operating in Armenia
                </Body>
              </FadeUp>
            </div>
          </Stack>
        }
        art={<MemberGrid frame={frame} start={c1} />}
      />
    </SceneShell>
  );
};
