import { IconFileText, IconPlayerPlay, IconPlayerStop, IconSnail } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/context';

/**
 * Lecteur d'un message oral.
 * 1. Fichier MP3 préenregistré (public/audio/) : solution principale.
 * 2. Si le fichier ne se charge VRAIMENT pas : synthèse vocale du navigateur, seulement si une
 *    voix française existe sur l'appareil.
 * 3. Sinon : message clair + transcription.
 * Aucun son ne démarre sans un clic de l'élève. Le micro n'est jamais demandé.
 *
 * Garanties (retour de classe du 12/11/2026, voir tests/e2e/audio.spec.ts) :
 * - un lecteur = UN fichier : quand le message change, un nouveau lecteur est créé (clé = fichier) ;
 *   l'ancien est arrêté et détruit ;
 * - un seul son à la fois dans tout le jeu ;
 * - une lecture annulée volontairement (Arrêter, autre message, changement d'écran) ne déclenche
 *   jamais la voix de secours ; les réponses tardives d'une lecture périmée sont ignorées.
 */

type Props = {
  /** Pas de bouton « Texte » (quand la réplique est déjà affichée à l'écran). */
  noText?: boolean;
  file: string;
  transcript: string;
  /** Passage à surligner dans la transcription (indice). */
  highlight?: string;
  forceHighlight?: boolean;
  /** Appelé la première fois que la transcription est affichée (adaptation). */
  onTranscript?: () => void;
  onPlay?: () => void;
  label?: string;
  tone?: 'paper' | 'console';
  compact?: boolean;
};

/** Le lecteur actif dans tout le jeu (un seul son à la fois). */
let current: { stop: () => void } | null = null;

function frenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'fr-CA') ?? voices.find((v) => v.lang.toLowerCase().startsWith('fr')) ?? null;
}

/** Arrête et libère un élément audio (hors composant : l'objet est externe à React). */
function release(el: HTMLAudioElement | null) {
  if (!el) return;
  el.onended = null;
  el.onerror = null;
  el.pause();
  el.removeAttribute('src');
  el.load();
}

/** Lance la lecture ; renvoie la promesse de play(). */
function start(el: HTMLAudioElement, rate: number, onEnd: () => void, onFail: () => void) {
  el.playbackRate = rate;
  el.onended = onEnd;
  el.onerror = onFail;
  el.currentTime = 0;
  return el.play();
}

function setRate(el: HTMLAudioElement | null, rate: number) {
  if (el) el.playbackRate = rate;
}

export function audioUrl(file: string): string {
  return `${import.meta.env.BASE_URL}audio/${file}`;
}

/** Point d'entrée : la clé force un lecteur neuf pour chaque fichier. */
export function AudioClip(props: Props) {
  return <AudioClipPlayer key={props.file} {...props} />;
}

type Status = 'idle' | 'playing' | 'fallback' | 'unavailable';

