import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ScrollIndicatorProps {
  isVisible: boolean;
  isDark: boolean;
}

/**
 * Minimalist scroll indicator component (Apple style)
 * Shows only a subtle gradient fade when content is scrollable
 * No icons or buttons - just a clean fade effect
 *
 * Usage:
 * - Track scroll position with onScroll handler
 * - Set isVisible based on whether user has scrolled to bottom
 * - Component auto-hides when not needed
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ isVisible, isDark }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 300 });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const gradientColors: [string, string, string] = isDark
    ? ['transparent', 'rgba(28, 28, 30, 0.8)', 'rgba(28, 28, 30, 1)']
    : ['transparent', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 1)'];

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  gradient: {
    flex: 1,
  },
});

export default ScrollIndicator;
