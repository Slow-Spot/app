/**
 * Custom Session Storage Service
 * Manages custom meditation sessions created via CustomSessionBuilderScreen
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import type { MeditationSession } from './api';
import { logger } from '../utils/logger';

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  SESSIONS: '@slow_spot_custom_sessions',
  DEFAULT_SESSION_CREATED: '@slow_spot_default_session_v3', // v3: added titleKey for i18n
  CUSTOM_SOUNDS: '@slow_spot_custom_sounds',
} as const;

const DEFAULT_SESSION_ID = 'default-mindful-breathing';

// ============================================================================
// Types
// ============================================================================

/** Available breathing pattern presets */
export type BreathingPattern = 'none' | 'box' | '4-7-8' | 'equal' | 'calm' | 'custom';

/** Custom breathing timing configuration (in seconds) */
export interface BreathingTiming {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

/** Available ambient sound options */
export type AmbientSound = 'silence' | 'nature' | 'ocean' | 'forest' | 'rain' | 'fire' | 'wind' | 'custom';

/** Haptic feedback configuration */
export interface HapticSettings {
  /** Vibration at session start and end */
  session: boolean;
  /** Pulsing vibration synchronized with breathing phases */
  breathing: boolean;
  /** Vibration with interval bells */
  intervalBell: boolean;
}

/** Complete session configuration */
export interface SessionConfig {
  /** Session name for display */
  name: string;
  /** Duration in minutes */
  durationMinutes: number;
  /** Background ambient sound */
  ambientSound: AmbientSound;
  /** Breathing pattern type */
  breathingPattern: BreathingPattern;
  /** Custom breathing timing (when breathingPattern is 'custom') */
  customBreathing?: BreathingTiming;
  /** Play gentle chime at session end */
  endChimeEnabled: boolean;
  /** Play interval bells during session */
  intervalBellEnabled: boolean;
  /** Interval between bells (in minutes) */
  intervalBellMinutes: number;
  /** Hide countdown timer for distraction-free meditation */
  hideTimer: boolean;
  /** Haptic feedback settings */
  haptics: HapticSettings;
}

/** Saved session with metadata */
export interface CustomSession extends MeditationSession {
  isCustom: true;
  config: SessionConfig;
}

/** Custom sound configuration for user-selected audio files */
export interface CustomSoundsConfig {
  /** Custom bell/chime sound file URI */
  customBellUri?: string;
  customBellName?: string;
  /** Custom ambient sounds URIs */
  customAmbientUris: {
    nature?: { uri: string; name: string };
    ocean?: { uri: string; name: string };
    forest?: { uri: string; name: string };
    rain?: { uri: string; name: string };
    fire?: { uri: string; name: string };
    wind?: { uri: string; name: string };
    custom?: { uri: string; name: string };
  };
}

// ============================================================================
// Zod Schemas (walidacja danych z AsyncStorage)
// ============================================================================

const CustomSoundsConfigSchema = z.object({
  customBellUri: z.string().optional(),
  customBellName: z.string().optional(),
  customAmbientUris: z.object({
    nature: z.object({ uri: z.string(), name: z.string() }).optional(),
    ocean: z.object({ uri: z.string(), name: z.string() }).optional(),
    forest: z.object({ uri: z.string(), name: z.string() }).optional(),
    rain: z.object({ uri: z.string(), name: z.string() }).optional(),
    fire: z.object({ uri: z.string(), name: z.string() }).optional(),
    wind: z.object({ uri: z.string(), name: z.string() }).optional(),
    custom: z.object({ uri: z.string(), name: z.string() }).optional(),
  }),
});

const CustomSessionSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string(),
  titleKey: z.string().optional(),
  languageCode: z.string(),
  durationSeconds: z.number(),
  voiceUrl: z.unknown().optional(),
  ambientUrl: z.unknown().optional(),
  chimeUrl: z.unknown().optional(),
  cultureTag: z.string().optional(),
  purposeTag: z.string().optional(),
  level: z.number(),
  description: z.string().optional(),
  descriptionKey: z.string().optional(),
  createdAt: z.string(),
  ambientFrequency: z.number().optional(),
  chimeFrequency: z.number().optional(),
  instructionId: z.string().optional(),
  isCustom: z.literal(true),
  config: z.object({
    name: z.string(),
    durationMinutes: z.number(),
    ambientSound: z.string(),
    breathingPattern: z.string(),
    customBreathing: z.object({
      inhale: z.number(),
      hold1: z.number(),
      exhale: z.number(),
      hold2: z.number(),
    }).optional(),
    endChimeEnabled: z.boolean(),
    intervalBellEnabled: z.boolean(),
    intervalBellMinutes: z.number(),
    hideTimer: z.boolean(),
    haptics: z.object({
      session: z.boolean(),
      breathing: z.boolean(),
      intervalBell: z.boolean(),
    }),
  }),
});

