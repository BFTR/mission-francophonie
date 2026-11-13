// Génère src/art/americasMap.ts : contour des terres (Natural Earth 1:50m, domaine public,
// via le paquet world-atlas) projeté et découpé pour la zone du jeu.
// Usage : npm run gen:map   (exécuté une seule fois ; le résultat est versionné)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath, geoGraticule } from 'd3-geo';

const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));
const land = feature(topo, topo.objects.land);

const W = 1000,
  H = 760;
const bounds = { west: -101, east: -44, south: 1, north: 52 };
const projection = geoEquirectangular()
  .clipExtent([
    [0, 0],
    [W, H],
  ])
  .fitExtent(
    [
      [0, 0],
      [W, H],
    ],
    {
      type: 'MultiPoint',
      coordinates: [
        [bounds.west, bounds.south],
        [bounds.east, bounds.south],
        [bounds.east, bounds.north],
        [bounds.west, bounds.north],
      ],
    },
  );
const path = geoPath(projection).digits(0);
const d = path(land);
const grat = path(geoGraticule().step([10, 10])());

const places = {
  ottawa: [-75.7, 45.42],
  lafayette: [-92.02, 30.22],
  portauprince: [-72.34, 18.54],
  fortdefrance: [-61.07, 14.6],
  cayenne: [-52.33, 4.92],
  saintpierre: [-56.18, 46.78],
};
const pts = Object.fromEntries(Object.entries(places).map(([k, ll]) => [k, projection(ll).map((n) => Math.round(n))]));

mkdirSync('src/art', { recursive: true });
writeFileSync(
  'src/art/americasMap.ts',
  `// Fichier généré par scripts/gen-map.mjs — ne pas modifier à la main.\n` +
    `// Données : Natural Earth 1:50m (domaine public) via world-atlas.\n` +
    `export const MAP_W = ${W};\nexport const MAP_H = ${H};\n` +
    `export const LAND_PATH = ${JSON.stringify(d)};\n` +
    `export const GRATICULE_PATH = ${JSON.stringify(grat)};\n` +
    `export const PLACE_XY = ${JSON.stringify(pts)} as const;\n`,
);
console.log('path length', d.length, pts);
