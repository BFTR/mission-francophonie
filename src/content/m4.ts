import type { Bi } from './types';

/**
 * Mission 4 — Cayenne (Guyane) : « Le rendez-vous en ville »
 * Attentes : C1.1 (stratégies : repérer le mot important, faux amis, indices de contexte),
 *            C1.2 (comprendre de courts messages : texto, note, affiche), C3.1.
 * Mécanique : l'élève lit un message, puis choisit où aller sur le plan de la ville.
 * Un mauvais choix mène à une impasse expliquée (la description du lieu enseigne du vocabulaire).
 */

export type PlaceId =
  'bibliotheque' | 'musee' | 'cafe-musee' | 'cafe-gare' | 'gare' | 'marche' | 'place' | 'ecole' | 'port';

export type Place = { id: PlaceId; name: Bi; desc: Bi; x: number; y: number };

/** Coordonnées sur le plan (viewBox 0 0 1000 620). */
export const PLACES: readonly Place[] = [
  {
    id: 'bibliotheque',
    name: { fr: 'la bibliothèque', en: 'the library' },
    desc: { fr: 'La bibliothèque : on emprunte des livres ici.', en: 'The library: you borrow books here.' },
    x: 180,
    y: 150,
  },
  {
    id: 'ecole',
    name: { fr: 'l’école', en: 'the school' },
    desc: {
      fr: 'L’école : les élèves apprennent ici. Aujourd’hui, c’est fermé.',
      en: 'The school: students learn here. Today, it’s closed.',
    },
    x: 430,
    y: 120,
  },
  {
    id: 'gare',
    name: { fr: 'la gare routière', en: 'the bus station' },
    desc: { fr: 'La gare routière : les bus partent d’ici.', en: 'The bus station: buses leave from here.' },
    x: 800,
    y: 130,
  },
  {
    id: 'cafe-gare',
    name: { fr: 'le café (près de la gare)', en: 'the café (near the bus station)' },
    desc: {
      fr: 'Un café, à côté de la gare routière : on boit et on mange ici.',
      en: 'A café, next to the bus station: you drink and eat here.',
    },
    x: 860,
    y: 300,
  },
  {
    id: 'place',
    name: { fr: 'la place des Palmistes', en: 'Place des Palmistes (square)' },
    desc: {
      fr: 'La place des Palmistes : une grande place avec des palmiers.',
      en: 'Place des Palmistes: a big square with palm trees.',
    },
    x: 500,
    y: 330,
  },
  {
    id: 'marche',
    name: { fr: 'le marché', en: 'the market' },
    desc: { fr: 'Le marché : on achète des fruits et des légumes.', en: 'The market: you buy fruits and vegetables.' },
    x: 180,
    y: 400,
  },
  {
    id: 'musee',
    name: { fr: 'le musée', en: 'the museum' },
    desc: {
      fr: 'Le musée : on regarde de l’art et des objets anciens.',
      en: 'The museum: you look at art and old objects.',
    },
    x: 700,
    y: 470,
  },
  {
    id: 'cafe-musee',
    name: { fr: 'le café (près du musée)', en: 'the café (near the museum)' },
    desc: {
      fr: 'Un café, à côté du musée : on boit et on mange ici.',
      en: 'A café, next to the museum: you drink and eat here.',
    },
    x: 860,
    y: 520,
  },
  {
    id: 'port',
    name: { fr: 'le port', en: 'the harbour' },
    desc: { fr: 'Le port : les bateaux arrivent ici.', en: 'The harbour: boats arrive here.' },
    x: 380,
    y: 560,
  },
];

export type Step = {
  from: Bi; // qui écrit et sous quelle forme
  kind: 'sms' | 'note' | 'voice';
  message: Bi;
  keyWords: string; // mot(s) à surligner dans le message (indice 1)
  answer: PlaceId;
  hints: [Bi, Bi]; // niveaux 1 et 2 ; le niveau 3 fait clignoter le lieu
  /** Rétroaction ciblée pour un mauvais lieu plausible. */
  near?: Partial<Record<PlaceId, Bi>>;
  arrive: Bi; // ce qui se passe quand on arrive au bon endroit
};

