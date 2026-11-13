import { IconArrowRight, IconBackspace, IconBulb, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { FOODS, M5_REWARD, M5_TEXT, SENTENCES } from '../content/m5';
import { STATIONS } from '../content/stations';
import type { Bi as BiText } from '../content/types';
import { UI } from '../content/ui';
import { checkSentence, checkTouch, sentenceText } from '../engine/missions';
import { useGame } from '../state/context';
import { initialM5 } from '../state/game';
import { INK, PAL } from '../art/riso';
import { Bi, BtnLabel, Feedback, LiveRegion } from '../ui/kit';
import { MissionIntro, MissionShell, StationReward } from '../ui/missionKit';
import { play } from '../audio/sfx';

const END: Record<string, string> = { s1: '!', s2: '.', s3: '.' };

/** Texte de l'invitation finale, à partir de la progression (réutilisé par l'écran final). */
export function invitationLines(seqs: Record<string, string[]>, touch: string): string[] {
  const lines = SENTENCES.map((s) => sentenceText(s.id, seqs[s.id] ?? []) + (END[s.id] ?? '.'));
  const t = checkTouch(touch);
  if (t.kind === 'ok' || t.kind === 'okNote') lines.push(`${M5_TEXT.touchStarter} ${t.text}.`);
  return lines;
}

export function M5Lighthouse() {
  const { state, dispatch } = useGame();
  const { phase } = state.m5;
  const s = state.stats.saintpierre;
  if (phase === 'reward') {
    return (
      <MissionShell id="saintpierre" showBack={false}>
        <StationReward
          id="saintpierre"
          thanks={M5_REWARD.thanks}
          culture={M5_REWARD.culture}
          sharp={s.errors <= 2 && s.hints === 0}
          onReplay={() => dispatch({ type: 'm5', patch: { ...initialM5(), phase: 'tiles' } })}
          finalLabel={{ fr: 'Voir l’écran final', en: 'See the final screen' }}
          onFinal={() => {
            play('fragment');
            dispatch({ type: 'goto', screen: 'finale' });
          }}
        />
      </MissionShell>
    );
  }
  return (
    <MissionShell id="saintpierre">
      {phase === 'intro' && (
        <MissionIntro
          id="saintpierre"
          briefing={M5_TEXT.briefing}
          hello={M5_TEXT.keeperHello}
          cta={{ fr: 'Monter au phare', en: 'Climb the lighthouse' }}
          onStart={() => dispatch({ type: 'm5', patch: { phase: 'tiles' } })}
        />
      )}
      {phase === 'tiles' && <Tiles />}
      {phase === 'touch' && <Touch />}
    </MissionShell>
  );
}

function Keywords() {
  return (
    <aside className="sheet kw" aria-labelledby="kw-title">
      <h2 id="kw-title" className="kw__title">
        {M5_TEXT.keywordsTitle.fr}{' '}
        <span className="screen-title__en" lang="en">
          {M5_TEXT.keywordsTitle.en}
        </span>
      </h2>
      <ul className="kw__list">
        {STATIONS.slice(0, 4).map((s) => (
          <li key={s.id} className="kw__item">
            <span className="kw__num">{s.number}</span>
            <span>
              <span className="kw__label">{s.keyword.label.fr}</span>
              <strong lang="fr">{s.keyword.word}</strong>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Tiles() {
  const { state, dispatch } = useGame();
  const { seqs, solved } = state.m5;
  const firstOpen = SENTENCES.findIndex((s) => !solved.includes(s.id));
  const [idx, setIdx] = useState(firstOpen === -1 ? 0 : firstOpen);
  const sen = SENTENCES[idx]!;
  const seq = seqs[sen.id] ?? [];
  const isSolved = solved.includes(sen.id);
  const [fb, setFb] = useState<{ kind: 'ok' | 'retry' | 'hint'; title?: BiText; body?: BiText } | null>(null);
  const [hint, setHint] = useState(0);

  const go = (i: number) => {
    setIdx(i);
    setFb(null);
    setHint(0);
  };

  const tileOp = (op: 'add' | 'remove' | 'clear', tile?: string) => {
    dispatch({ type: 'm5Tile', sentence: sen.id, op, tile });
    setFb(null);
  };

  const check = () => {
    const v = checkSentence(sen.id, seq);
    if (v.kind === 'ok') {
      play('good');
      const nextSolved = [...new Set([...solved, sen.id])];
      dispatch({ type: 'm5', patch: { solved: nextSolved } });
      setFb({ kind: 'ok', title: M5_TEXT.sentenceOk });
    } else if (v.kind === 'incomplete') {
      play('hint');
      setFb({ kind: 'hint', body: M5_TEXT.sentenceIncomplete });
    } else {
      play('retry');
      dispatch({ type: 'stat', id: 'saintpierre', errors: 1 });
      setFb({ kind: 'retry', title: M5_TEXT.sentenceWrong, body: v.feedback });
    }
  };

  const askHint = () => {
    const level = Math.min(2, hint + 1);
    setHint(level);
    play('hint');
    dispatch({ type: 'stat', id: 'saintpierre', hints: 1 });
    setFb({ kind: 'hint', title: { fr: `Indice ${level} / 2`, en: `Hint ${level} / 2` }, body: sen.hint[level - 1] });
  };

  const allSolved = SENTENCES.every((s) => solved.includes(s.id));

  return (
    <section className="m5">
      <Bi t={M5_TEXT.tilesInstruction} force className="instruction" as="h1" />
      <div className="m5__grid">
        <div className="m5__side">
          <Keywords />
        </div>
        <div className="sheet builder">
          <div className="builder__tabs" role="tablist" aria-label="Phrases">
            {SENTENCES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === idx}
                className={`builder__tab ${i === idx ? 'is-on' : ''} ${solved.includes(s.id) ? 'is-done' : ''}`}
                onClick={() => go(i)}
              >
                {solved.includes(s.id) && <IconCheck size={16} stroke={3} aria-hidden="true" />}
                Phrase {i + 1}
              </button>
            ))}
          </div>
          <div role="tabpanel">
            <Bi t={sen.label} force className="builder__label" />
            <div className={`builder__line ${isSolved ? 'is-done' : ''}`} aria-label="Ta phrase" aria-live="polite">
              {seq.length === 0 && <span className="builder__placeholder">Clique sur les mots ci-dessous…</span>}
              {seq.map((id, i) => {
                const t = sen.tiles.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    type="button"
                    className="tile tile--placed"
                    lang="fr"
                    disabled={isSolved}
                    aria-label={`${t.text} (position ${i + 1}, cliquer pour enlever)`}
                    onClick={() => {
                      play('tap');
                      tileOp('remove', id);
                    }}
                  >
                    {t.text}
                  </button>
                );
              })}
              {seq.length > 0 && <span className="builder__end">{END[sen.id]}</span>}
            </div>
            {!isSolved && (
              <div className="builder__bank" aria-label="Mots disponibles">
                {sen.tiles
                  .filter((t) => !seq.includes(t.id))
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="tile"
                      lang="fr"
                      onClick={() => {
                        play('tap');
                        tileOp('add', t.id);
                      }}
                    >
                      {t.text}
                    </button>
                  ))}
              </div>
            )}
            <div className="builder__actions">
              {!isSolved ? (
                <>
                  <button type="button" className="btn btn--primary" onClick={check}>
                    <BtnLabel t={M5_TEXT.check} />
                  </button>
                  <button type="button" className="btn btn--secondary" onClick={() => tileOp('clear')}>
                    <IconBackspace size={18} aria-hidden="true" />
                    <BtnLabel t={M5_TEXT.clear} />
                  </button>
                  <button type="button" className="btn btn--secondary" onClick={askHint}>
                    <IconBulb size={18} aria-hidden="true" />
                    <BtnLabel t={UI.hint} />
                  </button>
                </>
              ) : allSolved ? (
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={() => {
                    play('unlock');
                    dispatch({ type: 'm5', patch: { phase: 'touch' } });
                  }}
                >
                  <BtnLabel t={{ fr: 'Dernière étape', en: 'Last step' }} />
                  <IconArrowRight size={22} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={() => go(SENTENCES.findIndex((s) => !solved.includes(s.id)))}
                >
                  <BtnLabel t={{ fr: 'Phrase suivante', en: 'Next sentence' }} />
                  <IconArrowRight size={22} aria-hidden="true" />
                </button>
              )}
            </div>
            <LiveRegion>{fb && <Feedback kind={fb.kind} title={fb.title} body={fb.body} />}</LiveRegion>
          </div>
        </div>
      </div>
    </section>
  );
}

