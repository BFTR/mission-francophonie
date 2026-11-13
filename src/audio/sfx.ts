/**
 * Effets sonores discrets, synthétisés avec Web Audio (aucun fichier, aucune licence).
 * Volume bas, jamais déclenchés sans action de l'élève, désactivables.
 */
type Sfx = 'tap' | 'good' | 'retry' | 'hint' | 'fragment' | 'unlock';

let ctx: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export function play(kind: Sfx) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const V = 0.07;
  switch (kind) {
    case 'tap':
      tone(c, 660, 0, 0.06, 'triangle', V * 0.6);
      break;
    case 'good':
      tone(c, 660, 0, 0.12, 'triangle', V);
      tone(c, 990, 0.08, 0.18, 'triangle', V);
      break;
    case 'retry':
      tone(c, 260, 0, 0.16, 'sine', V);
      tone(c, 220, 0.1, 0.2, 'sine', V);
      break;
    case 'hint':
      tone(c, 880, 0, 0.1, 'sine', V * 0.7);
      tone(c, 1175, 0.07, 0.14, 'sine', V * 0.7);
      break;
    case 'fragment':
      [523, 659, 784, 1047].forEach((f, i) => tone(c, f, i * 0.09, 0.3, 'triangle', V));
      break;
    case 'unlock':
      tone(c, 392, 0, 0.12, 'square', V * 0.35);
      tone(c, 784, 0.1, 0.22, 'triangle', V);
      break;
  }
}
