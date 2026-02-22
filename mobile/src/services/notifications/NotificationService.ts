/**
 * ══════════════════════════════════════════════════════════════
 * Notification Service
 * ══════════════════════════════════════════════════════════════
 *
 * Singleton service managing all notification operations for Slow Spot.
 * Handles permission management, scheduling/canceling notifications,
 * settings persistence, and content generation coordination.
 *
 * Uses local notifications (no server required) for privacy-first approach.
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { z } from 'zod';
import i18n from '../../i18n';
import { logger } from '../../utils/logger';
import type {
  NotificationSettings,
  NotificationPermissionStatus,
  ScheduleResult,
  PermissionResult,
  NotificationState} from '../../types/notifications';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../../types/notifications';
import { notificationContentGenerator } from './NotificationContentGenerator';
import { STORAGE_KEYS, CHANNEL_ID, NOTIFICATION_ACCENT_COLOR } from './constants';
import { getTodayMinutes, getTotalStreak } from '../progressTracker';

/**
 * Zod schema dla walidacji NotificationSettings z AsyncStorage
 */
const NotificationSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  dailyReminder: z.object({
    enabled: z.boolean(),
    time: z.string(),
    days: z.array(z.number()),
  }).optional(),
  streakAlert: z.object({
    enabled: z.boolean(),
    time: z.string(),
  }).optional(),
  lastScheduledId: z.string().optional(),
  lastStreakAlertId: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * NotificationService
 *
 * Singleton service managing all notification operations.
 * Follows the pattern established by other services in the app.
 */
class NotificationService {
  private isInitialized = false;
  private settings: NotificationSettings = { ...DEFAULT_NOTIFICATION_SETTINGS };
  private permissionStatus: NotificationPermissionStatus = 'undetermined';
  private stateListeners: Set<(state: NotificationState) => void> = new Set();

  // ══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════════════════════════════════

