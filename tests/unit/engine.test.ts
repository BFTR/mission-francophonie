import { describe, expect, it } from 'vitest';
import { COUNT_ROWS, MARKET_ITEMS, SHOPPING_LIST, type MarketItemId } from '../../src/content/m1';
import { allFound, checkCounts, clampCount, evaluatePick, nextTarget } from '../../src/engine/m1';
import { compareAnswer, normalizeTypography, stripAccents } from '../../src/engine/normalize';
import { completionCode, localDateKey } from '../../src/engine/code';

describe('Mission 1 — fouille du marché', () => {
  it('accepte chaque ingrédient de la liste', () => {
    for (const id of SHOPPING_LIST) expect(evaluatePick(id, []).kind).toBe('found');
  });

  it('refuse chaque produit hors liste, avec une rétroaction FR et EN', () => {
    const distractors = MARKET_ITEMS.filter((i) => !i.onList);
    expect(distractors).toHaveLength(10);
    for (const d of distractors) {
      const r = evaluatePick(d.id, []);
      expect(r.kind).toBe('notOnList');
      if (r.kind === 'notOnList') {
        expect(r.feedback.fr.length).toBeGreaterThan(10);
        expect(r.feedback.en.length).toBeGreaterThan(10);
      }
    }
  });

  it('le poivron rouge explique la différence de couleur (cas limite)', () => {
    const r = evaluatePick('poivron-rouge', []);
    expect(r.kind === 'notOnList' && r.feedback.fr).toContain('vert');
  });

  it('un double clic sur un produit déjà trouvé ne compte pas deux fois', () => {
    expect(evaluatePick('riz', ['riz']).kind).toBe('already');
  });

  it('allFound et nextTarget suivent l’ordre de la liste', () => {
    expect(nextTarget([])).toBe('oignons');
    expect(nextTarget(['oignons'])).toBe('celeri');
    expect(allFound(SHOPPING_LIST.slice(0, 7) as MarketItemId[])).toBe(false);
    expect(allFound([...SHOPPING_LIST])).toBe(true);
    expect(nextTarget([...SHOPPING_LIST])).toBeNull();
  });

  it('l’étal contient 18 produits uniques, 6 par étagère', () => {
    expect(new Set(MARKET_ITEMS.map((i) => i.id)).size).toBe(18);
    for (const shelf of [0, 1, 2]) expect(MARKET_ITEMS.filter((i) => i.shelf === shelf)).toHaveLength(6);
  });
});

describe('Mission 1 — quantités', () => {
  const correct = { oignons: 2, poivrons: 2, crevettes: 3, riz: 1, saucisses: 6 };

  it('accepte la bonne réponse', () => {
    expect(checkCounts(correct).allOk).toBe(true);
  });

  it('détecte le piège du P.-S. (4 oignons recopiés)', () => {
    const r = checkCounts({ ...correct, oignons: 4 });
    expect(r.allOk).toBe(false);
    expect(r.rows.oignons).toBe('ps-trap');
    expect(r.rows.riz).toBe('ok');
  });

  it('marque les autres erreurs comme « wrong »', () => {
    const r = checkCounts({ ...correct, crevettes: 4, saucisses: 0 });
    expect(r.rows.crevettes).toBe('wrong');
    expect(r.rows.saucisses).toBe('wrong');
  });

  it('une réponse vide (tout à 0) est refusée', () => {
    expect(checkCounts({}).allOk).toBe(false);
  });

  it('chaque nombre écrit dans la note correspond à sa valeur', () => {
    const words: Record<string, number> = { un: 1, deux: 2, trois: 3, quatre: 4, six: 6 };
    for (const row of COUNT_ROWS) {
      expect(row.noteLine.startsWith(row.numberWord + ' ')).toBe(true);
      expect(words[row.numberWord]).toBe(row.numberValue);
      if (row.id !== 'oignons') expect(row.answer).toBe(row.numberValue);
    }
    expect(COUNT_ROWS.find((r) => r.id === 'oignons')!.answer).toBe(4 - 2);
  });

  it('clampCount borne les valeurs', () => {
    expect(clampCount(-3)).toBe(0);
    expect(clampCount(42)).toBe(10);
    expect(clampCount(Number.NaN)).toBe(0);
    expect(clampCount(2.6)).toBe(3);
  });
});

describe('Comparaison de réponses écrites', () => {
  it('ignore majuscules, espaces, apostrophe courbe et ponctuation finale', () => {
    expect(normalizeTypography('  Je  M’APPELLE   Lumi ! ')).toBe("je m'appelle lumi");
    expect(compareAnswer("J'aime le gombo.", ['j’aime le gombo']).kind).toBe('exact');
  });

  it('distingue une erreur d’accent d’une vraie erreur', () => {
    expect(compareAnswer('le marche', ['le marché']).kind).toBe('accent');
    expect(compareAnswer('le marchand', ['le marché']).kind).toBe('wrong');
    expect(stripAccents('œufs à côté')).toBe('oeufs a cote');
  });

  it('accepte plusieurs réponses valables', () => {
    const ok = ['samedi à midi', 'samedi à 12 h'];
    expect(compareAnswer('Samedi à 12 h', ok).kind).toBe('exact');
  });

  it('refuse une réponse qui contient seulement le mot-clé', () => {
    expect(compareAnswer('samedi', ['samedi à midi']).kind).toBe('wrong');
    expect(compareAnswer('samedi à midi et dimanche', ['samedi à midi']).kind).toBe('wrong');
  });

  it('signale une réponse vide', () => {
    expect(compareAnswer('   ', ['oui']).kind).toBe('empty');
  });
});

describe('Code de réussite', () => {
  const d = new Date(2026, 10, 12, 10, 30);

  it('est stable pour un groupe et un jour donnés', () => {
    expect(completionCode('7-17', d)).toBe(completionCode('7-17', new Date(2026, 10, 12, 14, 0)));
    expect(completionCode('7-17', d)).toMatch(/^ECHO-717-[ACDEFHJKMNPRTUVWXY3479]{4}$/);
  });

  it('change selon le groupe et le jour', () => {
    expect(completionCode('7-15', d)).not.toBe(completionCode('7-17', d));
    expect(completionCode('7-17', d)).not.toBe(completionCode('7-17', new Date(2026, 10, 13)));
  });

  it('utilise la date locale', () => {
    expect(localDateKey(d)).toBe('2026-11-12');
  });
});
