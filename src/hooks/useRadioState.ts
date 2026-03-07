import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import {
  STATION_LOCK_THRESHOLD,
  clampDialPosition,
  getNearestStationIndex,
  getStationById,
  stations,
  type Station,
} from '../data/stations';
import { registerMediaSessionActions, updateMediaSession } from '../lib/mediaSession';
import { loadPreferences, savePreferences } from '../lib/storage';
import { YouTubePlaylistPlayer, type PlaybackState } from '../lib/youtubePlayer';

const VOLUME_STEP = 0.05;
const PLAYBACK_PROBE_MS = 2900;

function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getStatusText(params: {
  isPowered: boolean;
  isConnecting: boolean;
  error: string | null;
  isMuted: boolean;
  station: Station;
}): string {
  if (params.error) {
    return 'Signal interrupted';
  }

  if (!params.isPowered) {
    return 'Power off';
  }

  if (params.isConnecting) {
    return 'Warming valves...';
  }

  if (params.isMuted) {
    return `Muted · ${params.station.name}`;
  }

  return 'On Air';
}

function buildAppBaseUrl(): string {
  const basePath = import.meta.env.BASE_URL;
  return new URL(basePath, window.location.origin).toString();
}

function runPlayProbe(
  timerRef: MutableRefObject<number | null>,
  isPoweredRef: MutableRefObject<boolean>,
  isPlayingRef: MutableRefObject<boolean>,
  onBlocked: (message: string) => void,
  message: string,
): void {
  if (timerRef.current !== null) {
    window.clearTimeout(timerRef.current);
  }

  timerRef.current = window.setTimeout(() => {
    if (isPoweredRef.current && !isPlayingRef.current) {
      onBlocked(message);
    }
  }, PLAYBACK_PROBE_MS);
}

