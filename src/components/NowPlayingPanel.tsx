import type { Station } from '../data/stations';

interface NowPlayingPanelProps {
  station: Station;
  statusText: string;
  isPowered: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isConnecting: boolean;
  error: string | null;
  onTogglePower: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
}

export function NowPlayingPanel({
  station,
  statusText,
  isPowered,
  isPlaying,
  isMuted,
  volume,
  isConnecting,
  error,
  onTogglePower,
  onToggleMute,
  onVolumeChange,
}: NowPlayingPanelProps) {
  return (
    <section className="now-playing" aria-live="polite">
      <div className="now-playing__meta">
        <p className="now-playing__label">Dhuni</p>
        <h1 className="now-playing__title">{station.name}</h1>
        <p className="now-playing__tagline">{station.tagline}</p>
        {station.shortDescription ? <p className="now-playing__description">{station.shortDescription}</p> : null}
      </div>

      <div className="now-playing__controls">
        <div className="now-playing__buttons">
          <button
            type="button"
            className="control-button"
            onClick={onTogglePower}
            aria-pressed={isPowered}
            aria-keyshortcuts="Space"
          >
            {isPowered ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            className="control-button"
            onClick={onToggleMute}
            aria-pressed={isMuted}
            aria-keyshortcuts="M"
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>

        <label className="volume-control" htmlFor="volume-range">
          <span>Volume</span>
          <input
            id="volume-range"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(volume * 100)}
            onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
            aria-label="Volume"
            aria-keyshortcuts="ArrowUp ArrowDown"
          />
        </label>

        <p className="now-playing__state">
          <span className={`state-dot ${isPowered && !isMuted ? 'is-live' : ''}`} aria-hidden="true" />
          {statusText}
        </p>
        {isConnecting ? <p className="now-playing__note">Starting playback...</p> : null}
        {error ? <p className="now-playing__error">{error}</p> : null}
        {isPlaying && !error ? <p className="now-playing__note">On air</p> : null}
      </div>
    </section>
  );
}
