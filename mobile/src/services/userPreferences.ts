import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@user_preferences';

export interface UserPreferences {
  skipInstructions: boolean;
  language?: string;
  theme?: 'light' | 'dark' | 'system';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  skipInstructions: false,
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
      console.error('Failed to load user preferences:', error);
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
      console.error('Failed to update user preferences:', error);
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
   * Check if user wants to skip instructions
   */
  shouldSkipInstructions: async (): Promise<boolean> => {
    return await userPreferences.get('skipInstructions');
  },

  /**
   * Toggle skip instructions preference
   */
  toggleSkipInstructions: async (): Promise<boolean> => {
    const current = await userPreferences.shouldSkipInstructions();
    await userPreferences.set('skipInstructions', !current);
    return !current;
  },
};
