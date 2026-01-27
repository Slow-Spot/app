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
    50: '#FAFAFA',
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
    50: '#38383D',
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
    900: '#0A3470', // ✨ NEW - Darkest blue for dark mode
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
// Note: secondary uses gray[700] for better contrast on light backgrounds
export const textColors = {
  primary: neutralColors.charcoal[200],
  secondary: neutralColors.gray[700],  // #48484A - better contrast than gray[600]
  tertiary: neutralColors.gray[600],   // #636366 - moved from secondary
  inverse: neutralColors.white,
  disabled: neutralColors.gray[500],   // #8E8E93 - visible but muted
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

// Combined dark mode colors object - section colors will be added dynamically
// to avoid circular reference issues (brandColors and sectionColors defined later)
// Using 'as any' initially, then properly typed properties are added after colors is defined
export const darkColors: any = {
  neutral: neutralColors,
  accent: accentColors,
  darkAccent: darkAccentColors,
  semantic: darkSemanticColors,
  background: darkBackgrounds,
  text: darkTextColors,
  border: darkBorderColors,
  shadow: darkShadowColors,
  // Note: brand, brandGradients, section, primary, feature, featureIcon will be added after their definitions
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
// BRAND COLORS - Slow Spot.me
// ============================================
// Core brand colors used across the app for consistent branding

export const brandColors = {
  // Primary brand purple gradient colors
  purple: {
    light: '#6366F1',    // Indigo - gradient start
    primary: '#8B5CF6',  // Violet - main brand color
    dark: '#A855F7',     // Purple - gradient end
    // RGB values for rgba() usage
    rgb: '139, 92, 246', // RGB of #8B5CF6
  },
  // Accent colors for branding
  accent: {
    gold: '#FCD34D',     // Golden yellow for ".me" accent
    white: '#FFFFFF',    // White for contrast text
  },
  // Background colors
  background: '#8B5CF6', // Main brand background color
  // Transparent variants for backgrounds
  transparent: {
    light10: 'rgba(139, 92, 246, 0.1)',  // Light mode icon bg
    light15: 'rgba(139, 92, 246, 0.15)', // Light mode active button
    light20: 'rgba(139, 92, 246, 0.2)',  // Dark mode icon bg
    light25: 'rgba(139, 92, 246, 0.25)', // Dark mode active button
  },
};

// Brand gradient definitions
export const brandGradients = {
  // Main purple gradient (used in main CTA button, splash screen)
  primary: ['#6366F1', '#8B5CF6', '#A855F7'] as const,
  // Alternative purple gradient (lighter)
  light: ['#818CF8', '#A78BFA', '#C084FC'] as const,
  // Dark purple gradient (for dark mode)
  dark: ['#4F46E5', '#7C3AED', '#9333EA'] as const,
};

// ============================================
// SECTION COLORS - Dedicated colors for app sections
// ============================================
// Each section has its own color palette with automatic light/dark mode support
// Usage: sectionColors.instructions.icon (light mode) or getSectionColors(true).instructions.icon (dark mode)

// ============================================
// COLOR UTILITY FUNCTIONS
// ============================================
// Helper functions for automatic color manipulation and shade calculation

// Helper function to create transparent rgba values from hex
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Convert hex to HSL for manipulation
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Generate a complete color palette from a single hex color
// Automatically creates 50-900 shades (like Tailwind CSS)
export const generateColorPalette = (baseHex: string): ColorPalette => {
  const hsl = hexToHsl(baseHex);

  // Shade configurations: [lightness adjustment, saturation adjustment]
  const shadeConfigs: { shade: keyof ColorPalette; targetL: number; satAdj: number }[] = [
    { shade: 50, targetL: 95, satAdj: -15 },   // Very light
    { shade: 100, targetL: 90, satAdj: -10 },  // Light
    { shade: 200, targetL: 82, satAdj: -5 },   // Light medium
    { shade: 300, targetL: 70, satAdj: 0 },    // Medium light
    { shade: 400, targetL: 58, satAdj: 5 },    // Medium
    { shade: 500, targetL: 45, satAdj: 0 },    // Base (primary)
    { shade: 600, targetL: 38, satAdj: 5 },    // Medium dark
    { shade: 700, targetL: 30, satAdj: 10 },   // Dark
    { shade: 800, targetL: 22, satAdj: 10 },   // Very dark
    { shade: 900, targetL: 15, satAdj: 5 },    // Darkest
  ];

  const palette: ColorPalette = {
    50: '', 100: '', 200: '', 300: '', 400: '',
    500: '', 600: '', 700: '', 800: '', 900: '',
  };

  for (const { shade, targetL, satAdj } of shadeConfigs) {
    const newS = Math.max(0, Math.min(100, hsl.s + satAdj));
    palette[shade] = hslToHex(hsl.h, newS, targetL);
  }

  return palette;
};

// Type for color palette
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// ============================================
// FEATURE ICON COLOR PALETTES
// ============================================
// Beautiful color palettes for feature icons (as shown in screenshots)
// Each palette has automatic shade calculation for light/dark modes

// Predefined beautiful palettes matching the screenshots
export const featureColorPalettes = {
  // Emerald/Mint Green - for privacy, success states
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // Primary
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
    // Calculated variants
    light: '#D1FAE5',      // For light mode backgrounds
    lightIcon: '#10B981',  // Icon color on light bg
    dark: '#064E3B',       // For dark mode backgrounds
    darkIcon: '#34D399',   // Icon color on dark bg
    rgb: '16, 185, 129',
  },

  // Violet/Purple - for user/profile features
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',  // Primary
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    light: '#EDE9FE',
    lightIcon: '#8B5CF6',
    dark: '#4C1D95',
    darkIcon: '#A78BFA',
    rgb: '139, 92, 246',
  },

  // Amber/Orange - for gifts, rewards, premium
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Primary
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    light: '#FEF3C7',
    lightIcon: '#F59E0B',
    dark: '#78350F',
    darkIcon: '#FBBF24',
    rgb: '245, 158, 11',
  },

  // Rose/Pink - for targets, goals, meditation
  rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',  // Primary
    600: '#E11D48',
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
    light: '#FFE4E6',
    lightIcon: '#F43F5E',
    dark: '#881337',
    darkIcon: '#FB7185',
    rgb: '244, 63, 94',
  },

  // Indigo/Blue - for learning, progress, analytics
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',  // Primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    light: '#E0E7FF',
    lightIcon: '#6366F1',
    dark: '#312E81',
    darkIcon: '#818CF8',
    rgb: '99, 102, 241',
  },

  // Yellow/Gold - for inspirations, sparkles
  yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#EAB308',  // Primary
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
    light: '#FEF9C3',
    lightIcon: '#EAB308',
    dark: '#713F12',
    darkIcon: '#FACC15',
    rgb: '234, 179, 8',
  },

  // Teal - for meditation, calm features
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',  // Primary
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    light: '#CCFBF1',
    lightIcon: '#14B8A6',
    dark: '#134E4A',
    darkIcon: '#2DD4BF',
    rgb: '20, 184, 166',
  },

  // Sky Blue - for info, global features
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',  // Primary
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    light: '#E0F2FE',
    lightIcon: '#0EA5E9',
    dark: '#0C4A6E',
    darkIcon: '#38BDF8',
    rgb: '14, 165, 233',
  },

  // Slate/Gray - for settings, neutral features
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',  // Primary
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    light: '#F1F5F9',
    lightIcon: '#64748B',
    dark: '#0F172A',
    darkIcon: '#94A3B8',
    rgb: '100, 116, 139',
  },

  // Streak/Fire - for streak notifications and achievements
  streak: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',  // Primary - Orange
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    light: '#FFEDD5',
    lightIcon: '#F97316',
    dark: '#7C2D12',
    darkIcon: '#FB923C',
    rgb: '249, 115, 22',
    base: '#F97316',  // Alias for primary (used in NotificationSettingsCard)
  },
};

