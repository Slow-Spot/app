/**
 * ══════════════════════════════════════════════════════════════
 * Notification Types - Push Notifications for Slow Spot
 * ══════════════════════════════════════════════════════════════
 *
 * Type definitions for the meditation reminder notification system.
 * Supports local notifications for daily reminders with beautiful,
 * inspiring content in multiple languages.
 */

/**
 * Notification permission status
 * Maps to expo-notifications permission states
 */
export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined';

/**
 * Daily reminder configuration
 */
export interface DailyReminderSettings {
  /** Whether daily reminders are enabled */
  enabled: boolean;
  /** Time in HH:mm format (24-hour) */
  time: string;
  /** Days of week enabled (0=Sunday, 6=Saturday) */
  days: number[];
}

/**
 * Streak alert configuration
 * Evening reminder that only fires if user hasn't meditated today
 * and has an active streak to protect
 */
export interface StreakAlertSettings {
  /** Whether streak alerts are enabled */
  enabled: boolean;
  /** Time in HH:mm format (24-hour) - defaults to 20:00 (8 PM) */
  time: string;
}

/**
 * Notification settings persisted in AsyncStorage
 */
export interface NotificationSettings {
  /** Master switch for all notifications */
  enabled: boolean;

  /** Daily reminder settings */
  dailyReminder: DailyReminderSettings;

  /** Streak alert settings - evening reminder if user hasn't meditated */
  streakAlert: StreakAlertSettings;

  /** Last scheduled notification identifier */
  lastScheduledId?: string;

  /** Last scheduled streak alert identifier */
  lastStreakAlertId?: string;

  /** Timestamp of last settings update */
  updatedAt: string;
}

/**
 * Content category for notification messages
 * Allows for varied, inspiring content
 */
export type NotificationContentCategory =
  | 'encouragement'
  | 'mindfulness'
  | 'gratitude'
  | 'calm'
  | 'reflection'
  | 'streak_protection';

/**
 * Generated notification content
 */
export interface NotificationContent {
  title: string;
  body: string;
  category: NotificationContentCategory;
}

/**
 * Notification scheduling result
 */
export interface ScheduleResult {
  success: boolean;
  notificationId?: string;
  nextTriggerDate?: Date;
  error?: string;
}

/**
 * Permission request result
 */
export interface PermissionResult {
  granted: boolean;
  status: NotificationPermissionStatus;
  canAskAgain: boolean;
}

/**
 * Notification service state
 * Used by hooks/context for reactive updates
 */
export interface NotificationState {
  isInitialized: boolean;
  permissionStatus: NotificationPermissionStatus;
  settings: NotificationSettings;
  nextScheduledReminder?: Date;
  nextStreakAlert?: Date;
}

/**
 * Default notification settings
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: {
    enabled: false,
    time: '08:00', // 8 AM default - common morning meditation time
    days: [0, 1, 2, 3, 4, 5, 6], // All days by default
  },
  streakAlert: {
    enabled: false,
    time: '20:00', // 8 PM default - evening reminder to protect streak
  },
  updatedAt: new Date().toISOString(),
};

/**
 * All days of the week (for "everyday" preset)
 */
export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

/**
 * Weekdays only (Mon-Fri)
 */
export const WEEKDAYS = [1, 2, 3, 4, 5];

/**
 * Weekends only (Sat-Sun)
 */
export const WEEKENDS = [0, 6];
