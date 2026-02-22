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
import { z } from 'zod';
import { logger } from '../utils/logger';

/**
 * Storage key for user profile
 */
const USER_PROFILE_KEY = '@slow_spot_user_profile';

/**
 * Milestone types for celebration tracking
 */
export type MilestoneId =
  | 'first_launch'
  | 'first_session'
  | 'sessions_10'
  | 'sessions_25'
  | 'sessions_50'
  | 'sessions_100'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'streak_100';

/**
 * User profile interface
 */
export interface UserProfile {
  /** User's display name (optional) */
  name?: string;
  /** Timestamp when the profile was last updated */
  lastUpdated: string;
  /** Timestamp of first app launch (ISO 8601) */
  firstLaunchDate?: string;
  /** Timestamp of last app activity (ISO 8601) - used for returning user detection */
  lastActiveDate?: string;
  /** Total number of app opens */
  totalAppOpens?: number;
  /** List of milestone IDs that have been celebrated (prevents duplicate celebrations) */
  celebratedMilestones?: MilestoneId[];
}

/**
 * Zod schema dla walidacji UserProfile z AsyncStorage
 */
const MilestoneIdSchema = z.enum([
  'first_launch',
  'first_session',
  'sessions_10',
  'sessions_25',
  'sessions_50',
  'sessions_100',
  'streak_7',
  'streak_14',
  'streak_30',
  'streak_100',
]);

const UserProfileSchema = z.object({
  name: z.string().optional(),
  lastUpdated: z.string(),
  firstLaunchDate: z.string().optional(),
  lastActiveDate: z.string().optional(),
  totalAppOpens: z.number().optional(),
  celebratedMilestones: z.array(MilestoneIdSchema).optional(),
});

/**
 * Default user profile
 */
const DEFAULT_PROFILE: UserProfile = {
  name: undefined,
  lastUpdated: new Date().toISOString(),
  firstLaunchDate: undefined,
  lastActiveDate: undefined,
  totalAppOpens: 0,
  celebratedMilestones: [],
};

/**
 * Load user profile from storage
 */
export const loadUserProfile = async (): Promise<UserProfile> => {
  try {
    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!data) return DEFAULT_PROFILE;

    const parsed = UserProfileSchema.safeParse(JSON.parse(data));
    if (!parsed.success) {
      logger.warn('Invalid user profile data in storage, using defaults');
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...parsed.data } as UserProfile;
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
    if ('firstLaunchDate' in profile) {
      updated.firstLaunchDate = profile.firstLaunchDate;
    }
    if ('lastActiveDate' in profile) {
      updated.lastActiveDate = profile.lastActiveDate;
    }
    if ('totalAppOpens' in profile) {
      updated.totalAppOpens = profile.totalAppOpens;
    }
    if ('celebratedMilestones' in profile) {
      updated.celebratedMilestones = profile.celebratedMilestones;
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

/**
 * Record app open - updates lastActiveDate, totalAppOpens, and sets firstLaunchDate if first launch
 */
export const recordAppOpen = async (): Promise<{
  isFirstLaunch: boolean;
  isReturningAfterLongAbsence: boolean;
  hoursSinceLastActive: number | null;
}> => {
  try {
    const profile = await loadUserProfile();
    const now = new Date().toISOString();

    const isFirstLaunch = !profile.firstLaunchDate;
    let hoursSinceLastActive: number | null = null;
    let isReturningAfterLongAbsence = false;

    if (profile.lastActiveDate) {
      const lastActive = new Date(profile.lastActiveDate);
      const msSinceLastActive = Date.now() - lastActive.getTime();
      hoursSinceLastActive = msSinceLastActive / (1000 * 60 * 60);
      // Consider user "returning" if absent for more than 4 hours
      isReturningAfterLongAbsence = hoursSinceLastActive >= 4;
    }

    await saveUserProfile({
      firstLaunchDate: profile.firstLaunchDate || now,
      lastActiveDate: now,
      totalAppOpens: (profile.totalAppOpens || 0) + 1,
    });

    return {
      isFirstLaunch,
      isReturningAfterLongAbsence,
      hoursSinceLastActive,
    };
  } catch (error) {
    logger.error('Failed to record app open:', error);
    return {
      isFirstLaunch: false,
      isReturningAfterLongAbsence: false,
      hoursSinceLastActive: null,
    };
  }
};

/**
 * Check if a milestone has been celebrated
 */
export const hasCelebratedMilestone = async (
  milestoneId: MilestoneId
): Promise<boolean> => {
  try {
    const profile = await loadUserProfile();
    return profile.celebratedMilestones?.includes(milestoneId) ?? false;
  } catch (error) {
    logger.error('Failed to check milestone:', error);
    return false;
  }
};

/**
 * Mark a milestone as celebrated
 */
export const markMilestoneCelebrated = async (
  milestoneId: MilestoneId
): Promise<void> => {
  try {
    const profile = await loadUserProfile();
    const currentMilestones = profile.celebratedMilestones || [];

    if (!currentMilestones.includes(milestoneId)) {
      await saveUserProfile({
        celebratedMilestones: [...currentMilestones, milestoneId],
      });
    }
  } catch (error) {
    logger.error('Failed to mark milestone celebrated:', error);
    throw error;
  }
};

/**
 * Get all celebrated milestones
 */
export const getCelebratedMilestones = async (): Promise<MilestoneId[]> => {
  try {
    const profile = await loadUserProfile();
    return profile.celebratedMilestones || [];
  } catch (error) {
    logger.error('Failed to get celebrated milestones:', error);
    return [];
  }
};
