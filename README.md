# Dhuni

Dhuni is a full-screen ambient listening world for Indian sound.

The entire browser window is the interface:
- a constant sacred pixel dhuni (fire) at center
- 4 tiny pixel listener-characters (one per station/season)
- atmospheric seasonal world transitions on station switch
- ultra-minimal top HUD and bottom control dock

No dashboard layout. No framed card scene. No visible YouTube player UI.

## Core architecture (preserved)

This refactor keeps the existing deployment and playback model:
- static Vite build for GitHub Pages
- YouTube playlist-backed stations
- hidden YouTube Iframe API player wrapper
- local config-driven station mapping
- localStorage for station/volume/mute
- Media Session integration where available

## Stack

- Vite
- React + TypeScript
- Plain CSS (custom scene + HUD system)
- YouTube Iframe Player API via `src/lib/youtubePlayer.ts`

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

- `src/data/stations.ts`: station + character + season + palette config
- `src/hooks/useRadioState.ts`: playback/station state orchestration
- `src/hooks/useKeyboardShortcuts.ts`: keyboard handling
- `src/components/DhuniScene.tsx`: full-screen world renderer
- `src/components/FireSprite.tsx`: pixel fire sprite
- `src/components/CharacterSprite.tsx`: pixel character sprites
- `src/components/TopHud.tsx`: minimal top metadata overlay
- `src/components/ControlDock.tsx`: minimal bottom control dock
- `src/lib/youtubePlayer.ts`: hidden YouTube player abstraction

## Station/character config

Edit `src/data/stations.ts`.

Each station maps directly to one character and one world state.

Fields include:
- `id`
- `name`
- `tagline`
- `playlistId`
- `season`
- `mood`
- `tradition`
- `description`
- `spriteType`
- `environmentType`
- `cameraShiftX`, `cameraShiftY`
- `palette` (scene/HUD color system)

Current 4 seasonal worlds:
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

Keyboard updates station selection, scene state, and playback state together.

## Mobile behavior

- full-screen world remains intact
- characters remain tappable
- top HUD is reduced for readability
- dock condenses and keeps core controls accessible
- no hover-only critical actions

## Media Session + browser limitations

Dhuni uses Media Session API where supported for:
- play/pause actions
- previous/next actions
- station metadata

Web limitation:
- browsers do **not** reliably expose true OS/hardware volume key interception to web apps.
- in-app volume is controlled via dock slider and keyboard arrows.

## Autoplay behavior

Some browsers block autoplay until user interaction.

Dhuni handles this by:
- attempting playback on explicit interaction
- showing a graceful error/retry status if blocked

## GitHub Pages deployment

The app is static-only and GitHub Pages compatible.

`vite.config.ts` uses:

```ts
const base = process.env.VITE_BASE_PATH ?? '/';
```

For custom domains (for example `dhuni.net`), use root base path (`/`).
For project-subpath deploys, set:

```bash
VITE_BASE_PATH=/repo/ npm run build
```

Current workflow deploys from `main` with `VITE_BASE_PATH=/`.
