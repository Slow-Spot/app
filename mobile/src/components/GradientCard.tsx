import { logger } from '../utils/logger';
/**
 * GradientCard Component
 *
 * Beautiful card with gradient background, perfect for meditation sessions.
 * Includes shadow, rounded corners, and optional blur effect.
 */

import React, { useMemo } from 'react';
import { StyleSheet, ViewStyle, StyleProp, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientDefinition } from '../theme/gradients';
import theme from '../theme';

interface GradientCardProps {
  gradient: GradientDefinition;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  isDark?: boolean;
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
 *   onPress={() => logger.log('Pressed!')}
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
  onLongPress,
  disabled,
  isDark = false,
}) => {
  // Dynamic shadow based on theme - stronger shadows in light mode for depth
  const shadowStyle = useMemo(() => {
    if (isDark) {
      // Subtle shadow in dark mode
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      };
    }
    // Stronger, more visible shadow in light mode
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    };
  }, [isDark]);

  // Dynamic background for shadow wrapper based on theme
  const wrapperBgStyle = useMemo(() => ({
    backgroundColor: isDark ? '#2C2C2E' : theme.colors.neutral.white,
  }), [isDark]);

  // Wrapper View for shadow (shadows don't render properly on LinearGradient)
  const cardContent = (
    <View style={[styles.shadowWrapper, shadowStyle, wrapperBgStyle, style]}>
      <LinearGradient
        colors={gradient.colors}
        locations={gradient.locations}
        start={gradient.start}
        end={gradient.end}
        style={styles.card}
      >
        {children}
      </LinearGradient>
    </View>
  );

  if ((onPress || onLongPress) && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        activeOpacity={0.8}
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
  },
  shadowWrapper: {
    borderRadius: theme.borderRadius.xl,
    // backgroundColor is set dynamically based on isDark prop
  },
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden', // Clip gradient to border radius
  },
});

export default GradientCard;
