import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { screenElementAnimation } from '../utils/animations';
import { GradientBackground } from '../components/GradientBackground';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import theme, { getThemeColors, getThemeGradients, getCardStyles } from '../theme';
import { getSectionColors } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { getGreetingKey } from '../utils/greetings';

interface HomeScreenProps {
  isDark?: boolean;
  onNavigateToMeditation: () => void;
  onNavigateToQuotes: () => void;
  onNavigateToCustom?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToInstructions?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isDark = false,
  onNavigateToMeditation,
  onNavigateToQuotes,
  onNavigateToInstructions,
}) => {
  const { t } = useTranslation();

  const { currentTheme, settings } = usePersonalization();
  const { userName } = useUserProfile();

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const globalCardStyles = useMemo(() => getCardStyles(isDark), [isDark]);
  const sectionThemeColors = useMemo(() => getSectionColors(isDark), [isDark]);

  // Always use base greeting key - name is displayed separately with gradient
  const greetingKey = useMemo(() => getGreetingKey(), []);

  // Breathing animation for decorative rings
  const breatheProgress = useSharedValue(0);

  useEffect(() => {
    if (settings.animationsEnabled) {
      breatheProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      breatheProgress.value = 0;
    }
  }, [settings.animationsEnabled]);

  // Animated style for the card itself
  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breatheProgress.value, [0, 1], [1, 1.01]) }],
  }));

  // Animated styles for decorative rings
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breatheProgress.value, [0, 1], [1, 1.15]) }],
    opacity: interpolate(breatheProgress.value, [0, 1], [0.15, 0.08]),
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breatheProgress.value, [0, 1], [1, 1.25]) }],
    opacity: interpolate(breatheProgress.value, [0, 1], [0.1, 0.04]),
  }));

  const dynamicStyles = useMemo(() => ({
    // Main CTA card shadow - uses global primaryCta style with dynamic shadow color from currentTheme
    mainCardShadow: {
      ...globalCardStyles.primaryCta,
      shadowColor: currentTheme.gradient[0], // Use theme gradient color for glow effect
    },
    // Secondary card styles now come from globalCardStyles.secondary
    greetingText: { color: colors.text.primary },
    suggestionText: { color: colors.text.secondary },
  }), [colors, isDark, currentTheme, globalCardStyles]);

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <ResponsiveContainer scrollable contentContainerStyle={styles.scrollContent}>

        {/* Header - Calm/Headspace inspired minimalist greeting */}
        <Animated.View
          entering={settings.animationsEnabled ? screenElementAnimation(0) : undefined}
          style={styles.header}
        >
          <View style={styles.greetingContainer}>
            {/* Main greeting - modern split design with highlighted name */}
            {userName ? (
              <>
                <Text style={[styles.greetingTextSmall, dynamicStyles.greetingText]}>
                  {t(greetingKey, 'Hello')},
                </Text>
                <MaskedView
                  maskElement={
                    <Text style={styles.nameText}>
                      {userName}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={[...currentTheme.gradient]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.nameGradient}
                  >
                    <Text style={[styles.nameText, { opacity: 0 }]}>
                      {userName}
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </>
            ) : (
              <Text style={[styles.greetingText, dynamicStyles.greetingText]}>
                {t(greetingKey, 'Hello')}
              </Text>
            )}
          </View>

        </Animated.View>

        {/* Main CTA Card - Headspace style with decorative rings */}
        <Animated.View
          entering={settings.animationsEnabled ? screenElementAnimation(1) : undefined}
          style={styles.mainCardContainer}
        >
          {/* Decorative animated rings behind the card */}
          {settings.animationsEnabled && (
            <>
              <Animated.View
                style={[
                  styles.decorativeRing,
                  styles.ring1,
                  { borderColor: currentTheme.gradient[0] },
                  ring1Style
                ]}
              />
              <Animated.View
                style={[
                  styles.decorativeRing,
                  styles.ring2,
                  { borderColor: currentTheme.gradient[1] },
                  ring2Style
                ]}
              />
            </>
          )}

          <Animated.View style={breatheStyle}>
            <AnimatedPressable
              onPress={onNavigateToMeditation}
              style={[styles.mainCard, dynamicStyles.mainCardShadow]}
              pressScale={0.98}
              hapticType="medium"
              accessibilityLabel={t('home.meditate', 'Meditate')}
            >
              <LinearGradient
                colors={[...currentTheme.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCardGradient}
              >
                <View style={styles.mainCardContent}>
                  <View style={styles.mainCardTextSection}>
                    <Text style={styles.mainCardLabel}>
                      {t('home.readyToMeditate', 'Ready to meditate?')}
                    </Text>
                    <Text style={styles.mainCardTitle}>
                      {t('home.meditate', 'Meditate')}
                    </Text>
                    <View style={styles.mainCardCta}>
                      <Text style={styles.mainCardCtaText}>
                        {t('home.startNow', 'Start')}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.9)" />
                    </View>
                  </View>
                  <View style={styles.mainCardIconSection}>
                    {/* Decorative circles around the icon */}
                    <View style={styles.iconRingsContainer}>
                      <View style={[styles.iconRing, styles.iconRing1]} />
                      <View style={[styles.iconRing, styles.iconRing2]} />
                      <View style={styles.mainCardIconBg}>
                        <Ionicons name="leaf" size={36} color="rgba(255,255,255,0.95)" />
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>
        </Animated.View>

        {/* Section title */}
        <Animated.View
          entering={settings.animationsEnabled ? screenElementAnimation(2) : undefined}
          style={styles.sectionHeader}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            {t('home.explore', 'Explore')}
          </Text>
        </Animated.View>

        {/* Secondary Cards */}
        <Animated.View
          entering={settings.animationsEnabled ? screenElementAnimation(3) : undefined}
          style={styles.secondaryCards}
        >
          {/* Instructions Card - uses global cardStyles.secondary */}
          <AnimatedPressable
            onPress={onNavigateToInstructions || (() => {})}
            style={[styles.secondaryCard, globalCardStyles.secondary]}
            pressScale={0.98}
            hapticType="light"
            accessibilityLabel={t('home.instructions', 'Instructions')}
          >
            <View style={[styles.secondaryCardIcon, { backgroundColor: sectionThemeColors.instructions.background }]}>
              <Ionicons name="book-outline" size={22} color={sectionThemeColors.instructions.icon} />
            </View>
            <Text style={[styles.secondaryCardTitle, { color: colors.text.primary }]}>
              {t('home.instructions', 'Instructions')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
          </AnimatedPressable>

          {/* Inspirations Card - uses global cardStyles.secondary */}
          <AnimatedPressable
            onPress={onNavigateToQuotes}
            style={[styles.secondaryCard, globalCardStyles.secondary]}
            pressScale={0.98}
            hapticType="light"
            accessibilityLabel={t('home.inspirations', 'Inspirations')}
          >
            <View style={[styles.secondaryCardIcon, { backgroundColor: sectionThemeColors.inspirations.background }]}>
              <Ionicons name="sparkles-outline" size={22} color={sectionThemeColors.inspirations.icon} />
            </View>
            <Text style={[styles.secondaryCardTitle, { color: colors.text.primary }]}>
              {t('home.inspirations', 'Inspirations')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
          </AnimatedPressable>
        </Animated.View>
      </ResponsiveContainer>
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
    // Horizontal padding handled by ResponsiveContainer
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },

  // Header - Modern minimalist style
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    letterSpacing: -1,
    lineHeight: theme.typography.fontSizes.hero * 1.1,
  },
  greetingTextSmall: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.light,
    letterSpacing: -0.5,
    lineHeight: theme.typography.fontSizes.xxl * 1.2,
    marginBottom: theme.spacing.xs,
  },
  nameText: {
    fontSize: theme.typography.fontSizes.hero * 1.15,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: -1.5,
    lineHeight: theme.typography.fontSizes.hero * 1.3,
  },
  nameGradient: {
    flexDirection: 'row',
  },

  // Main Card - Headspace inspired with decorative elements
  mainCardContainer: {
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  // Decorative animated rings behind the card
  decorativeRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 28,
  },
  ring1: {
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
  },
  ring2: {
    top: -16,
    left: -16,
    right: -16,
    bottom: -16,
  },
  mainCard: {
    // borderRadius, overflow, and shadows come from globalCardStyles.primaryCta via dynamicStyles.mainCardShadow
  },
  mainCardGradient: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainCardTextSection: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  mainCardLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing.xs,
  },
  mainCardTitle: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.md,
  },
  mainCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  mainCardCtaText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  mainCardIconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Icon rings container for layered effect
  iconRingsContainer: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconRing1: {
    width: 88,
    height: 88,
  },
  iconRing2: {
    width: 100,
    height: 100,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  mainCardIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Secondary Cards
  secondaryCards: {
    gap: theme.spacing.md,
  },
  secondaryCard: {
    // backgroundColor, borderRadius, and shadows come from globalCardStyles.secondary
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  secondaryCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCardTitle: {
    flex: 1,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
