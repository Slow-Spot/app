/**
 * WelcomeModal Component
 *
 * Shows personalized greeting when user returns after >4h absence.
 * Features:
 * - Animated entrance (FadeIn + SlideInUp)
 * - Time-of-day aware greetings
 * - Personalized with user's name
 * - Randomized messages from pool
 * - Auto-dismiss after 3s or on tap
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import type { TimeOfDay } from '../utils/greetings';
import { getTimeOfDay } from '../utils/greetings';

const { width } = Dimensions.get('window');

// Number of message variants per time of day
const MESSAGE_VARIANTS = 3;

interface WelcomeModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is dismissed */
  onDismiss: () => void;
  /** Auto-dismiss timeout in ms (default: 3000) */
  autoDismissDelay?: number;
}

/**
 * Get random variant index (1-based for i18n keys)
 */
const getRandomVariant = (): number => {
  return Math.floor(Math.random() * MESSAGE_VARIANTS) + 1;
};

/**
 * Get icon based on time of day
 */
const getTimeIcon = (timeOfDay: TimeOfDay): keyof typeof Ionicons.glyphMap => {
  switch (timeOfDay) {
    case 'morning':
      return 'sunny';
    case 'afternoon':
      return 'partly-sunny';
    case 'evening':
      return 'moon';
    case 'night':
      return 'cloudy-night';
    default:
      return 'time';
  }
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  visible,
  onDismiss,
  autoDismissDelay = 3000,
}) => {
  const { t } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const { userName } = useUserProfile();

  const [variant] = useState(() => getRandomVariant());
  const timeOfDay = useMemo(() => getTimeOfDay(), []);

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);

  // Get greeting key based on time and whether user has name
  const greetingKey = useMemo(() => {
    const base = `welcome.returning.${timeOfDay}`;
    return userName ? `${base}Personal` : base;
  }, [timeOfDay, userName]);

  // Get subtitle key (randomized)
  const subtitleKey = useMemo(() => {
    return `welcome.returning.subtitle${variant}`;
  }, [variant]);

  // Handle animations
  useEffect(() => {
    if (visible) {
      // Entrance animation
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });

      // Auto-dismiss timer
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    } else {
      // Reset values
      opacity.value = 0;
      translateY.value = 50;
      scale.value = 0.9;
    }
  }, [visible, autoDismissDelay]);

  const handleDismiss = useCallback(() => {
    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Exit animation
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
    translateY.value = withTiming(30, { duration: 200 });
    scale.value = withTiming(0.95, { duration: 200 });
  }, [onDismiss, settings.hapticEnabled]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Animated.View style={[styles.container, containerStyle]}>
          <Pressable onPress={handleDismiss}>
            <Animated.View style={[styles.card, cardStyle]}>
              <LinearGradient
                colors={[...currentTheme.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={getTimeIcon(timeOfDay)}
                    size={40}
                    color="rgba(255, 255, 255, 0.9)"
                  />
                </View>

                {/* Greeting */}
                <Text style={styles.greeting}>
                  {t(greetingKey, { name: userName })}
                </Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                  {t(subtitleKey)}
                </Text>

                {/* Tap hint */}
                <Text style={styles.hint}>
                  {t('welcome.tapToDismiss', 'Tap to continue')}
                </Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 48,
    maxWidth: 360,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  gradient: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  hint: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

export default WelcomeModal;
