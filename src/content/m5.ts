import type { Bi } from './types';

/**
 * Mission 5 — Saint-Pierre (Saint-Pierre-et-Miquelon) : « Le message du phare »
 * Attentes : D1.3 (ordre des mots, place de l'adjectif, accord de l'article, orthographe),
 *            D1.2 (forme : invitation — occasion, date, heure, lieu), C3.2 (registre « vous »).
 * Réutilise les quatre mots-clés. Ce n'est pas un test de mémoire : les mots-clés sont affichés,
 * la difficulté est d'écrire des phrases correctes.
 */

export type Tile = { id: string; text: string };

export type TileSentence = {
  id: string;
  label: Bi; // rôle de la phrase dans l'invitation
  tiles: Tile[]; // dans l'ordre d'affichage (mélangé)
  /** Ordres acceptés (ids). Plusieurs ordres valables = toutes acceptés. */
  accepted: string[][];
  /** Rétroaction ciblée selon l'erreur la plus probable. */
  checks: { when: (seq: string[]) => boolean; feedback: Bi }[];
  hint: [Bi, Bi];
};

const has = (seq: string[], id: string) => seq.includes(id);
const before = (seq: string[], a: string, b: string) =>
  seq.indexOf(a) > -1 && seq.indexOf(b) > -1 && seq.indexOf(a) < seq.indexOf(b);

export const SENTENCES: readonly TileSentence[] = [
  {
    id: 's1',
    label: { fr: 'L’invitation (le ton)', en: 'The invitation (the tone)' },
    tiles: [
      { id: 'francophone', text: 'francophone' },
      { id: 'venez', text: 'Venez' },
      { id: 'festival', text: 'festival' },
      { id: 'viens', text: 'Viens' },
      { id: 'au', text: 'au' },
    ],
    accepted: [['venez', 'au', 'festival', 'francophone']],
    checks: [
      {
        when: (s) => has(s, 'viens'),
        feedback: {
          fr: '« Viens », c’est pour un seul ami. On invite tout le réseau : utilise le mot-clé de Fort-de-France.',
          en: '“Viens” is for one friend. We’re inviting the whole network: use the keyword from Fort-de-France.',
        },
      },
      {
        when: (s) => before(s, 'francophone', 'festival'),
        feedback: {
          fr: 'En français, l’adjectif « francophone » se place après le nom : « festival francophone ».',
          en: 'In French, the adjective “francophone” goes after the noun: “festival francophone”.',
        },
      },
    ],
    hint: [
      {
        fr: 'Commence par le verbe pour inviter : le mot-clé n° 3.',
        en: 'Start with the verb that invites: keyword no. 3.',
      },
      {
        fr: 'Venez + au + festival + … (l’adjectif est après le nom).',
        en: 'Venez + au + festival + … (the adjective goes after the noun).',
      },
    ],
  },
  {
    id: 's2',
    label: { fr: 'Quand et où?', en: 'When and where?' },
    tiles: [
      { id: 'samedi', text: 'samedi' },
      { id: 'le', text: 'Le' },
      { id: 'auport', text: 'au port' },
      { id: 'est', text: 'est' },
      { id: 'a14h', text: 'à 14 h' },
      { id: 'festival', text: 'festival' },
    ],
    accepted: [
      ['le', 'festival', 'est', 'samedi', 'a14h', 'auport'],
      ['le', 'festival', 'est', 'auport', 'samedi', 'a14h'],
    ],
    checks: [
      {
        when: (s) => s[0] !== 'le',
        feedback: {
          fr: 'La phrase commence par une majuscule : « Le ».',
          en: 'The sentence starts with a capital letter: “Le”.',
        },
      },
      {
        when: (s) => !(s[1] === 'festival' && s[2] === 'est'),
        feedback: {
          fr: 'Sujet + verbe : « Le festival est… ».',
          en: 'Subject + verb: “Le festival est…” (The festival is…).',
        },
      },
      {
        when: (s) => before(s, 'a14h', 'samedi'),
        feedback: {
          fr: 'On dit le jour, puis l’heure : « samedi à 14 h ».',
          en: 'Say the day, then the time: “samedi à 14 h”.',
        },
      },
    ],
    hint: [
      { fr: 'Commence par « Le festival est… ».', en: 'Start with “Le festival est…”.' },
      { fr: 'Ensuite : le jour, l’heure, puis le lieu.', en: 'Then: the day, the time, then the place.' },
    ],
  },
  {
    id: 's3',
    label: { fr: 'Le menu', en: 'The menu' },
    tiles: [
      { id: 'gombo', text: 'gombo' },
      { id: 'au', text: 'au' },
      { id: 'il', text: 'Il' },
      { id: 'a', text: 'a' },
      { id: 'menu', text: 'menu' },
      { id: 'un', text: 'un' },
      { id: 'y', text: 'y' },
    ],
    accepted: [['il', 'y', 'a', 'un', 'gombo', 'au', 'menu']],
    checks: [
      {
        when: (s) => !(s[0] === 'il' && s[1] === 'y' && s[2] === 'a'),
        feedback: {
          fr: '« Il y a » (there is) : trois petits mots, toujours ensemble.',
          en: '“Il y a” (there is): three small words, always together.',
        },
      },
      {
        when: (s) => !before(s, 'un', 'gombo') || s.indexOf('gombo') - s.indexOf('un') !== 1,
        feedback: {
          fr: 'L’article va juste avant le nom : « un gombo ».',
          en: 'The article goes right before the noun: “un gombo”.',
        },
      },
    ],
    hint: [
      { fr: 'Commence par « Il y a… » (There is…).', en: 'Start with “Il y a…” (There is…).' },
      { fr: 'Il y a + un gombo + au menu.', en: 'Il y a + un gombo + au menu.' },
    ],
  },
];

