import { IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { STATIONS, type StationInfo } from '../content/stations';
import { UI } from '../content/ui';
import type { Bi as BiText } from '../content/types';
import { useGame } from '../state/context';
import { allDone } from '../state/game';
import { NetworkMap } from '../art/MapArt';
import { Bi, BtnLabel, Feedback, LiveRegion } from '../ui/kit';
import { play } from '../audio/sfx';

export function MapScreen() {
  const { state, dispatch } = useGame();
  const firstOpen = STATIONS.find((s) => state.status[s.id] === 'open') ?? STATIONS[0]!;
  const [selected, setSelected] = useState<StationInfo>(firstOpen);
  const [notice, setNotice] = useState<BiText | null>(null);

  const st = state.status[selected.id];

  const pick = (s: StationInfo) => {
    setSelected(s);
    if (state.status[s.id] === 'locked') {
      play('retry');
      setNotice(UI.stationLocked);
    } else if (!s.playable) {
      play('hint');
      setNotice(UI.stationSoon);
    } else {
      play('tap');
      setNotice(null);
    }
  };

  const canEnter = st !== 'locked' && selected.playable;

  return (
    <main className="screen mapscreen enter" id="main">
      {allDone(state) && (
        <div className="mapscreen__done">
          <Bi t={{ fr: 'Les cinq stations sont rallumées!', en: 'All five stations are back on!' }} force />
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => dispatch({ type: 'goto', screen: 'finale' })}
          >
            <BtnLabel t={{ fr: 'Voir l’écran final', en: 'See the final screen' }} />
            <IconArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="mapscreen__head">
        <h1 className="screen-title">
          {UI.mapTitle.fr}{' '}
          <span className="screen-title__en" lang="en">
            {UI.mapTitle.en}
          </span>
        </h1>
        <Bi t={UI.mapInstruction} force />
      </div>
      <div className="mapscreen__grid">
        <div className="sheet mapscreen__map">
          <NetworkMap stations={STATIONS} status={state.status} onPick={pick} selected={selected.id} />
        </div>

        <aside className="sheet mapscreen__card" aria-labelledby="station-title">
          <p className="tag tag--boxed">
            Station {selected.number} · {st === 'done' ? UI.done.fr : st === 'open' ? UI.open.fr : UI.locked.fr}
          </p>
          <h2 id="station-title" className="mapscreen__city">
            {selected.city}
          </h2>
          <Bi t={selected.region} force className="mapscreen__region" />
          <LiveRegion>
            {(notice ?? (st !== 'locked' && !selected.playable ? UI.stationSoon : null)) && (
              <Feedback kind={st === 'locked' ? 'retry' : 'hint'} body={notice ?? UI.stationSoon} />
            )}
          </LiveRegion>
          {canEnter && (
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => {
                play('unlock');
                dispatch({ type: 'enterStation', id: selected.id });
              }}
            >
              <BtnLabel t={st === 'done' ? UI.replay : UI.play} />
              <IconArrowRight size={22} aria-hidden="true" />
            </button>
          )}
          <dl className="mapscreen__facts">
            <div>
              <dt>Mission</dt>
              <dd>
                <Bi t={selected.missionTitle} />
              </dd>
            </div>
            <div>
              <dt>
                Compétence <span lang="en">· Skill</span>
              </dt>
              <dd>
                <Bi t={selected.skill} />
              </dd>
            </div>
            <div>
              <dt>
                Mot-clé <span lang="en">· Keyword</span>
              </dt>
              <dd>
                <Bi t={selected.keyword.label} />
                {st === 'done' && <strong className="keyword-chip">{selected.keyword.word}</strong>}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
