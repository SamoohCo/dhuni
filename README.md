# Dhuni

Dhuni is a static web app for ambient Indian internet radio, now presented as a calm pixel-art-inspired night scene centered around a sacred fire.

The interface is a tiny digital campfire:
- a central dhuni flame
- 6 listeners gathered around it (each character maps to one playlist/station)
- minimal controls for play/pause, mute, and volume

No dashboard UI, no game systems, no visible YouTube chrome.

## Stack

- Vite
- React + TypeScript
- Plain CSS (handcrafted scene styling)
- YouTube Iframe Player API through a local wrapper abstraction

## Quick start

```bash
npm install
npm run dev
```

Build production assets:

```bash
npm run build
npm run preview
```

## Project structure

- `src/data/stations.ts`: character/station config (single source of truth)
- `src/hooks/useRadioState.ts`: playback + station selection state orchestration
- `src/lib/youtubePlayer.ts`: hidden YouTube playlist player abstraction
- `src/components/DhuniScene.tsx`: main ambient world scene
- `src/components/CharacterSprite.tsx`: station character silhouettes
- `src/components/NowPlayingPanel.tsx`: minimal metadata + controls strip
- `src/hooks/useKeyboardShortcuts.ts`: global keyboard behaviors
- `.github/workflows/deploy-pages.yml`: GitHub Pages build/deploy

## Character/station config

Edit `src/data/stations.ts`.

Each entry includes:
- `id`
- `name`
- `tagline`
- `playlistId`
- `order`
- optional: `characterType`, `mood`, `era`, `city`, `accent`, `shortDescription`

Characters and playlists are the same thing conceptually:
- one character = one station = one YouTube playlist

## Playlist mapping model

Dhuni keeps the same zero-cost architecture:
- playlists are local config entries
- selecting a character changes station
- playback is loaded from that character's `playlistId`

You can swap playlist IDs without changing UI logic.

## Keyboard shortcuts

- `Space`: play/pause
- `ArrowLeft`: previous character/station
- `ArrowRight`: next character/station
- `ArrowUp`: volume up
- `ArrowDown`: volume down
- `M`: mute/unmute
- `Home`: first character/station
- `End`: last character/station
- `Enter`: activate focused character button

Keyboard interactions update selection, metadata, and playback state in sync.

## Media Session + browser limitations

Dhuni uses Media Session API (where available) for:
- play/pause action handlers
- previous/next station handlers
- station metadata updates

Web limitation (important):
- Browsers do **not** expose reliable cross-browser interception of true OS/hardware volume keys to web apps.
- In-app volume is controlled by the volume slider and keyboard arrows.

## Autoplay behavior

Browsers may require explicit user interaction before audio playback.

Dhuni handles this by:
- attempting playback on interaction
- showing a graceful retry/error state when blocked

## GitHub Pages deployment

The app is static-only and deploys via GitHub Pages Actions.

`vite.config.ts` uses:

```ts
const base = process.env.VITE_BASE_PATH ?? '/';
```

For custom domains (for example `dhuni.net`), build with root base path (`/`).

For project-subpath deploys (for example `https://user.github.io/repo/`), set:

```bash
VITE_BASE_PATH=/repo/ npm run build
```

Current workflow deploys from `main` and uses `VITE_BASE_PATH=/`.

## Optional future polish points

- add subtle station-specific ambient SFX hooks in `useRadioState.ts`
- add alternate scene palettes (dawn / monsoon / midnight)
- extend character sprites while keeping silhouettes simple
