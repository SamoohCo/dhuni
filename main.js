// ============================================================
// DHUNI — main.js
// ============================================================
'use strict';

// ── State ─────────────────────────────────────────────────────
const state = {
  currentIdx: 0,
  playing: false,
  volume: 0.5,
  ytApiReady: false,
  ytReady: false,
  ytPlayer: null,
  audioInitialized: false,
};

// ── Audio ──────────────────────────────────────────────────────
let audioCtx, noiseSource, noiseGain, masterGain;

function initAudio() {
  if (state.audioInitialized) { audioCtx.resume(); return; }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const bufSize = Math.ceil(audioCtx.sampleRate * 2);
  const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buf; noiseSource.loop = true;

  const bp = audioCtx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.5;

  noiseGain  = audioCtx.createGain(); noiseGain.gain.value = 0;
  masterGain = audioCtx.createGain(); masterGain.gain.value = state.volume;

  noiseSource.connect(bp); bp.connect(noiseGain);
  noiseGain.connect(masterGain); masterGain.connect(audioCtx.destination);
  noiseSource.start();
  state.audioInitialized = true;
}

// Brief static burst — played on channel change
function playStatic(duration) {
  if (!noiseGain || !audioCtx) return;
  const t = audioCtx.currentTime;
  noiseGain.gain.cancelScheduledValues(t);
  noiseGain.gain.setValueAtTime(0.28, t);
  noiseGain.gain.linearRampToValueAtTime(0, t + (duration || 0.25));
}

function setMasterVolume(vol) {
  if (!masterGain) return;
  masterGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
}

// ── Freq band ─────────────────────────────────────────────────
// Stations are spaced evenly at 9%–91% across the band.
function stationLeft(idx) {
  const n = STATIONS.length;
  if (n === 1) return '50%';
  return (9 + (idx / (n - 1)) * 82) + '%';
}

function buildBandMarks() {
  const inner = document.getElementById('band-inner');
  STATIONS.forEach((station, i) => {
    const mark = document.createElement('div');
    mark.className = 's-mark';
    mark.dataset.i = i;
    // Use first word of station name as label, upper-cased
    const label = station.name.split(' ')[0].toUpperCase();
    mark.innerHTML =
      `<div class="tick-major"></div>` +
      `<span class="s-label${i === 0 ? ' active' : ''}">${label}</span>`;
    mark.addEventListener('click', () => tuneToStation(i));
    inner.appendChild(mark);

    if (i < STATIONS.length - 1) {
      const gap = document.createElement('div');
      gap.className = 'gap-mark';
      gap.innerHTML = '<div class="tick-minor"></div>';
      inner.appendChild(gap);
    }
  });
}

// ── Station tuning ─────────────────────────────────────────────
function tuneToStation(idx, silent) {
  const prev = state.currentIdx;
  state.currentIdx = idx;
  const station = STATIONS[idx];

  // Needle
  document.getElementById('needle').style.left = stationLeft(idx);

  // Display
  document.getElementById('stn-name').textContent = station.name;
  // Split description on " — " for two-line display, matching the mockup layout
  const parts = station.description.split(' — ');
  const descEl = document.getElementById('stn-desc');
  if (parts.length > 1) {
    descEl.innerHTML = parts[0] + '<br>' + parts.slice(1).join(' — ');
  } else {
    descEl.textContent = station.description;
  }

  // Band mark highlight
  document.querySelectorAll('.s-label').forEach((el, j) => {
    el.classList.toggle('active', j === idx);
  });

  // Sync tune knob visual position
  const rot = tuneAngleForIdx(idx);
  const tuneKnob = document.getElementById('tune-knob');
  tuneKnob.style.transform = `rotate(${rot}deg)`;
  tuneKnob._rot = rot;

  // Brief static on channel change (not on init)
  if (!silent && prev !== idx && state.playing) playStatic(0.22);

  // Start new station if playing
  if (state.playing) playStation(station);

  updateMediaSession(station);
}

// ── Tune knob angle ↔ station index ───────────────────────────
// Knob range: -145° (station 0) to +145° (station n-1)
function tuneAngleForIdx(idx) {
  const n = STATIONS.length;
  if (n === 1) return 0;
  return -145 + (idx / (n - 1)) * 290;
}

function idxForTuneAngle(rot) {
  const n = STATIONS.length;
  return Math.max(0, Math.min(n - 1, Math.round((rot + 145) / 290 * (n - 1))));
}

// ── Knob drag ─────────────────────────────────────────────────
function initKnob(el, onChange) {
  // _rot stores the current rotation angle on the element
  if (el._rot === undefined) el._rot = 0;

  function start(y) {
    el._sy = y;
    el._sr = el._rot;
    el.style.cursor = 'grabbing';
  }
  function move(y) {
    const rot = Math.max(-145, Math.min(145, el._sr + (el._sy - y) * 1.4));
    el._rot = rot;
    el.style.transform = `rotate(${rot}deg)`;
    if (onChange) onChange(rot);
  }
  function end() { el.style.cursor = 'grab'; }

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    start(e.clientY);
    const mv = ev => move(ev.clientY);
    const up = () => { end(); document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  });

  el.addEventListener('touchstart', e => {
    e.preventDefault();
    start(e.touches[0].clientY);
    const mv = ev => { ev.preventDefault(); move(ev.touches[0].clientY); };
    const up = () => { end(); document.removeEventListener('touchmove', mv); document.removeEventListener('touchend', up); };
    document.addEventListener('touchmove', mv, { passive: false });
    document.addEventListener('touchend', up);
  }, { passive: false });
}

