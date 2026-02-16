/**
 * CelebrationScreen Component - Premium Edition
 *
 * Beautiful post-meditation celebration with:
 * - Reanimated smooth animations
 * - Confetti effect for achievements
 * - Streak celebration
 * - Personalized theme integration
 * - Subtle, elegant feedback
 */

import { logger } from '../utils/logger';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
  ZoomIn,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { celebrationAnimation, celebrationHeaderAnimation } from '../utils/animations';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from './GradientBackground';
import { GradientCard } from './GradientCard';
import { MoodIcon, getMoodColors } from './MoodIcon';
import { ConfettiOverlay } from './ConfettiOverlay';
import { api, Quote } from '../services/api';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { AnimatedPressable } from './AnimatedPressable';
import { StreakBadge } from './StreakBadge';
import { getProgressStats, getTotalStreak, ProgressStats } from '../services/progressTracker';

interface CelebrationScreenProps {
  durationMinutes: number;
  sessionTitle: string;
  userIntention?: string;
  onContinue: (mood?: MoodRating, notes?: string) => void;
  isDark?: boolean;
}

type MoodRating = 1 | 2 | 3 | 4 | 5;

// Celebration checkmark with glow effect - memoized for performance
const CelebrationCheckmark = React.memo<{
  gradient: string[];
  animationsEnabled: boolean;
}>(({ gradient, animationsEnabled }) => {
  const scale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 150,
    });
    if (animationsEnabled) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animationsEnabled]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: 1.3 }],
  }));

  return (
    <Animated.View style={[styles.checkmarkWrapper, containerStyle]}>
      {animationsEnabled && (
        <Animated.View style={[styles.checkmarkGlow, glowStyle, { backgroundColor: gradient[0] }]} />
      )}
      <LinearGradient
        colors={gradient as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.checkmarkCircle}
      >
        <Ionicons name="checkmark" size={44} color="#FFF" />
      </LinearGradient>
    </Animated.View>
  );
});

