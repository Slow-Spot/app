/**
 * GradientBackground Component
 *
 * Reusable gradient background component using expo-linear-gradient.
 * Supports all gradient definitions from the theme system.
 */

import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientDefinition } from '../theme/gradients';

interface GradientBackgroundProps {
  gradient: GradientDefinition;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * GradientBackground - Apply beautiful gradients to any container
 *
 * @example
 * ```tsx
 * import { gradients } from '../theme';
 *
 * <GradientBackground gradient={gradients.primary.warmSunset}>
 *   <Text>Beautiful gradient background!</Text>
 * </GradientBackground>
 * ```
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradient,
  style,
  children,
}) => {
  return (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      start={gradient.start}
      end={gradient.end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
