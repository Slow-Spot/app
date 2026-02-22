/**
 * SkeletonLoader Component
 *
 * Beautiful skeleton loading placeholders with pulsing animation.
 * Used to show loading states while content is being fetched.
 */

import React, { useEffect } from 'react';
import type { StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, borderRadius } from '../theme';

interface SkeletonLoaderProps {
  /** Width of the skeleton (number or percentage string) */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: number;
  /** Border radius variant */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'round';
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
}

/**
 * Single skeleton element with pulsing animation
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  radius = 'md',
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const pulseAnim = useSharedValue(0);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [0, 1], [0.4, 0.8]),
  }));

  const baseColor = isDarkMode ? '#2C2C2E' : '#E5E5EA';
  const highlightColor = isDarkMode ? '#3A3A3C' : '#F2F2F7';

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius[radius],
          backgroundColor: baseColor,
        },
        animatedStyle,
        style,
      ]}
    >
      <LinearGradient
        colors={[baseColor, highlightColor, baseColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

/**
 * Skeleton for a session card
 */
export const SessionCardSkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.sessionCard,
        {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        style,
      ]}
    >
      {/* Icon placeholder */}
      <View style={styles.sessionCardRow}>
        <SkeletonLoader width={48} height={48} radius="round" />
        <View style={styles.sessionCardContent}>
          <SkeletonLoader width="70%" height={18} radius="sm" />
          <SkeletonLoader width="40%" height={14} radius="sm" style={{ marginTop: 8 }} />
        </View>
      </View>
      {/* Bottom row */}
      <View style={styles.sessionCardFooter}>
        <SkeletonLoader width={60} height={24} radius="round" />
        <SkeletonLoader width={80} height={24} radius="round" />
      </View>
    </View>
  );
};

/**
 * Skeleton for statistics cards
 */
export const StatCardSkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        style,
      ]}
    >
      <SkeletonLoader width={32} height={32} radius="round" />
      <SkeletonLoader width="60%" height={24} radius="sm" style={{ marginTop: 12 }} />
      <SkeletonLoader width="80%" height={14} radius="sm" style={{ marginTop: 8 }} />
    </View>
  );
};

/**
 * Skeleton for list items
 */
export const ListItemSkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.listItem,
        {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        style,
      ]}
    >
      <SkeletonLoader width={40} height={40} radius="round" />
      <View style={styles.listItemContent}>
        <SkeletonLoader width="60%" height={16} radius="sm" />
        <SkeletonLoader width="40%" height={12} radius="sm" style={{ marginTop: 6 }} />
      </View>
      <SkeletonLoader width={24} height={24} radius="sm" />
    </View>
  );
};

/**
 * Skeleton for text paragraphs
 */
export const TextSkeleton: React.FC<{
  lines?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ lines = 3, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
          height={14}
          radius="sm"
          style={{ marginBottom: index < lines - 1 ? 8 : 0 }}
        />
      ))}
    </View>
  );
};

/**
 * Full screen loading skeleton
 */
export const ScreenSkeleton: React.FC<{
  type?: 'list' | 'cards' | 'profile';
}> = ({ type = 'list' }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  if (type === 'cards') {
    return (
      <View style={[styles.screen, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
        <SkeletonLoader width="40%" height={32} radius="md" style={{ marginBottom: 24 }} />
        <View style={styles.cardsGrid}>
          <SessionCardSkeleton />
          <SessionCardSkeleton style={{ marginTop: 16 }} />
          <SessionCardSkeleton style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  if (type === 'profile') {
    return (
      <View style={[styles.screen, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
        <View style={styles.profileHeader}>
          <SkeletonLoader width={80} height={80} radius="round" />
          <SkeletonLoader width="50%" height={24} radius="md" style={{ marginTop: 16 }} />
          <SkeletonLoader width="30%" height={16} radius="sm" style={{ marginTop: 8 }} />
        </View>
        <View style={styles.statsRow}>
          <StatCardSkeleton style={{ flex: 1 }} />
          <StatCardSkeleton style={{ flex: 1, marginLeft: 12 }} />
        </View>
        <ListItemSkeleton style={{ marginTop: 24 }} />
        <ListItemSkeleton style={{ marginTop: 12 }} />
      </View>
    );
  }

  // Default: list
  return (
    <View style={[styles.screen, { backgroundColor: isDarkMode ? '#000000' : '#F2F2F7' }]}>
      <SkeletonLoader width="40%" height={32} radius="md" style={{ marginBottom: 24 }} />
      <ListItemSkeleton />
      <ListItemSkeleton style={{ marginTop: 12 }} />
      <ListItemSkeleton style={{ marginTop: 12 }} />
      <ListItemSkeleton style={{ marginTop: 12 }} />
      <ListItemSkeleton style={{ marginTop: 12 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  sessionCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionCardContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sessionCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  statCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  screen: {
    flex: 1,
    padding: spacing.lg,
  },
  cardsGrid: {
    gap: spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

export default SkeletonLoader;
