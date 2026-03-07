import { useMemo } from 'react';
import { Radio } from './components/Radio';
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
    <main className="app" aria-label="Dhuni radio">
      <div className="app__ambient" aria-hidden="true" />
      <Radio
        stations={radio.stations}
        stationIndex={radio.stationIndex}
        lockedStationIndex={radio.lockedStationIndex}
        currentStation={radio.currentStation}
        tunePosition={radio.tunePosition}
        volume={radio.volume}
        isMuted={radio.isMuted}
        isPowered={radio.isPowered}
        isConnecting={radio.isConnecting}
        isSwitching={radio.isSwitching}
        lockStrength={radio.lockStrength}
        statusText={radio.statusText}
        error={radio.error}
        onTogglePower={radio.togglePower}
        onTuneLive={radio.setTunePositionLive}
        onTuneCommit={radio.commitTunePosition}
        onPreviousStation={radio.previousStation}
        onNextStation={radio.nextStation}
        onFirstStation={radio.firstStation}
        onLastStation={radio.lastStation}
        onVolumeChange={radio.setVolumeLevel}
        onVolumeIncrease={radio.volumeUp}
        onVolumeDecrease={radio.volumeDown}
        onToggleMute={radio.toggleMute}
      />

      <p className="app__hint">
        Space play/pause · ArrowLeft/ArrowRight tune · ArrowUp/ArrowDown volume · M mute · Home/End
      </p>

      {/* Hidden player host keeps the YouTube layer off-stage; controls stay radio-native. */}
      <div ref={radio.playerHostRef} className="youtube-host" aria-hidden="true" />
    </main>
  );
}

export default App;
