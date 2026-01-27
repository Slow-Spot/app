/**
 * ══════════════════════════════════════════════════════════════
 * Date Utilities - Centralized Date Handling for Slow Spot
 * ══════════════════════════════════════════════════════════════
 *
 * Uses date-fns for reliable, timezone-aware date operations.
 * All functions use LOCAL timezone by default (not UTC).
 *
 * @see https://date-fns.org/docs/Getting-Started
 */

import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  addDays,
  differenceInDays,
  differenceInMinutes,
  differenceInCalendarDays,
  isToday,
  isYesterday,
  isSameDay,
  isBefore,
  isAfter,
  isWithinInterval,
  getDay,
  getHours,
} from 'date-fns';

// ══════════════════════════════════════════════════════════════
// DATE FORMATTING
// ══════════════════════════════════════════════════════════════

/**
 * Format date as YYYY-MM-DD (ISO date format, local timezone)
 * Primary format for streak calculations and storage keys
 *
 * @example
 * formatDateKey(new Date()) // "2026-01-04"
 */
export const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format date for display (localized, human-readable)
 *
 * @example
 * formatDisplayDate(new Date()) // "January 4, 2026"
 */
export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

/**
 * Format date as short display
 *
 * @example
 * formatShortDate(new Date()) // "Jan 4"
 */
export const formatShortDate = (date: Date): string => {
  return format(date, 'MMM d');
};

/**
 * Format time for display
 *
 * @example
 * formatTime(new Date()) // "2:30 PM"
 */
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

/**
 * Format date and time together
 *
 * @example
 * formatDateTime(new Date()) // "Jan 4, 2026 at 2:30 PM"
 */
export const formatDateTime = (date: Date): string => {
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Format relative date (Today, Yesterday, or date)
 *
 * @example
 * formatRelativeDate(new Date()) // "Today"
 * formatRelativeDate(subDays(new Date(), 1)) // "Yesterday"
 * formatRelativeDate(subDays(new Date(), 5)) // "Dec 30"
 */
export const formatRelativeDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatShortDate(date);
};

/**
 * Format duration in minutes to human readable
 *
 * @example
 * formatDuration(65) // "1h 5m"
 * formatDuration(30) // "30m"
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format seconds to MM:SS or HH:MM:SS
 *
 * @example
 * formatSeconds(125) // "2:05"
 * formatSeconds(3665) // "1:01:05"
 */
export const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

// ══════════════════════════════════════════════════════════════
// DATE PARSING
// ══════════════════════════════════════════════════════════════

/**
 * Parse ISO string to Date object safely
 *
 * @example
 * parseDate("2026-01-04T14:30:00.000Z") // Date object
 */
export const parseDate = (isoString: string): Date => {
  return parseISO(isoString);
};

/**
 * Get current date key (YYYY-MM-DD in local timezone)
 *
 * @example
 * getTodayKey() // "2026-01-04"
 */
export const getTodayKey = (): string => {
  return formatDateKey(new Date());
};

/**
 * Get yesterday's date key
 *
 * @example
 * getYesterdayKey() // "2026-01-03"
 */
export const getYesterdayKey = (): string => {
  return formatDateKey(subDays(new Date(), 1));
};

// ══════════════════════════════════════════════════════════════
// DATE RANGES & BOUNDARIES
// ══════════════════════════════════════════════════════════════

/**
 * Get start of today (00:00:00.000)
 */
export const getStartOfToday = (): Date => {
  return startOfDay(new Date());
};

/**
 * Get end of today (23:59:59.999)
 */
export const getEndOfToday = (): Date => {
  return endOfDay(new Date());
};

/**
 * Get start of current week (Sunday by default)
 */
export const getStartOfCurrentWeek = (): Date => {
  return startOfWeek(new Date());
};

/**
 * Get end of current week
 */
export const getEndOfCurrentWeek = (): Date => {
  return endOfWeek(new Date());
};