function AudioClipPlayer({
  file,
  transcript,
  highlight,
  forceHighlight = false,
  onTranscript,
  onPlay,
  label = 'Écouter',
  tone = 'paper',
  compact = false,
  noText = false,
}: Props) {
  const { state } = useGame();
  const [status, setStatus] = useState<Status>('idle');
  const [slow, setSlow] = useState(false);
  const [plays, setPlays] = useState(0);
  const [showText, setShowText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reportedRef = useRef(false);
  /** Numéro de la lecture en cours : toute réponse d'une lecture plus ancienne est ignorée. */
  const runRef = useRef(0);
  const selfRef = useRef<{ stop: () => void } | null>(null);

  // Démontage (autre message, autre écran) : on coupe tout et on libère le fichier.
  useEffect(
    () => () => {
      runRef.current += 1;
      release(audioRef.current);
      audioRef.current = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (current === selfRef.current) current = null;
    },
    [],
  );

  const stop = () => {
    runRef.current += 1; // invalide les réponses tardives (AbortError, onended…)
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setStatus((s) => (s === 'playing' || s === 'fallback' ? 'idle' : s));
  };

  const speak = (run: number) => {
    if (run !== runRef.current) return; // lecture périmée : on ne parle pas
    const v = frenchVoice();
    if (!v) {
      setStatus('unavailable');
      return;
    }
    const u = new SpeechSynthesisUtterance(transcript);
    u.voice = v;
    u.lang = v.lang;
    u.rate = slow ? 0.75 : 0.9;
    u.onend = () => run === runRef.current && setStatus('idle');
    u.onerror = () => run === runRef.current && setStatus('unavailable');
    setStatus('fallback');
    window.speechSynthesis.speak(u);
  };

  const play = () => {
    if (status === 'playing' || status === 'fallback') {
      stop();
      return;
    }
    if (current && current !== selfRef.current) current.stop();
    selfRef.current = { stop };
    current = selfRef.current;
    const run = ++runRef.current;
    setPlays((n) => n + 1);
    onPlay?.();
    const a = audioRef.current ?? new Audio(audioUrl(file));
    audioRef.current = a;
    setStatus('playing');
    start(
      a,
      slow ? 0.8 : 1,
      () => run === runRef.current && setStatus('idle'),
      () => speak(run), // vraie erreur de chargement du fichier
    ).catch((e: unknown) => {
      // Une lecture interrompue volontairement (pause pendant le chargement) n'est pas une panne.
      if (e instanceof DOMException && e.name === 'AbortError') return;
      speak(run);
    });
  };

  const toggleText = () => {
    const next = !showText;
    setShowText(next);
    if (next && !reportedRef.current) {
      reportedRef.current = true;
      onTranscript?.();
    }
  };

  const shown = forceHighlight || showText;
  const parts = highlight && transcript.includes(highlight) ? transcript.split(highlight) : null;
  const showEn = state.settings.showEnglish;
  const active = status === 'playing' || status === 'fallback';

  return (
    <div className={`clip clip--${tone} ${compact ? 'clip--compact' : ''}`} data-audio={file}>
      <div className="clip__row">
        <button type="button" className="btn btn--primary clip__play" onClick={play} aria-pressed={active}>
          {active ? <IconPlayerStop size={22} aria-hidden="true" /> : <IconPlayerPlay size={22} aria-hidden="true" />}
          <span>
            {active ? 'Arrêter' : plays > 0 ? 'Réécouter' : label}
            {showEn && !compact && (
              <span className="clip__en" lang="en">
                {active ? 'Stop' : plays > 0 ? 'Listen again' : 'Listen'}
              </span>
            )}
          </span>
        </button>
        <button
          type="button"
          className="btn btn--secondary clip__tool"
          aria-pressed={slow}
          onClick={() => {
            setSlow(!slow);
            setRate(audioRef.current, !slow ? 0.8 : 1);
          }}
        >
          <IconSnail size={20} aria-hidden="true" />
          <span>Plus lent</span>
          <span className="sr-only"> (slower)</span>
        </button>
        {!noText && (
          <button
            type="button"
            className="btn btn--secondary clip__tool"
            aria-pressed={showText}
            aria-expanded={showText}
            onClick={toggleText}
          >
            <IconFileText size={20} aria-hidden="true" />
            <span>Texte</span>
            <span className="sr-only"> (transcript)</span>
          </button>
        )}
        {plays > 0 && !compact && (
          <span className="clip__count" aria-live="polite">
            {plays} {plays > 1 ? 'écoutes' : 'écoute'}
          </span>
        )}
      </div>
      {status === 'unavailable' && (
        <p className="clip__warn" role="status">
          Le son ne fonctionne pas sur cet appareil. Clique sur « Texte » pour lire le message.{' '}
          <span lang="en">Sound doesn’t work on this device. Click “Texte” to read the message.</span>
        </p>
      )}
      {status === 'fallback' && (
        <p className="clip__note" role="status">
          Voix du Chromebook (le fichier audio n’a pas pu être chargé).
        </p>
      )}
      {shown && (
        <p className="clip__text" lang="fr">
          {parts ? (
            <>
              {parts[0]}
              <mark>{highlight}</mark>
              {parts.slice(1).join(highlight)}
            </>
          ) : (
            transcript
          )}
        </p>
      )}
    </div>
  );
}
