import { useEffect, useMemo, useReducer, useState } from 'react';
import { HOW_TO_PLAY, UI } from './content/ui';
import { M1_GLOSSARY, M1_TEXT, NUMBERS_1_10 } from './content/m1';
import { stationById } from './content/stations';
import type { Bi as BiText } from './content/types';
import { GameContext } from './state/context';
import { initialState, reducer, type GameState } from './state/game';
import { createStore, type LoadStatus } from './save/storage';
import { setSfxEnabled } from './audio/sfx';
import { TopBar, type Panel } from './ui/TopBar';
import { Bi, BtnLabel, Dialog } from './ui/kit';
import { Home } from './screens/Home';
import { Briefing } from './screens/Briefing';
import { MapScreen } from './screens/MapScreen';
import { M1Market } from './missions/M1Market';
import { M2Radio } from './missions/M2Radio';
import { M3Cafe } from './missions/M3Cafe';
import { M4Town } from './missions/M4Town';
import { M5Lighthouse } from './missions/M5Lighthouse';
import { Finale } from './screens/Finale';
import { Teacher } from './screens/Teacher';
import { M2_GLOSSARY, M2_TEXT } from './content/m2';
import { M3_GLOSSARY, M3_TEXT } from './content/m3';
import { M4_GLOSSARY, M4_TEXT } from './content/m4';
import { M5_GLOSSARY, M5_TEXT } from './content/m5';
import type { StationId } from './content/types';

/** Carnet de mots de chaque station : des outils, jamais les réponses. */
const GLOSSARIES: Record<StationId, readonly BiText[]> = {
  lafayette: M1_GLOSSARY,
  portauprince: M2_GLOSSARY,
  fortdefrance: M3_GLOSSARY,
  cayenne: M4_GLOSSARY,
  saintpierre: M5_GLOSSARY,
};

/** Consigne en cours, affichée dans « Consignes ». */
function currentInstruction(state: GameState): BiText | null {
  if (state.screen !== 'mission' || !state.station) return null;
  switch (state.station) {
    case 'lafayette':
      return state.m1.phase === 'count' ? M1_TEXT.countInstruction : M1_TEXT.findInstruction;
    case 'portauprince':
      return M2_TEXT.instruction;
    case 'fortdefrance':
      return M3_TEXT.instruction;
    case 'cayenne':
      return M4_TEXT.instruction;
    case 'saintpierre':
      return state.m5.phase === 'touch' ? M5_TEXT.touchInstruction : M5_TEXT.tilesInstruction;
  }
}

const store = createStore();

function boot(): { state: GameState; status: LoadStatus } {
  const { state, status } = store.load();
  const s = state ?? initialState();
  // Espace enseignant : adresse dédiée …/#enseignant (discrétion, pas une sécurité).
  if (typeof window !== 'undefined' && window.location.hash === '#enseignant')
    return { state: { ...s, screen: 'teacher' }, status };
  // Mode classe entière : adresse …/#classe (projecteur).
  if (typeof window !== 'undefined' && window.location.hash === '#classe')
    return { state: { ...s, settings: { ...s.settings, projector: true } }, status };
  return { state: s, status };
}

