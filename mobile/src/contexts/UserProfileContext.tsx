/**
 * User Profile Context
 *
 * Provides global access to user profile data (name, etc.)
 * across the application with automatic persistence.
 */

import type {
  ReactNode} from 'react';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import type {
  UserProfile} from '../services/userProfileService';
import {
  loadUserProfile,
  setUserName as setStoredUserName,
} from '../services/userProfileService';
import { logger } from '../utils/logger';

/**
 * Context value interface
 */
interface UserProfileContextValue {
  /** User's display name */
  userName: string | undefined;
  /** Whether the profile is being loaded */
  isLoading: boolean;
  /** Set the user's name (persists to storage) */
  setUserName: (name: string | undefined) => Promise<void>;
  /** Full profile data */
  profile: UserProfile | null;
  /** Refresh profile from storage */
  refreshProfile: () => Promise<void>;
}

/**
 * Default context value
 */
const defaultContextValue: UserProfileContextValue = {
  userName: undefined,
  isLoading: true,
  setUserName: async () => {},
  profile: null,
  refreshProfile: async () => {},
};

/**
 * User Profile Context
 */
const UserProfileContext = createContext<UserProfileContextValue>(defaultContextValue);

/**
 * Provider props
 */
interface UserProfileProviderProps {
  children: ReactNode;
}

/**
 * User Profile Provider
 *
 * Wraps the app to provide user profile data globally
 */
export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load profile from storage
   */
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const loaded = await loadUserProfile();
      setProfile(loaded);
    } catch (error) {
      logger.error('Failed to load user profile in context:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Set user name and persist
   */
  const setUserName = useCallback(async (name: string | undefined) => {
    try {
      logger.log('UserProfileContext: Setting name to:', name ?? '(undefined)');
      await setStoredUserName(name);
      // Reload profile to get updated data
      const updated = await loadUserProfile();
      logger.log('UserProfileContext: Profile after update:', updated);
      setProfile(updated);
    } catch (error) {
      logger.error('Failed to set user name in context:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh profile from storage
   */
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const value: UserProfileContextValue = {
    userName: profile?.name,
    isLoading,
    setUserName,
    profile,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

/**
 * Hook to access user profile
 */
export const useUserProfile = (): UserProfileContextValue => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export default UserProfileContext;