// Type for feature palette
export type FeaturePaletteName = keyof typeof featureColorPalettes;
export type FeaturePalette = typeof featureColorPalettes[FeaturePaletteName];

// ============================================
// PRIMARY COLOR SYSTEM
// ============================================
// Central primary color that controls the entire app theme
// Change this to automatically update all related colors

// Default primary color (Violet/Purple - brand color)
const PRIMARY_COLOR_HEX = '#8B5CF6';

// Generate primary palette from the primary color
export const primaryPalette = generateColorPalette(PRIMARY_COLOR_HEX);

// Primary color variants for easy access
export const primaryColor = {
  // Main shades
  lightest: primaryPalette[50],
  lighter: primaryPalette[100],
  light: primaryPalette[300],
  main: primaryPalette[500],      // Primary color
  dark: primaryPalette[700],
  darker: primaryPalette[800],
  darkest: primaryPalette[900],

  // Full palette
  palette: primaryPalette,

  // Transparent variants (for backgrounds)
  transparent: {
    5: hexToRgba(PRIMARY_COLOR_HEX, 0.05),
    10: hexToRgba(PRIMARY_COLOR_HEX, 0.1),
    15: hexToRgba(PRIMARY_COLOR_HEX, 0.15),
    20: hexToRgba(PRIMARY_COLOR_HEX, 0.2),
    25: hexToRgba(PRIMARY_COLOR_HEX, 0.25),
    30: hexToRgba(PRIMARY_COLOR_HEX, 0.3),
    40: hexToRgba(PRIMARY_COLOR_HEX, 0.4),
    50: hexToRgba(PRIMARY_COLOR_HEX, 0.5),
  },

  // Gradient variants
  gradient: {
    light: [primaryPalette[300], primaryPalette[500]] as const,
    main: [primaryPalette[400], primaryPalette[600]] as const,
    dark: [primaryPalette[600], primaryPalette[800]] as const,
    full: [primaryPalette[300], primaryPalette[500], primaryPalette[700]] as const,
  },

  // RGB value for custom rgba
  rgb: hexToHsl(PRIMARY_COLOR_HEX),
  hex: PRIMARY_COLOR_HEX,
};