export const STEPS: readonly Step[] = [
  {
    from: { fr: 'Texto d’Inès', en: 'Text from Inès' },
    kind: 'sms',
    message: {
      fr: 'Salut, agent! Je ne suis pas à la maison. Je suis dans un endroit calme, avec beaucoup de livres.',
      en: 'Hi, agent! I’m not at home. I’m in a quiet place, with lots of books.',
    },
    keyWords: 'beaucoup de livres',
    answer: 'bibliotheque',
    hints: [
      { fr: 'Le mot important : « livres » (books).', en: 'The important word: “livres” (books).' },
      {
        fr: 'Attention, faux ami : « bibliothèque » = library. Une « librairie », c’est un magasin de livres!',
        en: 'Careful, false friend: “bibliothèque” = library. A “librairie” is a bookstore!',
      },
    ],
    near: {
      ecole: {
        fr: 'Il y a des livres à l’école, mais aujourd’hui, c’est fermé. Où est-ce calme, avec beaucoup de livres?',
        en: 'There are books at school, but today it’s closed. Where is it quiet, with lots of books?',
      },
    },
    arrive: {
      fr: 'Tu arrives à la bibliothèque. Inès n’est plus là! Le bibliothécaire te donne une note.',
      en: 'You arrive at the library. Inès is gone! The librarian gives you a note.',
    },
  },
  {
    from: { fr: 'Note du bibliothécaire', en: 'Note from the librarian' },
    kind: 'note',
    message: {
      fr: 'Inès est partie! Elle achète des fruits et des légumes pour le festival.',
      en: 'Inès has left! She is buying fruits and vegetables for the festival.',
    },
    keyWords: 'des fruits et des légumes',
    answer: 'marche',
    hints: [
      {
        fr: 'Le mot important : « fruits et légumes ».',
        en: 'The important words: “fruits et légumes” (fruits and vegetables).',
      },
      {
        fr: 'Où achète-t-on des légumes? Pense à Claire, à Lafayette!',
        en: 'Where do you buy vegetables? Think of Claire in Lafayette!',
      },
    ],
    arrive: {
      fr: 'Tu arrives au marché. Une marchande te parle.',
      en: 'You arrive at the market. A vendor speaks to you.',
    },
  },
  {
    from: { fr: 'La marchande', en: 'The vendor' },
    kind: 'voice',
    message: {
      fr: 'Inès? Elle a ses légumes. Maintenant, elle est sur la grande place, avec les palmiers!',
      en: 'Inès? She has her vegetables. Now she’s on the big square, with the palm trees!',
    },
    keyWords: 'la grande place, avec les palmiers',
    answer: 'place',
    hints: [
      { fr: 'Le mot important : « palmiers » (palm trees).', en: 'The important word: “palmiers” (palm trees).' },
      {
        fr: 'Cherche une place sur le plan. Son nom ressemble à « palmiers ».',
        en: 'Look for a square on the map. Its name looks like “palmiers”.',
      },
    ],
    arrive: {
      fr: 'Tu arrives sur la place des Palmistes. Ton téléphone vibre : un nouveau texto!',
      en: 'You arrive at Place des Palmistes. Your phone buzzes: a new text!',
    },
  },
  {
    from: { fr: 'Texto d’Inès', en: 'Text from Inès' },
    kind: 'sms',
    message: {
      fr: 'Désolée, j’ai faim! Je suis au café, à côté du musée. Je t’attends!',
      en: 'Sorry, I’m hungry! I’m at the café next to the museum. I’m waiting for you!',
    },
    keyWords: 'au café, à côté du musée',
    answer: 'cafe-musee',
    hints: [
      {
        fr: 'Lis bien la fin : « à côté du musée ».',
        en: 'Read the end carefully: “à côté du musée” (next to the museum).',
      },
      { fr: 'Il y a deux cafés. Trouve d’abord le musée.', en: 'There are two cafés. First find the museum.' },
    ],
    near: {
      'cafe-gare': {
        fr: 'C’est un café, mais il est à côté de la gare routière. Relis : « à côté du musée ».',
        en: 'It’s a café, but it’s next to the bus station. Reread: “à côté du musée”.',
      },
      musee: {
        fr: 'Tu es au musée. Inès n’est pas dedans : elle est au café, à côté.',
        en: 'You’re at the museum. Inès is not inside: she’s at the café next door.',
      },
    },
    arrive: {
      fr: 'Tu trouves Inès au café, à côté du musée!',
      en: 'You find Inès at the café next to the museum!',
    },
  },
];

export const M4_TEXT = {
  briefing: {
    fr: 'Quatrième station : Cayenne, en Guyane. Inès a le mot-clé, mais elle bouge beaucoup. Lis ses messages pour la trouver!',
    en: 'Fourth station: Cayenne, French Guiana. Inès has the keyword, but she moves around a lot. Read her messages to find her!',
  },
  instruction: {
    fr: 'Lis le message. Clique sur le bon endroit sur le plan.',
    en: 'Read the message. Click the right place on the map.',
  },
  notHere: { fr: 'Inès n’est pas ici. Relis le message.', en: 'Inès is not here. Reread the message.' },
  you: { fr: 'Tu es ici', en: 'You are here' },
  next: { fr: 'Lire le message suivant', en: 'Read the next message' },
} as const;

export const M4_REWARD = {
  thanks: {
    fr: 'Enfin! Merci, agent. Le mot-clé, c’est le lieu du festival : au port de Saint-Pierre, à côté du phare!',
    en: 'Finally! Thank you, agent. The keyword is the festival location: at the harbour in Saint-Pierre, next to the lighthouse!',
  },
  culture: [
    {
      fr: 'La Guyane est en Amérique du Sud. C’est une région de la France.',
      en: 'French Guiana is in South America. It is a region of France.',
    },
    {
      fr: 'À Kourou, en Guyane, il y a une base de lancement de fusées!',
      en: 'In Kourou, French Guiana, there is a rocket launch base!',
    },
  ] as readonly Bi[],
} as const;

export const M4_GLOSSARY: readonly Bi[] = [
  { fr: 'un endroit', en: 'a place' },
  { fr: 'calme', en: 'quiet' },
  { fr: 'beaucoup de…', en: 'lots of…' },
  { fr: 'un livre', en: 'a book' },
  { fr: 'acheter', en: 'to buy' },
  { fr: 'à côté de / près de', en: 'next to / near' },
  { fr: 'j’ai faim', en: 'I’m hungry' },
  { fr: 'je t’attends', en: 'I’m waiting for you' },
  { fr: 'elle est partie', en: 'she left' },
];
