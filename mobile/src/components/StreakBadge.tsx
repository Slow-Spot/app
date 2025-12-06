/**
 * StreakBadge Component
 *
 * Displays meditation streak with a beautiful animated badge.
 * Shows fire icon with streak count for gamification.
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';

interface StreakBadgeProps {
  streak: number;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  isDark = false,
  size = 'md',
  showLabel = true,
}) => {
  const { currentTheme, settings } = usePersonalization();
  const pulseAnim = useSharedValue(0);

  // Size configurations
  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'sm':
        return { container: 40, icon: 16, text: 12, label: 10 };
      case 'lg':
        return { container: 72, icon: 28, text: 22, label: 14 };
      default:
        return { container: 56, icon: 22, text: 16, label: 12 };
    }
  }, [size]);

  // Fire gradient colors based on streak
  const fireGradient = useMemo(() => {
    if (streak >= 30) {
      // Gold/platinum for 30+ days
      return ['#FFD700', '#FFA500', '#FF6B35'];
    } else if (streak >= 14) {
      // Purple for 14+ days
      return ['#A855F7', '#7C3AED', '#6D28D9'];
    } else if (streak >= 7) {
      // Blue for 7+ days
      return ['#3B82F6', '#2563EB', '#1D4ED8'];
    } else if (streak >= 3) {
      // Green for 3+ days
      return ['#10B981', '#059669', '#047857'];
    } else {
      // Orange for starting
      return ['#F97316', '#EA580C', '#DC2626'];
    }
  }, [streak]);

  // Subtle pulse animation for active streak
  useEffect(() => {
    if (streak > 0 && settings.animationsEnabled) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [streak, settings.animationsEnabled]);

  const glowStyle = useAnimatedStyle(() => {
    if (streak === 0) return { opacity: 0 };

    return {
      opacity: 0.3 + pulseAnim.value * 0.2,
      transform: [{ scale: 1 + pulseAnim.value * 0.1 }],
    };
  });

  if (streak === 0) {
    return null; // Don't show badge if no streak
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: sizeConfig.container, height: sizeConfig.container }]}>
        {/* Animated glow */}
        <Animated.View style={[styles.glow, glowStyle, { backgroundColor: fireGradient[0] }]} />

        {/* Main badge */}
        <LinearGradient
          colors={fireGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.badge, { width: sizeConfig.container, height: sizeConfig.container, borderRadius: sizeConfig.container / 2 }]}
        >
          <Ionicons name="flame" size={sizeConfig.icon} color="#FFF" />
          <Text style={[styles.count, { fontSize: sizeConfig.text }]}>{streak}</Text>
        </LinearGradient>
      </View>

      {showLabel && (
        <Text style={[
          styles.label,
          { fontSize: sizeConfig.label, color: isDark ? theme.colors.text.inverse : theme.colors.text.secondary }
        ]}>
          {streak === 1 ? 'dzień' : streak < 5 ? 'dni' : 'dni'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 100,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  count: {
    color: '#FFF',
    fontWeight: '700',
    marginTop: -2,
  },
  label: {
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default StreakBadge;
