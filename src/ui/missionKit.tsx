import { IconArrowRight, IconCheck, IconLock, IconRotate } from '@tabler/icons-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BONUS, type BonusItem } from '../content/bonus';
import { stationById } from '../content/stations';
import type { Bi as BiText, StationId } from '../content/types';
import { UI } from '../content/ui';
import { compareAnswer } from '../engine/normalize';
import { useGame } from '../state/context';
import type { CharacterId } from '../art/characters';
import { Bi, BtnLabel, Feedback, LiveRegion, Speaker } from './kit';
import { play } from '../audio/sfx';

export const CONTACTS: Record<StationId, { who: CharacterId; name: string }> = {
  lafayette: { who: 'claire', name: 'Claire · Radio Bayou' },
  portauprince: { who: 'jeanrobert', name: 'Jean-Robert · Radio Écho Haïti' },
  fortdefrance: { who: 'theo', name: 'Théo · Café Madinina' },
  cayenne: { who: 'ines', name: 'Inès · Cayenne' },
  saintpierre: { who: 'helene', name: 'Hélène · gardienne du phare' },
};

/** Cadre commun d'une mission : étiquette du lieu et retour à la carte. */
export function MissionShell({
  id,
  children,
  showBack = true,
}: {
  id: StationId;
  children: ReactNode;
  showBack?: boolean;
}) {
  const { dispatch } = useGame();
  const s = stationById(id);
  return (
    <main className={`screen mission mission--${id} enter`} id="main">
      <p className="tag">
        Station {s.number} · {s.city}, {s.region.fr}
      </p>
      {children}
      {showBack && (
        <div className="mission__footer">
          <button type="button" className="btn btn--quiet" onClick={() => dispatch({ type: 'leaveStation' })}>
            <BtnLabel t={UI.toMap} />
          </button>
        </div>
      )}
    </main>
  );
}

/** Écran d'arrivée : Lumi présente la station, le contact salue, un bouton lance la mission. */
export function MissionIntro({
  id,
  briefing,
  hello,
  helloAudio,
  cta,
  onStart,
  extra,
}: {
  id: StationId;
  briefing: BiText;
  hello: BiText;
  helloAudio?: ReactNode;
  cta: BiText;
  onStart: () => void;
  extra?: ReactNode;
}) {
  const s = stationById(id);
  const c = CONTACTS[id];
  return (
    <section className="mission__intro intro2">
      <h1 className="screen-title intro2__title">
        {s.missionTitle.fr}{' '}
        <span className="screen-title__en" lang="en">
          {s.missionTitle.en}
        </span>
      </h1>
      <div className="intro2__talk">
        <Speaker who="lumi" name="Lumi · QG" t={briefing} force compact />
        <Speaker who={c.who} name={c.name} t={hello} force />
        {helloAudio}
      </div>
      <aside className="intro2__side">
        {extra}
        <button
          type="button"
          className="btn btn--primary btn--lg intro2__cta"
          onClick={() => {
            play('unlock');
            onStart();
          }}
        >
          <BtnLabel t={cta} />
          <IconArrowRight size={22} aria-hidden="true" />
        </button>
      </aside>
    </section>
  );
}

