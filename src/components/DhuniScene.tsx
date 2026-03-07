import { useEffect, useRef, type CSSProperties } from 'react';
import type { Station } from '../data/stations';
import { CharacterSprite } from './CharacterSprite';

interface DhuniSceneProps {
  stations: Station[];
  stationIndex: number;
  isPowered: boolean;
  isPlaying: boolean;
  isStationSwitching: boolean;
  fireEnergy: number;
  onSelectStation: (index: number) => void;
  onActivateStation: (index: number) => void;
}

const CHARACTER_POSITIONS = [
  { x: 16, y: 34 },
  { x: 32, y: 24 },
  { x: 68, y: 24 },
  { x: 84, y: 34 },
  { x: 30, y: 69 },
  { x: 70, y: 69 },
];

export function DhuniScene({
  stations,
  stationIndex,
  isPowered,
  isPlaying,
  isStationSwitching,
  fireEnergy,
  onSelectStation,
  onActivateStation,
}: DhuniSceneProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const focused = document.activeElement;
    if (!(focused instanceof HTMLButtonElement) || !focused.classList.contains('dhuni-character')) {
      return;
    }

    buttonRefs.current[stationIndex]?.focus();
  }, [stationIndex]);

  return (
    <section
      className={`dhuni-scene ${isPowered ? 'is-powered' : ''} ${isPlaying ? 'is-playing' : ''} ${isStationSwitching ? 'is-switching' : ''}`}
      aria-label="Dhuni listening scene"
      style={{ '--fire-energy': fireEnergy.toFixed(2) } as CSSProperties}
    >
      <div className="dhuni-scene__sky" aria-hidden="true" />
      <div className="dhuni-scene__stars" aria-hidden="true">
        <span className="star s1" />
        <span className="star s2" />
        <span className="star s3" />
        <span className="star s4" />
      </div>

      <div className="dhuni-scene__ground" aria-hidden="true" />

      <div className="dhuni-fire" aria-hidden="true">
        <span className="dhuni-fire__glow" />
        <span className="dhuni-fire__pit" />
        <span className="dhuni-fire__flame flame-a" />
        <span className="dhuni-fire__flame flame-b" />
        <span className="dhuni-fire__flame flame-c" />
        <span className="dhuni-fire__ember ember-a" />
        <span className="dhuni-fire__ember ember-b" />
        <span className="dhuni-fire__ember ember-c" />
      </div>

      <ol className="dhuni-characters" aria-label="Stations gathered around the dhuni">
        {stations.map((station, index) => {
          const position = CHARACTER_POSITIONS[index] ?? CHARACTER_POSITIONS[index % CHARACTER_POSITIONS.length];
          const isActive = index === stationIndex;

          return (
            <li key={station.id} className="dhuni-characters__item" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
              <button
                type="button"
                className={`dhuni-character ${isActive ? 'is-active' : ''}`}
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                onClick={() => onActivateStation(index)}
                onFocus={() => onSelectStation(index)}
                aria-label={`${station.name}. ${station.tagline}`}
                aria-pressed={isActive}
              >
                <CharacterSprite
                  characterType={station.characterType}
                  accent={station.accent}
                  isActive={isActive}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
