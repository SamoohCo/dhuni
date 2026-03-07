import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

interface KnobDragConfig {
  value: number;
  min: number;
  max: number;
  sensitivity: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
}

interface DragState {
  pointerId: number;
  centerX: number;
  centerY: number;
  previousAngle: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toDegrees(x: number, y: number): number {
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function shortestAngleDelta(current: number, previous: number): number {
  let delta = current - previous;

  if (delta > 180) {
    delta -= 360;
  } else if (delta < -180) {
    delta += 360;
  }

  return delta;
}

export function useKnobDrag({
  value,
  min,
  max,
  sensitivity,
  onChange,
  onCommit,
}: KnobDragConfig) {
  const valueRef = useRef(value);
  const stateRef = useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const stopDragging = useCallback(() => {
    if (!stateRef.current) {
      return;
    }

    setIsDragging(false);
    stateRef.current = null;
    onCommit?.(valueRef.current);
  }, [onCommit]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const dragState = stateRef.current;
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      event.preventDefault();

      const currentAngle = toDegrees(event.clientX - dragState.centerX, event.clientY - dragState.centerY);
      const angleDelta = shortestAngleDelta(currentAngle, dragState.previousAngle);

      dragState.previousAngle = currentAngle;
      const next = clamp(valueRef.current + angleDelta * sensitivity, min, max);

      if (next === valueRef.current) {
        return;
      }

      valueRef.current = next;
      onChange(next);
    },
    [max, min, onChange, sensitivity],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (!stateRef.current || event.pointerId !== stateRef.current.pointerId) {
        return;
      }

      stopDragging();
    },
    [stopDragging],
  );

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      event.preventDefault();

      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const previousAngle = toDegrees(event.clientX - centerX, event.clientY - centerY);

      stateRef.current = {
        pointerId: event.pointerId,
        centerX,
        centerY,
        previousAngle,
      };

      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  return {
    isDragging,
    onPointerDown,
  };
}
