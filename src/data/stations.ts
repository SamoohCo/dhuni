export type Season = 'vasanta' | 'grishma' | 'varsha' | 'sharad' | 'hemanta' | 'shishira';

export type CharacterType =
  | 'vasanta-riser'
  | 'grishma-vidushi'
  | 'varsha-listener'
  | 'sharad-archivist'
  | 'hemanta-poet'
  | 'shishira-sadhu';

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
  environmentType:
    | 'bloom-air'
    | 'heat-haze'
    | 'rain-haze'
    | 'clear-evening'
    | 'mist-evening'
    | 'winter-stillness';
  palette: StationPalette;
}

export const stations: Station[] = [
  {
    id: 'vasanta-prabhat',
    name: 'Vasanta Prabhat',
    tagline: 'Dew on strings, the first raga of a waking world.',
    playlistId: 'TODO_VASANTA_PLAYLIST_ID',
    order: 0,
    season: 'vasanta',
    mood: 'Awakening',
    tradition: 'Hindustani morning ragas - Bhairav, Todi, Basant',
    description:
      'The threshold between stillness and movement: sarod, bansuri, and dawn ragas for a gentle beginning.',
    spriteType: 'vasanta-riser',
    environmentType: 'bloom-air',
    palette: {
      skyTop: '#121f34',
      skyBottom: '#314766',
      horizonFar: '#3f5575',
      horizonMid: '#324662',
      terrain: '#2d3442',
      fog: 'rgba(178, 215, 194, 0.22)',
      ember: '#f3b16f',
      firelight: 'rgba(243, 170, 96, 0.34)',
      accent: '#bdd9b8',
      hudGlass: 'rgba(17, 34, 50, 0.34)',
    },
  },
  {
    id: 'grishma-dopahar',
    name: 'Grishma Dopahar',
    tagline: 'A still afternoon. The veena holds the heat.',
    playlistId: 'TODO_GRISHMA_PLAYLIST_ID',
    order: 1,
    season: 'grishma',
    mood: 'Luminous stillness',
    tradition: 'Carnatic afternoon ragas - Charukesi, Hamsadhwani, Kalyani',
    description:
      'Courtyard heat and focused calm: veena and violin lines for unhurried midday listening.',
    spriteType: 'grishma-vidushi',
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
    id: 'varsha-raatri',
    name: 'Varsha Raatri',
    tagline: 'Rain on a tin roof. The raga opens.',
    playlistId: 'TODO_VARSHA_PLAYLIST_ID',
    order: 2,
    season: 'varsha',
    mood: 'Longing',
    tradition: 'Hindustani rain ragas - Miyan ki Malhar, Des, Desh',
    description:
      'Monsoon-night listening shaped by Malhar and bowed strings, with tabla moving like distant thunder.',
    spriteType: 'varsha-listener',
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
    id: 'sharad-sandhya',
    name: 'Sharad Sandhya',
    tagline: 'The light turns gold. Strings trace the evening.',
    playlistId: 'TODO_SHARAD_PLAYLIST_ID',
    order: 3,
    season: 'sharad',
    mood: 'Contemplative clarity',
    tradition: 'Semi-classical and instrumental - thumri, dadra, light classical',
    description:
      'Amber dusk with thumri, dadra, sitar, and santoor for the hour when day softens into evening.',
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
  {
    id: 'hemanta-geet',
    name: 'Hemanta Geet',
    tagline: 'Fog at the window. The voice carries further at night.',
    playlistId: 'TODO_HEMANTA_PLAYLIST_ID',
    order: 4,
    season: 'hemanta',
    mood: 'Intimate warmth',
    tradition: 'Rabindra Sangeet and Bengali classical - Hemanta and Tagore season',
    description:
      'Misty evenings and woodsmoke tempo, with Rabindra Sangeet and warm Bengali classical textures.',
    spriteType: 'hemanta-poet',
    environmentType: 'mist-evening',
    palette: {
      skyTop: '#171e34',
      skyBottom: '#3a3a53',
      horizonFar: '#484864',
      horizonMid: '#41405a',
      terrain: '#393340',
      fog: 'rgba(188, 181, 168, 0.24)',
      ember: '#efaa6d',
      firelight: 'rgba(236, 156, 88, 0.33)',
      accent: '#d6c2a8',
      hudGlass: 'rgba(30, 28, 40, 0.35)',
    },
  },
  {
    id: 'shishira-prahar',
    name: 'Shishira Prahar',
    tagline: 'Before dawn. A dhrupad opens into the cold.',
    playlistId: 'TODO_SHISHIRA_PLAYLIST_ID',
    order: 5,
    season: 'shishira',
    mood: 'Austere devotion',
    tradition: 'Dhrupad - the oldest living form of Indian classical music',
    description:
      'Deep winter discipline anchored in dhrupad, tanpura drone, and pre-dawn stillness.',
    spriteType: 'shishira-sadhu',
    environmentType: 'winter-stillness',
    palette: {
      skyTop: '#0c172c',
      skyBottom: '#1b2d49',
      horizonFar: '#293d5f',
      horizonMid: '#24354f',
      terrain: '#292b36',
      fog: 'rgba(170, 193, 221, 0.21)',
      ember: '#f2ab6b',
      firelight: 'rgba(238, 156, 86, 0.3)',
      accent: '#c6d0df',
      hudGlass: 'rgba(14, 26, 42, 0.37)',
    },
  },
];

export function getStationById(stationId: string): Station | undefined {
  return stations.find((station) => station.id === stationId);
}
