/**
 * Progress Tracking Service
 * Tracks meditation sessions, streaks, and statistics
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'meditation_progress';
const SESSIONS_KEY = 'completed_sessions';
const IMPORTED_STREAK_KEY = 'imported_streak';

/**
 * Imported streak data from another meditation app
 */
export interface ImportedStreakData {
  days: number;                    // Number of imported streak days
  importedAt: string;              // ISO date when imported
  sourceApp?: string;              // Optional: name of source app (e.g., "Headspace", "Calm")
  originalStartDate?: string;      // Optional: when the original streak started
}

export interface CompletedSession {
  id: number | string; // number for preset sessions, string for custom sessions
  title: string;
  date: string; // ISO string
  durationSeconds: number;
  languageCode: string;
  intention?: string; // User's intention set before the session
  mood?: 1 | 2 | 3 | 4 | 5; // Optional mood rating after session
  notes?: string; // Optional session notes/reflections
}

export interface ProgressStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
}

/**
 * Save a completed meditation session
 */
export const saveSessionCompletion = async (
  sessionId: number | string,
  title: string,
  durationSeconds: number,
  languageCode: string,
  mood?: 1 | 2 | 3 | 4 | 5,
  notes?: string,
  intention?: string
): Promise<void> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    const sessions: CompletedSession[] = sessionsJson
      ? JSON.parse(sessionsJson)
      : [];

    const newSession: CompletedSession = {
      id: sessionId,
      title,
      date: new Date().toISOString(),
      durationSeconds,
      languageCode,
      ...(intention && intention.trim() && { intention: intention.trim() }), // Only add intention if provided
      ...(mood !== undefined && { mood }), // Only add mood if provided
      ...(notes && notes.trim() && { notes: notes.trim() }), // Only add notes if provided
    };

    sessions.push(newSession);

    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    logger.error('Error saving session completion:', error);
  }
};

/**
 * Get all completed sessions
 */
export const getCompletedSessions = async (): Promise<CompletedSession[]> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    logger.error('Error reading completed sessions:', error);
    return [];
  }
};

/**
 * Get unique dates when user meditated (YYYY-MM-DD format)
 */
const getUniqueMeditationDates = (sessions: CompletedSession[]): string[] => {
  const dates = sessions.map((s) => {
    const date = new Date(s.date);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  // Remove duplicates and sort
  return [...new Set(dates)].sort();
};

/**
 * Calculate current meditation streak
 */
export const calculateCurrentStreak = (sessions: CompletedSession[]): number => {
  if (sessions.length === 0) return 0;

  const uniqueDates = getUniqueMeditationDates(sessions);
  const today = new Date().toISOString().split('T')[0];

  let streak = 0;
  let currentDate = new Date();

  // Check if user meditated today or yesterday (to keep streak alive)
  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const meditationDate = uniqueDates[i];
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - streak);
    const expectedDate = checkDate.toISOString().split('T')[0];

    if (meditationDate === expectedDate) {
      streak++;
    } else if (streak === 0 && meditationDate < today) {
      // Haven't meditated today, check if yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (meditationDate === yesterdayStr) {
        streak = 1;
      } else {
        // Streak is broken
        break;
      }
    } else {
      // Gap in streak
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak ever
 */
export const calculateLongestStreak = (sessions: CompletedSession[]): number => {
  if (sessions.length === 0) return 0;

  const uniqueDates = getUniqueMeditationDates(sessions);
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);

    // Calculate difference in days
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 1) {
      // Consecutive day
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      // Gap - reset current streak
      currentStreak = 1;
    }
  }

  return longestStreak;
};

/**
 * Get complete progress statistics
 */
export const getProgressStats = async (): Promise<ProgressStats> => {
  try {
    const sessions = await getCompletedSessions();

    const totalSessions = sessions.length;
    const totalMinutes = Math.floor(
      sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    );
    const currentStreak = calculateCurrentStreak(sessions);
    const longestStreak = calculateLongestStreak(sessions);
    const lastSessionDate =
      sessions.length > 0 ? sessions[sessions.length - 1].date : null;

    return {
      totalSessions,
      totalMinutes,
      currentStreak,
      longestStreak,
      lastSessionDate,
    };
  } catch (error) {
    logger.error('Error calculating progress stats:', error);
    return {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
    };
  }
};

/**
 * Clear all progress data (for testing or reset)
 */
export const clearProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSIONS_KEY);
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logger.error('Error clearing progress:', error);
  }
};

/**
 * Get sessions for a specific date range
 */
export const getSessionsInRange = async (
  startDate: Date,
  endDate: Date
): Promise<CompletedSession[]> => {
  try {
    const sessions = await getCompletedSessions();

    return sessions.filter((s) => {
      const sessionDate = new Date(s.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  } catch (error) {
    logger.error('Error getting sessions in range:', error);
    return [];
  }
};

/**
 * Get total meditation time for today
 */
export const getTodayMinutes = async (): Promise<number> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await getSessionsInRange(today, tomorrow);

    return Math.floor(
      todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
    );
  } catch (error) {
    logger.error('Error getting today minutes:', error);
    return 0;
  }
};

// ══════════════════════════════════════════════════════════════
// Imported Streak Functions
// For users migrating from other meditation apps
// ══════════════════════════════════════════════════════════════

/**
 * Save imported streak data from another app
 * This adds bonus days to the user's current streak
 */
export const saveImportedStreak = async (
  days: number,
  sourceApp?: string,
  originalStartDate?: string
): Promise<void> => {
  try {
    const data: ImportedStreakData = {
      days: Math.max(0, Math.floor(days)), // Ensure positive integer
      importedAt: new Date().toISOString(),
      ...(sourceApp && { sourceApp }),
      ...(originalStartDate && { originalStartDate }),
    };
    await AsyncStorage.setItem(IMPORTED_STREAK_KEY, JSON.stringify(data));
    logger.log(`Imported streak saved: ${days} days from ${sourceApp || 'unknown app'}`);
  } catch (error) {
    logger.error('Error saving imported streak:', error);
    throw error;
  }
};

/**
 * Get imported streak data
 */
export const getImportedStreak = async (): Promise<ImportedStreakData | null> => {
  try {
    const data = await AsyncStorage.getItem(IMPORTED_STREAK_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Error reading imported streak:', error);
    return null;
  }
};

/**
 * Clear imported streak data
 */
export const clearImportedStreak = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(IMPORTED_STREAK_KEY);
    logger.log('Imported streak cleared');
  } catch (error) {
    logger.error('Error clearing imported streak:', error);
  }
};

/**
 * Get total streak including imported days
 * Only adds imported streak if user has meditated today or yesterday
 * (to maintain the "active streak" requirement)
 */
export const getTotalStreak = async (): Promise<{
  total: number;
  current: number;
  imported: number;
  hasActiveStreak: boolean;
}> => {
  try {
    const sessions = await getCompletedSessions();
    const currentStreak = calculateCurrentStreak(sessions);
    const importedData = await getImportedStreak();

    // Only add imported streak if user has an active streak (meditated recently)
    const hasActiveStreak = currentStreak > 0;
    const importedDays = importedData?.days || 0;

    // Total = current streak + imported (only if active)
    const total = hasActiveStreak ? currentStreak + importedDays : currentStreak;

    return {
      total,
      current: currentStreak,
      imported: importedDays,
      hasActiveStreak,
    };
  } catch (error) {
    logger.error('Error calculating total streak:', error);
    return {
      total: 0,
      current: 0,
      imported: 0,
      hasActiveStreak: false,
    };
  }
};
