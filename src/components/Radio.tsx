import { useMemo, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { Station } from '../data/stations';
import { DialWindow } from './DialWindow';
import { PowerButton } from './PowerButton';
import { SpeakerGrille } from './SpeakerGrille';
import { StatusPanel } from './StatusPanel';
import { TuningKnob } from './TuningKnob';
import { VolumeKnob } from './VolumeKnob';

interface RadioProps {
  stations: Station[];
  stationIndex: number;
  lockedStationIndex: number | null;
  currentStation: Station;
  tunePosition: number;
  volume: number;
  isMuted: boolean;
  isPowered: boolean;
  isConnecting: boolean;
  isSwitching: boolean;
  lockStrength: number;
  statusText: string;
  error: string | null;
  onTogglePower: () => void;
  onTuneLive: (value: number) => void;
  onTuneCommit: () => void;
  onPreviousStation: () => void;
  onNextStation: () => void;
  onFirstStation: () => void;
  onLastStation: () => void;
  onVolumeChange: (value: number) => void;
  onVolumeIncrease: () => void;
  onVolumeDecrease: () => void;
  onToggleMute: () => void;
}

function getLockedStationId(stations: Station[], index: number | null): string | null {
  if (index === null) {
    return null;
  }

  return stations[index]?.id ?? null;
}

export function Radio({
  stations,
  stationIndex,
  lockedStationIndex,
  currentStation,
  tunePosition,
  volume,
  isMuted,
  isPowered,
  isConnecting,
  isSwitching,
  lockStrength,
  statusText,
  error,
  onTogglePower,
  onTuneLive,
  onTuneCommit,
  onPreviousStation,
  onNextStation,
  onFirstStation,
  onLastStation,
  onVolumeChange,
  onVolumeIncrease,
  onVolumeDecrease,
  onToggleMute,
}: RadioProps) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const style = useMemo(
    () =>
      ({
        '--parallax-x': parallax.x.toFixed(3),
        '--parallax-y': parallax.y.toFixed(3),
        '--lock-strength': lockStrength.toFixed(2),
      }) as CSSProperties,
    [lockStrength, parallax.x, parallax.y],
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setParallax({
      x: (x - 0.5) * 2,
      y: (y - 0.5) * 2,
    });
  };

  const handlePointerLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <article
      className={`radio ${isPowered ? 'is-powered' : ''} ${isSwitching ? 'is-switching' : ''}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <header className="radio__header">
        <div className="radio__brand">
          <span className="radio__name">Dhuni</span>
          <span className="radio__line">An eternal fire of Indian sound.</span>
        </div>
        <span className="radio__service">AIR / Transistor Service</span>
      </header>

      <DialWindow
        stations={stations}
        tunePosition={tunePosition}
        activeStationId={stations[stationIndex].id}
        lockedStationId={getLockedStationId(stations, lockedStationIndex)}
        isPowered={isPowered}
        isSwitching={isSwitching}
        lockStrength={lockStrength}
      />

      <section className="radio__body">
        <SpeakerGrille />
        <StatusPanel
          station={currentStation}
          statusText={statusText}
          error={error}
          isPowered={isPowered}
          isConnecting={isConnecting}
          isMuted={isMuted}
        />
      </section>

      <section className="radio__controls" aria-label="Radio controls">
        <div className="control-group control-group--power">
          <span className="control-group__label">Power</span>
          <PowerButton isPowered={isPowered} isConnecting={isConnecting} onToggle={onTogglePower} />
        </div>

        <TuningKnob
          value={tunePosition}
          stationName={currentStation.name}
          onChange={onTuneLive}
          onCommit={onTuneCommit}
          onStepLeft={onPreviousStation}
          onStepRight={onNextStation}
          onToStart={onFirstStation}
          onToEnd={onLastStation}
        />

        <VolumeKnob
          value={volume}
          isMuted={isMuted}
          onChange={onVolumeChange}
          onIncrease={onVolumeIncrease}
          onDecrease={onVolumeDecrease}
          onToggleMute={onToggleMute}
        />
      </section>

      <footer className="radio__footer">A Samooh production</footer>
    </article>
  );
}
