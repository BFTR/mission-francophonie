import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RADIO_MESSAGES, M2_TEXT } from '../../src/content/m2';
import { CHAT, M3_FINAL } from '../../src/content/m3';
import { PLACES, STEPS } from '../../src/content/m4';
import { FOODS, SENTENCES } from '../../src/content/m5';
import { BONUS } from '../../src/content/bonus';
import { STATION_IDS } from '../../src/content/types';
import { compareAnswer } from '../../src/engine/normalize';
import {
  checkDials,
  checkFinalWord,
  checkSentence,
  checkTouch,
  evaluateReply,
  evaluateVisit,
  sentenceText,
} from '../../src/engine/missions';
import { initialState, reducer, sanitizeState } from '../../src/state/game';
import { invitationLines } from '../../src/missions/M5Lighthouse';

/* =========================================================================
   PREMIÈRE VÉRIFICATION : on résout chaque défi et on vérifie la réponse.
   ========================================================================= */

describe('Mission 2 — console radio', () => {
  const good = { meteo: 'soleil', jour: 'samedi', heure: '14h' };

  it('accepte les trois bonnes réponses', () => {
    expect(checkDials(good).allOk).toBe(true);
  });

  it('chaque bonne réponse est bien prononcée dans le message (transcription)', () => {
    expect(RADIO_MESSAGES[0]!.transcript).toContain('samedi, il va faire soleil');
    expect(RADIO_MESSAGES[1]!.transcript).toContain('c’est samedi');
    expect(RADIO_MESSAGES[2]!.transcript).toContain('le festival commence à quatorze heures');
  });

  it('les distracteurs oraux donnent une rétroaction ciblée', () => {
    expect(checkDials({ ...good, meteo: 'pluie' }).rows.meteo.feedback?.fr).toContain('ce matin');
    expect(checkDials({ ...good, jour: 'vendredi' }).rows.jour.feedback?.fr).toContain('PAS vendredi');
    expect(checkDials({ ...good, heure: '12h' }).rows.heure.feedback?.fr).toContain('concert');
    expect(checkDials({ ...good, heure: '4h' }).rows.heure.feedback?.fr).toContain('quatorze');
  });

  it('un jour absent du message reçoit la rétroaction générale', () => {
    expect(checkDials({ ...good, jour: 'lundi' }).rows.jour.feedback).toEqual(RADIO_MESSAGES[1]!.wrongDefault);
  });

  it('un cadran non réglé est signalé « missing », sans compter une erreur', () => {
    const r = checkDials({ meteo: 'soleil' });
    expect(r.allOk).toBe(false);
    expect(r.rows.jour.verdict).toBe('missing');
  });

  it('chaque réponse attendue existe parmi les options', () => {
    for (const m of RADIO_MESSAGES) expect(m.options.map((o) => o.id)).toContain(m.answer);
  });
});

