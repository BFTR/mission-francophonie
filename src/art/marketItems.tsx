import type { MarketItemId } from '../content/m1';
import { PAL, Riso, type Shape } from './riso';

/** Illustrations originales des 18 produits du marché (viewBox 0 0 100 100). */

const pepper = (f: string): Shape[] => [
  { t: 'p', f, d: 'M28 42 C24 70 34 88 50 86 C66 88 76 70 72 42 C64 34 36 34 28 42 Z' },
  { t: 'p', d: 'M50 42 V82' },
  { t: 'p', d: 'M38 44 C36 60 38 74 42 82' },
  { t: 'p', d: 'M50 38 C50 28 55 22 62 20' },
  { t: 'p', f: PAL.leaf, d: 'M40 38 Q50 30 60 38 Q50 42 40 38 Z' },
];

const onion = (dx: number, dy: number, s: number): Shape[] => {
  const p = (x: number, y: number) => `${dx + x * s} ${dy + y * s}`;
  return [
    {
      t: 'p',
      f: PAL.onion,
      d: `M${p(50, 22)} C${p(44, 34)} ${p(24, 42)} ${p(24, 62)} C${p(24, 78)} ${p(36, 86)} ${p(50, 86)} C${p(64, 86)} ${p(76, 78)} ${p(76, 62)} C${p(76, 42)} ${p(56, 34)} ${p(50, 22)} Z`,
    },
    { t: 'p', d: `M${p(50, 30)} C${p(42, 46)} ${p(40, 66)} ${p(46, 84)}` },
    { t: 'p', d: `M${p(50, 30)} C${p(58, 46)} ${p(60, 66)} ${p(54, 84)}` },
    { t: 'p', d: `M${p(50, 22)} L${p(50, 12)}` },
  ];
};

