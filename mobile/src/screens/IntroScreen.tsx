import { logger } from '../utils/logger';
/**
 * IntroScreen - Beautiful onboarding experience
 *
 * Shows only on first app launch.
 * 3 slides presenting main app features.
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import theme, { gradients } from '../theme';

const { width, height } = Dimensions.get('window');

const INTRO_COMPLETED_KEY = '@slow_spot_intro_completed';

interface Slide {
  key: string;
  titleKey: string;
  textKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: { colors: string[]; start: { x: number; y: number }; end: { x: number; y: number } };
}

const slides: Slide[] = [
  {
    key: '1',
    titleKey: 'onboarding.slide1.title',
    textKey: 'onboarding.slide1.text',
    icon: 'flower-outline',
    gradient: {
      colors: [theme.colors.accent.blue[500], theme.colors.accent.purple[500]],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  {
    key: '2',
    titleKey: 'onboarding.slide2.title',
    textKey: 'onboarding.slide2.text',
    icon: 'construct-outline',
    gradient: {
      colors: [theme.colors.accent.rose[400], theme.colors.accent.rose[600]],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  {
    key: '3',
    titleKey: 'onboarding.slide3.title',
    textKey: 'onboarding.slide3.text',
    icon: 'trending-up-outline',
    gradient: {
      colors: [theme.colors.accent.teal[400], theme.colors.accent.mint[400]],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
];

interface IntroScreenProps {
  onDone: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onDone }) => {
  const { t } = useTranslation();
  const sliderRef = useRef<any>(null);

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem(INTRO_COMPLETED_KEY, 'true');
      onDone();
    } catch (error) {
      logger.error('Error saving intro completion:', error);
      onDone(); // Proceed anyway
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <LinearGradient
      colors={item.gradient.colors}
      start={item.gradient.start}
      end={item.gradient.end}
      style={styles.slide}
    >
      <StatusBar barStyle="light-content" />

      {/* Icon Container */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={item.icon}
            size={80}
            color={theme.colors.neutral.white}
          />
        </View>

        {/* Decorative stars */}
        <View style={[styles.star, styles.star1]}>
          <Ionicons name="star" size={16} color="rgba(255, 255, 255, 0.6)" />
        </View>
        <View style={[styles.star, styles.star2]}>
          <Ionicons name="star" size={12} color="rgba(255, 255, 255, 0.4)" />
        </View>
        <View style={[styles.star, styles.star3]}>
          <Ionicons name="star" size={20} color="rgba(255, 255, 255, 0.5)" />
        </View>
        <View style={[styles.star, styles.star4]}>
          <Ionicons name="star" size={10} color="rgba(255, 255, 255, 0.3)" />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{t(item.titleKey)}</Text>
        <Text style={styles.text}>{t(item.textKey)}</Text>
      </View>
    </LinearGradient>
  );

  const renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="arrow-forward"
        color={theme.colors.neutral.white}
        size={24}
      />
    </View>
  );

  const renderDoneButton = () => (
    <View style={[styles.buttonCircle, styles.doneButton]}>
      <Ionicons
        name="checkmark"
        color={theme.colors.neutral.white}
        size={24}
      />
    </View>
  );

  const renderPrevButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="arrow-back"
        color={theme.colors.neutral.white}
        size={24}
      />
    </View>
  );

  return (
    <AppIntroSlider
      ref={sliderRef}
      data={slides}
      renderItem={renderSlide}
      onDone={handleDone}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      renderPrevButton={renderPrevButton}
      showPrevButton
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    />
  );
};

// Helper function to check if intro has been completed
export const hasCompletedIntro = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(INTRO_COMPLETED_KEY);
    return value === 'true';
  } catch (error) {
    logger.error('Error checking intro completion:', error);
    return false;
  }
};

// Helper function to reset intro (for testing)
export const resetIntro = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(INTRO_COMPLETED_KEY);
  } catch (error) {
    logger.error('Error resetting intro:', error);
  }
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    width: width * 0.7,
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.xl,
  },
  star: {
    position: 'absolute',
  },
  star1: {
    top: '10%',
    left: '15%',
  },
  star2: {
    top: '25%',
    right: '10%',
  },
  star3: {
    bottom: '20%',
    left: '5%',
  },
  star4: {
    bottom: '30%',
    right: '20%',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: -0.5,
  },
  text: {
    fontSize: theme.typography.fontSizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: theme.typography.fontSizes.lg * 1.6,
    paddingHorizontal: theme.spacing.sm,
  },
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.neutral.white,
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