const CustomSessionsArraySchema = z.array(CustomSessionSchema);

// ============================================================================
// Audio Assets (Metro bundler requires static requires)
// ============================================================================

/* eslint-disable @typescript-eslint/no-require-imports */
const AUDIO = {
  BELL: require('../../assets/sounds/meditation_bell.mp3'),
  AMBIENT: {
    nature: require('../../assets/sounds/ambient/nature.mp3'),
    ocean: require('../../assets/sounds/ambient/ocean.mp3'),
    forest: require('../../assets/sounds/ambient/forest.mp3'),
    rain: require('../../assets/sounds/ambient/rain.mp3'),
    fire: require('../../assets/sounds/ambient/fire.mp3'),
    wind: require('../../assets/sounds/ambient/wind.mp3'),
    // 'custom' is handled separately via user's custom sound URI
  },
} as const;
/* eslint-enable @typescript-eslint/no-require-imports */

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Evidence-based default session configuration
 *
 * Based on scientific research:
 * - Duration: 10 min (Zeidan et al., 2010 - cognitive benefits)
 * - Breathing: None - natural breathing, mindfulness-based approach
 * - Timer: Hidden - reduces clock-watching anxiety
 * - Ambient: Silence - traditional MBSR approach
 */
export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  name: 'Mindful Breathing',
  durationMinutes: 10,
  ambientSound: 'silence',
  breathingPattern: 'none',
  endChimeEnabled: true,
  intervalBellEnabled: false,
  intervalBellMinutes: 5,
  hideTimer: true,
  haptics: {
    session: true,
    breathing: false,
    intervalBell: true,
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/** Generate unique session ID */
const generateId = (): string => {
  return `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/** Get ambient sound asset (or undefined for silence/custom) */
const getAmbientAsset = (sound: AmbientSound): number | undefined => {
  if (sound === 'silence' || sound === 'custom') return undefined;
  return AUDIO.AMBIENT[sound];
};

/** Get frequency for ambient sound */
const getAmbientFrequency = (_sound: AmbientSound): number => {
  return 440; // Standard tuning frequency
};

// ============================================================================
// Custom Sounds Loading
// ============================================================================

/** Load custom sounds configuration from storage */
export const getCustomSoundsConfig = async (): Promise<CustomSoundsConfig | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_SOUNDS);
    if (data) {
      const parsed = CustomSoundsConfigSchema.safeParse(JSON.parse(data));
      if (!parsed.success) {
        logger.warn('Invalid custom sounds config in storage, returning null');
        return null;
      }
      return parsed.data as CustomSoundsConfig;
    }
    return null;
  } catch (error) {
    logger.error('Error loading custom sounds config:', error);
    return null;
  }
};

/** Get custom ambient sound URI for a specific sound type */
export const getCustomAmbientUri = async (soundType: AmbientSound): Promise<string | undefined> => {
  if (soundType === 'silence') return undefined;

  const config = await getCustomSoundsConfig();
  if (!config || !config.customAmbientUris) return undefined;

  // For 'custom' type, use the custom ambient URI
  if (soundType === 'custom') {
    return config.customAmbientUris.custom?.uri;
  }

  // For other types, check if there's a custom override
  const customSound = config.customAmbientUris[soundType];
  return customSound?.uri;
};

/** Get custom bell/chime URI */
export const getCustomBellUri = async (): Promise<string | undefined> => {
  const config = await getCustomSoundsConfig();
  return config?.customBellUri;
};

/** Convert SessionConfig to full CustomSession object */
export const createSessionFromConfig = (config: SessionConfig, id?: string): CustomSession => {
  const sessionId = id || generateId();
  const needsChime = config.endChimeEnabled || config.intervalBellEnabled;
  const isDefaultSession = sessionId === DEFAULT_SESSION_ID;

  return {
    id: sessionId,
    title: config.name,
    // Use i18n key for default session title
    titleKey: isDefaultSession ? 'custom.defaultSessionName' : undefined,
    description: `${config.durationMinutes} min meditation`,
    languageCode: 'en',
    durationSeconds: config.durationMinutes * 60,
    level: 1,
    voiceUrl: undefined,
    ambientUrl: getAmbientAsset(config.ambientSound),
    chimeUrl: needsChime ? AUDIO.BELL : undefined,
    ambientFrequency: getAmbientFrequency(config.ambientSound),
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
    isCustom: true,
    config,
  };
};

// ============================================================================
// Storage Operations
// ============================================================================

/** Get all saved sessions */
export const getAllSessions = async (): Promise<CustomSession[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!data) return [];

    const parsed = CustomSessionsArraySchema.safeParse(JSON.parse(data));
    if (!parsed.success) {
      logger.warn('Invalid custom sessions data in storage, returning empty array');
      return [];
    }
    return parsed.data as CustomSession[];
  } catch (error) {
    logger.error('Error loading sessions:', error);
    return [];
  }
};

/** Get session by ID */
export const getSessionById = async (id: string): Promise<CustomSession | null> => {
  try {
    const sessions = await getAllSessions();
    return sessions.find((s) => s.id === id) || null;
  } catch (error) {
    logger.error('Error getting session:', error);
    return null;
  }
};

/** Save new session */
export const saveSession = async (config: SessionConfig): Promise<CustomSession> => {
  try {
    const sessions = await getAllSessions();
    const newSession = createSessionFromConfig(config);
    sessions.push(newSession);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    logger.error('Error saving session:', error);
    throw error;
  }
};

/** Update existing session */
export const updateSession = async (id: string, config: SessionConfig): Promise<void> => {
  try {
    const sessions = await getAllSessions();
    const index = sessions.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Session not found: ${id}`);
    }

    const existingSession = sessions[index];
    const updatedSession = createSessionFromConfig(config, id);
    if (existingSession) {
      updatedSession.createdAt = existingSession.createdAt;
    }
    sessions[index] = updatedSession;

    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    logger.error('Error updating session:', error);
    throw error;
  }
};