  /**
   * Initialize the notification service
   * Should be called on app startup
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure notification behavior
      await this.configureNotificationHandler();

      // Setup Android channel
      if (Platform.OS === 'android') {
        await this.createAndroidChannel();
      }

      // Load persisted settings
      await this.loadSettings();

      // Load content generator index
      await notificationContentGenerator.loadContentIndex();

      // Check current permission status
      this.permissionStatus = await this.checkPermissionStatus();

      // Reschedule if needed (e.g., after app update)
      if (this.settings.enabled && this.permissionStatus === 'granted') {
        if (this.settings.dailyReminder.enabled) {
          await this.rescheduleReminders();
        }
        if (this.settings.streakAlert.enabled) {
          await this.rescheduleStreakAlert();
        }
      }

      this.isInitialized = true;
      this.notifyListeners();
      logger.log('NotificationService initialized');
    } catch (error) {
      logger.error('Failed to initialize NotificationService:', error);
      // Don't throw - app should work without notifications
    }
  }

  /**
   * Configure how notifications are handled when app is in foreground
   */
  private async configureNotificationHandler(): Promise<void> {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  /**
   * Create Android notification channels
   * Required for Android 8.0+ (API 26+)
   */
  private async createAndroidChannel(): Promise<void> {
    // Daily reminder channel
    await Notifications.setNotificationChannelAsync(CHANNEL_ID.DAILY_REMINDER, {
      name: 'Daily Meditation Reminders',
      description: 'Gentle reminders to meditate',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: NOTIFICATION_ACCENT_COLOR,
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });

    // Streak alert channel
    await Notifications.setNotificationChannelAsync(CHANNEL_ID.STREAK_ALERT, {
      name: 'Streak Protection Alerts',
      description: 'Evening reminders to protect your meditation streak',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: NOTIFICATION_ACCENT_COLOR,
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });
  }

  // ══════════════════════════════════════════════════════════════
  // PERMISSIONS
  // ══════════════════════════════════════════════════════════════

  /**
   * Check current permission status without requesting
   */
  async checkPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      this.permissionStatus = status as NotificationPermissionStatus;
      return this.permissionStatus;
    } catch (error) {
      logger.error('Failed to check notification permissions:', error);
      return 'undetermined';
    }
  }

  /**
   * Request notification permissions
   * Handles iOS provisional notifications gracefully
   */
  async requestPermission(): Promise<PermissionResult> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        this.permissionStatus = 'granted';
        this.notifyListeners();
        return { granted: true, status: 'granted', canAskAgain: true };
      }

      const { status, canAskAgain } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: false,
          allowSound: true,
        },
      });

      this.permissionStatus = status as NotificationPermissionStatus;
      this.notifyListeners();

      return {
        granted: status === 'granted',
        status: status as NotificationPermissionStatus,
        canAskAgain: canAskAgain ?? true,
      };
    } catch (error) {
      logger.error('Failed to request notification permission:', error);
      return { granted: false, status: 'denied', canAskAgain: false };
    }
  }

  // ══════════════════════════════════════════════════════════════
  // SETTINGS
  // ══════════════════════════════════════════════════════════════

  /**
   * Load settings from AsyncStorage
   */
  private async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (stored) {
        const parsed = NotificationSettingsSchema.safeParse(JSON.parse(stored));
        if (!parsed.success) {
          logger.warn('Invalid notification settings in storage, using defaults');
        } else {
          this.settings = { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed.data } as NotificationSettings;
        }
      }
    } catch (error) {
      logger.error('Failed to load notification settings:', error);
    }
  }

  /**
   * Save settings to AsyncStorage
   */
  private async saveSettings(): Promise<void> {
    try {
      this.settings.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
        JSON.stringify(this.settings)
      );
    } catch (error) {
      logger.error('Failed to save notification settings:', error);
      throw error;
    }
  }

  /**
   * Get current settings (read-only copy)
   */
  getSettings(): Readonly<NotificationSettings> {
    return { ...this.settings };
  }

  /**
   * Update notification settings
   */
  async updateSettings(
    updates: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    try {
      // Deep merge for dailyReminder
      if (updates.dailyReminder) {
        this.settings.dailyReminder = {
          ...this.settings.dailyReminder,
          ...updates.dailyReminder,
        };
        delete updates.dailyReminder;
      }

      // Deep merge for streakAlert
      if (updates.streakAlert) {
        this.settings.streakAlert = {
          ...this.settings.streakAlert,
          ...updates.streakAlert,
        };
        delete updates.streakAlert;
      }

      this.settings = { ...this.settings, ...updates };
      await this.saveSettings();

      // Handle scheduling based on new settings
      if (this.settings.enabled && this.permissionStatus === 'granted') {
        // Daily reminder
        if (this.settings.dailyReminder.enabled) {
          await this.rescheduleReminders();
        } else {
          await this.cancelDailyReminder();
        }

        // Streak alert
        if (this.settings.streakAlert.enabled) {
          await this.rescheduleStreakAlert();
        } else {
          await this.cancelStreakAlert();
        }
      } else {
        await this.cancelAllReminders();
      }

      this.notifyListeners();
      return this.getSettings();
    } catch (error) {
      logger.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════
  // SCHEDULING
  // ══════════════════════════════════════════════════════════════

  /**
   * Schedule daily meditation reminder
   */
  async scheduleDailyReminder(
    time: string,
    days: number[] = [0, 1, 2, 3, 4, 5, 6]
  ): Promise<ScheduleResult> {
    try {
      // Cancel existing daily reminder first
      await this.cancelDailyReminder();

      // Parse time
      const [hours = 9, minutes = 0] = time.split(':').map(Number);
      const parsedHours = hours ?? 9;
      const parsedMinutes = minutes ?? 0;

      // Generate inspiring content
      const content = await notificationContentGenerator.generateDaily(i18n.language);

      // Schedule repeating notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          sound: 'default',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: parsedHours,
          minute: parsedMinutes,
        },
      });

      // Update settings
      this.settings.dailyReminder = { enabled: true, time, days };
      this.settings.enabled = true;
      this.settings.lastScheduledId = identifier;
      await this.saveSettings();

      // Calculate next trigger date
      const nextTrigger = this.calculateNextTriggerDate(parsedHours, parsedMinutes);

      logger.log(`Scheduled daily reminder at ${time}, ID: ${identifier}`);
      this.notifyListeners();

      return {
        success: true,
        notificationId: identifier,
        nextTriggerDate: nextTrigger,
      };
    } catch (error) {
      logger.error('Failed to schedule daily reminder:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Schedule streak protection alert
   * Evening reminder that checks if user has an active streak and hasn't meditated today
   */
  async scheduleStreakAlert(time: string): Promise<ScheduleResult> {
    try {
      // Cancel existing streak alert first
      await this.cancelStreakAlert();

      // Parse time
      const [hours = 20, minutes = 0] = time.split(':').map(Number);
      const parsedHours = hours ?? 20;
      const parsedMinutes = minutes ?? 0;

      // Generate streak protection content
      const content = await notificationContentGenerator.generateStreakAlert(i18n.language);

      // Schedule repeating notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          sound: 'default',
          data: { type: 'streak_alert' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: parsedHours,
          minute: parsedMinutes,
        },
      });

      // Update settings
      this.settings.streakAlert = { enabled: true, time };
      this.settings.enabled = true;
      this.settings.lastStreakAlertId = identifier;
      await this.saveSettings();

      // Calculate next trigger date
      const nextTrigger = this.calculateNextTriggerDate(parsedHours, parsedMinutes);

      logger.log(`Scheduled streak alert at ${time}, ID: ${identifier}`);
      this.notifyListeners();

      return {
        success: true,
        notificationId: identifier,
        nextTriggerDate: nextTrigger,
      };
    } catch (error) {
      logger.error('Failed to schedule streak alert:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if streak alert should be shown
   * Only show if user has an active streak AND hasn't meditated today
   */
  async shouldShowStreakAlert(): Promise<boolean> {
    try {
      const todayMinutes = await getTodayMinutes();
      if (todayMinutes > 0) {
        // User already meditated today, no alert needed
        return false;
      }

      const streakData = await getTotalStreak();
      // Only show alert if user has an active streak to protect
      return streakData.hasActiveStreak && streakData.total > 0;
    } catch (error) {
      logger.error('Failed to check streak alert condition:', error);
      return false;
    }
  }

  /**
   * Cancel daily reminder only
   */
  async cancelDailyReminder(): Promise<void> {
    try {
      if (this.settings.lastScheduledId) {
        await Notifications.cancelScheduledNotificationAsync(this.settings.lastScheduledId);
        this.settings.lastScheduledId = undefined;
        logger.log('Daily reminder cancelled');
      }
    } catch (error) {
      logger.error('Failed to cancel daily reminder:', error);
    }
  }

  /**
   * Cancel streak alert only
   */
  async cancelStreakAlert(): Promise<void> {
    try {
      if (this.settings.lastStreakAlertId) {
        await Notifications.cancelScheduledNotificationAsync(this.settings.lastStreakAlertId);
        this.settings.lastStreakAlertId = undefined;
        logger.log('Streak alert cancelled');
      }
    } catch (error) {
      logger.error('Failed to cancel streak alert:', error);
    }
  }

  /**
   * Cancel all scheduled reminders
   */
  async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.settings.lastScheduledId = undefined;
      this.settings.lastStreakAlertId = undefined;
      logger.log('All reminders cancelled');
    } catch (error) {
      logger.error('Failed to cancel reminders:', error);
    }
  }

  /**
   * Reschedule daily reminders (e.g., after app update or language change)
   */
  async rescheduleReminders(): Promise<void> {
    if (!this.settings.enabled || !this.settings.dailyReminder.enabled) {
      return;
    }

    const { time, days } = this.settings.dailyReminder;
    await this.scheduleDailyReminder(time, days);
  }

  /**
   * Reschedule streak alert (e.g., after app update or language change)
   */
  async rescheduleStreakAlert(): Promise<void> {
    if (!this.settings.enabled || !this.settings.streakAlert.enabled) {
      return;
    }

    const { time } = this.settings.streakAlert;
    await this.scheduleStreakAlert(time);
  }

  /**
   * Send a test notification immediately
   */
  async sendTestNotification(): Promise<void> {
    try {
      const content = notificationContentGenerator.getRandomContent(i18n.language);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          sound: 'default',
          data: { type: 'test' },
        },
        trigger: null, // Immediate
      });

      logger.log('Test notification sent');
    } catch (error) {
      logger.error('Failed to send test notification:', error);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════
  // SESSION COMPLETION NOTIFICATION
  // ══════════════════════════════════════════════════════════════

  private sessionCompletionNotificationId: string | null = null;

  /**
   * Schedule a notification for when meditation session completes
   * Used to play sound when app is in background/suspended
   *
   * Custom Sound Setup:
   * 1. Convert meditation_bell.mp3 to .wav format (iOS requirement)
   *    Command: ffmpeg -i meditation_bell.mp3 -acodec pcm_s16le -ar 44100 meditation_bell.wav
   * 2. Place the .wav file in assets/sounds/
   * 3. Add to app.json expo-notifications plugin sounds array
   * 4. Rebuild the app (expo prebuild && npx pod-install)
   */
  async scheduleSessionCompletionNotification(secondsUntilEnd: number): Promise<string | null> {
    try {
      // Cancel any existing session completion notification
      await this.cancelSessionCompletionNotification();

      if (secondsUntilEnd <= 0) return null;

      // Custom meditation bell sound - falls back to default if not available
      // iOS: requires .wav/.caf/.aiff file in app bundle (configured in app.json)
      // Android: can use any sound file
      const customSound = Platform.OS === 'ios' ? 'meditation_bell.wav' : 'meditation_bell';

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('meditation.sessionComplete', 'Session Complete'),
          body: i18n.t('meditation.wellDone', 'Well done! Take a moment to enjoy the stillness.'),
          sound: customSound,
          data: { type: 'session_complete' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilEnd,
        },
      });

      this.sessionCompletionNotificationId = identifier;
      logger.log(`Session completion notification scheduled in ${secondsUntilEnd}s, ID: ${identifier}`);
      return identifier;
    } catch (error) {
      logger.error('Failed to schedule session completion notification:', error);
      return null;
    }
  }

  /**
   * Cancel session completion notification
   * Called when session is cancelled, paused, or user returns to app
   */
  async cancelSessionCompletionNotification(): Promise<void> {
    try {
      if (this.sessionCompletionNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(this.sessionCompletionNotificationId);
        logger.log(`Session completion notification cancelled: ${this.sessionCompletionNotificationId}`);
        this.sessionCompletionNotificationId = null;
      }
    } catch (error) {
      logger.error('Failed to cancel session completion notification:', error);
    }
  }

  /**
   * Reschedule session completion notification with new time
   * Called when session is resumed from pause
   */
  async rescheduleSessionCompletionNotification(secondsUntilEnd: number): Promise<string | null> {
    return this.scheduleSessionCompletionNotification(secondsUntilEnd);
  }

  // ══════════════════════════════════════════════════════════════
  // UTILITIES
  // ══════════════════════════════════════════════════════════════

  /**
   * Calculate the next trigger date for display purposes
   */
  private calculateNextTriggerDate(hours: number, minutes: number): Date {
    const now = new Date();
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    return next;
  }

  /**
   * Get next scheduled reminder date
   */
  getNextReminderDate(): Date | undefined {
    if (!this.settings.enabled || !this.settings.dailyReminder.enabled) {
      return undefined;
    }

    const [hours = 9, minutes = 0] = this.settings.dailyReminder.time.split(':').map(Number);
    return this.calculateNextTriggerDate(hours ?? 9, minutes ?? 0);
  }

  /**
   * Get next scheduled streak alert date
   */
  getNextStreakAlertDate(): Date | undefined {
    if (!this.settings.enabled || !this.settings.streakAlert.enabled) {
      return undefined;
    }

    const [hours = 20, minutes = 0] = this.settings.streakAlert.time.split(':').map(Number);
    return this.calculateNextTriggerDate(hours ?? 20, minutes ?? 0);
  }

  /**
   * Get current service state
   */
  getState(): NotificationState {
    return {
      isInitialized: this.isInitialized,
      permissionStatus: this.permissionStatus,
      settings: this.getSettings(),
      nextScheduledReminder: this.getNextReminderDate(),
      nextStreakAlert: this.getNextStreakAlertDate(),
    };
  }

  // ══════════════════════════════════════════════════════════════
  // STATE LISTENERS
  // ══════════════════════════════════════════════════════════════

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: NotificationState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.stateListeners.forEach((listener) => listener(state));
  }

  // ══════════════════════════════════════════════════════════════
  // CLEANUP
  // ══════════════════════════════════════════════════════════════

  /**
   * Cleanup resources (call on app unmount if needed)
   */
  cleanup(): void {
    this.stateListeners.clear();
    logger.log('NotificationService cleaned up');
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