function Touch() {
  const { state, dispatch } = useGame();
  const { seqs, touch } = state.m5;
  const [value, setValue] = useState(touch);
  const [fb, setFb] = useState<{ kind: 'ok' | 'retry' | 'hint'; title?: BiText; body?: BiText } | null>(null);
  const [ready, setReady] = useState(() => {
    const t = checkTouch(touch);
    return t.kind === 'ok' || t.kind === 'okNote';
  });
  const [beam, setBeam] = useState(false);

  const check = () => {
    const t = checkTouch(value);
    dispatch({ type: 'm5', patch: { touch: value } });
    switch (t.kind) {
      case 'empty':
        setFb({
          kind: 'hint',
          body: {
            fr: 'Écris un article et un nom de la banque de mots.',
            en: 'Write an article and a noun from the word bank.',
          },
        });
        setReady(false);
        break;
      case 'ok':
        play('good');
        setFb({
          kind: 'ok',
          title: { fr: 'Parfait!', en: 'Perfect!' },
          body: { fr: `J’apporte ${t.text}.`, en: `I’m bringing ${t.food.en}.` },
        });
        setReady(true);
        break;
      case 'okNote':
        play('good');
        setFb({ kind: 'ok', title: { fr: 'Correct!', en: 'Correct!' }, body: t.note });
        setReady(true);
        break;
      case 'accent':
        play('hint');
        setFb({
          kind: 'hint',
          title: { fr: 'Presque!', en: 'Almost!' },
          body: { fr: `Vérifie l’accent : « ${t.expected} ».`, en: `Check the accent: “${t.expected}”.` },
        });
        setReady(false);
        break;
      case 'article':
        play('retry');
        dispatch({ type: 'stat', id: 'saintpierre', errors: 1 });
        setFb({ kind: 'retry', title: { fr: 'Attention à l’article', en: 'Watch the article' }, body: t.feedback });
        setReady(false);
        break;
      case 'unknown':
        play('retry');
        setFb({
          kind: 'retry',
          body: {
            fr: 'Choisis un nom dans la banque de mots, avec son article.',
            en: 'Choose a noun from the word bank, with its article.',
          },
        });
        setReady(false);
        break;
    }
  };

  const transmit = () => {
    setBeam(true);
    play('fragment');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(
      () => {
        dispatch({ type: 'completeStation', id: 'saintpierre' });
        dispatch({ type: 'm5', patch: { phase: 'reward' } });
      },
      reduce ? 200 : 1800,
    );
  };

  const lines = invitationLines(seqs, ready ? value : '');

  return (
    <section className="m5">
      <Bi t={M5_TEXT.touchInstruction} force className="instruction" as="h1" />
      <div className="m5__grid">
        <div className="m5__side">
          <div className="sheet bank">
            <p className="tag">
              Banque de mots · <span lang="en">Word bank</span>
            </p>
            <ul className="bank__list">
              {FOODS.map((f) => (
                <li key={f.noun}>
                  <span lang="fr">{f.noun}</span>{' '}
                  <small>
                    ({f.plural ? 'pl.' : f.gender === 'm' ? 'm.' : 'f.'}) · <span lang="en">{f.en}</span>
                  </small>
                </li>
              ))}
            </ul>
            <Bi t={M5_TEXT.articleHelp} force className="bank__help" />
          </div>
        </div>
        <div className="m5__main">
          <form
            className="sheet touch"
            onSubmit={(e) => {
              e.preventDefault();
              check();
            }}
          >
            <label htmlFor="touch" className="touch__label">
              <span lang="fr">{M5_TEXT.touchStarter}</span>
            </label>
            <input
              id="touch"
              className="field field--lg"
              lang="fr"
              autoComplete="off"
              spellCheck={false}
              maxLength={60}
              placeholder={M5_TEXT.touchPlaceholder}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setReady(false);
              }}
            />
            <button type="submit" className="btn btn--primary">
              <BtnLabel t={M5_TEXT.check} />
            </button>
          </form>
          <LiveRegion>{fb && <Feedback kind={fb.kind} title={fb.title} body={fb.body} />}</LiveRegion>

          <div className={`invite ${beam ? 'invite--sent' : ''}`}>
            <Lighthouse on={beam} />
            <div className="invite__card">
              <p className="tag">
                L’invitation · <span lang="en">The invitation</span>
              </p>
              {lines.map((l, i) => (
                <p key={i} className="invite__line" lang="fr">
                  {l}
                </p>
              ))}
              {!ready && <p className="invite__todo">+ J’apporte…?</p>}
            </div>
          </div>
          {ready && !beam && (
            <button type="button" className="btn btn--primary btn--lg" onClick={transmit}>
              <BtnLabel t={M5_TEXT.transmit} />
              <IconArrowRight size={22} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Lighthouse({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 120 160" width="120" height="160" className="lighthouse" aria-hidden="true" focusable="false">
      {on && <path className="lighthouse__beam" d="M60 34 L160 0 L160 70 Z" fill={PAL.lemon} opacity="0.75" />}
      <path d="M44 150 L50 50 L70 50 L76 150 Z" fill="#fffdf8" stroke={INK} strokeWidth="3" />
      <path d="M47 110 L73 110 L74 125 L46 125 Z M48.5 80 L71.5 80 L72.5 95 L47.5 95 Z" fill={PAL.tomato} />
      <rect x="46" y="34" width="28" height="16" fill={on ? PAL.lemon : '#cdbb9c'} stroke={INK} strokeWidth="3" />
      <path d="M42 34 L60 18 L78 34 Z" fill={PAL.tomato} stroke={INK} strokeWidth="3" />
      <path d="M20 150 L100 150" stroke={INK} strokeWidth="3" />
    </svg>
  );
}
