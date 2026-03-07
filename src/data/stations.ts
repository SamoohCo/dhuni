export interface Station {
  id: string;
  name: string;
  tagline: string;
  playlistId: string;
  dialPosition: number;
  mood?: string;
  era?: string;
  city?: string;
  description?: string;
}

export const stations: Station[] = [
  {
    id: 'raga-dawn',
    name: 'Raga Dawn',
    tagline: 'Morning alaap, tanpura and first light.',
    playlistId: 'PLnA3oaYvI6k6jYFfTjJ7fX9M2nPzC8qv2',
    dialPosition: 7,
    mood: 'Meditative',
    era: 'Classical',
    city: 'Varanasi',
    description: 'Slow Hindustani mornings and devotional textures.',
  },
  {
    id: 'bombay-retro',
    name: 'Bombay Retro',
    tagline: 'Celluloid strings, brass and vinyl hiss.',
    playlistId: 'PL4fGSI1pDJn5hdb0wqV4Oe4IYQ5m7vxr4',
    dialPosition: 26,
    mood: 'Golden',
    era: '1950s-1970s',
    city: 'Bombay',
    description: 'Film-era orchestration and timeless playback voices.',
  },
  {
    id: 'monsoon-instrumentals',
    name: 'Monsoon Instrumentals',
    tagline: 'Rain-washed sitar, sarod and late-evening ambience.',
    playlistId: 'PLDcnymzs18LVyNfYQy6QfM6xG5jD4b9L7',
    dialPosition: 45,
    mood: 'Ambient',
    era: 'Contemporary',
    city: 'Kolkata',
    description: 'Instrumental Indian soundscapes for weathered afternoons.',
  },
  {
    id: 'hindustani-evening',
    name: 'Hindustani Evening',
    tagline: 'Vilambit to drut as dusk settles.',
    playlistId: 'PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph',
    dialPosition: 63,
    mood: 'Deep Listening',
    era: 'Concert',
    city: 'Delhi',
    description: 'Evening ragas with expansive live performance arcs.',
  },
  {
    id: 'air-archive',
    name: 'AIR Archive',
    tagline: 'Broadcast memory from the national airwaves.',
    playlistId: 'PL590L5WQmH8fJ54FqHf9h0xJk1Yw2D7Pp',
    dialPosition: 84,
    mood: 'Archival',
    era: 'Broadcast',
    city: 'All India Radio',
    description: 'Historic broadcast textures and archival speech music blends.',
  },
  {
    id: 'night-transistor',
    name: 'Night Transistor',
    tagline: 'Low-lit ghazal, lounge and instrumental drift.',
    playlistId: 'PLzCxunOM5WFJHh4X4x7B6Y6m2f8r8h2Yd',
    dialPosition: 97,
    mood: 'Nocturnal',
    era: 'Vintage to Modern',
    city: 'Mumbai',
    description: 'After-hours listening for long, unhurried nights.',
  },
];

export const STATION_LOCK_THRESHOLD = 6;

export function clampDialPosition(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function getStationById(stationId: string): Station | undefined {
  return stations.find((station) => station.id === stationId);
}

export function getNearestStationIndex(position: number): number {
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  stations.forEach((station, index) => {
    const distance = Math.abs(station.dialPosition - position);
    if (distance < nearestDistance) {
      nearest = index;
      nearestDistance = distance;
    }
  });

  return nearest;
}
