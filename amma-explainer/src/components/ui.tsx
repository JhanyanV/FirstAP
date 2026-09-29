import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {pop, ramp} from '../anim';
import {COLORS, FONT_ARMENIAN, FONT_LATIN} from '../theme';

/** Slides children up and fades them in, starting at `delay` frames. */
export const FadeUp: React.FC<{delay?: number; distance?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay = 0,
  distance = 40,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 18);
  return (
    <div style={{opacity: Math.min(1, p * 1.2), transform: `translateY(${(1 - p) * distance}px)`, ...style}}>
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({
  children,
  color = COLORS.goldDeep,
  size = 26,
}) => (
  <div
    style={{
      fontFamily: FONT_LATIN,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: size * 0.16,
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

export const Heading: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
  children,
  color = COLORS.navy,
  size = 76,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_LATIN,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.08,
      color,
      letterSpacing: -0.5,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
  children,
  color = COLORS.inkSoft,
  size = 34,
  style,
}) => (
  <div style={{fontFamily: FONT_LATIN, fontWeight: 400, fontSize: size, lineHeight: 1.3, color, ...style}}>{children}</div>
);

export const Armenian: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number}> = ({
  children,
  size = 30,
  color = COLORS.white,
  weight = 400,
}) => (
  <div lang="hy" style={{fontFamily: FONT_ARMENIAN, fontWeight: weight, fontSize: size, color, lineHeight: 1.3}}>
    {children}
  </div>
);

/** Big number + label. The number can count up from 0 when `countTo` is set. */
export const StatTile: React.FC<{
  value?: string;
  countTo?: number;
  countFrom?: number;
  label: string;
  delay?: number;
  dark?: boolean;
  width?: number;
  valueSize?: number;
}> = ({value, countTo, countFrom = 0, label, delay = 0, dark = false, width = 300, valueSize = 84}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 16);
  const shown =
    countTo !== undefined ? Math.round(countFrom + (countTo - countFrom) * ramp(frame, delay, 40)).toString() : value;
  return (
    <div
      style={{
        width,
        padding: '22px 26px',
        borderRadius: 22,
        background: dark ? 'rgba(255,255,255,0.08)' : COLORS.white,
        boxShadow: dark ? 'none' : '0 10px 30px rgba(14,40,75,0.10)',
        border: dark ? `2px solid rgba(210,172,103,0.45)` : `2px solid rgba(14,40,75,0.06)`,
        opacity: Math.min(1, p * 1.3),
        transform: `scale(${0.85 + p * 0.15})`,
        transformOrigin: 'left center',
      }}
    >
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontWeight: 800,
          fontSize: valueSize,
          lineHeight: 1,
          color: dark ? COLORS.gold : COLORS.navy,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {shown}
      </div>
      <div
        style={{
          fontFamily: FONT_LATIN,
          fontWeight: 600,
          fontSize: 26,
          lineHeight: 1.25,
          marginTop: 10,
          color: dark ? 'rgba(255,255,255,0.85)' : COLORS.inkSoft,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Chip: React.FC<{children: React.ReactNode; delay?: number; dark?: boolean; size?: number}> = ({
  children,
  delay = 0,
  dark = false,
  size = 28,
}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 15);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        fontFamily: FONT_LATIN,
        fontWeight: 600,
        fontSize: size,
        color: dark ? COLORS.white : COLORS.navy,
        background: dark ? 'rgba(255,255,255,0.10)' : COLORS.white,
        border: dark ? '2px solid rgba(210,172,103,0.6)' : `2px solid ${COLORS.goldLight}`,
        boxShadow: dark ? 'none' : '0 6px 16px rgba(14,40,75,0.08)',
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - p) * 20}px) scale(${0.9 + p * 0.1})`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: size * 0.4, height: size * 0.4, borderRadius: 999, background: COLORS.gold, flexShrink: 0}} />
      {children}
    </div>
  );
};

/** The gold triangle AMMA logo, extracted from the brochure (public/amma-logo.png). */
export const Logo: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <Img src={staticFile('amma-logo.png')} style={{width: size, height: size * (417 / 467), ...style}} />
);

/** Layered flat mountains used as a backdrop in the landscape scenes. */
export const Mountains: React.FC<{width: number; height: number; tint?: 'day' | 'night'; drift?: number}> = ({
  width,
  height,
  tint = 'day',
  drift = 0,
}) => {
  const back = tint === 'day' ? COLORS.mist : COLORS.navyMid;
  const mid = tint === 'day' ? '#9FB4CE' : COLORS.navySoft;
  const front = tint === 'day' ? '#6F8BB0' : '#23477A';
  return (
    <svg width={width} height={height} viewBox="0 0 1920 600" preserveAspectRatio="none" style={{position: 'absolute', bottom: 0, left: 0}}>
      <path
        transform={`translate(${-drift * 0.3} 0)`}
        d="M -200 600 L -200 330 L 80 170 L 260 290 L 480 110 L 700 300 L 900 190 L 1120 330 L 1380 140 L 1600 290 L 1800 200 L 2200 330 L 2200 600 Z"
        fill={back}
      />
      <path
        transform={`translate(${-drift * 0.6} 0)`}
        d="M -200 600 L -200 420 L 160 260 L 380 380 L 640 240 L 900 400 L 1160 280 L 1420 420 L 1700 300 L 2200 440 L 2200 600 Z"
        fill={mid}
      />
      <path d="M 0 600 L 0 500 C 400 450 800 520 1200 480 C 1500 450 1750 500 1920 470 L 1920 600 Z" fill={front} />
    </svg>
  );
};

/** Soft full-frame background. */
export const Backdrop: React.FC<{kind: 'paper' | 'sky' | 'navy'}> = ({kind}) => {
  const bg =
    kind === 'navy'
      ? `radial-gradient(ellipse at 70% 30%, ${COLORS.navyMid} 0%, ${COLORS.navy} 55%, ${COLORS.navyDeep} 100%)`
      : kind === 'sky'
        ? `linear-gradient(180deg, ${COLORS.sky} 0%, #F8F5EE 100%)`
        : COLORS.paper;
  return <AbsoluteFill style={{background: bg}} />;
};

/** Thin gold progress bar along the bottom edge. */
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${progress * 100}%`, background: COLORS.gold}} />
);

/** Subtitle overlay for the social cut (burned-in captions). */
export const CaptionBox: React.FC<{text: string | null; bottom: number; fontSize: number; maxWidth: number}> = ({
  text,
  bottom,
  fontSize,
  maxWidth,
}) => {
  if (!text) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          maxWidth,
          padding: '14px 26px',
          borderRadius: 16,
          background: 'rgba(8,26,51,0.82)',
          color: COLORS.white,
          fontFamily: FONT_LATIN,
          fontWeight: 600,
          fontSize,
          lineHeight: 1.3,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const fadeOut = (frame: number, start: number, length = 12) =>
  interpolate(frame, [start, start + length], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
