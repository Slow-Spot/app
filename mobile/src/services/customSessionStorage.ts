/**
 * Custom Session Storage Service
 * Manages custom meditation sessions created via CustomSessionBuilderScreen
 * Integrates with the existing MeditationSession format for seamless display
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MeditationSession } from './api';
import { logger } from '../utils/logger';

const CUSTOM_SESSIONS_KEY = '@slow_spot_custom_sessions';

/**
 * Custom session configuration from the builder screen
 */
export interface CustomSessionConfig {
  durationMinutes: number;
  ambientSound: 'nature' | 'silence' | '432hz' | '528hz' | 'ocean' | 'forest';
  intervalBellEnabled: boolean;
  intervalBellMinutes: number;
  wakeUpChimeEnabled: boolean;
  voiceGuidanceEnabled: boolean;
  name?: string;
}

/**
 * Saved custom session with metadata
 */
export interface SavedCustomSession extends MeditationSession {
  isCustom: true;
  config: CustomSessionConfig;
}

/**
 * Generate unique UUID for custom sessions
 */
const generateUUID = (): string => {
  return `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Reference to audio assets
 * Using requires at module level for better bundler compatibility
 */
const MEDITATION_BELL = require('../../assets/sounds/meditation-bell.mp3');

// Safely load ambient sound files without dynamic require (Metro needs static paths)
// If files don't exist yet, fall back to meditation bell as placeholder
const loadAmbientSound = (loader: () => number, label: string): number => {
  try {
    return loader();
  } catch (error) {
    logger.warn(`Ambient sound file not found: ${label}, using meditation bell as fallback`);
    return MEDITATION_BELL;
  }
};

// Ambient sound files - will be loaded when files are added to assets/sounds/ambient/
const AMBIENT_SOUNDS = {
  nature: loadAmbientSound(() => require('../../assets/sounds/ambient/nature.mp3'), 'nature.mp3'),
  ocean: loadAmbientSound(() => require('../../assets/sounds/ambient/ocean.mp3'), 'ocean.mp3'),
  forest: loadAmbientSound(() => require('../../assets/sounds/ambient/forest.mp3'), 'forest.mp3'),
  '432hz': loadAmbientSound(() => require('../../assets/sounds/ambient/432hz.mp3'), '432hz.mp3'),
  '528hz': loadAmbientSound(() => require('../../assets/sounds/ambient/528hz.mp3'), '528hz.mp3'),
};

/**
 * Map ambient sound to audio file path
 * Returns the appropriate ambient sound file or undefined for silence
 */
const getAmbientUrl = (sound: CustomSessionConfig['ambientSound']): number | undefined => {
  if (sound === 'silence') {
    return undefined;
  }

  // Return the appropriate ambient sound file
  return AMBIENT_SOUNDS[sound];
};

/**
 * Convert CustomSessionConfig to MeditationSession format
 */
const configToMeditationSession = (
  config: CustomSessionConfig,
  id?: string
): SavedCustomSession => {
  const sessionId = id || generateUUID();
  const now = new Date().toISOString();

  return {
    id: sessionId,
    title: config.name || 'My Custom Session',
    description: `${config.durationMinutes} min meditation with ${config.ambientSound} ambient sound`,
    languageCode: 'en', // Default to English for custom sessions
    durationSeconds: config.durationMinutes * 60,
    level: 1, // Custom sessions are beginner-friendly
    voiceUrl: undefined, // Custom sessions don't have voice guidance by default
    ambientUrl: getAmbientUrl(config.ambientSound),
    chimeUrl: config.wakeUpChimeEnabled || config.intervalBellEnabled
      ? MEDITATION_BELL
      : undefined,
    ambientFrequency: config.ambientSound === '432hz' ? 432 : config.ambientSound === '528hz' ? 528 : 432,
    chimeFrequency: 528,
    createdAt: now,
    isCustom: true,
    config,
  };
};

/**
 * Save a custom session
 */
export const saveCustomSession = async (
  config: CustomSessionConfig
): Promise<SavedCustomSession> => {
  try {
    const sessions = await getAllCustomSessions();
    const newSession = configToMeditationSession(config);

    sessions.push(newSession);
    await AsyncStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(sessions));

    return newSession;
  } catch (error) {
    logger.error('Error saving custom session:', error);
    throw error;
  }
};

/**
 * Get all custom sessions
 */
export const getAllCustomSessions = async (): Promise<SavedCustomSession[]> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading custom sessions:', error);
    return [];
  }
};

/**
 * Get a custom session by ID
 */
export const getCustomSessionById = async (
  id: string
): Promise<SavedCustomSession | null> => {
  try {
    const sessions = await getAllCustomSessions();
    return sessions.find((s) => s.id === id) || null;
  } catch (error) {
    logger.error('Error getting custom session:', error);
    return null;
  }
};

/**
 * Update a custom session
 */
export const updateCustomSession = async (
  id: string,
  config: CustomSessionConfig
): Promise<void> => {
  try {
    const sessions = await getAllCustomSessions();
    const index = sessions.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Custom session with id ${id} not found`);
    }

    // Update the session while preserving the ID and creation date
    const updatedSession = configToMeditationSession(config, id);
    updatedSession.createdAt = sessions[index].createdAt;

    sessions[index] = updatedSession;
    await AsyncStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    logger.error('Error updating custom session:', error);
    throw error;
  }
};

/**
 * Delete a custom session
 */
export const deleteCustomSession = async (id: string): Promise<void> => {
  try {
    const sessions = await getAllCustomSessions();
    const filtered = sessions.filter((s) => s.id !== id);

    if (filtered.length === sessions.length) {
      throw new Error(`Custom session with id ${id} not found`);
    }

    await AsyncStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    logger.error('Error deleting custom session:', error);
    throw error;
  }
};

/**
 * Clear all custom sessions (for testing/reset)
 */
export const clearAllCustomSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CUSTOM_SESSIONS_KEY);
  } catch (error) {
    logger.error('Error clearing custom sessions:', error);
    throw error;
  }
};
