import { logger } from '../utils/logger';
/**
 * Button Component
 *
 * Flexible button with multiple variants for consistent UI.
 * Use this for secondary actions, outlines, and ghost buttons.
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
  View,
} from 'react-native';
import theme from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Accessibility label for screen readers. Defaults to title if not provided. */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the button is pressed. */
  accessibilityHint?: string;
}

/**
 * Button - Flexible button component with variants
 *
 * @example
 * ```tsx
 * <Button
 *   title="Cancel"
 *   variant="outline"
 *   onPress={() => logger.log('Cancel')}
 *   size="md"
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled,
  loading,
  fullWidth = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const sizeStyles = theme.buttonSizes[size];
  const { currentTheme } = usePersonalization();

  const getVariantStyles = () => {
    const baseStyle: ViewStyle = {
      height: sizeStyles.height,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      borderRadius: sizeStyles.borderRadius,
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...baseStyle,
            backgroundColor: currentTheme.primary,
          },
          text: {
            color: theme.colors.neutral.white,
          },
        };
      case 'secondary':
        return {
          container: {
            ...baseStyle,
            backgroundColor: theme.colors.neutral.gray[100],
          },
          text: {
            color: theme.colors.text.primary,
          },
        };
      case 'outline':
        return {
          container: {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.border.default,
          },
          text: {
            color: theme.colors.text.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            ...baseStyle,
            backgroundColor: 'transparent',
          },
          text: {
            color: currentTheme.primary,
          },
        };
      case 'destructive':
        return {
          container: {
            ...baseStyle,
            backgroundColor: theme.colors.accent.red[600],
          },
          text: {
            color: theme.colors.neutral.white,
          },
        };
      default:
        return {
          container: baseStyle,
          text: {},
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.touchable,
        fullWidth && styles.fullWidth,
        { opacity: disabled ? theme.opacity.disabled : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      <View style={[styles.button, variantStyles.container, style]}>
        {loading ? (
          <ActivityIndicator
            color={variantStyles.text.color || theme.colors.text.primary}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeStyles.fontSize,
                },
                variantStyles.text,
                textStyle,
              ]}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
});

export default Button;
