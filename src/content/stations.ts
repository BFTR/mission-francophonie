import type { Bi, StationId } from './types';

export type StationInfo = {
  id: StationId;
  number: number;
  city: string;
  region: Bi;
  /** Mot-clé gagné : un élément de l'invitation au festival. */
  keyword: { label: Bi; word: string };
  missionTitle: Bi;
  skill: Bi;
  /** Mission jouable dans cette version ? */
  playable: boolean;
};

export const STATIONS: readonly StationInfo[] = [
  {
    id: 'lafayette',
    number: 1,
    city: 'Lafayette',
    region: { fr: 'Louisiane, États-Unis', en: 'Louisiana, United States' },
    keyword: { label: { fr: 'Quoi? Le menu', en: 'What? The menu' }, word: 'un gombo' },
    missionTitle: { fr: 'Le marché de Claire', en: "Claire's market" },
    skill: { fr: 'Lire du vocabulaire', en: 'Reading vocabulary' },
    playable: true,
  },
  {
    id: 'portauprince',
    number: 2,
    city: 'Port-au-Prince',
    region: { fr: 'Haïti', en: 'Haiti' },
    keyword: { label: { fr: 'Quand? Le jour et l’heure', en: 'When? Day and time' }, word: 'samedi à 14 h' },
    missionTitle: { fr: 'Le studio radio', en: 'The radio studio' },
    skill: { fr: 'Écouter', en: 'Listening' },
    playable: true,
  },
  {
    id: 'fortdefrance',
    number: 3,
    city: 'Fort-de-France',
    region: { fr: 'Martinique', en: 'Martinique' },
    keyword: { label: { fr: 'Comment? Le ton', en: 'How? The tone' }, word: 'Venez!' },
    missionTitle: { fr: 'La conversation au café', en: 'The café conversation' },
    skill: { fr: 'Communiquer par écrit', en: 'Written interaction' },
    playable: true,
  },
  {
    id: 'cayenne',
    number: 4,
    city: 'Cayenne',
    region: { fr: 'Guyane', en: 'French Guiana' },
    keyword: { label: { fr: 'Où? Le lieu', en: 'Where? The place' }, word: 'au port' },
    missionTitle: { fr: 'Le rendez-vous en ville', en: 'The meeting in town' },
    skill: { fr: 'Lire et décider', en: 'Reading and deciding' },
    playable: true,
  },
  {
    id: 'saintpierre',
    number: 5,
    city: 'Saint-Pierre',
    region: { fr: 'Saint-Pierre-et-Miquelon', en: 'Saint Pierre and Miquelon' },
    keyword: { label: { fr: 'L’invitation', en: 'The invitation' }, word: 'l’invitation' },
    missionTitle: { fr: 'Le message du phare', en: 'The lighthouse message' },
    skill: { fr: 'Écrire', en: 'Writing' },
    playable: true,
  },
];

export function stationById(id: StationId): StationInfo {
  const s = STATIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Station inconnue : ${id}`);
  return s;
}
