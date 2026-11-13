import { IconCheck, IconMicrophone2, IconRosetteDiscountCheck } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { BONUS } from '../content/bonus';
import { FINALE } from '../content/finale';
import { STATIONS } from '../content/stations';
import { STATION_IDS } from '../content/types';
import { UI } from '../content/ui';
import { completionCode } from '../engine/code';
import { useGame } from '../state/context';
import { NetworkMap } from '../art/MapArt';
import { invitationLines } from '../missions/M5Lighthouse';
import { Bi, BtnLabel } from '../ui/kit';

export function Finale() {
  const { state, dispatch } = useGame();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  const now = new Date();
  const code = state.group ? completionCode(state.group, now) : '—';
  const dateFr = now.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const bonusTotal = STATION_IDS.reduce((n, id) => n + BONUS[id].length, 0);
  const bonusDone = STATION_IDS.reduce((n, id) => n + state.bonus[id].length, 0);
  const lines = invitationLines(state.m5.seqs, state.m5.touch);

  return (
    <main className="screen finale enter" id="main">
      <div className="finale__hero">
        <h1 ref={headingRef} tabIndex={-1} className="finale__title">
          {FINALE.title}
        </h1>
        <Bi t={FINALE.subtitle} force className="finale__sub" />
      </div>

      <div className="finale__grid">
        <section className="sheet finale__proof" aria-labelledby="proof-title">
          <h2 id="proof-title" className="finale__h2">
            {FINALE.codeLabel.fr}{' '}
            <span className="screen-title__en" lang="en">
              {FINALE.codeLabel.en}
            </span>
          </h2>
          <p className="finale__code" aria-label={`Code : ${code.split('').join(' ')}`}>
            {code}
          </p>
          <p className="finale__meta">
            Groupe {state.group} · <span>{dateFr}</span>
          </p>
          <Bi t={FINALE.codeNote} force className="finale__note" />
          <p className="finale__show">
            <IconRosetteDiscountCheck size={22} aria-hidden="true" />
            <Bi t={FINALE.showTeacher} force />
          </p>
        </section>

        <section className="sheet finale__map" aria-label="Carte du réseau rétabli">
          <NetworkMap stations={STATIONS} status={state.status} onPick={() => undefined} selected={null} />
        </section>

        <section className="finale__keys" aria-labelledby="keys-title">
          <h2 id="keys-title" className="finale__h2">
            Les cinq mots-clés{' '}
            <span className="screen-title__en" lang="en">
              The five keywords
            </span>
          </h2>
          <ol className="finale__keylist">
            {STATIONS.map((s, i) => (
              <li key={s.id} className="minikey" style={{ animationDelay: `${i * 120}ms` }}>
                <span className="minikey__num">{s.number}</span>
                <span className="minikey__label">{s.keyword.label.fr}</span>
                <strong lang="fr">{s.keyword.word}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className="sheet finale__invite" aria-labelledby="inv-title">
          <h2 id="inv-title" className="finale__h2">
            {FINALE.invitationTitle.fr}{' '}
            <span className="screen-title__en" lang="en">
              {FINALE.invitationTitle.en}
            </span>
          </h2>
          {lines.map((l, i) => (
            <p key={i} className="invite__line" lang="fr">
              {l}
            </p>
          ))}
          <div className="finale__oral">
            <p className="finale__oraltitle">
              <IconMicrophone2 size={20} aria-hidden="true" /> {FINALE.oralTitle.fr}
            </p>
            <Bi t={FINALE.oralTask} force />
          </div>
        </section>

        <section className="sheet finale__skills" aria-labelledby="skills-title">
          <h2 id="skills-title" className="finale__h2">
            {FINALE.skillsTitle.fr}{' '}
            <span className="screen-title__en" lang="en">
              {FINALE.skillsTitle.en}
            </span>
          </h2>
          <ul className="skills">
            {STATIONS.map((s) => (
              <li key={s.id}>
                <IconCheck size={18} stroke={3} aria-hidden="true" />
                <span>
                  <strong>{s.skill.fr}</strong> — {s.city}
                  {s.id === 'portauprince' && state.stats.portauprince.usedTranscript && (
                    <em className="skills__adapted"> ({FINALE.adapted.fr})</em>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="badge">
            <span className="badge__seal" aria-hidden="true">
              ★
            </span>
            <span>
              <strong>{FINALE.badge.fr}</strong> · {FINALE.bonusLine.fr} : {bonusDone} / {bonusTotal}
            </span>
          </p>
        </section>
      </div>

      <div className="finale__actions">
        <button type="button" className="btn btn--secondary" onClick={() => dispatch({ type: 'goto', screen: 'map' })}>
          <BtnLabel t={{ fr: 'Faire les dossiers secrets', en: 'Do the secret files' }} />
        </button>
        <button type="button" className="btn btn--quiet" onClick={() => dispatch({ type: 'goto', screen: 'home' })}>
          <BtnLabel t={{ fr: 'Accueil', en: 'Home' }} />
        </button>
        <span className="sr-only">{UI.close.fr}</span>
      </div>
    </main>
  );
}
