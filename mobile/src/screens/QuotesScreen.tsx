import { logger } from '../utils/logger';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { QuoteCard } from '../components/QuoteCard';
import { GradientButton } from '../components/GradientButton';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote, markQuoteAsShown } from '../services/quoteHistory';
import { GradientBackground } from '../components/GradientBackground';
import theme, { gradients } from '../theme';

export const QuotesScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadQuotes();
  }, [i18n.language]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await api.quotes.getAll(i18n.language);
      setQuotes(data);
      setCurrentIndex(0);
    } catch (error) {
      logger.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRandomQuote = async () => {
    try {
      // Use unique random quote to prevent repetition
      const allQuotes = await api.quotes.getAll(i18n.language);
      if (allQuotes.length === 0) return;

      const quote = await getUniqueRandomQuote(allQuotes, i18n.language);

      // Update the current quote display
      const quoteIndex = quotes.findIndex(q => q.id === quote.id);
      if (quoteIndex >= 0) {
        setCurrentIndex(quoteIndex);
      } else {
        // Quote not in current list, reload all quotes
        setQuotes(allQuotes);
        setCurrentIndex(allQuotes.findIndex(q => q.id === quote.id));
      }
    } catch (error) {
      logger.error('Failed to load random quote:', error);
    }
  };

  const handleNext = async () => {
    const nextIndex = (currentIndex + 1) % quotes.length;
    setCurrentIndex(nextIndex);

    // Mark the new quote as shown
    if (quotes[nextIndex]) {
      await markQuoteAsShown(i18n.language, quotes[nextIndex].id);
    }
  };

  const handlePrevious = async () => {
    const prevIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    setCurrentIndex(prevIndex);

    // Mark the new quote as shown
    if (quotes[prevIndex]) {
      await markQuoteAsShown(i18n.language, quotes[prevIndex].id);
    }
  };

  return (
    <GradientBackground gradient={gradients.screen.home} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {t('quotes.title')}
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator
              size="large"
              color={isDark ? theme.colors.accent.blue[500] : theme.colors.accent.blue[600]}
            />
          </View>
        ) : quotes.length > 0 ? (
          <>
            <QuoteCard quote={quotes[currentIndex]} />

            {/* Navigation - Compact Icon Buttons */}
            <View style={styles.navigation}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  quotes.length <= 1 && styles.disabledButton
                ]}
                onPress={handlePrevious}
                disabled={quotes.length <= 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>

              <GradientButton
                title={t('quotes.random')}
                gradient={gradients.button.primary}
                onPress={loadRandomQuote}
                style={styles.randomButton}
                size="md"
              />

              <TouchableOpacity
                style={[
                  styles.iconButton,
                  quotes.length <= 1 && styles.disabledButton
                ]}
                onPress={handleNext}
                disabled={quotes.length <= 1}
              >
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : null}
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
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.primary,
    paddingTop: theme.spacing.md,
  },
  loader: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    ...theme.shadows.sm,
  },
  randomButton: {
    flex: 1,
    maxWidth: 200,
  },
  disabledButton: {
    opacity: theme.opacity.disabled,
  },
});
