import { useMemo } from 'react';
import { DhuniScene } from './components/DhuniScene';
import { KeyboardLegend } from './components/KeyboardLegend';
import { NowPlayingPanel } from './components/NowPlayingPanel';
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

  return (
    <main className="app" aria-label="Dhuni ambient listening scene">
      <div className="app__ambient" aria-hidden="true" />

      <header className="app__header">
        <p className="app__mark">Dhuni</p>
        <p className="app__line">A tiny digital campfire for Indian sound.</p>
      </header>

      <DhuniScene
        stations={radio.stations}
        stationIndex={radio.stationIndex}
        isPowered={radio.isPowered}
        isPlaying={radio.isPlaying}
        isStationSwitching={radio.isStationSwitching}
        fireEnergy={radio.fireEnergy}
        onSelectStation={radio.selectStation}
        onActivateStation={radio.activateStation}
      />

      <NowPlayingPanel
        station={radio.currentStation}
        statusText={radio.statusText}
        isPowered={radio.isPowered}
        isPlaying={radio.isPlaying}
        isMuted={radio.isMuted}
        volume={radio.volume}
        isConnecting={radio.isConnecting}
        error={radio.error}
        onTogglePower={radio.togglePower}
        onToggleMute={radio.toggleMute}
        onVolumeChange={radio.setVolumeLevel}
      />

      <KeyboardLegend />

      {/* Hidden YouTube player host keeps playback infrastructure off-stage. */}
      <div ref={radio.playerHostRef} className="youtube-host" aria-hidden="true" />
    </main>
  );
}

export default App;
