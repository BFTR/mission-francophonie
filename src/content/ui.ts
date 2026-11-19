import type { Bi } from './types';

export const GAME_TITLE = 'Mission Francophonie';
export const GAME_SUBTITLE = 'Le signal perdu';

/** Signature de l'auteur (affichée à l'accueil, à la fin, dans l'espace enseignant). */
export const AUTHOR = 'M. Thierry';
export const CREDIT = { fr: 'Un jeu conçu par M. Thierry', en: 'A game created by Mr. Thierry' };

export const UI = {
  chooseGroup: { fr: 'Choisis ton groupe', en: 'Choose your group' },
  groupNote: {
    fr: 'Aucun nom, aucun compte. Le jeu garde ta progression sur ce Chromebook seulement.',
    en: 'No name, no account. The game saves your progress on this Chromebook only.',
  },
  start: { fr: 'Commencer la mission', en: 'Start the mission' },
  resume: { fr: 'Continuer la mission', en: 'Continue the mission' },
  restart: { fr: 'Recommencer', en: 'Start over' },
  restartConfirmTitle: { fr: 'Recommencer depuis le début?', en: 'Start over from the beginning?' },
  restartConfirmBody: {
    fr: 'Ta progression sur ce Chromebook sera effacée. Tu ne pourras pas l’annuler.',
    en: 'Your progress on this Chromebook will be erased. You can’t undo this.',
  },
  restartYes: { fr: 'Oui, effacer', en: 'Yes, erase' },
  cancel: { fr: 'Annuler', en: 'Cancel' },
  close: { fr: 'Fermer', en: 'Close' },
  continue: { fr: 'Continuer', en: 'Continue' },
  next: { fr: 'Suivant', en: 'Next' },
  back: { fr: 'Retour', en: 'Back' },
  toMap: { fr: 'Retour à la carte', en: 'Back to the map' },
  instructions: { fr: 'Consignes', en: 'Instructions' },
  hint: { fr: 'Indice', en: 'Hint' },
  wordbook: { fr: 'Carnet', en: 'Word book' },
  sound: { fr: 'Son', en: 'Sound' },
  english: { fr: 'Anglais', en: 'English' },
  menu: { fr: 'Menu', en: 'Menu' },
  storageOff: {
    fr: 'Attention : ce navigateur ne peut pas sauvegarder. Si tu fermes la page, tu recommences au début.',
    en: 'Note: this browser can’t save. If you close the page, you’ll start from the beginning.',
  },
  storageCorrupt: {
    fr: 'La sauvegarde était illisible. Le jeu repart du début.',
    en: 'The save could not be read. The game starts from the beginning.',
  },
  mapTitle: { fr: 'Carte du Réseau Écho', en: 'Écho Network map' },
  mapInstruction: {
    fr: 'Choisis une station allumée pour commencer une mission.',
    en: 'Choose an active station to start a mission.',
  },
  stationLocked: {
    fr: 'Station éteinte. Rallume d’abord la station précédente.',
    en: 'Station offline. First turn the previous station back on.',
  },
  stationSoon: {
    fr: 'Cette mission arrive dans la prochaine version du jeu.',
    en: 'This mission is coming in the next version of the game.',
  },
  hq: { fr: 'QG · Ottawa', en: 'HQ · Ottawa' },
  keywords: { fr: 'Mots-clés', en: 'Keywords' },
  play: { fr: 'Jouer', en: 'Play' },
  replay: { fr: 'Revoir', en: 'Review' },
  done: { fr: 'Rallumée', en: 'Back on' },
  open: { fr: 'À rallumer', en: 'To turn on' },
  locked: { fr: 'Éteinte', en: 'Offline' },
} satisfies Record<string, Bi>;

export const BRIEFING: readonly Bi[] = [
  {
    fr: 'Bonjour, agent! Je m’appelle Lumi. Je travaille au QG du Réseau Écho, à Ottawa.',
    en: 'Hello, agent! My name is Lumi. I work at Écho Network HQ in Ottawa.',
  },
  {
    fr: 'Le Réseau Écho relie des radios francophones dans les Amériques. Ce matin, le signal est perdu!',
    en: 'The Écho Network connects French-language radio stations across the Americas. This morning, the signal is lost!',
  },
  {
    fr: 'Bientôt, il y a un grand festival francophone. Nous devons inviter tout le réseau.',
    en: 'Soon there is a big francophone festival. We need to invite the whole network.',
  },
  {
    fr: 'Rallume cinq stations. Chaque station te donne un mot-clé pour l’invitation.',
    en: 'Turn five stations back on. Each station gives you a keyword for the invitation.',
  },
  {
    fr: 'Besoin d’aide? Clique sur « Indice », sur « Carnet » ou sur « Consignes ». On y va?',
    en: 'Need help? Click “Indice” (hint), “Carnet” (word book) or “Consignes” (instructions). Shall we go?',
  },
];

export const HOW_TO_PLAY: readonly Bi[] = [
  { fr: 'Sur la carte, choisis la station allumée.', en: 'On the map, choose the active station.' },
  { fr: 'Lis ou écoute les messages en français.', en: 'Read or listen to the messages in French.' },
  { fr: 'Tu peux essayer autant de fois que tu veux.', en: 'You can try as many times as you want.' },
  { fr: '« Indice » t’aide pas à pas.', en: '“Indice” helps you step by step.' },
  { fr: '« Carnet » donne des mots utiles.', en: '“Carnet” gives useful words.' },
  { fr: '« Anglais » affiche ou cache les traductions.', en: '“Anglais” shows or hides the translations.' },
  { fr: 'Le jeu sauvegarde tout seul sur ce Chromebook.', en: 'The game saves automatically on this Chromebook.' },
];