// ── Playback ───────────────────────────────────────────────────
function setPlayback(playing) {
  state.playing = playing;
  document.getElementById('play-icon').innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';

  if (playing) {
    initAudio();
    if (!state.ytPlayer && state.ytApiReady) createYTPlayer();
    playStation(STATIONS[state.currentIdx]);
  } else {
    stopMusic();
    if (audioCtx) audioCtx.suspend();
  }
}

// ── YouTube ────────────────────────────────────────────────────
window.onYouTubeIframeAPIReady = function () {
  state.ytApiReady = true;
  if (state.playing && !state.ytPlayer) createYTPlayer();
};

function createYTPlayer() {
  state.ytPlayer = new YT.Player('yt-player', {
    height: '1', width: '1',
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, mute: 1 },
    events: {
      onReady: event => {
        state.ytReady = true;
        event.target.setVolume(state.volume * 100);
        if (state.playing) playStation(STATIONS[state.currentIdx]);
      },
      onStateChange: event => {
        // Unmute once playback actually starts
        if (event.data === YT.PlayerState.PLAYING) {
          if (state.playing) {
            try { event.target.unMute(); event.target.setVolume(state.volume * 100); } catch (_) {}
          }
        }
        // Nudge if cued but not playing
        if (event.data === YT.PlayerState.UNSTARTED || event.data === YT.PlayerState.CUED) {
          if (state.playing) {
            try { event.target.playVideo(); } catch (_) {}
          }
        }
      },
      onError: event => {
        const msg = { 2: 'Invalid playlist ID', 100: 'Not found/private', 101: 'Embedding disabled', 150: 'Embedding disabled' };
        console.error('Dhuni YouTube error', event.data, msg[event.data] || '');
      }
    }
  });
}

function playStation(station) {
  if (!state.ytReady || !state.ytPlayer) return;
  try {
    state.ytPlayer.mute();
    state.ytPlayer.loadPlaylist({ listType: 'playlist', list: station.youtubePlaylistId, index: Math.floor(Math.random() * 8) });
  } catch (err) { console.warn('Dhuni: could not load playlist', err); }
}

function stopMusic() {
  if (!state.ytReady || !state.ytPlayer) return;
  try { state.ytPlayer.stopVideo(); state.ytPlayer.mute(); } catch (_) {}
}

// ── MediaSession ───────────────────────────────────────────────
function updateMediaSession(station) {
  if (!('mediaSession' in navigator) || !station) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title:  station.name,
    artist: 'Dhuni Radio',
    album:  'Samooh',
    artwork: [{
      src: "data:image/svg+xml," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">` +
        `<rect width="512" height="512" fill="#1E1008"/>` +
        `<text x="256" y="320" text-anchor="middle" font-size="220" fill="#C0A038">&#9835;</text>` +
        `</svg>`
      ),
      sizes: '512x512', type: 'image/svg+xml'
    }]
  });
  navigator.mediaSession.playbackState = state.playing ? 'playing' : 'paused';
  navigator.mediaSession.setActionHandler('pause', () => setPlayback(false));
  navigator.mediaSession.setActionHandler('play',  () => setPlayback(true));
  navigator.mediaSession.setActionHandler('stop',  () => setPlayback(false));
  navigator.mediaSession.setActionHandler('previoustrack', () => tuneToStation((state.currentIdx - 1 + STATIONS.length) % STATIONS.length));
  navigator.mediaSession.setActionHandler('nexttrack',     () => tuneToStation((state.currentIdx + 1) % STATIONS.length));
}

// ── Service worker ─────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.warn('SW registration failed:', err));
  });
}

// ── Init ────────────────────────────────────────────────────────
function init() {
  buildBandMarks();

  // Vol knob — starts at 0° (50% volume, indicator at top)
  const volKnob = document.getElementById('vol-knob');
  volKnob._rot = 0;
  initKnob(volKnob, rot => {
    state.volume = (rot + 145) / 290;
    setMasterVolume(state.volume);
    if (state.ytReady && state.ytPlayer) {
      try { state.ytPlayer.setVolume(state.volume * 100); } catch (_) {}
    }
  });

  // Tune knob — starts at first station angle
  const tuneKnob = document.getElementById('tune-knob');
  const initRot = tuneAngleForIdx(0);
  tuneKnob._rot = initRot;
  tuneKnob.style.transform = `rotate(${initRot}deg)`;
  initKnob(tuneKnob, rot => {
    const idx = idxForTuneAngle(rot);
    if (idx !== state.currentIdx) tuneToStation(idx);
  });

  // Playback buttons
  document.getElementById('play-btn').addEventListener('click', () => setPlayback(!state.playing));
  document.getElementById('btn-prev').addEventListener('click', () => {
    tuneToStation((state.currentIdx - 1 + STATIONS.length) % STATIONS.length);
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    tuneToStation((state.currentIdx + 1) % STATIONS.length);
  });

  // Show first station on load (silent — no static, no playback)
  tuneToStation(0, true);
}

document.addEventListener('DOMContentLoaded', init);
