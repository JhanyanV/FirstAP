import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {ENGINEER} from '../characters/cast';
import {Person} from '../characters/Person';
import {ArtSvg, SceneShell, Split, Stack} from '../components/layout';
import {Backdrop, Eyebrow, FadeUp, Heading} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

// Neutral document icon: the brochure records these as proposals made, not as adopted outcomes.
const PolicyItem: React.FC<{label: string; delay: number; size: number}> = ({label, delay, size}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 15);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '14px 24px 14px 16px',
        background: COLORS.white,
        borderRadius: 18,
        boxShadow: '0 8px 22px rgba(14,40,75,0.09)',
        opacity: Math.min(1, p * 1.3),
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <svg width={size * 1.5} height={size * 1.5} viewBox="0 0 48 48">
        <circle cx={24} cy={24} r={22} fill={COLORS.gold} />
        <path d="M 16 11 L 28 11 L 34 17 L 34 37 L 16 37 Z" fill="#FFFFFF" />
        <path d="M 28 11 L 28 17 L 34 17" fill={COLORS.goldLight} />
        <rect x={20} y={22} width={10} height={2.6} rx={1.3} fill={COLORS.gold} />
        <rect x={20} y={28} width={10} height={2.6} rx={1.3} fill={COLORS.gold} />
      </svg>
      <div style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: size, color: COLORS.navy}}>{label}</div>
    </div>
  );
};

const Doc: React.FC<{t: number}> = ({t}) => {
  // Paper flies from the engineer's tablet into the building's door.
  const x = interpolate(t, [0, 1], [250, 600]);
  const y = 700 - Math.sin(t * Math.PI) * 330 + t * 60;
  const o = interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
  const s = interpolate(t, [0, 1], [1, 0.6]);
  return (
    <g transform={`translate(${x} ${y}) rotate(${t * 40 - 20}) scale(${s})`} opacity={o}>
      <rect x={-30} y={-38} width={60} height={76} rx={6} fill="#FFFFFF" stroke={COLORS.mist} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-18} y={-24 + i * 14} width={i === 3 ? 22 : 36} height={5} rx={2.5} fill={COLORS.mist} />
      ))}
    </g>
  );
};

const GovArt: React.FC<{frame: number; stampAt: number; docsFrom: number}> = ({frame, stampAt, docsFrom}) => {
  const stamp = pop(frame, stampAt, 10);
  const period = 42;
  return (
    <ArtSvg>
      <rect x={-1200} y={900} width={3400} height={500} fill="#D5DFEB" />
      {/* building */}
      <rect x={330} y={860} width={540} height={40} fill={COLORS.mist} />
      <rect x={350} y={830} width={500} height={30} fill="#DCE5EF" />
      <rect x={370} y={540} width={460} height={290} fill={COLORS.mist} />
      <rect x={560} y={680} width={80} height={150} rx={6} fill={COLORS.navyMid} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={i < 3 ? 392 + i * 60 : 652 + (i - 3) * 60} y={560} width={36} height={270} fill="#FFFFFF" />
      ))}
      <rect x={340} y={500} width={520} height={44} fill={COLORS.navy} />
      <polygon points="330,500 600,380 870,500" fill={COLORS.navy} />
      <circle cx={600} cy={458} r={22} fill={COLORS.gold} />

      {/* documents travelling to the building */}
      {frame >= docsFrom
        ? [0, 1, 2].map((k) => {
            const local = frame - docsFrom - k * (period / 3);
            if (local < 0) return null;
            return <Doc key={k} t={(local % period) / period} />;
          })
        : null}

      <Person {...ENGINEER} frame={frame} x={150} y={960} scale={0.95} seed={1} />

      {/* memorandum stamp */}
      {frame >= stampAt ? (
        <g transform={`translate(790 250) rotate(-8) scale(${2 - stamp})`} opacity={Math.min(1, stamp * 1.2)}>
          <rect x={-190} y={-86} width={380} height={172} rx={22} fill="#FFFFFF" stroke={COLORS.gold} strokeWidth={8} />
          <text textAnchor="middle" y={-30} fontFamily={FONT_LATIN} fontWeight={800} fontSize={30} letterSpacing={4} fill={COLORS.goldDeep}>
            MEMORANDUM
          </text>
          <text textAnchor="middle" y={22} fontFamily={FONT_LATIN} fontWeight={800} fontSize={44} fill={COLORS.navy}>
            2 July 2026
          </text>
          <text textAnchor="middle" y={62} fontFamily={FONT_LATIN} fontWeight={600} fontSize={26} fill={COLORS.inkSoft}>
            Ministry (MTAI) and AMMA
          </text>
        </g>
      ) : null}
    </ArtSvg>
  );
};

export const Advocacy: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const c1 = cueFrame('advocacy', 1);
  const c2 = cueFrame('advocacy', 2);
  const c3 = cueFrame('advocacy', 3);
  const size = vertical ? 30 : 32;
  return (
    <SceneShell background={<Backdrop kind="sky" />} duration={duration}>
      <Split
        textTop={130}
        text={
          <Stack gap={vertical ? 16 : 22}>
            <FadeUp delay={4}>
              <Eyebrow>Policy · 2024–2026</Eyebrow>
            </FadeUp>
            <FadeUp delay={10}>
              <Heading size={vertical ? 68 : 76} style={{marginBottom: 10}}>
                Legislative advocacy
              </Heading>
            </FadeUp>
            <PolicyItem size={size} delay={c1} label="Prime Minister's workshops · 2025" />
            <PolicyItem size={size} delay={c2} label="Standing working group with the ministry" />
            <PolicyItem size={size} delay={c3} label="Subsoil and land rights" />
            <PolicyItem size={size} delay={c3 + 30} label="Law “On Waste”" />
            <PolicyItem size={size} delay={c3 + 60} label="Environmental impact assessment reform" />
          </Stack>
        }
        art={<GovArt frame={frame} docsFrom={20} stampAt={c2 + 40} />}
      />
    </SceneShell>
  );
};
