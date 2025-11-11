/**
 * Minimal & Calm Color Palette
 *
 * Clean, modern, and peaceful colors inspired by minimalist meditation apps.
 * Features whites, soft grays, and subtle accent colors for a calm aesthetic.
 */

// Primary neutral colors - Clean whites and grays
export const neutralColors = {
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  lightGray: {
    100: '#F5F5F7',
    200: '#ECECEE',
    300: '#E5E5EA',
    400: '#D1D1D6',
    500: '#C7C7CC',
  },
  gray: {
    100: '#F2F2F7',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#8E8E93',
    600: '#636366',
    700: '#48484A',
    800: '#3A3A3C',
    900: '#2C2C2E',
  },
  charcoal: {
    100: '#28282D',
    200: '#1C1C1E',
    300: '#121214',
    400: '#0A0A0B',
  },
  black: '#000000',
};

// Accent colors - Soft and calming
export const accentColors = {
  // Soft blue - primary accent
  blue: {
    100: '#EBF5FF',
    200: '#D6EBFF',
    300: '#ADDCFF',
    400: '#70C0FF',
    500: '#4FA8FF',
    600: '#3B8FDB',
    700: '#2D6FA8',
    800: '#1E4F7A',
  },
  // Soft lavender - secondary accent
  lavender: {
    100: '#F3F0FF',
    200: '#E9E4FF',
    300: '#D4C5FF',
    400: '#B7A0FF',
    500: '#9D7FFA',
    600: '#8165D6',
    700: '#6650A4',
    800: '#4A3B78',
  },
  // Soft mint - tertiary accent
  mint: {
    100: '#E6F9F5',
    200: '#C2F2E6',
    300: '#8FE7D0',
    400: '#5ED9B5',
    500: '#3FC79A',
    600: '#2DA876',
    700: '#1E8057',
    800: '#12593D',
  },
  // Soft rose - for special highlights
  rose: {
    100: '#FFF0F5',
    200: '#FFE0EC',
    300: '#FFCCE0',
    400: '#FFB3D5',
    500: '#FF99C7',
    600: '#E67AAD',
    700: '#B85B85',
    800: '#8A4064',
  },
};

// Semantic colors - For UI states and feedback
export const semanticColors = {
  success: {
    light: '#D1FAE5',
    default: '#34D399',
    dark: '#059669',
  },
  error: {
    light: '#FEE2E2',
    default: '#EF4444',
    dark: '#DC2626',
  },
  warning: {
    light: '#FEF3C7',
    default: '#F59E0B',
    dark: '#D97706',
  },
  info: {
    light: accentColors.blue[200],
    default: accentColors.blue[500],
    dark: accentColors.blue[700],
  },
};

// Background colors for different contexts
export const backgrounds = {
  primary: neutralColors.white,
  secondary: neutralColors.offWhite,
  tertiary: neutralColors.lightGray[100],
  card: neutralColors.white,
  elevated: neutralColors.white,
  overlay: 'rgba(0, 0, 0, 0.4)',
};

// Text colors with hierarchy
export const textColors = {
  primary: neutralColors.charcoal[200],
  secondary: neutralColors.gray[600],
  tertiary: neutralColors.gray[500],
  inverse: neutralColors.white,
  disabled: neutralColors.gray[400],
  accent: accentColors.blue[600],
  link: accentColors.blue[600],
};

// Border colors
export const borderColors = {
  light: neutralColors.lightGray[200],
  medium: neutralColors.lightGray[300],
  strong: neutralColors.gray[300],
  focus: accentColors.blue[500],
};

// Shadow colors
export const shadowColors = {
  sm: 'rgba(0, 0, 0, 0.04)',
  md: 'rgba(0, 0, 0, 0.08)',
  lg: 'rgba(0, 0, 0, 0.12)',
  xl: 'rgba(0, 0, 0, 0.16)',
};

// Export all as default theme
export const colors = {
  neutral: neutralColors,
  accent: accentColors,
  semantic: semanticColors,
  background: backgrounds,
  text: textColors,
  border: borderColors,
  shadow: shadowColors,
};

export default colors;
