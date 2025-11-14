import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_QUOTES, MOCK_SESSIONS } from './mockData';

const API_BASE_URL = 'http://localhost:5019/api'; // Will be replaced with Railway URL in production
const USE_MOCK_DATA = true; // Enable mock data for offline development

export interface Quote {
  id: number;
  text: string; // Original text in original language
  textTransliteration?: string; // Romanization/transliteration (e.g., Sanskrit in Roman script)
  translations?: {
    [languageCode: string]: string; // Translations to different languages
  };
  originalLanguage: string; // Language code of the original text (e.g., 'sa' for Sanskrit, 'fa' for Persian)
  author?: string;
  authorTranslation?: {
    [languageCode: string]: string; // Author name in different scripts
  };
  cultureTag?: string; // buddhist, sufi, taoist, zen, vedic, christian, stoic, etc.
  category?: string;
  createdAt: string;
}

export interface MeditationSession {
  id: number | string; // number for preset sessions, string for custom sessions
  title: string;
  titleKey?: string; // i18n translation key (e.g., "sessionsList.morningAwakening.title")
  languageCode: string;
  durationSeconds: number;
  voiceUrl?: string;
  ambientUrl?: string;
  chimeUrl?: string;
  cultureTag?: string;
  level: number;
  description?: string;
  descriptionKey?: string; // i18n translation key (e.g., "sessionsList.morningAwakening.description")
  createdAt: string;
  // Healing frequency metadata (432Hz for ambient, 528Hz for chimes)
  ambientFrequency?: number; // Default: 432Hz (natural harmonic)
  chimeFrequency?: number; // Default: 528Hz (love/healing frequency)
}

// Offline-first architecture: Try cache first, then API
const fetchWithCache = async <T>(
  key: string,
  url: string,
  ttl: number = 3600000 // 1 hour default
): Promise<T> => {
  try {
    // Try to get from cache first
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data as T;
      }
    }

    // Fetch from API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Save to cache
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ data, timestamp: Date.now() })
    );

    return data as T;
  } catch (error) {
    // If API fails, try to return stale cache
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data as T;
    }
    throw error;
  }
};

export const api = {
  quotes: {
    getAll: async (lang?: string): Promise<Quote[]> => {
      // Return mock data if enabled
      // NOTE: All quotes now have translations for all languages, so we don't filter by language
      // The QuoteCard component handles showing the appropriate translation based on user's language
      if (USE_MOCK_DATA) {
        return Promise.resolve(MOCK_QUOTES);
      }

      const url = lang
        ? `${API_BASE_URL}/quotes?lang=${lang}`
        : `${API_BASE_URL}/quotes`;
      return fetchWithCache(`quotes_${lang || 'all'}`, url);
    },

    getRandom: async (lang: string = 'en'): Promise<Quote> => {
      // Return mock data if enabled
      // NOTE: All quotes have translations, so just pick any random quote
      if (USE_MOCK_DATA) {
        const randomIndex = Math.floor(Math.random() * MOCK_QUOTES.length);
        return Promise.resolve(MOCK_QUOTES[randomIndex]);
      }

      const url = `${API_BASE_URL}/quotes/random?lang=${lang}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    },
  },

  sessions: {
    getAll: async (lang?: string, level?: number): Promise<MeditationSession[]> => {
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        let filtered = MOCK_SESSIONS;
        if (lang) {
          filtered = filtered.filter((s) => s.languageCode === lang);
          // Fallback to English if no sessions found for requested language
          if (filtered.length === 0) {
            console.log(`[API] No sessions found for language '${lang}', falling back to English`);
            filtered = MOCK_SESSIONS.filter((s) => s.languageCode === 'en');
          }
        }
        if (level !== undefined) {
          filtered = filtered.filter((s) => s.level === level);
        }
        return Promise.resolve(filtered);
      }

      let url = `${API_BASE_URL}/sessions`;
      const params = new URLSearchParams();
      if (lang) params.append('lang', lang);
      if (level !== undefined) params.append('level', level.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      return fetchWithCache(`sessions_${lang || 'all'}_${level || 'all'}`, url);
    },

    getById: async (id: number): Promise<MeditationSession> => {
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        const session = MOCK_SESSIONS.find((s) => s.id === id);
        if (session) {
          return Promise.resolve(session);
        }
        throw new Error(`Session ${id} not found`);
      }

      const url = `${API_BASE_URL}/sessions/${id}`;
      return fetchWithCache(`session_${id}`, url);
    },
  },

  // Clear all cache (for manual refresh)
  clearCache: async () => {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      (key) => key.startsWith('quotes_') || key.startsWith('sessions_') || key.startsWith('session_')
    );
    await AsyncStorage.multiRemove(cacheKeys);
  },
};
