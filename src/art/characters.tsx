import { INK, PAL, Riso, type Shape } from './riso';

/**
 * Personnages du jeu, tous construits avec le même gabarit (même tête, même trait,
 * même impression décalée) pour garantir une cohérence de style entre les missions.
 */
export type CharacterId = 'lumi' | 'claire' | 'jeanrobert' | 'josephine' | 'theo' | 'ines' | 'helene' | 'vendeuse';

type Spec = {
  bg: string;
  skin: string;
  shirt: string;
  hair: string;
  style: 'puffs' | 'bob' | 'short' | 'bun' | 'curlyShort' | 'long' | 'wrap';
  extra?: 'headset' | 'glasses' | 'cap' | 'earrings' | 'scarf';
  age?: 'young' | 'adult' | 'older';
};

const SPECS: Record<CharacterId, Spec> = {
  lumi: { bg: PAL.mustard, skin: PAL.skinA, shirt: PAL.teal, hair: PAL.hairA, style: 'puffs', extra: 'headset' },
  claire: { bg: '#d5ebe3', skin: PAL.skinB, shirt: PAL.tomato, hair: PAL.hairB, style: 'bob', extra: 'earrings' },
  jeanrobert: { bg: '#f6ddd3', skin: '#6b4026', shirt: '#2f6f8f', hair: PAL.hairA, style: 'short', extra: 'headset' },
  josephine: {
    bg: '#f8e7bd',
    skin: '#7a4a2e',
    shirt: '#b5381f',
    hair: '#e8b23a',
    style: 'wrap',
    extra: 'earrings',
    age: 'older',
  },
  theo: {
    bg: '#d5ebe3',
    skin: '#8a5536',
    shirt: PAL.mustard,
    hair: PAL.hairA,
    style: 'curlyShort',
    extra: 'cap',
    age: 'young',
  },
  ines: {
    bg: '#e8d8bf',
    skin: '#9a6a45',
    shirt: PAL.teal,
    hair: '#2a1d18',
    style: 'long',
    extra: 'glasses',
    age: 'young',
  },
  helene: {
    bg: '#dde6ee',
    skin: '#f0c9a8',
    shirt: '#2f6f8f',
    hair: '#8c8c8c',
    style: 'bun',
    extra: 'scarf',
    age: 'older',
  },
  vendeuse: { bg: '#f8e7bd', skin: '#6b4026', shirt: PAL.okra, hair: PAL.hairA, style: 'wrap' },
};

