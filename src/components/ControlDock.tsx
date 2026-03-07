interface ControlDockProps {
  isPowered: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePower: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  onPreviousStation: () => void;
  onNextStation: () => void;
}

export function ControlDock({
  isPowered,
  isMuted,
  volume,
  onTogglePower,
  onToggleMute,
  onVolumeChange,
  onPreviousStation,
  onNextStation,
}: ControlDockProps) {
  return (
    <section className="control-dock" aria-label="Playback controls">
      <button
        type="button"
        className="dock-button"
        onClick={onPreviousStation}
        aria-label="Previous station"
        aria-keyshortcuts="ArrowLeft"
      >
        Prev
      </button>

      <button
        type="button"
        className="dock-button dock-button--primary"
        onClick={onTogglePower}
        aria-pressed={isPowered}
        aria-keyshortcuts="Space"
      >
        {isPowered ? 'Pause' : 'Play'}
      </button>

      <button
        type="button"
        className="dock-button"
        onClick={onToggleMute}
        aria-pressed={isMuted}
        aria-keyshortcuts="M"
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      <label className="dock-volume" htmlFor="dock-volume-range">
        <span>Vol</span>
        <input
          id="dock-volume-range"
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

      <button
        type="button"
        className="dock-button"
        onClick={onNextStation}
        aria-label="Next station"
        aria-keyshortcuts="ArrowRight"
      >
        Next
      </button>
    </section>
  );
}
