/** Texte bilingue : le français est toujours la langue principale. */
export type Bi = { fr: string; en: string };

export const STATION_IDS = ['lafayette', 'portauprince', 'fortdefrance', 'cayenne', 'saintpierre'] as const;
export type StationId = (typeof STATION_IDS)[number];

export const GROUPS = ['7-15', '7-17', '7-18'] as const;
export type Group = (typeof GROUPS)[number];