/**
 * Get start of current month
 */
export const getStartOfCurrentMonth = (): Date => {
  return startOfMonth(new Date());
};

/**
 * Get end of current month
 */
export const getEndOfCurrentMonth = (): Date => {
  return endOfMonth(new Date());
};

/**
 * Get date N days ago
 *
 * @example
 * getDaysAgo(7) // Date 7 days in the past
 */
export const getDaysAgo = (days: number): Date => {
  return subDays(new Date(), days);
};

/**
 * Get date N days from now
 *
 * @example
 * getDaysFromNow(7) // Date 7 days in the future
 */
export const getDaysFromNow = (days: number): Date => {
  return addDays(new Date(), days);
};

/**
 * Get week start for any date (Sunday)
 */
export const getWeekStart = (date: Date): Date => {
  return startOfWeek(date);
};

/**
 * Get week key (YYYY-MM-DD of week start) for grouping
 *
 * @example
 * getWeekKey(new Date()) // "2025-12-29" (Sunday of that week)
 */
export const getWeekKey = (date: Date): string => {
  return formatDateKey(startOfWeek(date));
};

// ══════════════════════════════════════════════════════════════
// DATE COMPARISONS
// ══════════════════════════════════════════════════════════════

/**
 * Check if date is today
 */
export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

/**
 * Check if date is yesterday
 */
export const isDateYesterday = (date: Date): boolean => {
  return isYesterday(date);
};

/**
 * Check if two dates are the same day
 */
export const areSameDay = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * Check if date1 is before date2
 */
export const isDateBefore = (date1: Date, date2: Date): boolean => {
  return isBefore(date1, date2);
};

/**
 * Check if date1 is after date2
 */
export const isDateAfter = (date1: Date, date2: Date): boolean => {
  return isAfter(date1, date2);
};

/**
 * Check if date is within a range (inclusive)
 */
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return isWithinInterval(date, { start, end });
};

// ══════════════════════════════════════════════════════════════
// DATE CALCULATIONS
// ══════════════════════════════════════════════════════════════

/**
 * Get number of days between two dates (absolute)
 *
 * @example
 * getDaysBetween(date1, date2) // 5
 */
export const getDaysBetween = (date1: Date, date2: Date): number => {
  return Math.abs(differenceInDays(date1, date2));
};

/**
 * Get calendar days between dates (counts each day change)
 * This is more accurate for streak calculations
 *
 * @example
 * getCalendarDaysBetween(jan1, jan3) // 2
 */
export const getCalendarDaysBetween = (date1: Date, date2: Date): number => {
  return Math.abs(differenceInCalendarDays(date1, date2));
};

/**
 * Get minutes between two dates
 */
export const getMinutesBetween = (date1: Date, date2: Date): number => {
  return Math.abs(differenceInMinutes(date1, date2));
};

/**
 * Check if dates are consecutive days
 *
 * @example
 * areConsecutiveDays(jan1, jan2) // true
 * areConsecutiveDays(jan1, jan3) // false
 */
export const areConsecutiveDays = (earlier: Date, later: Date): boolean => {
  return differenceInCalendarDays(later, earlier) === 1;
};

// ══════════════════════════════════════════════════════════════
// TIME OF DAY UTILITIES
// ══════════════════════════════════════════════════════════════

/**
 * Time of day categories
 */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Get time of day category for a date
 *
 * @example
 * getTimeOfDay(new Date('2026-01-04T08:00:00')) // "morning"
 * getTimeOfDay(new Date('2026-01-04T14:00:00')) // "afternoon"
 * getTimeOfDay(new Date('2026-01-04T19:00:00')) // "evening"
 * getTimeOfDay(new Date('2026-01-04T23:00:00')) // "night"
 */
