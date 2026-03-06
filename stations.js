// ============================================================
// DHUNI — Station Configuration
// ============================================================
// To add your own stations:
//   1. Get a YouTube playlist ID (the part after "list=" in the URL)
//   2. Add an object to the STATIONS array below
//   3. Pick a frequency between FREQ_MIN and FREQ_MAX
//   4. Keep at least 1.5 MHz between stations for clean separation
// ============================================================

// !! REPLACE the youtubePlaylistId values below with real YouTube playlist IDs !!
// To find an ID: open the playlist on YouTube → copy the `list=` param from the URL.
// Playlist must be Public or Unlisted. Embedding must be allowed by the channel.
const STATIONS = [
  {
    frequency: 91.1,
    name: "Raag Sangeet",
    description: "Hindustani classical — morning raags for the contemplative soul",
    youtubePlaylistId: "PLuCF5Yy_LGvDW-ydVRGFsyKll0qFAHDbY", // e.g. "PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  {
    frequency: 98.3,
    name: "Carnatic Hour",
    description: "South Indian classical — veena, mridangam, and the voice of devotion",
    youtubePlaylistId: "PLuCF5Yy_LGvDpzhMfcMXWjJZ1j4kDatmZ",
  },
  {
    frequency: 104.6,
    name: "Sufi Darbar",
    description: "Qawwali and sufi music — from the dargahs of the subcontinent",
    youtubePlaylistId: "PLuCF5Yy_LGvCzhBVV4iELYWhg_fLke0cx",
  },
];

// Tuning range (MHz)
const FREQ_MIN = 88.0;
const FREQ_MAX = 108.0;

// How close (in MHz) the dial must be to snap onto a station
const SNAP_RADIUS = 0.4;
