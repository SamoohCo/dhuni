import type { CharacterType } from '../data/stations';
import type { CSSProperties } from 'react';

interface CharacterSpriteProps {
  characterType?: CharacterType;
  accent?: string;
  isActive: boolean;
}

export function CharacterSprite({ characterType, accent, isActive }: CharacterSpriteProps) {
  return (
    <span
      className={`character-sprite ${characterType ? `is-${characterType}` : ''} ${isActive ? 'is-active' : ''}`}
      style={{ '--character-accent': accent ?? '#d8c1a6' } as CSSProperties}
      aria-hidden="true"
    >
      <span className="character-sprite__shadow" />
      <span className="character-sprite__body" />
      <span className="character-sprite__head" />
      <span className="character-sprite__prop" />
    </span>
  );
}