const ITEMS: Record<MarketItemId, Shape[]> = {
  oignons: [...onion(-14, 6, 0.85), ...onion(22, 2, 0.9)],
  tomates: [
    { t: 'c', f: PAL.tomato, cx: 34, cy: 62, r: 20 },
    { t: 'c', f: PAL.tomato, cx: 64, cy: 58, r: 23 },
    { t: 'p', f: PAL.leaf, d: 'M54 38 Q64 30 74 38 Q64 42 54 38 Z' },
    { t: 'p', f: PAL.leaf, d: 'M25 44 Q34 37 43 44 Q34 47 25 44 Z' },
    { t: 'p', d: 'M64 36 V28' },
  ],
  celeri: [
    { t: 'r', f: PAL.pale, x: 30, y: 36, w: 11, h: 54, rx: 5, rot: -10 },
    { t: 'r', f: PAL.pale, x: 44, y: 34, w: 12, h: 58, rx: 6 },
    { t: 'r', f: PAL.pale, x: 59, y: 36, w: 11, h: 54, rx: 5, rot: 10 },
    { t: 'c', f: PAL.leaf, cx: 32, cy: 26, r: 10 },
    { t: 'c', f: PAL.leaf, cx: 50, cy: 18, r: 11 },
    { t: 'c', f: PAL.leaf, cx: 68, cy: 26, r: 10 },
    { t: 'p', d: 'M50 44 V84' },
  ],
  carottes: [
    { t: 'p', f: PAL.carrot, d: 'M22 34 L44 30 L30 88 Z' },
    { t: 'p', f: PAL.carrot, d: 'M54 30 L78 34 L68 88 Z' },
    { t: 'p', d: 'M28 46 L36 45 M30 60 L36 59 M60 46 L70 47 M62 62 L70 63' },
    { t: 'p', f: PAL.leaf, d: 'M30 32 L24 12 L34 30 L40 10 L38 31 Z' },
    { t: 'p', f: PAL.leaf, d: 'M62 32 L58 12 L66 30 L74 12 L70 33 Z' },
  ],
  'poivron-vert': pepper(PAL.pepperGreen),
  'poivron-rouge': pepper(PAL.pepperRed),
  pommes: [
    { t: 'p', f: PAL.apple, d: 'M34 44 C18 44 16 66 24 78 C30 88 40 86 34 86 C38 88 46 88 50 78 C56 64 52 44 34 44 Z' },
    { t: 'p', f: PAL.apple, d: 'M66 40 C50 40 48 62 56 76 C62 86 70 86 66 84 C70 86 80 86 84 74 C90 60 84 40 66 40 Z' },
    { t: 'p', d: 'M34 44 C34 38 36 34 38 30 M66 40 C66 34 68 30 70 26' },
    { t: 'p', f: PAL.leaf, d: 'M70 28 Q80 20 86 28 Q78 32 70 28 Z' },
  ],
  gombo: [
    { t: 'p', f: PAL.okra, d: 'M24 22 C34 40 40 64 34 88 C24 66 18 42 24 22 Z' },
    { t: 'p', f: PAL.okra, d: 'M50 16 C58 38 60 64 52 90 C42 66 40 40 50 16 Z' },
    { t: 'p', f: PAL.okra, d: 'M76 22 C82 42 78 66 68 88 C64 64 66 40 76 22 Z' },
    { t: 'p', d: 'M26 30 C30 48 32 66 33 80 M50 24 C51 46 52 66 52 82 M74 30 C74 48 72 66 70 80' },
    { t: 'r', f: PAL.leaf, x: 19, y: 14, w: 10, h: 10, rx: 3 },
    { t: 'r', f: PAL.leaf, x: 45, y: 8, w: 10, h: 10, rx: 3 },
    { t: 'r', f: PAL.leaf, x: 71, y: 14, w: 10, h: 10, rx: 3 },
  ],
  citrons: [
    { t: 'p', f: PAL.lemon, d: 'M12 58 C16 40 46 34 56 52 C60 58 58 64 54 68 C42 82 16 78 12 58 Z' },
    { t: 'p', f: PAL.lemon, d: 'M44 46 C50 28 80 26 88 44 C92 52 88 60 84 62 C72 76 46 68 44 46 Z' },
    { t: 'p', d: 'M60 40 C66 38 72 38 76 42' },
  ],
  pain: [
    { t: 'r', f: PAL.bread, x: 10, y: 40, w: 80, h: 24, rx: 12, rot: -18 },
    { t: 'p', d: 'M30 60 L38 48 M44 55 L52 43 M58 50 L66 38 M72 45 L78 36' },
  ],
  ail: [
    {
      t: 'p',
      f: PAL.garlic,
      d: 'M50 26 C42 40 22 46 22 66 C22 82 36 88 50 88 C64 88 78 82 78 66 C78 46 58 40 50 26 Z',
    },
    {
      t: 'p',
      d: 'M50 34 C44 50 42 70 46 86 M50 34 C56 50 58 70 54 86 M36 50 C30 62 32 76 38 84 M64 50 C70 62 68 76 62 84',
    },
    { t: 'p', d: 'M50 26 C48 20 50 14 54 10' },
  ],
  oeufs: [
    { t: 'r', f: PAL.sack, x: 10, y: 62, w: 80, h: 22, rx: 4 },
    { t: 'e', f: PAL.egg, cx: 28, cy: 54, rx: 12, ry: 16 },
    { t: 'e', f: PAL.egg, cx: 50, cy: 50, rx: 12, ry: 16 },
    { t: 'e', f: PAL.egg, cx: 72, cy: 54, rx: 12, ry: 16 },
    { t: 'p', d: 'M30 72 V84 M50 72 V84 M70 72 V84' },
  ],
  riz: [
    { t: 'p', f: PAL.sack, d: 'M28 30 C22 50 20 72 26 88 L74 88 C80 72 78 50 72 30 Z' },
    { t: 'p', f: PAL.sack, d: 'M28 30 L36 14 L50 22 L64 14 L72 30 Z' },
    { t: 'p', d: 'M28 30 Q50 38 72 30' },
    { t: 'c', f: PAL.teal, cx: 50, cy: 60, r: 12 },
    { t: 'p', d: 'M44 58 L56 58 M44 63 L56 63' },
  ],
  poisson: [
    { t: 'p', f: PAL.fish, d: 'M14 52 C30 30 60 30 74 50 C60 70 30 72 14 52 Z' },
    { t: 'p', f: PAL.fish, d: 'M72 50 L92 34 L88 50 L92 66 Z' },
    { t: 'c', f: PAL.paper, cx: 28, cy: 48, r: 4 },
    { t: 'p', d: 'M42 40 C46 46 46 56 42 62' },
  ],
  fromage: [
    { t: 'p', f: PAL.cheese, d: 'M12 74 L88 74 L88 50 L30 30 L12 50 Z' },
    { t: 'p', d: 'M12 50 L88 50' },
    { t: 'c', f: PAL.paper, cx: 34, cy: 62, r: 5 },
    { t: 'c', f: PAL.paper, cx: 62, cy: 64, r: 4 },
    { t: 'c', f: PAL.paper, cx: 76, cy: 58, r: 3 },
  ],
  crevettes: [
    {
      t: 'p',
      f: PAL.shrimp,
      d: 'M20 40 C20 22 50 18 54 40 C56 54 44 64 34 62 L36 54 C44 54 46 46 44 40 C40 30 28 32 28 42 Z',
    },
    {
      t: 'p',
      f: PAL.shrimp,
      d: 'M48 70 C48 52 78 48 82 70 C84 84 72 94 62 92 L64 84 C72 84 74 76 72 70 C68 60 56 62 56 72 Z',
    },
    { t: 'p', d: 'M34 62 L26 70 M62 92 L54 98' },
    { t: 'p', d: 'M20 40 L10 30 M48 70 L38 60' },
  ],
  lait: [
    { t: 'p', f: PAL.milk, d: 'M36 30 L36 22 L64 22 L64 30 L72 44 L72 88 L28 88 L28 44 Z' },
    { t: 'r', f: PAL.cap, x: 38, y: 12, w: 24, h: 10, rx: 2 },
    { t: 'r', f: PAL.cap, x: 28, y: 56, w: 44, h: 16 },
  ],
  saucisse: [
    { t: 'p', f: PAL.sausage, d: 'M14 46 C14 34 30 30 40 38 C46 42 46 58 40 62 C30 70 14 60 14 46 Z' },
    { t: 'p', f: PAL.sausage, d: 'M44 48 C46 36 62 34 70 42 C76 48 74 62 66 66 C56 72 42 62 44 48 Z' },
    { t: 'p', f: PAL.sausage, d: 'M66 66 C72 56 88 58 90 70 C92 82 80 90 70 86 C62 82 62 72 66 66 Z' },
    { t: 'p', d: 'M40 50 L46 50 M68 64 L70 70' },
  ],
};

export function MarketItemArt({ id, size = 72 }: { id: MarketItemId; size?: number }) {
  return (
    <svg viewBox="4 4 96 96" width={size} height={size} aria-hidden="true" focusable="false">
      <Riso shapes={ITEMS[id]} />
    </svg>
  );
}
