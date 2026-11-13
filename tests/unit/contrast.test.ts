import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Contrastes WCAG 2.2 calculés à partir des jetons réels de tokens.css. */
const css = readFileSync('src/styles/tokens.css', 'utf8');
const tok = (name: string): string => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`jeton introuvable : ${name}`);
  return m[1]!;
};

function lum(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const WHITE = '#ffffff';
// [texte, fond, minimum] — 4,5:1 pour le texte courant (AA), 3:1 pour les éléments d'interface.
const PAIRS: [string, string, string, number][] = [
  ['encre / papier', tok('ink'), tok('paper'), 4.5],
  ['encre / fiche', tok('ink'), tok('sheet'), 4.5],
  ['encre douce / papier', tok('ink-soft'), tok('paper'), 4.5],
  ['encre douce / fiche', tok('ink-soft'), tok('sheet'), 4.5],
  ['encre pâle / papier', tok('ink-faint'), tok('paper'), 4.5],
  ['blanc / rouge signal', WHITE, tok('signal'), 4.5],
  ['blanc / rouge foncé', WHITE, tok('signal-deep'), 4.5],
  ['blanc / sarcelle', WHITE, tok('teal'), 4.5],
  ['encre / moutarde', tok('ink'), tok('mustard'), 4.5],
  ['encre / teinte moutarde', tok('ink'), tok('mustard-tint'), 4.5],
  ['encre / teinte rouge', tok('ink'), tok('signal-tint'), 4.5],
  ['rouge foncé / teinte rouge', tok('signal-deep'), tok('signal-tint'), 4.5],
  ['encre / teinte sarcelle', tok('ink'), tok('teal-tint'), 4.5],
  ['encre douce / teinte moutarde', tok('ink-soft'), tok('mustard-tint'), 4.5],
  ['crème / console', tok('cream'), tok('console'), 4.5],
  ['ambre / console', tok('amber'), tok('console'), 4.5],
  ['anneau de focus rouge / papier', tok('signal'), tok('paper'), 3],
];

describe('Contrastes (WCAG 2.2 AA)', () => {
  for (const [label, fg, bg, min] of PAIRS) {
    it(`${label} ≥ ${min}:1`, () => {
      expect(ratio(fg, bg), `${label} : ${ratio(fg, bg).toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
    });
  }
});
