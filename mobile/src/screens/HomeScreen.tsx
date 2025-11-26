import { logger } from '../utils/logger';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 12,
    } : {
      shadowColor: colors.accent.mint[600],
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 32,
      elevation: 16,
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
          <Text style={[styles.title, dynamicStyles.title]}>{t('app.name')}</Text>
          <Text style={[styles.tagline, dynamicStyles.tagline]}>{t('app.tagline')}</Text>
        </View>

        {/* Main CTA - MEDYTUJ */}
        <View style={styles.mainButtonContainer}>
          {/* Glow effect behind button */}
          <Animated.View style={[styles.mainButtonGlow, glowStyle, { backgroundColor: isDark ? colors.accent.mint[500] : colors.accent.mint[400] }]} />

          <Animated.View style={[breatheStyle]}>
            <TouchableOpacity
              style={[styles.mainButton, dynamicStyles.mainButtonShadow]}
              onPress={onNavigateToMeditation}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[colors.accent.mint[500], colors.accent.mint[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainButtonGradient}
              >
                <View style={styles.mainButtonIcon}>
                  <Ionicons name="leaf" size={48} color={colors.neutral.white} />
                </View>
                <Text style={styles.mainButtonTitle}>
                  {t('home.meditate') || 'Medytuj'}
                </Text>
                <Text style={styles.mainButtonSubtitle}>
                  {t('home.meditateDesc') || 'Rozpocznij swoją praktykę'}
                </Text>
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
  title: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '400',
    letterSpacing: 0.5,
  },

  // Main button
  mainButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: theme.spacing.xl,
  },
  mainButtonGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: SCREEN_WIDTH * 0.35,
    transform: [{ scale: 1.2 }],
  },
  mainButton: {
    borderRadius: SCREEN_WIDTH * 0.35,
    overflow: 'hidden',
  },
  mainButtonGradient: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: SCREEN_WIDTH * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  mainButtonIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  mainButtonTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.neutral.white,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  mainButtonSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.white,
    opacity: 0.9,
    textAlign: 'center',
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
