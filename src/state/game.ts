import { COUNT_ROWS, MARKET_ITEMS, type CountRow, type MarketItemId } from '../content/m1';
import { GROUPS, STATION_IDS, type Group, type StationId } from '../content/types';
import { RADIO_MESSAGES, type DialId } from '../content/m2';
import { CHAT } from '../content/m3';
import { PLACES, STEPS, type PlaceId } from '../content/m4';
import { SENTENCES } from '../content/m5';
import { BONUS } from '../content/bonus';

export const SAVE_VERSION = 1;

export type Screen = 'home' | 'briefing' | 'map' | 'mission' | 'finale' | 'teacher';
export type StationStatus = 'locked' | 'open' | 'done';

export type StationStats = { errors: number; hints: number; usedTranscript: boolean };

export type M1Progress = {
  phase: 'intro' | 'find' | 'count' | 'reward';
  found: MarketItemId[];
  counts: Record<CountRow['id'], number>;
};

export type M2Progress = { phase: 'intro' | 'console' | 'reward'; answers: Partial<Record<DialId, string>> };
export type M3Progress = { phase: 'intro' | 'chat' | 'final' | 'reward'; node: number };
export type M4Progress = { phase: 'intro' | 'map' | 'reward'; step: number; at: PlaceId | null };
export type M5Progress = {
  phase: 'intro' | 'tiles' | 'touch' | 'reward';
  seqs: Record<string, string[]>;
  solved: string[];
  touch: string;
};
/** Dossiers secrets : pour chaque station, les questions réussies (indices). */
export type BonusProgress = Record<StationId, number[]>;

export type GameState = {
  version: typeof SAVE_VERSION;
  group: Group | null;
  screen: Screen;
  station: StationId | null;
  status: Record<StationId, StationStatus>;
  stats: Record<StationId, StationStats>;
  m1: M1Progress;
  m2: M2Progress;
  m3: M3Progress;
  m4: M4Progress;
  m5: M5Progress;
  bonus: BonusProgress;
  settings: { sound: boolean; showEnglish: boolean };
};

const emptyStats = (): StationStats => ({ errors: 0, hints: 0, usedTranscript: false });

export const initialM1 = (): M1Progress => ({
  phase: 'intro',
  found: [],
  counts: Object.fromEntries(COUNT_ROWS.map((r) => [r.id, 0])) as M1Progress['counts'],
});

export const initialM2 = (): M2Progress => ({ phase: 'intro', answers: {} });
export const initialM3 = (): M3Progress => ({ phase: 'intro', node: 0 });
export const initialM4 = (): M4Progress => ({ phase: 'intro', step: 0, at: null });
export const initialM5 = (): M5Progress => ({ phase: 'intro', seqs: {}, solved: [], touch: '' });
const initialBonus = (): BonusProgress =>
  Object.fromEntries(STATION_IDS.map((id) => [id, []])) as unknown as BonusProgress;

export function initialState(): GameState {
  return {
    version: SAVE_VERSION,
    group: null,
    screen: 'home',
    station: null,
    status: Object.fromEntries(STATION_IDS.map((id, i) => [id, i === 0 ? 'open' : 'locked'])) as GameState['status'],
    stats: Object.fromEntries(STATION_IDS.map((id) => [id, emptyStats()])) as GameState['stats'],
    m1: initialM1(),
    m2: initialM2(),
    m3: initialM3(),
    m4: initialM4(),
    m5: initialM5(),
    bonus: initialBonus(),
    settings: { sound: true, showEnglish: true },
  };
}

