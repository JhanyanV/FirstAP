import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {GEOLOGIST} from '../characters/cast';
import {Person} from '../characters/Person';
import {SceneShell} from '../components/layout';
import {Backdrop, Eyebrow, FadeUp, Heading, Mountains} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

// Brochure p. 9, "A centuries-old tradition".
const MARKERS = [
  {date: '13th c.', name: 'Akhtala', note: 'First written record', cue: 1},
  {date: '1770s', name: 'Alaverdi', cue: 2},
  {date: '1840s', name: 'Kapan', cue: 3},
  {date: '1950s', name: 'Kajaran', cue: 4},
  {date: '1963', name: 'Agarak', cue: 5},
];

export const History: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical, width, height} = useLayout();
  const appear = MARKERS.map((m) => cueFrame('history', m.cue));

  // Marker positions along the timeline.
  const lineY = 690;
  const xs = [260, 610, 960, 1310, 1660];
  const vx = 170;
  const ys = [540, 720, 900, 1080, 1260];

  const keyFrames = [0, ...appear, appear[4] + 40];
  const progressH = (f: number) =>
    interpolate(f, keyFrames, [140, ...xs, 1800], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const progressV = (f: number) =>
    interpolate(f, keyFrames, [470, ...ys, 1340], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const lineEnd = vertical ? progressV(frame) : progressH(frame);
  const speed = vertical ? 0 : progressH(frame) - progressH(frame - 1);

  return (
    <SceneShell background={<Backdrop kind="sky" />} duration={duration}>
      <Mountains width={width} height={vertical ? 520 : 480} tint="day" drift={frame * 0.6} />

      <div style={{position: 'absolute', left: vertical ? 80 : 120, top: vertical ? 150 : 90}}>
        <FadeUp delay={4}>
          <Eyebrow>Armenia · mining heritage</Eyebrow>
        </FadeUp>
        <FadeUp delay={10}>
          <Heading size={vertical ? 70 : 76} style={{marginTop: 14}}>
            A centuries-old tradition
          </Heading>
        </FadeUp>
      </div>

      {/* timeline line */}
      <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0}}>
        {vertical ? (
          <>
            <line x1={vx} y1={470} x2={vx} y2={1340} stroke={COLORS.mist} strokeWidth={8} strokeLinecap="round" />
            <line x1={vx} y1={470} x2={vx} y2={lineEnd} stroke={COLORS.gold} strokeWidth={8} strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1={140} y1={lineY} x2={1800} y2={lineY} stroke={COLORS.mist} strokeWidth={8} strokeLinecap="round" />
            <line x1={140} y1={lineY} x2={lineEnd} y2={lineY} stroke={COLORS.gold} strokeWidth={8} strokeLinecap="round" />
          </>
        )}
        {MARKERS.map((m, i) => {
          const p = pop(frame, appear[i], 10);
          const cx = vertical ? vx : xs[i];
          const cy = vertical ? ys[i] : lineY;
          return (
            <g key={m.name} transform={`translate(${cx} ${cy}) scale(${p})`}>
              <circle r={26} fill={COLORS.navy} />
              <circle r={26} fill="none" stroke={COLORS.gold} strokeWidth={6} />
              <circle r={9} fill={COLORS.gold} />
            </g>
          );
        })}
      </svg>

      {/* marker cards */}
      {MARKERS.map((m, i) => {
        const p = pop(frame, appear[i] + 2, 13);
        const style: React.CSSProperties = vertical
          ? {left: vx + 60, top: ys[i] - 70, width: 760, height: 140, justifyContent: 'center'}
          : {left: xs[i] - 150, top: lineY - 250, width: 300, height: 200, justifyContent: 'flex-end', alignItems: 'center'};
        return (
          <div
            key={m.name}
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              opacity: Math.min(1, p * 1.4),
              transform: `translateY(${(1 - p) * 30}px)`,
              ...style,
            }}
          >
            <div
              style={{
                background: COLORS.white,
                borderRadius: 20,
                padding: vertical ? '16px 28px' : '18px 22px',
                boxShadow: '0 10px 26px rgba(14,40,75,0.12)',
                textAlign: vertical ? 'left' : 'center',
                display: 'flex',
                flexDirection: vertical ? 'row' : 'column',
                alignItems: vertical ? 'baseline' : 'center',
                gap: vertical ? 24 : 2,
              }}
            >
              <div style={{fontFamily: FONT_LATIN, fontWeight: 800, fontSize: vertical ? 56 : 52, color: COLORS.goldDeep, lineHeight: 1.05}}>
                {m.date}
              </div>
              <div>
                <div style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: vertical ? 40 : 34, color: COLORS.navy}}>{m.name}</div>
                {m.note ? (
                  <div style={{fontFamily: FONT_LATIN, fontWeight: 600, fontSize: 22, color: COLORS.inkSoft}}>{m.note}</div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {/* the geologist walks the timeline */}
      <AbsoluteFill>
        <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0}}>
          {vertical ? (
            <Person {...GEOLOGIST} frame={frame} x={860} y={1640} scale={0.72} />
          ) : (
            <Person {...GEOLOGIST} frame={frame} x={Math.max(170, lineEnd - 70)} y={1000} scale={0.56} walking={speed > 0.4} />
          )}
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
};
