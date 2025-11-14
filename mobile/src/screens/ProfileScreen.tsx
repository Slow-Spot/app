/**
 * ProfileScreen - User profile with session history and statistics
 *
 * Displays comprehensive user statistics, session history, and custom session management.
 * Uses existing services for data and follows the app's design patterns.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { ScheduleReminderModal } from '../components/ScheduleReminderModal';
import theme, { gradients } from '../theme';
import {
  getProgressStats,
  getCompletedSessions,
  ProgressStats,
  CompletedSession,
} from '../services/progressTracker';
import { getAllCustomSessions } from '../services/customSessionStorage';
import {
  requestCalendarPermissions,
  createRecurringReminder,
  cancelRecurringReminder,
  getReminderSettings,
  ReminderSettings,
} from '../services/calendarService';

interface ProfileScreenProps {
  onNavigateToCustom?: () => void;
}

interface GroupedSessions {
  today: CompletedSession[];
  yesterday: CompletedSession[];
  thisWeek: CompletedSession[];
  earlier: CompletedSession[];
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigateToCustom }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
  });
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [customSessionCount, setCustomSessionCount] = useState(0);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);

  /**
   * Load all profile data
   */
  const loadProfileData = useCallback(async () => {
    try {
      const [progressStats, completedSessions, customSessions, reminder] = await Promise.all([
        getProgressStats(),
        getCompletedSessions(),
        getAllCustomSessions(),
        getReminderSettings(),
      ]);

      setStats(progressStats);
      setSessions(completedSessions.reverse()); // Most recent first
      setCustomSessionCount(customSessions.length);
      setReminderSettings(reminder);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Initial data load
   */
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfileData();
  }, [loadProfileData]);

  /**
   * Handle schedule reminder button press
   */
  const handleScheduleReminder = async () => {
    try {
      const hasPermission = await requestCalendarPermissions();

      if (!hasPermission) {
        Alert.alert(
          t('calendar.permissionDenied'),
          t('calendar.permissionMessage'),
          [
            { text: t('calendar.cancel'), style: 'cancel' },
            {
              text: t('settings.title'),
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      setShowReminderModal(true);
    } catch (error) {
      console.error('Error requesting calendar permission:', error);
      Alert.alert(
        t('calendar.permissionDenied'),
        t('calendar.permissionMessage')
      );
    }
  };

  /**
   * Handle saving reminder from modal
   */
  const handleSaveReminder = async (time: string) => {
    try {
      const newSettings = await createRecurringReminder(time);

      if (newSettings) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setReminderSettings(newSettings);
        setShowReminderModal(false);

        Alert.alert(
          t('calendar.reminderSet'),
          `${t('calendar.daily')} ${t('calendar.at')} ${time}`
        );
      } else {
        throw new Error('Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('calendar.permissionDenied'),
        t('calendar.permissionMessage')
      );
    }
  };

  /**
   * Handle canceling reminder
   */
  const handleCancelReminder = async () => {
    Alert.alert(
      t('calendar.reminderCanceled'),
      t('calendar.noReminder'),
      [
        { text: t('calendar.cancel'), style: 'cancel' },
        {
          text: t('calendar.reminderCanceled'),
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await cancelRecurringReminder();

              if (success) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setReminderSettings(null);
                Alert.alert(t('calendar.reminderCanceled'));
              }
            } catch (error) {
              console.error('Error canceling reminder:', error);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ]
    );
  };

  /**
   * Group sessions by date categories
   */
  const groupedSessions = useMemo((): GroupedSessions => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: GroupedSessions = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: [],
    };

    sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const sessionDay = new Date(
        sessionDate.getFullYear(),
        sessionDate.getMonth(),
        sessionDate.getDate()
      );

      if (sessionDay.getTime() === today.getTime()) {
        groups.today.push(session);
      } else if (sessionDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(session);
      } else if (sessionDay >= weekAgo) {
        groups.thisWeek.push(session);
      } else {
        groups.earlier.push(session);
      }
    });

    return groups;
  }, [sessions]);

  /**
   * Format time ago (e.g., "2 hours ago")
   */
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('profile.justNow') || 'Just now';
    if (diffMins < 60) return t('profile.minutesAgo', { count: diffMins }) || `${diffMins}m ago`;
    if (diffHours < 24) return t('profile.hoursAgo', { count: diffHours }) || `${diffHours}h ago`;
    if (diffDays === 1) return t('profile.yesterday') || 'Yesterday';
    return t('profile.daysAgo', { count: diffDays }) || `${diffDays}d ago`;
  };

  /**
   * Format session time (e.g., "2:30 PM")
   */
  const formatSessionTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Format duration in minutes
   */
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return t('meditation.minutes', { count: minutes }) || `${minutes} min`;
  };

  /**
   * Render a statistics card
   */
  const renderStatCard = (
    icon: keyof typeof Ionicons.glyphMap,
    value: number,
    label: string,
    suffix?: string
  ) => (
    <GradientCard gradient={gradients.card.lightCard} style={styles.statCard}>
      <Ionicons name={icon} size={24} color={theme.colors.accent.blue[600]} />
      <Text style={styles.statValue}>
        {value}
        {suffix && <Text style={styles.statSuffix}> {suffix}</Text>}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GradientCard>
  );

  /**
   * Render a session item
   */
  const renderSessionItem = (session: CompletedSession) => {
    const isCustom = typeof session.id === 'string' && session.id.startsWith('custom-');

    return (
      <View key={`${session.id}-${session.date}`} style={styles.sessionItem}>
        <View style={styles.sessionIcon}>
          <Ionicons
            name={isCustom ? 'construct' : 'radio-button-on'}
            size={20}
            color={theme.colors.accent.blue[600]}
          />
        </View>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <View style={styles.sessionMeta}>
            <Text style={styles.sessionTime}>{formatSessionTime(session.date)}</Text>
            <Text style={styles.sessionDot}> • </Text>
            <Text style={styles.sessionDuration}>{formatDuration(session.durationSeconds)}</Text>
            {isCustom && (
              <>
                <Text style={styles.sessionDot}> • </Text>
                <Text style={styles.sessionType}>{t('profile.custom')}</Text>
              </>
            )}
          </View>
        </View>
        <Text style={styles.sessionTimeAgo}>{formatTimeAgo(session.date)}</Text>
      </View>
    );
  };

  /**
   * Render a session group
   */
  const renderSessionGroup = (title: string, sessions: CompletedSession[]) => {
    if (sessions.length === 0) return null;

    return (
      <View style={styles.sessionGroup}>
        <Text style={styles.groupTitle}>{title}</Text>
        <View style={styles.sessionList}>
          {sessions.map((session) => renderSessionItem(session))}
        </View>
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <GradientCard gradient={gradients.card.lightCard} style={styles.emptyState}>
      <Ionicons name="leaf-outline" size={64} color={theme.colors.accent.mint[400]} />
      <Text style={styles.emptyTitle}>{t('profile.noSessionsYet')}</Text>
      <Text style={styles.emptyMessage}>{t('profile.startMeditating')}</Text>
    </GradientCard>
  );

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <GradientBackground gradient={gradients.screen.home} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent.blue[600]} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground gradient={gradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.accent.blue[600]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="person-circle"
            size={64}
            color={theme.colors.accent.blue[600]}
            style={styles.avatar}
          />
          <Text style={styles.title}>{t('profile.title')}</Text>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{t('profile.statistics')}</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'checkmark-circle',
              stats.totalSessions,
              t('profile.totalSessions')
            )}
            {renderStatCard('time', stats.totalMinutes, t('profile.totalMinutes'))}
            {renderStatCard(
              'flame',
              stats.currentStreak,
              t('profile.currentStreak'),
              t('profile.days')
            )}
            {renderStatCard(
              'trophy',
              stats.longestStreak,
              t('profile.longestStreak'),
              t('profile.days')
            )}
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>{t('profile.recentSessions')}</Text>
          <GradientCard gradient={gradients.card.lightCard} style={styles.historyCard}>
            {sessions.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {renderSessionGroup(t('profile.today'), groupedSessions.today)}
                {renderSessionGroup(t('profile.yesterday'), groupedSessions.yesterday)}
                {renderSessionGroup(t('profile.thisWeek'), groupedSessions.thisWeek)}
                {renderSessionGroup(t('profile.earlier'), groupedSessions.earlier)}
              </>
            )}
          </GradientCard>
        </View>

        {/* Calendar Integration */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>{t('calendar.title')}</Text>
          <GradientCard gradient={gradients.card.mintCard} style={styles.calendarCard}>
            <View style={styles.calendarContent}>
              <View style={styles.calendarHeader}>
                <View style={styles.calendarIcon}>
                  <Ionicons name="calendar" size={32} color={theme.colors.accent.mint[700]} />
                </View>
                <View style={styles.calendarInfo}>
                  <Text style={styles.calendarTitle}>
                    {t('calendar.scheduleReminder')}
                  </Text>
                  {reminderSettings?.enabled ? (
                    <View style={styles.reminderStatus}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.colors.accent.mint[700]}
                      />
                      <Text style={styles.reminderStatusText}>
                        {t('calendar.currentReminder')}: {reminderSettings.time}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.calendarDescription}>
                      {t('calendar.noReminder')}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.calendarActions}>
                {reminderSettings?.enabled ? (
                  <>
                    <TouchableOpacity
                      style={styles.calendarSecondaryButton}
                      onPress={handleCancelReminder}
                      accessibilityLabel={t('calendar.cancel')}
                      accessibilityRole="button"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={theme.colors.accent.mint[700]}
                      />
                      <Text style={styles.calendarSecondaryButtonText}>
                        {t('calendar.cancel')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.calendarPrimaryButton}
                      onPress={handleScheduleReminder}
                      accessibilityLabel={t('calendar.selectTime')}
                      accessibilityRole="button"
                    >
                      <Ionicons
                        name="time"
                        size={20}
                        color={theme.colors.neutral.white}
                      />
                      <Text style={styles.calendarPrimaryButtonText}>
                        {t('calendar.selectTime')}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.calendarPrimaryButton, styles.calendarPrimaryButtonFull]}
                    onPress={handleScheduleReminder}
                    accessibilityLabel={t('calendar.scheduleReminder')}
                    accessibilityRole="button"
                  >
                    <Ionicons name="add-circle" size={20} color={theme.colors.neutral.white} />
                    <Text style={styles.calendarPrimaryButtonText}>
                      {t('calendar.scheduleReminder')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Custom Sessions */}
        <View style={styles.customContainer}>
          <Text style={styles.sectionTitle}>{t('profile.customSessions')}</Text>
          <GradientCard gradient={gradients.card.blueCard} style={styles.customCard}>
            <View style={styles.customContent}>
              <View style={styles.customInfo}>
                <Ionicons name="construct" size={32} color={theme.colors.neutral.white} />
                <View style={styles.customText}>
                  <Text style={styles.customCount}>
                    {customSessionCount} {t('profile.saved')}
                  </Text>
                  <Text style={styles.customLabel}>{t('profile.customSessions')}</Text>
                </View>
              </View>
              {onNavigateToCustom && (
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={onNavigateToCustom}
                  accessibilityLabel={t('profile.manageCustomSessions')}
                  accessibilityRole="button"
                >
                  <Text style={styles.customButtonText}>
                    {t('profile.manageCustomSessions')}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={theme.colors.neutral.white} />
                </TouchableOpacity>
              )}
            </View>
          </GradientCard>
        </View>
      </ScrollView>

      {/* Schedule Reminder Modal */}
      <ScheduleReminderModal
        visible={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSave={handleSaveReminder}
        initialTime={reminderSettings?.time}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.layout.screenPadding,
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  avatar: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.primary,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    gap: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  statSuffix: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.regular,
    color: theme.colors.text.secondary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  historyContainer: {
    gap: theme.spacing.md,
  },
  historyCard: {
    padding: theme.spacing.lg,
  },
  emptyState: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  sessionGroup: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionList: {
    gap: theme.spacing.md,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.accent.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  sessionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTime: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  sessionDot: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },
  sessionDuration: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  sessionType: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.accent.blue[600],
    fontWeight: theme.typography.fontWeights.medium,
  },
  sessionTimeAgo: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },
  customContainer: {
    gap: theme.spacing.md,
  },
  customCard: {
    padding: theme.spacing.lg,
  },
  customContent: {
    gap: theme.spacing.lg,
  },
  customInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  customText: {
    flex: 1,
  },
  customCount: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.white,
  },
  customLabel: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.white,
    opacity: 0.9,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.lg,
  },
  customButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
  },
  calendarContainer: {
    gap: theme.spacing.md,
  },
  calendarCard: {
    padding: theme.spacing.lg,
  },
  calendarContent: {
    gap: theme.spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  calendarIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.accent.mint[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  calendarTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.accent.mint[700],
  },
  calendarDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  reminderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  reminderStatusText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.accent.mint[700],
  },
  calendarActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  calendarPrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.accent.mint[600],
    borderRadius: theme.borderRadius.lg,
  },
  calendarPrimaryButtonFull: {
    flex: 0,
    width: '100%',
  },
  calendarPrimaryButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
  },
  calendarSecondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.accent.mint[100],
    borderRadius: theme.borderRadius.lg,
  },
  calendarSecondaryButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.accent.mint[700],
  },
});
