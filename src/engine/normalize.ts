/**
 * Normalisation et comparaison de réponses écrites (utilisées dès la mission 5).
 * Principe : on ignore les différences typographiques (majuscules, espaces, apostrophe
 * droite ou courbe, ponctuation finale), mais on distingue une erreur d'accent d'une
 * vraie erreur de mot, pour donner une rétroaction juste.
 */

export function normalizeTypography(s: string): string {
  return (
    s
      .normalize('NFC')
      .replace(/[\u2019\u2018\u02BC`\u00B4]/g, "'")
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/\s*'\s*/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.!?;:,\s]+$/u, '')
      .toLocaleLowerCase('fr-CA')
      // « œ » est difficile à taper sur un Chromebook : « oe » est une variante typographique.
      .replace(/œ/g, 'oe')
      .replace(/æ/g, 'ae')
  );
}

export function stripAccents(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
}

export type AnswerVerdict =
  { kind: 'exact'; matched: string } | { kind: 'accent'; matched: string } | { kind: 'empty' } | { kind: 'wrong' };

/**
 * Compare une saisie à une liste de réponses acceptées (toutes équivalentes).
 * - 'exact'  : identique après normalisation typographique ;
 * - 'accent' : identique seulement si on retire les accents (mot juste, accent à corriger) ;
 * - 'wrong'  : autre chose. Aucune correspondance partielle par mot-clé.
 */
export function compareAnswer(input: string, accepted: readonly string[]): AnswerVerdict {
  const n = normalizeTypography(input);
  if (n.length === 0) return { kind: 'empty' };
  for (const a of accepted) {
    if (normalizeTypography(a) === n) return { kind: 'exact', matched: a };
  }
  const bare = stripAccents(n);
  for (const a of accepted) {
    if (stripAccents(normalizeTypography(a)) === bare) return { kind: 'accent', matched: a };
  }
  return { kind: 'wrong' };
}
