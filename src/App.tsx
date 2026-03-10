import { useMemo, useState, type CSSProperties } from 'react';
import { ControlDock } from './components/ControlDock';
import { DhuniScene } from './components/DhuniScene';
import { TopHud } from './components/TopHud';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useRadioState } from './hooks/useRadioState';

const INFO_DISMISSED_KEY = 'dhuni.info.dismissed.v1';

function hasDismissedInfo(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(INFO_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function persistInfoDismissed(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(INFO_DISMISSED_KEY, '1');
  } catch {
    // Ignore storage errors and keep UX flowing.
  }
}

function App() {
  const radio = useRadioState();
  const [hasSeenInfo, setHasSeenInfo] = useState(() => hasDismissedInfo());
  const [showInfo, setShowInfo] = useState(() => !hasDismissedInfo());

  const keyboardActions = useMemo(
    () => ({
      togglePower: radio.togglePower,
      previousStation: radio.previousStation,
      nextStation: radio.nextStation,
      volumeUp: radio.volumeUp,
      volumeDown: radio.volumeDown,
      toggleMute: radio.toggleMute,
      firstStation: radio.firstStation,
      lastStation: radio.lastStation,
    }),
    [
      radio.firstStation,
      radio.lastStation,
      radio.nextStation,
      radio.previousStation,
      radio.toggleMute,
      radio.togglePower,
      radio.volumeDown,
      radio.volumeUp,
    ],
  );

  useKeyboardShortcuts(keyboardActions);

  const appStyle = useMemo(
    () =>
      ({
        '--hud-glass': radio.currentStation.palette.hudGlass,
        '--hud-accent': radio.currentStation.palette.accent,
      }) as CSSProperties,
    [radio.currentStation.palette.accent, radio.currentStation.palette.hudGlass],
  );

  const closeInfo = () => {
    setShowInfo(false);
    if (!hasSeenInfo) {
      persistInfoDismissed();
      setHasSeenInfo(true);
    }
  };

  const startFromInfo = () => {
    radio.startListening();
    closeInfo();
  };

  return (
    <main className="app" aria-label="Dhuni ambient world" style={appStyle}>
      <DhuniScene
        stations={radio.stations}
        stationIndex={radio.stationIndex}
        currentStation={radio.currentStation}
        isPowered={radio.isPowered}
        isPlaying={radio.isPlaying}
        isStationSwitching={radio.isStationSwitching}
        fireEnergy={radio.fireEnergy}
        onSelectStation={radio.selectStation}
        onActivateStation={radio.activateStation}
      />

      <TopHud station={radio.currentStation} statusText={radio.statusText} />

      <button
        type="button"
        className="world-info-toggle"
        onClick={() => setShowInfo((value) => !value)}
        aria-label={showInfo ? 'Hide Dhuni information' : 'Show Dhuni information'}
        aria-pressed={showInfo}
      >
        ℹ
      </button>

      {showInfo ? (
        <section className="world-info-panel" role="dialog" aria-label="About Dhuni">
          <p className="world-info-panel__title">About Dhuni</p>
          <p className="world-info-panel__body">
            Six ritus, six moods, one sacred fire:
            <br />
            Vasanta, Grishma, Varsha, Sharad, Hemanta, Shishira.
          </p>
          <p className="world-info-panel__shortcuts">
            Space play/pause • ←/→ station • ↑/↓ volume • M mute • Home/End jump
          </p>
          <div className="world-info-panel__actions">
            <button type="button" className="world-info-panel__button" onClick={closeInfo}>
              Close
            </button>
            <button
              type="button"
              className="world-info-panel__button world-info-panel__button--primary"
              onClick={startFromInfo}
            >
              Start Listening
            </button>
          </div>
        </section>
      ) : null}

      <ControlDock
        isPowered={radio.isPowered}
        isMuted={radio.isMuted}
        volume={radio.volume}
        onTogglePower={radio.togglePower}
        onToggleMute={radio.toggleMute}
        onVolumeChange={radio.setVolumeLevel}
        onPreviousStation={radio.previousStation}
        onNextStation={radio.nextStation}
      />

      <footer className="world-credit">
        Handcrafted with love at{' '}
        <a href="https://samooh.com/?ref=dhuni.net" target="_blank" rel="noreferrer noopener">
          Samooh
        </a>
      </footer>

      {/* Hidden YouTube player host keeps playback infrastructure off-stage. */}
      <div ref={radio.playerHostRef} className="youtube-host" aria-hidden="true" />
    </main>
  );
}

export default App;
