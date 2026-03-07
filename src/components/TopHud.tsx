import type { Station } from '../data/stations';

interface TopHudProps {
  station: Station;
  statusText: string;
}

export function TopHud({ station, statusText }: TopHudProps) {
  return (
    <header className="top-hud" aria-live="polite">
      <p className="top-hud__brand">Dhuni</p>
      <p className="top-hud__line">
        <span className="top-hud__name">{station.name}</span>
        <span className="top-hud__dot">|</span>
        <span className="top-hud__tag">{station.mood}</span>
      </p>
      <p className="top-hud__tagline">{station.tagline}</p>
      <p className="top-hud__state">{statusText}</p>
    </header>
  );
}
