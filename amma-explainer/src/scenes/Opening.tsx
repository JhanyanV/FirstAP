import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {SceneShell} from '../components/layout';
import {Armenian, Backdrop, FadeUp, Logo, Mountains} from '../components/ui';
import {useLayout} from '../layout';
import {COLORS, FONT_LATIN} from '../theme';

/** Soft gold glow and a slowly breathing outline triangle behind the logo. */
const Glow: React.FC<{frame: number; size: number}> = ({frame, size}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{position: 'absolute'}}>
    <defs>
      <radialGradient id="amma-glow">
        <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.28} />
        <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle r={100} fill="url(#amma-glow)" />
    <polygon
      points="0,-86 74,44 -74,44"
      fill="none"
      stroke={COLORS.gold}
      strokeWidth={0.6}
      opacity={0.35}
      transform={`translate(0 6) scale(${1 + Math.sin(frame * 0.05) * 0.03})`}
    />
  </svg>
);

export const Opening: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical, width} = useLayout();
  // The logo is on screen from the very first frame and settles in.
  const logoP = pop(frame, 0, 12);
  const logoScale = 0.9 + logoP * 0.1;
  const shine = interpolate(frame, [18, 48], [-120, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const logoSize = vertical ? 420 : 330;

  return (
    <SceneShell background={<Backdrop kind="navy" />} duration={duration} fadeIn={false}>
      <div style={{opacity: 0.35}}>
        <Mountains width={width} height={vertical ? 520 : 360} tint="night" drift={frame} />
      </div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: vertical ? 40 : 28,
            marginTop: vertical ? -120 : -40,
          }}
        >
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Glow frame={frame} size={logoSize * 1.7} />
            <div style={{position: 'relative', overflow: 'hidden', transform: `scale(${logoScale})`}}>
              <Logo size={logoSize} />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${shine}%`,
                  width: '30%',
                  background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>
          </div>
          <FadeUp delay={22}>
            <div
              style={{
                fontFamily: FONT_LATIN,
                fontWeight: 800,
                fontSize: vertical ? 62 : 64,
                color: COLORS.white,
                textAlign: 'center',
                lineHeight: 1.12,
                maxWidth: vertical ? 900 : 1500,
              }}
            >
              {vertical ? (
                <>
                  Armenian Mining
                  <br />
                  and Metallurgy Association
                </>
              ) : (
                'Armenian Mining and Metallurgy Association'
              )}
            </div>
          </FadeUp>
          <FadeUp delay={36}>
            <div style={{textAlign: 'center', maxWidth: vertical ? 860 : 1400}}>
              <Armenian size={vertical ? 34 : 34} color={COLORS.goldLight}>
                Հայաստանի հանքարդյունաբերության և մետալուրգիայի ասոցիացիա
              </Armenian>
            </div>
          </FadeUp>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
