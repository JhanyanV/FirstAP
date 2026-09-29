import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {pop} from '../anim';
import {ENGINEER, GEOLOGIST, STUDENT} from '../characters/cast';
import {Person} from '../characters/Person';
import {SceneShell} from '../components/layout';
import {Armenian, Backdrop, FadeUp, Logo} from '../components/ui';
import {useLayout} from '../layout';
import {COLORS, FONT_LATIN} from '../theme';

export const Closing: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical, width, height} = useLayout();
  const logoP = pop(frame, 0, 12);
  const people = pop(frame, 20, 14);

  return (
    <SceneShell background={<Backdrop kind="navy" />} duration={duration} fadeOut={false}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: vertical ? 'flex-start' : 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: vertical ? 34 : 26,
            marginTop: vertical ? 230 : -120,
            textAlign: 'center',
          }}
        >
          <div style={{transform: `scale(${0.85 + logoP * 0.15})`, opacity: Math.min(1, logoP * 1.4)}}>
            <Logo size={vertical ? 360 : 250} />
          </div>
          <FadeUp delay={10}>
            <div style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: vertical ? 50 : 48, color: COLORS.white, lineHeight: 1.25}}>
              A stronger, more competitive,
              <br />
              responsible and internationally
              <br />
              integrated mining industry
            </div>
          </FadeUp>
          <FadeUp delay={24}>
            <div style={{fontFamily: FONT_LATIN, fontWeight: 800, fontSize: vertical ? 64 : 58, color: COLORS.gold, letterSpacing: 1}}>
              armmining.am
            </div>
          </FadeUp>
          <FadeUp delay={32}>
            <Armenian size={vertical ? 28 : 26} color="rgba(255,255,255,0.75)">
              Հայաստանի հանքարդյունաբերության և մետալուրգիայի ասոցիացիա
            </Armenian>
          </FadeUp>
        </div>
      </AbsoluteFill>
      <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(1, people * 1.3)}}>
        {vertical ? (
          <>
            <Person {...GEOLOGIST} frame={frame} x={230} y={1640 + (1 - people) * 60} scale={0.8} waving seed={1} />
            <Person {...ENGINEER} frame={frame} x={540} y={1640 + (1 - people) * 60} scale={0.8} waving seed={2} />
            <Person {...STUDENT} frame={frame} x={850} y={1640 + (1 - people) * 60} scale={0.8} waving seed={3} />
          </>
        ) : (
          <>
            <Person {...GEOLOGIST} frame={frame} x={190} y={1040 + (1 - people) * 60} scale={0.56} waving seed={1} />
            <Person {...ENGINEER} frame={frame} x={380} y={1040 + (1 - people) * 60} scale={0.56} waving seed={2} />
            <Person {...STUDENT} frame={frame} x={1720} y={1040 + (1 - people) * 60} scale={0.56} waving flip seed={3} />
          </>
        )}
      </svg>
    </SceneShell>
  );
};
