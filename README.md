# Dhuni

A vintage Indian radio experience. Walnut cabinet, brass dial, jali grille. Powered by [Samooh](https://samooh.com).

Pure HTML + CSS + JS. No build step. GitHub Pages deployable from root.

---

## Deploy to GitHub Pages

1. Push all files to `main` branch of `https://github.com/SamoohCo/dhuni`
2. **Settings → Pages → Deploy from branch → main → / (root)**
3. Live in ~60 seconds at `https://samoohco.github.io/dhuni`

---

## Local development

YouTube requires HTTP (not `file://`):

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

---

## Adding / replacing stations

Edit `stations.js`. Each entry in the `STATIONS` array:

```js
{
  frequency: 98.3,          // FM dial position, 88.0–108.0 MHz
  name: "My Station",       // shown on the panel and in the ticker
  description: "...",       // one-line description
  youtubePlaylistId: "PL…", // YouTube playlist ID (from the list= URL param)
}
```

**Finding a playlist ID:** open a YouTube playlist → the URL contains `list=PLxxxxxxxxx` — copy everything after `list=`.

**Requirements:** playlist must be **Public** or **Unlisted**, and the channel must allow embedding.

Keep at least 1.5 MHz between stations. Adjust `SNAP_RADIUS` (default `0.4` MHz) in `stations.js` to change how precisely the dial must be aimed.

---

## File structure

```
/
├── index.html        — markup, inline SVG decorations
├── style.css         — all styles (desktop + mobile Walkman)
├── main.js           — audio, dial, YouTube, MediaSession, SW registration
├── stations.js       — station config (edit this)
├── manifest.json     — PWA manifest
├── service-worker.js — cache-first offline shell
└── README.md
```

---

## PWA / offline

- Install to home screen on iOS/Android via "Add to Home Screen"
- Static shell (HTML/CSS/JS) is cached and works offline
- YouTube streams require network — expected

---

Powered by [Samooh](https://samooh.com)
