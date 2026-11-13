import type { Bi } from './types';

/**
 * Mission 1 — Lafayette (Louisiane) : « Le marché de Claire »
 * Attentes : C1.2 (comprendre un texte avec visuels et mots familiers),
 *            C1.4 (mots apparentés), C3.1 (communauté francophone des Amériques).
 * Phase A : lire la liste et trouver 8 ingrédients parmi 18 produits.
 * Phase B : lire des nombres écrits en lettres et une inférence (P.-S.) pour régler les quantités.
 */

export type MarketItemId =
  | 'oignons'
  | 'tomates'
  | 'celeri'
  | 'carottes'
  | 'poivron-vert'
  | 'poivron-rouge'
  | 'pommes'
  | 'gombo'
  | 'citrons'
  | 'pain'
  | 'ail'
  | 'oeufs'
  | 'riz'
  | 'poisson'
  | 'fromage'
  | 'crevettes'
  | 'lait'
  | 'saucisse';

export type MarketItem = {
  id: MarketItemId;
  /** Groupe nominal tel qu'il apparaît dans la liste ou dans les rétroactions. */
  fr: string;
  en: string;
  shelf: 0 | 1 | 2;
  onList: boolean;
  /** Rétroaction si l'élève clique ce produit alors qu'il n'est pas sur la liste. */
  notOnList?: Bi;
};

const notListed = (fr: string, en: string): Bi => ({
  fr: `${fr} Ce n’est pas sur la liste.`,
  en: `${en} It’s not on the list.`,
});
const notListedPl = (fr: string, en: string): Bi => ({
  fr: `${fr} Ce n’est pas sur la liste.`,
  en: `${en} They’re not on the list.`,
});

/** Ordre = disposition sur l'étal (3 étagères × 6). */
export const MARKET_ITEMS: readonly MarketItem[] = [
  { id: 'oignons', fr: 'des oignons', en: 'onions', shelf: 0, onList: true },
  {
    id: 'tomates',
    fr: 'des tomates',
    en: 'tomatoes',
    shelf: 0,
    onList: false,
    notOnList: notListedPl('Ce sont des tomates.', 'Those are tomatoes.'),
  },
  { id: 'celeri', fr: 'du céleri', en: 'celery', shelf: 0, onList: true },
  {
    id: 'carottes',
    fr: 'des carottes',
    en: 'carrots',
    shelf: 0,
    onList: false,
    notOnList: notListedPl('Ce sont des carottes.', 'Those are carrots.'),
  },
  { id: 'poivron-vert', fr: 'un poivron vert', en: 'a green pepper', shelf: 0, onList: true },
  {
    id: 'poivron-rouge',
    fr: 'un poivron rouge',
    en: 'a red pepper',
    shelf: 0,
    onList: false,
    notOnList: {
      fr: 'C’est un poivron rouge. Claire veut un poivron vert.',
      en: 'That’s a red pepper. Claire wants a green pepper.',
    },
  },

  {
    id: 'pommes',
    fr: 'des pommes',
    en: 'apples',
    shelf: 1,
    onList: false,
    notOnList: notListedPl('Ce sont des pommes.', 'Those are apples.'),
  },
  { id: 'gombo', fr: 'du gombo', en: 'okra', shelf: 1, onList: true },
  {
    id: 'citrons',
    fr: 'des citrons',
    en: 'lemons',
    shelf: 1,
    onList: false,
    notOnList: notListedPl('Ce sont des citrons.', 'Those are lemons.'),
  },
  {
    id: 'pain',
    fr: 'du pain',
    en: 'bread',
    shelf: 1,
    onList: false,
    notOnList: notListed('C’est du pain.', 'That’s bread.'),
  },
  { id: 'ail', fr: 'de l’ail', en: 'garlic', shelf: 1, onList: true },
  {
    id: 'oeufs',
    fr: 'des œufs',
    en: 'eggs',
    shelf: 1,
    onList: false,
    notOnList: notListedPl('Ce sont des œufs.', 'Those are eggs.'),
  },

  { id: 'riz', fr: 'du riz', en: 'rice', shelf: 2, onList: true },
  {
    id: 'poisson',
    fr: 'du poisson',
    en: 'fish',
    shelf: 2,
    onList: false,
    notOnList: notListed('C’est du poisson.', 'That’s fish.'),
  },
  {
    id: 'fromage',
    fr: 'du fromage',
    en: 'cheese',
    shelf: 2,
    onList: false,
    notOnList: notListed('C’est du fromage.', 'That’s cheese.'),
  },
  { id: 'crevettes', fr: 'des crevettes', en: 'shrimp', shelf: 2, onList: true },
  {
    id: 'lait',
    fr: 'du lait',
    en: 'milk',
    shelf: 2,
    onList: false,
    notOnList: notListed('C’est du lait.', 'That’s milk.'),
  },
  { id: 'saucisse', fr: 'de la saucisse', en: 'sausage', shelf: 2, onList: true },
];

