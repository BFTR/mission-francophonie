import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { BRIEFING, UI } from '../content/ui';
import { useGame } from '../state/context';
import { BtnLabel, Speaker } from '../ui/kit';
import { play } from '../audio/sfx';

export function Briefing() {
  const { dispatch } = useGame();
  const [i, setI] = useState(0);
  const last = i === BRIEFING.length - 1;
  const line = BRIEFING[i] ?? BRIEFING[0]!;

  return (
    <main className="screen briefing enter" id="main">
      <p className="tag">
        Message du QG · <span lang="en">Message from HQ</span>
      </p>
      <h1 className="screen-title">
        Ta mission{' '}
        <span className="screen-title__en" lang="en">
          Your mission
        </span>
      </h1>
      <div className="briefing__dots" aria-label={`Message ${i + 1} sur ${BRIEFING.length}`} role="img">
        {BRIEFING.map((_, k) => (
          <span key={k} className={`dot ${k <= i ? 'dot--on' : ''}`} aria-hidden="true" />
        ))}
      </div>
      <div key={i} className="enter">
        <Speaker who="lumi" name="Lumi · QG Ottawa" t={line} force />
      </div>
      <div className="briefing__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            play('tap');
            if (i === 0) dispatch({ type: 'goto', screen: 'home' });
            else setI(i - 1);
          }}
        >
          <IconArrowLeft size={20} aria-hidden="true" />
          <BtnLabel t={UI.back} />
        </button>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => {
            if (last) {
              play('unlock');
              dispatch({ type: 'goto', screen: 'map' });
            } else {
              play('tap');
              setI(i + 1);
            }
          }}
        >
          <BtnLabel t={last ? { fr: 'Voir la carte', en: 'See the map' } : UI.next} />
          <IconArrowRight size={22} aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}