export default function App() {
  const [{ status: loadStatus, state: bootState }] = useState(boot);
  const [state, dispatch] = useReducer(reducer, bootState);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<BiText | null>(
    loadStatus === 'unavailable' ? UI.storageOff : loadStatus === 'corrupt' ? UI.storageCorrupt : null,
  );

  // Sauvegarde automatique, locale uniquement.
  useEffect(() => {
    store.save(state);
  }, [state]);

  useEffect(() => setSfxEnabled(state.settings.sound), [state.settings.sound]);

  // Mode projecteur : agrandit tout le texte et les boutons (attribut sur <html>).
  useEffect(() => {
    document.documentElement.toggleAttribute('data-projector', state.settings.projector);
  }, [state.settings.projector]);

  // Espace enseignant aussi quand seule l'ancre de l'adresse change (…/#enseignant).
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#enseignant') dispatch({ type: 'goto', screen: 'teacher' });
      if (window.location.hash === '#classe') dispatch({ type: 'setProjector', on: true });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Le titre de l'onglet suit l'écran (repère pour les lecteurs d'écran).
  useEffect(() => {
    const where = state.screen === 'mission' && state.station ? stationById(state.station).city : '';
    document.title = where ? `${where} · Mission Francophonie` : 'Mission Francophonie — Le signal perdu';
    window.scrollTo(0, 0);
  }, [state.screen, state.station, state.m1.phase, state.m2.phase, state.m3.phase, state.m4.phase, state.m5.phase]);

  const hasProgress =
    (state.screen !== 'home' && state.screen !== 'teacher') ||
    Object.values(state.status).some((s) => s === 'done') ||
    state.m1.phase !== 'intro';

  const where = useMemo(() => {
    switch (state.screen) {
      case 'home':
        return 'Accueil';
      case 'briefing':
        return 'QG · Ottawa';
      case 'map':
        return 'Carte du réseau';
      case 'mission': {
        if (!state.station) return '';
        const s = stationById(state.station);
        return `Station ${s.number} · ${s.city}`;
      }
      case 'finale':
        return 'Mission accomplie';
      case 'teacher':
        return 'Espace enseignant';
    }
  }, [state.screen, state.station]);

  const missionInstruction = currentInstruction(state);
  const glossary = state.screen === 'mission' && state.station ? GLOSSARIES[state.station] : null;
  const hasWordbook = !!glossary;

  const doReset = () => {
    store.clear();
    dispatch({ type: 'reset' });
    setConfirmReset(false);
    setPanel(null);
  };

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className="app">
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        {state.screen !== 'home' && state.screen !== 'teacher' && (
          <TopBar where={where} onOpen={setPanel} hasWordbook={hasWordbook} />
        )}

        {notice && (
          <div className="notice" role="status">
            <Bi t={notice} force />
            <button type="button" className="btn btn--quiet" onClick={() => setNotice(null)}>
              <BtnLabel t={UI.close} />
            </button>
          </div>
        )}

        {state.screen === 'home' && <Home hasProgress={hasProgress} onRestart={() => setConfirmReset(true)} />}
        {state.screen === 'briefing' && <Briefing />}
        {state.screen === 'map' && <MapScreen />}
        {state.screen === 'mission' && state.station === 'lafayette' && <M1Market />}
        {state.screen === 'mission' && state.station === 'portauprince' && <M2Radio />}
        {state.screen === 'mission' && state.station === 'fortdefrance' && <M3Cafe />}
        {state.screen === 'mission' && state.station === 'cayenne' && <M4Town />}
        {state.screen === 'mission' && state.station === 'saintpierre' && <M5Lighthouse />}
        {state.screen === 'finale' && <Finale />}
        {state.screen === 'teacher' && <Teacher />}

        {/* Consignes */}
        <Dialog open={panel === 'help'} onClose={() => setPanel(null)} labelledBy="help-title">
          <h2 id="help-title" className="dialog-title">
            {UI.instructions.fr}{' '}
            <span className="screen-title__en" lang="en">
              Instructions
            </span>
          </h2>
          {missionInstruction && (
            <div className="dialog-callout">
              <p className="tag">
                Maintenant · <span lang="en">Right now</span>
              </p>
              <Bi t={missionInstruction} force />
            </div>
          )}
          <ol className="howto">
            {HOW_TO_PLAY.map((h, i) => (
              <li key={i}>
                <Bi t={h} force />
              </li>
            ))}
          </ol>
          <div className="dialog__actions">
            <button type="button" className="btn btn--primary" onClick={() => setPanel(null)}>
              <BtnLabel t={UI.close} />
            </button>
          </div>
        </Dialog>

        {/* Carnet de mots */}
        <Dialog open={panel === 'wordbook'} onClose={() => setPanel(null)} labelledBy="wb-title">
          <h2 id="wb-title" className="dialog-title">
            Carnet de mots{' '}
            <span className="screen-title__en" lang="en">
              Word book
            </span>
          </h2>
          <table className="wordbook">
            <caption className="sr-only">Mots utiles, français et anglais</caption>
            <thead>
              <tr>
                <th scope="col">Français</th>
                <th scope="col">English</th>
              </tr>
            </thead>
            <tbody>
              {(glossary ?? []).map((g) => (
                <tr key={g.fr}>
                  <td lang="fr">{g.fr}</td>
                  <td lang="en">{g.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(state.station === 'lafayette' || state.station === 'portauprince') && (
            <>
              <p className="tag">
                Les nombres · <span lang="en">Numbers</span>
              </p>
              <ul className="numbers">
                {NUMBERS_1_10.map((n) => (
                  <li key={n.value}>
                    <strong>{n.value}</strong> <span lang="fr">{n.word}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="dialog__actions">
            <button type="button" className="btn btn--primary" onClick={() => setPanel(null)}>
              <BtnLabel t={UI.close} />
            </button>
          </div>
        </Dialog>

        {/* Menu */}
        <Dialog open={panel === 'menu'} onClose={() => setPanel(null)} labelledBy="menu-title">
          <h2 id="menu-title" className="dialog-title">
            Menu
          </h2>
          <div className="menu-list">
            {state.screen === 'mission' && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  dispatch({ type: 'leaveStation' });
                  setPanel(null);
                }}
              >
                <BtnLabel t={UI.toMap} />
              </button>
            )}
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                dispatch({ type: 'goto', screen: 'home' });
                setPanel(null);
              }}
            >
              <BtnLabel t={{ fr: 'Accueil', en: 'Home screen' }} />
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setPanel(null);
                setConfirmReset(true);
              }}
            >
              <BtnLabel t={UI.restart} />
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              aria-pressed={state.settings.projector}
              onClick={() => dispatch({ type: 'setProjector', on: !state.settings.projector })}
            >
              <BtnLabel
                t={
                  state.settings.projector
                    ? { fr: 'Mode projecteur : activé', en: 'Projector mode: on' }
                    : { fr: 'Mode projecteur (classe entière)', en: 'Projector mode (whole class)' }
                }
              />
            </button>
          </div>
          <div className="dialog__actions">
            <button type="button" className="btn btn--primary" onClick={() => setPanel(null)}>
              <BtnLabel t={UI.close} />
            </button>
          </div>
        </Dialog>

        {/* Confirmation avant effacement */}
        <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} labelledBy="reset-title">
          <h2 id="reset-title" className="dialog-title">
            {UI.restartConfirmTitle.fr}
          </h2>
          <p className="bi__en" lang="en">
            {UI.restartConfirmTitle.en}
          </p>
          <Bi t={UI.restartConfirmBody} force />
          <div className="dialog__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setConfirmReset(false)}>
              <BtnLabel t={UI.cancel} />
            </button>
            <button type="button" className="btn btn--primary" onClick={doReset}>
              <BtnLabel t={UI.restartYes} />
            </button>
          </div>
        </Dialog>
      </div>
    </GameContext.Provider>
  );
}
