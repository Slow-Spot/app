/**
 * User Profile Service
 *
 * Handles storage and retrieval of user profile data including:
 * - User name (optional, for personalized greetings)
 * - Future profile settings
 *
 * Uses AsyncStorage for local data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

/**
 * Storage key for user profile
 */
const USER_PROFILE_KEY = '@slow_spot_user_profile';

/**
 * User profile interface
 */
export interface UserProfile {
  /** User's display name (optional) */
  name?: string;
  /** Timestamp when the profile was last updated */
  lastUpdated: string;
}

/**
 * Default user profile
 */
const DEFAULT_PROFILE: UserProfile = {
  name: undefined,
  lastUpdated: new Date().toISOString(),
};

/**
 * Load user profile from storage
 */
export const loadUserProfile = async (): Promise<UserProfile> => {
  try {
    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!data) return DEFAULT_PROFILE;

    const profile: UserProfile = JSON.parse(data);
    return { ...DEFAULT_PROFILE, ...profile };
  } catch (error) {
    logger.error('Failed to load user profile:', error);
    return DEFAULT_PROFILE;
  }
};

/**
 * Save user profile to storage
 */
export const saveUserProfile = async (
  profile: Partial<UserProfile>
): Promise<void> => {
  try {
    const current = await loadUserProfile();
    const updated: UserProfile = {
      ...current,
      lastUpdated: new Date().toISOString(),
    };

    // Explicitly handle each field to properly support undefined/deletion
    if ('name' in profile) {
      updated.name = profile.name;
    }

    const jsonData = JSON.stringify(updated);
    // Removed PII logging for security
    await AsyncStorage.setItem(USER_PROFILE_KEY, jsonData);
  } catch (error) {
    logger.error('Failed to save user profile:', error);
    throw error;
  }
};

/**
 * Get user name from storage
 */
export const getUserName = async (): Promise<string | undefined> => {
  try {
    const profile = await loadUserProfile();
    return profile.name;
  } catch (error) {
    logger.error('Failed to get user name:', error);
    return undefined;
  }
};

/**
 * Set user name in storage
 */
export const setUserName = async (name: string | undefined): Promise<void> => {
  try {
    await saveUserProfile({ name: name?.trim() || undefined });
  } catch (error) {
    logger.error('Failed to set user name:', error);
    throw error;
  }
};

/**
 * Clear user profile
 */
export const clearUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    logger.error('Failed to clear user profile:', error);
    throw error;
  }
};