export type Action =
  | { type: 'chooseGroup'; group: Group }
  | { type: 'goto'; screen: Exclude<Screen, 'mission'> }
  | { type: 'enterStation'; id: StationId }
  | { type: 'leaveStation' }
  | { type: 'm1'; patch: Partial<M1Progress> }
  | { type: 'm1Count'; id: CountRow['id']; delta: number }
  | { type: 'm2'; patch: Partial<M2Progress> }
  | { type: 'm3'; patch: Partial<M3Progress> }
  | { type: 'm4'; patch: Partial<M4Progress> }
  | { type: 'm5'; patch: Partial<M5Progress> }
  | { type: 'bonusCorrect'; id: StationId; index: number }
  | { type: 'm2Answer'; dial: DialId; value: string }
  | { type: 'm5Tile'; sentence: string; op: 'add' | 'remove' | 'clear'; tile?: string }
  | { type: 'stat'; id: StationId; errors?: number; hints?: number; usedTranscript?: boolean }
  | { type: 'completeStation'; id: StationId }
  | { type: 'toggleSound' }
  | { type: 'toggleEnglish' }
  | { type: 'reset' };

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'chooseGroup':
      return { ...state, group: action.group };
    case 'goto':
      // Impossible d'aller plus loin que l'accueil sans groupe.
      if (action.screen === 'teacher') return { ...state, screen: 'teacher', station: null };
      if (action.screen !== 'home' && !state.group) return state;
      // L'écran final n'est accessible que si les cinq stations sont rallumées.
      if (action.screen === 'finale' && !allDone(state)) return state;
      return { ...state, screen: action.screen, station: null };
    case 'enterStation':
      // Garde-fou : une station verrouillée ne s'ouvre jamais, même par un état forcé.
      if (state.status[action.id] === 'locked' || !state.group) return state;
      return { ...state, screen: 'mission', station: action.id };
    case 'leaveStation':
      return { ...state, screen: 'map', station: null };
    case 'm1':
      return { ...state, m1: { ...state.m1, ...action.patch } };
    case 'm2':
      return { ...state, m2: { ...state.m2, ...action.patch } };
    case 'm3':
      return { ...state, m3: { ...state.m3, ...action.patch } };
    case 'm4':
      return { ...state, m4: { ...state.m4, ...action.patch } };
    case 'm5':
      return { ...state, m5: { ...state.m5, ...action.patch } };
    case 'm2Answer':
      // Fusion à partir de l'état courant : sûr même avec des clics très rapides.
      return { ...state, m2: { ...state.m2, answers: { ...state.m2.answers, [action.dial]: action.value } } };
    case 'm5Tile': {
      const cur = state.m5.seqs[action.sentence] ?? [];
      let next = cur;
      if (action.op === 'clear') next = [];
      else if (action.op === 'add' && action.tile && !cur.includes(action.tile)) next = [...cur, action.tile];
      else if (action.op === 'remove' && action.tile) next = cur.filter((t) => t !== action.tile);
      return { ...state, m5: { ...state.m5, seqs: { ...state.m5.seqs, [action.sentence]: next } } };
    }
    case 'bonusCorrect': {
      if (state.status[action.id] !== 'done') return state;
      const cur = state.bonus[action.id];
      if (cur.includes(action.index)) return state;
      return { ...state, bonus: { ...state.bonus, [action.id]: [...cur, action.index].sort() } };
    }
    case 'm1Count': {
      // Incrément calculé à partir de l'état courant : sûr même avec des clics très rapides.
      const v = Math.max(0, Math.min(10, state.m1.counts[action.id] + action.delta));
      return { ...state, m1: { ...state.m1, counts: { ...state.m1.counts, [action.id]: v } } };
    }
    case 'stat': {
      const s = state.stats[action.id];
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.id]: {
            errors: s.errors + (action.errors ?? 0),
            hints: s.hints + (action.hints ?? 0),
            usedTranscript: s.usedTranscript || !!action.usedTranscript,
          },
        },
      };
    }
    case 'completeStation': {
      if (state.status[action.id] === 'locked') return state;
      const status = { ...state.status, [action.id]: 'done' as const };
      const idx = STATION_IDS.indexOf(action.id);
      const next = STATION_IDS[idx + 1];
      if (next && status[next] === 'locked') status[next] = 'open';
      return { ...state, status };
    }
    case 'toggleSound':
      return { ...state, settings: { ...state.settings, sound: !state.settings.sound } };
    case 'toggleEnglish':
      return { ...state, settings: { ...state.settings, showEnglish: !state.settings.showEnglish } };
    case 'reset': {
      // On garde les réglages (son, traduction) : ce ne sont pas des progrès.
      const fresh = initialState();
      return { ...fresh, settings: state.settings };
    }
  }
}

export function allDone(state: GameState): boolean {
  return STATION_IDS.every((id) => state.status[id] === 'done');
}

export function fragmentsCount(state: GameState): number {
  return STATION_IDS.filter((id) => state.status[id] === 'done').length;
}

/* ------------------------------------------------------------------
   Validation d'une sauvegarde : tout ce qui vient du stockage est suspect.
   On reconstruit un état sûr ; en cas de doute, on revient à l'état initial.
   ------------------------------------------------------------------ */

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < 10_000;

