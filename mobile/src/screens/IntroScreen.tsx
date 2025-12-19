/**
 * IntroScreen - Premium onboarding experience
 *
 * Beautiful animated 3-slide onboarding with:
 * - Reanimated smooth transitions
 * - Personalized gradient themes
 * - Subtle, non-jarring animations
 * - Modern minimalist design inspired by Headspace/Calm
 */

import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  ViewToken,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInUp,
  FadeInDown,
  SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import theme from '../theme';
import { brandColors } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { logger } from '../utils/logger';
import { saveImportedStreak } from '../services/progressTracker';

const { width, height } = Dimensions.get('window');

const INTRO_COMPLETED_KEY = '@slow_spot_intro_completed';

interface Slide {
  key: string;
  titleKey: string;
  subtitleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentIcon?: keyof typeof Ionicons.glyphMap;
  isNameSlide?: boolean;
  isStreakImportSlide?: boolean;
}

const slides: Slide[] = [
  {
    key: '1',
    titleKey: 'onboarding.slide1.title',
    subtitleKey: 'onboarding.slide1.subtitle',
    icon: 'leaf',
    accentIcon: 'sparkles',
  },
  {
    key: '2',
    titleKey: 'onboarding.slide2.title',
    subtitleKey: 'onboarding.slide2.subtitle',
    icon: 'timer-outline',
    accentIcon: 'flash',
  },
  {
    key: '3',
    titleKey: 'onboarding.slide3.title',
    subtitleKey: 'onboarding.slide3.subtitle',
    icon: 'heart',
    accentIcon: 'trending-up',
  },
  {
    key: '4',
    titleKey: 'onboarding.slide4.title',
    subtitleKey: 'onboarding.slide4.subtitle',
    icon: 'person',
    accentIcon: 'chatbubble-ellipses',
    isNameSlide: true,
  },
  {
    key: '5',
    titleKey: 'onboarding.slide5.title',
    subtitleKey: 'onboarding.slide5.subtitle',
    icon: 'flame',
    accentIcon: 'arrow-up',
    isStreakImportSlide: true,
  },
];

interface IntroScreenProps {
  onDone: () => void;
}

// Animated floating particle
const FloatingParticle: React.FC<{
  delay: number;
  size: number;
  left: number;
  top: number;
  animationsEnabled: boolean;
}> = ({ delay, size, left, top, animationsEnabled }) => {
  const opacity = useSharedValue(0.3);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (animationsEnabled) {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
    }
  }, [animationsEnabled]);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: `${left}%`,
          top: `${top}%`,
        },
        particleStyle,
      ]}
    />
  );
};

// Animated icon with pulse effect
const AnimatedIcon: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  accentIcon?: keyof typeof Ionicons.glyphMap;
  primaryColor: string;
  animationsEnabled: boolean;
}> = ({ icon, accentIcon, primaryColor, animationsEnabled }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (animationsEnabled) {
      // Subtle breathing effect
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animationsEnabled]);

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.iconWrapper, iconContainerStyle]}>
      {/* Outer glow ring */}
      <View style={[styles.iconGlow, { backgroundColor: `${primaryColor}20` }]} />
      <View style={[styles.iconGlowInner, { backgroundColor: `${primaryColor}30` }]} />

      {/* Main icon container */}
      <LinearGradient
        colors={[`${primaryColor}40`, `${primaryColor}20`]}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={64} color={primaryColor} />
      </LinearGradient>

      {/* Accent icon */}
      {accentIcon && (
        <Animated.View
          entering={FadeIn.delay(500).duration(400)}
          style={[styles.accentIconContainer, { backgroundColor: primaryColor }]}
        >
          <Ionicons name={accentIcon} size={20} color="#FFF" />
        </Animated.View>
      )}
    </Animated.View>
  );
};