/** Partie B : « J'apporte… ». L'élève écrit l'article ET le nom. */
export type Food = {
  noun: string;
  en: string;
  gender: 'm' | 'f';
  plural: boolean;
  /** Articles acceptés comme corrects. */
  ok: string[];
  /** Articles corrects mais moins naturels ici : acceptés avec une remarque. */
  okNote?: string[];
};

export const FOODS: readonly Food[] = [
  { noun: 'pain', en: 'bread', gender: 'm', plural: false, ok: ['du', 'un'], okNote: ['le'] },
  { noun: 'fromage', en: 'cheese', gender: 'm', plural: false, ok: ['du', 'un'], okNote: ['le'] },
  { noun: 'gâteau', en: 'cake', gender: 'm', plural: false, ok: ['du', 'un'], okNote: ['le'] },
  { noun: 'riz', en: 'rice', gender: 'm', plural: false, ok: ['du'], okNote: ['le'] },
  { noun: 'limonade', en: 'lemonade', gender: 'f', plural: false, ok: ['de la', 'une'], okNote: ['la'] },
  { noun: 'salade', en: 'salad', gender: 'f', plural: false, ok: ['de la', 'une'], okNote: ['la'] },
  { noun: 'musique', en: 'music', gender: 'f', plural: false, ok: ['de la'], okNote: ['la'] },
  { noun: 'pommes', en: 'apples', gender: 'f', plural: true, ok: ['des'], okNote: ['les'] },
  { noun: 'citrons', en: 'lemons', gender: 'm', plural: true, ok: ['des'], okNote: ['les'] },
  { noun: 'tomates', en: 'tomatoes', gender: 'f', plural: true, ok: ['des'], okNote: ['les'] },
];

export const M5_TEXT = {
  briefing: {
    fr: 'Dernière station : Saint-Pierre, sur l’archipel de Saint-Pierre-et-Miquelon. Le phare peut envoyer l’invitation à tout le réseau!',
    en: 'Last station: Saint-Pierre, in the Saint Pierre and Miquelon islands. The lighthouse can send the invitation to the whole network!',
  },
  keeperHello: {
    fr: 'Bonjour, agent! Je suis Hélène, la gardienne du phare. Le message est en morceaux. Remets les mots dans l’ordre!',
    en: 'Hello, agent! I’m Hélène, the lighthouse keeper. The message is in pieces. Put the words back in order!',
  },
  tilesInstruction: {
    fr: 'Clique sur les mots dans le bon ordre pour écrire chaque phrase. Clique sur un mot placé pour l’enlever.',
    en: 'Click the words in the right order to write each sentence. Click a placed word to remove it.',
  },
  touchInstruction: {
    fr: 'Ajoute ta touche personnelle : qu’est-ce que tu apportes au festival? Écris l’article et le nom.',
    en: 'Add your personal touch: what are you bringing to the festival? Write the article and the noun.',
  },
  touchStarter: 'J’apporte',
  touchPlaceholder: 'du pain',
  articleHelp: {
    fr: 'masculin → du · féminin → de la · pluriel → des',
    en: 'masculine → du · feminine → de la · plural → des',
  },
  check: { fr: 'Vérifier', en: 'Check' },
  clear: { fr: 'Effacer', en: 'Clear' },
  sentenceOk: { fr: 'Phrase correcte!', en: 'Correct sentence!' },
  sentenceIncomplete: { fr: 'Il manque des mots.', en: 'Some words are missing.' },
  sentenceWrong: { fr: 'L’ordre n’est pas encore bon.', en: 'The order isn’t right yet.' },
  transmit: { fr: 'Allumer le phare et transmettre', en: 'Light the lighthouse and transmit' },
  keywordsTitle: { fr: 'Tes mots-clés', en: 'Your keywords' },
} as const;

export const M5_REWARD = {
  thanks: {
    fr: 'Le phare brille! L’invitation part vers toutes les stations du Réseau Écho. Mission accomplie, agent!',
    en: 'The lighthouse is shining! The invitation is going out to every Écho Network station. Mission accomplished, agent!',
  },
  culture: [
    {
      fr: 'Saint-Pierre-et-Miquelon est un archipel français, tout près de Terre-Neuve.',
      en: 'Saint Pierre and Miquelon is a French archipelago, very close to Newfoundland.',
    },
    {
      fr: 'Beaucoup d’habitants ont des ancêtres basques, bretons ou normands.',
      en: 'Many inhabitants have Basque, Breton or Norman ancestors.',
    },
  ] as readonly Bi[],
} as const;

export const M5_GLOSSARY: readonly Bi[] = [
  { fr: 'Venez!', en: 'Come! (to many people)' },
  { fr: 'il y a', en: 'there is / there are' },
  { fr: 'au menu', en: 'on the menu' },
  { fr: 'j’apporte', en: 'I’m bringing' },
  { fr: 'du (m.) / de la (f.) / des (pl.)', en: 'some' },
  { fr: 'un gâteau, une limonade, une salade', en: 'a cake, a lemonade, a salad' },
  { fr: 'le phare', en: 'the lighthouse' },
  { fr: 'la gardienne', en: 'the keeper' },
];
