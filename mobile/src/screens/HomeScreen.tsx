import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { QuoteCard } from '../components/QuoteCard';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { GradientButton } from '../components/GradientButton';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote } from '../services/quoteHistory';
import { getProgressStats, ProgressStats } from '../services/progressTracker';
import theme, { gradients } from '../theme';

interface HomeScreenProps {
  onNavigateToMeditation: () => void;
  onNavigateToQuotes: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToMeditation,
  onNavigateToQuotes,
}) => {
  const { t, i18n } = useTranslation();
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    loadDailyQuote();
    loadProgress();
  }, [i18n.language]);

  const loadProgress = async () => {
    try {
      const progressStats = await getProgressStats();
      setStats(progressStats);
    } catch (error) {
      console.error('Failed to load progress stats:', error);
    }
  };

  const loadDailyQuote = async () => {
    try {
      setLoading(true);
      // Use unique random quote to prevent repetition
      const allQuotes = await api.quotes.getAll(i18n.language);
      if (allQuotes.length > 0) {
        const quote = await getUniqueRandomQuote(allQuotes, i18n.language);
        setDailyQuote(quote);
      }
    } catch (error) {
      console.error('Failed to load daily quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground gradient={gradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('app.name')}</Text>
          <Text style={styles.tagline}>{t('app.tagline')}</Text>
        </View>

        {/* Progress Stats */}
        {stats && stats.totalSessions > 0 && (
          <GradientCard
            gradient={gradients.card.lightCard}
            style={styles.progressCard}
          >
            <Text style={styles.progressTitle}>
              {t('home.progress') || 'Your Progress'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons
                  name="flame"
                  size={32}
                  color={theme.colors.semantic.warning.default}
                  style={styles.statIcon}
                />
                <Text style={styles.statValue}>{stats.currentStreak}</Text>
                <Text style={styles.statLabel}>
                  {t('home.dayStreak') || 'day streak'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name="time-outline"
                  size={32}
                  color={theme.colors.accent.blue[500]}
                  style={styles.statIcon}
                />
                <Text style={styles.statValue}>{stats.totalMinutes}</Text>
                <Text style={styles.statLabel}>
                  {t('home.totalMinutes') || 'total min'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={32}
                  color={theme.colors.semantic.success.default}
                  style={styles.statIcon}
                />
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>
                  {t('home.sessions') || 'sessions'}
                </Text>
              </View>
            </View>
          </GradientCard>
        )}

        {/* Daily Quote Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.dailyQuote')}</Text>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={theme.colors.accent.blue[500]} />
            </View>
          ) : dailyQuote ? (
            <QuoteCard quote={dailyQuote} />
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <GradientButton
            title={t('home.startMeditation')}
            gradient={gradients.button.primary}
            onPress={onNavigateToMeditation}
            size="lg"
          />
          <GradientButton
            title={t('home.exploreSessions')}
            gradient={gradients.button.secondary}
            onPress={onNavigateToQuotes}
            size="md"
          />
        </View>
      </ScrollView>
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
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.regular,
    color: theme.colors.text.secondary,
  },
  progressCard: {
    marginBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.accent.blue[600],
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  loader: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
});