export function sanitizeState(raw: unknown): GameState | null {
  if (!isObj(raw) || raw.version !== SAVE_VERSION) return null;
  const base = initialState();

  const group = GROUPS.includes(raw.group as Group) ? (raw.group as Group) : null;

  // Statuts : on n'accepte que des valeurs connues, puis on impose la cohérence
  // de la chaîne (une station n'est ouverte que si la précédente est terminée).
  const rawStatus = isObj(raw.status) ? raw.status : {};
  const status = { ...base.status };
  let prevDone = true;
  for (const id of STATION_IDS) {
    const v = rawStatus[id];
    if (!prevDone) status[id] = 'locked';
    else if (v === 'done') status[id] = 'done';
    else status[id] = 'open';
    prevDone = status[id] === 'done';
  }

  const rawStats = isObj(raw.stats) ? raw.stats : {};
  const stats = { ...base.stats };
  for (const id of STATION_IDS) {
    const s = rawStats[id];
    if (isObj(s)) {
      stats[id] = {
        errors: isInt(s.errors) ? s.errors : 0,
        hints: isInt(s.hints) ? s.hints : 0,
        usedTranscript: s.usedTranscript === true,
      };
    }
  }

  const m1 = initialM1();
  if (isObj(raw.m1)) {
    const r = raw.m1;
    if (r.phase === 'intro' || r.phase === 'find' || r.phase === 'count' || r.phase === 'reward') m1.phase = r.phase;
    const validIds = new Set(MARKET_ITEMS.filter((i) => i.onList).map((i) => i.id));
    if (Array.isArray(r.found)) {
      m1.found = [...new Set(r.found.filter((x): x is MarketItemId => validIds.has(x as MarketItemId)))];
    }
    if (isObj(r.counts)) {
      for (const row of COUNT_ROWS) {
        const v = r.counts[row.id];
        if (isInt(v) && v <= 10) m1.counts[row.id] = v;
      }
    }
  }
  if (status.lafayette === 'done') m1.phase = 'reward';

  const phaseOf = <P extends string>(v: unknown, allowed: readonly P[], fallback: P): P =>
    allowed.includes(v as P) ? (v as P) : fallback;

  const m2 = initialM2();
  if (isObj(raw.m2)) {
    m2.phase = phaseOf(raw.m2.phase, ['intro', 'console', 'reward'] as const, 'intro');
    const answers = raw.m2.answers;
    if (isObj(answers)) {
      for (const msg of RADIO_MESSAGES) {
        const a = answers[msg.id];
        if (typeof a === 'string' && msg.options.some((o) => o.id === a)) m2.answers[msg.id] = a;
      }
    }
  }
  if (status.portauprince === 'done') m2.phase = 'reward';
  else if (m2.phase === 'reward') m2.phase = 'console';

  const m3 = initialM3();
  if (isObj(raw.m3)) {
    m3.phase = phaseOf(raw.m3.phase, ['intro', 'chat', 'final', 'reward'] as const, 'intro');
    if (isInt(raw.m3.node) && raw.m3.node < CHAT.length) m3.node = raw.m3.node;
  }
  if (status.fortdefrance === 'done') m3.phase = 'reward';
  else if (m3.phase === 'reward') m3.phase = 'final';

  const m4 = initialM4();
  if (isObj(raw.m4)) {
    const r4 = raw.m4;
    m4.phase = phaseOf(r4.phase, ['intro', 'map', 'reward'] as const, 'intro');
    if (isInt(r4.step) && r4.step < STEPS.length) m4.step = r4.step;
    const at = PLACES.find((p) => p.id === r4.at);
    if (at) m4.at = at.id;
  }
  if (status.cayenne === 'done') m4.phase = 'reward';
  else if (m4.phase === 'reward') m4.phase = 'map';

  const m5 = initialM5();
  if (isObj(raw.m5)) {
    const r5 = raw.m5;
    m5.phase = phaseOf(r5.phase, ['intro', 'tiles', 'touch', 'reward'] as const, 'intro');
    const seqs = r5.seqs;
    if (isObj(seqs)) {
      for (const sen of SENTENCES) {
        const seq = seqs[sen.id];
        const ids = new Set(sen.tiles.map((t) => t.id));
        if (Array.isArray(seq) && seq.every((x) => typeof x === 'string' && ids.has(x))) {
          m5.seqs[sen.id] = [...new Set(seq as string[])];
        }
      }
    }
    const solved = r5.solved;
    if (Array.isArray(solved)) m5.solved = SENTENCES.map((x) => x.id).filter((id) => solved.includes(id));
    if (typeof r5.touch === 'string') m5.touch = r5.touch.slice(0, 60);
  }
  if (status.saintpierre === 'done') m5.phase = 'reward';
  else if (m5.phase === 'reward') m5.phase = 'touch';
  if (m5.phase === 'touch' && m5.solved.length < SENTENCES.length) m5.phase = 'tiles';

  const bonus = initialBonus();
  const rawBonus = raw.bonus;
  if (isObj(rawBonus)) {
    for (const id of STATION_IDS) {
      const arr = rawBonus[id];
      if (Array.isArray(arr) && status[id] === 'done') {
        bonus[id] = [...new Set(arr.filter((x): x is number => isInt(x) && x < BONUS[id].length))].sort();
      }
    }
  }

  const settings = { ...base.settings };
  if (isObj(raw.settings)) {
    if (typeof raw.settings.sound === 'boolean') settings.sound = raw.settings.sound;
    if (typeof raw.settings.showEnglish === 'boolean') settings.showEnglish = raw.settings.showEnglish;
  }

  let screen: Screen = (['home', 'briefing', 'map', 'mission', 'finale', 'teacher'] as const).includes(
    raw.screen as Screen,
  )
    ? (raw.screen as Screen)
    : 'home';
  let station: StationId | null = STATION_IDS.includes(raw.station as StationId) ? (raw.station as StationId) : null;
  if (!group && screen !== 'teacher') screen = 'home';
  if (screen === 'finale' && !STATION_IDS.every((id) => status[id] === 'done')) screen = 'map';
  if (screen === 'mission' && (!station || status[station] === 'locked')) screen = 'map';
  if (screen !== 'mission') station = null;

  return { version: SAVE_VERSION, group, screen, station, status, stats, m1, m2, m3, m4, m5, bonus, settings };
}
