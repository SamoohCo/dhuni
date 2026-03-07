import { useEffect, useRef, type CSSProperties } from 'react';
import type { Station } from '../data/stations';
import { CharacterSprite } from './CharacterSprite';
import { FireSprite } from './FireSprite';

interface DhuniSceneProps {
  stations: Station[];
  stationIndex: number;
  currentStation: Station;
  isPowered: boolean;
  isPlaying: boolean;
  isStationSwitching: boolean;
  fireEnergy: number;
  onSelectStation: (index: number) => void;
  onActivateStation: (index: number) => void;
}

const CHARACTER_POSITIONS = [
  { x: 25, y: 56 },
  { x: 41, y: 47 },
  { x: 59, y: 47 },
  { x: 75, y: 56 },
];

export function DhuniScene({
  stations,
  stationIndex,
  currentStation,
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
    if (!(focused instanceof HTMLButtonElement) || !focused.classList.contains('world-character')) {
      return;
    }

    buttonRefs.current[stationIndex]?.focus();
  }, [stationIndex]);

  const worldStyle = {
    '--sky-top': currentStation.palette.skyTop,
    '--sky-bottom': currentStation.palette.skyBottom,
    '--fog': currentStation.palette.fog,
    '--ground': currentStation.palette.ground,
    '--ember': currentStation.palette.ember,
    '--accent': currentStation.palette.accent,
    '--camera-x': `${currentStation.cameraShiftX}%`,
    '--camera-y': `${currentStation.cameraShiftY}%`,
    '--fire-energy': fireEnergy.toFixed(2),
  } as CSSProperties;

  return (
    <section
      className={`world world--${currentStation.season} env--${currentStation.environmentType} ${isPowered ? 'is-powered' : ''} ${isPlaying ? 'is-playing' : ''} ${isStationSwitching ? 'is-switching' : ''}`}
      style={worldStyle}
      aria-label="Dhuni world"
    >
      <div className="world__sky" aria-hidden="true" />
      <div className="world__atmosphere" aria-hidden="true" />
      <div className="world__weather" aria-hidden="true">
        <span className="weather-particle p1" />
        <span className="weather-particle p2" />
        <span className="weather-particle p3" />
        <span className="weather-particle p4" />
      </div>

      <div className="world__ground" aria-hidden="true" />

      <div className="world__fire-anchor">
        <FireSprite />
      </div>

      <ol className="world-characters" aria-label="Characters around the dhuni">
        {stations.map((station, index) => {
          const position = CHARACTER_POSITIONS[index] ?? CHARACTER_POSITIONS[index % CHARACTER_POSITIONS.length];
          const isActive = index === stationIndex;

          return (
            <li
              key={station.id}
              className={`world-characters__item ${isActive ? 'is-active' : ''}`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <button
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                type="button"
                className={`world-character ${isActive ? 'is-active' : ''}`}
                onClick={() => onActivateStation(index)}
                onFocus={() => onSelectStation(index)}
                aria-label={`${station.name}. ${station.tagline}`}
                aria-pressed={isActive}
              >
                <CharacterSprite
                  spriteType={station.spriteType}
                  accent={station.palette.accent}
                  isActive={isActive}
                />
              </button>
              <span className="world-character__caption">{station.name}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