/** Récompense commune : carte du mot-clé, remerciement, faits culturels, dossier secret. */
export function StationReward({
  id,
  thanks,
  culture,
  sharp,
  onReplay,
  finalLabel,
  onFinal,
}: {
  id: StationId;
  thanks: BiText;
  culture: readonly BiText[];
  sharp: boolean;
  onReplay: () => void;
  finalLabel?: BiText;
  onFinal?: () => void;
}) {
  const { dispatch } = useGame();
  const s = stationById(id);
  const c = CONTACTS[id];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [bonusOpen, setBonusOpen] = useState(false);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section className="reward">
      <h1 ref={headingRef} tabIndex={-1} className="screen-title reward__title">
        Station {s.number} rallumée!{' '}
        <span className="screen-title__en" lang="en">
          Station {s.number} is back on!
        </span>
      </h1>
      <div className="reward__grid">
        <div className="keycard" role="group" aria-label={`Mot-clé ${s.number}`}>
          <p className="tag">
            Mot-clé {s.number} · <span lang="en">Keyword {s.number}</span>
          </p>
          <Bi t={s.keyword.label} force className="keycard__label" />
          <p className={`keycard__word ${s.keyword.word.length > 9 ? 'keycard__word--long' : ''}`} lang="fr">
            {s.keyword.word}
          </p>
          <span className="keycard__stamp" aria-hidden="true">
            {s.city}
          </span>
        </div>
        <div className="reward__side">
          <Speaker who={c.who} name={c.name} t={thanks} />
          <div className="sheet culture">
            <h2 className="culture__title">
              Le savais-tu?{' '}
              <span className="screen-title__en" lang="en">
                Did you know?
              </span>
            </h2>
            <ul className="culture__list">
              {culture.map((t, i) => (
                <li key={i}>
                  <Bi t={t} />
                </li>
              ))}
            </ul>
          </div>
          {sharp && (
            <p className="badge">
              <span className="badge__seal" aria-hidden="true">
                ★
              </span>
              <span>
                <strong>Œil de lynx</strong> — <span lang="en">Eagle eye: almost no mistakes, no hints!</span>
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="reward__actions">
        {onFinal && finalLabel ? (
          <button type="button" className="btn btn--primary btn--lg" onClick={onFinal}>
            <BtnLabel t={finalLabel} />
            <IconArrowRight size={22} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={() => {
              play('unlock');
              dispatch({ type: 'leaveStation' });
            }}
          >
            <BtnLabel t={UI.toMap} />
            <IconArrowRight size={22} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setBonusOpen(!bonusOpen)}
          aria-expanded={bonusOpen}
        >
          <IconLock size={18} aria-hidden="true" />
          <BtnLabel t={{ fr: 'Dossier secret (bonus)', en: 'Secret file (bonus)' }} />
        </button>
        <button type="button" className="btn btn--quiet" onClick={onReplay}>
          <IconRotate size={18} aria-hidden="true" />
          <BtnLabel t={{ fr: 'Rejouer la mission', en: 'Play the mission again' }} />
        </button>
      </div>
      {bonusOpen && (
        <div ref={(el) => el?.scrollIntoView({ block: 'start', behavior: 'smooth' })}>
          <BonusQuiz id={id} />
        </div>
      )}
    </section>
  );
}

/* ------------------------------ Dossier secret ------------------------------ */

export function BonusQuiz({ id }: { id: StationId }) {
  const { state } = useGame();
  const items = BONUS[id];
  const done = state.bonus[id];
  return (
    <section className="sheet bonus" aria-labelledby={`bonus-${id}`}>
      <h2 id={`bonus-${id}`} className="bonus__title">
        Dossier secret{' '}
        <span className="screen-title__en" lang="en">
          Secret file
        </span>
      </h2>
      <Bi
        t={{
          fr: 'Défis facultatifs, plus difficiles. Ils ne changent pas ta progression.',
          en: 'Optional, harder challenges. They don’t change your progress.',
        }}
        force
        className="bonus__intro"
      />
      <p className="bonus__score">
        {done.length} / {items.length} réussis
      </p>
      <ol className="bonus__list">
        {items.map((item, i) => (
          <li key={i}>
            <BonusQuestion id={id} index={i} item={item} solved={done.includes(i)} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function BonusQuestion({
  id,
  index,
  item,
  solved,
}: {
  id: StationId;
  index: number;
  item: BonusItem;
  solved: boolean;
}) {
  const { dispatch } = useGame();
  const [value, setValue] = useState('');
  const [fb, setFb] = useState<{ kind: 'ok' | 'retry' | 'hint'; body: BiText } | null>(null);
  const inputId = `bonus-${id}-${index}`;

  const win = () => {
    play('good');
    dispatch({ type: 'bonusCorrect', id, index });
    setFb({ kind: 'ok', body: item.explain });
  };

  return (
    <div className="bonus__q">
      <Bi t={item.prompt} force className="bonus__prompt" />
      {item.kind === 'choice' ? (
        <div className="bonus__choices" role="group" aria-label="Choix">
          {item.options.map((o) => (
            <button
              key={o}
              type="button"
              className="btn btn--secondary"
              lang="fr"
              onClick={() => {
                if (o === item.answer) win();
                else {
                  play('retry');
                  setFb({
                    kind: 'retry',
                    body: { fr: 'Pas tout à fait. Essaie encore!', en: 'Not quite. Try again!' },
                  });
                }
              }}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="bonus__form"
          onSubmit={(e) => {
            e.preventDefault();
            const v = compareAnswer(value, item.accepted);
            if (v.kind === 'exact') win();
            else if (v.kind === 'empty')
              setFb({ kind: 'hint', body: { fr: 'Écris ta réponse d’abord.', en: 'Write your answer first.' } });
            else if (v.kind === 'accent') {
              play('hint');
              setFb({
                kind: 'hint',
                body: {
                  fr: `Presque! Vérifie les accents : « ${v.matched} ».`,
                  en: `Almost! Check the accents: “${v.matched}”.`,
                },
              });
            } else {
              play('retry');
              setFb({
                kind: 'retry',
                body: { fr: 'Pas encore. Relis la question.', en: 'Not yet. Reread the question.' },
              });
            }
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            Ta réponse
          </label>
          <input
            id={inputId}
            className="field"
            lang="fr"
            autoComplete="off"
            spellCheck={false}
            placeholder={item.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="btn btn--secondary">
            Vérifier
          </button>
        </form>
      )}
      {solved && !fb && (
        <p className="bonus__solved">
          <IconCheck size={16} aria-hidden="true" /> Réussi
        </p>
      )}
      <LiveRegion>{fb && <Feedback kind={fb.kind} body={fb.body} />}</LiveRegion>
    </div>
  );
}
