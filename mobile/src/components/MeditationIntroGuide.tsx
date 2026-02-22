/**
 * Meditation Introduction Guide
 * A professional, educational slideshow for meditation beginners
 * Clean UX with swipeable slides - no complex checklists
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import type {
  NativeSyntheticEvent,
  NativeScrollEvent} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { GradientBackground } from './GradientBackground';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { brandColors, neutralColors } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ══════════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════════

interface SlideContent {
  id: string;
  icon: string;
  iconType: 'ionicons' | 'fontawesome';
}

interface MeditationIntroGuideProps {
  onClose: () => void;
  onStartMeditation?: () => void;
  isDark?: boolean;
}

// ══════════════════════════════════════════════════════════════
// Utility: Get proper timezone-based greeting
// ══════════════════════════════════════════════════════════════

const getTimeBasedGreeting = (t: TFunction): { greeting: string; context: string } => {
  const now = new Date();
  const hour = now.getHours();
  const _timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get localized time string for context
  const _timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (hour >= 5 && hour < 12) {
    return {
      greeting: t('introGuide.greetings.morning', 'Good morning'),
      context: t('introGuide.greetings.morningContext', 'Great time for morning meditation'),
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: t('introGuide.greetings.afternoon', 'Good afternoon'),
      context: t('introGuide.greetings.afternoonContext', 'Time for a moment of calm'),
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: t('introGuide.greetings.evening', 'Good evening'),
      context: t('introGuide.greetings.eveningContext', 'Perfect time to relax'),
    };
  } else {
    return {
      greeting: t('introGuide.greetings.night', 'Good night'),
      context: t('introGuide.greetings.nightContext', 'Prepare for peaceful sleep'),
    };
  }
};

// ══════════════════════════════════════════════════════════════
// Slide definitions
// ══════════════════════════════════════════════════════════════

const SLIDES: SlideContent[] = [
  { id: 'welcome', icon: 'sparkles', iconType: 'ionicons' },
  { id: 'whatIs', icon: 'leaf', iconType: 'ionicons' },
  { id: 'benefits', icon: 'heart', iconType: 'ionicons' },
  { id: 'howTo', icon: 'body', iconType: 'ionicons' },
  { id: 'ready', icon: 'rocket', iconType: 'ionicons' },
];

// ══════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════

export const MeditationIntroGuide: React.FC<MeditationIntroGuideProps> = ({
  onClose,
  onStartMeditation,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const { currentTheme } = usePersonalization();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Theme colors
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Get time-based greeting
  const { greeting, context } = useMemo(() => getTimeBasedGreeting(t), [t]);

  // Handle scroll
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  // Navigate to slide
  const goToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  // Navigate next/prev
  const goNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  // Dynamic styles
  const dynamicStyles = useMemo(() => ({
    headerTitle: { color: colors.text.primary },
    slideTitle: { color: colors.text.primary },
    slideText: { color: colors.text.secondary },
    dotActive: { backgroundColor: currentTheme.primary },
    dotInactive: { backgroundColor: isDark ? colors.neutral.charcoal[50] : colors.neutral.gray[300] },
    closeButton: { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
    cardBg: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    iconBoxBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}26`,
  }), [colors, isDark, currentTheme]);

  // Render slide content
  const renderSlide = useCallback(({ item, index: _index }: { item: SlideContent; index: number }) => {
    const isWelcome = item.id === 'welcome';
    const isReady = item.id === 'ready';

    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <View style={styles.slideContent}>
          {/* Icon */}
          <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
            {item.iconType === 'ionicons' ? (
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={48} color={currentTheme.primary} />
            ) : (
              <FontAwesome5 name={item.icon} size={40} color={currentTheme.primary} solid />
            )}
          </View>

          {/* Title */}
          <Text style={[styles.slideTitle, dynamicStyles.slideTitle]}>
            {isWelcome
              ? greeting
              : t(`introGuide.slides.${item.id}.title`)}
          </Text>

          {/* Subtitle/Context for welcome */}
          {isWelcome && (
            <Text style={[styles.slideSubtitle, { color: currentTheme.primary }]}>
              {context}
            </Text>
          )}

          {/* Main text */}
          <Text style={[styles.slideText, dynamicStyles.slideText]}>
            {t(`introGuide.slides.${item.id}.text`)}
          </Text>

          {/* Bullet points for specific slides */}
          {(item.id === 'benefits' || item.id === 'howTo') && (
            <View style={styles.bulletContainer}>
              {[1, 2, 3].map((num) => {
                const bulletText = t(`introGuide.slides.${item.id}.bullets.${num}`, { defaultValue: '' });
                if (!bulletText) return null;
                return (
                  <View key={num} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: currentTheme.primary }]} />
                    <Text style={[styles.bulletText, dynamicStyles.slideText]}>{bulletText}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* CTA for last slide */}
          {isReady && onStartMeditation && (
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onStartMeditation}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[...currentTheme.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <Ionicons name="play-circle" size={24} color={neutralColors.white} />
                <Text style={styles.ctaText}>
                  {t('introGuide.startMeditation', 'Start Meditation')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }, [greeting, context, t, dynamicStyles, onStartMeditation]);

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      {/* Fixed Header with Close Button */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
            {t('introGuide.title', 'Introduction to Meditation')}
          </Text>
          <Text style={[styles.headerSubtitle, dynamicStyles.slideText]}>
            {t('introGuide.subtitle', 'Learn the basics of mindfulness')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.closeButton, dynamicStyles.closeButton]}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 16 }]}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                index === currentIndex ? dynamicStyles.dotActive : dynamicStyles.dotInactive,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonSecondary]}
              onPress={goPrev}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text.secondary} />
              <Text style={[styles.navButtonText, { color: colors.text.secondary }]}>
                {t('common.back', 'Back')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}

          {currentIndex < SLIDES.length - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={goNext}
            >
              <LinearGradient
                colors={[brandColors.purple.light, brandColors.purple.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.navButtonGradient}
              >
                <Text style={styles.navButtonTextPrimary}>
                  {t('common.next', 'Next')}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={neutralColors.white} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonSecondary]}
              onPress={onClose}
            >
              <Text style={[styles.navButtonText, { color: colors.text.secondary }]}>
                {t('common.close', 'Close')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </GradientBackground>
  );
};

// ══════════════════════════════════════════════════════════════
// Styles
// ══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.xxs,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContent: {
    flexGrow: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  slideTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  slideSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  slideText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  bulletContainer: {
    marginTop: theme.spacing.lg,
    alignSelf: 'stretch',
    paddingHorizontal: theme.spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: theme.spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 24,
    textAlign: 'left',
  },
  ctaButton: {
    marginTop: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 280,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  ctaText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: neutralColors.white,
  },
  bottomNav: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  navButtonSecondary: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  navButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
  navButtonTextPrimary: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: neutralColors.white,
  },
  navButtonPlaceholder: {
    width: 100,
  },
});

export default MeditationIntroGuide;
