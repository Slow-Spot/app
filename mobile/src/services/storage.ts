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
import { z } from 'zod';
import { SessionConfiguration } from '../types/meditation';
import { logger } from '../utils/logger';
import {
  getCompletedSessions,
  getProgressStats,
  getImportedStreak,
} from './progressTracker';

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  CONFIGURATIONS: '@meditation:configurations',
  PREFERENCES: '@meditation:preferences',
  ONBOARDING_COMPLETE: '@meditation:onboarding_complete',
  LAST_SELECTED_CONFIG: '@meditation:last_selected_config',
  SCHEMA_VERSION: '@meditation:schema_version',
} as const;

// Key used by IntroScreen for intro/onboarding flow
export const INTRO_COMPLETED_KEY = '@slow_spot_intro_completed';

// Increment when storage structure changes; used for lightweight migrations
const STORAGE_SCHEMA_VERSION = 1;

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
  // Default to no analytics collection to avoid mismatch with store privacy declarations
  collectAnonymousData: false,
  lastUpdated: new Date().toISOString(),
};

/**
 * Zod schemas for import validation (security hardening)
 */
// Maksymalny rozmiar importowanych danych (10 MB)
const MAX_IMPORT_SIZE = 10 * 1024 * 1024;

const PhaseSchema = z.object({
  type: z.string().max(50),
  duration: z.number().min(0).max(86400),
  label: z.string().max(200).optional(),
}).strict();

const ImportDataSchema = z.object({
  version: z.string().max(20).optional(),
  schemaVersion: z.number().int().positive().max(100).optional(),
  exportDate: z.string().max(50).optional(),
  configurations: z.array(z.object({
    id: z.string().max(100),
    name: z.string().max(200),
    totalDuration: z.number().min(0).max(86400), // max 24h in seconds
    phases: z.array(PhaseSchema).max(50).optional(),
  }).strict()).max(100).optional(),
  preferences: z.object({
    chimeVolume: z.number().min(0).max(1).optional(),
    ambientVolume: z.number().min(0).max(1).optional(),
    enableHaptics: z.boolean().optional(),
    enableReminders: z.boolean().optional(),
    reminderTime: z.string().max(10).optional(),
    reminderDays: z.array(z.number().int().min(0).max(6)).max(7).optional(),
    keepScreenOn: z.boolean().optional(),
    displayMode: z.enum(['light', 'dark', 'auto']).optional(),
    defaultDurationMinutes: z.number().int().min(1).max(240).optional(),
    autoStartTimer: z.boolean().optional(),
    showPreSessionScreen: z.boolean().optional(),
    showPostSessionScreen: z.boolean().optional(),
    collectAnonymousData: z.boolean().optional(),
    lastUpdated: z.string().max(50).optional(),
  }).strict().optional(),
}).strict();

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
    logger.error('Failed to save configuration:', error);
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
      return (b.usageCount || 0) - (a.usageCount || 0);
    });
  } catch (error) {
    logger.error('Failed to load configurations:', error);
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
    logger.error('Failed to get configuration:', error);
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
    logger.error('Failed to delete configuration:', error);
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

    config.usageCount = (config.usageCount || 0) + 1;
    config.lastUsedAt = new Date().toISOString();

    await saveConfiguration(config);
  } catch (error) {
    logger.error('Failed to update configuration usage:', error);
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
    logger.error('Failed to save preferences:', error);
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
    logger.error('Failed to load preferences:', error);
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
    logger.error('Failed to reset preferences:', error);
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
    logger.error('Failed to save onboarding state:', error);
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
    logger.error('Failed to check onboarding state:', error);
    return false;
  }
};

/**
 * Reset onboarding/intro state so it shows again on next app launch
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      INTRO_COMPLETED_KEY,
    ]);
  } catch (error) {
    logger.error('Failed to reset onboarding state:', error);
    throw error;
  }
};

/**
 * Save last selected configuration ID
 */
export const setLastSelectedConfig = async (id: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SELECTED_CONFIG, id);
  } catch (error) {
    logger.error('Failed to save last selected config:', error);
  }
};

/**
 * Get last selected configuration ID
 */
export const getLastSelectedConfig = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SELECTED_CONFIG);
  } catch (error) {
    logger.error('Failed to get last selected config:', error);
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
      STORAGE_KEYS.SCHEMA_VERSION,
    ]);
  } catch (error) {
    logger.error('Failed to clear app data:', error);
    throw error;
  }
};

/**
 * Export all data (for backup)
 * Includes session history and progress for GDPR Art. 20 compliance
 */
export const exportAllData = async (): Promise<string> => {
  try {
    const [configurations, preferences, sessions, progressStats, importedStreak] =
      await Promise.all([
        loadConfigurations(),
        loadPreferences(),
        getCompletedSessions(),
        getProgressStats(),
        getImportedStreak(),
      ]);

    const exportData = {
      version: '1.1',
      schemaVersion: STORAGE_SCHEMA_VERSION,
      exportDate: new Date().toISOString(),
      configurations,
      preferences,
      sessions,
      progressStats,
      importedStreak,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    logger.error('Failed to export data:', error);
    throw error;
  }
};

/**
 * Import data (from backup)
 * Validates data with Zod schema before importing (security hardening)
 */
export const importData = async (jsonData: string): Promise<void> => {
  try {
    // Walidacja rozmiaru danych wejsciowych
    if (jsonData.length > MAX_IMPORT_SIZE) {
      throw new Error('Import data exceeds maximum allowed size (10 MB)');
    }

    // Parse JSON first
    let rawData: unknown;
    try {
      rawData = JSON.parse(jsonData);
    } catch {
      throw new Error('Invalid JSON format in import data');
    }

    // Validate with Zod schema
    const parseResult = ImportDataSchema.safeParse(rawData);
    if (!parseResult.success) {
      logger.error('Import validation failed:', parseResult.error.issues);
      throw new Error('Import data validation failed: invalid data structure');
    }

    const data = parseResult.data;

    // Honor version in backup if provided
    if (data.schemaVersion) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SCHEMA_VERSION,
        data.schemaVersion.toString()
      );
    }

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

    logger.log('Data imported successfully');
  } catch (error) {
    logger.error('Failed to import data:', error);
    throw error;
  }
};

/**
 * Storage schema versioning and migrations
 */
const getStoredSchemaVersion = async (): Promise<number | null> => {
  const versionStr = await AsyncStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
  return versionStr ? Number(versionStr) : null;
};

const setSchemaVersion = async (version: number): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, version.toString());
};

/**
 * Run lightweight migrations; extend this switch when bumping STORAGE_SCHEMA_VERSION
 */
export const ensureStorageSchema = async (): Promise<void> => {
  const current = await getStoredSchemaVersion();

  // No version means pre-versioned installs; normalize and stamp version
  if (current === null) {
    // Ensure preferences include all defaults
    const merged = await loadPreferences();
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(merged));
    await setSchemaVersion(STORAGE_SCHEMA_VERSION);
    return;
  }

  // Future migrations go here
  if (current < STORAGE_SCHEMA_VERSION) {
    // Example: if we add new keys in the future, migrate here
    await setSchemaVersion(STORAGE_SCHEMA_VERSION);
  }
};
