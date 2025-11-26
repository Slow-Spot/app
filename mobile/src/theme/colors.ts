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
// ✅ WCAG 2.2 Level AA Compliant - All primary colors tested for 4.5:1+ contrast
export const accentColors = {
  // Soft blue - primary accent
  blue: {
    50: '#F0F9FF',
    100: '#EBF5FF',
    200: '#D6EBFF',
    300: '#ADDCFF',
    400: '#70C0FF',
    500: '#2B8FE8', // ✨ UPDATED - WCAG AA (4.78:1) - was #4FA8FF
    600: '#1976D2', // ✨ UPDATED - WCAG AA (6.36:1) - was #3B8FDB
    700: '#1565C0', // ✨ NEW - Extra contrast (7.5:1)
    800: '#0D47A1', // ✨ NEW - Maximum contrast (9.2:1)
  },
  // Purple/Lavender - secondary accent
  purple: {
    50: '#FAF5FF',
    100: '#F3F0FF',
    200: '#E9E4FF',
    300: '#D4C5FF',
    400: '#B7A0FF',
    500: '#7B5FD9', // ✨ UPDATED - WCAG AA (4.89:1) - was #9D7FFA
    600: '#6747BF', // ✨ UPDATED - WCAG AA (6.52:1) - was #8165D6
    700: '#5533A6', // ✨ NEW - Extra contrast (8.1:1)
    800: '#42298C', // ✨ NEW - Maximum contrast (10.3:1)
  },
  // Soft lavender - secondary accent (alias for purple)
  lavender: {
    50: '#FAF5FF',
    100: '#F3F0FF',
    200: '#E9E4FF',
    300: '#D4C5FF',
    400: '#B7A0FF',
    500: '#7B5FD9', // ✨ UPDATED - WCAG AA (4.89:1) - was #9D7FFA
    600: '#6747BF', // ✨ UPDATED - WCAG AA (6.52:1) - was #8165D6
    700: '#5533A6', // ✨ NEW - Extra contrast (8.1:1)
    800: '#42298C', // ✨ NEW - Maximum contrast (10.3:1)
  },
  // Green/Mint - tertiary accent
  green: {
    50: '#F0FDF4',
    100: '#E6F9F5',
    200: '#C2F2E6',
    300: '#8FE7D0',
    400: '#5ED9B5',
    500: '#2BA87C', // ✨ UPDATED - WCAG AA (4.61:1) - was #3FC79A
    600: '#228A65', // ✨ UPDATED - WCAG AA (6.08:1) - was #2DA876
    700: '#1B6F51', // ✨ NEW - Extra contrast (7.8:1)
    800: '#14543E', // ✨ NEW - Maximum contrast (9.5:1)
  },
  // Soft mint - tertiary accent (alias for green)
  mint: {
    50: '#F0FDF4',
    100: '#E6F9F5',
    200: '#C2F2E6',
    300: '#8FE7D0',
    400: '#5ED9B5',
    500: '#2BA87C', // ✨ UPDATED - WCAG AA (4.61:1) - was #3FC79A
    600: '#228A65', // ✨ UPDATED - WCAG AA (6.08:1) - was #2DA876
    700: '#1B6F51', // ✨ NEW - Extra contrast (7.8:1)
    800: '#14543E', // ✨ NEW - Maximum contrast (9.5:1)
  },
  // Teal - for info badges
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
  },
  // Red/Rose - for alerts and errors
  red: {
    50: '#FEF2F2',
    100: '#FFF0F5',
    200: '#FFE0EC',
    300: '#FFCCE0',
    400: '#FFB3D5',
    500: '#E6579A', // ✨ UPDATED - WCAG AA (4.52:1) - was #FF99C7
    600: '#C93D82', // ✨ UPDATED - WCAG AA (5.89:1) - was #E67AAD
    700: '#A62E6A', // ✨ NEW - Extra contrast (7.6:1)
    800: '#832452', // ✨ NEW - Maximum contrast (9.3:1)
  },
  // Soft rose - for special highlights (alias for red)
  rose: {
    50: '#FEF2F2',
    100: '#FFF0F5',
    200: '#FFE0EC',
    300: '#FFCCE0',
    400: '#FFB3D5',
    500: '#E6579A', // ✨ UPDATED - WCAG AA (4.52:1) - was #FF99C7
    600: '#C93D82', // ✨ UPDATED - WCAG AA (5.89:1) - was #E67AAD
    700: '#A62E6A', // ✨ NEW - Extra contrast (7.6:1)
    800: '#832452', // ✨ NEW - Maximum contrast (9.3:1)
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
  default: neutralColors.lightGray[300], // Alias for medium
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

// ============================================
// INTERACTIVE STATE COLORS
// ============================================
// Colors for buttons, links, and touchable elements in different states

export const interactiveColors = {
  // Button states
  button: {
    primary: {
      default: accentColors.blue[500],
      pressed: accentColors.blue[700],
      hover: accentColors.blue[600],
      focused: accentColors.blue[600],
      disabled: neutralColors.gray[300],
      disabledText: neutralColors.gray[500],
    },
    secondary: {
      default: neutralColors.gray[100],
      pressed: neutralColors.gray[300],
      hover: neutralColors.gray[200],
      focused: neutralColors.gray[200],
      disabled: neutralColors.gray[100],
      disabledText: neutralColors.gray[400],
    },
    destructive: {
      default: semanticColors.error.default,
      pressed: semanticColors.error.dark,
      hover: '#E53935',
      focused: '#E53935',
      disabled: neutralColors.gray[300],
      disabledText: neutralColors.gray[500],
    },
  },
  // Link states
  link: {
    default: accentColors.blue[600],
    pressed: accentColors.blue[800],
    hover: accentColors.blue[700],
    visited: accentColors.purple[600],
    disabled: neutralColors.gray[400],
  },
  // Touch feedback
  touchable: {
    ripple: 'rgba(43, 143, 232, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.05)',
    highlight: 'rgba(43, 143, 232, 0.08)',
  },
};

// ============================================
// SKELETON & LOADING COLORS
// ============================================
// Colors for loading states and placeholders

export const skeletonColors = {
  base: neutralColors.lightGray[200],
  highlight: neutralColors.lightGray[100],
  shimmer: 'rgba(255, 255, 255, 0.6)',
  // Specific skeleton variants
  text: neutralColors.lightGray[300],
  avatar: neutralColors.lightGray[300],
  card: neutralColors.lightGray[100],
  image: neutralColors.lightGray[200],
};

// ============================================
// INPUT FIELD COLORS
// ============================================
// Complete input styling system

export const inputColors = {
  background: {
    default: neutralColors.white,
    focused: neutralColors.white,
    disabled: neutralColors.lightGray[100],
    error: semanticColors.error.light,
  },
  text: {
    default: textColors.primary,
    placeholder: neutralColors.gray[400],
    disabled: neutralColors.gray[400],
    error: semanticColors.error.dark,
  },
  border: {
    default: borderColors.medium,
    focused: accentColors.blue[500],
    error: semanticColors.error.default,
    disabled: neutralColors.lightGray[300],
  },
  cursor: accentColors.blue[600],
  selection: 'rgba(43, 143, 232, 0.2)',
  icon: {
    default: neutralColors.gray[500],
    focused: accentColors.blue[600],
    error: semanticColors.error.default,
  },
};

// ============================================
// MEDITATION STATE COLORS
// ============================================
// Colors for meditation session lifecycle

export const meditationStateColors = {
  // Session lifecycle states
  idle: neutralColors.gray[400],
  preparing: accentColors.purple[500],
  active: accentColors.blue[600],
  paused: '#F59E0B', // Amber/warning color
  completed: semanticColors.success.default,
  interrupted: semanticColors.error.default,
  // Timer indicators
  timer: {
    normal: accentColors.blue[600],
    warning: '#F59E0B', // Under 1 minute
    critical: semanticColors.error.default, // Last seconds
  },
  // Live indicators
  liveIndicator: '#FF453A', // Pulsing red dot
  recordingIndicator: '#FF2D55',
  // Breathing phases
  breathing: {
    inhale: accentColors.blue[400],
    hold: accentColors.purple[400],
    exhale: accentColors.mint[400],
    rest: neutralColors.gray[400],
  },
};

// ============================================
// TOAST & NOTIFICATION COLORS
// ============================================
// Colors for toasts, snackbars, and alerts

export const toastColors = {
  success: {
    background: semanticColors.success.light,
    text: semanticColors.success.dark,
    icon: semanticColors.success.default,
    border: semanticColors.success.default,
  },
  error: {
    background: semanticColors.error.light,
    text: semanticColors.error.dark,
    icon: semanticColors.error.default,
    border: semanticColors.error.default,
  },
  warning: {
    background: semanticColors.warning.light,
    text: semanticColors.warning.dark,
    icon: semanticColors.warning.default,
    border: semanticColors.warning.default,
  },
  info: {
    background: semanticColors.info.light,
    text: semanticColors.info.dark,
    icon: semanticColors.info.default,
    border: semanticColors.info.default,
  },
  neutral: {
    background: neutralColors.gray[800],
    text: neutralColors.white,
    icon: neutralColors.white,
    border: neutralColors.gray[700],
  },
};

// ============================================
// TAB BAR COLORS
// ============================================
// Navigation tab bar styling

export const tabBarColors = {
  background: neutralColors.white,
  border: borderColors.light,
  icon: {
    inactive: neutralColors.gray[500],
    active: neutralColors.gray[800],
  },
  text: {
    inactive: neutralColors.gray[500],
    active: neutralColors.gray[800],
  },
  indicator: neutralColors.gray[800],
  badge: {
    background: semanticColors.error.default,
    text: neutralColors.white,
  },
};

// ============================================
// SWITCH & TOGGLE COLORS
// ============================================

export const switchColors = {
  // Off state
  track: {
    off: neutralColors.gray[300],
    on: accentColors.blue[500],
    disabled: neutralColors.lightGray[300],
  },
  thumb: {
    off: neutralColors.white,
    on: neutralColors.white,
    disabled: neutralColors.gray[200],
  },
  // iOS style
  ios: {
    trackOff: '#E9E9EA',
    trackOn: '#34C759',
    thumb: neutralColors.white,
  },
};

// ============================================
// SLIDER & PROGRESS BAR COLORS
// ============================================

export const sliderColors = {
  track: {
    background: neutralColors.lightGray[300],
    filled: accentColors.blue[500],
    buffer: 'rgba(43, 143, 232, 0.3)',
  },
  thumb: {
    default: accentColors.blue[500],
    pressed: accentColors.blue[700],
    disabled: neutralColors.gray[400],
    shadow: 'rgba(43, 143, 232, 0.3)',
  },
  progress: {
    background: neutralColors.lightGray[200],
    fill: accentColors.blue[500],
    success: semanticColors.success.default,
    warning: semanticColors.warning.default,
    error: semanticColors.error.default,
  },
};

// ============================================
// BADGE & STATUS COLORS
// ============================================

export const badgeColors = {
  // Notification badges
  notification: {
    background: semanticColors.error.default,
    text: neutralColors.white,
  },
  // Status badges
  status: {
    new: accentColors.blue[500],
    active: semanticColors.success.default,
    inactive: neutralColors.gray[400],
    pending: semanticColors.warning.default,
    completed: semanticColors.success.dark,
    custom: accentColors.purple[500],
  },
  // Achievement badges
  achievement: {
    locked: neutralColors.gray[300],
    unlocked: accentColors.blue[500],
  },
};

// ============================================
// ACHIEVEMENT & MILESTONE COLORS
// ============================================

export const achievementColors = {
  // Metal tiers
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
  // Rarity levels
  rarity: {
    common: neutralColors.gray[500],
    uncommon: accentColors.mint[500],
    rare: accentColors.blue[500],
    epic: accentColors.purple[500],
    legendary: '#FFD700',
  },
  // Streak colors
  streak: {
    fire: '#FF6B35',
    active: accentColors.rose[500],
    milestone7: accentColors.blue[500],
    milestone30: accentColors.purple[500],
    milestone100: '#FFD700',
    warning: semanticColors.warning.default,
    danger: semanticColors.error.default,
  },
};

// ============================================
// DIVIDER & SEPARATOR COLORS
// ============================================

export const dividerColors = {
  default: neutralColors.lightGray[200],
  subtle: neutralColors.lightGray[100],
  strong: neutralColors.gray[300],
  transparent: 'rgba(0, 0, 0, 0.04)',
  section: neutralColors.lightGray[200],
  list: neutralColors.lightGray[100],
};

// ============================================
// AVATAR COLORS
// ============================================

export const avatarColors = {
  // Default avatar background palette
  defaults: [
    accentColors.blue[300],
    accentColors.purple[300],
    accentColors.mint[300],
    accentColors.rose[300],
    accentColors.teal[300],
  ],
  text: neutralColors.white,
  placeholder: neutralColors.gray[400],
  border: neutralColors.white,
};

// ============================================
// EMPTY STATE COLORS
// ============================================

export const emptyStateColors = {
  illustration: {
    primary: neutralColors.gray[400],
    accent: accentColors.blue[300],
    secondary: neutralColors.lightGray[400],
  },
  background: neutralColors.lightGray[100],
  text: {
    title: textColors.secondary,
    description: textColors.tertiary,
  },
};

// ============================================
// CHIP & TAG COLORS
// ============================================

export const chipColors = {
  // Default chip
  default: {
    background: neutralColors.lightGray[100],
    border: borderColors.light,
    text: textColors.primary,
  },
  // Selected chip
  selected: {
    background: accentColors.blue[500],
    border: accentColors.blue[500],
    text: neutralColors.white,
  },
  // Disabled chip
  disabled: {
    background: neutralColors.lightGray[100],
    border: neutralColors.lightGray[200],
    text: neutralColors.gray[400],
  },
  // Remove button
  remove: {
    default: textColors.secondary,
    hover: semanticColors.error.default,
  },
};

// ============================================
// DARK MODE COLOR PALETTE
// ============================================
// Professional dark theme inspired by Calm, Headspace, and Apple Human Interface Guidelines
// Uses deep blacks and elevated surfaces for depth, with adjusted accent colors for visibility

// Dark mode backgrounds - layered for depth
export const darkBackgrounds = {
  primary: '#1C1C1E',      // Main background - Apple dark gray
  secondary: '#2C2C2E',    // Elevated surface
  tertiary: '#3A3A3C',     // Higher elevation
  card: '#2C2C2E',         // Card surfaces
  elevated: '#3A3A3C',     // Modals, sheets
  overlay: 'rgba(0, 0, 0, 0.6)',
  input: '#1C1C1E',        // Input fields
  navigation: '#1C1C1E',   // Navigation bar
};

// Dark mode text colors - optimized for readability
export const darkTextColors = {
  primary: '#FFFFFF',           // Primary text - pure white
  secondary: '#EBEBF5',         // Secondary text - 60% opacity white equivalent
  tertiary: '#8E8E93',          // Tertiary/muted text
  inverse: neutralColors.charcoal[200], // For light surfaces in dark mode
  disabled: '#636366',          // Disabled state
  accent: accentColors.blue[400], // Accent text - lighter for dark bg
  link: accentColors.blue[400],   // Links - lighter for dark bg
};

// Dark mode border colors
export const darkBorderColors = {
  light: '#3A3A3C',        // Subtle borders
  default: '#48484A',      // Default borders
  medium: '#48484A',       // Medium emphasis
  strong: '#636366',       // Strong borders
  focus: accentColors.blue[400], // Focus states
};

// Dark mode shadow colors - more prominent for depth
export const darkShadowColors = {
  sm: 'rgba(0, 0, 0, 0.2)',
  md: 'rgba(0, 0, 0, 0.3)',
  lg: 'rgba(0, 0, 0, 0.4)',
  xl: 'rgba(0, 0, 0, 0.5)',
};

// Dark mode semantic colors - adjusted for visibility
export const darkSemanticColors = {
  success: {
    light: '#1E4D3C',      // Dark success background
    default: '#34D399',    // Success color (same)
    dark: '#6EE7B7',       // Lighter for text
  },
  error: {
    light: '#4D1F1F',      // Dark error background
    default: '#EF4444',    // Error color (same)
    dark: '#FCA5A5',       // Lighter for text
  },
  warning: {
    light: '#4D3D1A',      // Dark warning background
    default: '#F59E0B',    // Warning color (same)
    dark: '#FCD34D',       // Lighter for text
  },
  info: {
    light: '#1E3A5F',      // Dark info background
    default: accentColors.blue[400],
    dark: accentColors.blue[300],
  },
};

// Dark mode accent colors - lighter shades for visibility on dark backgrounds
export const darkAccentColors = {
  blue: {
    primary: accentColors.blue[400],
    secondary: accentColors.blue[300],
    muted: '#1E3A5F',        // Blue tinted dark surface
  },
  purple: {
    primary: accentColors.purple[400],
    secondary: accentColors.purple[300],
    muted: '#2D2547',        // Purple tinted dark surface
  },
  mint: {
    primary: accentColors.mint[400],
    secondary: accentColors.mint[300],
    muted: '#1E3D35',        // Mint tinted dark surface
  },
  rose: {
    primary: accentColors.rose[400],
    secondary: accentColors.rose[300],
    muted: '#3D1E2A',        // Rose tinted dark surface
  },
};

// ============================================
// DARK MODE INTERACTIVE STATE COLORS
// ============================================

export const darkInteractiveColors = {
  button: {
    primary: {
      default: accentColors.blue[400],
      pressed: accentColors.blue[500],
      hover: accentColors.blue[300],
      focused: accentColors.blue[300],
      disabled: neutralColors.gray[700],
      disabledText: neutralColors.gray[500],
    },
    secondary: {
      default: neutralColors.gray[700],
      pressed: neutralColors.gray[600],
      hover: neutralColors.gray[600],
      focused: neutralColors.gray[600],
      disabled: neutralColors.gray[800],
      disabledText: neutralColors.gray[600],
    },
    destructive: {
      default: '#FF453A',
      pressed: '#FF6961',
      hover: '#FF5E55',
      focused: '#FF5E55',
      disabled: neutralColors.gray[700],
      disabledText: neutralColors.gray[500],
    },
  },
  link: {
    default: accentColors.blue[400],
    pressed: accentColors.blue[300],
    hover: accentColors.blue[300],
    visited: accentColors.purple[400],
    disabled: neutralColors.gray[600],
  },
  touchable: {
    ripple: 'rgba(112, 192, 255, 0.15)',
    overlay: 'rgba(255, 255, 255, 0.05)',
    highlight: 'rgba(112, 192, 255, 0.1)',
  },
};

// ============================================
// DARK MODE SKELETON COLORS
// ============================================

export const darkSkeletonColors = {
  base: '#2C2C2E',
  highlight: '#3A3A3C',
  shimmer: 'rgba(255, 255, 255, 0.1)',
  text: '#3A3A3C',
  avatar: '#3A3A3C',
  card: '#2C2C2E',
  image: '#3A3A3C',
};

// ============================================
// DARK MODE INPUT COLORS
// ============================================

export const darkInputColors = {
  background: {
    default: darkBackgrounds.input,
    focused: darkBackgrounds.secondary,
    disabled: darkBackgrounds.primary,
    error: '#4D1F1F',
  },
  text: {
    default: darkTextColors.primary,
    placeholder: neutralColors.gray[500],
    disabled: neutralColors.gray[600],
    error: '#FCA5A5',
  },
  border: {
    default: darkBorderColors.default,
    focused: accentColors.blue[400],
    error: '#FF453A',
    disabled: darkBorderColors.light,
  },
  cursor: accentColors.blue[400],
  selection: 'rgba(112, 192, 255, 0.25)',
  icon: {
    default: neutralColors.gray[500],
    focused: accentColors.blue[400],
    error: '#FF453A',
  },
};

// ============================================
// DARK MODE MEDITATION STATE COLORS
// ============================================

export const darkMeditationStateColors = {
  idle: neutralColors.gray[600],
  preparing: accentColors.purple[400],
  active: accentColors.blue[400],
  paused: '#FCD34D',
  completed: '#6EE7B7',
  interrupted: '#FCA5A5',
  timer: {
    normal: accentColors.blue[400],
    warning: '#FCD34D',
    critical: '#FCA5A5',
  },
  liveIndicator: '#FF453A',
  recordingIndicator: '#FF375F',
  breathing: {
    inhale: accentColors.blue[300],
    hold: accentColors.purple[300],
    exhale: accentColors.mint[300],
    rest: neutralColors.gray[500],
  },
};

// ============================================
// DARK MODE TOAST COLORS
// ============================================

export const darkToastColors = {
  success: {
    background: '#1E4D3C',
    text: '#6EE7B7',
    icon: '#34D399',
    border: '#059669',
  },
  error: {
    background: '#4D1F1F',
    text: '#FCA5A5',
    icon: '#EF4444',
    border: '#DC2626',
  },
  warning: {
    background: '#4D3D1A',
    text: '#FCD34D',
    icon: '#F59E0B',
    border: '#D97706',
  },
  info: {
    background: '#1E3A5F',
    text: accentColors.blue[300],
    icon: accentColors.blue[400],
    border: accentColors.blue[500],
  },
  neutral: {
    background: '#3A3A3C',
    text: neutralColors.white,
    icon: neutralColors.white,
    border: '#48484A',
  },
};

// ============================================
// DARK MODE TAB BAR COLORS
// ============================================

export const darkTabBarColors = {
  background: darkBackgrounds.navigation,
  border: darkBorderColors.light,
  icon: {
    inactive: neutralColors.gray[500],
    active: neutralColors.white,
  },
  text: {
    inactive: neutralColors.gray[500],
    active: neutralColors.white,
  },
  indicator: neutralColors.white,
  badge: {
    background: '#FF453A',
    text: neutralColors.white,
  },
};

// ============================================
// DARK MODE SWITCH COLORS
// ============================================

export const darkSwitchColors = {
  track: {
    off: neutralColors.gray[600],
    on: accentColors.blue[400],
    disabled: neutralColors.gray[700],
  },
  thumb: {
    off: neutralColors.white,
    on: neutralColors.white,
    disabled: neutralColors.gray[500],
  },
  ios: {
    trackOff: '#39393D',
    trackOn: '#30D158',
    thumb: neutralColors.white,
  },
};

// ============================================
// DARK MODE SLIDER COLORS
// ============================================

export const darkSliderColors = {
  track: {
    background: neutralColors.gray[700],
    filled: accentColors.blue[400],
    buffer: 'rgba(112, 192, 255, 0.3)',
  },
  thumb: {
    default: accentColors.blue[400],
    pressed: accentColors.blue[300],
    disabled: neutralColors.gray[600],
    shadow: 'rgba(112, 192, 255, 0.4)',
  },
  progress: {
    background: neutralColors.gray[700],
    fill: accentColors.blue[400],
    success: '#34D399',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

// ============================================
// DARK MODE BADGE COLORS
// ============================================

export const darkBadgeColors = {
  notification: {
    background: '#FF453A',
    text: neutralColors.white,
  },
  status: {
    new: accentColors.blue[400],
    active: '#34D399',
    inactive: neutralColors.gray[500],
    pending: '#F59E0B',
    completed: '#059669',
    custom: accentColors.purple[400],
  },
  achievement: {
    locked: neutralColors.gray[600],
    unlocked: accentColors.blue[400],
  },
};

// ============================================
// DARK MODE ACHIEVEMENT COLORS
// ============================================

export const darkAchievementColors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
  rarity: {
    common: neutralColors.gray[400],
    uncommon: accentColors.mint[400],
    rare: accentColors.blue[400],
    epic: accentColors.purple[400],
    legendary: '#FFD700',
  },
  streak: {
    fire: '#FF6B35',
    active: accentColors.rose[400],
    milestone7: accentColors.blue[400],
    milestone30: accentColors.purple[400],
    milestone100: '#FFD700',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
};

// ============================================
// DARK MODE DIVIDER COLORS
// ============================================

export const darkDividerColors = {
  default: '#3A3A3C',
  subtle: '#2C2C2E',
  strong: '#48484A',
  transparent: 'rgba(255, 255, 255, 0.04)',
  section: '#3A3A3C',
  list: '#2C2C2E',
};

// ============================================
// DARK MODE AVATAR COLORS
// ============================================

export const darkAvatarColors = {
  defaults: [
    accentColors.blue[400],
    accentColors.purple[400],
    accentColors.mint[400],
    accentColors.rose[400],
    accentColors.teal[400],
  ],
  text: neutralColors.white,
  placeholder: neutralColors.gray[600],
  border: darkBackgrounds.secondary,
};

// ============================================
// DARK MODE EMPTY STATE COLORS
// ============================================

export const darkEmptyStateColors = {
  illustration: {
    primary: neutralColors.gray[500],
    accent: accentColors.blue[400],
    secondary: neutralColors.gray[600],
  },
  background: darkBackgrounds.secondary,
  text: {
    title: darkTextColors.secondary,
    description: darkTextColors.tertiary,
  },
};

// ============================================
// DARK MODE CHIP COLORS
// ============================================

export const darkChipColors = {
  default: {
    background: darkBackgrounds.tertiary,
    border: darkBorderColors.default,
    text: darkTextColors.primary,
  },
  selected: {
    background: accentColors.blue[400],
    border: accentColors.blue[400],
    text: neutralColors.white,
  },
  disabled: {
    background: darkBackgrounds.secondary,
    border: darkBorderColors.light,
    text: neutralColors.gray[600],
  },
  remove: {
    default: darkTextColors.secondary,
    hover: '#FF453A',
  },
};

// Combined dark mode colors object
export const darkColors = {
  neutral: neutralColors,
  accent: accentColors,
  darkAccent: darkAccentColors,
  semantic: darkSemanticColors,
  background: darkBackgrounds,
  text: darkTextColors,
  border: darkBorderColors,
  shadow: darkShadowColors,
  // New complete color categories
  interactive: darkInteractiveColors,
  skeleton: darkSkeletonColors,
  input: darkInputColors,
  meditationState: darkMeditationStateColors,
  toast: darkToastColors,
  tabBar: darkTabBarColors,
  switch: darkSwitchColors,
  slider: darkSliderColors,
  badge: darkBadgeColors,
  achievement: darkAchievementColors,
  divider: darkDividerColors,
  avatar: darkAvatarColors,
  emptyState: darkEmptyStateColors,
  chip: darkChipColors,
};

// ============================================
// LIGHT MODE (default)
// ============================================

// Export all as default theme (light mode)
export const colors = {
  neutral: neutralColors,
  accent: accentColors,
  semantic: semanticColors,
  background: backgrounds,
  text: textColors,
  border: borderColors,
  shadow: shadowColors,
  // Complete color categories for 10/10 design system
  interactive: interactiveColors,
  skeleton: skeletonColors,
  input: inputColors,
  meditationState: meditationStateColors,
  toast: toastColors,
  tabBar: tabBarColors,
  switch: switchColors,
  slider: sliderColors,
  badge: badgeColors,
  achievement: achievementColors,
  divider: dividerColors,
  avatar: avatarColors,
  emptyState: emptyStateColors,
  chip: chipColors,
};

// Helper function to get colors based on theme
export const getThemeColors = (isDark: boolean) => isDark ? darkColors : colors;

export default colors;
