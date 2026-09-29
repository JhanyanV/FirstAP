import React from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {ENGINEER} from '../characters/cast';
import {Person} from '../characters/Person';
import {ArtSvg, SceneShell, Split, Stack} from '../components/layout';
import {Backdrop, Eyebrow, FadeUp, Heading, StatTile} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

const StageArt: React.FC<{frame: number}> = ({frame}) => {
  const screen = pop(frame, 10, 14);
  const sweep = Math.sin(frame * 0.04) * 8;
  return (
    <ArtSvg>
      {/* spotlights */}
      <defs>
        <linearGradient id="spot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0} />
          <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0.22} />
        </linearGradient>
      </defs>
      <polygon points="930,120 970,120 960,700 740,700" fill="url(#spot)" transform={`rotate(${sweep * 0.4} 950 120)`} />

      {/* screen */}
      <g transform={`translate(460 310) scale(${screen})`}>
        <rect x={-280} y={-170} width={560} height={340} rx={18} fill={COLORS.navyDeep} stroke={COLORS.gold} strokeWidth={6} />
        <image href={staticFile('amma-logo.png')} x={-85} y={-150} width={170} height={152} />
        <text textAnchor="middle" y={70} fontFamily={FONT_LATIN} fontWeight={800} fontSize={40} fill={COLORS.white}>
          Mining Armenia Forum
        </text>
        <text textAnchor="middle" y={122} fontFamily={FONT_LATIN} fontWeight={800} fontSize={40} fill={COLORS.gold}>
          2026
        </text>
      </g>

      {/* stage, speaker and podium */}
      <rect x={60} y={700} width={880} height={50} fill={COLORS.navySoft} />
      <rect x={60} y={700} width={880} height={6} fill={COLORS.gold} />
      <rect x={60} y={750} width={880} height={40} fill={COLORS.navyMid} />
      <Person {...ENGINEER} prop={undefined} frame={frame} x={846} y={700} scale={0.62} waving seed={4} />
      <path d="M 786 700 L 798 590 L 894 590 L 906 700 Z" fill={COLORS.gold} />
      <rect x={790} y={580} width={112} height={16} rx={4} fill={COLORS.goldDeep} />

      {/* audience */}
      {[0, 1, 2].map((row) =>
        Array.from({length: 9}, (_, i) => {
          const x = 90 + i * 104 + (row % 2) * 52;
          const y = 860 + row * 60 + Math.sin(frame * 0.08 + i + row) * 2;
          const fill = row === 2 ? COLORS.navyMid : row === 1 ? '#284C80' : '#3A6197';
          return (
            <g key={`${row}-${i}`}>
              <rect x={x - 38} y={y + 14} width={76} height={70} rx={30} fill={fill} />
              <circle cx={x} cy={y} r={24} fill={fill} />
            </g>
          );
        }),
      )}
    </ArtSvg>
  );
};

export const Forum: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const c1 = cueFrame('forum', 1);
  const tileW = vertical ? 285 : 236;
  return (
    <SceneShell background={<Backdrop kind="navy" />} duration={duration}>
      <Split
        text={
          <Stack gap={vertical ? 18 : 22}>
            <FadeUp delay={4}>
              <Eyebrow color={COLORS.gold}>Flagship platform · 3rd edition</Eyebrow>
            </FadeUp>
            <FadeUp delay={10}>
              <Heading color={COLORS.white} size={vertical ? 68 : 72}>
                Mining Armenia Forum 2026
              </Heading>
            </FadeUp>
            <FadeUp delay={18}>
              <div style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: 36, color: COLORS.gold}}>16–17 October · Tsaghkadzor</div>
            </FadeUp>
            <FadeUp delay={26}>
              <div style={{fontFamily: FONT_LATIN, fontWeight: 600, fontStyle: 'italic', fontSize: 32, color: COLORS.white, opacity: 0.9}}>
                “From Resources to Opportunities”
              </div>
            </FadeUp>
            <div style={{display: 'flex', gap: 18, marginTop: 10}}>
              <StatTile dark value="300+" label="participants" delay={c1} width={tileW} valueSize={60} />
              <StatTile dark value="20+" label="countries" delay={c1 + 12} width={tileW} valueSize={60} />
              <StatTile dark value="~50" label="speakers" delay={c1 + 24} width={tileW} valueSize={60} />
            </div>
            <FadeUp delay={c1 + 50}>
              <div style={{fontFamily: FONT_LATIN, fontWeight: 600, fontSize: 28, color: COLORS.goldLight}}>Just before COP17 in Armenia</div>
            </FadeUp>
          </Stack>
        }
        art={<StageArt frame={frame} />}
      />
    </SceneShell>
  );
};
