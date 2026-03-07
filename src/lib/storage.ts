const STORAGE_KEY = 'dhuni.radio.preferences.v1';

export interface RadioPreferences {
  volume: number;
  muted: boolean;
  stationId: string;
}

const defaultPreferences: RadioPreferences = {
  volume: 0.62,
  muted: false,
  stationId: 'raga-dawn',
};

export function loadPreferences(): RadioPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return defaultPreferences;
    }

    const parsed = JSON.parse(value) as Partial<RadioPreferences>;

    return {
      volume:
        typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 1
          ? parsed.volume
          : defaultPreferences.volume,
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : defaultPreferences.muted,
      stationId: typeof parsed.stationId === 'string' ? parsed.stationId : defaultPreferences.stationId,
    };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(preferences: RadioPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore storage errors to preserve playback.
  }
}
