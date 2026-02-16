import { logger } from '../utils/logger';
/**
 * GradientButton Component
 *
 * Beautiful gradient button with smooth press animations.
 * Perfect for CTAs and primary actions.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientDefinition } from '../theme/gradients';
import theme from '../theme';

interface GradientButtonProps {
  title: string;
  gradient: GradientDefinition;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  /** Accessibility label for screen readers. Defaults to title if not provided. */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the button is pressed. */
  accessibilityHint?: string;
}

/**
 * GradientButton - Beautiful gradient CTA button
 *
 * @example
 * ```tsx
 * import { gradients } from '../theme';
 *
 * <GradientButton
 *   title="Start Meditation"
 *   gradient={gradients.button.primary}
 *   onPress={() => logger.log('Start!')}
 *   size="lg"
 * />
 * ```
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  gradient,
  onPress,
  style,
  textStyle,
  disabled,
  loading,
  size = 'md',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const sizeStyles = theme.buttonSizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.touchable, { opacity: disabled ? theme.opacity.disabled : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      <LinearGradient
        colors={gradient.colors}
        locations={gradient.locations}
        start={gradient.start}
        end={gradient.end}
        style={[
          styles.button,
          {
            height: sizeStyles.height,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderRadius: sizeStyles.borderRadius,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    ...theme.shadows.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
  },
});

export default GradientButton;