export function useRadioState() {
  const initialPreferences = useMemo(() => loadPreferences(), []);

  const initialStationIndex = useMemo(() => {
    const byId = getStationById(initialPreferences.stationId);
    if (!byId) {
      return 0;
    }

    const index = stations.findIndex((station) => station.id === byId.id);
    return index >= 0 ? index : 0;
  }, [initialPreferences.stationId]);

  const [stationIndex, setStationIndex] = useState(initialStationIndex);
  const [lockedStationIndex, setLockedStationIndex] = useState<number | null>(initialStationIndex);
  const [tunePosition, setTunePosition] = useState(stations[initialStationIndex].dialPosition);
  const [volume, setVolume] = useState(clampVolume(initialPreferences.volume));
  const [isMuted, setIsMuted] = useState(initialPreferences.muted);
  const [isPowered, setIsPowered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlaylistPlayer | null>(null);
  const switchTimerRef = useRef<number | null>(null);
  const playProbeTimerRef = useRef<number | null>(null);

  const stationIndexRef = useRef(stationIndex);
  const isPoweredRef = useRef(isPowered);
  const isPlayingRef = useRef(isPlaying);
  const currentStationRef = useRef(stations[stationIndex]);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    stationIndexRef.current = stationIndex;
  }, [stationIndex]);

  useEffect(() => {
    isPoweredRef.current = isPowered;
  }, [isPowered]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentStationRef.current = stations[stationIndex];
  }, [stationIndex]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const currentStation = stations[stationIndex];

  const clearPlayProbe = useCallback(() => {
    if (playProbeTimerRef.current !== null) {
      window.clearTimeout(playProbeTimerRef.current);
      playProbeTimerRef.current = null;
    }
  }, []);

  const pulseSwitching = useCallback(() => {
    setIsSwitching(true);

    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current);
    }

    switchTimerRef.current = window.setTimeout(() => {
      setIsSwitching(false);
      switchTimerRef.current = null;
    }, 420);
  }, []);

  const selectStation = useCallback(
    (nextIndex: number, options?: { snapNeedle?: boolean }) => {
      const bounded = Math.min(stations.length - 1, Math.max(0, nextIndex));

      setStationIndex((previous) => {
        if (previous !== bounded) {
          pulseSwitching();
          // Optional hook: trigger subtle tuning/static SFX here.
        }
        return bounded;
      });

      setLockedStationIndex(bounded);

      if (options?.snapNeedle ?? true) {
        setTunePosition(stations[bounded].dialPosition);
      }

      setError(null);
    },
    [pulseSwitching],
  );

  const previousStation = useCallback(() => {
    selectStation(stationIndexRef.current - 1, { snapNeedle: true });
  }, [selectStation]);

  const nextStation = useCallback(() => {
    selectStation(stationIndexRef.current + 1, { snapNeedle: true });
  }, [selectStation]);

  const firstStation = useCallback(() => {
    selectStation(0, { snapNeedle: true });
  }, [selectStation]);

  const lastStation = useCallback(() => {
    selectStation(stations.length - 1, { snapNeedle: true });
  }, [selectStation]);

  const setTunePositionLive = useCallback(
    (value: number) => {
      const nextPosition = clampDialPosition(value);
      setTunePosition(nextPosition);

      const nearestIndex = getNearestStationIndex(nextPosition);
      const nearestDistance = Math.abs(stations[nearestIndex].dialPosition - nextPosition);

      if (nearestDistance <= STATION_LOCK_THRESHOLD) {
        setLockedStationIndex(nearestIndex);

        if (nearestIndex !== stationIndexRef.current) {
          selectStation(nearestIndex, { snapNeedle: false });
        }

        return;
      }

      setLockedStationIndex(null);
    },
    [selectStation],
  );

  const commitTunePosition = useCallback(() => {
    const nearest = lockedStationIndex ?? getNearestStationIndex(tunePosition);
    selectStation(nearest, { snapNeedle: true });
  }, [lockedStationIndex, selectStation, tunePosition]);

  const setVolumeLevel = useCallback((nextVolume: number) => {
    const normalized = clampVolume(nextVolume);
    setVolume(normalized);
    if (normalized > 0) {
      setIsMuted(false);
    }
  }, []);

  const volumeUp = useCallback(() => {
    setVolume((previous) => {
      const next = clampVolume(previous + VOLUME_STEP);
      if (next > 0) {
        setIsMuted(false);
      }
      return next;
    });
  }, []);

  const volumeDown = useCallback(() => {
    setVolume((previous) => clampVolume(previous - VOLUME_STEP));
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((previous) => !previous);
  }, []);

  const togglePower = useCallback(() => {
    setError(null);
    setIsPowered((previous) => {
      const next = !previous;
      setIsConnecting(next);
      if (!next) {
        setIsPlaying(false);
      }
      return next;
    });
  }, []);

  const handlePlaybackStateChange = useCallback(
    (playbackState: PlaybackState) => {
      switch (playbackState) {
        case 'loading':
          if (isPoweredRef.current) {
            setIsConnecting(true);
          }
          break;
        case 'playing':
          setError(null);
          setIsPlaying(true);
          setIsConnecting(false);
          clearPlayProbe();
          break;
        case 'paused':
          setIsPlaying(false);
          if (!isPoweredRef.current) {
            setIsConnecting(false);
          }
          break;
        case 'error':
          setIsPlaying(false);
          setIsConnecting(false);
          clearPlayProbe();
          break;
        case 'idle':
        default:
          break;
      }
    },
    [clearPlayProbe],
  );

  useEffect(() => {
    const host = playerHostRef.current;
    if (!host) {
      return;
    }

    const player = new YouTubePlaylistPlayer({
      onReady: () => {
        setIsReady(true);
      },
      onError: (message) => {
        setError(message);
        setIsConnecting(false);
      },
      onStateChange: handlePlaybackStateChange,
    });

    playerRef.current = player;
    let disposed = false;

    player
      .mount(host)
      .then(() => {
        if (disposed) {
          return;
        }

        player.loadPlaylist(currentStationRef.current.playlistId);
        player.setVolume(volumeRef.current);

        if (isMutedRef.current || volumeRef.current === 0) {
          player.mute();
        } else {
          player.unmute();
        }
      })
      .catch((mountError: unknown) => {
        if (disposed) {
          return;
        }

        const message = mountError instanceof Error ? mountError.message : 'Unable to initialize player.';
        setError(message);
      });

    return () => {
      disposed = true;
      clearPlayProbe();

      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current);
      }

      player.destroy();
      playerRef.current = null;
    };
  }, [clearPlayProbe, handlePlaybackStateChange]);

  useEffect(() => {
    if (!isReady || !playerRef.current) {
      return;
    }

    playerRef.current.loadPlaylist(currentStation.playlistId);

    if (isPoweredRef.current) {
      setIsConnecting(true);
      playerRef.current.play();

      runPlayProbe(
        playProbeTimerRef,
        isPoweredRef,
        isPlayingRef,
        (message) => {
          setIsConnecting(false);
          setError(message);
        },
        'Playback needs a direct user interaction. Tap power again to retry.',
      );
    }
  }, [currentStation.playlistId, isReady]);

  useEffect(() => {
    if (!isReady || !playerRef.current) {
      return;
    }

    playerRef.current.setVolume(volume);

    if (isMuted || volume === 0) {
      playerRef.current.mute();
    } else {
      playerRef.current.unmute();
    }
  }, [isMuted, isReady, volume]);

  useEffect(() => {
    if (!isReady || !playerRef.current) {
      return;
    }

    if (isPowered) {
      setIsConnecting(true);
      setError(null);
      playerRef.current.play();

      runPlayProbe(
        playProbeTimerRef,
        isPoweredRef,
        isPlayingRef,
        (message) => {
          setIsConnecting(false);
          setError(message);
        },
        'Playback was blocked by the browser. Use the power control once more.',
      );
      return;
    }

    clearPlayProbe();
    playerRef.current.pause();
    setIsPlaying(false);
    setIsConnecting(false);
  }, [clearPlayProbe, isPowered, isReady]);

  useEffect(() => {
    savePreferences({
      volume,
      muted: isMuted,
      stationId: currentStation.id,
    });
  }, [currentStation.id, isMuted, volume]);

  useEffect(() => {
    registerMediaSessionActions({
      onPlay: () => setIsPowered(true),
      onPause: () => setIsPowered(false),
      onNext: nextStation,
      onPrevious: previousStation,
    });
  }, [nextStation, previousStation]);

  useEffect(() => {
    updateMediaSession(currentStation, isPowered && isPlaying, buildAppBaseUrl());
  }, [currentStation, isPlaying, isPowered]);

  useEffect(() => {
    return () => {
      clearPlayProbe();
    };
  }, [clearPlayProbe]);

  const nearestStationDistance = Math.abs(stations[getNearestStationIndex(tunePosition)].dialPosition - tunePosition);
  const lockStrength = Math.max(0, 1 - nearestStationDistance / 16);

  const statusText = getStatusText({
    isPowered,
    isConnecting,
    error,
    isMuted,
    station: currentStation,
  });

  return {
    playerHostRef,
    stations,
    stationIndex,
    currentStation,
    lockedStationIndex,
    tunePosition,
    volume,
    isMuted,
    isPowered,
    isPlaying,
    isConnecting,
    isReady,
    isSwitching,
    error,
    statusText,
    lockStrength,
    setTunePositionLive,
    commitTunePosition,
    previousStation,
    nextStation,
    firstStation,
    lastStation,
    togglePower,
    setVolumeLevel,
    volumeUp,
    volumeDown,
    toggleMute,
  };
}
