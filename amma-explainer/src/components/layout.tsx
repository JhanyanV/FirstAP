import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useLayout} from '../layout';

/**
 * Draws a scene's background at full opacity and fades only the content in and
 * out, so cuts between scenes never flash through black.
 */
export const SceneShell: React.FC<{
  background: React.ReactNode;
  duration: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: React.ReactNode;
}> = ({background, duration, fadeIn = true, fadeOut = true, children}) => {
  const frame = useCurrentFrame();
  const edge = 10;
  const opacity = interpolate(frame, [0, edge, duration - edge, duration], [fadeIn ? 0 : 1, 1, 1, fadeOut ? 0 : 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      {background}
      <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Text on one side, illustration on the other (16:9), or text on top and
 * illustration below (9:16). The `art` node should be an SVG with a
 * 1000×1000 viewBox; it is scaled to fit its box.
 */
export const Split: React.FC<{text: React.ReactNode; art: React.ReactNode; textTop?: number}> = ({text, art, textTop}) => {
  const {vertical} = useLayout();
  if (vertical) {
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 80, right: 80, top: textTop ?? 150}}>{text}</div>
        <div style={{position: 'absolute', left: 40, top: 860, width: 1000, height: 800}}>{art}</div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 0,
          bottom: 0,
          width: 780,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {text}
      </div>
      <div style={{position: 'absolute', left: 940, top: 90, width: 900, height: 900}}>{art}</div>
    </AbsoluteFill>
  );
};

/** 1000×1000 illustration canvas. With `panel`, content is clipped to a rounded card of that colour. */
export const ArtSvg: React.FC<{children: React.ReactNode; panel?: string}> = ({children, panel}) => (
  <svg viewBox="0 0 1000 1000" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{overflow: 'visible'}}>
    {panel ? (
      <>
        <defs>
          <clipPath id="art-panel">
            <rect x={0} y={0} width={1000} height={1000} rx={56} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={1000} height={1000} rx={56} fill={panel} />
        <g clipPath="url(#art-panel)">{children}</g>
      </>
    ) : (
      children
    )}
  </svg>
);

/** Vertical stack with a fixed gap. */
export const Stack: React.FC<{gap: number; children: React.ReactNode; style?: React.CSSProperties}> = ({gap, children, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap, alignItems: 'flex-start', ...style}}>{children}</div>
);

export const Row: React.FC<{gap: number; children: React.ReactNode; wrap?: boolean}> = ({gap, children, wrap}) => (
  <div style={{display: 'flex', flexDirection: 'row', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'stretch'}}>
    {children}
  </div>
);
