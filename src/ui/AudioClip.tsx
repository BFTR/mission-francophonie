import { IconFileText, IconPlayerPlay, IconPlayerStop, IconSnail } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/context';

/**
 * Lecteur d'un message oral.
 * 1. Fichier MP3 préenregistré (public/audio/) : solution principale.
 * 2. Si le fichier ne se charge pas : synthèse vocale du navigateur, seulement si une voix
 *    française existe sur l'appareil.
 * 3. Sinon : message clair + transcription.
 * Aucun son ne démarre sans un clic de l'élève. Le micro n'est jamais demandé.
 */

let current: { stop: () => void } | null = null;

function frenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'fr-CA') ?? voices.find((v) => v.lang.toLowerCase().startsWith('fr')) ?? null;
}

/** Configure l'élément audio (hors composant : l'objet est externe à React). */
function prepare(el: HTMLAudioElement, rate: number, onEnd: () => void, onFail: () => void) {
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

type Status = 'idle' | 'playing' | 'fallback' | 'unavailable';

export function AudioClip({
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
}: {
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
}) {
  const { state } = useGame();
  const [status, setStatus] = useState<Status>('idle');
  const [slow, setSlow] = useState(false);
  const [plays, setPlays] = useState(0);
  const [showText, setShowText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reportedRef = useRef(false);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    [],
  );

  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setStatus((s) => (s === 'playing' || s === 'fallback' ? 'idle' : s));
  };

  const speak = () => {
    const v = frenchVoice();
    if (!v) {
      setStatus('unavailable');
      return;
    }
    const u = new SpeechSynthesisUtterance(transcript);
    u.voice = v;
    u.lang = v.lang;
    u.rate = slow ? 0.75 : 0.9;
    u.onend = () => setStatus('idle');
    u.onerror = () => setStatus('unavailable');
    setStatus('fallback');
    window.speechSynthesis.speak(u);
  };

  const play = () => {
    if (status === 'playing' || status === 'fallback') {
      stop();
      return;
    }
    current?.stop();
    current = { stop };
    setPlays((n) => n + 1);
    onPlay?.();
    const a = audioRef.current ?? new Audio(audioUrl(file));
    audioRef.current = a;
    setStatus('playing');
    prepare(a, slow ? 0.8 : 1, () => setStatus('idle'), speak).catch(() => speak());
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

  return (
    <div className={`clip clip--${tone} ${compact ? 'clip--compact' : ''}`}>
      <div className="clip__row">
        <button
          type="button"
          className="btn btn--primary clip__play"
          onClick={play}
          aria-pressed={status === 'playing' || status === 'fallback'}
        >
          {status === 'playing' || status === 'fallback' ? (
            <IconPlayerStop size={22} aria-hidden="true" />
          ) : (
            <IconPlayerPlay size={22} aria-hidden="true" />
          )}
          <span>
            {status === 'playing' || status === 'fallback' ? 'Arrêter' : plays > 0 ? 'Réécouter' : label}
            {showEn && !compact && (
              <span className="clip__en" lang="en">
                {status === 'playing' || status === 'fallback' ? 'Stop' : plays > 0 ? 'Listen again' : 'Listen'}
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