/** La liste de Claire, dans l'ordre où elle l'a écrite. */
export const SHOPPING_LIST: readonly MarketItemId[] = [
  'oignons',
  'celeri',
  'poivron-vert',
  'crevettes',
  'riz',
  'ail',
  'saucisse',
  'gombo',
];

export const SHELF_NAMES: readonly Bi[] = [
  { fr: 'l’étagère du haut', en: 'the top shelf' },
  { fr: 'l’étagère du milieu', en: 'the middle shelf' },
  { fr: 'l’étagère du bas', en: 'the bottom shelf' },
];

export const M1_TEXT = {
  briefing: {
    fr: 'Première station : Lafayette, en Louisiane. Claire anime Radio Bayou. Elle prépare le repas du festival. Aide-la au marché. Elle a le premier mot-clé!',
    en: 'First station: Lafayette, Louisiana. Claire hosts Radio Bayou. She is preparing the festival meal. Help her at the market. She has the first keyword!',
  },
  claireHello: {
    fr: 'Bonjour, agent! Je prépare un gombo pour le festival. Voici ma liste. Trouve les ingrédients au marché, s’il te plaît!',
    en: 'Hello, agent! I’m making a gumbo for the festival. Here is my list. Please find the ingredients at the market!',
  },
  findInstruction: {
    fr: 'Lis la liste de Claire. Clique sur chaque ingrédient au marché.',
    en: 'Read Claire’s list. Click each ingredient at the market.',
  },
  listTitle: { fr: 'Ma liste pour le gombo', en: 'My list for the gumbo' },
  found: { fr: 'Bien vu!', en: 'Well spotted!' },
  alreadyFound: { fr: 'Déjà trouvé!', en: 'Already found!' },
  readFirst: {
    fr: 'Lis d’abord un mot de la liste. Ensuite, cherche-le au marché.',
    en: 'First read one word on the list. Then look for it at the market.',
  },
  allFound: {
    fr: 'Tu as trouvé les huit ingrédients!',
    en: 'You found all eight ingredients!',
  },

  countIntro: {
    fr: 'Super! Maintenant, il faut acheter la bonne quantité. Il y a trente personnes au festival!',
    en: 'Great! Now we need to buy the right amount. There are thirty people at the festival!',
  },
  countInstruction: {
    fr: 'Lis le message de Claire. Combien faut-il acheter? Règle les quantités.',
    en: 'Read Claire’s message. How many do we need to buy? Set the quantities.',
  },
  noteTitle: { fr: 'Pour le gombo, il faut :', en: 'For the gumbo, we need:' },
  notePs: { fr: 'P.-S. J’ai déjà deux oignons à la maison!', en: 'P.S. I already have two onions at home!' },
  countAllOk: { fr: 'Parfait! Le panier est prêt.', en: 'Perfect! The basket is ready.' },
  countSomeWrong: {
    fr: 'Presque! Regarde les lignes marquées « À revoir ».',
    en: 'Almost! Look at the lines marked “À revoir” (check again).',
  },
  check: { fr: 'Vérifier', en: 'Check' },
} as const;

