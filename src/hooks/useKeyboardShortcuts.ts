import { useEffect } from 'react';

interface KeyboardShortcutActions {
  togglePower: () => void;
  previousStation: () => void;
  nextStation: () => void;
  volumeUp: () => void;
  volumeDown: () => void;
  toggleMute: () => void;
  firstStation: () => void;
  lastStation: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return (
    target.isContentEditable ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    Boolean(target.closest('[contenteditable="true"]'))
  );
}

export function useKeyboardShortcuts(actions: KeyboardShortcutActions): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          actions.togglePower();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          actions.previousStation();
          break;
        case 'ArrowRight':
          event.preventDefault();
          actions.nextStation();
          break;
        case 'ArrowUp':
          event.preventDefault();
          // Web apps cannot reliably intercept OS-level hardware volume keys.
          actions.volumeUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          actions.volumeDown();
          break;
        case 'Home':
          event.preventDefault();
          actions.firstStation();
          break;
        case 'End':
          event.preventDefault();
          actions.lastStation();
          break;
        case 'Enter': {
          const focused = document.activeElement;
          if (focused instanceof HTMLButtonElement && focused.classList.contains('dhuni-character')) {
            event.preventDefault();
            focused.click();
          }
          break;
        }
        default:
          if (event.key.toLowerCase() === 'm') {
            event.preventDefault();
            actions.toggleMute();
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions]);
}
