import type { Bi } from './types';

/**
 * Mission 3 — Fort-de-France (Martinique) : « La conversation au café »
 * Attentes : C1.2 (comprendre des répliques écrites), C3.2 et A3.2 (conventions sociolinguistiques :
 *            « vous » avec une adulte inconnue, « tu » avec un jeune du même âge), C3.1.
 * Mécanique : conversation à embranchements. Chaque réplique proposée est soit juste,
 * soit au mauvais registre (tu/vous), soit illogique. Le personnage réagit à chaque choix.
 * Le jeu ne mesure pas l'expression orale : il prépare le défi oral fait avec l'enseignant.
 */

export type Who = 'josephine' | 'theo';
export type ReplyKind = 'ok' | 'register' | 'logic';

export type Reply = { text: Bi; kind: ReplyKind; reaction?: Bi };

export type ChatNode = {
  who: Who;
  line: Bi;
  audio: string;
  replies: Reply[];
};

export const PEOPLE: Record<Who, { name: string; role: Bi }> = {
  josephine: { name: 'Mme Joséphine', role: { fr: 'propriétaire du café', en: 'café owner' } },
  theo: { name: 'Théo', role: { fr: 'son petit-fils, 13 ans', en: 'her grandson, 13 years old' } },
};

const VOUS_RULE: Bi = {
  fr: 'Avec une adulte qu’on ne connaît pas, on dit « vous ».',
  en: 'With an adult you don’t know, you say “vous”.',
};
const TU_RULE: Bi = {
  fr: 'Avec un jeune de ton âge, on dit « tu ».',
  en: 'With a young person your age, you say “tu”.',
};

export const CHAT: readonly ChatNode[] = [
  {
    who: 'josephine',
    line: {
      fr: 'Bonjour! Bienvenue au Café Madinina. Qu’est-ce que vous désirez?',
      en: 'Hello! Welcome to Café Madinina. What would you like?',
    },
    audio: 'm3-j1.mp3',
    replies: [
      {
        text: {
          fr: 'Bonjour, madame. Je voudrais un jus de goyave, s’il vous plaît.',
          en: 'Hello, ma’am. I would like a guava juice, please.',
        },
        kind: 'ok',
      },
      {
        text: { fr: 'Salut! Tu as un jus de goyave?', en: 'Hi! Do you have a guava juice?' },
        kind: 'register',
        reaction: {
          fr: 'Oh là là! On ne me tutoie pas, jeune agent.',
          en: 'Oh my! Don’t say “tu” to me, young agent.',
        },
      },
      {
        text: { fr: 'Samedi, il va faire soleil.', en: 'On Saturday, it’s going to be sunny.' },
        kind: 'logic',
        reaction: {
          fr: 'Euh… Je vous demande ce que vous voulez boire!',
          en: 'Um… I’m asking what you want to drink!',
        },
      },
    ],
  },
  {
    who: 'josephine',
    line: { fr: 'Voilà votre jus. Vous venez d’où?', en: 'Here is your juice. Where are you from?' },
    audio: 'm3-j2.mp3',
    replies: [
      {
        text: { fr: 'Je m’appelle Ottawa.', en: 'My name is Ottawa.' },
        kind: 'logic',
        reaction: {
          fr: 'Ha ha! Je ne demande pas votre nom. Je demande d’où vous venez.',
          en: 'Ha ha! I’m not asking your name. I’m asking where you come from.',
        },
      },
      { text: { fr: 'Je viens d’Ottawa, au Canada.', en: 'I come from Ottawa, in Canada.' }, kind: 'ok' },
      {
        text: {
          fr: 'Je viens d’Ottawa. Et toi, tu viens d’où?',
          en: 'I come from Ottawa. And you, where are you from?',
        },
        kind: 'register',
        reaction: {
          fr: '« Et toi »? Avec une dame qu’on ne connaît pas, on dit « Et vous? ».',
          en: '“Et toi”? With a lady you don’t know, you say “Et vous?”.',
        },
      },
    ],
  },
  {
    who: 'josephine',
    line: { fr: 'Ottawa! C’est loin! Et pourquoi êtes-vous ici?', en: 'Ottawa! That’s far! And why are you here?' },
    audio: 'm3-j3.mp3',
    replies: [
      {
        text: { fr: 'Le gombo est délicieux.', en: 'The gumbo is delicious.' },
        kind: 'logic',
        reaction: { fr: 'Peut-être… mais pourquoi êtes-vous ici?', en: 'Maybe… but why are you here?' },
      },
      {
        text: {
          fr: 'Peux-tu m’aider? Je cherche le mot-clé du Réseau Écho.',
          en: 'Can you help me? I’m looking for the Écho Network keyword.',
        },
        kind: 'register',
        reaction: {
          fr: '« Peux-tu »? Encore « tu »! Essayez avec « vous ».',
          en: '“Peux-tu”? “Tu” again! Try with “vous”.',
        },
      },
      {
        text: {
          fr: 'Je cherche le mot-clé du Réseau Écho. Pouvez-vous m’aider?',
          en: 'I’m looking for the Écho Network keyword. Can you help me?',
        },
        kind: 'ok',
      },
    ],
  },
  {
    who: 'theo',
    line: {
      fr: 'Salut! Ma grand-mère dit que tu cherches le mot-clé. Moi, c’est Théo. Et toi, tu es qui?',
      en: 'Hi! My grandma says you’re looking for the keyword. I’m Théo. And who are you?',
    },
    audio: 'm3-t1.mp3',
    replies: [
      { text: { fr: 'Salut, Théo! Moi, je suis l’agent du QG.', en: 'Hi, Théo! I’m the agent from HQ.' }, kind: 'ok' },
      {
        text: { fr: 'Bonjour, monsieur. Et vous, comment allez-vous?', en: 'Hello, sir. And how are you?' },
        kind: 'register',
        reaction: {
          fr: '« Monsieur »? J’ai treize ans! Tu peux me dire « tu ».',
          en: '“Sir”? I’m thirteen! You can say “tu” to me.',
        },
      },
      {
        text: { fr: 'Il est quatorze heures.', en: 'It’s two o’clock.' },
        kind: 'logic',
        reaction: { fr: 'Euh… je demande qui tu es!', en: 'Um… I’m asking who you are!' },
      },
    ],
  },
  {
    who: 'theo',
    line: {
      fr: 'Cool! Tu veux le mot-clé? D’abord, une question : tu aimes la musique?',
      en: 'Cool! Do you want the keyword? First, a question: do you like music?',
    },
    audio: 'm3-t2.mp3',
    replies: [
      {
        text: { fr: 'Je voudrais un jus, s’il vous plaît.', en: 'I would like a juice, please.' },
        kind: 'logic',
        reaction: {
          fr: 'Tu as déjà un jus! Je parle de musique.',
          en: 'You already have a juice! I’m talking about music.',
        },
      },
      {
        text: { fr: 'Oui. Et vous, aimez-vous la musique?', en: 'Yes. And you, do you like music?' },
        kind: 'register',
        reaction: {
          fr: 'Encore « vous »? On est des jeunes, on se dit « tu »!',
          en: '“Vous” again? We’re young, we say “tu”!',
        },
      },
      { text: { fr: 'Oui, j’adore la musique! Et toi?', en: 'Yes, I love music! And you?' }, kind: 'ok' },
    ],
  },
];

