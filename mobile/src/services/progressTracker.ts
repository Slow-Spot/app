/**
 * Progress Tracking Service
 * Tracks meditation sessions, streaks, and statistics
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'meditation_progress';
const SESSIONS_KEY = 'completed_sessions';

export interface CompletedSession {
  id: number | string; // number for preset sessions, string for custom sessions
  title: string;
  date: string; // ISO string
  durationSeconds: number;
  languageCode: string;
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
  notes?: string
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
