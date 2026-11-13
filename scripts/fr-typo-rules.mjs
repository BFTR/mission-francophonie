// Règles de typographie française canadienne (Bureau de la traduction, Guide du rédacteur).
// Partagées par scripts/fr-typo.mjs et par les tests unitaires.
export const NB = '\u00A0';

export const fixFr = (s) =>
  s
    // aucune espace avant ! ? ;
    .replace(/[ \u00A0\u202F]+([!?;])/g, '$1')
    // espace insécable avant :
    .replace(/(\S)[ \u00A0\u202F]+:(?=\s|$|['"`])/g, `$1${NB}:`)
    // espaces insécables à l'intérieur des guillemets
    .replace(/«[ \u00A0\u202F]*/g, `«${NB}`)
    .replace(/[ \u00A0\u202F]*»/g, `${NB}»`);