export const getTimeOfDay = (date: Date): TimeOfDay => {
  const hour = getHours(date);

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeek = (date: Date): number => {
  return getDay(date);
};

/**
 * Get day name
 *
 * @example
 * getDayName(new Date()) // "Saturday"
 */
export const getDayName = (date: Date): string => {
  return format(date, 'EEEE');
};

/**
 * Get short day name
 *
 * @example
 * getShortDayName(new Date()) // "Sat"
 */
export const getShortDayName = (date: Date): string => {
  return format(date, 'EEE');
};

// ══════════════════════════════════════════════════════════════
// STREAK UTILITIES
// ══════════════════════════════════════════════════════════════

/**
 * Get unique date keys from an array of ISO date strings
 * Sorted chronologically, uses local timezone
 *
 * @example
 * getUniqueDateKeys(["2026-01-04T...", "2026-01-04T...", "2026-01-03T..."])
 * // ["2026-01-03", "2026-01-04"]
 */
export const getUniqueDateKeys = (isoDateStrings: string[]): string[] => {
  const dateKeys = isoDateStrings.map((iso) => formatDateKey(parseISO(iso)));
  return [...new Set(dateKeys)].sort();
};

/**
 * Check if date key is today or yesterday (for active streak)
 *
 * @example
 * isRecentDateKey("2026-01-04") // true (if today is Jan 4)
 * isRecentDateKey("2026-01-03") // true (if today is Jan 4)
 * isRecentDateKey("2026-01-02") // false (if today is Jan 4)
 */
export const isRecentDateKey = (dateKey: string): boolean => {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  return dateKey === today || dateKey === yesterday;
};

/**
 * Calculate streak from sorted unique date keys
 * Returns 0 if no recent activity (streak broken)
 *
 * @example
 * calculateStreakFromDateKeys(["2026-01-02", "2026-01-03", "2026-01-04"]) // 3
 * calculateStreakFromDateKeys(["2026-01-01", "2026-01-02"]) // 0 (if today is Jan 4)
 */
export const calculateStreakFromDateKeys = (sortedDateKeys: string[]): number => {
  if (sortedDateKeys.length === 0) return 0;

  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  // Check most recent date - must be today or yesterday for active streak
  const lastDateKey = sortedDateKeys[sortedDateKeys.length - 1];

  if (lastDateKey !== today && lastDateKey !== yesterday) {
    return 0; // Streak is broken
  }

  // Count consecutive days backwards
  let streak = 0;
  let expectedDateKey = lastDateKey === today ? today : yesterday;

  for (let i = sortedDateKeys.length - 1; i >= 0; i--) {
    if (sortedDateKeys[i] === expectedDateKey) {
      streak++;
      expectedDateKey = formatDateKey(subDays(parseISO(expectedDateKey), 1));
    } else if (streak === 0 && sortedDateKeys[i] === yesterday && lastDateKey !== today) {
      // Handle case where we started checking from yesterday
      streak = 1;
      expectedDateKey = formatDateKey(subDays(parseISO(yesterday), 1));
    } else {
      break; // Gap found
    }
  }

  return streak;
};

/**
 * Calculate longest streak from sorted unique date keys
 *
 * @example
 * calculateLongestStreak(["2026-01-01", "2026-01-02", "2026-01-05", "2026-01-06", "2026-01-07"])
 * // 3 (Jan 5-7)
 */
export const calculateLongestStreak = (sortedDateKeys: string[]): number => {
  if (sortedDateKeys.length === 0) return 0;
  if (sortedDateKeys.length === 1) return 1;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDateKeys.length; i++) {
    const prevDate = parseISO(sortedDateKeys[i - 1]);
    const currDate = parseISO(sortedDateKeys[i]);

    if (areConsecutiveDays(prevDate, currDate)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

// ══════════════════════════════════════════════════════════════
// EXPORTS SUMMARY
// ══════════════════════════════════════════════════════════════

// Re-export commonly used date-fns functions for convenience
export {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  addDays,
  differenceInDays,
  isToday,
  isYesterday,
  isSameDay,
};
