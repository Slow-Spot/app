import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { logger } from '../utils/logger';

const PREFERENCES_KEY = '@user_preferences';

export interface UserPreferences {
  skipPreSessionIntro: boolean; // Skip the "Welcome to your first meditation" intro screen
  skipPreSessionInstructions: boolean; // Skip entire pre-session instructions (for experienced meditators)
  skipIntentionScreen: boolean; // Skip the intention screen before meditation
  language?: string;
  theme?: 'light' | 'dark' | 'system';
}

/**
 * Zod schema dla walidacji UserPreferences z AsyncStorage
 */
const UserPreferencesSchema = z.object({
  skipPreSessionIntro: z.boolean().optional(),
  skipPreSessionInstructions: z.boolean().optional(),
  skipIntentionScreen: z.boolean().optional(),
  language: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

const DEFAULT_PREFERENCES: UserPreferences = {
  skipPreSessionIntro: false,
  skipPreSessionInstructions: false,
  skipIntentionScreen: false,
  theme: 'system',
};

export const userPreferences = {
  /**
   * Get all user preferences
   */
  getAll: async (): Promise<UserPreferences> => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = UserPreferencesSchema.safeParse(JSON.parse(stored));
        if (!parsed.success) {
          logger.warn('Invalid user preferences data in storage, using defaults');
          return DEFAULT_PREFERENCES;
        }
        return { ...DEFAULT_PREFERENCES, ...parsed.data };
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      logger.error('Failed to load user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * Update user preferences
   */
  update: async (updates: Partial<UserPreferences>): Promise<UserPreferences> => {
    try {
      const current = await userPreferences.getAll();
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      logger.error('Failed to update user preferences:', error);
      throw error;
    }
  },

  /**
   * Get specific preference value
   */
  get: async <K extends keyof UserPreferences>(key: K): Promise<UserPreferences[K]> => {
    const prefs = await userPreferences.getAll();
    return prefs[key];
  },

  /**
   * Set specific preference value
   */
  set: async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<void> => {
    await userPreferences.update({ [key]: value } as Partial<UserPreferences>);
  },

  /**
   * Check if user wants to skip pre-session intro
   */
  shouldSkipPreSessionIntro: async (): Promise<boolean> => {
    return await userPreferences.get('skipPreSessionIntro');
  },

  /**
   * Toggle skip pre-session intro preference
   */
  toggleSkipPreSessionIntro: async (): Promise<boolean> => {
    const current = await userPreferences.shouldSkipPreSessionIntro();
    await userPreferences.set('skipPreSessionIntro', !current);
    return !current;
  },

  /**
   * Check if user wants to skip pre-session instructions entirely (for experienced meditators)
   */
  shouldSkipPreSessionInstructions: async (): Promise<boolean> => {
    return await userPreferences.get('skipPreSessionInstructions');
  },

  /**
   * Set skip pre-session instructions preference
   */
  setSkipPreSessionInstructions: async (value: boolean): Promise<void> => {
    await userPreferences.set('skipPreSessionInstructions', value);
  },

  /**
   * Check if user wants to skip intention screen
   */
  shouldSkipIntentionScreen: async (): Promise<boolean> => {
    return await userPreferences.get('skipIntentionScreen');
  },

  /**
   * Set skip intention screen preference
   */
  setSkipIntentionScreen: async (value: boolean): Promise<void> => {
    await userPreferences.set('skipIntentionScreen', value);
  },
};
