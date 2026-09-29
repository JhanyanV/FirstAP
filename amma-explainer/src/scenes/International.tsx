import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop, ramp} from '../anim';
import {SceneShell, Stack} from '../components/layout';
import {Backdrop, Chip, Eyebrow, FadeUp, Heading} from '../components/ui';
import {useLayout} from '../layout';
import {cueFrame} from '../script';
import {COLORS, FONT_LATIN} from '../theme';

// Cities where AMMA represented Armenia's sector over the past year (brochure p. 31).
// Plotted on a simple longitude/latitude grid; no country borders are drawn.
const CITIES = [
  {name: 'London', lon: -0.1, lat: 51.5, anchor: 'end' as const, dx: -16, dy: 40},
  {name: 'Brussels', lon: 4.35, lat: 50.85, anchor: 'start' as const, dx: 10, dy: 42},
  {name: 'Toronto', lon: -79.4, lat: 43.7, anchor: 'middle' as const, dx: 0, dy: 46},
  {name: 'Riyadh', lon: 46.7, lat: 24.7, anchor: 'middle' as const, dx: 0, dy: 46},
  {name: 'Lima', lon: -77.0, lat: -12.0, anchor: 'middle' as const, dx: 0, dy: 46},
];
const YEREVAN = {lon: 44.5, lat: 40.2};
const LON: [number, number] = [-95, 80];
const LAT: [number, number] = [62, -22];

const MapArt: React.FC<{frame: number; w: number; h: number; arcsFrom: number}> = ({frame, w, h, arcsFrom}) => {
  const px = (lon: number) => ((lon - LON[0]) / (LON[1] - LON[0])) * w;
  const py = (lat: number) => ((lat - LAT[0]) / (LAT[1] - LAT[0])) * h;
  const hx = px(YEREVAN.lon);
  const hy = py(YEREVAN.lat);
  const pulse = (frame % 50) / 50;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      {/* graticule */}
      {Array.from({length: 11}, (_, i) => LON[0] + i * 15).map((lon) => (
        <line key={`lo${lon}`} x1={px(lon)} y1={0} x2={px(lon)} y2={h} stroke="#FFFFFF" strokeOpacity={0.07} strokeWidth={2} />
      ))}
      {Array.from({length: 6}, (_, i) => -15 + i * 15).map((lat) => (
        <line key={`la${lat}`} x1={0} y1={py(lat)} x2={w} y2={py(lat)} stroke="#FFFFFF" strokeOpacity={0.07} strokeWidth={2} />
      ))}
      {CITIES.map((c, i) => {
        const cx = px(c.lon);
        const cy = py(c.lat);
        const d = Math.hypot(cx - hx, cy - hy);
        const mx = (cx + hx) / 2;
        const my = (cy + hy) / 2 - d * 0.28;
        const start = arcsFrom + i * 9;
        const p = ramp(frame, start, 26);
        const dot = pop(frame, start + 20, 10);
        return (
          <g key={c.name}>
            <path
              d={`M ${hx} ${hy} Q ${mx} ${my} ${cx} ${cy}`}
              stroke={COLORS.gold}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={p > 0 ? 0.9 : 0}
            />
            <g transform={`translate(${cx} ${cy}) scale(${dot})`}>
              <circle r={11} fill={COLORS.white} />
              <circle r={5} fill={COLORS.gold} />
            </g>
            <text
              x={cx + c.dx}
              y={cy + c.dy}
              textAnchor={c.anchor}
              fontFamily={FONT_LATIN}
              fontWeight={700}
              fontSize={28}
              fill={COLORS.white}
              opacity={Math.min(1, dot)}
            >
              {c.name}
            </text>
          </g>
        );
      })}
      {/* Yerevan hub */}
      <circle cx={hx} cy={hy} r={16 + pulse * 40} fill="none" stroke={COLORS.gold} strokeWidth={3} opacity={1 - pulse} />
      <circle cx={hx} cy={hy} r={16} fill={COLORS.gold} />
      <circle cx={hx} cy={hy} r={6} fill={COLORS.navy} />
      <text x={hx + 30} y={hy - 26} textAnchor="start" fontFamily={FONT_LATIN} fontWeight={800} fontSize={30} fill={COLORS.gold}>
        Yerevan · AMMA
      </text>
    </svg>
  );
};

const IcmmBadge: React.FC<{delay: number; vertical: boolean}> = ({delay, vertical}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 12);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '22px 30px',
        borderRadius: 24,
        border: `3px solid ${COLORS.gold}`,
        background: 'rgba(210,172,103,0.10)',
        opacity: Math.min(1, p * 1.3),
        transform: `scale(${0.8 + p * 0.2})`,
        transformOrigin: 'left center',
      }}
    >
      <div style={{fontFamily: FONT_LATIN, fontWeight: 800, fontSize: vertical ? 72 : 76, color: COLORS.gold, lineHeight: 1}}>ICMM</div>
      <div style={{fontFamily: FONT_LATIN, fontWeight: 600, fontSize: 28, color: COLORS.white, lineHeight: 1.3}}>
        Association member
        <br />
        <span style={{color: COLORS.goldLight}}>since May 2026</span>
      </div>
    </div>
  );
};

export const International: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {vertical} = useLayout();
  const c1 = cueFrame('international', 1);
  const c2 = cueFrame('international', 2);

  const partners = (
    <Stack gap={16}>
      <Chip dark delay={c1}>Eurometaux · memorandum, 2026</Chip>
      <Chip dark delay={c1 + 18}>Mining Association of Canada</Chip>
      <Chip dark delay={c1 + 36}>Critical Minerals Association (USA)</Chip>
      <FadeUp delay={c1 + 60}>
        <div style={{fontFamily: FONT_LATIN, fontWeight: 600, fontSize: 28, color: COLORS.goldLight, marginTop: 6}}>
          <span style={{fontWeight: 800, color: COLORS.gold, fontSize: 36}}>&gt;10</span> MoUs and international memberships
        </div>
      </FadeUp>
    </Stack>
  );

  const header = (
    <>
      <FadeUp delay={4}>
        <Eyebrow color={COLORS.gold}>International integration</Eyebrow>
      </FadeUp>
      <FadeUp delay={10}>
        <Heading color={COLORS.white} size={vertical ? 68 : 72} style={{marginTop: 14, marginBottom: 30}}>
          Armenia on the international industry map
        </Heading>
      </FadeUp>
      <IcmmBadge delay={18} vertical={vertical} />
    </>
  );

  return (
    <SceneShell background={<Backdrop kind="navy" />} duration={duration}>
      {vertical ? (
        <>
          <div style={{position: 'absolute', left: 80, right: 80, top: 130}}>{header}</div>
          <div style={{position: 'absolute', left: 70, top: 600}}>
            <MapArt frame={frame} w={900} h={560} arcsFrom={c2} />
          </div>
          <div style={{position: 'absolute', left: 80, top: 1250}}>{partners}</div>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div>{header}</div>
            <div style={{marginTop: 34}}>{partners}</div>
          </div>
          <div style={{position: 'absolute', left: 900, top: 190}}>
            <MapArt frame={frame} w={920} h={640} arcsFrom={c2} />
          </div>
        </>
      )}
    </SceneShell>
  );
};
