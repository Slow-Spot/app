import { logger } from '../utils/logger';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import theme, { getThemeColors, getThemeGradients } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Subtle breathing animation for main button
  const breatheScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    breatheScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    tagline: { color: colors.text.secondary },
    // Main button shadow
    mainButtonShadow: isDark ? {
      shadowColor: colors.accent.mint[500],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    } : {
      shadowColor: colors.accent.mint[600],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 12,
    },
    // Secondary button shadow
    secondaryButtonShadow: isDark ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    secondaryButtonBg: isDark
      ? colors.neutral.charcoal[200]
      : colors.neutral.white,
    secondaryButtonText: { color: colors.text.primary },
    secondaryButtonSubtext: { color: colors.text.secondary },
    iconColor: isDark ? colors.accent.blue[400] : colors.accent.blue[600],
    iconColorPurple: isDark ? colors.accent.purple[400] : colors.accent.purple[600],
  }), [colors, isDark]);

  return (
    <GradientBackground gradient={themeGradients.screen.home} style={styles.container}>
      <View style={styles.content}>
        {/* Header - Centered and elegant */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleLight, dynamicStyles.title]}>Slow</Text>
            <Text style={[styles.titleBold, { color: colors.accent.mint[500] }]}>Spot</Text>
          </View>
          <Text style={[styles.tagline, dynamicStyles.tagline]}>{t('app.tagline')}</Text>
        </View>

        {/* Main CTA - MEDYTUJ */}
        <View style={styles.mainButtonContainer}>
          <Animated.View style={[styles.mainButtonWrapper, breatheStyle]}>
            <TouchableOpacity
              style={[styles.mainButton, dynamicStyles.mainButtonShadow]}
              onPress={onNavigateToMeditation}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#0D9488', '#0F766E', '#115E59']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainButtonGradient}
              >
                {/* Decorative circles */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />

                {/* Content */}
                <View style={styles.mainButtonContent}>
                  <View style={styles.mainButtonIcon}>
                    <Ionicons name="leaf" size={32} color={colors.neutral.white} />
                  </View>
                  <View style={styles.mainButtonTextContainer}>
                    <Text style={styles.mainButtonTitle}>
                      {t('home.meditate') || 'Medytuj'}
                    </Text>
                    <Text style={styles.mainButtonSubtitle}>
                      {t('home.meditateDesc') || 'Rozpocznij swoją praktykę'}
                    </Text>
                  </View>
                  <View style={styles.mainButtonArrow}>
                    <Ionicons name="arrow-forward" size={24} color="rgba(255,255,255,0.9)" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Secondary options */}
        <View style={styles.secondaryButtons}>
          {/* Instrukcje */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              dynamicStyles.secondaryButtonShadow,
              { backgroundColor: dynamicStyles.secondaryButtonBg }
            ]}
            onPress={onNavigateToInstructions}
            activeOpacity={0.8}
          >
            <View style={[styles.secondaryIcon, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)' }]}>
              <Ionicons name="book-outline" size={28} color={dynamicStyles.iconColor} />
            </View>
            <View style={styles.secondaryTextContainer}>
              <Text style={[styles.secondaryTitle, dynamicStyles.secondaryButtonText]}>
                {t('home.instructions') || 'Instrukcje'}
              </Text>
              <Text style={[styles.secondarySubtitle, dynamicStyles.secondaryButtonSubtext]}>
                {t('home.instructionsDesc') || 'Jak medytować'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Inspiracje */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              dynamicStyles.secondaryButtonShadow,
              { backgroundColor: dynamicStyles.secondaryButtonBg }
            ]}
            onPress={onNavigateToQuotes}
            activeOpacity={0.8}
          >
            <View style={[styles.secondaryIcon, { backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)' }]}>
              <Ionicons name="sparkles-outline" size={28} color={dynamicStyles.iconColorPurple} />
            </View>
            <View style={styles.secondaryTextContainer}>
              <Text style={[styles.secondaryTitle, dynamicStyles.secondaryButtonText]}>
                {t('home.inspirations') || 'Inspiracje'}
              </Text>
              <Text style={[styles.secondarySubtitle, dynamicStyles.secondaryButtonSubtext]}>
                {t('home.inspirationsDesc') || 'Cytaty i motywacja'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: theme.spacing.xs,
  },
  titleLight: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: 1,
  },
  titleBold: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '400',
    letterSpacing: 0.5,
  },

  // Main button
  mainButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
  },
  mainButtonWrapper: {
    width: '100%',
  },
  mainButton: {
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  mainButtonGradient: {
    paddingVertical: theme.spacing.xl * 1.5,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  mainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  mainButtonIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonTextContainer: {
    flex: 1,
  },
  mainButtonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.neutral.white,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mainButtonSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  mainButtonArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Secondary buttons
  secondaryButtons: {
    gap: theme.spacing.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing.md,
  },
  secondaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryTextContainer: {
    flex: 1,
  },
  secondaryTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    marginBottom: 2,
  },
  secondarySubtitle: {
    fontSize: theme.typography.fontSizes.sm,
  },
});
