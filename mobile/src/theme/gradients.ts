/**
 * Minimal & Calm Gradient Definitions
 *
 * Subtle gradients using whites, grays, and soft accent colors.
 * Designed to create a peaceful, clean, and modern aesthetic.
 */

import { neutralColors, accentColors, darkBackgrounds, brandColors } from './colors';

export interface GradientDefinition {
  colors: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

/**
 * Primary gradients - Main app backgrounds
 */
export const primaryGradients = {
  // Clean white gradient (default)
  clean: {
    colors: [neutralColors.white, neutralColors.offWhite],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Soft gray gradient
  softGray: {
    colors: [neutralColors.lightGray[100], neutralColors.lightGray[200]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Subtle blue gradient
  subtleBlue: {
    colors: [accentColors.blue[100], neutralColors.white],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Soft lavender gradient
  softLavender: {
    colors: [accentColors.lavender[100], neutralColors.white],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Calm mint gradient
  calmMint: {
    colors: [accentColors.mint[100], neutralColors.white],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

/**
 * Card gradients - For meditation session cards and UI elements
 */
export const cardGradients = {
  // Pure white card (no gradient, solid white background)
  whiteCard: {
    colors: [neutralColors.white, neutralColors.white],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Light card (very subtle)
  lightCard: {
    colors: [neutralColors.white, neutralColors.offWhite],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Soft blue card
  // ✨ UPDATED - Now uses 500/600 for WCAG AA compliance with white text
  blueCard: {
    colors: [accentColors.blue[500], accentColors.blue[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Purple card (for feature tiles)
  purpleCard: {
    colors: [accentColors.lavender[500], accentColors.lavender[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Lavender card
  lavenderCard: {
    colors: [accentColors.lavender[100], accentColors.lavender[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Mint card (light)
  mintCard: {
    colors: [accentColors.mint[100], accentColors.mint[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Mint card strong (vivid) - for active states and session cards
  mintCardStrong: {
    colors: [accentColors.mint[400], accentColors.mint[500]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Rose card
  roseCard: {
    colors: [accentColors.rose[100], accentColors.rose[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Beginner session card - more visible gradient
  beginner: {
    colors: [accentColors.blue[200], accentColors.blue[100]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Intermediate session card
  intermediate: {
    colors: [accentColors.lavender[200], accentColors.lavender[100]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Advanced session card
  advanced: {
    colors: [accentColors.mint[200], accentColors.mint[100]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Expert session card
  expert: {
    colors: [accentColors.blue[300], accentColors.lavender[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Master session card
  master: {
    colors: [accentColors.lavender[300], accentColors.mint[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * Screen-specific gradients
 * ✅ WCAG 2.2 Level AA Compliant - Updated to use darker colors for better contrast
 */
export const screenGradients = {
  // Home screen background - very subtle
  home: {
    colors: [neutralColors.white, neutralColors.lightGray[100]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Meditation timer background - calming blue
  // ✨ UPDATED - Now uses 600/700 for WCAG AA compliance (6.36:1 contrast)
  timer: {
    colors: [accentColors.blue[600], accentColors.blue[700]], // was [200], [300]
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Preparation screen - soft lavender
  // ✨ UPDATED - Now uses 600/700 for WCAG AA compliance (6.52:1 contrast)
  preparation: {
    colors: [accentColors.lavender[600], accentColors.lavender[700]], // was [200], [300]
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Celebration screen - joyful rose (kept light for positive feeling)
  celebration: {
    colors: [accentColors.rose[100], accentColors.rose[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Quotes screen - peaceful mint (already WCAG compliant)
  quotes: {
    colors: [accentColors.mint[100], accentColors.mint[200]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

/**
 * Button gradients
 */
export const buttonGradients = {
  // Primary CTA button - brand purple
  primary: {
    colors: [brandColors.purple.light, brandColors.purple.primary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Secondary button - lavender
  secondary: {
    colors: [accentColors.lavender[500], accentColors.lavender[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Success button - mint
  success: {
    colors: [accentColors.mint[500], accentColors.mint[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Accent button - rose
  accent: {
    colors: [accentColors.rose[500], accentColors.rose[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Subtle button - minimal
  subtle: {
    colors: [neutralColors.gray[100], neutralColors.gray[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Disabled button - gray
  disabled: {
    colors: [neutralColors.gray[200], neutralColors.gray[300]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

/**
 * Overlay gradients - For creating depth and focus
 */
export const overlayGradients = {
  // Fade to dark (bottom to top)
  darkFadeUp: {
    colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Fade to dark (top to bottom)
  darkFadeDown: {
    colors: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Fade to light (bottom to top)
  lightFadeUp: {
    colors: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Fade to light (top to bottom)
  lightFadeDown: {
    colors: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Soft white overlay
  softWhite: {
    colors: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Soft gray overlay
  softGray: {
    colors: ['rgba(245, 245, 247, 0.6)', 'rgba(245, 245, 247, 0.9)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

/**
 * Shimmer gradients - For loading states and animations
 */
export const shimmerGradients = {
  light: {
    colors: [
      'rgba(255, 255, 255, 0)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(255, 255, 255, 0)',
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  subtle: {
    colors: [
      neutralColors.lightGray[100],
      neutralColors.lightGray[200],
      neutralColors.lightGray[100],
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  blue: {
    colors: [
      accentColors.blue[100],
      accentColors.blue[200],
      accentColors.blue[100],
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

/**
 * Session statistics gradients - For HomeScreen stat cards
 */
export const sessionGradients = {
  // Streak counter - warm rose gradient
  streak: {
    colors: [accentColors.rose[500], accentColors.rose[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Duration/time counter - calm lavender gradient
  duration: {
    colors: [accentColors.lavender[500], accentColors.lavender[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Sessions completed - refreshing mint gradient
  completions: {
    colors: [accentColors.mint[500], accentColors.mint[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * Helper function to get gradient based on meditation level
 */
export const getGradientForLevel = (level: string): GradientDefinition => {
  const levelGradients: Record<string, GradientDefinition> = {
    beginner: cardGradients.beginner,
    intermediate: cardGradients.intermediate,
    advanced: cardGradients.advanced,
    expert: cardGradients.expert,
    master: cardGradients.master,
  };

  return levelGradients[level.toLowerCase()] || cardGradients.beginner;
};

// ============================================
// DARK MODE GRADIENTS
// ============================================
// Professional dark theme gradients using dark surfaces with subtle color tints

/**
 * Dark mode primary gradients - Main app backgrounds
 */
export const darkPrimaryGradients = {
  // Clean dark gradient (default)
  clean: {
    colors: [darkBackgrounds.primary, darkBackgrounds.secondary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Soft gray gradient
  softGray: {
    colors: [darkBackgrounds.secondary, darkBackgrounds.tertiary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Subtle blue gradient - dark tinted
  subtleBlue: {
    colors: ['#1A2633', darkBackgrounds.primary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Soft lavender gradient - dark tinted
  softLavender: {
    colors: ['#1F1A2E', darkBackgrounds.primary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Calm mint gradient - dark tinted
  calmMint: {
    colors: ['#1A2926', darkBackgrounds.primary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

/**
 * Dark mode card gradients
 */
export const darkCardGradients = {
  // Dark card
  whiteCard: {
    colors: [darkBackgrounds.card, darkBackgrounds.card],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Light card
  lightCard: {
    colors: [darkBackgrounds.card, darkBackgrounds.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Blue card - subtle blue tint
  blueCard: {
    colors: ['#1A3A5F', '#1E4470'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Purple card
  purpleCard: {
    colors: ['#2D2547', '#382E54'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Lavender card
  lavenderCard: {
    colors: ['#252040', '#2A2545'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Mint card
  mintCard: {
    colors: ['#1E3D35', '#234540'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Mint card strong (vivid) - for active states and session cards
  mintCardStrong: {
    colors: [accentColors.mint[500], accentColors.mint[600]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Rose card
  roseCard: {
    colors: ['#3D1E2A', '#452330'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Beginner session card
  beginner: {
    colors: ['#1A3A5F', darkBackgrounds.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Intermediate session card
  intermediate: {
    colors: ['#2D2547', darkBackgrounds.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Advanced session card
  advanced: {
    colors: ['#1E3D35', darkBackgrounds.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Expert session card
  expert: {
    colors: ['#1A3A5F', '#2D2547'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Master session card
  master: {
    colors: ['#2D2547', '#1E3D35'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * Dark mode screen gradients
 */
export const darkScreenGradients = {
  // Home screen background
  home: {
    colors: [darkBackgrounds.primary, darkBackgrounds.secondary],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Meditation timer background
  timer: {
    colors: ['#1A3A5F', '#1E4470'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Preparation screen
  preparation: {
    colors: ['#2D2547', '#382E54'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Celebration screen
  celebration: {
    colors: ['#3D1E2A', '#452330'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Quotes screen
  quotes: {
    colors: ['#1E3D35', '#234540'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

/**
 * Dark mode button gradients
 */
export const darkButtonGradients = {
  // Primary CTA button - brand purple
  primary: {
    colors: [brandColors.purple.primary, brandColors.purple.dark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Secondary button
  secondary: {
    colors: [accentColors.lavender[400], accentColors.lavender[500]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Success button
  success: {
    colors: [accentColors.mint[400], accentColors.mint[500]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Accent button
  accent: {
    colors: [accentColors.rose[400], accentColors.rose[500]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Subtle button
  subtle: {
    colors: [darkBackgrounds.tertiary, neutralColors.gray[700]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  // Disabled button
  disabled: {
    colors: [neutralColors.gray[800], neutralColors.gray[700]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

/**
 * Dark mode shimmer gradients
 */
export const darkShimmerGradients = {
  light: {
    colors: [
      'rgba(255, 255, 255, 0)',
      'rgba(255, 255, 255, 0.1)',
      'rgba(255, 255, 255, 0)',
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  subtle: {
    colors: [
      darkBackgrounds.secondary,
      darkBackgrounds.tertiary,
      darkBackgrounds.secondary,
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  blue: {
    colors: [
      '#1A3A5F',
      '#1E4470',
      '#1A3A5F',
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

/**
 * Dark mode session gradients
 */
export const darkSessionGradients = {
  // Streak counter
  streak: {
    colors: ['#5D2E3D', '#6E3548'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Duration counter
  duration: {
    colors: ['#3D3560', '#4A4070'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Sessions completed
  completions: {
    colors: ['#2E5D4D', '#386E5A'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * Combined dark mode gradients
 */
export const darkGradients = {
  primary: darkPrimaryGradients,
  card: darkCardGradients,
  screen: darkScreenGradients,
  button: darkButtonGradients,
  overlay: overlayGradients, // Same overlays work for both modes
  shimmer: darkShimmerGradients,
  session: darkSessionGradients,
  getGradientForLevel: (level: string): GradientDefinition => {
    const levelGradients: Record<string, GradientDefinition> = {
      beginner: darkCardGradients.beginner,
      intermediate: darkCardGradients.intermediate,
      advanced: darkCardGradients.advanced,
      expert: darkCardGradients.expert,
      master: darkCardGradients.master,
    };
    return levelGradients[level.toLowerCase()] || darkCardGradients.beginner;
  },
};

// ============================================
// LIGHT MODE GRADIENTS (default)
// ============================================

// Export all gradients (light mode)
export const gradients = {
  primary: primaryGradients,
  card: cardGradients,
  screen: screenGradients,
  button: buttonGradients,
  overlay: overlayGradients,
  shimmer: shimmerGradients,
  session: sessionGradients,
  getGradientForLevel,
};

// Helper function to get gradients based on theme
export const getThemeGradients = (isDark: boolean) => isDark ? darkGradients : gradients;

export default gradients;
