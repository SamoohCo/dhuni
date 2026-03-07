import type { CSSProperties } from 'react';

interface FirePixel {
  x: number;
  y: number;
  tone: 'core' | 'warm' | 'deep';
}

const flameFrame: FirePixel[] = [
  { x: 4, y: 0, tone: 'core' },
  { x: 3, y: 1, tone: 'core' },
  { x: 4, y: 1, tone: 'warm' },
  { x: 5, y: 1, tone: 'core' },
  { x: 2, y: 2, tone: 'warm' },
  { x: 3, y: 2, tone: 'core' },
  { x: 4, y: 2, tone: 'warm' },
  { x: 5, y: 2, tone: 'warm' },
  { x: 6, y: 2, tone: 'deep' },
  { x: 2, y: 3, tone: 'deep' },
  { x: 3, y: 3, tone: 'warm' },
  { x: 4, y: 3, tone: 'core' },
  { x: 5, y: 3, tone: 'warm' },
  { x: 6, y: 3, tone: 'deep' },
  { x: 3, y: 4, tone: 'deep' },
  { x: 4, y: 4, tone: 'warm' },
  { x: 5, y: 4, tone: 'deep' },
];

const pitPixels: FirePixel[] = [
  { x: 1, y: 0, tone: 'deep' },
  { x: 2, y: 0, tone: 'deep' },
  { x: 3, y: 0, tone: 'deep' },
  { x: 4, y: 0, tone: 'deep' },
  { x: 5, y: 0, tone: 'deep' },
  { x: 6, y: 0, tone: 'deep' },
  { x: 7, y: 0, tone: 'deep' },
  { x: 0, y: 1, tone: 'deep' },
  { x: 1, y: 1, tone: 'deep' },
  { x: 2, y: 1, tone: 'deep' },
  { x: 3, y: 1, tone: 'deep' },
  { x: 4, y: 1, tone: 'deep' },
  { x: 5, y: 1, tone: 'deep' },
  { x: 6, y: 1, tone: 'deep' },
  { x: 7, y: 1, tone: 'deep' },
  { x: 8, y: 1, tone: 'deep' },
];

function pixelStyle(pixel: FirePixel): CSSProperties {
  return {
    left: `${pixel.x * 7}px`,
    top: `${pixel.y * 7}px`,
    '--tone': `var(--fire-${pixel.tone})`,
  } as CSSProperties;
}

export function FireSprite() {
  return (
    <div className="fire-sprite" aria-hidden="true">
      <div className="fire-sprite__glow" />
      <div className="fire-sprite__flame">
        {flameFrame.map((pixel, index) => (
          <span key={`f-${index}`} className="fire-sprite__pixel" style={pixelStyle(pixel)} />
        ))}
      </div>
      <div className="fire-sprite__pit">
        {pitPixels.map((pixel, index) => (
          <span key={`p-${index}`} className="fire-sprite__pixel" style={pixelStyle(pixel)} />
        ))}
      </div>
      <span className="fire-sprite__ember ember-a" />
      <span className="fire-sprite__ember ember-b" />
      <span className="fire-sprite__ember ember-c" />
    </div>
  );
}
