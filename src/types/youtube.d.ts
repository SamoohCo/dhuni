interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT: typeof YT;
}

declare namespace YT {
  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    loadPlaylist(options: PlaylistOptions): void;
    stopVideo(): void;
    setShuffle(shufflePlaylist: boolean): void;
    playVideo(): void;
    pauseVideo(): void;
    mute(): void;
    unMute(): void;
    setVolume(volume: number): void;
    destroy(): void;
  }

  interface PlayerOptions {
    width?: string;
    height?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    };
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1 | 2;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
  }

  interface PlaylistOptions {
    list: string;
    listType: 'playlist';
    index?: number;
    startSeconds?: number;
    suggestedQuality?: string;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  const PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}
