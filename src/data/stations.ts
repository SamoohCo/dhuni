export type Season = 'winter' | 'summer' | 'monsoon' | 'post-monsoon';

export type CharacterType =
  | 'winter-listener'
  | 'summer-vidushi'
  | 'monsoon-writer'
  | 'sharad-archivist';

export interface StationPalette {
  skyTop: string;
  skyBottom: string;
  fog: string;
  ground: string;
  ember: string;
  accent: string;
  hudGlass: string;
}

export interface Station {
  id: string;
  name: string;
  tagline: string;
  playlistId: string;
  order: number;
  season: Season;
  mood: string;
  tradition: string;
  description: string;
  spriteType: CharacterType;
  environmentType: 'still-air' | 'heat-haze' | 'rain-haze' | 'clear-evening';
  cameraShiftX: number;
  cameraShiftY: number;
  palette: StationPalette;
}

export const stations: Station[] = [
  {
    id: 'winter-dawn',
    name: 'Winter Dawn',
    tagline: 'Cool breath, tanpura drone, first blue light.',
    playlistId: 'PLnA3oaYvI6k6jYFfTjJ7fX9M2nPzC8qv2',
    order: 0,
    season: 'winter',
    mood: 'Contemplative',
    tradition: 'Hindustani Dawn',
    description: 'A shawled listener in still air before sunrise.',
    spriteType: 'winter-listener',
    environmentType: 'still-air',
    cameraShiftX: -1.5,
    cameraShiftY: -0.8,
    palette: {
      skyTop: '#111b31',
      skyBottom: '#202e49',
      fog: 'rgba(181, 201, 227, 0.22)',
      ground: '#2b2731',
      ember: '#f6b571',
      accent: '#d5c7a6',
      hudGlass: 'rgba(19, 29, 46, 0.46)',
    },
  },
  {
    id: 'summer-noon',
    name: 'Summer Noon',
    tagline: 'Bright discipline, veena lines, radiant heat.',
    playlistId: 'PL4fGSI1pDJn5hdb0wqV4Oe4IYQ5m7vxr4',
    order: 1,
    season: 'summer',
    mood: 'Luminous',
    tradition: 'Carnatic Midday',
    description: 'A precise listener holding rhythm in dry warm light.',
    spriteType: 'summer-vidushi',
    environmentType: 'heat-haze',
    cameraShiftX: 1.2,
    cameraShiftY: -0.6,
    palette: {
      skyTop: '#1a2034',
      skyBottom: '#3b2f2d',
      fog: 'rgba(244, 166, 94, 0.18)',
      ground: '#44312f',
      ember: '#ffb26b',
      accent: '#f0b67f',
      hudGlass: 'rgba(39, 26, 22, 0.42)',
    },
  },
  {
    id: 'monsoon-instrumentals',
    name: 'Monsoon Instrumentals',
    tagline: 'Rain haze, reflective strings, long listening.',
    playlistId: 'PLDcnymzs18LVyNfYQy6QfM6xG5jD4b9L7',
    order: 2,
    season: 'monsoon',
    mood: 'Reflective',
    tradition: 'Instrumental Rain',
    description: 'A night writer with umbrella and soft laptop glow.',
    spriteType: 'monsoon-writer',
    environmentType: 'rain-haze',
    cameraShiftX: -0.8,
    cameraShiftY: -0.2,
    palette: {
      skyTop: '#121f2f',
      skyBottom: '#233b4b',
      fog: 'rgba(136, 188, 212, 0.24)',
      ground: '#25343e',
      ember: '#f0a662',
      accent: '#99c7d9',
      hudGlass: 'rgba(16, 39, 52, 0.42)',
    },
  },
  {
    id: 'sharad-archive',
    name: 'Sharad Archive',
    tagline: 'Clean evening air, AIR memory, mellow warmth.',
    playlistId: 'PL590L5WQmH8fJ54FqHf9h0xJk1Yw2D7Pp',
    order: 3,
    season: 'post-monsoon',
    mood: 'Archival',
    tradition: 'Broadcast Evening',
    description: 'An archivist with notes and headphones in calm twilight.',
    spriteType: 'sharad-archivist',
    environmentType: 'clear-evening',
    cameraShiftX: 1.4,
    cameraShiftY: -0.4,
    palette: {
      skyTop: '#181f30',
      skyBottom: '#2f3046',
      fog: 'rgba(197, 185, 160, 0.2)',
      ground: '#302a32',
      ember: '#f3ab67',
      accent: '#d4be98',
      hudGlass: 'rgba(31, 28, 38, 0.42)',
    },
  },
];

export function getStationById(stationId: string): Station | undefined {
  return stations.find((station) => station.id === stationId);
}