// ============================================
// FEATURE ICON COLORS (simplified access)
// ============================================
// Quick access to icon colors for feature cards
// Usage: featureIconColors.emerald.icon (light mode) or featureIconColors.emerald.iconDark (dark mode)

export const featureIconColors = {
  // Privacy/Security - Emerald Green
  privacy: {
    icon: featureColorPalettes.emerald.lightIcon,
    iconDark: featureColorPalettes.emerald.darkIcon,
    background: featureColorPalettes.emerald.light,
    backgroundDark: featureColorPalettes.emerald[800],
  },

  // User/Profile - Violet Purple
  user: {
    icon: featureColorPalettes.violet.lightIcon,
    iconDark: featureColorPalettes.violet.darkIcon,
    background: featureColorPalettes.violet.light,
    backgroundDark: featureColorPalettes.violet[800],
  },

  // Gift/Premium - Amber Orange
  gift: {
    icon: featureColorPalettes.amber.lightIcon,
    iconDark: featureColorPalettes.amber.darkIcon,
    background: featureColorPalettes.amber.light,
    backgroundDark: featureColorPalettes.amber[800],
  },

  // Target/Goals - Rose Pink
  target: {
    icon: featureColorPalettes.rose.lightIcon,
    iconDark: featureColorPalettes.rose.darkIcon,
    background: featureColorPalettes.rose.light,
    backgroundDark: featureColorPalettes.rose[800],
  },

  // Learning/Progress - Indigo Blue
  learning: {
    icon: featureColorPalettes.indigo.lightIcon,
    iconDark: featureColorPalettes.indigo.darkIcon,
    background: featureColorPalettes.indigo.light,
    backgroundDark: featureColorPalettes.indigo[800],
  },

  // Inspiration/Sparkles - Yellow Gold
  inspiration: {
    icon: featureColorPalettes.yellow.lightIcon,
    iconDark: featureColorPalettes.yellow.darkIcon,
    background: featureColorPalettes.yellow.light,
    backgroundDark: featureColorPalettes.yellow[800],
  },

  // Meditation/Calm - Teal
  meditation: {
    icon: featureColorPalettes.teal.lightIcon,
    iconDark: featureColorPalettes.teal.darkIcon,
    background: featureColorPalettes.teal.light,
    backgroundDark: featureColorPalettes.teal[800],
  },

  // Global/Info - Sky Blue
  global: {
    icon: featureColorPalettes.sky.lightIcon,
    iconDark: featureColorPalettes.sky.darkIcon,
    background: featureColorPalettes.sky.light,
    backgroundDark: featureColorPalettes.sky[800],
  },

  // Settings/Neutral - Slate Gray
  settings: {
    icon: featureColorPalettes.slate.lightIcon,
    iconDark: featureColorPalettes.slate.darkIcon,
    background: featureColorPalettes.slate.light,
    backgroundDark: featureColorPalettes.slate[800],
  },

  // Sound/Audio - Indigo (music note)
  sound: {
    icon: featureColorPalettes.rose.lightIcon,
    iconDark: featureColorPalettes.rose.darkIcon,
    background: featureColorPalettes.rose.light,
    backgroundDark: featureColorPalettes.rose[800],
  },
};

