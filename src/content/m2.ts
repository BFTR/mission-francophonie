import type { Bi } from './types';

/**
 * Mission 2 — Port-au-Prince (Haïti) : « Le studio radio »
 * Attentes : A1.1 (stratégies d'écoute : réécouter, écouter plus lentement, repérer un mot),
 *            A1.2 (repérer l'information clé dans un message oral avec soutien visuel), C3.1.
 * Chaque message contient un DISTRACTEUR oral (« ce matin, il pleut », « pas vendredi »,
 * « le concert à midi ») : deviner ne suffit pas, il faut comprendre le message.
 */

export type DialId = 'meteo' | 'jour' | 'heure';

export type DialOption = { id: string; label: Bi; icon?: 'sun' | 'rain' | 'snow' | 'wind' };

export type RadioMessage = {
  id: DialId;
  /** Fichier audio dans public/audio/. */
  audio: string;
  /** Texte prononcé (sert de transcription et de secours en synthèse vocale). */
  transcript: string;
  /** Mot(s) clé(s) surligné(s) dans la transcription au niveau d'indice 3. */
  key: string;
  speaker: 'female' | 'male';
  question: Bi;
  options: DialOption[];
  answer: string;
  /** Rétroaction ciblée selon la mauvaise réponse choisie. */
  wrong: Record<string, Bi>;
  wrongDefault: Bi;
  strategy: Bi;
};

export const RADIO_MESSAGES: readonly RadioMessage[] = [
  {
    id: 'meteo',
    audio: 'm2-meteo.mp3',
    transcript: 'Bonjour, ici Radio Écho, à Port-au-Prince! Ce matin, il pleut. Mais samedi, il va faire soleil!',
    key: 'samedi, il va faire soleil',
    speaker: 'female',
    question: { fr: 'Quel temps va-t-il faire samedi?', en: 'What will the weather be like on Saturday?' },
    options: [
      { id: 'soleil', label: { fr: 'Il fait soleil.', en: 'It’s sunny.' }, icon: 'sun' },
      { id: 'pluie', label: { fr: 'Il pleut.', en: 'It’s raining.' }, icon: 'rain' },
      { id: 'neige', label: { fr: 'Il neige.', en: 'It’s snowing.' }, icon: 'snow' },
      { id: 'vent', label: { fr: 'Il y a du vent.', en: 'It’s windy.' }, icon: 'wind' },
    ],
    answer: 'soleil',
    wrong: {
      pluie: {
        fr: 'Attention : il pleut ce matin. La question parle de samedi.',
        en: 'Careful: it’s raining this morning. The question is about Saturday.',
      },
      neige: {
        fr: 'Le mot « neige » n’est pas dans le message. Réécoute la fin.',
        en: 'The word “neige” (snow) is not in the message. Listen to the end again.',
      },
      vent: {
        fr: 'Le mot « vent » n’est pas dans le message. Réécoute la fin.',
        en: 'The word “vent” (wind) is not in the message. Listen to the end again.',
      },
    },
    wrongDefault: { fr: 'Réécoute la fin du message.', en: 'Listen to the end of the message again.' },
    strategy: {
      fr: 'Écoute bien après le mot « samedi ».',
      en: 'Listen carefully after the word “samedi” (Saturday).',
    },
  },
  {
    id: 'jour',
    audio: 'm2-jour.mp3',
    transcript: 'Attention, attention! Le grand festival n’est pas vendredi. Le festival, c’est samedi!',
    key: 'c’est samedi',
    speaker: 'male',
    question: { fr: 'Quel jour est le festival?', en: 'What day is the festival?' },
    options: [
      { id: 'lundi', label: { fr: 'lundi', en: 'Monday' } },
      { id: 'mardi', label: { fr: 'mardi', en: 'Tuesday' } },
      { id: 'mercredi', label: { fr: 'mercredi', en: 'Wednesday' } },
      { id: 'jeudi', label: { fr: 'jeudi', en: 'Thursday' } },
      { id: 'vendredi', label: { fr: 'vendredi', en: 'Friday' } },
      { id: 'samedi', label: { fr: 'samedi', en: 'Saturday' } },
      { id: 'dimanche', label: { fr: 'dimanche', en: 'Sunday' } },
    ],
    answer: 'samedi',
    wrong: {
      vendredi: {
        fr: 'Écoute bien : le festival n’est PAS vendredi. « ne… pas » veut dire « not ».',
        en: 'Listen carefully: the festival is NOT on Friday. “ne… pas” means “not”.',
      },
    },
    wrongDefault: {
      fr: 'Ce jour n’est pas dans le message. Deux jours sont nommés : lequel est le bon?',
      en: 'This day is not in the message. Two days are named: which one is right?',
    },
    strategy: {
      fr: 'Deux jours sont dans le message. Écoute les petits mots « n’est pas ».',
      en: 'Two days are in the message. Listen for the small words “n’est pas” (is not).',
    },
  },
  {
    id: 'heure',
    audio: 'm2-heure.mp3',
    transcript: 'Le concert de musique commence à midi. Mais le festival commence à quatorze heures.',
    key: 'le festival commence à quatorze heures',
    speaker: 'female',
    question: { fr: 'À quelle heure commence le festival?', en: 'What time does the festival start?' },
    options: [
      { id: '4h', label: { fr: '4 h', en: '4:00 a.m.' } },
      { id: '12h', label: { fr: '12 h', en: '12:00 p.m.' } },
      { id: '14h', label: { fr: '14 h', en: '2:00 p.m.' } },
      { id: '16h', label: { fr: '16 h', en: '4:00 p.m.' } },
    ],
    answer: '14h',
    wrong: {
      '12h': {
        fr: 'Midi (12 h), c’est l’heure du concert. Et le festival?',
        en: 'Noon (12:00) is when the concert starts. And the festival?',
      },
      '4h': {
        fr: 'Attention : « quatre » (4) et « quatorze » (14) se ressemblent.',
        en: 'Careful: “quatre” (4) and “quatorze” (14) sound alike.',
      },
      '16h': {
        fr: '16, c’est « seize ». Ce mot n’est pas dans le message.',
        en: '16 is “seize”. That word is not in the message.',
      },
    },
    wrongDefault: { fr: 'Réécoute la fin du message.', en: 'Listen to the end of the message again.' },
    strategy: {
      fr: 'Deux heures sont dans le message. Écoute la phrase avec le mot « festival ».',
      en: 'Two times are in the message. Listen to the sentence with the word “festival”.',
    },
  },
];

