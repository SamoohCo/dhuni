export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface YouTubePlayerEvents {
  onStateChange?: (state: PlaybackState) => void;
  onError?: (message: string) => void;
  onReady?: () => void;
}

let apiPromise: Promise<typeof YT> | null = null;

function loadYouTubeApi(): Promise<typeof YT> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube API requires a browser environment.'));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise<typeof YT>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-dhuni-youtube-api="true"]',
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.dhuniYoutubeApi = 'true';
      script.onerror = () => reject(new Error('Unable to load YouTube API script.'));
      document.head.append(script);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve(window.YT);
    };

    window.setTimeout(() => {
      if (!window.YT?.Player) {
        reject(new Error('YouTube API did not initialize in time.'));
      }
    }, 12000);
  });

  return apiPromise;
}

function mapState(stateCode: number): PlaybackState {
  switch (stateCode) {
    case window.YT.PlayerState.BUFFERING:
    case window.YT.PlayerState.CUED:
      return 'loading';
    case window.YT.PlayerState.PLAYING:
      return 'playing';
    case window.YT.PlayerState.PAUSED:
    case window.YT.PlayerState.ENDED:
      return 'paused';
    case window.YT.PlayerState.UNSTARTED:
    default:
      return 'idle';
  }
}

function mapError(code: number): string {
  switch (code) {
    case 2:
      return 'This station stream is unavailable right now.';
    case 5:
      return 'The browser could not decode this playlist item.';
    case 100:
      return 'This video has been removed from the playlist.';
    case 101:
    case 150:
      return 'Playback is blocked by the owner for embedded players.';
    default:
      return 'There was a playback issue while loading this station.';
  }
}

export class YouTubePlaylistPlayer {
  private player: YT.Player | null = null;

  private readonly events: YouTubePlayerEvents;

  private currentPlaylistId: string | null = null;
  private currentStartIndex = 0;
  private shuffleAttemptTimers: number[] = [];
  private avoidVideoTimers: number[] = [];

  constructor(events: YouTubePlayerEvents = {}) {
    this.events = events;
  }

  async mount(hostElement: HTMLElement): Promise<void> {
    const YT = await loadYouTubeApi();

    if (this.player) {
      return;
    }

    const playerOptions = {
      host: 'https://www.youtube-nocookie.com',
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          this.hardenIframePlaybackSurface();
          this.events.onReady?.();
        },
        onStateChange: (event) => {
          this.events.onStateChange?.(mapState(event.data));
        },
        onError: (event) => {
          this.events.onStateChange?.('error');
          this.events.onError?.(mapError(event.data));
        },
      },
    } as YT.PlayerOptions & { host: string };

    this.player = new YT.Player(hostElement, playerOptions);
    this.hardenIframePlaybackSurface();
  }

  loadPlaylist(
    playlistId: string,
    options: { startIndex?: number; force?: boolean; shuffle?: boolean } = {},
  ): void {
    if (!this.player) {
      return;
    }

    const startIndex = Math.max(0, Math.floor(options.startIndex ?? 0));
    const force = options.force ?? false;
    const shuffle = options.shuffle ?? true;

    if (
      !force &&
      this.currentPlaylistId === playlistId &&
      this.currentStartIndex === startIndex
    ) {
      return;
    }

    this.currentPlaylistId = playlistId;
    this.currentStartIndex = startIndex;
    this.events.onStateChange?.('loading');
    this.clearShuffleTimers();
    this.clearAvoidVideoTimers();

    try {
      this.player.stopVideo();
    } catch {
      // Ignore edge cases where stopVideo is not yet available.
    }

    this.player.loadPlaylist({
      list: playlistId,
      listType: 'playlist',
      index: startIndex,
      startSeconds: 0,
      suggestedQuality: 'small',
    });

    if (shuffle) {
      this.scheduleShuffle();
    }
  }

  private scheduleShuffle(): void {
    if (!this.player) {
      return;
    }

    // YouTube may ignore setShuffle if called too early, so we retry briefly.
    const attempt = () => {
      try {
        this.player?.setShuffle(true);
      } catch {
        // Ignore transient API readiness errors.
      }
    };

    [140, 650, 1500].forEach((delay) => {
      const timerId = window.setTimeout(() => {
        attempt();
      }, delay);
      this.shuffleAttemptTimers.push(timerId);
    });
  }

  private clearShuffleTimers(): void {
    this.shuffleAttemptTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    this.shuffleAttemptTimers = [];
  }

  private hardenIframePlaybackSurface(): void {
    let iframe: HTMLIFrameElement | null = null;
    try {
      iframe = this.player?.getIframe() ?? null;
    } catch {
      iframe = null;
    }

    if (!iframe) {
      return;
    }

    iframe.setAttribute('disablepictureinpicture', 'true');
    iframe.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');

    const existingAllow = iframe.getAttribute('allow') ?? '';
    const filteredAllow = existingAllow
      .split(';')
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && value !== 'picture-in-picture')
      .join('; ');

    iframe.setAttribute(
      'allow',
      filteredAllow.length > 0 ? filteredAllow : 'autoplay; encrypted-media',
    );
  }

  getCurrentVideoId(): string | null {
    try {
      const videoId = this.player?.getVideoData().video_id;
      return videoId && videoId.length > 0 ? videoId : null;
    } catch {
      return null;
    }
  }

  avoidVideo(videoId: string | null): void {
    if (!this.player || !videoId) {
      return;
    }

    this.clearAvoidVideoTimers();

    // Retry for a short window because the first item may settle after buffering.
    [220, 900, 1800].forEach((delay) => {
      const timerId = window.setTimeout(() => {
        if (this.getCurrentVideoId() !== videoId) {
          return;
        }

        try {
          this.player?.nextVideo();
        } catch {
          // Ignore temporary player state issues.
        }
      }, delay);

      this.avoidVideoTimers.push(timerId);
    });
  }

  private clearAvoidVideoTimers(): void {
    this.avoidVideoTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    this.avoidVideoTimers = [];
  }

  play(): void {
    this.player?.playVideo();
  }

  pause(): void {
    this.player?.pauseVideo();
  }

  setVolume(volume: number): void {
    if (!this.player) {
      return;
    }

    this.player.setVolume(Math.round(volume * 100));
  }

  mute(): void {
    this.player?.mute();
  }

  unmute(): void {
    this.player?.unMute();
  }

  destroy(): void {
    this.clearShuffleTimers();
    this.clearAvoidVideoTimers();
    this.player?.destroy();
    this.player = null;
  }
}
