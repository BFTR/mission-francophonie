import { IconCheck, IconLock, IconBroadcast } from '@tabler/icons-react';
import type { StationInfo } from '../content/stations';
import type { StationId } from '../content/types';
import type { StationStatus } from '../state/game';
import { GRATICULE_PATH, LAND_PATH, MAP_H, MAP_W, PLACE_XY } from './americasMap';
import { INK, PAL } from './riso';

const ROUTE: (keyof typeof PLACE_XY)[] = [
  'ottawa',
  'lafayette',
  'portauprince',
  'fortdefrance',
  'cayenne',
  'saintpierre',
];

function routeD(): string {
  return ROUTE.map((k, i) => {
    const [x, y] = PLACE_XY[k];
    return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ');
}

function BaseMap({ doneUpTo = 0 }: { doneUpTo?: number }) {
  return (
    <>
      <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#f7f0e4" />
      <path d={GRATICULE_PATH} fill="none" stroke={INK} strokeOpacity={0.14} strokeWidth={1} strokeDasharray="2 5" />
      <path d={LAND_PATH} transform="translate(3 2.4)" fill="#e2cfae" />
      <path d={LAND_PATH} fill="none" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={routeD()} fill="none" stroke={INK} strokeWidth={2.5} strokeDasharray="7 7" strokeLinecap="round" />
      {doneUpTo > 0 && (
        <path
          d={ROUTE.slice(0, doneUpTo + 1)
            .map((k, i) => `${i === 0 ? 'M' : 'L'}${PLACE_XY[k][0]} ${PLACE_XY[k][1]}`)
            .join(' ')}
          fill="none"
          stroke={PAL.teal}
          strokeWidth={5}
          strokeLinecap="round"
          className="route-done"
        />
      )}
    </>
  );
}

/** Version décorative de l'accueil. */
export function MiniMap() {
  return (
    <svg
      viewBox={`120 40 760 700`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
      aria-hidden="true"
    >
      <BaseMap />
      {ROUTE.map((k) => (
        <circle
          key={k}
          cx={PLACE_XY[k][0]}
          cy={PLACE_XY[k][1]}
          r={11}
          fill={k === 'ottawa' ? PAL.mustard : '#fffdf8'}
          stroke={INK}
          strokeWidth={3}
        />
      ))}
    </svg>
  );
}

type LabelSide = 'left' | 'right';
const SIDE: Record<StationId, LabelSide> = {
  lafayette: 'right',
  portauprince: 'left',
  fortdefrance: 'right',
  cayenne: 'left',
  saintpierre: 'right',
};

export function NetworkMap({
  stations,
  status,
  onPick,
  selected,
}: {
  stations: readonly StationInfo[];
  status: Record<StationId, StationStatus>;
  onPick: (s: StationInfo) => void;
  selected: StationId | null;
}) {
  const doneUpTo = stations.filter((s) => status[s.id] === 'done').length;
  const pct = (k: keyof typeof PLACE_XY) => ({
    left: `${(PLACE_XY[k][0] / MAP_W) * 100}%`,
    top: `${(PLACE_XY[k][1] / MAP_H) * 100}%`,
  });
  return (
    <div className="netmap">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        <BaseMap doneUpTo={doneUpTo} />
      </svg>

      <div className="netmap__hq" style={pct('ottawa')}>
        <span className="netmap__hqdot" aria-hidden="true">
          <IconBroadcast size={18} stroke={2.4} />
        </span>
        <span className="netmap__label netmap__label--left">
          <strong>QG</strong> Ottawa
        </span>
      </div>

      {stations.map((s) => {
        const st = status[s.id];
        const statusFr = st === 'done' ? 'rallumée' : st === 'open' ? 'à rallumer' : 'éteinte';
        return (
          <div key={s.id} className="netmap__station" style={pct(s.id)}>
            <button
              type="button"
              className={`stamp stamp--${st} ${selected === s.id ? 'stamp--selected' : ''}`}
              onClick={() => onPick(s)}
              aria-label={`Station ${s.number}, ${s.city} : ${statusFr}`}
            >
              {st === 'done' ? (
                <IconCheck size={22} stroke={3} aria-hidden="true" />
              ) : st === 'locked' ? (
                <IconLock size={18} stroke={2.4} aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{s.number}</span>
              )}
            </button>
            <span className={`netmap__label netmap__label--${SIDE[s.id]}`} aria-hidden="true">
              <strong>{s.city}</strong>
              <small>{s.region.fr}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
