/**
 * Headspace-inspired Design System
 *
 * Complete theme system with colors, gradients, spacing, typography,
 * shadows, and other design tokens for a beautiful meditation app.
 */

import colors, { darkColors, getThemeColors } from './colors';
import gradients, { darkGradients, getThemeGradients } from './gradients';

/**
 * Spacing scale - 2px base unit
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  xxxxl: 80,
};

/**
 * Border radius scale
 */
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
  full: 9999, // Alias for round, compatible with component library
  circle: '50%',
};

/**
 * Typography scale
 */
export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
    hero: 48,
  },
  fontWeights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

/**
 * Shadow definitions
 */
export const shadows = {
  sm: {
    shadowColor: colors.shadow.sm,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.shadow.xl,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  floatingButton: {
    shadowColor: colors.accent.blue[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

/**
 * Animation durations (in milliseconds)
 */
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

/**
 * Animation easings
 */
export const easings = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  spring: 'spring',
};

/**
 * Icon sizes
 */
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
};

/**
 * Button sizes
 */
export const buttonSizes = {
  sm: {
    height: 36,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSizes.sm,
    borderRadius: borderRadius.md,
  },
  md: {
    height: 48,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSizes.md,
    borderRadius: borderRadius.lg,
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing.xl,
    fontSize: typography.fontSizes.lg,
    borderRadius: borderRadius.xl,
  },
};

/**
 * Card styles
 */
export const cardStyles = {
  default: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.card,
    ...shadows.card,
  },
  elevated: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.elevated,
    ...shadows.lg,
  },
  flat: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
  },
};

/**
 * Layout constants
 */
export const layout = {
  screenPadding: spacing.lg,
  sectionSpacing: spacing.xl,
  minTouchTarget: 44,
  maxContentWidth: 640,
  headerHeight: 56,
  tabBarHeight: 64,
};

/**
 * Z-index scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

/**
 * Opacity scale
 */
export const opacity = {
  disabled: 0.4,
  muted: 0.6,
  subtle: 0.7,
  normal: 1,
  // Glass morphism & transparency values
  glass15: 0.15,
  glass20: 0.2,
  glass25: 0.25,
  glass30: 0.3,
  glass40: 0.4,
  glass50: 0.5,
  glass60: 0.6,
  glass70: 0.7,
  glass80: 0.8,
  glass85: 0.85,
  glass90: 0.9,
};

/**
 * Dark mode shadows - more prominent for depth perception
 */
export const darkShadows = {
  sm: {
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  floatingButton: {
    shadowColor: '#70C0FF', // Lighter blue for dark mode
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

/**
 * Dark mode card styles
 */
export const darkCardStyles = {
  default: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: '#2C2C2E', // darkBackgrounds.card
    ...darkShadows.card,
  },
  elevated: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: '#3A3A3C', // darkBackgrounds.elevated
    ...darkShadows.lg,
  },
  flat: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: '#2C2C2E', // darkBackgrounds.secondary
  },
};

/**
 * Complete theme object (light mode - default)
 */
export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
  durations,
  easings,
  iconSizes,
  buttonSizes,
  cardStyles,
  layout,
  zIndex,
  opacity,
};

/**
 * Dark theme object
 */
export const darkTheme = {
  colors: darkColors,
  gradients: darkGradients,
  spacing,
  borderRadius,
  typography,
  shadows: darkShadows,
  durations,
  easings,
  iconSizes,
  buttonSizes,
  cardStyles: darkCardStyles,
  layout,
  zIndex,
  opacity,
};

/**
 * Helper function to get complete theme based on mode
 */
export const getTheme = (isDark: boolean) => isDark ? darkTheme : theme;

export type Theme = typeof theme;

// Export individual modules
export { colors, gradients, darkColors, darkGradients, getThemeColors, getThemeGradients };

// Export types from gradients
export type { GradientDefinition } from './gradients';

// Export default theme
export default theme;
