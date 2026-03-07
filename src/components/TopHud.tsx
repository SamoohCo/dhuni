import type { Station } from '../data/stations';

interface TopHudProps {
  station: Station;
  statusText: string;
  isPowered: boolean;
}

export function TopHud({ station, statusText, isPowered }: TopHudProps) {
  return (
    <header className="top-hud" aria-live="polite">
      <p className="top-hud__brand">Dhuni</p>
      <div className="top-hud__station">
        <h1>{station.name}</h1>
        <p>{station.tagline}</p>
      </div>
      <p className="top-hud__meta">
        <span>{station.season}</span>
        <span>{station.mood}</span>
        <span>{station.tradition}</span>
      </p>
      <p className={`top-hud__state ${isPowered ? 'is-active' : ''}`}>{statusText}</p>
    </header>
  );
}
