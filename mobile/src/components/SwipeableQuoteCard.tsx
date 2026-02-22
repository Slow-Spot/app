import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import type { Quote } from '../services/api';
import theme, { getThemeColors, getCardStyles } from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_ANGLE = 15;

interface SwipeableQuoteCardProps {
  quote: Quote;
  isDark?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  isTopCard?: boolean;
  cardIndex?: number;
}

export const SwipeableQuoteCard: React.FC<SwipeableQuoteCardProps> = ({
  quote,
  isDark = false,
  onSwipeLeft,
  onSwipeRight,
  isTopCard = true,
  cardIndex = 0,
}) => {
  const { i18n } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const globalCardStyles = useMemo(() => getCardStyles(isDark), [isDark]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(isTopCard ? 1 : 0.95 - cardIndex * 0.03);
  const cardOpacity = useSharedValue(isTopCard ? 1 : 0.7 - cardIndex * 0.15);

  // Update scale and opacity when isTopCard changes
  useEffect(() => {
    if (settings.animationsEnabled) {
      cardScale.value = withSpring(isTopCard ? 1 : 0.95 - cardIndex * 0.03, {
        damping: 15,
        stiffness: 150,
      });
      cardOpacity.value = withTiming(isTopCard ? 1 : 0.7 - cardIndex * 0.15, {
        duration: 200,
      });
    } else {
      cardScale.value = isTopCard ? 1 : 0.95 - cardIndex * 0.03;
      cardOpacity.value = isTopCard ? 1 : 0.7 - cardIndex * 0.15;
    }
  }, [isTopCard, cardIndex, settings.animationsEnabled]);

  const userLanguage = i18n.language;
  const isOriginalLanguage = quote.originalLanguage === userLanguage;
  const translation = quote.translations?.[userLanguage] ?? quote.translations?.['en'] ?? quote.text;
  const showOriginal = !isOriginalLanguage && quote.originalLanguage !== 'en';

  const triggerHaptic = (type: 'light' | 'medium') => {
    if (settings.hapticEnabled) {
      Haptics.impactAsync(
        type === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
      );
    }
  };

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    triggerHaptic('medium');
    if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft();
    } else if (direction === 'right' && onSwipeRight) {
      onSwipeRight();
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(isTopCard)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3; // Reduce vertical movement
    })
    .onEnd((_event) => {
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;

      if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)('right');
        });
        translateY.value = withTiming(0, { duration: 300 });
      } else if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)('left');
        });
        translateY.value = withTiming(0, { duration: 300 });
      } else {
        // Spring back to center
        translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: cardScale.value },
      ],
      opacity: cardOpacity.value,
    };
  });

  // Swipe indicators opacity
  const leftIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const rightIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const dynamicStyles = useMemo(() => ({
    // Card shadow styles from global theme with dynamic background
    cardShadow: {
      ...globalCardStyles.secondary,
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    cardInner: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden' as const,
    },
    text: { color: isDark ? colors.neutral.white : colors.text.primary },
    secondaryText: { color: colors.text.secondary },
    divider: { backgroundColor: isDark ? '#3A3A3C' : '#E5E5E5' },
    badge: { backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[100] },
  }), [colors, isDark, globalCardStyles]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={settings.animationsEnabled && isTopCard ? FadeIn.duration(400) : undefined}
        style={[
          styles.cardContainer,
          cardAnimatedStyle,
          { zIndex: 10 - cardIndex },
        ]}
      >
        {/* Shadow wrapper - needs overflow:visible for shadows */}
        <View style={[styles.cardShadow, dynamicStyles.cardShadow]}>
          {/* Content wrapper - needs overflow:hidden for border radius */}
          <View style={dynamicStyles.cardInner}>
          {/* Swipe Indicators */}
          {isTopCard && (
            <>
              <Animated.View style={[styles.swipeIndicator, styles.leftIndicator, leftIndicatorStyle]}>
                <Ionicons name="chevron-back-circle" size={32} color={currentTheme.primary} />
              </Animated.View>
              <Animated.View style={[styles.swipeIndicator, styles.rightIndicator, rightIndicatorStyle]}>
                <Ionicons name="chevron-forward-circle" size={32} color={currentTheme.primary} />
              </Animated.View>
            </>
          )}

          {/* Decorative accent line */}
          <View style={[styles.accentLine, { backgroundColor: currentTheme.primary }]} />

          {/* Card Content */}
          <View style={styles.content}>
            {/* Original text in original script (if different language) */}
            {showOriginal && (
              <>
                <Text style={[styles.originalText, dynamicStyles.text]}>
                  "{quote.text}"
                </Text>

                {/* Transliteration (romanization) */}
                {quote.textTransliteration && (
                  <Text style={[styles.transliterationText, dynamicStyles.secondaryText]}>
                    {quote.textTransliteration}
                  </Text>
                )}

                {/* Divider */}
                <View style={[styles.divider, dynamicStyles.divider]} />
              </>
            )}

            {/* Quote icon */}
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={currentTheme.primary}
              style={styles.quoteIcon}
            />

            {/* Translation or main text */}
            <Text style={[styles.quoteText, dynamicStyles.text]}>
              "{translation}"
            </Text>

            {quote.author && (
              <Text style={[styles.authorText, dynamicStyles.secondaryText]}>
                — {quote.author}
              </Text>
            )}
          </View>

          {/* Card Footer */}
          {(quote.category || quote.cultureTag) && (
            <View style={styles.footer}>
              {quote.category && (
                <View style={[styles.badge, dynamicStyles.badge]}>
                  <Text style={[styles.badgeText, dynamicStyles.text]}>
                    {quote.category}
                  </Text>
                </View>
              )}
              {quote.cultureTag && (
                <View style={[styles.badge, dynamicStyles.badge]}>
                  <Text style={[styles.badgeText, dynamicStyles.text]}>
                    {quote.cultureTag}
                  </Text>
                </View>
              )}
            </View>
          )}

          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - theme.layout.screenPadding * 2,
    alignSelf: 'center',
  },
  // Shadow wrapper - shadows and borderRadius come from globalCardStyles.secondary via dynamicStyles.cardShadow
  // overflow: 'visible' is required to show shadows outside card bounds
  cardShadow: {
    borderRadius: theme.borderRadius.xl,
  },
  accentLine: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  quoteIcon: {
    marginBottom: theme.spacing.xs,
    opacity: 0.6,
  },
  originalText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
  },
  transliterationText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -8,
  },
  divider: {
    width: 60,
    height: 1,
    marginVertical: theme.spacing.sm,
  },
  quoteText: {
    fontSize: 22,
    fontWeight: theme.typography.fontWeights.light,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 0.3,
  },
  authorText: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    textTransform: 'capitalize',
  },
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    zIndex: 10,
  },
  leftIndicator: {
    left: theme.spacing.md,
  },
  rightIndicator: {
    right: theme.spacing.md,
  },
});
