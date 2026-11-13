import type { ReactNode } from 'react';

/**
 * Langage graphique commun à toutes les illustrations du jeu :
 * un aplat de couleur décalé de quelques pixels sous un trait d'encre marine,
 * comme une impression risographique. Une seule fonction, donc un seul style.
 */
export const INK = '#1f2a44';

export const PAL = {
  tomato: '#dc5a3c',
  pepperRed: '#e8663f',
  pepperGreen: '#2f7335',
  leaf: '#4f9a45',
  pale: '#a9cb7c',
  okra: '#6aa44a',
  carrot: '#ec8a34',
  onion: '#d9a35a',
  lemon: '#f0cd47',
  apple: '#a6c64a',
  bread: '#c98a4a',
  garlic: '#f2e8d2',
  egg: '#fbf6ea',
  sack: '#e7d5ad',
  fish: '#8fb3c7',
  cheese: '#f3c64a',
  shrimp: '#f0906c',
  sausage: '#a9533a',
  milk: '#fbf7ee',
  cap: '#5f93bd',
  skinA: '#8a5536',
  skinB: '#e2ad86',
  hairA: '#1f1a1c',
  hairB: '#9a4a2a',
  teal: '#23695b',
  mustard: '#e3a92b',
  paper: '#fffdf8',
} as const;

export type Shape =
  | { t: 'c'; cx: number; cy: number; r: number; f?: string }
  | { t: 'e'; cx: number; cy: number; rx: number; ry: number; f?: string; rot?: number }
  | {
      t: 'r';
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      f?: string;
      rot?: number;
      ox?: number;
      oy?: number;
    }
  | { t: 'p'; d: string; f?: string };

function el(s: Shape, fill: string, key: number): ReactNode {
  switch (s.t) {
    case 'c':
      return <circle key={key} cx={s.cx} cy={s.cy} r={s.r} fill={fill} />;
    case 'e':
      return (
        <ellipse
          key={key}
          cx={s.cx}
          cy={s.cy}
          rx={s.rx}
          ry={s.ry}
          fill={fill}
          transform={s.rot ? `rotate(${s.rot} ${s.cx} ${s.cy})` : undefined}
        />
      );
    case 'r':
      return (
        <rect
          key={key}
          x={s.x}
          y={s.y}
          width={s.w}
          height={s.h}
          rx={s.rx ?? 0}
          fill={fill}
          transform={s.rot ? `rotate(${s.rot} ${s.ox ?? s.x + s.w / 2} ${s.oy ?? s.y + s.h / 2})` : undefined}
        />
      );
    case 'p':
      return <path key={key} d={s.d} fill={fill} />;
  }
}

/** Dessine une liste de formes : aplats décalés, puis contours d'encre. */
export function Riso({
  shapes,
  offset = 2.5,
  stroke = 3,
}: {
  shapes: readonly Shape[];
  offset?: number;
  stroke?: number;
}) {
  return (
    <g>
      <g transform={`translate(${offset} ${offset * 0.8})`}>{shapes.map((s, i) => (s.f ? el(s, s.f, i) : null))}</g>
      <g stroke={INK} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        {shapes.map((s, i) => el(s, 'none', i))}
      </g>
    </g>
  );
}
