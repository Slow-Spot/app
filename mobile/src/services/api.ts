import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_QUOTES, MOCK_SESSIONS } from './mockData';

const API_BASE_URL = 'http://localhost:5019/api'; // Will be replaced with Railway URL in production
const USE_MOCK_DATA = true; // Enable mock data for offline development

export interface Quote {
  id: number;
  text: string;
  author?: string;
  languageCode: string;
  cultureTag?: string;
  category?: string;
  createdAt: string;
}

export interface MeditationSession {
  id: number | string; // number for preset sessions, string for custom sessions
  title: string;
  languageCode: string;
  durationSeconds: number;
  voiceUrl?: string;
  ambientUrl?: string;
  chimeUrl?: string;
  cultureTag?: string;
  level: number;
  description?: string;
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
      if (USE_MOCK_DATA) {
        let filtered = lang ? MOCK_QUOTES.filter((q) => q.languageCode === lang) : MOCK_QUOTES;
        // Fallback to English if no quotes found for requested language
        if (lang && filtered.length === 0) {
          console.log(`[API] No quotes found for language '${lang}', falling back to English`);
          filtered = MOCK_QUOTES.filter((q) => q.languageCode === 'en');
        }
        return Promise.resolve(filtered);
      }

      const url = lang
        ? `${API_BASE_URL}/quotes?lang=${lang}`
        : `${API_BASE_URL}/quotes`;
      return fetchWithCache(`quotes_${lang || 'all'}`, url);
    },

    getRandom: async (lang: string = 'en'): Promise<Quote> => {
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        const filtered = MOCK_QUOTES.filter((q) => q.languageCode === lang);
        const randomIndex = Math.floor(Math.random() * filtered.length);
        return Promise.resolve(filtered[randomIndex] || MOCK_QUOTES[0]);
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
