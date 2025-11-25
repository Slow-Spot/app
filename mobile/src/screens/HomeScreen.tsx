import { logger } from '../utils/logger';
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
      logger.error('Failed to load progress stats:', error);
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
      logger.error('Failed to load daily quote:', error);
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

        {/* Daily Quote Teaser - Links to Quotes tab! */}
        {!loading && dailyQuote && (
          <TouchableOpacity
            style={styles.quoteTeaser}
            onPress={onNavigateToQuotes}
            activeOpacity={0.8}
          >
            <View style={styles.quoteTeaserCard}>
              <View style={styles.quoteTeaserHeader}>
                <Ionicons name="chatbox-ellipses" size={24} color={theme.colors.accent.purple[600]} />
                <Text style={styles.quoteTeaserTitle}>
                  {t('home.dailyQuote') || 'Dzienny Cytat'}
                </Text>
              </View>
              <Text style={styles.quoteTeaserText} numberOfLines={2}>
                "{dailyQuote.text}"
              </Text>
              <View style={styles.quoteTeaserFooter}>
                <Text style={styles.quoteTeaserAuthor}>— {dailyQuote.author}</Text>
                <View style={styles.quoteTeaserCTA}>
                  <Text style={styles.quoteTeaserCTAText}>Odkryj więcej</Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.accent.purple[600]} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* MEGA Quick Start Button! */}
        <TouchableOpacity
          style={styles.quickStartButton}
          onPress={onNavigateToMeditation}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={gradients.button.primary.colors}
            start={gradients.button.primary.start}
            end={gradients.button.primary.end}
            style={styles.quickStartGradient}
          >
            <View style={styles.quickStartContent}>
              <Ionicons name="play-circle" size={32} color={theme.colors.neutral.white} />
              <View style={styles.quickStartText}>
                <Text style={styles.quickStartTitle}>
                  {t('home.quickStart') || 'Szybki Start'}
                </Text>
                <Text style={styles.quickStartDesc}>
                  {t('home.quickStartDesc') || 'Rozpocznij 5-minutową medytację teraz'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.neutral.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Feature Tiles - Now in the middle! */}
        <View style={styles.tilesContainer}>
          <Text style={styles.sectionTitle}>
            {t('home.exploreFeatures') || 'Odkryj Funkcje'}
          </Text>

          {onNavigateToCustom && (
            <FeatureTile
              title={t('home.customSessions') || 'Własne Sesje ✨'}
              description={t('home.customSessionsDesc') || 'Skomponuj swoją idealną medytację w 3 krokach'}
              icon="create-outline"
              gradient={gradients.card.purpleCard}
              onPress={onNavigateToCustom}
              style={styles.tile}
            />
          )}

          <FeatureTile
            title={t('home.sessionCatalog') || 'Katalog Sesji 🧘‍♀️'}
            description={t('home.sessionCatalogDesc') || '350+ medytacji dla każdego nastroju i chwili'}
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
  quoteTeaser: {
    marginBottom: theme.spacing.md,
  },
  quoteTeaserCard: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    ...theme.shadows.sm,
  },
  quoteTeaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  quoteTeaserTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  quoteTeaserText: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.sm,
  },
  quoteTeaserFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteTeaserAuthor: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  quoteTeaserCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  quoteTeaserCTAText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.accent.purple[600],
  },
  quickStartButton: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  quickStartGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  quickStartText: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.xxs,
  },
  quickStartDesc: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.white,
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
