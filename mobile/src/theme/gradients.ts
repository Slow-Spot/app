/**
 * Minimal & Calm Gradient Definitions
 *
 * Subtle gradients using whites, grays, and soft accent colors.
 * Designed to create a peaceful, clean, and modern aesthetic.
 */

import { neutralColors, accentColors } from './colors';

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
  // Light card (very subtle)
  lightCard: {
    colors: [neutralColors.white, neutralColors.offWhite],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Soft blue card
  blueCard: {
    colors: [accentColors.blue[100], accentColors.blue[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Lavender card
  lavenderCard: {
    colors: [accentColors.lavender[100], accentColors.lavender[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Mint card
  mintCard: {
    colors: [accentColors.mint[100], accentColors.mint[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Rose card
  roseCard: {
    colors: [accentColors.rose[100], accentColors.rose[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Beginner session card
  beginner: {
    colors: [accentColors.blue[100], neutralColors.offWhite],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Intermediate session card
  intermediate: {
    colors: [accentColors.lavender[100], neutralColors.offWhite],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Advanced session card
  advanced: {
    colors: [accentColors.mint[100], neutralColors.offWhite],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Expert session card
  expert: {
    colors: [accentColors.blue[200], accentColors.lavender[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Master session card
  master: {
    colors: [accentColors.lavender[200], accentColors.mint[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

/**
 * Screen-specific gradients
 */
export const screenGradients = {
  // Home screen background - very subtle
  home: {
    colors: [neutralColors.white, neutralColors.lightGray[100]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Meditation timer background - calming blue
  timer: {
    colors: [accentColors.blue[200], accentColors.blue[300]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Preparation screen - soft lavender
  preparation: {
    colors: [accentColors.lavender[200], accentColors.lavender[300]],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  // Celebration screen - joyful rose
  celebration: {
    colors: [accentColors.rose[100], accentColors.rose[200]],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Quotes screen - peaceful mint
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
  // Primary CTA button - soft blue
  primary: {
    colors: [accentColors.blue[500], accentColors.blue[600]],
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

// Export all gradients
export const gradients = {
  primary: primaryGradients,
  card: cardGradients,
  screen: screenGradients,
  button: buttonGradients,
  overlay: overlayGradients,
  shimmer: shimmerGradients,
  getGradientForLevel,
};

export default gradients;
