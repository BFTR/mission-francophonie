import { IconBook2, IconInfoCircle, IconLanguage, IconMenu2, IconVolume, IconVolumeOff } from '@tabler/icons-react';
import { STATIONS } from '../content/stations';
import { GAME_TITLE, UI } from '../content/ui';
import { useGame } from '../state/context';
import { play } from '../audio/sfx';

export type Panel = 'help' | 'wordbook' | 'menu';

export function FragmentTrack() {
  const { state } = useGame();
  const got = STATIONS.filter((s) => state.status[s.id] === 'done').length;
  return (
    <div className="fragments" role="img" aria-label={`Mots-clés : ${got} sur 5`}>
      {STATIONS.map((s) => (
        <span
          key={s.id}
          className={`fragments__slot ${state.status[s.id] === 'done' ? 'fragments__slot--got' : ''}`}
          aria-hidden="true"
        >
          {s.number}
        </span>
      ))}
    </div>
  );
}

export function TopBar({
  where,
  onOpen,
  hasWordbook,
}: {
  where: string;
  onOpen: (p: Panel) => void;
  hasWordbook: boolean;
}) {
  const { state, dispatch } = useGame();
  const { sound, showEnglish } = state.settings;
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <span className="topbar__brand">{GAME_TITLE}</span>
        <span className="topbar__where tag" aria-live="polite">
          {where}
        </span>
        <FragmentTrack />
        <nav className="topbar__tools" aria-label="Outils">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              play('tap');
              onOpen('help');
            }}
          >
            <IconInfoCircle size={20} aria-hidden="true" />
            <span className="topbar__label">{UI.instructions.fr}</span>
            <span className="sr-only">(Instructions)</span>
          </button>
          {hasWordbook && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                play('tap');
                onOpen('wordbook');
              }}
            >
              <IconBook2 size={20} aria-hidden="true" />
              <span className="topbar__label">{UI.wordbook.fr}</span>
              <span className="sr-only">(Word book)</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn--secondary"
            aria-pressed={showEnglish}
            onClick={() => {
              play('tap');
              dispatch({ type: 'toggleEnglish' });
            }}
          >
            <IconLanguage size={20} aria-hidden="true" />
            <span className="topbar__label">{UI.english.fr}</span>
            <span className="sr-only">(Show English translations)</span>
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--icon"
            aria-pressed={sound}
            aria-label={sound ? 'Son activé (Sound on)' : 'Son coupé (Sound off)'}
            onClick={() => dispatch({ type: 'toggleSound' })}
          >
            {sound ? <IconVolume size={20} aria-hidden="true" /> : <IconVolumeOff size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--icon"
            aria-label="Menu"
            onClick={() => {
              play('tap');
              onOpen('menu');
            }}
          >
            <IconMenu2 size={20} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  );
}
