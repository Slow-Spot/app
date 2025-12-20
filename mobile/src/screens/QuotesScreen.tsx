import { logger } from '../utils/logger';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { screenElementAnimation, secondaryElementAnimation } from '../utils/animations';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeableQuoteCard } from '../components/SwipeableQuoteCard';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { api, Quote } from '../services/api';
import { getUniqueRandomQuote, markQuoteAsShown } from '../services/quoteHistory';
import { GradientBackground } from '../components/GradientBackground';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QuotesScreenProps {
  isDark?: boolean;
}

export const QuotesScreen: React.FC<QuotesScreenProps> = ({ isDark = false }) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardKey, setCardKey] = useState(0); // For re-rendering cards after swipe

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Animation for counter
  const counterScale = useSharedValue(1);

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  const animateCounter = useCallback(() => {
    if (settings.animationsEnabled) {
      counterScale.value = withSpring(1.2, { damping: 8 }, () => {
        counterScale.value = withSpring(1);
      });
    }
  }, [settings.animationsEnabled]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    counterContainer: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    counterText: { color: colors.text.secondary },
    iconButtonBg: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
    iconColor: currentTheme.primary,
  }), [colors, isDark, currentTheme]);

  useEffect(() => {
    loadQuotes();
  }, [i18n.language]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await api.quotes.getAll(i18n.language);
      // Shuffle quotes for variety
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuotes(shuffled);
      setCurrentIndex(0);
      setCardKey(prev => prev + 1);
    } catch (error) {
      logger.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = useCallback(async () => {
    if (quotes.length <= 1) return;

    const prevIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    setCurrentIndex(prevIndex);
    setCardKey(prev => prev + 1);
    animateCounter();

    // Mark the new quote as shown
    if (quotes[prevIndex]) {
      await markQuoteAsShown(i18n.language, quotes[prevIndex].id);
    }
  }, [currentIndex, quotes, i18n.language, animateCounter]);

  const handleSwipeRight = useCallback(async () => {
    if (quotes.length <= 1) return;

    const nextIndex = (currentIndex + 1) % quotes.length;
    setCurrentIndex(nextIndex);
    setCardKey(prev => prev + 1);
    animateCounter();

    // Mark the new quote as shown
    if (quotes[nextIndex]) {
      await markQuoteAsShown(i18n.language, quotes[nextIndex].id);
    }
  }, [currentIndex, quotes, i18n.language, animateCounter]);

  const loadRandomQuote = async () => {
    try {
      const allQuotes = await api.quotes.getAll(i18n.language);
      if (allQuotes.length === 0) return;

      const quote = await getUniqueRandomQuote(allQuotes, i18n.language);
      const quoteIndex = quotes.findIndex(q => q.id === quote.id);

      if (quoteIndex >= 0) {
        setCurrentIndex(quoteIndex);
      } else {
        setQuotes(allQuotes);
        setCurrentIndex(allQuotes.findIndex(q => q.id === quote.id));
      }
      setCardKey(prev => prev + 1);
      animateCounter();
    } catch (error) {
      logger.error('Failed to load random quote:', error);
    }
  };

  // Get current quote only (no stack effect to avoid text overlap)
  const currentQuote = useMemo(() => {
    if (quotes.length === 0) return null;
    return quotes[currentIndex];
  }, [quotes, currentIndex]);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
        <ResponsiveContainer style={styles.responsiveContent}>
          {/* Header */}
          <Animated.View
            entering={settings.animationsEnabled ? screenElementAnimation(0) : undefined}
            style={styles.header}
          >
          <View style={styles.headerContent}>
            <Text style={[styles.title, dynamicStyles.title]}>
              {t('quotes.title')}
            </Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              {t('quotes.subtitle', 'Inspiration for every day')}
            </Text>
          </View>

          {/* Quote counter */}
          {quotes.length > 0 && (
            <Animated.View
              entering={settings.animationsEnabled ? secondaryElementAnimation(1) : undefined}
              style={[styles.counterContainer, dynamicStyles.counterContainer, counterAnimatedStyle]}
            >
              <Text style={[styles.counterText, dynamicStyles.counterText]}>
                {currentIndex + 1} / {quotes.length}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Content */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator
              size="large"
              color={currentTheme.primary}
            />
          </View>
        ) : quotes.length > 0 ? (
          <>
            {/* Quote Card */}
            <Animated.View
              entering={settings.animationsEnabled ? screenElementAnimation(1) : undefined}
              style={styles.cardsContainer}
            >
              {currentQuote && (
                <SwipeableQuoteCard
                  key={`${cardKey}-${currentQuote.id}`}
                  quote={currentQuote}
                  isDark={isDark}
                  isTopCard={true}
                  cardIndex={0}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              )}
            </Animated.View>

            {/* Bottom controls - shuffle only */}
            <Animated.View
              entering={settings.animationsEnabled ? screenElementAnimation(2) : undefined}
              style={styles.bottomControls}
            >
              <AnimatedPressable
                onPress={loadRandomQuote}
                style={[styles.shuffleButton, { backgroundColor: dynamicStyles.iconButtonBg }]}
                pressScale={0.95}
                hapticType="light"
                accessibilityLabel={t('quotes.random')}
              >
                <Ionicons name="shuffle" size={24} color={dynamicStyles.iconColor} />
              </AnimatedPressable>
            </Animated.View>
          </>
        ) : (
          <Animated.View
            entering={settings.animationsEnabled ? screenElementAnimation(1) : undefined}
            style={styles.emptyState}
          >
            <Ionicons name="book-outline" size={64} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {t('quotes.empty', 'No quotes to display')}
            </Text>
          </Animated.View>
        )}
        </ResponsiveContainer>
      </GradientBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  responsiveContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    marginTop: theme.spacing.xs,
  },
  counterContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginLeft: theme.spacing.md,
  },
  counterText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  bottomControls: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    alignItems: 'center',
  },
  shuffleButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
});
