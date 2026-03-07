export type CharacterType =
  | 'seer'
  | 'cinephile'
  | 'monsoon-coder'
  | 'raaga-scholar'
  | 'archivist'
  | 'night-listener';

export interface Station {
  id: string;
  name: string;
  tagline: string;
  playlistId: string;
  order: number;
  characterType?: CharacterType;
  mood?: string;
  era?: string;
  city?: string;
  accent?: string;
  shortDescription?: string;
}

export const stations: Station[] = [
  {
    id: 'raga-dawn',
    name: 'Raga Dawn',
    tagline: 'First light, tanpura, and unhurried breath.',
    playlistId: 'PLnA3oaYvI6k6jYFfTjJ7fX9M2nPzC8qv2',
    order: 0,
    characterType: 'seer',
    mood: 'Meditative',
    era: 'Classical',
    city: 'Varanasi',
    accent: '#f1c88f',
    shortDescription: 'A quiet early riser listening before the city wakes.',
  },
  {
    id: 'bombay-retro',
    name: 'Bombay Retro',
    tagline: 'Old cinema strings and rain on marine roads.',
    playlistId: 'PL4fGSI1pDJn5hdb0wqV4Oe4IYQ5m7vxr4',
    order: 1,
    characterType: 'cinephile',
    mood: 'Golden',
    era: '1950s-1970s',
    city: 'Mumbai',
    accent: '#e9a56c',
    shortDescription: 'A city-night romantic carrying a pocket notebook of songs.',
  },
  {
    id: 'monsoon-instrumentals',
    name: 'Monsoon Instrumentals',
    tagline: 'Cloud-light ragas and drifting instrumental rain.',
    playlistId: 'PLDcnymzs18LVyNfYQy6QfM6xG5jD4b9L7',
    order: 2,
    characterType: 'monsoon-coder',
    mood: 'Rainy',
    era: 'Contemporary',
    city: 'Kolkata',
    accent: '#9dc8d4',
    shortDescription: 'A soft-lit laptop listener writing through monsoon nights.',
  },
  {
    id: 'hindustani-evening',
    name: 'Hindustani Evening',
    tagline: 'Vilambit patience, drut release, dusk devotion.',
    playlistId: 'PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph',
    order: 3,
    characterType: 'raaga-scholar',
    mood: 'Focused',
    era: 'Concert',
    city: 'Delhi',
    accent: '#d9b48d',
    shortDescription: 'A raga student listening with complete attention.',
  },
  {
    id: 'air-archive',
    name: 'AIR Archive',
    tagline: 'Broadcast memory, static warmth, and public airwaves.',
    playlistId: 'PL590L5WQmH8fJ54FqHf9h0xJk1Yw2D7Pp',
    order: 4,
    characterType: 'archivist',
    mood: 'Archival',
    era: 'Broadcast',
    city: 'All India Radio',
    accent: '#b9af9b',
    shortDescription: 'An archivist with headphones preserving broadcast history.',
  },
  {
    id: 'midnight-tanpura',
    name: 'Midnight Tanpura',
    tagline: 'Deep-night drone and luminous stillness.',
    playlistId: 'PLzCxunOM5WFJHh4X4x7B6Y6m2f8r8h2Yd',
    order: 5,
    characterType: 'night-listener',
    mood: 'Nocturnal',
    era: 'Ambient',
    city: 'Bengaluru',
    accent: '#b1a3df',
    shortDescription: 'A midnight listener resting in long tanpura overtones.',
  },
];

export function getStationById(stationId: string): Station | undefined {
  return stations.find((station) => station.id === stationId);
}
