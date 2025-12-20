import { logger } from '../utils/logger';
/**
 * ProfileScreen - User profile with session history and statistics
 *
 * Displays comprehensive user statistics, session history, custom session management,
 * and achievements tracking with gamification elements.
 * Uses existing services for data and follows the app's design patterns.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { Badge } from '../components/Badge';
import { MoodIcon, getMoodColors } from '../components/MoodIcon';
import { ResponsiveGrid } from '../components/ResponsiveGrid';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import theme, { gradients, getThemeColors, getThemeGradients } from '../theme';
import { brandColors, primaryColor, featureColorPalettes, semanticColors } from '../theme/colors';
import {
  getProgressStats,
  getCompletedSessions,
  getSessionsInRange,
  getTotalStreak,
  ProgressStats,
  CompletedSession,
} from '../services/progressTracker';
import { getAllSessions } from '../services/customSessionStorage';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { useUserProfile } from '../contexts/UserProfileContext';

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

interface WeeklyActivityData {
  dayKey: string;
  dayLabel: string;
  sessions: number;
  minutes: number;
  date: Date;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ isDark = false, onNavigateToCustom }) => {
  const { t, i18n } = useTranslation();
  const { currentTheme } = usePersonalization();
  const { userName, setUserName, isLoading: isProfileLoading } = useUserProfile();
  const currentLocale = i18n.language;

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const nameInputRef = useRef<TextInput>(null);

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
      backgroundColor: isDark ? `${currentTheme.primary}33` : `${currentTheme.primary}1A`,
    },
    iconColor: currentTheme.primary,
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
    // Icon box backgrounds - using feature color palettes
    iconBoxBg: isDark ? `rgba(${featureColorPalettes.emerald.rgb}, 0.25)` : `rgba(${featureColorPalettes.emerald.rgb}, 0.15)`,
    iconBoxBgBlue: isDark ? `rgba(${featureColorPalettes.indigo.rgb}, 0.25)` : `rgba(${featureColorPalettes.indigo.rgb}, 0.15)`,
    iconBoxBgOrange: isDark ? `rgba(${featureColorPalettes.amber.rgb}, 0.25)` : `rgba(${featureColorPalettes.amber.rgb}, 0.15)`,
    iconBoxBgPurple: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
    // Icon colors for different sections
    iconEmerald: isDark ? featureColorPalettes.emerald.darkIcon : featureColorPalettes.emerald.lightIcon,
    iconBlue: isDark ? featureColorPalettes.indigo.darkIcon : featureColorPalettes.indigo.lightIcon,
    iconOrange: isDark ? featureColorPalettes.amber.darkIcon : featureColorPalettes.amber.lightIcon,
    iconPurple: currentTheme.primary,
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
  }), [colors, isDark, currentTheme]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
  });
  const [totalStreakData, setTotalStreakData] = useState<{ total: number; imported: number }>({ total: 0, imported: 0 });
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityData[]>([]);
  const [customSessionCount, setCustomSessionCount] = useState(0);
  const [selectedSession, setSelectedSession] = useState<CompletedSession | null>(null);
  const [visibleSessionsCount, setVisibleSessionsCount] = useState(5); // Initial limit
  const SESSIONS_PER_PAGE = 5;

  /**
   * Get day labels for weekly activity chart
   */
  const getDayLabel = useCallback((dayIndex: number): string => {
    const dayKeys = ['daySun', 'dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat'];
    return t(`profile.${dayKeys[dayIndex]}`);
  }, [t]);

  /**
   * Calculate weekly activity data
   */
  const calculateWeeklyActivity = useCallback(async (): Promise<WeeklyActivityData[]> => {
    const today = new Date();
    const weekData: WeeklyActivityData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const daySessions = await getSessionsInRange(date, endDate);
      const dayMinutes = Math.floor(
        daySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
      );

      weekData.push({
        dayKey: `day${date.getDay()}`,
        dayLabel: getDayLabel(date.getDay()),
        sessions: daySessions.length,
        minutes: dayMinutes,
        date: date,
      });
    }

    return weekData;
  }, [getDayLabel]);

  /**
   * Load all profile data
   */
  const loadProfileData = useCallback(async () => {
    try {
      const [progressStats, completedSessions, customSessions, weeklyData, streakData] = await Promise.all([
        getProgressStats(),
        getCompletedSessions(),
        getAllSessions(),
        calculateWeeklyActivity(),
        getTotalStreak(),
      ]);

      setStats(progressStats);
      setSessions(completedSessions.reverse()); // Most recent first
      setCustomSessionCount(customSessions.length);
      setWeeklyActivity(weeklyData);
      setTotalStreakData({ total: streakData.total, imported: streakData.imported });
    } catch (error) {
      logger.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [calculateWeeklyActivity]);

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
   * Start editing name
   */
  const handleStartEditName = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditedName(userName || '');
    setIsEditingName(true);
    // Focus input after state update
    setTimeout(() => nameInputRef.current?.focus(), 100);
  }, [userName]);

  /**
   * Save edited name
   */
  const handleSaveName = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    try {
      await setUserName(editedName.trim() || undefined);
      setIsEditingName(false);
    } catch (error) {
      logger.error('Failed to save name:', error);
    }
  }, [editedName, setUserName]);

  /**
   * Cancel editing name
   */
  const handleCancelEditName = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setIsEditingName(false);
    setEditedName('');
  }, []);

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
   * Note: Wrapper is handled by ResponsiveGrid for proper responsive sizing
   */
  const renderStatCard = (
    icon: keyof typeof Ionicons.glyphMap,
    value: number,
    label: string,
    suffix?: string,
    iconColor?: string,
    iconBg?: string
  ) => (
    <View style={[styles.statCardWrapperInner, dynamicStyles.statCardShadow]}>
      <GradientCard gradient={themeGradients.card.whiteCard} style={styles.statCard} isDark={isDark}>
        <View style={[styles.statIconBox, { backgroundColor: iconBg || dynamicStyles.iconBoxBg }]}>
          <Ionicons name={icon} size={22} color={iconColor || dynamicStyles.iconEmerald} />
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
        <MoodIcon mood={session.mood} size="card" />
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionTitle, dynamicStyles.sessionTitle]} numberOfLines={1}>{session.title}</Text>
          <View style={styles.sessionMeta}>
            <Text style={[styles.sessionTime, dynamicStyles.sessionTime]}>{formatSessionTime(session.date)}</Text>
            <Text style={[styles.sessionDot, dynamicStyles.sessionDot]}> • </Text>
            <Text style={[styles.sessionDuration, dynamicStyles.sessionDuration]}>{formatDuration(session.durationSeconds)}</Text>
          </View>
        </View>
        {session.intention && (
          <Ionicons
            name="flag"
            size={14}
            color={currentTheme.primary}
            style={styles.sessionIntentionBadge}
          />
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
            style={[styles.showMoreButton, { backgroundColor: isDark ? colors.background.tertiary : `${currentTheme.primary}1A` }]}
            onPress={handleShowMore}
            activeOpacity={0.7}
          >
            <Text style={[styles.showMoreText, { color: currentTheme.primary }]}>
              {t('profile.showMore') || 'Show more'} ({sessions.length - visibleSessionsCount})
            </Text>
            <Ionicons name="chevron-down" size={18} color={currentTheme.primary} />
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
        <Ionicons name="leaf-outline" size={48} color={dynamicStyles.iconEmerald} />
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
          <ActivityIndicator size="large" color={currentTheme.primary} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ResponsiveContainer scrollable scrollViewProps={{
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={currentTheme.primary}
          />
        )
      }} contentContainerStyle={styles.scrollContent}>

        {/* Header with editable name */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleStartEditName}
            activeOpacity={0.8}
            style={styles.avatarContainer}
          >
            <Ionicons
              name="person-circle"
              size={64}
              color={currentTheme.primary}
              style={styles.avatar}
            />
            <View style={[styles.editBadge, { backgroundColor: currentTheme.primary }]}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {isEditingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                ref={nameInputRef}
                style={[
                  styles.nameInput,
                  {
                    color: colors.text.primary,
                    backgroundColor: isDark ? colors.background.secondary : '#F5F5F7',
                    borderColor: currentTheme.primary,
                  },
                ]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder={t('profile.enterYourName')}
                placeholderTextColor={colors.text.tertiary}
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
                autoCapitalize="words"
              />
              <View style={styles.nameEditButtons}>
                <TouchableOpacity
                  style={[styles.nameEditButton, styles.cancelButton, { backgroundColor: isDark ? colors.background.tertiary : '#E5E5E7' }]}
                  onPress={handleCancelEditName}
                >
                  <Ionicons name="close" size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.nameEditButton, styles.saveButton, { backgroundColor: currentTheme.primary }]}
                  onPress={handleSaveName}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={handleStartEditName} style={styles.nameDisplayContainer}>
              {userName ? (
                <Text style={[styles.userName, dynamicStyles.title]}>{userName}</Text>
              ) : (
                <Text style={[styles.addNameHint, { color: colors.text.tertiary }]}>
                  {t('profile.tapToAddName')}
                </Text>
              )}
              <Text style={[styles.title, dynamicStyles.title]}>{t('profile.title')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('profile.statistics')}</Text>
          <ResponsiveGrid
            columns={{ phone: 2, tablet: 4, desktop: 4 }}
            gap={theme.spacing.md}
            equalHeight
            itemAspectRatio={1}
          >
            {renderStatCard(
              'checkmark-circle',
              stats.totalSessions,
              t('profile.totalSessions'),
              undefined,
              dynamicStyles.iconEmerald,
              dynamicStyles.iconBoxBg
            )}
            {renderStatCard(
              'time',
              stats.totalMinutes,
              t('profile.totalMinutes'),
              undefined,
              dynamicStyles.iconBlue,
              dynamicStyles.iconBoxBgBlue
            )}
            {renderStatCard(
              'flame',
              totalStreakData.total,
              t('profile.currentStreak'),
              t('profile.days'),
              dynamicStyles.iconOrange,
              dynamicStyles.iconBoxBgOrange
            )}
            {renderStatCard(
              'trophy',
              Math.max(stats.longestStreak, totalStreakData.total),
              t('profile.longestStreak'),
              t('profile.days'),
              dynamicStyles.iconPurple,
              dynamicStyles.iconBoxBgPurple
            )}
          </ResponsiveGrid>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.weeklyActivityContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('profile.weeklyActivity')}</Text>
          <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.weeklyActivityCard, dynamicStyles.cardShadow]} isDark={isDark}>
            <View style={styles.weeklyActivityHeader}>
              <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgBlue }]}>
                <Ionicons name="bar-chart" size={24} color={dynamicStyles.iconBlue} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>{t('profile.weeklyActivity')}</Text>
                <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>{t('profile.weeklyActivityDescription')}</Text>
              </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
              {weeklyActivity.map((day, index) => {
                const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 1);
                const barHeight = day.minutes > 0 ? Math.max((day.minutes / maxMinutes) * 100, 8) : 4;
                const isToday = index === weeklyActivity.length - 1;

                return (
                  <View key={day.dayKey + index} style={styles.chartBar}>
                    <View style={styles.chartBarContainer}>
                      <View
                        style={[
                          styles.chartBarFill,
                          {
                            height: `${barHeight}%`,
                            backgroundColor: day.minutes > 0
                              ? isToday
                                ? currentTheme.primary
                                : `${currentTheme.primary}99`
                              : isDark ? colors.background.tertiary : '#E5E5E7',
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.chartDayLabel, { color: isToday ? currentTheme.primary : colors.text.secondary }]}>
                      {day.dayLabel}
                    </Text>
                    {day.minutes > 0 && (
                      <Text style={[styles.chartMinuteLabel, { color: colors.text.tertiary }]}>
                        {day.minutes}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Weekly Summary */}
            <View style={[styles.weeklySummary, { borderTopColor: isDark ? colors.border.light : '#E5E5E7' }]}>
              <View style={styles.weeklySummaryItem}>
                <Text style={[styles.weeklySummaryValue, { color: colors.text.primary }]}>
                  {weeklyActivity.reduce((sum, d) => sum + d.sessions, 0)}
                </Text>
                <Text style={[styles.weeklySummaryLabel, { color: colors.text.secondary }]}>
                  {t('profile.sessions')}
                </Text>
              </View>
              <View style={[styles.weeklySummaryDivider, { backgroundColor: isDark ? colors.border.light : '#E5E5E7' }]} />
              <View style={styles.weeklySummaryItem}>
                <Text style={[styles.weeklySummaryValue, { color: colors.text.primary }]}>
                  {weeklyActivity.reduce((sum, d) => sum + d.minutes, 0)}
                </Text>
                <Text style={[styles.weeklySummaryLabel, { color: colors.text.secondary }]}>
                  {t('profile.minutes')}
                </Text>
              </View>
            </View>
          </GradientCard>
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

        {/* Custom Sessions */}
        <View style={styles.customContainer}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t('profile.customSessions')}</Text>
          <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.customCard, dynamicStyles.cardShadow]} isDark={isDark}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgBlue }]}>
                <Ionicons name="construct" size={24} color={currentTheme.primary} />
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
                style={[styles.customButton, { backgroundColor: currentTheme.primary }]}
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
      </ResponsiveContainer>

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
                    <Ionicons name="leaf" size={24} color={currentTheme.primary} />
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

              {/* Intention Card - Only show if intention was set */}
              {selectedSession.intention && (
                <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.detailCard, dynamicStyles.cardShadow]} isDark={isDark}>
                  <View style={styles.intentionCardContent}>
                    <View style={styles.cardRow}>
                      <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBgPurple }]}>
                        <Ionicons name="flag" size={24} color={dynamicStyles.iconPurple} />
                      </View>
                      <View style={styles.cardTextContainer}>
                        <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                          {t('profile.sessionIntention')}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.intentionTextContainer, {
                      borderLeftColor: currentTheme.primary,
                      backgroundColor: `${currentTheme.primary}0A`,
                    }]}>
                      <Text style={[styles.intentionText, { color: colors.text.primary }]}>
                        "{selectedSession.intention}"
                      </Text>
                    </View>
                  </View>
                </GradientCard>
              )}

              {/* Duration Card */}
              <GradientCard gradient={themeGradients.card.whiteCard} style={[styles.detailCard, dynamicStyles.cardShadow]} isDark={isDark}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                    <Ionicons name="time" size={24} color={dynamicStyles.iconEmerald} />
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
                  <View style={[styles.iconBox, { backgroundColor: getMoodColors(selectedSession.mood).bg }]}>
                    <MoodIcon mood={selectedSession.mood} size="large" showBackground={false} />
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
                      <Ionicons name="document-text" size={24} color={dynamicStyles.iconPurple} />
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
    paddingVertical: theme.layout.screenPadding,
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
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    marginBottom: theme.spacing.sm,
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  nameDisplayContainer: {
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  addNameHint: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
  },
  nameEditContainer: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  nameInput: {
    width: '80%',
    height: 48,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.fontSizes.lg,
    textAlign: 'center',
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  nameEditButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {},
  saveButton: {},
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
  // Note: statsGrid is now handled by ResponsiveGrid component
  // statCardWrapperInner - sizing handled by ResponsiveGrid, this is just for inner styling
  statCardWrapperInner: {
    flex: 1,
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
  sessionIntentionBadge: {
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
    backgroundColor: primaryColor.transparent[10],
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
    color: brandColors.purple.primary,
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
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  customButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
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
  intentionCardContent: {
    gap: theme.spacing.md,
  },
  intentionTextContainer: {
    marginTop: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderLeftWidth: 3,
    borderRadius: 4,
  },
  intentionText: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  // Weekly Activity Chart styles
  weeklyActivityContainer: {
    gap: theme.spacing.md,
  },
  weeklyActivityCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
  },
  weeklyActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: theme.spacing.xs,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBarContainer: {
    flex: 1,
    width: '70%',
    maxWidth: 32,
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  chartDayLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    marginTop: 4,
  },
  chartMinuteLabel: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.regular,
  },
  weeklySummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    gap: theme.spacing.xl,
  },
  weeklySummaryItem: {
    alignItems: 'center',
    gap: 2,
  },
  weeklySummaryValue: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  weeklySummaryLabel: {
    fontSize: theme.typography.fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weeklySummaryDivider: {
    width: 1,
    height: 32,
  },
});
