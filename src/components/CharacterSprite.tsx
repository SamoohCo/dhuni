import type { CharacterType } from '../data/stations';
import type { CSSProperties } from 'react';

interface CharacterSpriteProps {
  spriteType: CharacterType;
  accent: string;
  isActive: boolean;
}

export function CharacterSprite({ spriteType, accent, isActive }: CharacterSpriteProps) {
  return (
    <span
      className={`character-sprite is-${spriteType} ${isActive ? 'is-active' : ''}`}
      style={{ '--character-accent': accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="character-sprite__ground" />
      <span className="character-sprite__legs" />
      <span className="character-sprite__feet" />
      <span className="character-sprite__torso" />
      <span className="character-sprite__drape" />
      <span className="character-sprite__head" />
      <span className="character-sprite__hair" />
      <span className="character-sprite__arm character-sprite__arm--left" />
      <span className="character-sprite__arm character-sprite__arm--right" />
      <span className="character-sprite__prop" />
      <span className="character-sprite__detail" />
      <span className="character-sprite__highlight" />
    </span>
  );
}