function shapes(s: Spec): Shape[] {
  const out: Shape[] = [
    { t: 'c', f: s.bg, cx: 50, cy: 50, r: 46 },
    { t: 'p', f: s.shirt, d: 'M18 94 C20 74 34 68 50 68 C66 68 80 74 82 94 Z' },
  ];
  // Cheveux derrière la tête
  if (s.style === 'bob')
    out.push({ t: 'p', f: s.hair, d: 'M28 58 C22 30 36 18 50 18 C66 18 78 30 72 58 L64 58 L64 40 L36 40 L36 58 Z' });
  if (s.style === 'long')
    out.push({ t: 'p', f: s.hair, d: 'M27 70 C20 34 34 18 50 18 C66 18 80 34 73 70 L64 70 L64 40 L36 40 L36 70 Z' });
  if (s.style === 'bun') out.push({ t: 'c', f: s.hair, cx: 50, cy: 20, r: 9 });
  // Visage
  out.push({ t: 'e', f: s.skin, cx: 50, cy: 46, rx: 17, ry: 20 });
  // Cheveux devant
  switch (s.style) {
    case 'puffs':
      out.push({
        t: 'p',
        f: s.hair,
        d: 'M31 44 C28 22 44 16 52 18 C66 18 74 28 69 44 C66 34 58 30 50 30 C42 30 34 34 31 44 Z',
      });
      out.push({ t: 'c', f: s.hair, cx: 32, cy: 30, r: 7 }, { t: 'c', f: s.hair, cx: 68, cy: 30, r: 7 });
      break;
    case 'bob':
    case 'long':
      out.push({ t: 'p', f: s.hair, d: 'M33 40 C35 26 65 24 67 40 C58 33 44 33 33 40 Z' });
      break;
    case 'short':
      out.push({ t: 'p', f: s.hair, d: 'M33 40 C32 24 68 24 67 40 C60 32 40 32 33 40 Z' });
      break;
    case 'curlyShort':
      out.push(
        { t: 'c', f: s.hair, cx: 38, cy: 30, r: 7 },
        { t: 'c', f: s.hair, cx: 50, cy: 27, r: 8 },
        { t: 'c', f: s.hair, cx: 62, cy: 30, r: 7 },
      );
      break;
    case 'bun':
      out.push({ t: 'p', f: s.hair, d: 'M33 42 C33 26 67 26 67 42 C58 34 42 34 33 42 Z' });
      break;
    case 'wrap':
      out.push({ t: 'p', f: s.hair, d: 'M30 42 C26 18 74 18 70 42 C62 30 38 30 30 42 Z' });
      out.push({ t: 'p', d: 'M38 26 C46 32 56 32 64 24' });
      break;
  }
  // Yeux et sourire
  out.push({ t: 'c', f: INK, cx: 44, cy: 46, r: 1.7 }, { t: 'c', f: INK, cx: 56, cy: 46, r: 1.7 });
  out.push({ t: 'p', d: s.age === 'older' ? 'M44 56 Q50 59 56 56' : 'M44 55 Q50 60 56 55' });
  if (s.age === 'older') out.push({ t: 'p', d: 'M39 42 L42 41 M58 41 L61 42' });
  // Accessoires
  switch (s.extra) {
    case 'headset':
      out.push({ t: 'p', d: 'M29 46 C29 22 71 22 71 46' });
      out.push(
        { t: 'r', f: PAL.teal, x: 25, y: 40, w: 9, h: 15, rx: 4 },
        { t: 'r', f: PAL.teal, x: 66, y: 40, w: 9, h: 15, rx: 4 },
      );
      out.push({ t: 'p', d: 'M31 55 C33 63 40 65 45 63' }, { t: 'c', f: INK, cx: 47, cy: 63, r: 2.4 });
      break;
    case 'glasses':
      out.push({ t: 'c', cx: 44, cy: 46, r: 5 }, { t: 'c', cx: 56, cy: 46, r: 5 }, { t: 'p', d: 'M49 46 L51 46' });
      break;
    case 'cap':
      out.push(
        { t: 'p', f: PAL.tomato, d: 'M32 34 C32 20 68 20 68 34 Z' },
        { t: 'p', f: PAL.tomato, d: 'M58 34 L80 34 L78 38 L58 37 Z' },
      );
      break;
    case 'earrings':
      out.push({ t: 'c', f: PAL.lemon, cx: 33, cy: 54, r: 3 }, { t: 'c', f: PAL.lemon, cx: 67, cy: 54, r: 3 });
      break;
    case 'scarf':
      out.push({ t: 'p', f: PAL.tomato, d: 'M34 66 C42 72 58 72 66 66 L68 72 C58 78 42 78 32 72 Z' });
      break;
  }
  return out;
}

export function Avatar({ who, size = 88 }: { who: CharacterId; size?: number }) {
  return (
    <svg viewBox="-2 -2 106 106" width={size} height={size} aria-hidden="true" focusable="false">
      <Riso shapes={shapes(SPECS[who])} stroke={2.6} />
    </svg>
  );
}

/** Store rayé de l'étal du marché (décor fonctionnel : situe la scène). */
export function Awning() {
  const n = 12;
  const w = 1000 / n;
  return (
    <svg
      viewBox="0 0 1000 90"
      width="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      <rect x="0" y="0" width="1000" height="40" fill={PAL.paper} />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={i * w} y={0} width={w} height={40} fill={i % 2 ? PAL.paper : PAL.teal} />
          <path
            d={`M${i * w} 40 Q${i * w + w / 2} 86 ${(i + 1) * w} 40 Z`}
            fill={i % 2 ? PAL.paper : PAL.teal}
            stroke={INK}
            strokeWidth={3}
          />
        </g>
      ))}
      <line x1="0" y1="40" x2="1000" y2="40" stroke={INK} strokeWidth={3} />
      <rect x="1.5" y="1.5" width="997" height="38.5" fill="none" stroke={INK} strokeWidth={3} />
    </svg>
  );
}
