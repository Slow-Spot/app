import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
  onNavigateToCustom?: () => void;
  onNavigateToProfile?: () => void; // New: Navigate to profile
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToMeditation,
  onNavigateToQuotes,
  onNavigateToCustom,
  onNavigateToProfile,
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

        {/* Daily Quote Section - Now at the top! */}
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

        {/* Feature Tiles - Now in the middle! */}
        <View style={styles.tilesContainer}>
          <Text style={styles.sectionTitle}>
            {t('home.exploreFeatures') || 'Odkryj Funkcje'}
          </Text>

          {onNavigateToCustom && (
            <FeatureTile
              title={t('home.customSessions') || 'Własne Sesje'}
              description={t('home.customSessionsDesc') || 'Stwórz spersonalizowane sesje medytacji'}
              icon="create-outline"
              gradient={gradients.card.purpleCard}
              onPress={onNavigateToCustom}
              style={styles.tile}
            />
          )}

          <FeatureTile
            title={t('home.sessionCatalog') || 'Katalog Sesji'}
            description={t('home.sessionCatalogDesc') || 'Przeglądaj naszą kolekcję prowadzonych medytacji'}
            icon="library-outline"
            gradient={gradients.card.blueCard}
            onPress={onNavigateToMeditation}
            style={styles.tile}
          />
        </View>

        {/* Compact Progress Bar - Now at the bottom! */}
        {stats && stats.totalSessions > 0 && onNavigateToProfile && (
          <TouchableOpacity
            style={styles.compactStatsBar}
            onPress={onNavigateToProfile}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(99, 102, 241, 0.15)', 'rgba(168, 85, 247, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statsBarGradient}
            >
              <View style={styles.statsBarContent}>
                <Text style={styles.statsBarTitle}>
                  {t('home.progress') || 'Twój Postęp'}
                </Text>
                <View style={styles.statsBarRow}>
                  <View style={styles.compactStat}>
                    <Ionicons name="flame" size={16} color={theme.colors.accent.mint[600]} />
                    <Text style={styles.compactStatValue}>{stats.currentStreak}</Text>
                    <Text style={styles.compactStatLabel}>
                      {t('home.dayStreak') || 'dni z rzędu'}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.compactStat}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.accent.blue[600]} />
                    <Text style={styles.compactStatValue}>{stats.totalMinutes}</Text>
                    <Text style={styles.compactStatLabel}>
                      {t('home.totalMinutes') || 'łącznie min'}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.compactStat}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.accent.purple[600]} />
                    <Text style={styles.compactStatValue}>{stats.totalSessions}</Text>
                    <Text style={styles.compactStatLabel}>
                      {t('home.sessions') || 'sesje'}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.statsBarIcon}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
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
  compactStatsBar: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  statsBarGradient: {
    padding: theme.spacing.md,
  },
  statsBarContent: {
    position: 'relative',
  },
  statsBarTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  statsBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  compactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  compactStatValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  compactStatLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.neutral.gray[300],
    opacity: 0.5,
  },
  statsBarIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
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