describe('Mission 3 — conversation', () => {
  it('chaque nœud a exactement une réponse juste, une de mauvais registre et une illogique', () => {
    for (const n of CHAT) {
      expect(n.replies.map((r) => r.kind).sort()).toEqual(['logic', 'ok', 'register']);
      for (const r of n.replies) if (r.kind !== 'ok') expect(r.reaction?.fr.length).toBeGreaterThan(5);
    }
  });

  it('la bonne réponse n’est pas toujours à la même place', () => {
    const pos = CHAT.map((n) => n.replies.findIndex((r) => r.kind === 'ok'));
    expect(new Set(pos).size).toBeGreaterThan(1);
  });

  it('registre : « vous » avec Mme Joséphine, « tu » avec Théo', () => {
    for (const n of CHAT) {
      const ok = n.replies.find((r) => r.kind === 'ok')!.text.fr;
      const bad = n.replies.find((r) => r.kind === 'register')!.text.fr;
      if (n.who === 'josephine') {
        expect(ok).not.toMatch(/\b(tu|peux-tu|t')\b/i);
        expect(bad).toMatch(/\b(tu|peux-tu|salut)\b/i);
      } else {
        expect(ok).not.toMatch(/\bvous\b/i);
        expect(bad).toMatch(/\b(vous|monsieur)\b/i);
      }
    }
  });

  it('evaluateReply et le mot final', () => {
    expect(evaluateReply(0, 0).kind).toBe('ok');
    expect(evaluateReply(0, 1).kind).toBe('register');
    expect(checkFinalWord('venez').ok).toBe(true);
    expect(checkFinalWord('viens').feedback?.fr).toContain('une seule personne');
    expect(checkFinalWord('venir').ok).toBe(false);
    expect(M3_FINAL.answer).toBe('venez');
  });

  it('réplique inconnue → erreur explicite', () => {
    expect(() => evaluateReply(99, 0)).toThrow();
  });
});

describe('Mission 4 — plan de Cayenne', () => {
  it('chaque étape a une bonne destination et toutes les autres mènent à une impasse expliquée', () => {
    STEPS.forEach((s, i) => {
      expect(evaluateVisit(i, s.answer).kind).toBe('found');
      for (const p of PLACES) {
        if (p.id === s.answer) continue;
        const r = evaluateVisit(i, p.id);
        expect(r.kind).toBe('notHere');
      }
    });
  });

  it('le mot-clé de chaque message est bien dans le message', () => {
    for (const s of STEPS) expect(s.message.fr).toContain(s.keyWords);
  });

  it('il y a deux cafés : seul celui « à côté du musée » est juste', () => {
    expect(evaluateVisit(3, 'cafe-musee').kind).toBe('found');
    const r = evaluateVisit(3, 'cafe-gare');
    expect(r.kind === 'notHere' && r.near?.fr).toContain('gare routière');
  });

  it('les lieux ne se chevauchent pas sur le plan', () => {
    for (const a of PLACES)
      for (const b of PLACES) {
        if (a.id >= b.id) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        expect(d, `${a.id} / ${b.id}`).toBeGreaterThan(120);
      }
  });
});

describe('Mission 5 — phrases', () => {
  it('chaque ordre accepté est validé', () => {
    for (const s of SENTENCES) for (const acc of s.accepted) expect(checkSentence(s.id, acc).kind).toBe('ok');
  });

  it('textes des phrases correctes', () => {
    expect(sentenceText('s1', SENTENCES[0]!.accepted[0]!)).toBe('Venez au festival francophone');
    expect(sentenceText('s2', SENTENCES[1]!.accepted[0]!)).toBe('Le festival est samedi à 14 h au port');
    expect(sentenceText('s2', SENTENCES[1]!.accepted[1]!)).toBe('Le festival est au port samedi à 14 h');
    expect(sentenceText('s3', SENTENCES[2]!.accepted[0]!)).toBe('Il y a un gombo au menu');
  });

  it('le leurre « Viens » est refusé avec une explication sur le registre', () => {
    const r = checkSentence('s1', ['viens', 'au', 'festival', 'francophone']);
    expect(r.kind === 'wrong' && r.feedback?.fr).toContain('Viens');
  });

  it('l’adjectif avant le nom est refusé avec une explication', () => {
    const r = checkSentence('s1', ['venez', 'au', 'francophone', 'festival']);
    expect(r.kind === 'wrong' && r.feedback?.fr).toContain('après le nom');
  });

  it('phrase incomplète ≠ phrase fausse', () => {
    expect(checkSentence('s3', ['il', 'y', 'a']).kind).toBe('incomplete');
    expect(checkSentence('s2', []).kind).toBe('incomplete');
  });

  it('l’heure avant le jour est refusée avec une explication', () => {
    const r = checkSentence('s2', ['le', 'festival', 'est', 'a14h', 'samedi', 'auport']);
    expect(r.kind === 'wrong' && r.feedback?.fr).toContain('le jour, puis l’heure');
  });
});

describe('Mission 5 — « J’apporte… »', () => {
  it('accepte les partitifs et indéfinis corrects', () => {
    for (const s of [
      'du pain',
      'Du fromage',
      'un gâteau',
      'de la limonade',
      'une salade',
      'des pommes',
      'des citrons.',
    ]) {
      expect(['ok'], s).toContain(checkTouch(s).kind);
    }
  });

  it('tolère « J’apporte » recopié et l’apostrophe droite', () => {
    expect(checkTouch("J'apporte du riz").kind).toBe('ok');
    expect(checkTouch('j’apporte de la musique').kind).toBe('ok');
  });

  it('l’article défini est accepté avec une remarque (réponse correcte mais moins naturelle)', () => {
    const r = checkTouch('les pommes');
    expect(r.kind).toBe('okNote');
  });

  it('mauvais article : explication selon le genre ou le nombre', () => {
    const m = checkTouch('de la pain');
    expect(m.kind === 'article' && m.feedback.fr).toContain('masculin');
    const f = checkTouch('du limonade');
    expect(f.kind === 'article' && f.feedback.fr).toContain('féminin');
    const p = checkTouch('du pommes');
    expect(p.kind === 'article' && p.feedback.fr).toContain('pluriel');
    const none = checkTouch('pain');
    expect(none.kind === 'article' && none.feedback.fr).toContain('Il manque l’article');
    const de = checkTouch('de pain');
    expect(de.kind).toBe('article');
  });

  it('accent manquant : signalé sans être compté comme faux', () => {
    const r = checkTouch('du gateau');
    expect(r.kind).toBe('accent');
  });

  it('mot inconnu ou vide', () => {
    expect(checkTouch('une voiture').kind).toBe('unknown');
    expect(checkTouch('   ').kind).toBe('empty');
  });

  it('chaque aliment de la banque a son article attendu accepté', () => {
    for (const f of FOODS) {
      const art = f.plural ? 'des' : f.gender === 'm' ? 'du' : 'de la';
      expect(checkTouch(`${art} ${f.noun}`).kind, f.noun).toBe('ok');
    }
  });

  it('l’invitation finale assemble les phrases et la touche personnelle', () => {
    const seqs = Object.fromEntries(SENTENCES.map((s) => [s.id, s.accepted[0]!]));
    expect(invitationLines(seqs, 'des pommes')).toEqual([
      'Venez au festival francophone!',
      'Le festival est samedi à 14 h au port.',
      'Il y a un gombo au menu.',
      'J’apporte des pommes.',
    ]);
    expect(invitationLines(seqs, 'xyz')).toHaveLength(3);
  });
});

describe('Dossiers secrets', () => {
  it('chaque question a une réponse atteignable', () => {
    for (const id of STATION_IDS) {
      expect(BONUS[id]).toHaveLength(3);
      for (const item of BONUS[id]) {
        if (item.kind === 'choice') expect(item.options).toContain(item.answer);
        else for (const a of item.accepted) expect(compareAnswer(a, item.accepted).kind).toBe('exact');
      }
    }
  });

  it('« des oeufs » = « des œufs » (le œ est difficile à taper)', () => {
    expect(compareAnswer('des oeufs', ['des œufs']).kind).toBe('exact');
  });

  it('un dossier secret ne compte que si la station est terminée', () => {
    let s = reducer(initialState(), { type: 'chooseGroup', group: '7-18' });
    s = reducer(s, { type: 'bonusCorrect', id: 'lafayette', index: 0 });
    expect(s.bonus.lafayette).toEqual([]);
    s = reducer(s, { type: 'completeStation', id: 'lafayette' });
    s = reducer(s, { type: 'bonusCorrect', id: 'lafayette', index: 2 });
    s = reducer(s, { type: 'bonusCorrect', id: 'lafayette', index: 2 });
    expect(s.bonus.lafayette).toEqual([2]);
  });
});

describe('Progression complète et écran final', () => {
  it('l’écran final est refusé tant que les cinq stations ne sont pas rallumées', () => {
    let s = reducer(initialState(), { type: 'chooseGroup', group: '7-15' });
    for (const id of STATION_IDS.slice(0, 4)) s = reducer(s, { type: 'completeStation', id });
    expect(reducer(s, { type: 'goto', screen: 'finale' }).screen).not.toBe('finale');
    s = reducer(s, { type: 'completeStation', id: 'saintpierre' });
    expect(reducer(s, { type: 'goto', screen: 'finale' }).screen).toBe('finale');
  });

  it('une sauvegarde qui pointe vers l’écran final sans les cinq stations revient à la carte', () => {
    const raw = { ...reducer(initialState(), { type: 'chooseGroup', group: '7-15' }), screen: 'finale' };
    expect(sanitizeState(raw)!.screen).toBe('map');
  });

  it('l’espace enseignant est accessible sans groupe', () => {
    expect(reducer(initialState(), { type: 'goto', screen: 'teacher' }).screen).toBe('teacher');
  });

  it('sauvegarde des missions 2 à 5 : valeurs invalides filtrées', () => {
    const base = reducer(initialState(), { type: 'chooseGroup', group: '7-15' });
    const raw = {
      ...base,
      m2: { phase: 'console', answers: { meteo: 'tornade', jour: 'samedi' } },
      m3: { phase: 'chat', node: 99 },
      m4: { phase: 'map', step: 2, at: 'lune' },
      m5: { phase: 'touch', seqs: { s1: ['venez', 'pirate'] }, solved: ['s1'], touch: 'x'.repeat(500) },
    };
    const s = sanitizeState(raw)!;
    expect(s.m2.answers).toEqual({ jour: 'samedi' });
    expect(s.m3.node).toBe(0);
    expect(s.m4.step).toBe(2);
    expect(s.m4.at).toBeNull();
    expect(s.m5.seqs.s1).toBeUndefined();
    expect(s.m5.phase).toBe('tiles'); // « touch » impossible : toutes les phrases ne sont pas résolues
    expect(s.m5.touch.length).toBeLessThanOrEqual(60);
  });
});

describe('Fichiers audio', () => {
  const manifest = JSON.parse(readFileSync('audio-manifest.json', 'utf8')) as { clips: { id: string; text: string }[] };
  const byId = new Map(manifest.clips.map((c) => [c.id, c.text]));

  it('chaque message référencé a son fichier MP3', () => {
    const files = [
      M2_TEXT.hostAudio,
      ...RADIO_MESSAGES.map((m) => m.audio),
      ...CHAT.map((n) => n.audio),
      M3_FINAL.theoAudio,
    ];
    for (const f of files) expect(existsSync(`public/audio/${f}`), f).toBe(true);
  });

  it('le texte prononcé est exactement la transcription affichée', () => {
    expect(byId.get('m2-hote')).toBe(M2_TEXT.hostHello.fr);
    for (const m of RADIO_MESSAGES) expect(byId.get(m.audio.replace('.mp3', ''))).toBe(m.transcript);
    for (const n of CHAT) expect(byId.get(n.audio.replace('.mp3', ''))).toBe(n.line.fr);
  });

  it('aucun chiffre dans les textes prononcés (la synthèse les lirait mal)', () => {
    for (const c of manifest.clips) expect(c.text, c.id).not.toMatch(/\d/);
  });

  it('les crédits audio sont présents', () => {
    expect(readFileSync('public/audio/CREDITS.txt', 'utf8')).toContain('CC BY-SA 4.0');
  });
});
