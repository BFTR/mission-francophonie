import { COUNT_MAX, COUNT_ROWS, MARKET_ITEMS, SHOPPING_LIST, type CountRow, type MarketItemId } from '../content/m1';
import type { Bi } from '../content/types';

export type PickResult =
  | { kind: 'found'; item: MarketItemId }
  | { kind: 'already'; item: MarketItemId }
  | { kind: 'notOnList'; item: MarketItemId; feedback: Bi };

/** Évalue un clic sur un produit de l'étal. Déterministe, sans effet de bord. */
export function evaluatePick(itemId: MarketItemId, found: readonly MarketItemId[]): PickResult {
  const item = MARKET_ITEMS.find((i) => i.id === itemId);
  if (!item) throw new Error(`Produit inconnu : ${itemId}`);
  if (!item.onList) {
    return { kind: 'notOnList', item: itemId, feedback: item.notOnList ?? { fr: '', en: '' } };
  }
  if (found.includes(itemId)) return { kind: 'already', item: itemId };
  return { kind: 'found', item: itemId };
}

export function allFound(found: readonly MarketItemId[]): boolean {
  return SHOPPING_LIST.every((id) => found.includes(id));
}

/** Premier ingrédient de la liste pas encore trouvé : cible des indices. */
export function nextTarget(found: readonly MarketItemId[]): MarketItemId | null {
  return SHOPPING_LIST.find((id) => !found.includes(id)) ?? null;
}

export type RowVerdict = 'ok' | 'ps-trap' | 'wrong';
export type CountCheck = { allOk: boolean; rows: Record<CountRow['id'], RowVerdict> };

/**
 * Vérifie les quantités. « ps-trap » signale l'erreur attendue sur les oignons :
 * l'élève a recopié « quatre » sans tenir compte du P.-S. (deux oignons déjà à la maison).
 */
export function checkCounts(counts: Partial<Record<CountRow['id'], number>>): CountCheck {
  const rows = {} as Record<CountRow['id'], RowVerdict>;
  let allOk = true;
  for (const row of COUNT_ROWS) {
    const v = counts[row.id] ?? 0;
    let verdict: RowVerdict;
    if (v === row.answer) verdict = 'ok';
    else if (row.id === 'oignons' && v === row.numberValue) verdict = 'ps-trap';
    else verdict = 'wrong';
    if (verdict !== 'ok') allOk = false;
    rows[row.id] = verdict;
  }
  return { allOk, rows };
}

export function clampCount(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(COUNT_MAX, Math.round(n)));
}
