import { IconArrowRight, IconBulb, IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';
import {
  COUNT_MAX,
  COUNT_ROWS,
  M1_REWARD,
  M1_TEXT,
  MARKET_ITEMS,
  SHELF_NAMES,
  SHOPPING_LIST,
  type CountRow,
  type MarketItemId,
} from '../content/m1';
import { stationById } from '../content/stations';
import type { Bi as BiText } from '../content/types';
import { UI } from '../content/ui';
import { allFound, checkCounts, evaluatePick, nextTarget, type RowVerdict } from '../engine/m1';
import { useGame } from '../state/context';
import { initialM1 } from '../state/game';
import { MarketItemArt } from '../art/marketItems';
import { Awning } from '../art/characters';
import { Bi, BtnLabel, Feedback, LiveRegion, Speaker, Stepper, type FeedbackKind } from '../ui/kit';
import { StationReward } from '../ui/missionKit';
import { play } from '../audio/sfx';

type Fb = { kind: FeedbackKind; title?: BiText; body?: BiText; extra?: BiText } | null;

const itemById = (id: MarketItemId) => MARKET_ITEMS.find((i) => i.id === id)!;
const STATION = stationById('lafayette');

export function M1Market() {
  const { state, dispatch } = useGame();
  const { phase } = state.m1;

  return (
    <main className="screen mission enter" id="main">
      <p className="tag">
        Station 1 · {STATION.city}, {STATION.region.fr}
      </p>
      {phase === 'intro' && <Intro />}
      {phase === 'find' && <FindPhase />}
      {phase === 'count' && <CountPhase />}
      {phase === 'reward' && (
        <StationReward
          id="lafayette"
          thanks={M1_REWARD.claireThanks}
          culture={M1_REWARD.culture}
          sharp={state.stats.lafayette.errors <= 2 && state.stats.lafayette.hints === 0}
          onReplay={() => dispatch({ type: 'm1', patch: { ...initialM1(), phase: 'find' } })}
        />
      )}
      {phase !== 'reward' && (
        <div className="mission__footer">
          <button type="button" className="btn btn--quiet" onClick={() => dispatch({ type: 'leaveStation' })}>
            <BtnLabel t={UI.toMap} />
          </button>
        </div>
      )}
    </main>
  );
}

/* ------------------------------ Introduction ------------------------------ */

function Intro() {
  const { dispatch } = useGame();
  return (
    <section className="mission__intro">
      <h1 className="screen-title">
        {STATION.missionTitle.fr}{' '}
        <span className="screen-title__en" lang="en">
          {STATION.missionTitle.en}
        </span>
      </h1>
      <Speaker who="lumi" name="Lumi · QG" t={M1_TEXT.briefing} force />
      <Speaker who="claire" name="Claire · Radio Bayou" t={M1_TEXT.claireHello} force />
      <div className="mission__cta">
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => {
            play('unlock');
            dispatch({ type: 'm1', patch: { phase: 'find' } });
          }}
        >
          <BtnLabel t={{ fr: 'Aller au marché', en: 'Go to the market' }} />
          <IconArrowRight size={22} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/* --------------------------- Phase A : la fouille --------------------------- */

function FindPhase() {
  const { state, dispatch } = useGame();
  const found = state.m1.found;
  const [fb, setFb] = useState<Fb>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [shake, setShake] = useState<MarketItemId | null>(null);
  const [justFound, setJustFound] = useState<MarketItemId | null>(null);
  const target = nextTarget(found);
  const done = allFound(found);
  const targetItem = target ? itemById(target) : null;

  const pick = (id: MarketItemId) => {
    if (done) return;
    const r = evaluatePick(id, found);
    if (r.kind === 'found') {
      const item = itemById(id);
      play('good');
      const nextFound = [...found, id];
      dispatch({ type: 'm1', patch: { found: nextFound } });
      setJustFound(id);
      setWrongStreak(0);
      if (id === target) setHintLevel(0);
      setFb(
        allFound(nextFound)
          ? { kind: 'ok', title: M1_TEXT.allFound, body: { fr: `${item.fr} ✓`, en: item.en } }
          : { kind: 'ok', title: M1_TEXT.found, body: { fr: item.fr, en: item.en } },
      );
    } else if (r.kind === 'already') {
      play('tap');
      setFb({ kind: 'hint', body: M1_TEXT.alreadyFound });
    } else {
      play('retry');
      dispatch({ type: 'stat', id: 'lafayette', errors: 1 });
      const streak = wrongStreak + 1;
      setWrongStreak(streak);
      setShake(id);
      window.setTimeout(() => setShake(null), 400);
      setFb({ kind: 'retry', body: r.feedback, extra: streak >= 3 ? M1_TEXT.readFirst : undefined });
    }
  };

  const hint = () => {
    if (!targetItem) return;
    const level = Math.min(3, hintLevel + 1);
    setHintLevel(level);
    play('hint');
    dispatch({ type: 'stat', id: 'lafayette', hints: 1 });
    const shelf = SHELF_NAMES[targetItem.shelf]!;
    const msgs: Record<number, BiText> = {
      1: {
        fr: 'Astuce : certains mots ressemblent à l’anglais. Par exemple, « céleri » ressemble à « celery ».',
        en: 'Tip: some words look like English. For example, “céleri” looks like “celery”.',
      },
      2: {
        fr: `Cherche « ${targetItem.fr} » sur ${shelf.fr}.`,
        en: `Look for “${targetItem.fr}” on ${shelf.en}.`,
      },
      3: {
        fr: `« ${targetItem.fr} » = ${targetItem.en}. Il clignote au marché. Clique dessus!`,
        en: `“${targetItem.fr}” = ${targetItem.en}. It’s flashing at the market. Click it!`,
      },
    };
    setFb({ kind: 'hint', title: { fr: `Indice ${level} / 3`, en: `Hint ${level} / 3` }, body: msgs[level] });
  };

  return (
    <section className="m1-find">
      <div className="m1-find__instr">
        <Bi t={M1_TEXT.findInstruction} force className="instruction" as="h1" />
      </div>
      <div className="m1-find__grid">
        <div className="m1-find__side">
          <div className="sheet sheet--note m1-list" aria-labelledby="list-title">
            <p className="m1-list__from">Claire ✎</p>
            <h2 id="list-title" className="m1-list__title">
              {M1_TEXT.listTitle.fr}
            </h2>
            <ul className="m1-list__items" aria-label="Liste de Claire">
              {SHOPPING_LIST.map((id) => {
                const got = found.includes(id);
                return (
                  <li key={id} className={`m1-list__item ${got ? 'is-got' : ''} ${id === justFound ? 'is-new' : ''}`}>
                    <span className="m1-list__box" aria-hidden="true">
                      {got && <IconCheck size={18} stroke={3} />}
                    </span>
                    <span lang="fr">{itemById(id).fr}</span>
                    <span className="sr-only">{got ? ' : trouvé' : ' : à trouver'}</span>
                  </li>
                );
              })}
            </ul>
            <div className="m1-list__foot">
              {!done ? (
                <button type="button" className="btn btn--secondary" onClick={hint}>
                  <IconBulb size={20} aria-hidden="true" />
                  <BtnLabel t={UI.hint} />
                </button>
              ) : (
                <span />
              )}
              <p className="m1-list__count" aria-label={`${found.length} sur ${SHOPPING_LIST.length} trouvés`}>
                {found.length} / {SHOPPING_LIST.length}
              </p>
            </div>
          </div>
          <LiveRegion>
            {fb && (
              <Feedback kind={fb.kind} title={fb.title} body={fb.body}>
                {fb.extra && <Bi t={fb.extra} force />}
              </Feedback>
            )}
          </LiveRegion>
          {done && (
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => {
                play('unlock');
                dispatch({ type: 'm1', patch: { phase: 'count' } });
              }}
            >
              <BtnLabel t={UI.continue} />
              <IconArrowRight size={22} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="stall" aria-label="Le marché">
          <Awning />
          <div className="stall__body">
            {[0, 1, 2].map((shelf) => (
              <div
                key={shelf}
                className={`stall__shelf ${hintLevel === 2 && targetItem?.shelf === shelf ? 'stall__shelf--hint' : ''}`}
                role="group"
                aria-label={SHELF_NAMES[shelf]!.fr}
              >
                {MARKET_ITEMS.filter((i) => i.shelf === shelf).map((item) => {
                  const got = found.includes(item.id);
                  const flashing = hintLevel === 3 && item.id === target;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`produce ${got ? 'produce--got' : ''} ${shake === item.id ? 'produce--shake' : ''} ${flashing ? 'produce--flash' : ''}`}
                      onClick={() => pick(item.id)}
                      aria-label={`Produit : ${item.fr}`}
                    >
                      <MarketItemArt id={item.id} />
                      {got && (
                        <span className="produce__stamp" aria-hidden="true">
                          <IconCheck size={20} stroke={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Phase B : les quantités --------------------------- */

function CountPhase() {
  const { state, dispatch } = useGame();
  const counts = state.m1.counts;
  const [verdicts, setVerdicts] = useState<Partial<Record<CountRow['id'], RowVerdict>>>({});
  const [fails, setFails] = useState<Partial<Record<CountRow['id'], number>>>({});
  const [fb, setFb] = useState<Fb>(null);
  const [hintLevel, setHintLevel] = useState(0);

  const step = (id: CountRow['id'], delta: number) => {
    dispatch({ type: 'm1Count', id, delta });
    setVerdicts((p) => ({ ...p, [id]: undefined }));
  };

  const check = () => {
    const r = checkCounts(counts);
    setVerdicts(r.rows);
    if (r.allOk) {
      play('fragment');
      setFb({ kind: 'ok', title: M1_TEXT.countAllOk });
      window.setTimeout(() => {
        dispatch({ type: 'completeStation', id: 'lafayette' });
        dispatch({ type: 'm1', patch: { phase: 'reward' } });
      }, 900);
    } else {
      play('retry');
      const wrongRows = COUNT_ROWS.filter((row) => r.rows[row.id] !== 'ok').length;
      dispatch({ type: 'stat', id: 'lafayette', errors: wrongRows });
      setFails((p) => {
        const n = { ...p };
        for (const row of COUNT_ROWS) if (r.rows[row.id] !== 'ok') n[row.id] = (n[row.id] ?? 0) + 1;
        return n;
      });
      setFb({ kind: 'retry', body: M1_TEXT.countSomeWrong });
    }
  };

  const hint = () => {
    const level = Math.min(3, hintLevel + 1);
    setHintLevel(level);
    play('hint');
    dispatch({ type: 'stat', id: 'lafayette', hints: 1 });
    const msgs: Record<number, BiText> = {
      1: {
        fr: 'Lis chaque ligne. Le nombre est écrit en lettres : « trois » = 3. Le carnet a les nombres de 1 à 10.',
        en: 'Read each line. The number is written in words: “trois” = 3. The word book has the numbers 1 to 10.',
      },
      2: {
        fr: 'Lis bien le P.-S. Claire a déjà quelque chose à la maison.',
        en: 'Read the P.S. carefully. Claire already has something at home.',
      },
      3: {
        fr: 'Il faut quatre oignons. Claire en a déjà deux. Alors, achète deux oignons (4 − 2 = 2).',
        en: 'She needs four onions. Claire already has two. So buy two onions (4 − 2 = 2).',
      },
    };
    setFb({ kind: 'hint', title: { fr: `Indice ${level} / 3`, en: `Hint ${level} / 3` }, body: msgs[level] });
  };

  const rowMessage = (row: CountRow, v: RowVerdict | undefined): BiText | null => {
    if (!v || v === 'ok') return null;
    const n = fails[row.id] ?? 0;
    if (v === 'ps-trap') {
      return n >= 2
        ? { fr: '« quatre » = 4, mais Claire en a déjà deux.', en: '“quatre” = 4, but Claire already has two.' }
        : { fr: 'Relis le P.-S.!', en: 'Reread the P.S.!' };
    }
    if (n >= 2) {
      if (row.id === 'oignons') {
        return { fr: '« quatre » = 4, mais Claire en a déjà deux.', en: '“quatre” = 4, but Claire already has two.' };
      }
      return { fr: `« ${row.numberWord} » = ${row.numberValue}`, en: `“${row.numberWord}” = ${row.numberValue}` };
    }
    return { fr: 'Vérifie ce nombre dans le message.', en: 'Check this number in the message.' };
  };

  return (
    <section className="m1-count">
      <Speaker who="claire" name="Claire · Radio Bayou" t={M1_TEXT.countIntro} force compact />
      <Bi t={M1_TEXT.countInstruction} force className="instruction" as="h1" />
      <div className="m1-count__grid">
        <div className="sheet sheet--note m1-note">
          <p className="m1-list__from">Claire ✎</p>
          <p className="m1-note__title" lang="fr">
            {M1_TEXT.noteTitle.fr}
          </p>
          <ul className="m1-note__lines" lang="fr">
            {COUNT_ROWS.map((r) => (
              <li key={r.id}>{r.noteLine}</li>
            ))}
          </ul>
          <p className="m1-note__ps" lang="fr">
            {M1_TEXT.notePs.fr}
          </p>
        </div>

        <div className="sheet m1-basket">
          <h2 className="m1-basket__title">
            Le panier{' '}
            <span className="screen-title__en" lang="en">
              The basket
            </span>
          </h2>
          <ul className="m1-basket__rows">
            {COUNT_ROWS.map((row) => {
              const v = verdicts[row.id];
              const msg = rowMessage(row, v);
              return (
                <li key={row.id} className={`m1-row ${v === 'ok' ? 'm1-row--ok' : v ? 'm1-row--retry' : ''}`}>
                  <Stepper
                    value={counts[row.id]}
                    max={COUNT_MAX}
                    label={row.label.fr}
                    onStep={(d) => step(row.id, d)}
                  />
                  <div className="m1-row__label">
                    <Bi t={row.label} className="bi--inline" />
                    {msg && <Bi t={msg} force className="m1-row__msg" />}
                  </div>
                  {v && (
                    <span className={`verdict verdict--${v === 'ok' ? 'ok' : 'retry'}`}>
                      {v === 'ok' ? (
                        <IconCheck size={16} stroke={3} aria-hidden="true" />
                      ) : (
                        <IconAlertTriangle size={16} stroke={2.6} aria-hidden="true" />
                      )}
                      {v === 'ok' ? 'OK' : 'À revoir'}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="m1-basket__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={check}>
              <BtnLabel t={M1_TEXT.check} />
            </button>
            <button type="button" className="btn btn--secondary" onClick={hint}>
              <IconBulb size={20} aria-hidden="true" />
              <BtnLabel t={UI.hint} />
            </button>
          </div>
          <LiveRegion>{fb && <Feedback kind={fb.kind} title={fb.title} body={fb.body} />}</LiveRegion>
        </div>
      </div>
    </section>
  );
}
