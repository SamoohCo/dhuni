import type { Station } from '../data/stations';

interface MediaSessionActions {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function registerMediaSessionActions(actions: MediaSessionActions): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }

  const session = navigator.mediaSession;

  try {
    session.setActionHandler('play', actions.onPlay);
    session.setActionHandler('pause', actions.onPause);
    session.setActionHandler('previoustrack', actions.onPrevious);
    session.setActionHandler('nexttrack', actions.onNext);
  } catch {
    // Some browsers expose mediaSession but reject specific handlers.
  }
}

export function updateMediaSession(
  station: Station,
  isPlaying: boolean,
  appUrl: string,
): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }

  const session = navigator.mediaSession;

  if ('MediaMetadata' in window) {
    session.metadata = new MediaMetadata({
      title: station.name,
      artist: 'Dhuni Radio',
      album: station.tagline,
      artwork: [
        {
          src: `${appUrl}apple-touch-icon.png`,
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    });
  }

  session.playbackState = isPlaying ? 'playing' : 'paused';
}
