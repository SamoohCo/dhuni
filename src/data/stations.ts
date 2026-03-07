export type Season = 'winter' | 'summer' | 'monsoon' | 'post-monsoon';

export type CharacterType =
  | 'winter-listener'
  | 'summer-vidushi'
  | 'monsoon-writer'
  | 'sharad-archivist';

export interface StationPalette {
  skyTop: string;
  skyBottom: string;
  horizonFar: string;
  horizonMid: string;
  terrain: string;
  fog: string;
  ember: string;
  firelight: string;
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
    palette: {
      skyTop: '#0f1a2f',
      skyBottom: '#1f3150',
      horizonFar: '#2d3f63',
      horizonMid: '#25334d',
      terrain: '#2a2934',
      fog: 'rgba(172, 197, 226, 0.23)',
      ember: '#f4b06d',
      firelight: 'rgba(240, 159, 82, 0.34)',
      accent: '#d6c7a7',
      hudGlass: 'rgba(16, 28, 44, 0.36)',
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
    palette: {
      skyTop: '#1c2338',
      skyBottom: '#463338',
      horizonFar: '#5a3d3d',
      horizonMid: '#4a3334',
      terrain: '#4b3331',
      fog: 'rgba(239, 166, 96, 0.2)',
      ember: '#ffb878',
      firelight: 'rgba(255, 171, 95, 0.39)',
      accent: '#efb981',
      hudGlass: 'rgba(39, 28, 25, 0.34)',
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
    palette: {
      skyTop: '#122031',
      skyBottom: '#224356',
      horizonFar: '#204052',
      horizonMid: '#203745',
      terrain: '#243740',
      fog: 'rgba(137, 191, 212, 0.25)',
      ember: '#eda564',
      firelight: 'rgba(237, 149, 85, 0.31)',
      accent: '#99c9da',
      hudGlass: 'rgba(16, 39, 52, 0.35)',
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
    palette: {
      skyTop: '#181f31',
      skyBottom: '#35344d',
      horizonFar: '#403852',
      horizonMid: '#383149',
      terrain: '#322c38',
      fog: 'rgba(196, 182, 159, 0.22)',
      ember: '#f1a967',
      firelight: 'rgba(240, 155, 87, 0.32)',
      accent: '#d4be9a',
      hudGlass: 'rgba(28, 27, 38, 0.34)',
    },
  },
];

export function getStationById(stationId: string): Station | undefined {
  return stations.find((station) => station.id === stationId);
}
