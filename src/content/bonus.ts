import type { Bi, StationId } from './types';

/**
 * Dossiers secrets : défis facultatifs, plus difficiles, débloqués après chaque station.
 * Pour les élèves rapides. Ils ne bloquent jamais la progression.
 */
export type BonusItem =
  | { kind: 'choice'; prompt: Bi; options: string[]; answer: string; explain: Bi }
  | { kind: 'type'; prompt: Bi; accepted: string[]; placeholder: string; explain: Bi };

export const BONUS: Record<StationId, BonusItem[]> = {
  lafayette: [
    {
      kind: 'choice',
      prompt: {
        fr: 'Trouve l’intrus : lequel n’est pas un légume?',
        en: 'Find the odd one out: which one is not a vegetable?',
      },
      options: ['l’oignon', 'le céleri', 'le fromage', 'le poivron'],
      answer: 'le fromage',
      explain: {
        fr: 'Le fromage est fait avec du lait. Ce n’est pas un légume.',
        en: 'Cheese is made from milk. It’s not a vegetable.',
      },
    },
    {
      kind: 'type',
      prompt: {
        fr: 'Écris « shrimp » en français, avec l’article « des ».',
        en: 'Write “shrimp” in French, with the article “des”.',
      },
      accepted: ['des crevettes'],
      placeholder: 'des …',
      explain: { fr: 'Shrimp = des crevettes.', en: 'Shrimp = des crevettes.' },
    },
    {
      kind: 'choice',
      prompt: { fr: 'Complète : sept, huit, neuf, …', en: 'Complete: seven, eight, nine, …' },
      options: ['six', 'dix', 'douze', 'deux'],
      answer: 'dix',
      explain: { fr: 'Après neuf (9), c’est dix (10).', en: 'After neuf (9) comes dix (10).' },
    },
  ],
  portauprince: [
    {
      kind: 'type',
      prompt: {
        fr: 'Complète : lundi, mardi, mercredi, …, vendredi',
        en: 'Complete: Monday, Tuesday, Wednesday, …, Friday',
      },
      accepted: ['jeudi'],
      placeholder: '…',
      explain: { fr: 'Le jour après mercredi, c’est jeudi.', en: 'The day after Wednesday is jeudi (Thursday).' },
    },
    {
      kind: 'choice',
      prompt: { fr: '« Quatorze heures », c’est…', en: '“Quatorze heures” is…' },
      options: ['2 h de l’après-midi', '4 h du matin', '4 h de l’après-midi', 'midi'],
      answer: '2 h de l’après-midi',
      explain: { fr: '14 h = 2 h de l’après-midi (2:00 p.m.).', en: '14:00 = 2:00 p.m.' },
    },
    {
      kind: 'choice',
      prompt: { fr: 'Les deux langues officielles d’Haïti sont…', en: 'The two official languages of Haiti are…' },
      options: [
        'le français et l’anglais',
        'le créole haïtien et le français',
        'l’espagnol et le français',
        'le créole et l’anglais',
      ],
      answer: 'le créole haïtien et le français',
      explain: {
        fr: 'En Haïti, on parle créole haïtien et français.',
        en: 'In Haiti, people speak Haitian Creole and French.',
      },
    },
  ],
  fortdefrance: [
    {
      kind: 'choice',
      prompt: { fr: 'Tu parles à ta directrice d’école. Tu dis :', en: 'You’re speaking to your principal. You say:' },
      options: ['Peux-tu m’aider?', 'Pouvez-vous m’aider?'],
      answer: 'Pouvez-vous m’aider?',
      explain: { fr: 'Avec une adulte de l’école, on dit « vous ».', en: 'With an adult at school, you say “vous”.' },
    },
    {
      kind: 'choice',
      prompt: {
        fr: 'Tu invites ton meilleur ami chez toi. Tu dis :',
        en: 'You invite your best friend over. You say:',
      },
      options: ['Viens chez moi!', 'Venez chez moi!'],
      answer: 'Viens chez moi!',
      explain: { fr: 'Pour un ami, on dit « tu » : « Viens! ».', en: 'For one friend, you say “tu”: “Viens!”.' },
    },
    {
      kind: 'type',
      prompt: {
        fr: 'Écris la question avec « vous » : « Tu veux un jus? » → « … un jus? »',
        en: 'Write the question with “vous”: “Tu veux un jus?” → “… un jus?”',
      },
      accepted: ['vous voulez', 'vous voulez un jus', 'voulez-vous', 'voulez-vous un jus'],
      placeholder: 'Vous …',
      explain: { fr: 'Tu veux → vous voulez (ou : voulez-vous).', en: 'Tu veux → vous voulez (or: voulez-vous).' },
    },
  ],
  cayenne: [
    {
      kind: 'choice',
      prompt: { fr: '« À côté de » veut dire…', en: '“À côté de” means…' },
      options: ['next to', 'behind', 'far from', 'under'],
      answer: 'next to',
      explain: { fr: 'À côté de = next to. Loin de = far from.', en: 'À côté de = next to. Loin de = far from.' },
    },
    {
      kind: 'choice',
      prompt: { fr: 'Une « librairie », c’est…', en: 'A “librairie” is…' },
      options: ['a library', 'a bookstore', 'a school', 'a museum'],
      answer: 'a bookstore',
      explain: {
        fr: 'Faux ami! Librairie = bookstore. Bibliothèque = library.',
        en: 'False friend! Librairie = bookstore. Bibliothèque = library.',
      },
    },
    {
      kind: 'choice',
      prompt: { fr: 'La Guyane est sur quel continent?', en: 'Which continent is French Guiana on?' },
      options: ['l’Amérique du Nord', 'l’Amérique du Sud', 'l’Europe', 'l’Afrique'],
      answer: 'l’Amérique du Sud',
      explain: {
        fr: 'La Guyane est en Amérique du Sud, à côté du Brésil.',
        en: 'French Guiana is in South America, next to Brazil.',
      },
    },
  ],
  saintpierre: [
    {
      kind: 'choice',
      prompt: { fr: 'Quelle phrase est correcte?', en: 'Which sentence is correct?' },
      options: ['un francophone festival', 'un festival francophone'],
      answer: 'un festival francophone',
      explain: {
        fr: 'L’adjectif « francophone » se place après le nom.',
        en: 'The adjective “francophone” goes after the noun.',
      },
    },
    {
      kind: 'type',
      prompt: { fr: 'Écris le pluriel : un gâteau → des …', en: 'Write the plural: un gâteau → des …' },
      accepted: ['gâteaux', 'des gâteaux'],
      placeholder: '…',
      explain: {
        fr: 'Les mots en « -eau » prennent un x au pluriel : des gâteaux.',
        en: 'Words ending in “-eau” take an x in the plural: des gâteaux.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        fr: 'Saint-Pierre-et-Miquelon est tout près de quelle province canadienne?',
        en: 'Saint Pierre and Miquelon is very close to which Canadian province?',
      },
      options: ['l’Ontario', 'Terre-Neuve-et-Labrador', 'le Manitoba', 'la Colombie-Britannique'],
      answer: 'Terre-Neuve-et-Labrador',
      explain: { fr: 'L’archipel est au sud de Terre-Neuve.', en: 'The archipelago is south of Newfoundland.' },
    },
  ],
};
