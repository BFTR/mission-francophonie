import type { Bi } from '../content/types';
import { RADIO_MESSAGES, type DialId } from '../content/m2';
import { CHAT, M3_FINAL, type ReplyKind } from '../content/m3';
import { STEPS, PLACES, type PlaceId } from '../content/m4';
import { FOODS, SENTENCES, type Food } from '../content/m5';
import { normalizeTypography, stripAccents } from './normalize';

/* ------------------------------- Mission 2 ------------------------------- */

export type DialVerdict = 'ok' | 'wrong' | 'missing';

export function checkDials(answers: Partial<Record<DialId, string>>): {
  allOk: boolean;
  rows: Record<DialId, { verdict: DialVerdict; feedback?: Bi }>;
} {
  const rows = {} as Record<DialId, { verdict: DialVerdict; feedback?: Bi }>;
  let allOk = true;
  for (const m of RADIO_MESSAGES) {
    const a = answers[m.id];
    if (!a) {
      rows[m.id] = { verdict: 'missing' };
      allOk = false;
    } else if (a === m.answer) {
      rows[m.id] = { verdict: 'ok' };
    } else {
      rows[m.id] = { verdict: 'wrong', feedback: m.wrong[a] ?? m.wrongDefault };
      allOk = false;
    }
  }
  return { allOk, rows };
}

/* ------------------------------- Mission 3 ------------------------------- */

export function evaluateReply(node: number, replyIndex: number): { kind: ReplyKind; reaction?: Bi } {
  const n = CHAT[node];
  const r = n?.replies[replyIndex];
  if (!n || !r) throw new Error(`Réplique inconnue : ${node}/${replyIndex}`);
  return { kind: r.kind, reaction: r.reaction };
}

export function checkFinalWord(id: string): { ok: boolean; feedback?: Bi } {
  if (id === M3_FINAL.answer) return { ok: true };
  const o = M3_FINAL.options.find((x) => x.id === id);
  return { ok: false, feedback: o && 'feedback' in o ? o.feedback : undefined };
}

/* ------------------------------- Mission 4 ------------------------------- */

export type VisitResult = { kind: 'found' } | { kind: 'notHere'; desc: Bi; near?: Bi };

export function evaluateVisit(step: number, place: PlaceId): VisitResult {
  const s = STEPS[step];
  const p = PLACES.find((x) => x.id === place);
  if (!s || !p) throw new Error(`Étape ou lieu inconnu : ${step}/${place}`);
  if (place === s.answer) return { kind: 'found' };
  return { kind: 'notHere', desc: p.desc, near: s.near?.[place] };
}

/* ------------------------------- Mission 5 ------------------------------- */

export type TileVerdict = { kind: 'ok' } | { kind: 'incomplete' } | { kind: 'wrong'; feedback?: Bi };

export function checkSentence(sentenceId: string, seq: string[]): TileVerdict {
  const s = SENTENCES.find((x) => x.id === sentenceId);
  if (!s) throw new Error(`Phrase inconnue : ${sentenceId}`);
  if (s.accepted.some((acc) => acc.length === seq.length && acc.every((id, i) => id === seq[i]))) return { kind: 'ok' };
  const needed = s.accepted[0]!.length;
  const usesDecoy = seq.some((id) => !s.accepted.some((acc) => acc.includes(id)));
  if (seq.length < needed && !usesDecoy) return { kind: 'incomplete' };
  const check = s.checks.find((c) => c.when(seq));
  return { kind: 'wrong', feedback: check?.feedback };
}

export function sentenceText(sentenceId: string, seq: string[]): string {
  const s = SENTENCES.find((x) => x.id === sentenceId);
  if (!s) return '';
  return seq.map((id) => s.tiles.find((t) => t.id === id)?.text ?? '').join(' ');
}

export type TouchVerdict =
  | { kind: 'empty' }
  | { kind: 'ok'; food: Food; article: string; text: string }
  | { kind: 'okNote'; food: Food; article: string; text: string; note: Bi }
  | { kind: 'accent'; food: Food; expected: string }
  | { kind: 'article'; food: Food; feedback: Bi }
  | { kind: 'unknown' };

const ARTICLES = ['de la', "de l'", 'du', 'des', 'un', 'une', 'le', 'la', 'les', "l'", 'de'];

/** Corrige « J'apporte … » : l'élève écrit l'article et le nom. Analyse déterministe. */
export function checkTouch(input: string): TouchVerdict {
  let n = normalizeTypography(input);
  if (!n) return { kind: 'empty' };
  n = n.replace(/^j'?\s*apporte\s+/, '');
  const article = ARTICLES.find((a) => n.startsWith(a + ' ') || (a.endsWith("'") && n.startsWith(a)));
  const noun = (article ? n.slice(article.length) : n).trim();
  const food =
    FOODS.find((f) => normalizeTypography(f.noun) === noun) ??
    FOODS.find((f) => stripAccents(normalizeTypography(f.noun)) === stripAccents(noun));
  if (!food) return { kind: 'unknown' };
  const exactNoun = normalizeTypography(food.noun) === noun;
  const art = article ?? '';
  const correctArticle = food.plural ? 'des' : food.gender === 'm' ? 'du' : 'de la';
  const expected = `${correctArticle} ${food.noun}`;

  if (!food.ok.includes(art) && !(food.okNote ?? []).includes(art)) {
    const why: Bi = !art
      ? {
          fr: `Il manque l’article. On écrit : « ${expected} ».`,
          en: `The article is missing. We write: “${expected}”.`,
        }
      : food.plural
        ? {
            fr: `« ${food.noun} » est au pluriel : on écrit « ${expected} ».`,
            en: `“${food.noun}” is plural: we write “${expected}”.`,
          }
        : food.gender === 'm'
          ? {
              fr: `« ${food.noun} » est masculin : on écrit « ${expected} ».`,
              en: `“${food.noun}” is masculine: we write “${expected}”.`,
            }
          : {
              fr: `« ${food.noun} » est féminin : on écrit « ${expected} ».`,
              en: `“${food.noun}” is feminine: we write “${expected}”.`,
            };
    return { kind: 'article', food, feedback: why };
  }
  if (!exactNoun) return { kind: 'accent', food, expected: `${art} ${food.noun}` };
  const text = `${art} ${food.noun}`;
  if ((food.okNote ?? []).includes(art)) {
    return {
      kind: 'okNote',
      food,
      article: art,
      text,
      note: {
        fr: `« ${text} » est correct. Pour dire « some », on écrit plutôt « ${expected} ».`,
        en: `“${text}” is correct. To say “some”, we usually write “${expected}”.`,
      },
    };
  }
  return { kind: 'ok', food, article: art, text };
}
