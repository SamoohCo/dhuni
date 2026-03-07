import type { Station } from '../data/stations';

interface TuningScaleProps {
  stations: Station[];
  activeStationId: string;
  lockedStationId: string | null;
}

function toScalePercent(position: number): string {
  return `calc(6% + ${position * 0.88}%)`;
}

function stationShortLabel(stationName: string): string {
  return stationName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export function TuningScale({ stations, activeStationId, lockedStationId }: TuningScaleProps) {
  const tickMarks = Array.from({ length: 51 }, (_, index) => index * 2);

  return (
    <div className="tuning-scale" aria-hidden="true">
      {tickMarks.map((value) => {
        const isMajor = value % 10 === 0;
        const isMid = value % 5 === 0;

        return (
          <span
            key={`tick-${value}`}
            className={`tuning-scale__tick ${isMajor ? 'is-major' : ''} ${isMid ? 'is-mid' : ''}`}
            style={{ left: toScalePercent(value) }}
          />
        );
      })}

      {stations.map((station) => {
        const isActive = station.id === activeStationId;
        const isLocked = station.id === lockedStationId;

        return (
          <div
            key={station.id}
            className={`tuning-scale__station ${isActive ? 'is-active' : ''} ${isLocked ? 'is-locked' : ''}`}
            style={{ left: toScalePercent(station.dialPosition) }}
          >
            <span className="tuning-scale__station-mark" />
            <span className="tuning-scale__station-label">{stationShortLabel(station.name)}</span>
          </div>
        );
      })}

      <div className="tuning-scale__legend">
        <span>MW</span>
        <span>All India Band</span>
        <span>MHz</span>
      </div>
    </div>
  );
}
