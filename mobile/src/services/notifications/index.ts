/**
 * ══════════════════════════════════════════════════════════════
 * Notifications Service - Public API
 * ══════════════════════════════════════════════════════════════
 *
 * Central export for all notification-related functionality.
 *
 * Usage:
 * ```typescript
 * import { notificationService } from '@/services/notifications';
 *
 * // Initialize on app start
 * await notificationService.initialize();
 *
 * // Request permission
 * const result = await notificationService.requestPermission();
 *
 * // Schedule reminder
 * await notificationService.scheduleDailyReminder('08:00');
 * ```
 */

export { notificationService } from './NotificationService';
export { notificationContentGenerator } from './NotificationContentGenerator';
export { STORAGE_KEYS, CHANNEL_ID, TIME_PRESETS, DEFAULT_REMINDER_TIME } from './constants';

// Re-export types
export type {
  NotificationSettings,
  NotificationPermissionStatus,
  NotificationState,
  ScheduleResult,
  PermissionResult,
  NotificationContent,
  NotificationContentCategory,
} from '../../types/notifications';
