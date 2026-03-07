import { useKnobDrag } from '../hooks/useKnobDrag';
import type { CSSProperties, KeyboardEvent } from 'react';

interface VolumeKnobProps {
  value: number;
  isMuted: boolean;
  onChange: (value: number) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onToggleMute: () => void;
}

export function VolumeKnob({
  value,
  isMuted,
  onChange,
  onIncrease,
  onDecrease,
  onToggleMute,
}: VolumeKnobProps) {
  const normalized = isMuted ? 0 : value;
  const { isDragging, onPointerDown } = useKnobDrag({
    value: normalized,
    min: 0,
    max: 1,
    sensitivity: 0.01,
    onChange,
  });

  const angle = -140 + normalized * 280;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        event.preventDefault();
        onIncrease();
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        event.preventDefault();
        onDecrease();
        break;
      case 'Home':
        event.preventDefault();
        onChange(0);
        break;
      case 'End':
        event.preventDefault();
        onChange(1);
        break;
      default:
        if (event.key.toLowerCase() === 'm') {
          event.preventDefault();
          onToggleMute();
        }
    }
  };

  return (
    <div className="control-group">
      <span className="control-group__label">Volume</span>
      <div
        className={`radio-knob radio-knob--volume ${isMuted ? 'is-muted' : ''} ${isDragging ? 'is-dragging' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Volume knob"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(normalized * 100)}
        aria-valuetext={isMuted ? 'Muted' : `${Math.round(normalized * 100)} percent`}
        aria-keyshortcuts="ArrowUp ArrowDown M"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{ '--knob-angle': `${angle}deg` } as CSSProperties}
      >
        <span className="radio-knob__indicator" aria-hidden="true" />
        <span className="radio-knob__center" aria-hidden="true" />
      </div>
      <span className="control-group__subtle">{isMuted ? 'Muted (M)' : 'Press M to mute'}</span>
    </div>
  );
}
