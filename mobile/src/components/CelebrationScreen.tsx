import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from './GradientBackground';
import { GradientButton } from './GradientButton';
import { GradientCard } from './GradientCard';
import { api, Quote } from '../services/api';
import theme, { gradients } from '../theme';

interface CelebrationScreenProps {
  durationMinutes: number;
  sessionTitle: string;
  onContinue: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  durationMinutes,
  sessionTitle,
  onContinue,
}) => {
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
      console.error('Failed to load quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground gradient={gradients.screen.celebration} style={styles.container}>
      <View style={styles.content}>
        {/* Celebration icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={80}
            color={theme.colors.accent.mint[500]}
          />
        </View>

        {/* Congratulations message */}
        <View style={styles.messageSection}>
          <Text style={styles.titleText}>
            {t('meditation.wellDone') || 'Well Done!'}
          </Text>
          <Text style={styles.subtitleText}>
            {t('meditation.completedSession') || 'You completed your meditation session'}
          </Text>
        </View>

        {/* Stats */}
        <GradientCard gradient={gradients.card.lightCard} style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>
              {t('meditation.session')}:
            </Text>
            <Text style={styles.statValue}>
              {sessionTitle}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>
              {t('meditation.duration')}:
            </Text>
            <Text style={styles.statValue}>
              {t('meditation.minutes', { count: durationMinutes })}
            </Text>
          </View>
        </GradientCard>

        {/* Quote section */}
        <View style={styles.quoteSection}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.accent.mint[500]} />
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

        {/* Continue button */}
        <GradientButton
          title={t('meditation.continue') || 'Continue'}
          gradient={gradients.button.primary}
          onPress={onContinue}
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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: theme.spacing.xl,
  },
  messageSection: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  titleText: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  subtitleText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  statsCard: {
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  quoteSection: {
    width: '100%',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.regular,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.lg,
    color: theme.colors.text.primary,
  },
  authorText: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});
