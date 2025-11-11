import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { QuoteCard } from '../components/QuoteCard';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote } from '../services/quoteHistory';
import { getProgressStats, ProgressStats } from '../services/progressTracker';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    <ScrollView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.content}>
        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {t('app.name')}
          </Text>
          <Text style={[styles.tagline, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
            {t('app.tagline')}
          </Text>
        </View>

        {/* Progress Stats */}
        {stats && stats.totalSessions > 0 && (
          <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.cardTitle, isDark ? styles.darkText : styles.lightText]}>
              {t('home.progress') || 'Your Progress'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.currentStreak}</Text>
                <Text style={[styles.statLabel, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                  🔥 {t('home.dayStreak') || 'day streak'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalMinutes}</Text>
                <Text style={[styles.statLabel, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                  ⏱️ {t('home.totalMinutes') || 'total min'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
                <Text style={[styles.statLabel, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                  ✅ {t('home.sessions') || 'sessions'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Daily Quote */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            {t('home.dailyQuote')}
          </Text>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={isDark ? '#0A84FF' : '#007AFF'} />
            </View>
          ) : dailyQuote ? (
            <QuoteCard quote={dailyQuote} />
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, isDark ? styles.darkPrimaryButton : styles.lightPrimaryButton]}
            onPress={onNavigateToMeditation}
          >
            <Text style={styles.primaryButtonText}>
              {t('home.startMeditation')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, isDark ? styles.darkSecondaryButton : styles.lightSecondaryButton]}
            onPress={onNavigateToQuotes}
          >
            <Text style={[styles.secondaryButtonText, isDark ? styles.darkText : styles.lightText]}>
              {t('home.exploreSessions')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightBg: {
    backgroundColor: '#FFFFFF',
  },
  darkBg: {
    backgroundColor: '#1A1A1A',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  welcomeContainer: {
    paddingTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '300',
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightPlaceholder: {
    color: '#8E8E93',
  },
  darkPlaceholder: {
    color: '#8E8E93',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  lightCard: {
    backgroundColor: '#F2F2F7',
  },
  darkCard: {
    backgroundColor: '#2C2C2E',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
  loader: {
    padding: 32,
    alignItems: 'center',
  },
  actions: {
    gap: 16,
    marginTop: 16,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lightPrimaryButton: {
    backgroundColor: '#007AFF',
  },
  darkPrimaryButton: {
    backgroundColor: '#0A84FF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  lightSecondaryButton: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E5E5',
  },
  darkSecondaryButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
