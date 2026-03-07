import { TuningScale } from './TuningScale';
import type { Station } from '../data/stations';

interface DialWindowProps {
  stations: Station[];
  tunePosition: number;
  activeStationId: string;
  lockedStationId: string | null;
  isPowered: boolean;
  isSwitching: boolean;
  lockStrength: number;
}

function toScalePercent(position: number): string {
  return `calc(6% + ${position * 0.88}%)`;
}

export function DialWindow({
  stations,
  tunePosition,
  activeStationId,
  lockedStationId,
  isPowered,
  isSwitching,
  lockStrength,
}: DialWindowProps) {
  return (
    <section
      className={`dial-window ${isPowered ? 'is-powered' : ''} ${isSwitching ? 'is-switching' : ''}`}
      aria-label="Tuning window"
    >
      <div className="dial-window__glass" />
      <TuningScale stations={stations} activeStationId={activeStationId} lockedStationId={lockedStationId} />
      <div
        className="dial-window__needle"
        style={{ left: toScalePercent(tunePosition) }}
        aria-hidden="true"
      />
      <div
        className="dial-window__lock-glow"
        style={{ opacity: isPowered ? Math.max(0.15, lockStrength) : 0 }}
        aria-hidden="true"
      />
    </section>
  );
}
