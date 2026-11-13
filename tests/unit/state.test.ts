import { describe, expect, it } from 'vitest';
import { initialState, reducer, sanitizeState, SAVE_VERSION, type GameState } from '../../src/state/game';
import { createStore, SAVE_KEY } from '../../src/save/storage';

class MemStorage implements Storage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
}

class BrokenStorage extends MemStorage {
  setItem(): void {
    throw new Error('QuotaExceeded / bloqué');
  }
  getItem(): string | null {
    throw new Error('bloqué');
  }
}

const withGroup = (): GameState => reducer(initialState(), { type: 'chooseGroup', group: '7-15' });

describe('Réducteur — progression', () => {
  it('premier lancement : accueil, station 1 ouverte, les autres verrouillées', () => {
    const s = initialState();
    expect(s.screen).toBe('home');
    expect(s.status.lafayette).toBe('open');
    expect(s.status.portauprince).toBe('locked');
    expect(s.status.saintpierre).toBe('locked');
  });

  it('impossible de quitter l’accueil sans choisir un groupe', () => {
    expect(reducer(initialState(), { type: 'goto', screen: 'map' }).screen).toBe('home');
    expect(reducer(withGroup(), { type: 'goto', screen: 'map' }).screen).toBe('map');
  });

  it('accès direct à une station verrouillée : refusé', () => {
    const s = reducer(withGroup(), { type: 'enterStation', id: 'cayenne' });
    expect(s.screen).not.toBe('mission');
    expect(reducer(withGroup(), { type: 'completeStation', id: 'cayenne' }).status.cayenne).toBe('locked');
  });

  it('terminer une station ouvre la suivante, une seule fois', () => {
    let s = reducer(withGroup(), { type: 'completeStation', id: 'lafayette' });
    expect(s.status.lafayette).toBe('done');
    expect(s.status.portauprince).toBe('open');
    expect(s.status.fortdefrance).toBe('locked');
    s = reducer(s, { type: 'completeStation', id: 'lafayette' });
    expect(s.status.fortdefrance).toBe('locked');
  });

  it('les incréments rapides du panier s’additionnent et restent bornés', () => {
    let s = withGroup();
    for (let i = 0; i < 4; i++) s = reducer(s, { type: 'm1Count', id: 'oignons', delta: 1 });
    expect(s.m1.counts.oignons).toBe(4);
    for (let i = 0; i < 20; i++) s = reducer(s, { type: 'm1Count', id: 'oignons', delta: 1 });
    expect(s.m1.counts.oignons).toBe(10);
    for (let i = 0; i < 20; i++) s = reducer(s, { type: 'm1Count', id: 'oignons', delta: -1 });
    expect(s.m1.counts.oignons).toBe(0);
  });

  it('recommencer efface la progression mais garde les réglages', () => {
    let s = reducer(withGroup(), { type: 'toggleSound' });
    s = reducer(s, { type: 'completeStation', id: 'lafayette' });
    s = reducer(s, { type: 'reset' });
    expect(s.group).toBeNull();
    expect(s.status.lafayette).toBe('open');
    expect(s.settings.sound).toBe(false);
  });
});

describe('Validation des sauvegardes', () => {
  it('relit un état valide sans perte', () => {
    let s = reducer(withGroup(), { type: 'm1', patch: { phase: 'find', found: ['oignons', 'riz'] } });
    s = reducer(s, { type: 'enterStation', id: 'lafayette' });
    const back = sanitizeState(JSON.parse(JSON.stringify(s)));
    expect(back).toEqual(s);
  });

  it('rejette une version inconnue ou des données non-objet', () => {
    expect(sanitizeState(null)).toBeNull();
    expect(sanitizeState('texte')).toBeNull();
    expect(sanitizeState({ ...initialState(), version: SAVE_VERSION + 1 })).toBeNull();
  });

  it('répare une chaîne de stations incohérente (station 4 « done » sans les précédentes)', () => {
    const raw = {
      ...withGroup(),
      status: {
        lafayette: 'open',
        portauprince: 'locked',
        fortdefrance: 'locked',
        cayenne: 'done',
        saintpierre: 'open',
      },
    };
    const s = sanitizeState(raw)!;
    expect(s.status.cayenne).toBe('locked');
    expect(s.status.saintpierre).toBe('locked');
  });

  it('ramène à la carte si la sauvegarde pointe vers une mission verrouillée', () => {
    const raw = { ...withGroup(), screen: 'mission', station: 'saintpierre' };
    const s = sanitizeState(raw)!;
    expect(s.screen).toBe('map');
    expect(s.station).toBeNull();
  });

  it('ramène à l’accueil si aucun groupe valide', () => {
    expect(sanitizeState({ ...initialState(), group: '9-99', screen: 'map' })!.screen).toBe('home');
  });

  it('filtre les produits inconnus ou hors liste et les quantités invalides', () => {
    const raw = {
      ...withGroup(),
      m1: { phase: 'count', found: ['riz', 'riz', 'tomates', 'xxx'], counts: { oignons: 99, riz: 1, crevettes: -2 } },
    };
    const s = sanitizeState(raw)!;
    expect(s.m1.found).toEqual(['riz']);
    expect(s.m1.counts.oignons).toBe(0);
    expect(s.m1.counts.riz).toBe(1);
    expect(s.m1.counts.crevettes).toBe(0);
  });
});

describe('Stockage local', () => {
  it('nouveau → sauvegarde → reprise', () => {
    const mem = new MemStorage();
    const store = createStore(mem);
    expect(store.load().status).toBe('new');
    const s = withGroup();
    expect(store.save(s)).toBe(true);
    const again = createStore(mem).load();
    expect(again.status).toBe('restored');
    expect(again.state?.group).toBe('7-15');
  });

  it('JSON corrompu → statut « corrupt », pas de plantage', () => {
    const mem = new MemStorage();
    mem.setItem(SAVE_KEY, '{pas du json');
    expect(createStore(mem).load()).toEqual({ state: null, status: 'corrupt' });
  });

  it('stockage bloqué → repli en mémoire, jeu jouable', () => {
    const store = createStore(new BrokenStorage());
    expect(store.available).toBe(false);
    expect(store.load().status).toBe('unavailable');
    expect(store.save(withGroup())).toBe(false);
    expect(store.load().state?.group).toBe('7-15');
  });

  it('stockage absent (null) → indisponible', () => {
    const store = createStore(null);
    expect(store.available).toBe(false);
  });

  it('clear efface la sauvegarde', () => {
    const mem = new MemStorage();
    const store = createStore(mem);
    store.save(withGroup());
    store.clear();
    expect(store.load().status).toBe('new');
  });

  it('aucune donnée identifiante dans la sauvegarde', () => {
    const mem = new MemStorage();
    createStore(mem).save(withGroup());
    const json = mem.getItem(SAVE_KEY)!;
    // Aucune clé de type nom, courriel, adresse IP, appareil.
    expect(json).not.toMatch(/"(name|nom|prenom|email|courriel|ip|device|userAgent)"s*:/i);
  });
});