export const M2_TEXT = {
  briefing: {
    fr: 'Deuxième station : Port-au-Prince, la capitale d’Haïti. Le signal est faible. Écoute bien!',
    en: 'Second station: Port-au-Prince, the capital of Haiti. The signal is weak. Listen carefully!',
  },
  hostHello: {
    fr: 'Bonjour, agent! Je suis Jean-Robert, de Radio Écho Haïti. Nous avons trois messages sur le festival. Écoute-les et règle la console.',
    en: 'Hello, agent! I’m Jean-Robert from Radio Écho Haiti. We have three messages about the festival. Listen to them and set the console.',
  },
  hostAudio: 'm2-hote.mp3',
  instruction: {
    fr: 'Écoute chaque message. Ensuite, règle le cadran avec la bonne réponse.',
    en: 'Listen to each message. Then set the dial to the right answer.',
  },
  headphones: {
    fr: 'Mets tes écouteurs. Tu peux réécouter autant de fois que tu veux.',
    en: 'Put on your headphones. You can listen again as many times as you want.',
  },
  transmit: { fr: 'Transmettre', en: 'Transmit' },
  allOk: { fr: 'Signal décodé! La console est réglée.', en: 'Signal decoded! The console is set.' },
  someWrong: {
    fr: 'Un cadran n’est pas bien réglé. Regarde les messages marqués « À revoir ».',
    en: 'One dial is not set correctly. Look at the messages marked “À revoir” (check again).',
  },
  missing: {
    fr: 'Règle les trois cadrans avant de transmettre.',
    en: 'Set all three dials before transmitting.',
  },
} as const;

export const M2_REWARD = {
  thanks: {
    fr: 'Mèsi, agent! Merci! Voici le deuxième mot-clé : le jour et l’heure du festival.',
    en: 'Mèsi, agent! Thank you! Here is the second keyword: the day and time of the festival.',
  },
  culture: [
    {
      fr: 'En Haïti, il y a deux langues officielles : le créole haïtien et le français.',
      en: 'Haiti has two official languages: Haitian Creole and French.',
    },
    {
      fr: 'En créole haïtien, « bonjou » veut dire « bonjour » et « mèsi » veut dire « merci ».',
      en: 'In Haitian Creole, “bonjou” means “hello” and “mèsi” means “thank you”.',
    },
  ] as readonly Bi[],
} as const;

export const M2_GLOSSARY: readonly Bi[] = [
  { fr: 'ce matin', en: 'this morning' },
  { fr: 'il pleut', en: 'it’s raining' },
  { fr: 'il fait soleil', en: 'it’s sunny' },
  { fr: 'il va faire…', en: 'it’s going to be…' },
  { fr: 'ne… pas', en: 'not' },
  { fr: 'commence', en: 'starts' },
  { fr: 'midi', en: 'noon' },
  { fr: 'mais', en: 'but' },
  { fr: 'quatre / quatorze / seize', en: '4 / 14 / 16' },
  { fr: 'lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche', en: 'Monday … Sunday' },
];
