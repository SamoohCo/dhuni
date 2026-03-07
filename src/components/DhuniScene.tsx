import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Station } from '../data/stations';
import { CharacterSprite } from './CharacterSprite';
import { FireSprite } from './FireSprite';
import { LandscapeLayers } from './LandscapeLayers';

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
  { x: 43, y: 60, scale: 0.9 },
  { x: 57, y: 60, scale: 0.9 },
  { x: 67, y: 66, scale: 0.97 },
  { x: 60, y: 72, scale: 1.03 },
  { x: 40, y: 72, scale: 1.03 },
  { x: 33, y: 66, scale: 0.97 },
];

const MOBILE_CHARACTER_POSITIONS = [
  { x: 38, y: 64, scale: 0.9 },
  { x: 62, y: 64, scale: 0.9 },
  { x: 70, y: 70, scale: 0.97 },
  { x: 58, y: 76, scale: 1.03 },
  { x: 42, y: 76, scale: 1.03 },
  { x: 30, y: 70, scale: 0.97 },
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
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 680px)').matches : false,
  );

  useEffect(() => {
    const focused = document.activeElement;
    if (!(focused instanceof HTMLButtonElement) || !focused.classList.contains('world-character')) {
      return;
    }

    buttonRefs.current[stationIndex]?.focus();
  }, [stationIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 680px)');
    const handleChange = () => {
      setIsCompactViewport(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const worldStyle = {
    '--sky-top': currentStation.palette.skyTop,
    '--sky-bottom': currentStation.palette.skyBottom,
    '--horizon-far': currentStation.palette.horizonFar,
    '--horizon-mid': currentStation.palette.horizonMid,
    '--terrain': currentStation.palette.terrain,
    '--fog': currentStation.palette.fog,
    '--ember': currentStation.palette.ember,
    '--firelight': currentStation.palette.firelight,
    '--accent': currentStation.palette.accent,
    '--fire-energy': fireEnergy.toFixed(2),
  } as CSSProperties;
  const characterPositions = isCompactViewport ? MOBILE_CHARACTER_POSITIONS : CHARACTER_POSITIONS;

  return (
    <section
      className={`world world--${currentStation.season} env--${currentStation.environmentType} ${isPowered ? 'is-powered' : ''} ${isPlaying ? 'is-playing' : ''} ${isStationSwitching ? 'is-switching' : ''}`}
      style={worldStyle}
      aria-label="Dhuni landscape world"
    >
      <div className="world__camera-plane">
        <LandscapeLayers />

        <div className="world__firelight" aria-hidden="true" />

        <div className="world__fire-anchor">
          <FireSprite />
        </div>

        <ol className="world-characters" aria-label="Characters around the dhuni">
          {stations.map((station, index) => {
            const position = characterPositions[index] ?? characterPositions[index % characterPositions.length];
            const isActive = index === stationIndex;

            return (
              <li
                key={station.id}
                className={`world-characters__item ${isActive ? 'is-active' : ''}`}
                style={
                  {
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    '--char-scale': position.scale.toFixed(2),
                    zIndex: Math.round(position.y * 10),
                  } as CSSProperties
                }
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
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
