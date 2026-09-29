import React from 'react';

// A flat, front-facing cartoon figure drawn in SVG. All characters in the
// video are invented and built from this one rig; none depict real people.
//
// Local coordinates: origin at the feet (centre), negative y is up, the figure
// is about 400 units tall. Render it inside an <svg> and position it with
// the `x`, `y` and `scale` props.

export type PersonStyle = {
  skin: string;
  hair: string;
  hairStyle: 'short' | 'ponytail' | 'curly';
  shirt: string;
  pants: string;
  shoes: string;
  vest?: {color: string; kind: 'hivis' | 'field'};
  hat?: {kind: 'hardhat' | 'fieldhat'; color: string};
  glasses?: boolean;
  backpack?: string;
  prop?: 'hammer' | 'tablet' | 'books' | 'clipboard';
};

type Props = PersonStyle & {
  frame: number;
  x: number;
  y: number;
  scale?: number;
  walking?: boolean;
  waving?: boolean;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Offsets idle animations so several characters don't move in lockstep. */
  seed?: number;
};

const OUTLINE = '#0E284B';

const Prop: React.FC<{kind: PersonStyle['prop']}> = ({kind}) => {
  switch (kind) {
    case 'hammer':
      return (
        <g>
          <rect x={-4} y={-66} width={8} height={78} rx={3} fill="#8A5A36" />
          <path d="M -26 -78 L 20 -78 L 30 -70 L 20 -62 L -26 -62 Z" fill="#8C99A8" />
          <rect x={-26} y={-78} width={10} height={16} fill="#6F7C8A" />
        </g>
      );
    case 'tablet':
      return (
        <g transform="rotate(-12)">
          <rect x={-34} y={-58} width={68} height={52} rx={6} fill={OUTLINE} />
          <rect x={-28} y={-52} width={56} height={40} rx={3} fill="#9CC3E6" />
          <rect x={-22} y={-44} width={20} height={4} rx={2} fill="#FFFFFF" />
          <rect x={-22} y={-36} width={32} height={4} rx={2} fill="#FFFFFF" opacity={0.7} />
          <path d="M -22 -18 L -12 -26 L -2 -22 L 10 -32 L 20 -28" stroke="#D2AC67" strokeWidth={3} fill="none" />
        </g>
      );
    case 'books':
      return (
        <g transform="rotate(-6)">
          <rect x={-36} y={-34} width={72} height={16} rx={3} fill="#C8553D" />
          <rect x={-32} y={-50} width={64} height={16} rx={3} fill="#2E5286" />
          <rect x={-34} y={-18} width={68} height={14} rx={3} fill="#D2AC67" />
          <rect x={-28} y={-46} width={50} height={3} fill="#FFFFFF" opacity={0.6} />
        </g>
      );
    case 'clipboard':
      return (
        <g transform="rotate(-10)">
          <rect x={-30} y={-78} width={60} height={80} rx={5} fill="#9A6B42" />
          <rect x={-24} y={-70} width={48} height={66} rx={2} fill="#FFFFFF" />
          <rect x={-12} y={-84} width={24} height={12} rx={3} fill="#8C99A8" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path
                d={`M -18 ${-58 + i * 14} l 4 4 l 7 -8`}
                stroke="#2E9E6A"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
              <rect x={-2} y={-58 + i * 14} width={20} height={3} rx={1.5} fill="#8A96A8" />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
};

export const Person: React.FC<Props> = (p) => {
  const t = p.frame + (p.seed ?? 0) * 37;
  const walk = p.walking ? t * 0.32 : 0;
  const bob = p.walking ? -Math.abs(Math.sin(walk)) * 9 : Math.sin(t * 0.07) * 2.2;
  const leftLift = p.walking ? Math.max(0, Math.sin(walk)) * 16 : 0;
  const rightLift = p.walking ? Math.max(0, -Math.sin(walk)) * 16 : 0;
  const blink = t % 110 < 4;
  const headTilt = Math.sin(t * 0.045) * 2.5;

  // Arm angles in degrees; 0 = hanging straight down.
  const swing = p.walking ? Math.sin(walk) * 14 : Math.sin(t * 0.06) * 3;
  const leftArm = p.waving ? 145 + Math.sin(t * 0.38) * 18 : 8 + swing;
  const rightArm = p.prop ? -28 : -8 - swing;

  const sL = {x: -52, y: -262};
  const sR = {x: 52, y: -262};

  const arm = (angle: number, s: {x: number; y: number}, withProp: boolean) => (
    <g transform={`rotate(${angle} ${s.x} ${s.y})`}>
      <rect x={s.x - 13} y={s.y - 8} width={26} height={112} rx={13} fill={p.shirt} />
      <circle cx={s.x} cy={s.y + 106} r={15} fill={p.skin} />
      {withProp && p.prop ? (
        <g transform={`translate(${s.x} ${s.y + 106}) rotate(${-angle})`}>
          <Prop kind={p.prop} />
        </g>
      ) : null}
    </g>
  );

  const hatKind = p.hat?.kind;

  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * (p.scale ?? 1)} ${p.scale ?? 1})`}>
      {/* ground shadow */}
      <ellipse cx={0} cy={2} rx={64} ry={10} fill="#000000" opacity={0.12} />

      {/* legs */}
      <g transform={`translate(0 ${-leftLift})`}>
        <rect x={-42} y={-136} width={34} height={124} rx={12} fill={p.pants} />
        <rect x={-50} y={-22} width={48} height={22} rx={10} fill={p.shoes} />
      </g>
      <g transform={`translate(0 ${-rightLift})`}>
        <rect x={8} y={-136} width={34} height={124} rx={12} fill={p.pants} />
        <rect x={2} y={-22} width={48} height={22} rx={10} fill={p.shoes} />
      </g>

      <g transform={`translate(0 ${bob})`}>
        {/* backpack behind the torso */}
        {p.backpack ? <rect x={-70} y={-266} width={140} height={110} rx={24} fill={p.backpack} /> : null}

        {/* hips */}
        <rect x={-50} y={-160} width={100} height={36} rx={14} fill={p.pants} />

        {/* torso */}
        <path d="M -56 -150 L -56 -244 Q -56 -278 -22 -278 L 22 -278 Q 56 -278 56 -244 L 56 -150 Z" fill={p.shirt} />

        {p.vest?.kind === 'hivis' ? (
          <g>
            <path d="M -56 -150 L -56 -244 Q -56 -276 -26 -277 L -12 -190 L -12 -150 Z" fill={p.vest.color} />
            <path d="M 56 -150 L 56 -244 Q 56 -276 26 -277 L 12 -190 L 12 -150 Z" fill={p.vest.color} />
            <rect x={-56} y={-196} width={44} height={9} fill="#FFFFFF" opacity={0.9} />
            <rect x={12} y={-196} width={44} height={9} fill="#FFFFFF" opacity={0.9} />
          </g>
        ) : null}
        {p.vest?.kind === 'field' ? (
          <g>
            <path d="M -56 -150 L -56 -244 Q -56 -276 -26 -277 L -14 -200 L -14 -150 Z" fill={p.vest.color} />
            <path d="M 56 -150 L 56 -244 Q 56 -276 26 -277 L 14 -200 L 14 -150 Z" fill={p.vest.color} />
            <rect x={-48} y={-212} width={26} height={24} rx={4} fill="#000000" opacity={0.12} />
            <rect x={22} y={-212} width={26} height={24} rx={4} fill="#000000" opacity={0.12} />
            <rect x={-48} y={-180} width={26} height={22} rx={4} fill="#000000" opacity={0.12} />
            <rect x={22} y={-180} width={26} height={22} rx={4} fill="#000000" opacity={0.12} />
          </g>
        ) : null}
        {p.backpack ? (
          <g stroke={p.backpack} strokeWidth={10} strokeLinecap="round">
            <line x1={-30} y1={-276} x2={-34} y2={-200} />
            <line x1={30} y1={-276} x2={34} y2={-200} />
          </g>
        ) : null}

        {/* arms */}
        {arm(leftArm, sL, false)}
        {arm(rightArm, sR, true)}

        {/* neck + head */}
        <rect x={-13} y={-296} width={26} height={24} fill={p.skin} />
        <g transform={`rotate(${headTilt} 0 -300)`}>
          {p.hairStyle === 'ponytail' ? <ellipse cx={46} cy={-306} rx={15} ry={30} fill={p.hair} /> : null}
          <circle cx={-46} cy={-328} r={10} fill={p.skin} />
          <circle cx={46} cy={-328} r={10} fill={p.skin} />
          <circle cx={0} cy={-332} r={47} fill={p.skin} />

          {/* hair */}
          {p.hairStyle === 'short' && hatKind !== 'hardhat' ? (
            <path d="M -48 -326 C -52 -392 52 -392 48 -326 C 36 -352 -12 -358 -48 -326 Z" fill={p.hair} />
          ) : null}
          {p.hairStyle === 'short' && hatKind === 'hardhat' ? (
            <g fill={p.hair}>
              <rect x={-48} y={-350} width={12} height={26} rx={5} />
              <rect x={36} y={-350} width={12} height={26} rx={5} />
            </g>
          ) : null}
          {p.hairStyle === 'ponytail' ? (
            <path d="M -49 -318 C -56 -396 56 -396 49 -318 C 40 -350 0 -366 -49 -318 Z" fill={p.hair} />
          ) : null}
          {p.hairStyle === 'curly' ? (
            <g fill={p.hair}>
              {[
                [-40, -350, 16],
                [-24, -372, 18],
                [0, -380, 19],
                [24, -372, 18],
                [40, -350, 16],
                [-46, -330, 11],
                [46, -330, 11],
              ].map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} />
              ))}
            </g>
          ) : null}

          {/* face */}
          <ellipse cx={-16} cy={-330} rx={5.5} ry={blink ? 1 : 6.5} fill={OUTLINE} />
          <ellipse cx={16} cy={-330} rx={5.5} ry={blink ? 1 : 6.5} fill={OUTLINE} />
          <path d="M -24 -346 q 8 -5 15 0" stroke={OUTLINE} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 9 -346 q 8 -5 15 0" stroke={OUTLINE} strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={-28} cy={-314} r={7} fill="#E0736A" opacity={0.3} />
          <circle cx={28} cy={-314} r={7} fill="#E0736A" opacity={0.3} />
          <path d="M -14 -310 Q 0 -298 14 -310" stroke={OUTLINE} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          {p.glasses ? (
            <g stroke={OUTLINE} strokeWidth={3} fill="none">
              <circle cx={-16} cy={-330} r={13} />
              <circle cx={16} cy={-330} r={13} />
              <line x1={-3} y1={-331} x2={3} y2={-331} />
            </g>
          ) : null}

          {/* hats */}
          {hatKind === 'hardhat' ? (
            <g>
              <path d="M -52 -350 C -52 -412 52 -412 52 -350 Z" fill={p.hat!.color} />
              <rect x={-64} y={-356} width={128} height={12} rx={6} fill={p.hat!.color} />
              <rect x={-6} y={-404} width={12} height={50} rx={5} fill="#000000" opacity={0.08} />
            </g>
          ) : null}
          {hatKind === 'fieldhat' ? (
            <g>
              <ellipse cx={0} cy={-360} rx={76} ry={13} fill={p.hat!.color} />
              <path d="M -38 -360 L -34 -398 Q 0 -410 34 -398 L 38 -360 Z" fill={p.hat!.color} />
              <rect x={-37} y={-372} width={74} height={9} fill="#000000" opacity={0.18} />
            </g>
          ) : null}
        </g>
      </g>
    </g>
  );
};
