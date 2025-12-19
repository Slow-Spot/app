import { logger } from '../utils/logger';
import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { brandColors, primaryColor } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  selected?: boolean;
  outlined?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles: Record<BadgeVariant, { colors: string[]; textColor: string; borderColor?: string }> = {
  default: {
    colors: [theme.colors.neutral.gray[100], theme.colors.neutral.gray[100]],
    textColor: theme.colors.text.secondary,
    borderColor: theme.colors.border.light,
  },
  primary: {
    colors: [primaryColor.transparent[5], primaryColor.transparent[10]],
    textColor: brandColors.purple.primary,
    borderColor: primaryColor.transparent[20],
  },
  secondary: {
    colors: [theme.colors.accent.purple[50], theme.colors.accent.purple[100]],
    textColor: theme.colors.accent.purple[700],
    borderColor: theme.colors.accent.purple[200],
  },
  success: {
    colors: [theme.colors.accent.green[50], theme.colors.accent.green[100]],
    textColor: theme.colors.accent.green[700],
    borderColor: theme.colors.accent.green[200],
  },
  warning: {
    colors: ['#FEF3C7', '#FDE68A'],
    textColor: '#92400E',
    borderColor: '#FCD34D',
  },
  error: {
    colors: [theme.colors.accent.red[50], theme.colors.accent.red[100]],
    textColor: theme.colors.accent.red[700],
    borderColor: theme.colors.accent.red[200],
  },
  info: {
    colors: [theme.colors.accent.teal[50], theme.colors.accent.teal[100]],
    textColor: theme.colors.accent.teal[700],
    borderColor: theme.colors.accent.teal[200],
  },
};

const selectedStyles: Record<BadgeVariant, { colors: string[]; textColor: string; borderColor?: string }> = {
  default: {
    colors: [brandColors.purple.light, brandColors.purple.primary],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  primary: {
    colors: [brandColors.purple.light, brandColors.purple.primary],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  secondary: {
    colors: [theme.colors.accent.purple[500], theme.colors.accent.purple[600]],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  success: {
    colors: [theme.colors.accent.green[500], theme.colors.accent.green[600]],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  warning: {
    colors: ['#F59E0B', '#D97706'],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  error: {
    colors: [theme.colors.accent.red[500], theme.colors.accent.red[600]],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
  info: {
    colors: [theme.colors.accent.teal[500], theme.colors.accent.teal[600]],
    textColor: theme.colors.neutral.white,
    borderColor: 'transparent',
  },
};

const sizeStyles: Record<BadgeSize, { padding: number; fontSize: number; height: number }> = {
  sm: {
    padding: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.xs,
    height: 24,
  },
  md: {
    padding: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.sm,
    height: 28,
  },
  lg: {
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    height: 32,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
  selected = false,
  outlined = false,
  removable = false,
  onRemove,
}) => {
  const { currentTheme } = usePersonalization();

  // Replace brandColors references with personalized colors for primary/default variants
  const getVariantStyles = () => {
    const baseStyle = selected ? selectedStyles[variant] : variantStyles[variant];
    if ((variant === 'primary' || variant === 'default') && !selected) {
      return {
        ...baseStyle,
        textColor: currentTheme.primary,
      };
    }
    if ((variant === 'primary' || variant === 'default') && selected) {
      return {
        ...baseStyle,
        colors: [...currentTheme.gradient],
      };
    }
    return baseStyle;
  };

  const style = getVariantStyles();
  const sizeStyle = sizeStyles[size];

  if (outlined && !selected) {
    return (
      <LinearGradient
        colors={['transparent', 'transparent']}
        style={[
          styles.badge,
          {
            paddingHorizontal: sizeStyle.padding,
            height: sizeStyle.height,
            borderColor: style.borderColor || style.colors[0],
            borderWidth: 1.5,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyle.fontSize,
              color: style.textColor,
              fontWeight: '600',
            },
          ]}
        >
          {label}
        </Text>
        {removable && onRemove && (
          <Text
            style={[styles.removeButton, { color: style.textColor, marginLeft: theme.spacing.xs }]}
            onPress={onRemove}
          >
            ×
          </Text>
        )}
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={style.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.badge,
        {
          paddingHorizontal: sizeStyle.padding,
          height: sizeStyle.height,
          borderWidth: selected ? 0 : 1,
          borderColor: selected ? 'transparent' : (style.borderColor || 'transparent'),
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
            color: style.textColor,
            fontWeight: selected ? '600' : '500',
          },
        ]}
      >
        {label}
      </Text>
      {removable && onRemove && (
        <Text
          style={[styles.removeButton, { color: style.textColor, marginLeft: theme.spacing.xs }]}
          onPress={onRemove}
        >
          ×
        </Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  removeButton: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
  },
});