// Single slide component
const OnboardingSlide: React.FC<{
  item: Slide;
  index: number;
  scrollX: SharedValue<number>;
  primaryColor: string;
  animationsEnabled: boolean;
  nameInputValue?: string;
  onNameChange?: (name: string) => void;
  showDisclaimer?: boolean;
  streakDaysValue?: string;
  onStreakDaysChange?: (days: string) => void;
  streakSourceValue?: string;
  onStreakSourceChange?: (source: string) => void;
}> = ({ item, index, scrollX, primaryColor, animationsEnabled, nameInputValue, onNameChange, showDisclaimer, streakDaysValue, onStreakDaysChange, streakSourceValue, onStreakSourceChange }) => {
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [30, 0, 30],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    return animationsEnabled ? {
      opacity,
      transform: [{ translateY }, { scale }],
    } : {
      opacity: 1,
      transform: [{ translateY: 0 }, { scale: 1 }],
    };
  });

  return (
    <View style={styles.slide}>
      <StatusBar barStyle="dark-content" />

      {/* Floating particles - only show if animations enabled */}
      {animationsEnabled && (
        <>
          <FloatingParticle delay={0} size={8} left={15} top={20} animationsEnabled={animationsEnabled} />
          <FloatingParticle delay={500} size={6} left={80} top={15} animationsEnabled={animationsEnabled} />
          <FloatingParticle delay={1000} size={10} left={70} top={35} animationsEnabled={animationsEnabled} />
          <FloatingParticle delay={1500} size={5} left={25} top={40} animationsEnabled={animationsEnabled} />
        </>
      )}

      <Animated.View style={[styles.slideContent, animatedStyle]}>
        {/* Icon */}
        <AnimatedIcon
          icon={item.icon}
          accentIcon={item.accentIcon}
          primaryColor={primaryColor}
          animationsEnabled={animationsEnabled}
        />

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: primaryColor }]}>
            {t(item.titleKey)}
          </Text>
          <Text style={styles.subtitle}>
            {t(item.subtitleKey)}
          </Text>
        </View>

        {/* Health disclaimer on first slide */}
        {showDisclaimer && (
          <View style={styles.disclaimerContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
            <Text style={styles.disclaimerText}>
              {t('onboarding.healthDisclaimer', 'This app supports mindfulness practice and is not a substitute for professional healthcare.')}
            </Text>
          </View>
        )}

        {/* Name input for slide 4 */}
        {item.isNameSlide && (
          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder={t('onboarding.slide4.placeholder', 'Your name (optional)')}
              placeholderTextColor="#9CA3AF"
              value={nameInputValue}
              onChangeText={onNameChange}
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={30}
              accessibilityLabel={t('onboarding.slide4.placeholder', 'Your name (optional)')}
            />
            <Text style={styles.nameInputHint}>
              {t('onboarding.slide4.hint', 'You can change this later in Profile')}
            </Text>
          </View>
        )}

        {/* Streak import for slide 5 */}
        {item.isStreakImportSlide && (
          <View style={styles.streakImportContainer}>
            <View style={styles.streakInputRow}>
              <View style={styles.streakInputWrapper}>
                <Text style={styles.streakInputLabel}>
                  {t('onboarding.slide5.daysLabel', 'Days')}
                </Text>
                <TextInput
                  style={[styles.streakInput, { borderColor: `${primaryColor}40` }]}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  value={streakDaysValue}
                  onChangeText={onStreakDaysChange}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  maxLength={5}
                  accessibilityLabel={t('onboarding.slide5.daysLabel', 'Days')}
                />
              </View>
              <View style={[styles.streakInputWrapper, { flex: 2 }]}>
                <Text style={styles.streakInputLabel}>
                  {t('onboarding.slide5.sourceLabel', 'From app (optional)')}
                </Text>
                <TextInput
                  style={[styles.streakInput, { borderColor: `${primaryColor}40` }]}
                  placeholder={t('onboarding.slide5.sourcePlaceholder', 'e.g. Headspace')}
                  placeholderTextColor="#9CA3AF"
                  value={streakSourceValue}
                  onChangeText={onStreakSourceChange}
                  returnKeyType="done"
                  maxLength={30}
                  accessibilityLabel={t('onboarding.slide5.sourceLabel', 'From app (optional)')}
                />
              </View>
            </View>
            <Text style={styles.streakInputHint}>
              {t('onboarding.slide5.hint', 'Skip this if you\'re starting fresh')}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

// Pagination dots
const PaginationDots: React.FC<{
  data: Slide[];
  scrollX: SharedValue<number>;
  primaryColor: string;
}> = ({ data, scrollX, primaryColor }) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 32, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
          );

          return {
            width: dotWidth,
            opacity,
            backgroundColor: primaryColor,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
};

// Success celebration component with confetti-like animation
const SuccessCelebration: React.FC<{
  primaryColor: string;
  onComplete: () => void;
  animationsEnabled: boolean;
}> = ({ primaryColor, onComplete, animationsEnabled }) => {
  const { t } = useTranslation();
  const scale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (animationsEnabled) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      checkOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    } else {
      scale.value = 1;
      checkOpacity.value = 1;
    }

    // Auto-complete after animation
    const timeout = setTimeout(() => {
      onComplete();
    }, animationsEnabled ? 1800 : 500);

    return () => clearTimeout(timeout);
  }, [animationsEnabled]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  return (
    <View style={styles.successContainer}>
      <Animated.View style={[styles.successCircle, { backgroundColor: `${primaryColor}20` }, circleStyle]}>
        <Animated.View style={[styles.successInnerCircle, { backgroundColor: primaryColor }, checkStyle]}>
          <Ionicons name="checkmark" size={48} color="#FFF" />
        </Animated.View>
      </Animated.View>
      <Animated.Text
        style={[styles.successTitle, { color: primaryColor }]}
        entering={FadeInUp.delay(400).duration(400)}
      >
        {t('onboarding.successTitle', "You're All Set!")}
      </Animated.Text>
      <Animated.Text
        style={styles.successSubtitle}
        entering={FadeInUp.delay(600).duration(400)}
      >
        {t('onboarding.successSubtitle', 'Your meditation journey begins now')}
      </Animated.Text>
    </View>
  );
};