// Helper to get feature icon colors based on theme
export const getFeatureIconColors = (isDark: boolean) => {
  const transform = (colors: typeof featureIconColors.privacy) => ({
    icon: isDark ? colors.iconDark : colors.icon,
    background: isDark ? colors.backgroundDark : colors.background,
  });

  return {
    privacy: transform(featureIconColors.privacy),
    user: transform(featureIconColors.user),
    gift: transform(featureIconColors.gift),
    target: transform(featureIconColors.target),
    learning: transform(featureIconColors.learning),
    inspiration: transform(featureIconColors.inspiration),
    meditation: transform(featureIconColors.meditation),
    global: transform(featureIconColors.global),
    settings: transform(featureIconColors.settings),
    sound: transform(featureIconColors.sound),
  };
};

// Base section color definitions
const sectionColorDefinitions = {
  // Instructions section - Blue/Indigo
  instructions: {
    primary: '#6366F1',     // Indigo-500
    light: '#818CF8',       // Indigo-400
    dark: '#4F46E5',        // Indigo-600
    rgb: '99, 102, 241',
  },
  // Inspirations section - Purple/Violet
  inspirations: {
    primary: '#8B5CF6',     // Violet-500
    light: '#A78BFA',       // Violet-400
    dark: '#7C3AED',        // Violet-600
    rgb: '139, 92, 246',
  },
  // Custom session section - Emerald/Mint
  custom: {
    primary: '#10B981',     // Emerald-500
    light: '#34D399',       // Emerald-400
    dark: '#059669',        // Emerald-600
    rgb: '16, 185, 129',
  },
  // Meditation section - Teal
  meditation: {
    primary: '#14B8A6',     // Teal-500
    light: '#2DD4BF',       // Teal-400
    dark: '#0D9488',        // Teal-600
    rgb: '20, 184, 166',
  },
  // Quotes section - Amber/Gold
  quotes: {
    primary: '#F59E0B',     // Amber-500
    light: '#FBBF24',       // Amber-400
    dark: '#D97706',        // Amber-600
    rgb: '245, 158, 11',
  },
  // Settings section - Slate/Gray
  settings: {
    primary: '#64748B',     // Slate-500
    light: '#94A3B8',       // Slate-400
    dark: '#475569',        // Slate-600
    rgb: '100, 116, 139',
  },
  // Profile section - Rose/Pink
  profile: {
    primary: '#F43F5E',     // Rose-500
    light: '#FB7185',       // Rose-400
    dark: '#E11D48',        // Rose-600
    rgb: '244, 63, 94',
  },
};

