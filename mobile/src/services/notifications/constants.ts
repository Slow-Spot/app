/**
 * ══════════════════════════════════════════════════════════════
 * Notification Constants
 * ══════════════════════════════════════════════════════════════
 */

/**
 * AsyncStorage keys for notification data
 */
export const STORAGE_KEYS = {
  NOTIFICATION_SETTINGS: '@slow_spot_notification_settings',
  LAST_NOTIFICATION_DATE: '@slow_spot_last_notification',
  CONTENT_INDEX: '@slow_spot_notification_content_index',
} as const;

/**
 * Android notification channel IDs
 * Required for Android 8.0+ (API 26+)
 */
export const CHANNEL_ID = {
  DAILY_REMINDER: 'daily-meditation-reminder',
  STREAK_ALERT: 'streak-protection-alert',
} as const;

/**
 * Default reminder time (8:00 AM)
 */
export const DEFAULT_REMINDER_TIME = '08:00';

/**
 * Default streak alert time (8:00 PM - evening reminder)
 */
export const DEFAULT_STREAK_ALERT_TIME = '20:00';

/**
 * Day of week constants
 */
export const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

/**
 * Time presets for quick selection
 */
export const TIME_PRESETS = {
  EARLY_MORNING: '06:00',
  MORNING: '08:00',
  MIDDAY: '12:00',
  AFTERNOON: '15:00',
  EVENING: '19:00',
  NIGHT: '21:00',
} as const;

/**
 * App brand color for notifications
 */
export const NOTIFICATION_ACCENT_COLOR = '#8B5CF6';