export const IntroScreen: React.FC<IntroScreenProps> = ({ onDone }) => {
  const { t } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const { userName: existingUserName, setUserName } = useUserProfile();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nameInput, setNameInput] = useState(existingUserName || '');
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const scrollX = useSharedValue(0);

  // Streak import state
  const [streakDaysInput, setStreakDaysInput] = useState('');
  const [streakSourceInput, setStreakSourceInput] = useState('');

  // Check for reduced motion preference
  React.useEffect(() => {
    const checkReduceMotion = async () => {
      const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setReduceMotion(isReduceMotionEnabled);
    };
    checkReduceMotion();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => setReduceMotion(isEnabled)
    );

    return () => subscription.remove();
  }, []);

  // Effective animations enabled (respects both user preference and system setting)
  const effectiveAnimationsEnabled = settings.animationsEnabled && !reduceMotion;

  // Sync nameInput with context when context changes (e.g., when re-opening onboarding)
  // but only if user hasn't manually edited the field
  React.useEffect(() => {
    if (!hasUserEdited) {
      setNameInput(existingUserName || '');
    }
  }, [existingUserName, hasUserEdited]);

  // Track when user manually edits the input
  const handleNameChange = useCallback((text: string) => {
    setNameInput(text);
    setHasUserEdited(true);
  }, []);

  const primaryColor = currentTheme.primary;

  const handleDone = useCallback(async () => {
    try {
      if (settings.hapticEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Save name (or clear if empty) - setUserName handles persistence
      const trimmedName = nameInput.trim();
      logger.log('IntroScreen: Saving name:', trimmedName || '(empty/clearing)');
      await setUserName(trimmedName || undefined);

      // Save imported streak if provided
      const streakDays = parseInt(streakDaysInput, 10);
      if (!isNaN(streakDays) && streakDays > 0) {
        logger.log('IntroScreen: Saving imported streak:', streakDays, 'days from', streakSourceInput || '(no source)');
        await saveImportedStreak(streakDays, streakSourceInput.trim() || undefined);
      }

      await AsyncStorage.setItem(INTRO_COMPLETED_KEY, 'true');
      // Show success animation before navigating
      setShowSuccess(true);
    } catch (error) {
      logger.error('Error saving intro completion:', error);
      onDone();
    }
  }, [nameInput, streakDaysInput, streakSourceInput, settings.hapticEnabled, setUserName, onDone]);

  const handleSuccessComplete = useCallback(() => {
    onDone();
  }, [onDone]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      if (settings.hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  }, [currentIndex, settings.hapticEnabled]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      if (settings.hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleDone();
    }
  }, [currentIndex, settings.hapticEnabled, handleDone]);

  const handleSkip = useCallback(async () => {
    if (settings.hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleDone();
  }, [settings.hapticEnabled, handleDone]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useMemo(() => ({
    viewAreaCoveragePercentThreshold: 50,
  }), []);

  const isLastSlide = currentIndex === slides.length - 1;
  const isFirstSlide = currentIndex === 0;

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1) }],
    };
  });

  // Show success celebration screen
  if (showSuccess) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FAFBFC', '#F0F2F5', '#E8ECF0']}
          style={StyleSheet.absoluteFillObject}
        />
        <SuccessCelebration
          primaryColor={primaryColor}
          onComplete={handleSuccessComplete}
          animationsEnabled={effectiveAnimationsEnabled}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAFBFC', '#F0F2F5', '#E8ECF0']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Back button - shown from slide 2 onwards */}
      {!isFirstSlide && (
        <Animated.View
          entering={effectiveAnimationsEnabled ? FadeInDown.delay(300).duration(400) : undefined}
          style={styles.backContainer}
        >
          <AnimatedPressable
            onPress={handleBack}
            style={styles.backButton}
            hapticType="light"
            accessibilityLabel={t('onboarding.back', 'Back')}
          >
            <Ionicons name="chevron-back" size={20} color={primaryColor} />
            <Text style={[styles.backText, { color: primaryColor }]}>
              {t('onboarding.back', 'Back')}
            </Text>
          </AnimatedPressable>
        </Animated.View>
      )}

      {/* Skip button */}
      {!isLastSlide && (
        <Animated.View
          entering={effectiveAnimationsEnabled ? FadeInDown.delay(300).duration(400) : undefined}
          style={styles.skipContainer}
        >
          <AnimatedPressable
            onPress={handleSkip}
            style={styles.skipButton}
            hapticType="light"
          >
            <Text style={[styles.skipText, { color: primaryColor }]}>
              {t('onboarding.skip', 'Skip')}
            </Text>
          </AnimatedPressable>
        </Animated.View>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.key}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            item={item}
            index={index}
            scrollX={scrollX}
            primaryColor={primaryColor}
            animationsEnabled={effectiveAnimationsEnabled}
            nameInputValue={nameInput}
            onNameChange={handleNameChange}
            showDisclaimer={index === 0}
            streakDaysValue={streakDaysInput}
            onStreakDaysChange={setStreakDaysInput}
            streakSourceValue={streakSourceInput}
            onStreakSourceChange={setStreakSourceInput}
          />
        )}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Pagination */}
        <PaginationDots
          data={slides}
          scrollX={scrollX}
          primaryColor={primaryColor}
        />

        {/* Action button */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          style={styles.buttonContainer}
        >
          <AnimatedPressable
            onPress={handleNext}
            style={[styles.actionButton, buttonAnimatedStyle]}
            pressScale={0.96}
            hapticType="medium"
          >
            <LinearGradient
              colors={[...currentTheme.gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {isLastSlide ? (
                <>
                  <Text style={styles.buttonText}>
                    {t('onboarding.getStarted', 'Get Started')}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                </>
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {t('onboarding.next', 'Next')}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                </>
              )}
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
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
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    paddingTop: 100,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  iconGlowInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  accentIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  nameInputContainer: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 8,
  },
  nameInput: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    textAlign: 'center',
    // Card-like shadow (like HomeScreen cards)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  nameInputHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Streak import styles
  streakImportContainer: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 8,
  },
  streakInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  streakInputWrapper: {
    flex: 1,
  },
  streakInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  streakInput: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    textAlign: 'center',
    borderWidth: 2,
    // Card-like shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  streakInputHint: {
    marginTop: 16,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomSection: {
    paddingBottom: 50,
    paddingHorizontal: 32,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  // Back button styles
  backContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Health disclaimer styles
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  // Success celebration styles
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successInnerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