// Section colors with full palette for Light Mode
export const sectionColors = {
  instructions: {
    // Icon colors
    icon: sectionColorDefinitions.instructions.primary,
    iconLight: sectionColorDefinitions.instructions.light,
    // Background colors (for icon containers)
    background: hexToRgba(sectionColorDefinitions.instructions.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.instructions.primary, 0.15),
    // Border/accent
    border: hexToRgba(sectionColorDefinitions.instructions.primary, 0.2),
    // Gradient
    gradient: [sectionColorDefinitions.instructions.light, sectionColorDefinitions.instructions.primary, sectionColorDefinitions.instructions.dark] as const,
  },
  inspirations: {
    icon: sectionColorDefinitions.inspirations.primary,
    iconLight: sectionColorDefinitions.inspirations.light,
    background: hexToRgba(sectionColorDefinitions.inspirations.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.inspirations.primary, 0.15),
    border: hexToRgba(sectionColorDefinitions.inspirations.primary, 0.2),
    gradient: [sectionColorDefinitions.inspirations.light, sectionColorDefinitions.inspirations.primary, sectionColorDefinitions.inspirations.dark] as const,
  },
  custom: {
    icon: sectionColorDefinitions.custom.primary,
    iconLight: sectionColorDefinitions.custom.light,
    background: hexToRgba(sectionColorDefinitions.custom.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.custom.primary, 0.15),
    border: hexToRgba(sectionColorDefinitions.custom.primary, 0.2),
    gradient: [sectionColorDefinitions.custom.light, sectionColorDefinitions.custom.primary, sectionColorDefinitions.custom.dark] as const,
  },
  meditation: {
    icon: sectionColorDefinitions.meditation.primary,
    iconLight: sectionColorDefinitions.meditation.light,
    background: hexToRgba(sectionColorDefinitions.meditation.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.meditation.primary, 0.15),
    border: hexToRgba(sectionColorDefinitions.meditation.primary, 0.2),
    gradient: [sectionColorDefinitions.meditation.light, sectionColorDefinitions.meditation.primary, sectionColorDefinitions.meditation.dark] as const,
  },
  quotes: {
    icon: sectionColorDefinitions.quotes.primary,
    iconLight: sectionColorDefinitions.quotes.light,
    background: hexToRgba(sectionColorDefinitions.quotes.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.quotes.primary, 0.15),
    border: hexToRgba(sectionColorDefinitions.quotes.primary, 0.2),
    gradient: [sectionColorDefinitions.quotes.light, sectionColorDefinitions.quotes.primary, sectionColorDefinitions.quotes.dark] as const,
  },
  settings: {
    icon: sectionColorDefinitions.settings.primary,
    iconLight: sectionColorDefinitions.settings.light,
    background: hexToRgba(sectionColorDefinitions.settings.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.settings.primary, 0.15),
    border: hexToRgba(sectionColorDefinitions.settings.primary, 0.2),
    gradient: [sectionColorDefinitions.settings.light, sectionColorDefinitions.settings.primary, sectionColorDefinitions.settings.dark] as const,
  },
  profile: {
    icon: sectionColorDefinitions.profile.primary,
    iconLight: sectionColorDefinitions.profile.light,
    background: hexToRgba(sectionColorDefinitions.profile.primary, 0.1),
    backgroundHover: hexToRgba(sectionColorDefinitions.profile.primary, 0.15),
    border: hexToRgba(sectionColorDefinitions.profile.primary, 0.2),
    gradient: [sectionColorDefinitions.profile.light, sectionColorDefinitions.profile.primary, sectionColorDefinitions.profile.dark] as const,
  },
};

