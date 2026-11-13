import { sanitizeState, type GameState } from '../state/game';

export const SAVE_KEY = 'mission-francophonie:signal-perdu:v1';

export type LoadStatus = 'new' | 'restored' | 'corrupt' | 'unavailable';

/** Stockage local du Chromebook, avec repli en mémoire si localStorage est bloqué. */
export type SaveStore = {
  available: boolean;
  load(): { state: GameState | null; status: LoadStatus };
  save(state: GameState): boolean;
  clear(): void;
};

function probe(storage: Storage | null | undefined): boolean {
  if (!storage) return false;
  try {
    const k = '__mf_probe__';
    storage.setItem(k, '1');
    storage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function createStore(storage: Storage | null | undefined = safeLocalStorage()): SaveStore {
  const available = probe(storage);
  let memory: string | null = null;

  return {
    available,
    load() {
      let raw: string | null;
      try {
        raw = available && storage ? storage.getItem(SAVE_KEY) : memory;
      } catch {
        return { state: null, status: 'unavailable' };
      }
      if (raw === null) return { state: null, status: available ? 'new' : 'unavailable' };
      try {
        const state = sanitizeState(JSON.parse(raw));
        return state ? { state, status: 'restored' } : { state: null, status: 'corrupt' };
      } catch {
        return { state: null, status: 'corrupt' };
      }
    },
    save(state) {
      // Aucune donnée identifiante : groupe, progression, réglages. Rien n'est transmis.
      const json = JSON.stringify(state);
      if (!available || !storage) {
        memory = json;
        return false;
      }
      try {
        storage.setItem(SAVE_KEY, json);
        return true;
      } catch {
        memory = json;
        return false;
      }
    },
    clear() {
      memory = null;
      try {
        storage?.removeItem(SAVE_KEY);
      } catch {
        /* stockage indisponible : rien à effacer */
      }
    },
  };
}

function safeLocalStorage(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}
