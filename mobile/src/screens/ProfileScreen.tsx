import { logger } from '../utils/logger';
/**
 * ProfileScreen - User profile with session history and statistics
 *
 * Displays comprehensive user statistics, session history, custom session management,
 * and achievements tracking with gamification elements.
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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { ScheduleReminderModal } from '../components/ScheduleReminderModal';
import { Badge } from '../components/Badge';
import theme, { gradients, getThemeColors, getThemeGradients } from '../theme';
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
  isDark?: boolean;
  onNavigateToCustom?: () => void;
}

interface GroupedSessions {
  today: CompletedSession[];
  yesterday: CompletedSession[];
  thisWeek: CompletedSession[];
  earlier: CompletedSession[];
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ isDark = false, onNavigateToCustom }) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    sectionTitle: { color: colors.text.primary },
    statValue: { color: colors.text.primary },
    statSuffix: { color: colors.text.secondary },
    statLabel: { color: colors.text.secondary },
    emptyTitle: { color: colors.text.primary },
    emptyMessage: { color: colors.text.secondary },
    groupTitle: { color: colors.text.secondary },
    sessionTitle: { color: colors.text.primary },
    sessionTime: { color: colors.text.secondary },
    sessionDot: { color: colors.text.tertiary },
    sessionDuration: { color: colors.text.secondary },
    sessionTimeAgo: { color: colors.text.tertiary },
    sessionIcon: {
      backgroundColor: isDark ? colors.accent.blue[800] : colors.accent.blue[100],
    },
    iconColor: colors.accent.blue[600],
    // New consistent card styling
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    statCardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
      backgroundColor: 'transparent',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 10,
      backgroundColor: 'transparent',
    },
    iconBoxBg: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
    iconBoxBgBlue: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)',
    iconBoxBgOrange: isDark ? 'rgba(251, 146, 60, 0.25)' : 'rgba(251, 146, 60, 0.15)',
    iconBoxBgPurple: isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.15)',
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
  }), [colors, isDark]);
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
  const [selectedSession, setSelectedSession] = useState<CompletedSession | null>(null);
  const [visibleSessionsCount, setVisibleSessionsCount] = useState(5); // Initial limit
  const SESSIONS_PER_PAGE = 5;

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
      logger.error('Error loading profile data:', error);
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
      logger.error('Error requesting calendar permission:', error);
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
      logger.error('Error creating reminder:', error);
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
              logger.error('Error canceling reminder:', error);
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
   * Format session time (e.g., "14:30" or "2:30 PM")
   */
  const formatSessionTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Format duration in minutes
   */
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return t('meditation.minutes', { count: minutes }) || `${minutes} min`;
  };

  /**
   * Render a statistics card with icon box - consistent with app design
   */
  const renderStatCard = (
    icon: keyof typeof Ionicons.glyphMap,
    value: number,
    label: string,
    suffix?: string,
    iconColor?: string,
    iconBg?: string
  ) => (
    <View style={[styles.statCardWrapper, dynamicStyles.statCardShadow]}>
      <GradientCard gradient={themeGradients.card.whiteCard} style={styles.statCard} isDark={isDark}>
        <View style={[styles.statIconBox, { backgroundColor: iconBg || dynamicStyles.iconBoxBg }]}>
          <Ionicons name={icon} size={22} color={iconColor || colors.accent.mint[500]} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, dynamicStyles.statValue]}>
            {value}
            {suffix && <Text style={[styles.statSuffix, dynamicStyles.statSuffix]}> {suffix}</Text>}
          </Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{label}</Text>
        </View>
      </GradientCard>
    </View>
  );

  /**
   * Handle session item press
   */
  const handleSessionPress = (session: CompletedSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSession(session);
  };

  /**
   * Get mood emoji
   */
  const getMoodEmoji = (mood?: 1 | 2 | 3 | 4 | 5): string => {
    switch (mood) {
      case 1: return '😔';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😊';
      default: return '—';
    }
  };

  /**
   * Get mood label
   */
  const getMoodLabel = (mood?: 1 | 2 | 3 | 4 | 5): string => {
    switch (mood) {
      case 1: return t('profile.mood1') || 'Very bad';
      case 2: return t('profile.mood2') || 'Bad';
      case 3: return t('profile.mood3') || 'Neutral';
      case 4: return t('profile.mood4') || 'Good';
      case 5: return t('profile.mood5') || 'Very good';
      default: return t('profile.noMoodRecorded') || 'Not recorded';
    }
  };

  /**
   * Format full date with current locale
   */
  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Render a session item as a nice card
   */
  const renderSessionItem = (session: CompletedSession) => {
    const isCustom = typeof session.id === 'string' && session.id.startsWith('custom-');

    return (
      <TouchableOpacity
        key={`${session.id}-${session.date}`}
        style={[
          styles.sessionItemCard,
          {
            backgroundColor: isDark ? colors.background.secondary : '#FFFFFF',
            ...dynamicStyles.cardShadow,
          },
        ]}
        onPress={() => handleSessionPress(session)}
        activeOpacity={0.7}
      >
        <View style={[styles.sessionIconBox, { backgroundColor: isCustom ? dynamicStyles.iconBoxBgBlue : dynamicStyles.iconBoxBg }]}>
          <Ionicons
            name={isCustom ? 'construct' : 'leaf'}
            size={20}
            color={isCustom ? colors.accent.blue[500] : colors.accent.mint[500]}
          />
        </View>
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionTitle, dynamicStyles.sessionTitle]} numberOfLines={1}>{session.title}</Text>
          <View style={styles.sessionMeta}>
            <Text style={[styles.sessionTime, dynamicStyles.sessionTime]}>{formatSessionTime(session.date)}</Text>
            <Text style={[styles.sessionDot, dynamicStyles.sessionDot]}> • </Text>
            <Text style={[styles.sessionDuration, dynamicStyles.sessionDuration]}>{formatDuration(session.durationSeconds)}</Text>
          </View>
        </View>
        {session.mood && (
          <Text style={styles.sessionMoodBadge}>{getMoodEmoji(session.mood)}</Text>
        )}
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  };

  /**
   * Render a session group
   */
  const renderSessionGroup = (title: string, groupSessions: CompletedSession[]) => {
    if (groupSessions.length === 0) return null;

    return (
      <View style={styles.sessionGroup}>
        <Text style={[styles.groupTitle, dynamicStyles.groupTitle]}>{title}</Text>
        <View style={styles.sessionList}>
          {groupSessions.map((session) => renderSessionItem(session))}
        </View>
      </View>
    );
  };

  /**
   * Get visible sessions with limit
   */
  const getVisibleSessions = useMemo(() => {
    const allSessions = [
      ...groupedSessions.today,
      ...groupedSessions.yesterday,
      ...groupedSessions.thisWeek,
      ...groupedSessions.earlier,
    ];
    return allSessions.slice(0, visibleSessionsCount);
  }, [groupedSessions, visibleSessionsCount]);

  /**
   * Check if there are more sessions to show
   */
  const hasMoreSessions = sessions.length > visibleSessionsCount;

  /**
   * Handle show more button press
   */
  const handleShowMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisibleSessionsCount((prev) => prev + SESSIONS_PER_PAGE);
  };

  /**
   * Render sessions with pagination - simplified flat list
   */
  const renderSessionsList = () => {
    // Group visible sessions by date category
    const visibleGrouped = {
      today: getVisibleSessions.filter((s) => groupedSessions.today.includes(s)),
      yesterday: getVisibleSessions.filter((s) => groupedSessions.yesterday.includes(s)),
      thisWeek: getVisibleSessions.filter((s) => groupedSessions.thisWeek.includes(s)),
      earlier: getVisibleSessions.filter((s) => groupedSessions.earlier.includes(s)),
    };

    return (
      <>
        {renderSessionGroup(t('profile.today'), visibleGrouped.today)}
        {renderSessionGroup(t('profile.yesterday'), visibleGrouped.yesterday)}
        {renderSessionGroup(t('profile.thisWeek'), visibleGrouped.thisWeek)}
        {renderSessionGroup(t('profile.earlier'), visibleGrouped.earlier)}

        {hasMoreSessions && (
          <TouchableOpacity
            style={[styles.showMoreButton, { backgroundColor: isDark ? colors.background.tertiary : colors.accent.blue[50] }]}
            onPress={handleShowMore}
            activeOpacity={0.7}
          >
            <Text style={[styles.showMoreText, { color: colors.accent.blue[600] }]}>
              {t('profile.showMore') || 'Pokaż więcej'} ({sessions.length - visibleSessionsCount})
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.accent.blue[600]} />
          </TouchableOpacity>
        )}
      </>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
        <Ionicons name="leaf-outline" size={48} color={colors.accent.mint[500]} />
      </View>
      <Text style={[styles.emptyTitle, dynamicStyles.emptyTitle]}>{t('profile.noSessionsYet')}</Text>
      <Text style={[styles.emptyMessage, dynamicStyles.emptyMessage]}>{t('profile.startMeditating')}</Text>
    </View>
  );

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.blue[600]} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent.blue[600]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="person-circle"
            size={64}
            color={colors.accent.blue[600]}
            style={styles.avatar}
          />
          <Text style={[styles.title, dynamicStyles.title]}>{t('profile.title')}</Text>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('profile.statistics')}</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'checkmark-circle',
              stats.totalSessions,
              t('profile.totalSessions'),
              undefined,
              colors.accent.mint[500],
              dynamicStyles.iconBoxBg
            )}
            {renderStatCard(
              'time',
              stats.totalMinutes,
              t('profile.totalMinutes'),
              undefined,
              colors.accent.blue[500],
              dynamicStyles.iconBoxBgBlue
            )}
            {renderStatCard(
              'flame',
              stats.currentStreak,
              t('profile.currentStreak'),
              t('profile.days'),
              '#FB923C',
              dynamicStyles.iconBoxBgOrange
            )}
            {renderStatCard(
              'trophy',
              stats.longestStreak,
              t('profile.longestStreak'),
              t('profile.days'),
              '#A855F7',
              dynamicStyles.iconBoxBgPurple
            )}
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.historyContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('profile.recentSessions')}</Text>
          {sessions.length === 0 ? (
            <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.historyCard, dynamicStyles.cardShadow]} isDark={isDark}>
              {renderEmptyState()}
            </GradientCard>
          ) : (
            <View style={styles.sessionsListContainer}>
              {renderSessionsList()}
            </View>
          )}
        </View>

        {/* Calendar Integration */}
        <View style={styles.calendarContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('calendar.title')}</Text>
          <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.calendarCard, dynamicStyles.cardShadow]} isDark={isDark}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                <Ionicons name="calendar" size={24} color={colors.accent.mint[500]} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {t('calendar.scheduleReminder')}
                </Text>
                {reminderSettings?.enabled ? (
                  <View style={styles.reminderStatus}>
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={colors.accent.mint[500]}
                    />
                    <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                      {t('calendar.currentReminder')}: {reminderSettings.time}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                    {t('calendar.noReminder')}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.calendarActions}>
              {reminderSettings?.enabled ? (
                <>
                  <TouchableOpacity
                    style={[styles.calendarSecondaryButton, { backgroundColor: dynamicStyles.iconBoxBg }]}
                    onPress={handleCancelReminder}
                    accessibilityLabel={t('calendar.cancel')}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={colors.accent.mint[600]}
                    />
                    <Text style={[styles.calendarSecondaryButtonText, { color: colors.accent.mint[600] }]}>
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
                      size={18}
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
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.neutral.white} />
                  <Text style={styles.calendarPrimaryButtonText}>
                    {t('calendar.scheduleReminder')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </GradientCard>
        </View>

        {/* Custom Sessions */}
        <View style={styles.customContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('profile.customSessions')}</Text>
          <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.customCard, dynamicStyles.cardShadow]} isDark={isDark}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgBlue }]}>
                <Ionicons name="construct" size={24} color={colors.accent.blue[500]} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                  {customSessionCount} {t('profile.saved')}
                </Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                  {t('profile.customSessions')}
                </Text>
              </View>
            </View>
            {onNavigateToCustom && (
              <TouchableOpacity
                style={styles.customButton}
                onPress={onNavigateToCustom}
                accessibilityLabel={t('profile.manageCustomSessions')}
                accessibilityRole="button"
              >
                <Ionicons name="arrow-forward-circle-outline" size={20} color={theme.colors.neutral.white} />
                <Text style={styles.customButtonText}>
                  {t('profile.manageCustomSessions')}
                </Text>
              </TouchableOpacity>
            )}
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

      {/* Session Details Modal */}
      <Modal
        visible={selectedSession !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSession(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? colors.background.primary : '#F5F5F7' }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? colors.border.light : '#E5E5E7' }]}>
            <TouchableOpacity
              onPress={() => setSelectedSession(null)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              {t('profile.sessionDetails')}
            </Text>
            <View style={styles.modalCloseButton} />
          </View>

          {selectedSession && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Session Title Card */}
              <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.detailCard, dynamicStyles.cardShadow]} isDark={isDark}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgBlue }]}>
                    <Ionicons name="leaf" size={24} color={colors.accent.blue[500]} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.detailTitle, { color: colors.text.primary }]}>
                      {selectedSession.title}
                    </Text>
                    <Text style={[styles.detailSubtitle, { color: colors.text.secondary }]}>
                      {formatFullDate(selectedSession.date)}
                    </Text>
                  </View>
                </View>
              </GradientCard>

              {/* Duration Card */}
              <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.detailCard, dynamicStyles.cardShadow]} isDark={isDark}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                    <Ionicons name="time" size={24} color={colors.accent.mint[500]} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                      {t('profile.duration')}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                      {formatDuration(selectedSession.durationSeconds)}
                    </Text>
                  </View>
                </View>
              </GradientCard>

              {/* Mood Card */}
              <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.detailCard, dynamicStyles.cardShadow]} isDark={isDark}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgOrange }]}>
                    <Text style={styles.moodEmojiLarge}>{getMoodEmoji(selectedSession.mood)}</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                      {t('profile.moodAfterSession')}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                      {getMoodLabel(selectedSession.mood)}
                    </Text>
                  </View>
                </View>
              </GradientCard>

              {/* Notes Card */}
              <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.detailCard, dynamicStyles.cardShadow]} isDark={isDark}>
                <View style={styles.notesCardContent}>
                  <View style={styles.notesHeader}>
                    <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgPurple }]}>
                      <Ionicons name="document-text" size={24} color="#A855F7" />
                    </View>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary, marginLeft: 12 }]}>
                      {t('profile.reflections')}
                    </Text>
                  </View>
                  <Text style={[styles.notesText, { color: selectedSession.notes ? colors.text.primary : colors.text.tertiary }]}>
                    {selectedSession.notes || t('profile.noNotesRecorded')}
                  </Text>
                </View>
              </GradientCard>

              {/* Spacer for bottom */}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  statCardWrapper: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.xl,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  statContent: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    lineHeight: 40,
    textAlign: 'center',
  },
  statSuffix: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
  },
  historyContainer: {
    gap: theme.spacing.md,
  },
  historyCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.lg,
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
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionList: {
    gap: theme.spacing.sm,
  },
  sessionsListContainer: {
    gap: theme.spacing.md,
  },
  sessionItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
  },
  sessionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionMoodBadge: {
    fontSize: 20,
    marginRight: theme.spacing.xs,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
  },
  showMoreText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
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
    borderRadius: 12,
    backgroundColor: theme.colors.accent.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
    gap: 2,
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
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },
  // New consistent card styles
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
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
    gap: 2,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  customContainer: {
    gap: theme.spacing.md,
  },
  customCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing.md,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.accent.blue[500],
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
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
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing.md,
  },
  reminderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  calendarActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  calendarPrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.accent.mint[500],
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
    borderRadius: theme.borderRadius.lg,
  },
  calendarSecondaryButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  sessionMood: {
    fontSize: theme.typography.fontSizes.sm,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  detailCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
  },
  detailTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  detailSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: theme.typography.fontSizes.sm,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  moodEmojiLarge: {
    fontSize: 24,
  },
  notesCardContent: {
    gap: theme.spacing.md,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesText: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 24,
    fontStyle: 'normal',
  },
});
