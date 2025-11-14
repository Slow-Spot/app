/**
 * GradientCard Component
 *
 * Beautiful card with gradient background, perfect for meditation sessions.
 * Includes shadow, rounded corners, and optional blur effect.
 */

import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientDefinition } from '../theme/gradients';
import theme from '../theme';

interface GradientCardProps {
  gradient: GradientDefinition;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * GradientCard - Beautiful gradient cards with press interaction
 * ✨ Optimized with React.memo for performance
 *
 * @example
 * ```tsx
 * import { gradients } from '../theme';
 *
 * <GradientCard
 *   gradient={gradients.card.beginner}
 *   onPress={() => console.log('Pressed!')}
 * >
 *   <Text>Card Content</Text>
 * </GradientCard>
 * ```
 */
export const GradientCard = React.memo<GradientCardProps>(({
  gradient,
  style,
  children,
  onPress,
  disabled,
}) => {
  const cardContent = (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      start={gradient.start}
      end={gradient.end}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
});

const styles = StyleSheet.create({
  touchable: {
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.card,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.card,
  },
});

export default GradientCard;
