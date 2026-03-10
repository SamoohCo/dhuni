# Dhuni

Dhuni is a full-screen sacred listening landscape for Indian sound.
Built by [Samooh](https://samooh.com).

The browser window itself is the world:
- layered atmosphere and horizon depth
- one constant central dhuni fire (always burning)
- six pixel listener-characters gathered around the fire
- six ritu world-state shifts per station
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
- optional: `startIndex` (helps avoid similar opening tracks across stations)
- `season`, `mood`, `tradition`, `description`
- `spriteType`, `environmentType`
- `palette` (`sky`, `horizon`, `terrain`, `fog`, `ember`, `hud` tones)

If you want to update stations quickly, collect this per season:
- required: `playlistId` (YouTube playlist ID only, not full URL)
- optional: `startIndex` (0-based index into the playlist for station entry point)
- recommended: `name` and `tagline`
- optional: `mood`, `tradition`, `description`

Current seasonal worlds:
- Vasanta
- Grishma
- Varsha
- Sharad
- Hemanta
- Shishira

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
- all 6 characters remain visible and tappable
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

## Tracking surface

- GA4 (`gtag`) is loaded from `index.html` for analytics.
- YouTube requests are now deferred until an explicit playback action (play/power/activate station).
- Dhuni uses `youtube-nocookie.com` for embed host, which can reduce cookie use before interaction.
- Once playback starts, YouTube may still call Google/DoubleClick endpoints for video delivery and ads. That behavior is controlled by YouTube.

## SEO + social assets

- Metadata and schema live in `index.html`.
- Social/brand assets live in `public/`:
  - `og-image.png` (1200x630)
  - `favicon-32.png`
  - `apple-touch-icon.png`
- To regenerate PNG assets:

```bash
python3 scripts/generate_assets.py
```

## GitHub Pages deployment

This remains static-only and GitHub Pages compatible.

`vite.config.ts`:

```ts
const base = process.env.VITE_BASE_PATH ?? '/';
```

- Custom domain (e.g. `dhuni.net`): use `/`
- Project subpath deploy: `VITE_BASE_PATH=/repo/ npm run build`

Current workflow deploys from `main` with `VITE_BASE_PATH=/`.
