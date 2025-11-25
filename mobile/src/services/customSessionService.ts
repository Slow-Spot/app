/**
 * Custom Session Service
 * Manages user-defined meditation session configurations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomSessionConfig, CreateCustomSessionInput } from '../types/customSession';
import { logger } from '../utils/logger';

const STORAGE_KEY = '@custom_sessions';

/**
 * Generate unique ID for custom session
 */
const generateId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all custom session configurations
 */
export const getCustomSessions = async (): Promise<CustomSessionConfig[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logger.error('Error loading custom sessions:', error);
    return [];
  }
};

/**
 * Get a specific custom session by ID
 */
export const getCustomSession = async (id: string): Promise<CustomSessionConfig | null> => {
  const sessions = await getCustomSessions();
  return sessions.find(s => s.id === id) || null;
};

/**
 * Create a new custom session configuration
 */
export const createCustomSession = async (
  input: CreateCustomSessionInput
): Promise<CustomSessionConfig> => {
  const sessions = await getCustomSessions();

  const newSession: CustomSessionConfig = {
    id: generateId(),
    name: input.name,
    durationSeconds: input.durationSeconds,
    chimePoints: input.chimePoints.sort((a, b) => a.timeInSeconds - b.timeInSeconds),
    description: input.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    useCount: 0,
  };

  sessions.push(newSession);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

  return newSession;
};

/**
 * Update an existing custom session
 */
export const updateCustomSession = async (
  id: string,
  updates: Partial<Omit<CustomSessionConfig, 'id' | 'createdAt' | 'useCount'>>
): Promise<CustomSessionConfig | null> => {
  const sessions = await getCustomSessions();
  const index = sessions.findIndex(s => s.id === id);

  if (index === -1) {
    return null;
  }

  const updatedSession: CustomSessionConfig = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Sort chime points if they were updated
  if (updates.chimePoints) {
    updatedSession.chimePoints = updates.chimePoints.sort(
      (a, b) => a.timeInSeconds - b.timeInSeconds
    );
  }

  sessions[index] = updatedSession;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

  return updatedSession;
};

/**
 * Delete a custom session
 */
export const deleteCustomSession = async (id: string): Promise<boolean> => {
  const sessions = await getCustomSessions();
  const filtered = sessions.filter(s => s.id !== id);

  if (filtered.length === sessions.length) {
    return false; // Session not found
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * Increment use count for a custom session
 */
export const incrementUseCount = async (id: string): Promise<void> => {
  const sessions = await getCustomSessions();
  const index = sessions.findIndex(s => s.id === id);

  if (index !== -1) {
    sessions[index].useCount += 1;
    sessions[index].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
};

/**
 * Validate session configuration
 */
export const validateSessionConfig = (
  input: CreateCustomSessionInput
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length === 0) {
    errors.push('Session name is required');
  }

  if (input.durationSeconds < 60) {
    errors.push('Duration must be at least 60 seconds (1 minute)');
  }

  if (input.durationSeconds > 7200) {
    errors.push('Duration cannot exceed 7200 seconds (2 hours)');
  }

  // Validate chime points
  for (const chime of input.chimePoints) {
    if (chime.timeInSeconds < 0) {
      errors.push('Chime time cannot be negative');
    }
    if (chime.timeInSeconds >= input.durationSeconds) {
      errors.push('Chime time must be less than session duration');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get default templates for quick setup
 */
export const getSessionTemplates = (): CreateCustomSessionInput[] => {
  return [
    {
      name: 'Quick 5-Minute Session',
      durationSeconds: 300, // 5 minutes
      chimePoints: [
        { timeInSeconds: 150, label: 'Halfway' },
      ],
      description: 'Short meditation for busy days',
    },
    {
      name: '10-Minute with Reminders',
      durationSeconds: 600, // 10 minutes
      chimePoints: [
        { timeInSeconds: 180, label: '3 minutes' },
        { timeInSeconds: 360, label: '6 minutes' },
      ],
      description: 'Standard session with gentle reminders',
    },
    {
      name: '20-Minute Deep Session',
      durationSeconds: 1200, // 20 minutes
      chimePoints: [
        { timeInSeconds: 300, label: '5 minutes' },
        { timeInSeconds: 600, label: '10 minutes' },
        { timeInSeconds: 900, label: '15 minutes' },
      ],
      description: 'Longer meditation with regular check-ins',
    },
    {
      name: 'Body Scan 12-Minute',
      durationSeconds: 720, // 12 minutes
      chimePoints: [
        { timeInSeconds: 120, label: 'Legs' },
        { timeInSeconds: 240, label: 'Torso' },
        { timeInSeconds: 360, label: 'Arms' },
        { timeInSeconds: 480, label: 'Head' },
        { timeInSeconds: 600, label: 'Integration' },
      ],
      description: 'Structured body scan practice',
    },
  ];
};
