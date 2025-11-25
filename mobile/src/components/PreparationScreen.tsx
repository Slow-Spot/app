import { logger } from '../utils/logger';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from './GradientBackground';
import { GradientButton } from './GradientButton';
import { api, Quote } from '../services/api';
import theme, { gradients } from '../theme';

interface PreparationScreenProps {
  onReady: () => void;
}

export const PreparationScreen: React.FC<PreparationScreenProps> = ({ onReady }) => {
  const { t, i18n } = useTranslation();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const randomQuote = await api.quotes.getRandom(i18n.language);
      setQuote(randomQuote);
    } catch (error) {
      logger.error('Failed to load quote:', error);
      // Continue without quote
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground gradient={gradients.screen.preparation} style={styles.container}>
      <View style={styles.content}>
        {/* Breathing prompt */}
        <View style={styles.breathingSection}>
          <Text style={styles.breathingText}>
            {t('meditation.takeDeepBreath') || 'Take a deep breath'}
          </Text>
        </View>

        {/* Quote section */}
        <View style={styles.quoteSection}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.accent.lavender[500]} />
          ) : quote ? (
            <>
              <Text style={styles.quoteText}>
                "{quote.text}"
              </Text>
              {quote.author && (
                <Text style={styles.authorText}>
                  — {quote.author}
                </Text>
              )}
            </>
          ) : null}
        </View>

        {/* Ready button */}
        <GradientButton
          title={t('meditation.imReady') || "I'm Ready"}
          gradient={gradients.button.primary}
          onPress={onReady}
          size="lg"
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breathingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingText: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    color: theme.colors.neutral.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quoteSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  quoteText: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xl,
    color: theme.colors.neutral.white,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  authorText: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    color: theme.colors.neutral.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
