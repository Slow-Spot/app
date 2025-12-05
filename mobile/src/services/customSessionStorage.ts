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
 * Breathing pattern types for meditation sessions
 */
export type BreathingPattern = 'none' | 'box' | '4-7-8' | 'equal' | 'calm' | 'custom';

export interface CustomBreathingPattern {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

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
  vibrationEnabled: boolean;
  breathingPattern?: BreathingPattern;
  customBreathing?: CustomBreathingPattern;
  name?: string;
  /**
   * Hide countdown timer during meditation for a distraction-free experience.
   * Research suggests that watching the clock can increase anxiety and reduce
   * the quality of meditation practice. When enabled, the timer is hidden
   * but the session still tracks time in the background.
   */
  hideCountdown?: boolean;
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
 * Using static requires at module level for Metro bundler compatibility
 */
const MEDITATION_BELL = require('../../assets/sounds/meditation-bell.mp3');

// Ambient sound files - static requires for Metro bundler
const AMBIENT_SOUNDS = {
  nature: require('../../assets/sounds/ambient/nature.mp3'),
  ocean: require('../../assets/sounds/ambient/ocean.mp3'),
  forest: require('../../assets/sounds/ambient/forest.mp3'),
  '432hz': require('../../assets/sounds/ambient/432hz.mp3'),
  '528hz': require('../../assets/sounds/ambient/528hz.mp3'),
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

/**
 * Default session configuration based on scientific research and best mindfulness practices
 *
 * Evidence-based settings:
 *
 * DURATION: 10 minutes
 * - Research from MBSR (Mindfulness-Based Stress Reduction) programs shows that
 *   10 minutes provides meaningful benefits for beginners
 * - Studies by Zeidan et al. (2010) found significant improvements in mood and
 *   cognitive function with just 10 minutes of daily practice
 * - Short sessions increase adherence and habit formation (Creswell, 2017)
 *
 * BREATHING: Box Breathing (4-4-4-4)
 * - Used by Navy SEALs for stress management and focus
 * - Activates parasympathetic nervous system (Zaccaro et al., 2018)
 * - Reduces cortisol levels and heart rate variability improves
 * - Equal timing creates rhythm that's easy to follow
 *
 * AMBIENT SOUND: Silence
 * - Traditional mindfulness practice emphasizes working with natural silence
 * - Reduces external stimuli to develop internal awareness
 * - Kabat-Zinn's MBSR program primarily uses silence
 *
 * TIMER: Hidden
 * - Clock-watching increases anxiety and anticipation (Killingsworth & Gilbert, 2010)
 * - Removes goal-oriented thinking that interferes with present-moment awareness
 * - Promotes surrendering to the experience rather than "waiting for it to end"
 * - Professional meditation apps like Headspace recommend hiding timer for deeper practice
 *
 * WAKE-UP CHIME: Enabled
 * - Gentle acoustic signal allows gradual return from meditative state
 * - Prevents jarring transition that could negate benefits
 * - Tibetan singing bowl-style tones have calming frequencies
 *
 * VIBRATION: Enabled
 * - Provides subtle haptic feedback during breathing phases
 * - Helps maintain focus through gentle physical sensation
 * - Particularly useful for kinesthetic learners
 *
 * INTERVAL BELL: Disabled for default session
 * - For beginners, continuous practice without interruption is recommended
 * - Interval bells are more useful for longer sessions (20+ minutes)
 */
export const DEFAULT_EVIDENCE_BASED_SESSION: CustomSessionConfig = {
  durationMinutes: 10,
  ambientSound: 'silence',
  intervalBellEnabled: false, // No interruptions for focused beginner practice
  intervalBellMinutes: 5,
  wakeUpChimeEnabled: true,
  voiceGuidanceEnabled: false,
  vibrationEnabled: true,
  breathingPattern: 'box',
  name: 'custom.defaultSession.name', // Translation key
  hideCountdown: true, // Hide timer for distraction-free, mindful practice
};

const DEFAULT_SESSION_STORAGE_KEY = '@slow_spot_default_session_created_v4'; // v4: hideCountdown=true, intervalBell=false
const DEFAULT_SESSION_ID = 'default-mindful-breathing';
const CORRECT_DEFAULT_SESSION_NAME = 'Mindful Breathing';

/**
 * Check if the default evidence-based session should be created
 * Creates a default session as an example for all users
 * Also migrates old sessions to remove emojis from name
 */
export const ensureDefaultSessionExists = async (): Promise<void> => {
  try {
    // Check if we've already created the default session
    const defaultCreated = await AsyncStorage.getItem(DEFAULT_SESSION_STORAGE_KEY);
    if (defaultCreated === 'true') {
      return;
    }

    // Check if default session already exists (by ID)
    const existingSessions = await getAllCustomSessions();
    const existingDefaultIndex = existingSessions.findIndex(s => s.id === DEFAULT_SESSION_ID);

    if (existingDefaultIndex >= 0) {
      // Default session exists - update its name to remove any emoji
      const existingSession = existingSessions[existingDefaultIndex];
      if (existingSession.title !== CORRECT_DEFAULT_SESSION_NAME ||
          existingSession.config?.name !== CORRECT_DEFAULT_SESSION_NAME) {
        existingSession.title = CORRECT_DEFAULT_SESSION_NAME;
        if (existingSession.config) {
          existingSession.config.name = CORRECT_DEFAULT_SESSION_NAME;
        }
        await AsyncStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(existingSessions));
        logger.log('Updated default session name to remove emoji');
      }
      await AsyncStorage.setItem(DEFAULT_SESSION_STORAGE_KEY, 'true');
      return;
    }

    // Create the default session with fixed ID so it's recognizable
    const defaultSession = configToMeditationSession(
      {
        ...DEFAULT_EVIDENCE_BASED_SESSION,
        name: CORRECT_DEFAULT_SESSION_NAME,
      },
      DEFAULT_SESSION_ID
    );

    // Prepend to beginning of sessions list
    existingSessions.unshift(defaultSession);
    await AsyncStorage.setItem(CUSTOM_SESSIONS_KEY, JSON.stringify(existingSessions));

    // Mark as created
    await AsyncStorage.setItem(DEFAULT_SESSION_STORAGE_KEY, 'true');
    logger.log('Default evidence-based meditation session created');
  } catch (error) {
    logger.error('Error ensuring default session exists:', error);
  }
};
