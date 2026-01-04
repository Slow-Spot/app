/**
 * ══════════════════════════════════════════════════════════════
 * useNotifications Hook
 * ══════════════════════════════════════════════════════════════
 *
 * React hook for notification functionality.
 * Provides reactive state and action methods for components.
 *
 * Usage:
 * ```tsx
 * const {
 *   hasPermission,
 *   isReminderEnabled,
 *   settings,
 *   requestPermission,
 *   setDailyReminder,
 *   setReminderTime,
 * } = useNotifications();
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notifications';
import { logger } from '../utils/logger';
import {
  NotificationSettings,
  NotificationPermissionStatus,
  NotificationState,
} from '../types/notifications';

export interface UseNotificationsReturn {
  // State
  isInitialized: boolean;
  permissionStatus: NotificationPermissionStatus;
  settings: NotificationSettings;
  nextReminder: Date | undefined;
  nextStreakAlert: Date | undefined;
  isLoading: boolean;

  // Computed
  hasPermission: boolean;
  canAskPermission: boolean;
  isReminderEnabled: boolean;
  isStreakAlertEnabled: boolean;

  // Actions
  requestPermission: () => Promise<{ granted: boolean }>;
  setEnabled: (enabled: boolean) => Promise<void>;
  setDailyReminder: (enabled: boolean, time?: string, days?: number[]) => Promise<void>;
  setReminderTime: (time: string) => Promise<void>;
  setStreakAlert: (enabled: boolean, time?: string) => Promise<void>;
  setStreakAlertTime: (time: string) => Promise<void>;
  sendTestNotification: () => Promise<void>;
}

/**
 * React hook for notification functionality
 * Provides reactive state and action methods
 */
export function useNotifications(): UseNotificationsReturn {
  const [state, setState] = useState<NotificationState>(() =>
    notificationService.getState()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to service state changes
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setState);
    return unsubscribe;
  }, []);

  // Initialize service on first use
  useEffect(() => {
    notificationService.initialize().catch((error) => {
      logger.error('Failed to initialize notifications:', error);
    });
  }, []);

  /**
   * Request notification permissions
   */
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await notificationService.requestPermission();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Enable/disable notifications globally
   */
  const setEnabled = useCallback(async (enabled: boolean) => {
    setIsLoading(true);
    try {
      await notificationService.updateSettings({ enabled });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update daily reminder settings
   */
  const setDailyReminder = useCallback(
    async (enabled: boolean, time?: string, days?: number[]) => {
      setIsLoading(true);
      try {
        const currentSettings = notificationService.getSettings();

        if (enabled) {
          // Schedule with provided or current values
          await notificationService.scheduleDailyReminder(
            time ?? currentSettings.dailyReminder.time,
            days ?? currentSettings.dailyReminder.days
          );
        } else {
          // Disable reminders
          await notificationService.updateSettings({
            enabled: false,
            dailyReminder: {
              ...currentSettings.dailyReminder,
              enabled: false,
            },
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update reminder time
   */
  const setReminderTime = useCallback(async (time: string) => {
    setIsLoading(true);
    try {
      await notificationService.scheduleDailyReminder(
        time,
        state.settings.dailyReminder.days
      );
    } finally {
      setIsLoading(false);
    }
  }, [state.settings.dailyReminder.days]);

  /**
   * Update streak alert settings
   */
  const setStreakAlert = useCallback(
    async (enabled: boolean, time?: string) => {
      setIsLoading(true);
      try {
        const currentSettings = notificationService.getSettings();

        if (enabled) {
          // Schedule with provided or current values
          await notificationService.scheduleStreakAlert(
            time ?? currentSettings.streakAlert.time
          );
        } else {
          // Disable streak alerts
          await notificationService.updateSettings({
            streakAlert: {
              ...currentSettings.streakAlert,
              enabled: false,
            },
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update streak alert time
   */
  const setStreakAlertTime = useCallback(async (time: string) => {
    setIsLoading(true);
    try {
      await notificationService.scheduleStreakAlert(time);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Send a test notification
   */
  const sendTestNotification = useCallback(async () => {
    setIsLoading(true);
    try {
      await notificationService.sendTestNotification();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isInitialized: state.isInitialized,
    permissionStatus: state.permissionStatus,
    settings: state.settings,
    nextReminder: state.nextScheduledReminder,
    nextStreakAlert: state.nextStreakAlert,
    isLoading,

    // Computed
    hasPermission: state.permissionStatus === 'granted',
    canAskPermission: state.permissionStatus === 'undetermined',
    isReminderEnabled: state.settings.enabled && state.settings.dailyReminder.enabled,
    isStreakAlertEnabled: state.settings.enabled && state.settings.streakAlert.enabled,

    // Actions
    requestPermission,
    setEnabled,
    setDailyReminder,
    setReminderTime,
    setStreakAlert,
    setStreakAlertTime,
    sendTestNotification,
  };
}

export default useNotifications;
