/**
 * ConfettiOverlay Component
 *
 * Reusable confetti celebration effect using react-native-reanimated.
 * Displays animated particles falling from top of screen.
 *
 * Features:
 * - Customizable colors, particle count, and duration
 * - Respects user's animation preferences
 * - Performance optimized with React.memo
 * - Auto-cleanup after animation completes
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { usePersonalization } from '../contexts/PersonalizationContext';

const { width, height } = Dimensions.get('window');

// Default confetti colors (brand-aligned)
const DEFAULT_COLORS = [
  '#8B5CF6', // Primary purple
  '#A78BFA', // Light purple
  '#7C3AED', // Dark purple
  '#FFD700', // Gold
  '#FF6B6B', // Coral
  '#4ECDC4', // Teal
];

interface ConfettiParticleProps {
  delay: number;
  color: string;
  startX: number;
  animationsEnabled: boolean;
  duration: number;
}

/**
 * Single confetti particle with falling animation
 */
const ConfettiParticle = React.memo<ConfettiParticleProps>(({
  delay,
  color,
  startX,
  animationsEnabled,
  duration,
}) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (animationsEnabled) {
      // Falling animation
      translateY.value = withDelay(
        delay,
        withTiming(height + 100, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Horizontal drift
      translateX.value = withDelay(
        delay,
        withTiming(startX + (Math.random() - 0.5) * 100, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      );

      // Rotation
      rotate.value = withDelay(
        delay,
        withTiming(Math.random() * 720, {
          duration,
          easing: Easing.linear,
        })
      );

      // Fade out near the end
      opacity.value = withDelay(
        delay + duration * 0.7,
        withTiming(0, { duration: duration * 0.3 })
      );
    }
  }, [animationsEnabled, delay, duration, startX]);

  const particleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!animationsEnabled) return null;

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color },
        particleStyle,
      ]}
    />
  );
});

ConfettiParticle.displayName = 'ConfettiParticle';

export interface ConfettiOverlayProps {
  /** Array of colors for particles. Defaults to brand colors. */
  colors?: string[];
  /** Number of particles to render. Defaults to 30. */
  particleCount?: number;
  /** Animation duration in ms. Defaults to 3000. */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Whether the overlay is visible. Defaults to true. */
  visible?: boolean;
  /** Override animation preference (uses user settings by default) */
  forceAnimations?: boolean;
}

/**
 * ConfettiOverlay - Renders animated confetti particles
 *
 * Usage:
 * ```tsx
 * <ConfettiOverlay
 *   visible={showConfetti}
 *   colors={['#FF6B6B', '#4ECDC4']}
 *   particleCount={40}
 *   duration={4000}
 *   onComplete={() => setShowConfetti(false)}
 * />
 * ```
 */
export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
  colors = DEFAULT_COLORS,
  particleCount = 30,
  duration = 3000,
  onComplete,
  visible = true,
  forceAnimations,
}) => {
  const { settings } = usePersonalization();
  const animationsEnabled = forceAnimations ?? settings.animationsEnabled;

  // Generate particle configurations
  const particles = useMemo(() => {
    if (!animationsEnabled || !visible) return [];

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 500,
      color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0] ?? '#FFD700',
      startX: Math.random() * width,
    }));
  }, [animationsEnabled, visible, particleCount, colors]);

  // Handle completion callback
  useEffect(() => {
    if (!visible || !onComplete) return;

    const timeout = setTimeout(() => {
      onComplete();
    }, duration + 500); // Add buffer for last particles

    return () => clearTimeout(timeout);
  }, [visible, duration, onComplete]);

  if (!visible || !animationsEnabled) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          delay={particle.delay}
          color={particle.color}
          startX={particle.startX}
          animationsEnabled={animationsEnabled}
          duration={duration}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 3,
  },
});

export default ConfettiOverlay;
