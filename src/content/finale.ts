import type { Bi } from './types';

export const FINALE = {
  title: 'MISSION ACCOMPLIE!',
  subtitle: {
    fr: 'Le Réseau Écho est rétabli. L’invitation est partie!',
    en: 'The Écho Network is back. The invitation has been sent!',
  },
  showTeacher: {
    fr: 'Montre cet écran à ton enseignante ou à ton enseignant.',
    en: 'Show this screen to your teacher.',
  },
  codeLabel: { fr: 'Code de réussite', en: 'Completion code' },
  codeNote: {
    fr: 'Ce code dépend de ton groupe et de la date. Il ne contient aucune information sur toi.',
    en: 'This code depends on your group and the date. It contains no information about you.',
  },
  skillsTitle: { fr: 'Compétences travaillées', en: 'Skills practised' },
  invitationTitle: { fr: 'Ton invitation', en: 'Your invitation' },
  oralTitle: { fr: 'Défi oral (avec ton enseignant·e)', en: 'Oral challenge (with your teacher)' },
  oralTask: {
    fr: 'Lis ton invitation à voix haute. Ensuite, réponds à une question en français.',
    en: 'Read your invitation out loud. Then answer one question in French.',
  },
  badge: { fr: 'Insigne d’agent du Réseau Écho', en: 'Écho Network agent badge' },
  bonusLine: { fr: 'Dossiers secrets réussis', en: 'Secret files solved' },
  adapted: {
    fr: 'écoute réussie avec la transcription (adaptation)',
    en: 'listening completed with the transcript (accommodation)',
  },
} as const;

export type OralQuestion = { q: string; expected: string; strand: string };

/** Questions orales facultatives pour l'enseignant (B2.2 — interaction guidée). */
export const ORAL_QUESTIONS: readonly OralQuestion[] = [
  {
    q: 'Quand est le festival?',
    expected: 'Le festival est samedi à 14 h (à quatorze heures).',
    strand: 'B2.2 · A1.2',
  },
  { q: 'Qu’est-ce qu’il y a au menu?', expected: 'Il y a un gombo.', strand: 'B2.2' },
  { q: 'Où est le festival?', expected: 'Au port (de Saint-Pierre), à côté du phare.', strand: 'B2.2' },
  {
    q: 'Qu’est-ce que tu apportes au festival?',
    expected: 'J’apporte du pain / de la limonade / des pommes…',
    strand: 'B2.2 · D1.3 à l’oral',
  },
  {
    q: 'À la directrice, tu dis « tu » ou « vous »? Pourquoi?',
    expected: '« Vous », parce que c’est une adulte (par politesse).',
    strand: 'B3 · A3.2',
  },
  {
    q: 'Nomme une communauté francophone des Amériques.',
    expected: 'La Louisiane, Haïti, la Martinique, la Guyane, Saint-Pierre-et-Miquelon…',
    strand: 'B3 · C3.1',
  },
];

export const TEACHER: Record<string, Bi> = {
  title: { fr: 'Espace enseignant', en: 'Teacher area' },
  intro: {
    fr: 'Codes de réussite du jour. Un élève qui a terminé affiche le code de son groupe sur l’écran final.',
    en: 'Today’s completion codes. A student who finished shows their group’s code on the final screen.',
  },
  warning: {
    fr: 'Limite : dans une application sans serveur, ce code peut être retrouvé en inspectant le jeu. Il sert à une vérification rapide et formative, avec la validation visuelle de l’écran et la question orale.',
    en: 'Limit: in a serverless app, this code can be found by inspecting the game. It supports a quick, formative check, together with a look at the screen and the oral question.',
  },
  oral: { fr: 'Questions orales suggérées', en: 'Suggested oral questions' },
  back: { fr: 'Retour à l’accueil', en: 'Back to home' },
};
