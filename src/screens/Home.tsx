import { IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { GROUPS } from '../content/types';
import { GAME_SUBTITLE, GAME_TITLE, UI } from '../content/ui';
import { useGame } from '../state/context';
import { fragmentsCount } from '../state/game';
import { Bi, BtnLabel } from '../ui/kit';
import { MiniMap } from '../art/MapArt';
import { play } from '../audio/sfx';

export function Home({ hasProgress, onRestart }: { hasProgress: boolean; onRestart: () => void }) {
  const { state, dispatch } = useGame();
  const [error, setError] = useState(false);

  const start = () => {
    if (!state.group) {
      setError(true);
      play('retry');
      return;
    }
    play('unlock');
    dispatch({ type: 'goto', screen: hasProgress ? 'map' : 'briefing' });
  };

  return (
    <main className="screen home enter" id="main">
      <div className="home__grid">
        <section className="home__title">
          <p className="tag tag--boxed">Core French · Grade 7</p>
          <h1 className="home__h1">{GAME_TITLE}</h1>
          <p className="home__sub">{GAME_SUBTITLE}</p>
          <Bi
            className="home__pitch"
            force
            t={{
              fr: 'Le Réseau Écho est en panne. Rallume cinq radios francophones des Amériques… en français!',
              en: 'The Écho Network is down. Turn five French-language radio stations in the Americas back on… in French!',
            }}
          />
          <div className="home__map" aria-hidden="true">
            <MiniMap />
          </div>
        </section>

        <section className="sheet home__panel" aria-labelledby="group-title">
          <h2 id="group-title" className="bi" style={{ fontSize: 'var(--fs-xl)' }}>
            <span lang="fr">{UI.chooseGroup.fr}</span>
            <span
              className="bi__en"
              lang="en"
              style={{ fontSize: 'var(--fs-sm)', fontFamily: 'var(--font-text)', fontWeight: 400 }}
            >
              {UI.chooseGroup.en}
            </span>
          </h2>
          <div className="home__groups" role="radiogroup" aria-labelledby="group-title">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={state.group === g}
                className={`group-tile ${state.group === g ? 'group-tile--on' : ''}`}
                onClick={() => {
                  play('tap');
                  setError(false);
                  dispatch({ type: 'chooseGroup', group: g });
                }}
              >
                <span className="group-tile__label">Groupe</span>
                <span className="group-tile__num">{g}</span>
              </button>
            ))}
          </div>
          {error && (
            <p className="home__error" role="alert">
              Choisis ton groupe d’abord. <span lang="en">Choose your group first.</span>
            </p>
          )}
          <Bi t={UI.groupNote} force className="home__note" />
          <button
            type="button"
            className="btn btn--quiet home__projector"
            aria-pressed={state.settings.projector}
            onClick={() => dispatch({ type: 'setProjector', on: !state.settings.projector })}
          >
            {state.settings.projector ? 'Mode projecteur : activé' : 'Mode projecteur (classe entière)'}
            <span lang="en"> · {state.settings.projector ? 'Projector mode: on' : 'Projector mode'}</span>
          </button>
          <div className="home__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={start}>
              <BtnLabel t={hasProgress ? UI.resume : UI.start} />
              <IconArrowRight size={22} aria-hidden="true" />
            </button>
            {hasProgress && (
              <>
                <p className="home__progress">
                  {fragmentsCount(state)} / 5 mots-clés · <span lang="en">keywords</span>
                </p>
                <button type="button" className="btn btn--quiet" onClick={onRestart}>
                  <BtnLabel t={UI.restart} />
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
