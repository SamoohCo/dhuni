# Dhuni

Dhuni is a full-screen sacred listening landscape for Indian sound.

The browser window itself is the world:
- layered atmosphere and horizon depth
- one constant central dhuni fire (always burning)
- four pixel listener-characters gathered around the fire
- seasonal world-state shifts per station
- minimal floating overlays for metadata and controls

No framed stage. No dashboard shell. No visible YouTube UI.

## What stays stable

This refactor preserves the proven architecture:
- static Vite build for GitHub Pages
- YouTube playlist-backed stations
- hidden iframe player abstraction
- local station config file
- keyboard/media controls and local storage preferences

## Stack

- Vite
- React + TypeScript
- Plain CSS (layered world composition)
- YouTube Iframe Player API wrapper (`src/lib/youtubePlayer.ts`)

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

## World architecture

- `src/components/DhuniScene.tsx`: world composition and character interaction
- `src/components/LandscapeLayers.tsx`: sky/horizon/terrain/foreground depth layers
- `src/components/FireSprite.tsx`: hybrid sacred fire (flame layers, coals, embers, glow)
- `src/components/CharacterSprite.tsx`: pixel listener sprites
- `src/components/TopHud.tsx`: minimal top metadata overlay
- `src/components/ControlDock.tsx`: minimal floating control dock

## Station + character config

Edit `src/data/stations.ts`.

Each station maps to:
- one character
- one season state
- one playlist
- one world palette/camera profile

Important fields:
- `id`, `name`, `tagline`, `playlistId`
- `season`, `mood`, `tradition`, `description`
- `spriteType`, `environmentType`
- `cameraShiftX`, `cameraShiftY`
- `palette` (`sky`, `horizon`, `terrain`, `fog`, `ember`, `hud` tones)

Current seasonal worlds:
- Winter
- Summer
- Monsoon
- Post-monsoon

## Keyboard shortcuts

- `Space`: play/pause
- `ArrowLeft`: previous station
- `ArrowRight`: next station
- `ArrowUp`: volume up
- `ArrowDown`: volume down
- `M`: mute/unmute
- `Home`: first station
- `End`: last station
- `Enter`: activate focused character

Selection, scene state, and playback stay synchronized.

## Mobile behavior

- full-screen world remains intact
- all 4 characters remain visible and tappable
- top HUD condenses
- control dock stays minimal and reachable
- interaction does not depend on hover

## Media Session + web limits

Dhuni uses Media Session API where supported for:
- play/pause
- previous/next station
- metadata updates

Web limitation:
- browsers do not reliably expose OS hardware volume key interception to web apps.
- use in-app volume slider and ArrowUp/ArrowDown.

## Autoplay behavior

Browsers may block autoplay until a direct user interaction occurs.

Dhuni handles this with:
- interaction-led playback attempts
- graceful retry/error state when blocked

## GitHub Pages deployment

This remains static-only and GitHub Pages compatible.

`vite.config.ts`:

```ts
const base = process.env.VITE_BASE_PATH ?? '/';
```

- Custom domain (e.g. `dhuni.net`): use `/`
- Project subpath deploy: `VITE_BASE_PATH=/repo/ npm run build`

Current workflow deploys from `main` with `VITE_BASE_PATH=/`.
