import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {GEOLOGIST} from '../characters/cast';
import {Person} from '../characters/Person';
import {ArtSvg, SceneShell, Split, Stack} from '../components/layout';
import {Backdrop, Eyebrow, FadeUp, Heading} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

// Brochure pp. 21–24.
const BADGES = [
  {acr: 'TSM', name: 'Towards Sustainable Mining', status: '2025 · preparatory work with MAC', cue: 0, color: COLORS.navySoft},
  {acr: 'CMSI', name: 'Consolidated Mining Standard Initiative', status: 'Working towards national adoption', cue: 1, color: COLORS.navy},
  {acr: 'CRIRSCO', name: 'International resource and reserve reporting', status: 'Government working group · 2026', cue: 2, color: COLORS.goldDeep},
];

const BadgeRow: React.FC<{b: (typeof BADGES)[number]; delay: number; vertical: boolean}> = ({b, delay, vertical}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 14);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: Math.min(1, p * 1.3),
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <div
        style={{
          width: vertical ? 210 : 200,
          flexShrink: 0,
          padding: '18px 0',
          borderRadius: 18,
          background: b.color,
          color: COLORS.white,
          fontFamily: FONT_LATIN,
          fontWeight: 800,
          fontSize: b.acr.length > 5 ? 34 : 42,
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        {b.acr}
      </div>
      <div>
        <div style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: vertical ? 30 : 30, color: COLORS.navy, lineHeight: 1.2}}>{b.name}</div>
        <div style={{fontFamily: FONT_LATIN, fontWeight: 600, fontSize: 25, color: COLORS.goldDeep, marginTop: 4}}>{b.status}</div>
      </div>
    </div>
  );
};

const FlipArt: React.FC<{frame: number; flipAt: number}> = ({frame, flipAt}) => {
  const appear = pop(frame, 30, 14);
  const t = interpolate(frame, [flipAt, flipAt + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scaleX = Math.abs(Math.cos(t * Math.PI));
  const back = t >= 0.5;
  return (
    <ArtSvg>
      <rect x={-1200} y={920} width={3400} height={500} fill="#E8E1D2" />
      <g transform={`translate(640 470) scale(${appear})`} opacity={Math.min(1, appear)}>
        <g transform={`scale(${scaleX} 1)`}>
          {back ? (
            <g>
              <rect x={-300} y={-260} width={600} height={520} rx={34} fill={COLORS.white} stroke={COLORS.gold} strokeWidth={10} />
              <text textAnchor="middle" y={-150} fontFamily={FONT_LATIN} fontWeight={800} fontSize={28} letterSpacing={3} fill={COLORS.goldDeep}>
                THE GOAL
              </text>
              <text textAnchor="middle" y={-40} fontFamily={FONT_LATIN} fontWeight={800} fontSize={48} fill={COLORS.navy}>
                CRIRSCO-aligned
              </text>
              <text textAnchor="middle" y={14} fontFamily={FONT_LATIN} fontWeight={800} fontSize={48} fill={COLORS.navy}>
                reporting
              </text>
              <text textAnchor="middle" y={90} fontFamily={FONT_LATIN} fontWeight={700} fontSize={34} fill={COLORS.goldDeep}>
                JORC · NI 43-101
              </text>
              <text textAnchor="middle" y={170} fontFamily={FONT_LATIN} fontWeight={600} fontSize={28} fill={COLORS.inkSoft}>
                One language with the global market
              </text>
            </g>
          ) : (
            <g>
              <rect x={-300} y={-260} width={600} height={520} rx={34} fill="#E3E6EB" stroke={COLORS.grey} strokeWidth={6} />
              <text textAnchor="middle" y={-150} fontFamily={FONT_LATIN} fontWeight={800} fontSize={28} letterSpacing={3} fill={COLORS.grey}>
                TODAY
              </text>
              <text textAnchor="middle" y={-70} fontFamily={FONT_LATIN} fontWeight={800} fontSize={50} fill={COLORS.inkSoft}>
                Soviet reserve
              </text>
              <text textAnchor="middle" y={-12} fontFamily={FONT_LATIN} fontWeight={800} fontSize={50} fill={COLORS.inkSoft}>
                classification
              </text>
              {['A', 'B', 'C1', 'C2'].map((c, i) => (
                <g key={c} transform={`translate(${-195 + i * 130} 110)`}>
                  <rect x={-50} y={-44} width={100} height={88} rx={16} fill="#FFFFFF" />
                  <text textAnchor="middle" y={16} fontFamily={FONT_LATIN} fontWeight={800} fontSize={42} fill={COLORS.grey}>
                    {c}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </g>
      <Person {...GEOLOGIST} prop="clipboard" frame={frame} x={170} y={960} scale={0.98} seed={3} />
    </ArtSvg>
  );
};

export const Standards: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  return (
    <SceneShell background={<Backdrop kind="paper" />} duration={duration}>
      <Split
        textTop={140}
        text={
          <Stack gap={vertical ? 26 : 34}>
            <div>
              <FadeUp delay={4}>
                <Eyebrow>Standards</Eyebrow>
              </FadeUp>
              <FadeUp delay={10}>
                <Heading size={vertical ? 68 : 76} style={{marginTop: 14}}>
                  Reporting the world can trust
                </Heading>
              </FadeUp>
            </div>
            {BADGES.map((b) => (
              <BadgeRow key={b.acr} b={b} delay={cueFrame('standards', b.cue) + 10} vertical={vertical} />
            ))}
          </Stack>
        }
        art={<FlipArt frame={frame} flipAt={cueFrame('standards', 2) + 40} />}
      />
    </SceneShell>
  );
};
