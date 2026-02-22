/**
 * ══════════════════════════════════════════════════════════════
 * NotificationSettingsCard Component
 * ══════════════════════════════════════════════════════════════
 *
 * Beautiful card for notification settings in the Settings screen.
 * Allows users to enable/disable daily meditation reminders
 * and set their preferred reminder time.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { GradientCard } from './GradientCard';
import { ScheduleReminderModal } from './ScheduleReminderModal';
import { useNotifications } from '../hooks/useNotifications';
import { usePersonalization } from '../contexts/PersonalizationContext';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { featureColorPalettes, semanticColors } from '../theme/colors';

interface NotificationSettingsCardProps {
  isDark: boolean;
  animationIndex?: number;
}

/**
 * NotificationSettingsCard
 *
 * Beautiful, accessible card for managing notification settings.
 * Features:
 * - Permission request with graceful handling
 * - Daily reminder toggle
 * - Time picker for setting reminder time
 * - Test notification button
 * - Visual feedback for next scheduled notification
 */
export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  isDark,
  animationIndex: _animationIndex = 0,
}) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, effectiveAnimationsEnabled } = usePersonalization();

  // Notification state and actions
  const {
    isInitialized: _isInitialized,
    permissionStatus: _permissionStatus,
    settings,
    nextReminder,
    nextStreakAlert,
    isLoading,
    hasPermission,
    canAskPermission,
    isReminderEnabled,
    isStreakAlertEnabled,
    requestPermission,
    setDailyReminder,
    setReminderTime,
    setStreakAlert,
    setStreakAlertTime,
    sendTestNotification,
  } = useNotifications();

  // Modal state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showStreakTimePicker, setShowStreakTimePicker] = useState(false);

  // Theme-aware colors
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  const dynamicStyles = useMemo(() => ({
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    optionBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.lightGray[50],
    optionBorder: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[200],
  }), [colors, isDark]);

  /**
   * Handle permission request
   */
  const handleRequestPermission = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await requestPermission();

    if (!result.granted) {
      // Show alert directing user to settings if permission was denied
      Alert.alert(
        t('notifications.permissionDenied'),
        t('notifications.permissionDeniedDescription'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('notifications.openSettings'),
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  }, [requestPermission, t]);

  /**
   * Handle reminder toggle
   */
  const handleReminderToggle = useCallback(async (enabled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (enabled && !hasPermission) {
      // Request permission first if needed
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }

    await setDailyReminder(enabled);
  }, [hasPermission, requestPermission, setDailyReminder]);

  /**
   * Handle streak alert toggle
   */
  const handleStreakAlertToggle = useCallback(async (enabled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (enabled && !hasPermission) {
      // Request permission first if needed
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }

    await setStreakAlert(enabled);
  }, [hasPermission, requestPermission, setStreakAlert]);

  /**
   * Handle time save from modal
   */
  const handleTimeSave = useCallback(async (time: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setReminderTime(time);
    setShowTimePicker(false);
  }, [setReminderTime]);

  /**
   * Handle streak alert time save from modal
   */
  const handleStreakTimeSave = useCallback(async (time: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setStreakAlertTime(time);
    setShowStreakTimePicker(false);
  }, [setStreakAlertTime]);

  /**
   * Handle test notification
   */
  const handleTestNotification = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await sendTestNotification();
    } catch {
      Alert.alert(
        t('notifications.testFailed'),
        t('notifications.testFailedDescription')
      );
    }
  }, [sendTestNotification, t]);

  /**
   * Format next reminder time for display
   */
  const formattedNextReminder = useMemo(() => {
    if (!nextReminder) return null;

    const timeStr = nextReminder.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isToday = nextReminder.toDateString() === new Date().toDateString();
    const isTomorrow = nextReminder.toDateString() === new Date(Date.now() + 86400000).toDateString();

    if (isToday) {
      return t('notifications.nextReminderToday', { time: timeStr });
    } else if (isTomorrow) {
      return t('notifications.nextReminderTomorrow', { time: timeStr });
    }

    return timeStr;
  }, [nextReminder, i18n.language, t]);

  /**
   * Format current time setting for display
   */
  const formattedTime = useMemo(() => {
    const [hours = 0, minutes = 0] = settings.dailyReminder.time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [settings.dailyReminder.time, i18n.language]);

  /**
   * Format next streak alert time for display
   */
  const formattedNextStreakAlert = useMemo(() => {
    if (!nextStreakAlert) return null;

    const timeStr = nextStreakAlert.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isToday = nextStreakAlert.toDateString() === new Date().toDateString();
    const isTomorrow = nextStreakAlert.toDateString() === new Date(Date.now() + 86400000).toDateString();

    if (isToday) {
      return t('notifications.nextReminderToday', { time: timeStr });
    } else if (isTomorrow) {
      return t('notifications.nextReminderTomorrow', { time: timeStr });
    }

    return timeStr;
  }, [nextStreakAlert, i18n.language, t]);

  /**
   * Format current streak alert time setting for display
   */
  const formattedStreakAlertTime = useMemo(() => {
    const [hours = 0, minutes = 0] = settings.streakAlert.time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [settings.streakAlert.time, i18n.language]);

  return (
    <>
      <GradientCard
        gradient={themeGradients.card.whiteCard}
        style={[styles.card, dynamicStyles.cardShadow]}
        isDark={isDark}
      >
        {/* Header */}
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: `${currentTheme.primary}20` }]}>
            <Ionicons name="notifications" size={24} color={currentTheme.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
              {t('notifications.title')}
            </Text>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {t('notifications.description')}
            </Text>
          </View>
        </View>

        {/* Permission Required State */}
        {!hasPermission && (
          <View style={styles.permissionSection}>
            {canAskPermission ? (
              <TouchableOpacity
                style={[styles.permissionButton, { backgroundColor: `${currentTheme.primary}15` }]}
                onPress={handleRequestPermission}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Ionicons name="notifications-outline" size={20} color={currentTheme.primary} />
                <Text style={[styles.permissionButtonText, { color: currentTheme.primary }]}>
                  {t('notifications.enableNotifications')}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.permissionDenied, { backgroundColor: `${semanticColors.warning.default}12` }]}>
                <Ionicons name="warning-outline" size={20} color={semanticColors.warning.default} />
                <View style={styles.permissionDeniedText}>
                  <Text style={[styles.permissionDeniedTitle, dynamicStyles.cardTitle]}>
                    {t('notifications.permissionsRequired')}
                  </Text>
                  <TouchableOpacity onPress={() => Linking.openSettings()}>
                    <Text style={[styles.permissionDeniedLink, { color: currentTheme.primary }]}>
                      {t('notifications.openSettings')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Notification Settings (when permission granted) */}
        {hasPermission && (
          <View style={styles.settingsSection}>
            {/* Daily Reminder Toggle */}
            <View style={[styles.settingItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.settingContent}>
                <Ionicons name="alarm-outline" size={20} color={currentTheme.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, dynamicStyles.cardTitle]}>
                    {t('notifications.dailyReminder')}
                  </Text>
                  <Text style={[styles.settingDescription, dynamicStyles.cardDescription]}>
                    {t('notifications.dailyReminderDescription')}
                  </Text>
                </View>
              </View>
              <Switch
                value={isReminderEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}80` }}
                thumbColor={isReminderEnabled ? currentTheme.primary : colors.neutral.white}
                disabled={isLoading}
                accessibilityLabel={t('notifications.dailyReminder')}
              />
            </View>

            {/* Time Picker (visible when reminder enabled) */}
            {isReminderEnabled && (
              <Animated.View
                entering={effectiveAnimationsEnabled ? FadeIn.duration(200) : undefined}
                exiting={effectiveAnimationsEnabled ? FadeOut.duration(150) : undefined}
              >
                <TouchableOpacity
                  style={[styles.timePickerButton, { backgroundColor: dynamicStyles.optionBg }]}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                  accessibilityLabel={t('notifications.reminderTime')}
                  accessibilityHint={t('notifications.tapToChangeTime')}
                >
                  <View style={styles.settingContent}>
                    <Ionicons name="time-outline" size={20} color={currentTheme.primary} />
                    <View style={styles.settingTextContainer}>
                      <Text style={[styles.settingTitle, dynamicStyles.cardTitle]}>
                        {t('notifications.reminderTime')}
                      </Text>
                      {formattedNextReminder && (
                        <Text style={[styles.settingDescription, dynamicStyles.cardDescription]}>
                          {formattedNextReminder}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.timeDisplay}>
                    <Text style={[styles.timeValue, { color: currentTheme.primary }]}>
                      {formattedTime}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
                  </View>
                </TouchableOpacity>

                {/* Test Notification Button */}
                <TouchableOpacity
                  style={[styles.testButton, { backgroundColor: `${currentTheme.primary}10` }]}
                  onPress={handleTestNotification}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Ionicons name="paper-plane-outline" size={18} color={currentTheme.primary} />
                  <Text style={[styles.testButtonText, { color: currentTheme.primary }]}>
                    {t('notifications.sendTestNotification')}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Section Divider */}
            <View style={[styles.sectionDivider, { backgroundColor: dynamicStyles.optionBorder }]} />

            {/* Streak Alert Toggle */}
            <View style={[styles.settingItem, { backgroundColor: dynamicStyles.optionBg }]}>
              <View style={styles.settingContent}>
                <Ionicons name="flame-outline" size={20} color={featureColorPalettes.streak.base} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, dynamicStyles.cardTitle]}>
                    {t('notifications.streakAlert')}
                  </Text>
                  <Text style={[styles.settingDescription, dynamicStyles.cardDescription]}>
                    {t('notifications.streakAlertDescription')}
                  </Text>
                </View>
              </View>
              <Switch
                value={isStreakAlertEnabled}
                onValueChange={handleStreakAlertToggle}
                trackColor={{ false: colors.neutral.gray[300], true: `${featureColorPalettes.streak.base}80` }}
                thumbColor={isStreakAlertEnabled ? featureColorPalettes.streak.base : colors.neutral.white}
                disabled={isLoading}
                accessibilityLabel={t('notifications.streakAlert')}
              />
            </View>

            {/* Streak Alert Time Picker (visible when streak alert enabled) */}
            {isStreakAlertEnabled && (
              <Animated.View
                entering={effectiveAnimationsEnabled ? FadeIn.duration(200) : undefined}
                exiting={effectiveAnimationsEnabled ? FadeOut.duration(150) : undefined}
              >
                <TouchableOpacity
                  style={[styles.timePickerButton, { backgroundColor: dynamicStyles.optionBg }]}
                  onPress={() => setShowStreakTimePicker(true)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                  accessibilityLabel={t('notifications.streakAlertTime')}
                  accessibilityHint={t('notifications.tapToChangeTime')}
                >
                  <View style={styles.settingContent}>
                    <Ionicons name="time-outline" size={20} color={featureColorPalettes.streak.base} />
                    <View style={styles.settingTextContainer}>
                      <Text style={[styles.settingTitle, dynamicStyles.cardTitle]}>
                        {t('notifications.streakAlertTime')}
                      </Text>
                      {formattedNextStreakAlert && (
                        <Text style={[styles.settingDescription, dynamicStyles.cardDescription]}>
                          {formattedNextStreakAlert}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.timeDisplay}>
                    <Text style={[styles.timeValue, { color: featureColorPalettes.streak.base }]}>
                      {formattedStreakAlertTime}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}

        {/* Privacy Note */}
        <Text style={[styles.privacyNote, dynamicStyles.cardDescription]}>
          {t('notifications.privacyNote')}
        </Text>
      </GradientCard>

      {/* Time Picker Modal - Daily Reminder */}
      <ScheduleReminderModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSave={handleTimeSave}
        initialTime={settings.dailyReminder.time}
      />

      {/* Time Picker Modal - Streak Alert */}
      <ScheduleReminderModal
        visible={showStreakTimePicker}
        onClose={() => setShowStreakTimePicker(false)}
        onSave={handleStreakTimeSave}
        initialTime={settings.streakAlert.time}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    // Styling handled by GradientCard
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  // Permission section
  permissionSection: {
    marginTop: theme.spacing.lg,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  permissionButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  permissionDenied: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  permissionDeniedText: {
    flex: 1,
  },
  permissionDeniedTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  permissionDeniedLink: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  // Settings section
  settingsSection: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionDivider: {
    height: 1,
    marginVertical: theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  // Time picker button
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  timeValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
  },
  // Test button
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  testButtonText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '500',
  },
  // Privacy note
  privacyNote: {
    fontSize: theme.typography.fontSizes.xs,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
});

export default NotificationSettingsCard;
