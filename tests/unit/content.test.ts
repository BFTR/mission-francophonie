import { describe, expect, it } from 'vitest';
import * as m1 from '../../src/content/m1';
import * as ui from '../../src/content/ui';
import { STATIONS } from '../../src/content/stations';
import * as m2 from '../../src/content/m2';
import * as m3 from '../../src/content/m3';
import * as m4 from '../../src/content/m4';
import * as m5 from '../../src/content/m5';
import * as bonus from '../../src/content/bonus';
import * as finale from '../../src/content/finale';
import { fixFr } from '../../scripts/fr-typo-rules.mjs';

type Bi = { fr: string; en: string };
const isBi = (v: unknown): v is Bi =>
  typeof v === 'object' && v !== null && typeof (v as Bi).fr === 'string' && typeof (v as Bi).en === 'string';

function collect(v: unknown, out: Bi[] = []): Bi[] {
  if (isBi(v)) out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => collect(x, out));
  else if (typeof v === 'object' && v !== null) Object.values(v).forEach((x) => collect(x, out));
  return out;
}

const all = collect([m1, m2, m3, m4, m5, bonus, finale, ui, STATIONS]);

describe('Contenus bilingues', () => {
  it('on trouve bien les textes', () => {
    expect(all.length).toBeGreaterThan(250);
  });

  it('chaque texte a une version française et une version anglaise', () => {
    for (const t of all) {
      expect(t.fr.trim(), JSON.stringify(t)).not.toBe('');
      expect(t.en.trim(), JSON.stringify(t)).not.toBe('');
    }
  });

  it('typographie canadienne : pas d’espace avant ! ? ; ; espace insécable avant : et dans « »', () => {
    for (const t of all) expect(fixFr(t.fr), t.fr).toBe(t.fr);
  });

  it('apostrophe typographique (’) dans les textes français', () => {
    for (const t of all) expect(t.fr, t.fr).not.toMatch(/[a-zà-ÿ]'[a-zà-ÿ]/i);
  });

  it('pas de mot anglais oublié dans les consignes françaises', () => {
    const suspects = /\b(the|and|click|find|please|with)\b/i;
    for (const t of all) expect(t.fr, t.fr).not.toMatch(suspects);
  });
});

describe('Cohérence de la mission 1', () => {
  it('chaque ingrédient de la liste est sur l’étal et marqué « onList »', () => {
    for (const id of m1.SHOPPING_LIST) {
      const item = m1.MARKET_ITEMS.find((i) => i.id === id);
      expect(item?.onList, id).toBe(true);
    }
    expect(m1.MARKET_ITEMS.filter((i) => i.onList)).toHaveLength(m1.SHOPPING_LIST.length);
  });

  it('les réponses des quantités sont atteignables avec le pas-à-pas', () => {
    for (const r of m1.COUNT_ROWS) {
      expect(r.answer).toBeGreaterThan(0);
      expect(r.answer).toBeLessThanOrEqual(m1.COUNT_MAX);
    }
  });

  it('le carnet de mots ne donne pas les réponses de la fouille', () => {
    const answers = m1.MARKET_ITEMS.filter((i) => i.onList).map((i) => i.en.toLowerCase());
    for (const g of m1.M1_GLOSSARY) for (const a of answers) expect(g.en.toLowerCase()).not.toContain(a);
  });

  it('les cinq stations ont des numéros uniques 1 à 5', () => {
    expect(STATIONS.map((s) => s.number)).toEqual([1, 2, 3, 4, 5]);
  });
});