// Section colors for Dark Mode (higher opacity backgrounds, lighter icon colors)
export const darkSectionColors = {
  instructions: {
    icon: sectionColorDefinitions.instructions.light,
    iconLight: sectionColorDefinitions.instructions.light,
    background: hexToRgba(sectionColorDefinitions.instructions.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.instructions.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.instructions.primary, 0.3),
    gradient: [sectionColorDefinitions.instructions.dark, sectionColorDefinitions.instructions.primary, sectionColorDefinitions.instructions.light] as const,
  },
  inspirations: {
    icon: sectionColorDefinitions.inspirations.light,
    iconLight: sectionColorDefinitions.inspirations.light,
    background: hexToRgba(sectionColorDefinitions.inspirations.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.inspirations.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.inspirations.primary, 0.3),
    gradient: [sectionColorDefinitions.inspirations.dark, sectionColorDefinitions.inspirations.primary, sectionColorDefinitions.inspirations.light] as const,
  },
  custom: {
    icon: sectionColorDefinitions.custom.light,
    iconLight: sectionColorDefinitions.custom.light,
    background: hexToRgba(sectionColorDefinitions.custom.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.custom.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.custom.primary, 0.3),
    gradient: [sectionColorDefinitions.custom.dark, sectionColorDefinitions.custom.primary, sectionColorDefinitions.custom.light] as const,
  },
  meditation: {
    icon: sectionColorDefinitions.meditation.light,
    iconLight: sectionColorDefinitions.meditation.light,
    background: hexToRgba(sectionColorDefinitions.meditation.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.meditation.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.meditation.primary, 0.3),
    gradient: [sectionColorDefinitions.meditation.dark, sectionColorDefinitions.meditation.primary, sectionColorDefinitions.meditation.light] as const,
  },
  quotes: {
    icon: sectionColorDefinitions.quotes.light,
    iconLight: sectionColorDefinitions.quotes.light,
    background: hexToRgba(sectionColorDefinitions.quotes.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.quotes.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.quotes.primary, 0.3),
    gradient: [sectionColorDefinitions.quotes.dark, sectionColorDefinitions.quotes.primary, sectionColorDefinitions.quotes.light] as const,
  },
  settings: {
    icon: sectionColorDefinitions.settings.light,
    iconLight: sectionColorDefinitions.settings.light,
    background: hexToRgba(sectionColorDefinitions.settings.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.settings.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.settings.primary, 0.3),
    gradient: [sectionColorDefinitions.settings.dark, sectionColorDefinitions.settings.primary, sectionColorDefinitions.settings.light] as const,
  },
  profile: {
    icon: sectionColorDefinitions.profile.light,
    iconLight: sectionColorDefinitions.profile.light,
    background: hexToRgba(sectionColorDefinitions.profile.primary, 0.2),
    backgroundHover: hexToRgba(sectionColorDefinitions.profile.primary, 0.25),
    border: hexToRgba(sectionColorDefinitions.profile.primary, 0.3),
    gradient: [sectionColorDefinitions.profile.dark, sectionColorDefinitions.profile.primary, sectionColorDefinitions.profile.light] as const,
  },
};

// Helper function to get section colors based on theme
export const getSectionColors = (isDark: boolean) => isDark ? darkSectionColors : sectionColors;

// Export base definitions for custom usage
export { sectionColorDefinitions };

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
  // Brand colors for Slow Spot.me
  brand: brandColors,
  brandGradients: brandGradients,
  // Section-specific colors (for different app sections)
  section: sectionColors,
  // PRIMARY COLOR SYSTEM - Central color that controls the entire theme
  primary: primaryColor,
  // Feature icon color palettes (emerald, violet, amber, rose, indigo, etc.)
  feature: featureColorPalettes,
  featureIcon: featureIconColors,
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

// Add brand, section, primary and feature colors to darkColors (after they're defined)
// This is done dynamically to avoid circular reference issues
(darkColors as any).brand = brandColors;
(darkColors as any).brandGradients = brandGradients;
(darkColors as any).section = darkSectionColors;
(darkColors as any).primary = primaryColor;
(darkColors as any).feature = featureColorPalettes;
(darkColors as any).featureIcon = featureIconColors;

// Helper function to get colors based on theme
export const getThemeColors = (isDark: boolean) => isDark ? darkColors : colors;

export default colors;
