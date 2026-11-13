import type { Group } from '../content/types';

/**
 * Code de réussite affiché à la fin.
 * Il dépend seulement du groupe et de la date du jour : l'enseignant peut connaître
 * à l'avance le code attendu (voir l'écran enseignant). Il n'identifie aucun élève.
 * Ce n'est PAS une preuve infalsifiable : le code source est public et inspectable.
 */
const ALPHABET = 'ACDEFHJKMNPRTUVWXY3479'; // sans lettres ni chiffres ambigus (0/O, 1/I/L, 5/S, 8/B…)

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function completionCode(group: Group, date: Date): string {
  let h = fnv1a(`${group}|${localDateKey(date)}|signal-perdu`);
  let out = '';
  for (let i = 0; i < 4; i++) {
    out += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length);
  }
  return `ECHO-${group.replace('-', '')}-${out}`;
}
