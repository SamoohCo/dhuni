import type { Station } from '../data/stations';

interface StatusPanelProps {
  station: Station;
  statusText: string;
  error: string | null;
  isPowered: boolean;
  isConnecting: boolean;
  isMuted: boolean;
}

export function StatusPanel({
  station,
  statusText,
  error,
  isPowered,
  isConnecting,
  isMuted,
}: StatusPanelProps) {
  return (
    <section className="status-panel" aria-live="polite">
      <div className="status-panel__topline">
        <span className={`status-panel__badge ${isPowered ? 'is-live' : ''}`}>ON AIR</span>
        <span className="status-panel__state">{statusText}</span>
      </div>

      <h1 className="status-panel__name">{station.name}</h1>
      <p className="status-panel__tagline">{station.tagline}</p>

      <div className="status-panel__meta" aria-label="Station metadata">
        <span>{station.city ?? 'India'}</span>
        <span>{station.era ?? 'Broadcast'}</span>
        <span>{station.mood ?? 'Curated'}</span>
      </div>

      {isConnecting ? <p className="status-panel__message">Locking frequency...</p> : null}
      {isMuted ? <p className="status-panel__message">Muted</p> : null}
      {error ? <p className="status-panel__error">{error}</p> : null}
    </section>
  );
}