export const RULES = { vous: VOUS_RULE, tu: TU_RULE };

export const M3_FINAL = {
  theoLine: {
    fr: 'Moi aussi! Au festival, il y a de la musique. Le mot-clé, c’est un mot pour inviter tout le monde. Tu le trouves?',
    en: 'Me too! At the festival, there’s music. The keyword is a word to invite everyone. Can you find it?',
  },
  theoAudio: 'm3-t3.mp3',
  question: {
    fr: 'Pour inviter tout le réseau (beaucoup de personnes), on dit :',
    en: 'To invite the whole network (many people), we say:',
  },
  options: [
    {
      id: 'viens',
      text: { fr: 'Viens!', en: 'Come! (to one friend)' },
      feedback: {
        fr: '« Viens » est pour une seule personne qu’on tutoie. Ici, on invite beaucoup de personnes.',
        en: '“Viens” is for one person you call “tu”. Here, we’re inviting many people.',
      },
    },
    { id: 'venez', text: { fr: 'Venez!', en: 'Come! (to many people, or politely)' } },
    {
      id: 'venir',
      text: { fr: 'Venir!', en: 'To come!' },
      feedback: {
        fr: '« Venir », c’est l’infinitif (le verbe dans le dictionnaire). Pour inviter, on conjugue.',
        en: '“Venir” is the infinitive (the dictionary form). To invite, we conjugate the verb.',
      },
    },
  ],
  answer: 'venez',
};

export const M3_TEXT = {
  briefing: {
    fr: 'Troisième station : Fort-de-France, en Martinique. Ici, il faut parler avec la bonne politesse!',
    en: 'Third station: Fort-de-France, Martinique. Here, you must speak with the right level of politeness!',
  },
  instruction: {
    fr: 'Lis la réplique. Choisis la meilleure réponse. Attention à « tu » et à « vous »!',
    en: 'Read the line. Choose the best answer. Watch out for “tu” and “vous”!',
  },
  ruleBox: {
    fr: '« vous » : une adulte qu’on ne connaît pas, ou plusieurs personnes. « tu » : un ami, un jeune de ton âge, ta famille.',
    en: '“vous”: an adult you don’t know, or several people. “tu”: a friend, a young person your age, your family.',
  },
  goodJob: { fr: 'Bonne réponse!', en: 'Good answer!' },
  registerTitle: { fr: 'Mauvais ton!', en: 'Wrong tone!' },
  logicTitle: { fr: 'Ça ne répond pas à la question.', en: 'That doesn’t answer the question.' },
  tryAgain: { fr: 'Essaie une autre réponse.', en: 'Try another answer.' },
} as const;

export const M3_REWARD = {
  thanks: {
    fr: 'Bravo! Le mot-clé est « Venez ». C’est le ton de l’invitation : on parle à tout le réseau.',
    en: 'Well done! The keyword is “Venez” (Come). It’s the tone of the invitation: we’re talking to the whole network.',
  },
  culture: [
    {
      fr: '« Madinina », l’île aux fleurs, est un ancien nom de la Martinique.',
      en: '“Madinina”, the island of flowers, is an old name for Martinique.',
    },
    {
      fr: 'En Martinique, on parle français et créole martiniquais.',
      en: 'In Martinique, people speak French and Martinican Creole.',
    },
  ] as readonly Bi[],
} as const;

export const M3_GLOSSARY: readonly Bi[] = [
  { fr: 'tu / vous', en: 'you (informal) / you (polite or plural)' },
  { fr: 'tutoyer', en: 'to say “tu” to someone' },
  { fr: 'Qu’est-ce que vous désirez?', en: 'What would you like?' },
  { fr: 'Je voudrais…', en: 'I would like…' },
  { fr: 'Vous venez d’où? / Je viens de…', en: 'Where are you from? / I come from…' },
  { fr: 'Pouvez-vous m’aider? / Peux-tu m’aider?', en: 'Can you help me? (polite / informal)' },
  { fr: 'un jus de goyave', en: 'a guava juice' },
  { fr: 'la grand-mère / le petit-fils', en: 'grandmother / grandson' },
];
