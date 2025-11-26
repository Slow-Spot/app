import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

const PREFERENCES_KEY = '@user_preferences';

export interface UserPreferences {
  skipPreSessionIntro: boolean; // Skip the "Welcome to your first meditation" intro screen
  skipPreSessionInstructions: boolean; // Skip entire pre-session instructions (for experienced meditators)
  language?: string;
  theme?: 'light' | 'dark' | 'system';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  skipPreSessionIntro: false,
  skipPreSessionInstructions: false,
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
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
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
};
