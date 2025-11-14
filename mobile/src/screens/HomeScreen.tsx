import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { QuoteCard } from '../components/QuoteCard';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import { FeatureTile } from '../components/FeatureTile';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote } from '../services/quoteHistory';
import { getProgressStats, ProgressStats } from '../services/progressTracker';
import theme, { gradients } from '../theme';

interface HomeScreenProps {
  onNavigateToMeditation: () => void;
  onNavigateToQuotes: () => void;
  onNavigateToCustom?: () => void; // New: Navigate to custom session builder
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToMeditation,
  onNavigateToQuotes,
  onNavigateToCustom,
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
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>
              {t('home.progress') || 'Your Progress'}
            </Text>
            <View style={styles.statsRow}>
              {/* Streak Stat */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={gradients.session.streak.colors}
                  start={gradients.session.streak.start}
                  end={gradients.session.streak.end}
                  style={styles.statGradient}
                >
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name="flame"
                      size={24}
                      color={theme.colors.neutral.white}
                    />
                  </View>
                  <Text style={styles.statValue}>{stats.currentStreak}</Text>
                  <Text style={styles.statLabel}>
                    {t('home.dayStreak') || 'day streak'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Time Stat */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={gradients.session.duration.colors}
                  start={gradients.session.duration.start}
                  end={gradients.session.duration.end}
                  style={styles.statGradient}
                >
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={theme.colors.neutral.white}
                    />
                  </View>
                  <Text style={styles.statValue}>{stats.totalMinutes}</Text>
                  <Text style={styles.statLabel}>
                    {t('home.totalMinutes') || 'total min'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Sessions Stat */}
              <View style={styles.statCard}>
                <LinearGradient
                  colors={gradients.session.completions.colors}
                  start={gradients.session.completions.start}
                  end={gradients.session.completions.end}
                  style={styles.statGradient}
                >
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color={theme.colors.neutral.white}
                    />
                  </View>
                  <Text style={styles.statValue}>{stats.totalSessions}</Text>
                  <Text style={styles.statLabel}>
                    {t('home.sessions') || 'sessions'}
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>
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

        {/* Feature Tiles */}
        <View style={styles.tilesContainer}>
          <Text style={styles.sectionTitle}>
            {t('home.exploreFeatures') || 'Explore Features'}
          </Text>

          {onNavigateToCustom && (
            <FeatureTile
              title={t('home.customSessions') || 'Custom Sessions'}
              description={t('home.customSessionsDesc') || 'Create your own personalized meditation sessions'}
              icon="create-outline"
              gradient={gradients.card.purpleCard}
              onPress={onNavigateToCustom}
              style={styles.tile}
            />
          )}

          <FeatureTile
            title={t('home.sessionCatalog') || 'Session Catalog'}
            description={t('home.sessionCatalogDesc') || 'Browse our curated collection of guided meditations'}
            icon="library-outline"
            gradient={gradients.card.blueCard}
            onPress={onNavigateToMeditation}
            style={styles.tile}
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
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  tagline: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.regular,
    color: theme.colors.text.secondary,
  },
  progressSection: {
    marginBottom: theme.spacing.lg,
  },
  progressTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  statGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.xxs,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  loader: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  tilesContainer: {
    marginTop: theme.spacing.sm,
  },
  tile: {
    marginBottom: theme.spacing.sm,
  },
});