// Animated mood button with MoodIcon - memoized for performance (5 instances rendered)
const MoodButton = React.memo<{
  mood: MoodRating;
  label: string;
  isSelected: boolean;
  gradient: string[];
  onSelect: (mood: MoodRating) => void;
  dynamicStyles: Record<string, unknown>;
  animationsEnabled: boolean;
}>(({ mood, label, isSelected, gradient, onSelect, dynamicStyles, animationsEnabled }) => {
  const scale = useSharedValue(1);
  const moodColors = getMoodColors(mood);

  const handlePress = useCallback(() => {
    if (animationsEnabled) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    }
    onSelect(mood);
  }, [mood, onSelect, animationsEnabled]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      style={styles.moodOption}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      accessibilityHint={isSelected ? undefined : `Select ${label} mood`}
    >
      <Animated.View style={buttonStyle}>
        {isSelected ? (
          <LinearGradient
            colors={gradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.moodCircle, styles.moodCircleGradient]}
          >
            <MoodIcon mood={mood} size="large" showBackground={false} />
          </LinearGradient>
        ) : (
          <View style={[styles.moodCircle, dynamicStyles.moodCircle, { backgroundColor: moodColors.bg }]}>
            <MoodIcon mood={mood} size="large" showBackground={false} />
          </View>
        )}
      </Animated.View>
      <Text
        style={[
          styles.moodLabel,
          dynamicStyles.moodLabel,
          isSelected && [styles.moodLabelSelected, dynamicStyles.moodLabelSelected],
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
});

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  durationMinutes,
  sessionTitle,
  userIntention,
  onContinue,
  isDark = false,
}) => {
  const { t, i18n } = useTranslation();
  const { currentTheme, settings } = usePersonalization();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [totalStreak, setTotalStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  // Confetti colors based on theme
  const confettiColors = useMemo(() => [
    currentTheme.primary,
    currentTheme.gradient[0],
    currentTheme.gradient[1],
    '#FFD700', // Gold
    '#FF6B6B', // Coral
    '#4ECDC4', // Teal
  ], [currentTheme]);

  // Dynamic styles
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    cardTitle: { color: colors.text.primary },
    cardDescription: { color: colors.text.secondary },
    cardShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    statValue: { color: colors.text.primary },
    statLabel: { color: colors.text.secondary },
    moodCircle: {
      backgroundColor: isDark ? 'rgba(80, 80, 90, 0.6)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? 'rgba(120, 120, 130, 0.8)' : `${currentTheme.primary}30`,
    },
    moodLabel: { color: colors.text.secondary },
    moodLabelSelected: { color: currentTheme.primary },
    inputBg: isDark ? colors.neutral.charcoal[200] : 'rgba(255, 255, 255, 0.9)',
    inputBorder: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}20`,
    inputText: { color: colors.text.primary },
    inputPlaceholder: isDark ? colors.neutral.gray[500] : theme.colors.neutral.gray[400],
    quoteText: { color: colors.text.primary },
    quoteAuthor: { color: colors.text.secondary },
    iconBoxBg: isDark ? `${currentTheme.primary}40` : `${currentTheme.primary}20`,
    iconColor: currentTheme.primary,
    quoteBorder: currentTheme.primary,
  }), [colors, isDark, currentTheme]);

  useEffect(() => {
    loadQuote();
    loadStats();

    // Haptic feedback on celebration start
    if (settings.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Hide confetti after 4 seconds
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const randomQuote = await api.quotes.getRandom();
      setQuote(randomQuote);
    } catch (error) {
      logger.error('Failed to load quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [progressStats, streakData] = await Promise.all([
        getProgressStats(),
        getTotalStreak(),
      ]);
      setStats(progressStats);
      setTotalStreak(streakData.total);
    } catch (error) {
      logger.error('Failed to load stats:', error);
    }
  };

  const handleMoodSelect = useCallback((mood: MoodRating) => {
    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedMood(mood);
  }, [settings.hapticEnabled]);

  const handleContinue = useCallback(() => {
    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onContinue(selectedMood || undefined, notes || undefined);
  }, [selectedMood, notes, onContinue, settings.hapticEnabled]);

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      {/* Confetti overlay - uses reusable ConfettiOverlay component */}
      <ConfettiOverlay
        visible={showConfetti}
        colors={confettiColors}
        particleCount={30}
        duration={3000}
        onComplete={() => setShowConfetti(false)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with celebration */}
          <Animated.View
            entering={settings.animationsEnabled ? celebrationHeaderAnimation(0) : undefined}
            style={styles.header}
          >
            <CelebrationCheckmark
              gradient={[...currentTheme.gradient]}
              animationsEnabled={settings.animationsEnabled}
            />
            <Text style={[styles.title, dynamicStyles.title]}>
              {t('meditation.wellDone', 'Well done!')}
            </Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              {t('meditation.completedSession', 'You completed a meditation session')}
            </Text>

            {/* Streak badge if applicable */}
            {totalStreak > 0 && (
              <Animated.View
                entering={settings.animationsEnabled ? ZoomIn.delay(600).duration(400) : undefined}
                style={styles.streakContainer}
              >
                <StreakBadge
                  streak={totalStreak}
                  isDark={isDark}
                  size="lg"
                  showLabel={true}
                />
              </Animated.View>
            )}
          </Animated.View>

          {/* Session Stats Card */}
          <Animated.View
            entering={settings.animationsEnabled ? celebrationAnimation(1) : undefined}
          >
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.card, dynamicStyles.cardShadow]}
              isDark={isDark}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                  <Ionicons name="stats-chart" size={24} color={dynamicStyles.iconColor} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                    {t('meditation.sessionDetails', 'Session details')}
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, dynamicStyles.statValue]}>
                        {sessionTitle}
                      </Text>
                      <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                        {t('meditation.session', 'Session')}
                      </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: `${currentTheme.primary}20` }]} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, dynamicStyles.statValue]}>
                        {t('meditation.minutes', { count: durationMinutes })}
                      </Text>
                      <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
                        {t('meditation.duration', 'Duration')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </GradientCard>
          </Animated.View>

          {/* User Intention Card */}
          {userIntention && userIntention.trim() && (
            <Animated.View
              entering={settings.animationsEnabled ? celebrationAnimation(2) : undefined}
            >
              <GradientCard
                gradient={themeGradients.card.whiteCard}
                style={[styles.card, dynamicStyles.cardShadow]}
                isDark={isDark}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                    <Ionicons name="flag" size={24} color={dynamicStyles.iconColor} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                      {t('meditation.yourIntention', 'Your intention')}
                    </Text>
                    <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                      {t('meditation.intentionDescription', 'What you set before the session')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.intentionContent, { borderLeftColor: dynamicStyles.quoteBorder }]}>
                  <Text style={[styles.intentionText, dynamicStyles.quoteText]}>
                    "{userIntention}"
                  </Text>
                </View>
              </GradientCard>
            </Animated.View>
          )}

          {/* Mood Rating Card */}
          <Animated.View
            entering={settings.animationsEnabled ? celebrationAnimation(3) : undefined}
          >
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.card, dynamicStyles.cardShadow]}
              isDark={isDark}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                  <Ionicons name="heart" size={24} color={dynamicStyles.iconColor} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                    {t('meditation.howDoYouFeel', 'How do you feel?')}
                  </Text>
                  <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                    {t('meditation.moodDescription', 'Rate your mood after the session')}
                  </Text>
                </View>
              </View>
              <View style={styles.moodOptions}>
                {([1, 2, 3, 4, 5] as MoodRating[]).map((moodValue) => (
                  <MoodButton
                    key={moodValue}
                    mood={moodValue}
                    label={t(`profile.mood${moodValue}`)}
                    isSelected={selectedMood === moodValue}
                    gradient={[...currentTheme.gradient]}
                    onSelect={handleMoodSelect}
                    dynamicStyles={dynamicStyles}
                    animationsEnabled={settings.animationsEnabled}
                  />
                ))}
              </View>
            </GradientCard>
          </Animated.View>

          {/* Notes Card */}
          <Animated.View
            entering={settings.animationsEnabled ? celebrationAnimation(4) : undefined}
          >
            <GradientCard
              gradient={themeGradients.card.whiteCard}
              style={[styles.card, dynamicStyles.cardShadow]}
              isDark={isDark}
            >
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                  <Ionicons name="create" size={24} color={dynamicStyles.iconColor} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                    {t('meditation.sessionNotes', 'Session notes')}
                  </Text>
                  <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
                    {t('meditation.notesOptional', 'Write down your thoughts (optional)')}
                  </Text>
                </View>
              </View>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: dynamicStyles.inputBg,
                    borderColor: dynamicStyles.inputBorder,
                    color: dynamicStyles.inputText.color,
                  },
                ]}
                placeholder={t('meditation.notesPlaceholder', 'How do you feel? What are your thoughts?')}
                placeholderTextColor={dynamicStyles.inputPlaceholder}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
            </GradientCard>
          </Animated.View>

          {/* Inspirational Quote Card */}
          {!loading && quote && quote.text && (
            <Animated.View
              entering={settings.animationsEnabled ? celebrationAnimation(5) : undefined}
            >
              <GradientCard
                gradient={themeGradients.card.whiteCard}
                style={[styles.card, dynamicStyles.cardShadow]}
                isDark={isDark}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: dynamicStyles.iconBoxBg }]}>
                    <Ionicons name="sparkles" size={24} color={dynamicStyles.iconColor} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                      {t('meditation.inspiration', 'Inspiration')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.quoteContent, { borderLeftColor: dynamicStyles.quoteBorder }]}>
                  <Text style={[styles.quoteText, dynamicStyles.quoteText]}>
                    "{quote.text}"
                  </Text>
                  {quote.author && (
                    <Text style={[styles.quoteAuthor, dynamicStyles.quoteAuthor]}>
                      — {quote.author}
                    </Text>
                  )}
                </View>
              </GradientCard>
            </Animated.View>
          )}

          {/* Continue Button */}
          <Animated.View
            entering={settings.animationsEnabled ? celebrationAnimation(6) : undefined}
            style={styles.buttonContainer}
          >
            <AnimatedPressable
              onPress={handleContinue}
              style={styles.continueButton}
              pressScale={0.96}
              hapticType="medium"
              accessibilityRole="button"
              accessibilityLabel={t('meditation.continue', 'Continue')}
              accessibilityHint={t('accessibility.continueHint', 'Returns to home screen')}
            >
              <LinearGradient
                colors={[...currentTheme.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {t('meditation.continue', 'Continue')}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  checkmarkWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  checkmarkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  streakContainer: {
    marginTop: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    // padding handled by GradientCard
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    marginHorizontal: theme.spacing.md,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  moodOption: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  moodCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  moodCircleGradient: {
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  moodLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  moodLabelSelected: {
    fontWeight: '600',
  },
  notesInput: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.md,
    fontSize: theme.typography.fontSizes.sm,
    minHeight: 100,
    marginTop: theme.spacing.md,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  quoteContent: {
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(139, 92, 246, 0.04)',
    borderRadius: 4,
  },
  quoteText: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    marginBottom: theme.spacing.sm,
  },
  quoteAuthor: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '500',
  },
  intentionContent: {
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(139, 92, 246, 0.04)',
    borderRadius: 4,
  },
  intentionText: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.3,
  },
});

export default CelebrationScreen;
