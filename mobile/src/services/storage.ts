/**
 * Storage Service
 *
 * Handles persistent storage for:
 * - User-created session configurations
 * - User preferences and settings
 * - App state persistence
 *
 * Uses AsyncStorage for local data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionConfiguration } from '../types/meditation';

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  CONFIGURATIONS: '@meditation:configurations',
  PREFERENCES: '@meditation:preferences',
  ONBOARDING_COMPLETE: '@meditation:onboarding_complete',
  LAST_SELECTED_CONFIG: '@meditation:last_selected_config',
} as const;

/**
 * User preferences
 */
export interface UserPreferences {
  // Audio Settings
  chimeVolume: number; // 0.0 - 1.0
  ambientVolume: number; // 0.0 - 1.0
  enableHaptics: boolean;

  // Notification Settings
  enableReminders: boolean;
  reminderTime?: string; // HH:MM format
  reminderDays: number[]; // 0-6 (Sunday-Saturday)

  // Display Settings
  keepScreenOn: boolean;
  displayMode: 'light' | 'dark' | 'auto';

  // Session Settings
  defaultDurationMinutes: number;
  autoStartTimer: boolean;
  showPreSessionScreen: boolean;
  showPostSessionScreen: boolean;

  // Privacy
  collectAnonymousData: boolean;

  // Updated timestamp
  lastUpdated: string;
}

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  chimeVolume: 0.7,
  ambientVolume: 0.3,
  enableHaptics: true,
  enableReminders: false,
  reminderDays: [1, 2, 3, 4, 5], // Weekdays
  keepScreenOn: true,
  displayMode: 'auto',
  defaultDurationMinutes: 10,
  autoStartTimer: false,
  showPreSessionScreen: true,
  showPostSessionScreen: true,
  collectAnonymousData: true,
  lastUpdated: new Date().toISOString(),
};

/**
 * Session Configurations Storage
 */

/**
 * Save a session configuration
 */
export const saveConfiguration = async (
  config: SessionConfiguration
): Promise<void> => {
  try {
    const existing = await loadConfigurations();
    const index = existing.findIndex((c) => c.id === config.id);

    if (index >= 0) {
      // Update existing
      existing[index] = config;
    } else {
      // Add new
      existing.push(config);
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.CONFIGURATIONS,
      JSON.stringify(existing)
    );
  } catch (error) {
    console.error('Failed to save configuration:', error);
    throw error;
  }
};

/**
 * Load all session configurations
 */
export const loadConfigurations = async (): Promise<SessionConfiguration[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CONFIGURATIONS);
    if (!data) return [];

    const configurations: SessionConfiguration[] = JSON.parse(data);
    return configurations.sort((a, b) => {
      // Sort by last used, then by usage count
      if (a.lastUsedAt && b.lastUsedAt) {
        return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
      }
      return b.usageCount - a.usageCount;
    });
  } catch (error) {
    console.error('Failed to load configurations:', error);
    return [];
  }
};

/**
 * Get a specific configuration by ID
 */
export const getConfiguration = async (
  id: string
): Promise<SessionConfiguration | null> => {
  try {
    const configurations = await loadConfigurations();
    return configurations.find((c) => c.id === id) || null;
  } catch (error) {
    console.error('Failed to get configuration:', error);
    return null;
  }
};

/**
 * Delete a configuration
 */
export const deleteConfiguration = async (id: string): Promise<void> => {
  try {
    const configurations = await loadConfigurations();
    const filtered = configurations.filter((c) => c.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.CONFIGURATIONS,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Failed to delete configuration:', error);
    throw error;
  }
};

/**
 * Update configuration usage
 */
export const incrementConfigurationUsage = async (
  id: string
): Promise<void> => {
  try {
    const config = await getConfiguration(id);
    if (!config) return;

    config.usageCount += 1;
    config.lastUsedAt = new Date().toISOString();

    await saveConfiguration(config);
  } catch (error) {
    console.error('Failed to update configuration usage:', error);
  }
};

/**
 * User Preferences Storage
 */

/**
 * Save user preferences
 */
export const savePreferences = async (
  preferences: Partial<UserPreferences>
): Promise<void> => {
  try {
    const current = await loadPreferences();
    const updated: UserPreferences = {
      ...current,
      ...preferences,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify(updated)
    );
  } catch (error) {
    console.error('Failed to save preferences:', error);
    throw error;
  }
};

/**
 * Load user preferences
 */
export const loadPreferences = async (): Promise<UserPreferences> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) return DEFAULT_PREFERENCES;

    const preferences: UserPreferences = JSON.parse(data);
    // Merge with defaults to ensure all fields are present
    return { ...DEFAULT_PREFERENCES, ...preferences };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Reset preferences to defaults
 */
export const resetPreferences = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify(DEFAULT_PREFERENCES)
    );
  } catch (error) {
    console.error('Failed to reset preferences:', error);
    throw error;
  }
};

/**
 * App State Storage
 */

/**
 * Mark onboarding as complete
 */
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
};

/**
 * Check if onboarding is complete
 */
export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch (error) {
    console.error('Failed to check onboarding state:', error);
    return false;
  }
};

/**
 * Save last selected configuration ID
 */
export const setLastSelectedConfig = async (id: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SELECTED_CONFIG, id);
  } catch (error) {
    console.error('Failed to save last selected config:', error);
  }
};

/**
 * Get last selected configuration ID
 */
export const getLastSelectedConfig = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SELECTED_CONFIG);
  } catch (error) {
    console.error('Failed to get last selected config:', error);
    return null;
  }
};

/**
 * Clear all app data
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CONFIGURATIONS,
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      STORAGE_KEYS.LAST_SELECTED_CONFIG,
    ]);
  } catch (error) {
    console.error('Failed to clear app data:', error);
    throw error;
  }
};

/**
 * Export all data (for backup)
 */
export const exportAllData = async (): Promise<string> => {
  try {
    const [configurations, preferences] = await Promise.all([
      loadConfigurations(),
      loadPreferences(),
    ]);

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      configurations,
      preferences,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
};

/**
 * Import data (from backup)
 */
export const importData = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (data.configurations) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONFIGURATIONS,
        JSON.stringify(data.configurations)
      );
    }

    if (data.preferences) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify(data.preferences)
      );
    }
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
};
