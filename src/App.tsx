import { useMemo, type CSSProperties } from 'react';
import { ControlDock } from './components/ControlDock';
import { DhuniScene } from './components/DhuniScene';
import { TopHud } from './components/TopHud';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useRadioState } from './hooks/useRadioState';

function App() {
  const radio = useRadioState();

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
        <a href="https://samooh.com" target="_blank" rel="noreferrer noopener">
          Samooh
        </a>
      </footer>

      {/* Hidden YouTube player host keeps playback infrastructure off-stage. */}
      <div ref={radio.playerHostRef} className="youtube-host" aria-hidden="true" />
    </main>
  );
}

export default App;
