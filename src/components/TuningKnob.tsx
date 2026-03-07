import { useKnobDrag } from '../hooks/useKnobDrag';
import type { CSSProperties, KeyboardEvent } from 'react';

interface TuningKnobProps {
  value: number;
  stationName: string;
  onChange: (value: number) => void;
  onCommit: () => void;
  onStepLeft: () => void;
  onStepRight: () => void;
  onToStart: () => void;
  onToEnd: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function TuningKnob({
  value,
  stationName,
  onChange,
  onCommit,
  onStepLeft,
  onStepRight,
  onToStart,
  onToEnd,
}: TuningKnobProps) {
  const { isDragging, onPointerDown } = useKnobDrag({
    value,
    min: 0,
    max: 100,
    sensitivity: 0.65,
    onChange,
    onCommit: () => onCommit(),
  });

  const angle = -140 + value * 2.8;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onStepLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onStepRight();
        break;
      case 'Home':
        event.preventDefault();
        onToStart();
        break;
      case 'End':
        event.preventDefault();
        onToEnd();
        break;
      case 'PageUp':
        event.preventDefault();
        onChange(clamp(value + 5, 0, 100));
        onCommit();
        break;
      case 'PageDown':
        event.preventDefault();
        onChange(clamp(value - 5, 0, 100));
        onCommit();
        break;
      default:
        break;
    }
  };

  return (
    <div className="control-group">
      <span className="control-group__label">Tuning</span>
      <div
        className={`radio-knob radio-knob--tuning ${isDragging ? 'is-dragging' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Tuning knob"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`Tuned to ${stationName}`}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{ '--knob-angle': `${angle}deg` } as CSSProperties}
      >
        <span className="radio-knob__indicator" aria-hidden="true" />
        <span className="radio-knob__center" aria-hidden="true" />
      </div>
    </div>
  );
}