/** Delete session by ID */
export const deleteSession = async (id: string): Promise<void> => {
  try {
    const sessions = await getAllSessions();
    const filtered = sessions.filter((s) => s.id !== id);

    if (filtered.length === sessions.length) {
      throw new Error(`Session not found: ${id}`);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
  } catch (error) {
    logger.error('Error deleting session:', error);
    throw error;
  }
};

/** Clear all sessions (for testing/reset) */
export const clearAllSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
    // Also reset the default session flag so it will be recreated
    await AsyncStorage.removeItem(STORAGE_KEYS.DEFAULT_SESSION_CREATED);
  } catch (error) {
    logger.error('Error clearing sessions:', error);
    throw error;
  }
};

// ============================================================================
// Initialization
// ============================================================================

/**
 * Ensure default session exists
 * - On first app launch: creates default session
 * - When session list is empty: recreates default session (e.g., after user deletes all)
 */
export const initializeDefaultSession = async (): Promise<void> => {
  try {
    const sessions = await getAllSessions();

    // Always ensure at least one session exists
    // This handles: first launch, clear data, or user manually deleted all sessions
    if (sessions.length === 0) {
      const defaultSession = createSessionFromConfig(DEFAULT_SESSION_CONFIG, DEFAULT_SESSION_ID);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([defaultSession]));
      await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_SESSION_CREATED, 'true');
      logger.log('Default session created (empty list)');
      return;
    }

    // Check if this is first initialization (flag not set yet)
    const alreadyCreated = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_SESSION_CREATED);
    if (alreadyCreated === 'true') {
      return; // Sessions exist and initialization was already done
    }

    // First launch with existing sessions (edge case: legacy data)
    // Ensure default session exists in the list
    const existingIndex = sessions.findIndex((s) => s.id === DEFAULT_SESSION_ID);

    const existingSession = existingIndex >= 0 ? sessions[existingIndex] : undefined;
    if (existingSession) {
      // Update existing default session to latest config, preserving original createdAt
      const originalCreatedAt = existingSession.createdAt;
      sessions[existingIndex] = createSessionFromConfig(DEFAULT_SESSION_CONFIG, DEFAULT_SESSION_ID);
      sessions[existingIndex].createdAt = originalCreatedAt;
    } else {
      // Add default session at the beginning
      const defaultSession = createSessionFromConfig(DEFAULT_SESSION_CONFIG, DEFAULT_SESSION_ID);
      sessions.unshift(defaultSession);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_SESSION_CREATED, 'true');
    logger.log('Default session initialized');
  } catch (error) {
    logger.error('Error initializing default session:', error);
  }
};