export type CountRow = {
  id: 'oignons' | 'poivrons' | 'crevettes' | 'riz' | 'saucisses';
  /** Ligne telle qu'elle est écrite dans le message de Claire. */
  noteLine: string;
  /** Étiquette du pas-à-pas. */
  label: Bi;
  /** Quantité à acheter. */
  answer: number;
  /** Mot du nombre dans la note (pour l'indice de niveau 2). */
  numberWord: string;
  numberValue: number;
};

export const COUNT_ROWS: readonly CountRow[] = [
  {
    id: 'oignons',
    noteLine: 'quatre oignons',
    label: { fr: 'oignons', en: 'onions' },
    answer: 2,
    numberWord: 'quatre',
    numberValue: 4,
  },
  {
    id: 'poivrons',
    noteLine: 'deux poivrons verts',
    label: { fr: 'poivrons verts', en: 'green peppers' },
    answer: 2,
    numberWord: 'deux',
    numberValue: 2,
  },
  {
    id: 'crevettes',
    noteLine: 'trois kilos de crevettes',
    label: { fr: 'kilos de crevettes', en: 'kilos of shrimp' },
    answer: 3,
    numberWord: 'trois',
    numberValue: 3,
  },
  {
    id: 'riz',
    noteLine: 'un sac de riz',
    label: { fr: 'sac(s) de riz', en: 'bag(s) of rice' },
    answer: 1,
    numberWord: 'un',
    numberValue: 1,
  },
  {
    id: 'saucisses',
    noteLine: 'six saucisses',
    label: { fr: 'saucisses', en: 'sausages' },
    answer: 6,
    numberWord: 'six',
    numberValue: 6,
  },
];

export const COUNT_MAX = 10;

export const M1_REWARD = {
  title: { fr: 'Station 1 rallumée!', en: 'Station 1 is back on!' },
  claireThanks: {
    fr: 'Merci, agent! Voici le premier mot-clé pour l’invitation : le menu du festival.',
    en: 'Thank you, agent! Here is the first keyword for the invitation: the festival menu.',
  },
  culture: [
    {
      fr: 'En Louisiane, le mot « gombo » a deux sens : c’est un légume (okra en anglais) et c’est aussi le nom du plat!',
      en: 'In Louisiana, the word “gombo” has two meanings: it’s a vegetable (okra) and it’s also the name of the dish (gumbo)!',
    },
    {
      fr: 'Dans la cuisine cadienne, l’oignon, le céleri et le poivron vert s’appellent « la sainte trinité ».',
      en: 'In Cajun cooking, onion, celery and green pepper are called “the holy trinity”.',
    },
  ] as readonly Bi[],
} as const;

/** Carnet de mots de la mission 1 : outils, pas les réponses de la phase A. */
export const M1_GLOSSARY: readonly Bi[] = [
  { fr: 'un, une', en: 'a, an' },
  { fr: 'du, de la, de l’, des', en: 'some' },
  { fr: 'vert / rouge', en: 'green / red' },
  { fr: 'la liste', en: 'the list' },
  { fr: 'le marché', en: 'the market' },
  { fr: 'il faut…', en: 'we need… / it takes…' },
  { fr: 'acheter', en: 'to buy' },
  { fr: 'combien?', en: 'how many? / how much?' },
  { fr: 'déjà', en: 'already' },
  { fr: 'à la maison', en: 'at home' },
  { fr: 'un sac', en: 'a bag' },
];

export const NUMBERS_1_10: readonly { word: string; value: number }[] = [
  { word: 'un', value: 1 },
  { word: 'deux', value: 2 },
  { word: 'trois', value: 3 },
  { word: 'quatre', value: 4 },
  { word: 'cinq', value: 5 },
  { word: 'six', value: 6 },
  { word: 'sept', value: 7 },
  { word: 'huit', value: 8 },
  { word: 'neuf', value: 9 },
  { word: 'dix', value: 10 },
];
