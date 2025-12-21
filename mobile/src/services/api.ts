import { MOCK_QUOTES, MOCK_SESSIONS } from './mockData';
import { logger } from '../utils/logger';

// ============================================================================
// SLOW SPOT - 100% OFFLINE APP
// ============================================================================
// All data (quotes, meditation sessions) is bundled with the app.
// No backend API, no network requests, no data collection.
// This is a pure local data service.
// ============================================================================

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
  voiceUrl?: string | number;
  ambientUrl?: string | number;
  chimeUrl?: string | number;
  cultureTag?: string;
  purposeTag?: string;
  level: number;
  description?: string;
  descriptionKey?: string; // i18n translation key (e.g., "sessionsList.morningAwakening.description")
  createdAt: string;
  // Healing frequency metadata (432Hz for ambient, 528Hz for chimes)
  ambientFrequency?: number; // Default: 432Hz (natural harmonic)
  chimeFrequency?: number; // Default: 528Hz (love/healing frequency)
  // Pre-session instruction reference
  instructionId?: string; // Reference to PreSessionInstruction (e.g., 'level1_breath', 'zen_zazen')
}

// Local data service - all data bundled with the app
export const api = {
  quotes: {
    getAll: async (): Promise<Quote[]> => {
      // All quotes have translations for all languages
      // QuoteCard component handles showing appropriate translation
      return MOCK_QUOTES;
    },

    getRandom: async (): Promise<Quote> => {
      const randomIndex = Math.floor(Math.random() * MOCK_QUOTES.length);
      return MOCK_QUOTES[randomIndex];
    },
  },

  sessions: {
    getAll: async (lang?: string, level?: number): Promise<MeditationSession[]> => {
      let filtered = MOCK_SESSIONS;

      if (lang) {
        filtered = filtered.filter((s) => s.languageCode === lang);
        // Fallback to English if no sessions found for requested language
        if (filtered.length === 0) {
          logger.log(`No sessions found for language '${lang}', falling back to English`);
          filtered = MOCK_SESSIONS.filter((s) => s.languageCode === 'en');
        }
      }

      if (level !== undefined) {
        filtered = filtered.filter((s) => s.level === level);
      }

      return filtered;
    },

    getById: async (id: number): Promise<MeditationSession> => {
      const session = MOCK_SESSIONS.find((s) => s.id === id);
      if (session) {
        return session;
      }
      throw new Error(`Session ${id} not found`);
    },
  },
};
