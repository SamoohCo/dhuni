# Dhuni

Dhuni is a static, tactile internet radio web app inspired by vintage Indian tabletop radios.

The interface is intentionally a single object: a tuned dial, a tuning knob, and a volume knob, with YouTube playlist playback hidden behind a radio-first UI.

## Stack

- Vite
- React + TypeScript
- Plain handcrafted CSS
- YouTube Iframe Player API (wrapped behind a local player abstraction)

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

- `src/data/stations.ts`: station catalog and dial positions (main content config)
- `src/lib/youtubePlayer.ts`: YouTube playback wrapper used by the app (UI never talks to raw embed APIs)
- `src/hooks/useRadioState.ts`: radio behavior/state orchestration
- `src/components/*`: handcrafted radio parts
- `src/styles/*`: layered visual styling for the radio object

## Station config

Edit `src/data/stations.ts` to update stations. Each station supports:

- `id`
- `name`
- `tagline`
- `playlistId`
- `dialPosition` (0-100 scale)
- optional: `mood`, `era`, `city`, `description`

Swapping playlist IDs is enough to change programming.
Use public YouTube playlist IDs that allow embedding for reliable playback.

## YouTube integration architecture

Playback is intentionally off-stage:

- YouTube iframe is mounted into a hidden 1x1 off-screen host
- All playback controls flow through `YouTubePlaylistPlayer`
- UI controls interact with radio state only (not embed chrome)

This keeps the experience feeling like a radio instead of a video embed.

## Keyboard controls

- `Space`: play/pause (power)
- `ArrowLeft`: previous station
- `ArrowRight`: next station
- `ArrowUp`: volume up
- `ArrowDown`: volume down
- `M`: mute/unmute
- `Home`: first station
- `End`: last station

Keyboard updates stay in sync with dial needle, knob visuals, station state, and playback state.

## Media Session + web limitations

The app uses the Media Session API where available for:

- play/pause action handlers
- previous/next station action handlers
- active station metadata

Important web limitation:

- Browsers do **not** provide a reliable, cross-browser way for websites to intercept true OS/hardware volume keys.
- App volume is controlled through the on-screen volume knob and keyboard arrows.

## Autoplay/browser behavior

Modern browsers may block autoplay until a user gesture occurs.

Dhuni handles this by:

- requiring direct user interaction for initial playback when needed
- showing a tasteful retry message if playback is blocked

## GitHub Pages deployment

This project is static-output only and works on GitHub Pages.

`vite.config.ts` reads `VITE_BASE_PATH`:

```ts
const base = process.env.VITE_BASE_PATH ?? '/';
```

### Build for Pages

Use your repo name as base path:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

Then deploy the generated `dist/` folder to GitHub Pages.

Notes:

- no backend required
- no SSR required
- no runtime rewrites required

## Optional future additions

You can add optional sound effects later (knob ticks, soft static, power click) by placing assets under `public/sfx/` and triggering them from `useRadioState.ts` interaction hooks.
