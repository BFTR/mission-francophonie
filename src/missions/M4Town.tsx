import {
  IconAnchor,
  IconBasket,
  IconBook,
  IconBuildingBank,
  IconBulb,
  IconBus,
  IconCoffee,
  IconMapPin,
  IconMessage2,
  IconNote,
  IconSchool,
  IconTree,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';
import { M4_REWARD, M4_TEXT, PLACES, STEPS, type PlaceId } from '../content/m4';
import type { Bi as BiText } from '../content/types';
import { UI } from '../content/ui';
import { evaluateVisit } from '../engine/missions';
import { useGame } from '../state/context';
import { initialM4 } from '../state/game';
import { INK, PAL } from '../art/riso';
import { Bi, BtnLabel, Feedback, LiveRegion, RevealBi } from '../ui/kit';
import { MissionIntro, MissionShell, StationReward } from '../ui/missionKit';
import { play } from '../audio/sfx';

const ICON: Record<PlaceId, typeof IconBook> = {
  bibliotheque: IconBook,
  musee: IconBuildingBank,
  'cafe-musee': IconCoffee,
  'cafe-gare': IconCoffee,
  gare: IconBus,
  marche: IconBasket,
  place: IconTree,
  ecole: IconSchool,
  port: IconAnchor,
};

/** Libellé court affiché sur le plan (le nom complet est dans la description). */
const SHORT: Record<PlaceId, string> = {
  bibliotheque: 'la bibliothèque',
  musee: 'le musée',
  'cafe-musee': 'le café',
  'cafe-gare': 'le café',
  gare: 'la gare routière',
  marche: 'le marché',
  place: 'la place des Palmistes',
  ecole: 'l’école',
  port: 'le port',
};

export function M4Town() {
  const { state, dispatch } = useGame();
  const { phase } = state.m4;
  const s = state.stats.cayenne;
  if (phase === 'reward') {
    return (
      <MissionShell id="cayenne" showBack={false}>
        <StationReward
          id="cayenne"
          thanks={M4_REWARD.thanks}
          culture={M4_REWARD.culture}
          sharp={s.errors <= 1 && s.hints === 0}
          onReplay={() => dispatch({ type: 'm4', patch: { ...initialM4(), phase: 'map' } })}
        />
      </MissionShell>
    );
  }
  return (
    <MissionShell id="cayenne">
      {phase === 'intro' ? (
        <MissionIntro
          id="cayenne"
          briefing={M4_TEXT.briefing}
          hello={{
            fr: 'Salut! C’est Inès. Je suis très occupée aujourd’hui. Je t’envoie des messages pour me trouver!',
            en: 'Hi! It’s Inès. I’m very busy today. I’ll send you messages so you can find me!',
          }}
          cta={{ fr: 'Ouvrir le plan de Cayenne', en: 'Open the map of Cayenne' }}
          onStart={() => dispatch({ type: 'm4', patch: { phase: 'map' } })}
        />
      ) : (
        <Town />
      )}
    </MissionShell>
  );
}

function Town() {
  const { state, dispatch } = useGame();
  const { step, at } = state.m4;
  const cur = STEPS[step]!;
  const [fb, setFb] = useState<{ kind: 'ok' | 'retry' | 'hint'; title?: BiText; body: BiText; extra?: BiText } | null>(
    null,
  );
  const [hint, setHint] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [lastWrong, setLastWrong] = useState<PlaceId | null>(null);

  const visit = (p: PlaceId) => {
    if (arrived) return;
    const r = evaluateVisit(step, p);
    dispatch({ type: 'm4', patch: { at: p } });
    if (r.kind === 'found') {
      play('good');
      setArrived(true);
      setLastWrong(null);
      setFb({ kind: 'ok', title: { fr: 'Bien lu!', en: 'Well read!' }, body: cur.arrive });
    } else {
      play('retry');
      setLastWrong(p);
      dispatch({ type: 'stat', id: 'cayenne', errors: 1 });
      setFb({ kind: 'retry', title: M4_TEXT.notHere, body: r.desc, extra: r.near });
    }
  };

  const next = () => {
    setArrived(false);
    setHint(0);
    setFb(null);
    if (step + 1 >= STEPS.length) {
      play('fragment');
      dispatch({ type: 'completeStation', id: 'cayenne' });
      dispatch({ type: 'm4', patch: { phase: 'reward' } });
    } else {
      play('unlock');
      dispatch({ type: 'm4', patch: { step: step + 1 } });
    }
  };

  const askHint = () => {
    const level = Math.min(3, hint + 1);
    setHint(level);
    play('hint');
    dispatch({ type: 'stat', id: 'cayenne', hints: 1 });
    setFb({
      kind: 'hint',
      title: { fr: `Indice ${level} / 3`, en: `Hint ${level} / 3` },
      body:
        level === 3
          ? { fr: 'Regarde le plan : le bon endroit clignote.', en: 'Look at the map: the right place is flashing.' }
          : cur.hints[level - 1]!,
    });
  };

  const MsgIcon = cur.kind === 'sms' ? IconMessage2 : cur.kind === 'note' ? IconNote : IconUser;
  const parts = cur.message.fr.split(cur.keyWords);

  return (
    <section className="m4">
      <Bi t={M4_TEXT.instruction} force className="instruction" as="h1" />
      <div className="m4__grid">
        <div className="m4__side">
          <p className="m4__progress" aria-label={`Message ${step + 1} sur ${STEPS.length}`}>
            {STEPS.map((_, i) => (
              <span key={i} className={`dot ${i <= step ? 'dot--on' : ''}`} aria-hidden="true" />
            ))}
            <span>
              Message {step + 1} / {STEPS.length}
            </span>
          </p>
          <article className={`msg msg--${cur.kind}`} key={step}>
            <p className="msg__from">
              <MsgIcon size={18} aria-hidden="true" /> {cur.from.fr}
            </p>
            <div className="msg__text" lang="fr">
              {hint >= 1 && parts.length > 1 ? (
                <>
                  {parts[0]}
                  <mark>{cur.keyWords}</mark>
                  {parts.slice(1).join(cur.keyWords)}
                </>
              ) : (
                cur.message.fr
              )}
            </div>
            <RevealBi t={{ fr: '', en: cur.message.en }} className="msg__reveal" />
          </article>
          <div className="m4__actions">
            {!arrived ? (
              <button type="button" className="btn btn--secondary" onClick={askHint}>
                <IconBulb size={20} aria-hidden="true" />
                <BtnLabel t={UI.hint} />
              </button>
            ) : (
              <button type="button" className="btn btn--primary btn--lg" onClick={next}>
                <BtnLabel t={step + 1 >= STEPS.length ? { fr: 'Parler à Inès', en: 'Talk to Inès' } : M4_TEXT.next} />
              </button>
            )}
          </div>
          <LiveRegion>
            {fb && (
              <Feedback kind={fb.kind} title={fb.title} body={fb.body}>
                {fb.extra && <Bi t={fb.extra} force />}
              </Feedback>
            )}
          </LiveRegion>
        </div>

        <div className="town sheet" aria-label="Plan de Cayenne">
          <TownArt />
          {PLACES.map((p) => {
            const Icon = ICON[p.id];
            const here = at === p.id;
            const flash = hint === 3 && !arrived && p.id === cur.answer;
            return (
              <div key={p.id} className="town__place" style={{ left: `${p.x / 10}%`, top: `${(p.y / 620) * 100}%` }}>
                <button
                  type="button"
                  className={`place ${here ? 'place--here' : ''} ${flash ? 'place--flash' : ''} ${here && lastWrong === p.id ? 'place--wrong' : ''}`}
                  onClick={() => visit(p.id)}
                  aria-label={`Aller à ${p.name.fr}${here ? ' (tu es ici)' : ''}`}
                >
                  <Icon size={22} aria-hidden="true" />
                  <span lang="fr">{SHORT[p.id]}</span>
                </button>
                {here && (
                  <span className="place__you" aria-hidden="true">
                    <IconMapPin size={18} /> {M4_TEXT.you.fr}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Plan stylisé de Cayenne (fictif) : rues, îlots, place, mer. Décor fonctionnel. */
function TownArt() {
  return (
    <svg
      viewBox="0 0 1000 620"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="1000" height="620" fill="#f7f0e4" />
      {/* mer et quai */}
      <path
        d="M0 585 C200 560 400 600 600 580 C780 562 900 590 1000 575 L1000 620 L0 620 Z"
        fill="#cfe0e3"
        stroke={INK}
        strokeWidth="2"
      />
      <path d="M330 590 L330 560 L430 560 L430 592" fill="none" stroke={INK} strokeWidth="3" />
      {/* îlots */}
      {[
        [40, 40, 260, 200],
        [320, 40, 240, 150],
        [620, 40, 340, 170],
        [40, 290, 260, 200],
        [620, 260, 340, 150],
        [560, 420, 400, 140],
        [40, 520, 260, 50],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="6"
          fill="#ead9bd"
          stroke={INK}
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
      ))}
      {/* rues principales */}
      <g stroke="#fffdf8" strokeWidth="26" strokeLinecap="round">
        <line x1="20" y1="250" x2="980" y2="250" />
        <line x1="20" y1="500" x2="560" y2="500" />
        <line x1="310" y1="20" x2="310" y2="560" />
        <line x1="595" y1="20" x2="595" y2="560" />
      </g>
      <g stroke={INK} strokeWidth="1.2" strokeDasharray="10 10" strokeOpacity="0.35">
        <line x1="20" y1="250" x2="980" y2="250" />
        <line x1="310" y1="20" x2="310" y2="560" />
        <line x1="595" y1="20" x2="595" y2="560" />
      </g>
      {/* place des Palmistes */}
      <rect x="360" y="270" width="210" height="140" rx="10" fill="#cfe3c0" stroke={INK} strokeWidth="2" />
      {[
        [390, 300],
        [540, 300],
        [390, 385],
        [540, 385],
        [465, 340],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <line x1="0" y1="0" x2="0" y2="18" stroke={INK} strokeWidth="2.5" />
          <path
            d="M0 0 C-12 -6 -18 2 -20 6 M0 0 C12 -6 18 2 20 6 M0 0 C-6 -12 -2 -16 2 -18"
            fill="none"
            stroke={PAL.leaf}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* rose des vents */}
      <g transform="translate(950 50)" stroke={INK} strokeWidth="2" fill="none">
        <circle r="18" fill="#fffdf8" />
        <path d="M0 -14 L5 0 L0 14 L-5 0 Z" fill={PAL.tomato} />
      </g>
    </svg>
  );
}