// ============================================================================
// Legacy Compatibility (for existing user data migration)
// ============================================================================

/**
 * Migrate old session format to new format
 * Call this once on app startup to convert any legacy sessions
 */
export const migrateOldSessions = async (): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!data) return;

    // Migracja - walidujemy tylko ze dane sa tablica obiektow
    const rawParsed = z.array(z.record(z.string(), z.unknown())).safeParse(JSON.parse(data));
    if (!rawParsed.success) {
      logger.warn('Invalid sessions data for migration, skipping');
      return;
    }
    const sessions = rawParsed.data;
    let hasChanges = false;

    for (const session of sessions) {
      if (session.config) {
        // Migrate old field names to new structure
        const oldConfig = session.config as Record<string, unknown>;

        // Migrate haptics from old vibrationEnabled to new haptics object
        if (!oldConfig.haptics && oldConfig.vibrationEnabled !== undefined) {
          const enabled = oldConfig.vibrationEnabled as boolean;
          oldConfig.haptics = {
            session: oldConfig.sessionHaptics ?? enabled,
            breathing: oldConfig.breathingHaptics ?? enabled,
            intervalBell: oldConfig.intervalBellHaptics ?? enabled,
          };
          // Clean up old fields
          delete oldConfig.vibrationEnabled;
          delete oldConfig.sessionHaptics;
          delete oldConfig.breathingHaptics;
          delete oldConfig.intervalBellHaptics;
          hasChanges = true;
        }

        // Migrate wakeUpChimeEnabled to endChimeEnabled
        if (oldConfig.wakeUpChimeEnabled !== undefined && oldConfig.endChimeEnabled === undefined) {
          oldConfig.endChimeEnabled = oldConfig.wakeUpChimeEnabled;
          delete oldConfig.wakeUpChimeEnabled;
          hasChanges = true;
        }

        // Migrate hideCountdown to hideTimer
        if (oldConfig.hideCountdown !== undefined && oldConfig.hideTimer === undefined) {
          oldConfig.hideTimer = oldConfig.hideCountdown;
          delete oldConfig.hideCountdown;
          hasChanges = true;
        }

        // Ensure haptics object exists with defaults
        if (!oldConfig.haptics) {
          oldConfig.haptics = {
            session: true,
            breathing: true,
            intervalBell: true,
          };
          hasChanges = true;
        }

        // Ensure hideTimer has a default
        if (oldConfig.hideTimer === undefined) {
          oldConfig.hideTimer = true;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      logger.log('Migrated old sessions to new format');
    }
  } catch (error) {
    logger.error('Error migrating old sessions:', error);
  }
};
