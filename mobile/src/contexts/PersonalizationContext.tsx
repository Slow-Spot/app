/**
 * PersonalizationContext
 *
 * Manages user customization preferences for app styling.
 * Allows users to change primary colors, accent colors, and themes.
 * Also integrates with system-level accessibility settings.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { logger } from '../utils/logger';
import {
  useReducedMotion,
  useSystemFontScale,
  useRTL,
  useLocaleSettings,
  useTimezone,
} from '../hooks/useSystemSettings';

const PERSONALIZATION_STORAGE_KEY = '@slow_spot_personalization';

// Predefined color themes - organized by category for better UX
export const COLOR_THEMES = {
  // === MODERN & TRENDY ===
  violet: {
    name: 'Violet',
    nameKey: 'personalization.themes.violet',
    primary: '#8B5CF6',
    gradient: ['#6366F1', '#8B5CF6', '#A855F7'] as const,
    category: 'modern',
  },
  indigo: {
    name: 'Indigo',
    nameKey: 'personalization.themes.indigo',
    primary: '#6366F1',
    gradient: ['#4F46E5', '#6366F1', '#818CF8'] as const,
    category: 'modern',
  },
  electric: {
    name: 'Electric',
    nameKey: 'personalization.themes.electric',
    primary: '#7C3AED',
    gradient: ['#5B21B6', '#7C3AED', '#A78BFA'] as const,
    category: 'modern',
  },
  neon: {
    name: 'Neon',
    nameKey: 'personalization.themes.neon',
    primary: '#A855F7',
    gradient: ['#7E22CE', '#A855F7', '#C084FC'] as const,
    category: 'modern',
  },
  cyber: {
    name: 'Cyber',
    nameKey: 'personalization.themes.cyber',
    primary: '#06B6D4',
    gradient: ['#0891B2', '#06B6D4', '#22D3EE'] as const,
    category: 'modern',
  },

  // === OCEAN & SKY ===
  blue: {
    name: 'Blue',
    nameKey: 'personalization.themes.blue',
    primary: '#3B82F6',
    gradient: ['#2563EB', '#3B82F6', '#60A5FA'] as const,
    category: 'ocean',
  },
  sky: {
    name: 'Sky',
    nameKey: 'personalization.themes.sky',
    primary: '#0EA5E9',
    gradient: ['#0284C7', '#0EA5E9', '#38BDF8'] as const,
    category: 'ocean',
  },
  ocean: {
    name: 'Ocean',
    nameKey: 'personalization.themes.ocean',
    primary: '#0369A1',
    gradient: ['#075985', '#0369A1', '#0284C7'] as const,
    category: 'ocean',
  },
  aqua: {
    name: 'Aqua',
    nameKey: 'personalization.themes.aqua',
    primary: '#14B8A6',
    gradient: ['#0D9488', '#14B8A6', '#2DD4BF'] as const,
    category: 'ocean',
  },

  // === NATURE & EARTH ===
  teal: {
    name: 'Teal',
    nameKey: 'personalization.themes.teal',
    primary: '#14B8A6',
    gradient: ['#0D9488', '#14B8A6', '#2DD4BF'] as const,
    category: 'nature',
  },
  emerald: {
    name: 'Emerald',
    nameKey: 'personalization.themes.emerald',
    primary: '#10B981',
    gradient: ['#059669', '#10B981', '#34D399'] as const,
    category: 'nature',
  },
  forest: {
    name: 'Forest',
    nameKey: 'personalization.themes.forest',
    primary: '#22C55E',
    gradient: ['#16A34A', '#22C55E', '#4ADE80'] as const,
    category: 'nature',
  },
  mint: {
    name: 'Mint',
    nameKey: 'personalization.themes.mint',
    primary: '#34D399',
    gradient: ['#10B981', '#34D399', '#6EE7B7'] as const,
    category: 'nature',
  },
  lime: {
    name: 'Lime',
    nameKey: 'personalization.themes.lime',
    primary: '#84CC16',
    gradient: ['#65A30D', '#84CC16', '#A3E635'] as const,
    category: 'nature',
  },

  // === WARM & SUNSET ===
  amber: {
    name: 'Amber',
    nameKey: 'personalization.themes.amber',
    primary: '#F59E0B',
    gradient: ['#D97706', '#F59E0B', '#FBBF24'] as const,
    category: 'warm',
  },
  orange: {
    name: 'Orange',
    nameKey: 'personalization.themes.orange',
    primary: '#F97316',
    gradient: ['#EA580C', '#F97316', '#FB923C'] as const,
    category: 'warm',
  },
  sunset: {
    name: 'Sunset',
    nameKey: 'personalization.themes.sunset',
    primary: '#FB7185',
    gradient: ['#F43F5E', '#FB7185', '#FDA4AF'] as const,
    category: 'warm',
  },
  coral: {
    name: 'Coral',
    nameKey: 'personalization.themes.coral',
    primary: '#FF6B6B',
    gradient: ['#EE5A5A', '#FF6B6B', '#FF8787'] as const,
    category: 'warm',
  },
  peach: {
    name: 'Peach',
    nameKey: 'personalization.themes.peach',
    primary: '#FDBA74',
    gradient: ['#FB923C', '#FDBA74', '#FED7AA'] as const,
    category: 'warm',
  },

  // === ROMANTIC & SOFT ===
  rose: {
    name: 'Rose',
    nameKey: 'personalization.themes.rose',
    primary: '#F43F5E',
    gradient: ['#E11D48', '#F43F5E', '#FB7185'] as const,
    category: 'romantic',
  },
  pink: {
    name: 'Pink',
    nameKey: 'personalization.themes.pink',
    primary: '#EC4899',
    gradient: ['#DB2777', '#EC4899', '#F472B6'] as const,
    category: 'romantic',
  },
  fuchsia: {
    name: 'Fuchsia',
    nameKey: 'personalization.themes.fuchsia',
    primary: '#D946EF',
    gradient: ['#C026D3', '#D946EF', '#E879F9'] as const,
    category: 'romantic',
  },
  magenta: {
    name: 'Magenta',
    nameKey: 'personalization.themes.magenta',
    primary: '#E11D48',
    gradient: ['#BE123C', '#E11D48', '#F43F5E'] as const,
    category: 'romantic',
  },
  lavender: {
    name: 'Lavender',
    nameKey: 'personalization.themes.lavender',
    primary: '#C4B5FD',
    gradient: ['#A78BFA', '#C4B5FD', '#DDD6FE'] as const,
    category: 'romantic',
  },

  // === ELEGANT & MINIMAL ===
  slate: {
    name: 'Slate',
    nameKey: 'personalization.themes.slate',
    primary: '#64748B',
    gradient: ['#475569', '#64748B', '#94A3B8'] as const,
    category: 'elegant',
  },
  zinc: {
    name: 'Zinc',
    nameKey: 'personalization.themes.zinc',
    primary: '#71717A',
    gradient: ['#52525B', '#71717A', '#A1A1AA'] as const,
    category: 'elegant',
  },
  charcoal: {
    name: 'Charcoal',
    nameKey: 'personalization.themes.charcoal',
    primary: '#374151',
    gradient: ['#1F2937', '#374151', '#4B5563'] as const,
    category: 'elegant',
  },
  silver: {
    name: 'Silver',
    nameKey: 'personalization.themes.silver',
    primary: '#9CA3AF',
    gradient: ['#6B7280', '#9CA3AF', '#D1D5DB'] as const,
    category: 'elegant',
  },

  // === PREMIUM & LUXURY ===
  gold: {
    name: 'Gold',
    nameKey: 'personalization.themes.gold',
    primary: '#EAB308',
    gradient: ['#CA8A04', '#EAB308', '#FACC15'] as const,
    category: 'premium',
  },
  bronze: {
    name: 'Bronze',
    nameKey: 'personalization.themes.bronze',
    primary: '#CD7F32',
    gradient: ['#A66828', '#CD7F32', '#D4A574'] as const,
    category: 'premium',
  },
  ruby: {
    name: 'Ruby',
    nameKey: 'personalization.themes.ruby',
    primary: '#DC2626',
    gradient: ['#B91C1C', '#DC2626', '#EF4444'] as const,
    category: 'premium',
  },
  sapphire: {
    name: 'Sapphire',
    nameKey: 'personalization.themes.sapphire',
    primary: '#1D4ED8',
    gradient: ['#1E3A8A', '#1D4ED8', '#3B82F6'] as const,
    category: 'premium',
  },
  amethyst: {
    name: 'Amethyst',
    nameKey: 'personalization.themes.amethyst',
    primary: '#9333EA',
    gradient: ['#7E22CE', '#9333EA', '#A855F7'] as const,
    category: 'premium',
  },
} as const;

// Theme categories for organized display
export const THEME_CATEGORIES = {
  modern: {
    name: 'Modern',
    nameKey: 'personalization.categories.modern',
  },
  ocean: {
    name: 'Ocean & Sky',
    nameKey: 'personalization.categories.ocean',
  },
  nature: {
    name: 'Nature',
    nameKey: 'personalization.categories.nature',
  },
  warm: {
    name: 'Warm',
    nameKey: 'personalization.categories.warm',
  },
  romantic: {
    name: 'Romantic',
    nameKey: 'personalization.categories.romantic',
  },
  elegant: {
    name: 'Elegant',
    nameKey: 'personalization.categories.elegant',
  },
  premium: {
    name: 'Premium',
    nameKey: 'personalization.categories.premium',
  },
} as const;

export type ThemeCategory = keyof typeof THEME_CATEGORIES;

export type ColorThemeKey = keyof typeof COLOR_THEMES | 'custom';

// Custom theme interface
export interface CustomTheme {
  name: string;
  primary: string;
  gradient: readonly [string, string, string];
}

// Personalization settings interface
export interface PersonalizationSettings {
  colorTheme: ColorThemeKey;
  customTheme?: CustomTheme;
  // Additional personalization options
  hapticEnabled: boolean;
  soundEffectsEnabled: boolean;
  animationsEnabled: boolean;
  // Accessibility options
  highContrastMode: boolean;
  largerTextMode: boolean;
  // System preference overrides
  followSystemReduceMotion: boolean; // When true, respects system reduce motion setting
  followSystemFontSize: boolean; // When true, respects system font scale
  // Meditation UX options
  zenMode: boolean; // When true, hides all UI during meditation except breathing circle
}

// Default settings
const DEFAULT_SETTINGS: PersonalizationSettings = {
  colorTheme: 'violet', // Default brand color
  hapticEnabled: true,
  soundEffectsEnabled: false,
  animationsEnabled: true,
  highContrastMode: false,
  largerTextMode: false,
  followSystemReduceMotion: true, // Respect system accessibility by default
  followSystemFontSize: true, // Respect system font size by default
  zenMode: false, // Show full UI by default
};

/**
 * Zod schema dla walidacji PersonalizationSettings z AsyncStorage
 */
const PersonalizationSettingsSchema = z.object({
  colorTheme: z.string().optional(),
  customTheme: z.object({
    name: z.string(),
    primary: z.string(),
    gradient: z.tuple([z.string(), z.string(), z.string()]),
  }).optional(),
  hapticEnabled: z.boolean().optional(),
  soundEffectsEnabled: z.boolean().optional(),
  animationsEnabled: z.boolean().optional(),
  highContrastMode: z.boolean().optional(),
  largerTextMode: z.boolean().optional(),
  followSystemReduceMotion: z.boolean().optional(),
  followSystemFontSize: z.boolean().optional(),
  zenMode: z.boolean().optional(),
});

// Helper function to generate gradient from primary color
export const generateGradientFromColor = (color: string): readonly [string, string, string] => {
  // Parse hex color
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Create darker shade (gradient start)
  const darkerR = Math.max(0, Math.round(r * 0.75));
  const darkerG = Math.max(0, Math.round(g * 0.75));
  const darkerB = Math.max(0, Math.round(b * 0.75));
  const darker = `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;

  // Create lighter shade (gradient end)
  const lighterR = Math.min(255, Math.round(r + (255 - r) * 0.3));
  const lighterG = Math.min(255, Math.round(g + (255 - g) * 0.3));
  const lighterB = Math.min(255, Math.round(b + (255 - b) * 0.3));
  const lighter = `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;

  return [darker, color, lighter] as const;
};

// Theme data type (same structure as predefined themes)
interface ThemeData {
  name: string;
  nameKey: string;
  primary: string;
  gradient: readonly [string, string, string];
  category?: string;
}

// System settings interface
export interface SystemSettingsInfo {
  reduceMotionEnabled: boolean;
  systemFontScale: number;
  isRTL: boolean;
  timezone: string;
  timezoneOffset: number;
  timezoneAbbreviation: string;
  locale: string;
  languageCode: string;
  regionCode: string | null;
  uses24HourClock: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  measurementSystem: 'metric' | 'us' | 'uk';
  currencyCode: string | null;
  currencySymbol: string | null;
  decimalSeparator: string;
  groupingSeparator: string;
}

interface PersonalizationContextType {
  settings: PersonalizationSettings;
  currentTheme: ThemeData;
  systemSettings: SystemSettingsInfo;
  // Computed values that combine user + system preferences
  effectiveAnimationsEnabled: boolean;
  effectiveFontScale: number;
  // Setters
  setColorTheme: (theme: ColorThemeKey) => Promise<void>;
  setCustomTheme: (primary: string, name?: string) => Promise<void>;
  setHapticEnabled: (enabled: boolean) => Promise<void>;
  setSoundEffectsEnabled: (enabled: boolean) => Promise<void>;
  setAnimationsEnabled: (enabled: boolean) => Promise<void>;
  setHighContrastMode: (enabled: boolean) => Promise<void>;
  setLargerTextMode: (enabled: boolean) => Promise<void>;
  setFollowSystemReduceMotion: (enabled: boolean) => Promise<void>;
  setFollowSystemFontSize: (enabled: boolean) => Promise<void>;
  setZenMode: (enabled: boolean) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
  // Formatting helpers from locale
  formatNumber: (num: number, decimals?: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date) => string;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PersonalizationSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // System settings hooks
  const systemReduceMotion = useReducedMotion();
  const systemFontScale = useSystemFontScale();
  const rtlInfo = useRTL();
  const timezoneInfo = useTimezone();
  const localeInfo = useLocaleSettings();

  // Combine system settings into a single object
  const systemSettings: SystemSettingsInfo = useMemo(() => ({
    reduceMotionEnabled: systemReduceMotion,
    systemFontScale,
    isRTL: rtlInfo.isRTL,
    timezone: timezoneInfo.timezone,
    timezoneOffset: timezoneInfo.offset,
    timezoneAbbreviation: timezoneInfo.abbreviation,
    locale: localeInfo.locale,
    languageCode: localeInfo.languageCode,
    regionCode: localeInfo.regionCode,
    uses24HourClock: localeInfo.uses24HourClock,
    temperatureUnit: localeInfo.temperatureUnit,
    measurementSystem: localeInfo.measurementSystem,
    currencyCode: localeInfo.currencyCode,
    currencySymbol: localeInfo.currencySymbol,
    decimalSeparator: localeInfo.decimalSeparator,
    groupingSeparator: localeInfo.groupingSeparator,
  }), [
    systemReduceMotion,
    systemFontScale,
    rtlInfo.isRTL,
    timezoneInfo,
    localeInfo,
  ]);

  // Computed effective values that combine user + system preferences
  const effectiveAnimationsEnabled = useMemo(() => {
    // If following system and system has reduce motion enabled, disable animations
    if (settings.followSystemReduceMotion && systemReduceMotion) {
      return false;
    }
    // Otherwise, use user's animation preference
    return settings.animationsEnabled;
  }, [settings.followSystemReduceMotion, settings.animationsEnabled, systemReduceMotion]);

  const effectiveFontScale = useMemo(() => {
    let scale = 1.0;

    // Apply system font scale if following system
    if (settings.followSystemFontSize) {
      scale *= systemFontScale;
    }

    // Apply user's larger text preference
    if (settings.largerTextMode) {
      scale *= 1.2;
    }

    // Cap at 1.5x to prevent UI breaking
    return Math.min(scale, 1.5);
  }, [settings.followSystemFontSize, settings.largerTextMode, systemFontScale]);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(PERSONALIZATION_STORAGE_KEY);
        if (stored) {
          const zodResult = PersonalizationSettingsSchema.safeParse(JSON.parse(stored));
          if (!zodResult.success) {
            logger.warn('Invalid personalization settings in storage, using defaults');
          } else {
            // Merge with defaults to handle new fields
            const mergedSettings: PersonalizationSettings = {
              ...DEFAULT_SETTINGS,
              ...zodResult.data,
            } as PersonalizationSettings;
            // Validate that the stored theme exists or is custom
            if (mergedSettings.colorTheme === 'custom' && mergedSettings.customTheme) {
              setSettings(mergedSettings);
            } else if (mergedSettings.colorTheme && mergedSettings.colorTheme !== 'custom' && COLOR_THEMES[mergedSettings.colorTheme as keyof typeof COLOR_THEMES]) {
              setSettings(mergedSettings);
            }
          }
        }
      } catch (error) {
        logger.warn('Failed to load personalization settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings helper
  const saveSettings = useCallback(async (newSettings: PersonalizationSettings) => {
    try {
      await AsyncStorage.setItem(PERSONALIZATION_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      logger.error('Failed to save personalization settings:', error);
      throw error;
    }
  }, []);

  // Set color theme
  const setColorTheme = useCallback(async (theme: ColorThemeKey) => {
    await saveSettings({ ...settings, colorTheme: theme });
  }, [settings, saveSettings]);

  // Set custom theme
  const setCustomTheme = useCallback(async (primary: string, name?: string) => {
    const customTheme: CustomTheme = {
      name: name || 'Custom',
      primary,
      gradient: generateGradientFromColor(primary),
    };
    await saveSettings({
      ...settings,
      colorTheme: 'custom',
      customTheme,
    });
  }, [settings, saveSettings]);

  // Set haptic feedback
  const setHapticEnabled = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, hapticEnabled: enabled });
  }, [settings, saveSettings]);

  // Set sound effects
  const setSoundEffectsEnabled = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, soundEffectsEnabled: enabled });
  }, [settings, saveSettings]);

  // Set animations
  const setAnimationsEnabled = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, animationsEnabled: enabled });
  }, [settings, saveSettings]);

  // Set high contrast mode
  const setHighContrastMode = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, highContrastMode: enabled });
  }, [settings, saveSettings]);

  // Set larger text mode
  const setLargerTextMode = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, largerTextMode: enabled });
  }, [settings, saveSettings]);

  // Set follow system reduce motion
  const setFollowSystemReduceMotion = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, followSystemReduceMotion: enabled });
  }, [settings, saveSettings]);

  // Set follow system font size
  const setFollowSystemFontSize = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, followSystemFontSize: enabled });
  }, [settings, saveSettings]);

  // Set zen mode (hide UI during meditation)
  const setZenMode = useCallback(async (enabled: boolean) => {
    await saveSettings({ ...settings, zenMode: enabled });
  }, [settings, saveSettings]);

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    await saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  // Get current theme object
  const currentTheme: ThemeData = useMemo(() => {
    if (settings.colorTheme === 'custom' && settings.customTheme) {
      return {
        name: settings.customTheme.name,
        nameKey: 'personalization.themes.custom',
        primary: settings.customTheme.primary,
        gradient: settings.customTheme.gradient,
        category: 'custom',
      };
    }
    const predefinedTheme = COLOR_THEMES[settings.colorTheme as keyof typeof COLOR_THEMES];
    if (predefinedTheme) {
      return predefinedTheme;
    }
    // Fallback to default
    return COLOR_THEMES.violet;
  }, [settings.colorTheme, settings.customTheme]);

  return (
    <PersonalizationContext.Provider
      value={{
        settings,
        currentTheme,
        systemSettings,
        effectiveAnimationsEnabled,
        effectiveFontScale,
        setColorTheme,
        setCustomTheme,
        setHapticEnabled,
        setSoundEffectsEnabled,
        setAnimationsEnabled,
        setHighContrastMode,
        setLargerTextMode,
        setFollowSystemReduceMotion,
        setFollowSystemFontSize,
        setZenMode,
        resetToDefaults,
        isLoading,
        formatNumber: localeInfo.formatNumber,
        formatCurrency: localeInfo.formatCurrency,
        formatDate: localeInfo.formatDate,
        formatTime: localeInfo.formatTime,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

// Hook to use personalization context
export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

// Helper hook to get dynamic brand colors based on personalization
export const usePersonalizedColors = () => {
  const { currentTheme } = usePersonalization();

  return {
    primary: currentTheme.primary,
    gradient: currentTheme.gradient,
    transparent: {
      light10: `${currentTheme.primary}1A`, // 10% opacity
      light15: `${currentTheme.primary}26`, // 15% opacity
      light20: `${currentTheme.primary}33`, // 20% opacity
      light25: `${currentTheme.primary}40`, // 25% opacity
    },
  };
};

// High contrast color adjustments for accessibility
export const HIGH_CONTRAST_ADJUSTMENTS = {
  light: {
    text: '#000000',
    textSecondary: '#1C1C1E',
    background: '#FFFFFF',
    border: '#000000',
    // Increased contrast for UI elements
    cardBackground: '#FFFFFF',
    divider: '#000000',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#F5F5F5',
    background: '#000000',
    border: '#FFFFFF',
    // Increased contrast for UI elements
    cardBackground: '#1C1C1E',
    divider: '#FFFFFF',
  },
};

// Hook to get accessibility-adjusted colors
export const useAccessibilityColors = (isDark: boolean) => {
  const { settings, currentTheme } = usePersonalization();

  if (settings.highContrastMode) {
    const contrastColors = isDark
      ? HIGH_CONTRAST_ADJUSTMENTS.dark
      : HIGH_CONTRAST_ADJUSTMENTS.light;

    return {
      ...contrastColors,
      primary: currentTheme.primary,
      gradient: currentTheme.gradient,
      isHighContrast: true,
    };
  }

  // Return null to indicate standard colors should be used
  return null;
};

// Hook to get text size multiplier for larger text mode
// Now uses effectiveFontScale which combines user preference with system font scale
export const useTextSizeMultiplier = () => {
  const { effectiveFontScale } = usePersonalization();
  return effectiveFontScale;
};

// Hook to check if animations should be enabled
// Combines user preference with system reduce motion setting
export const useEffectiveAnimations = () => {
  const { effectiveAnimationsEnabled } = usePersonalization();
  return effectiveAnimationsEnabled;
};

// Hook to get system settings
export const useSystemSettingsInfo = () => {
  const { systemSettings } = usePersonalization();
  return systemSettings;
};

// Hook for RTL-aware styles
export const useRTLStyles = () => {
  const { systemSettings } = usePersonalization();
  return {
    isRTL: systemSettings.isRTL,
    direction: systemSettings.isRTL ? 'rtl' : 'ltr',
    textAlign: systemSettings.isRTL ? 'right' : 'left',
    flexDirection: systemSettings.isRTL ? 'row-reverse' : 'row',
  } as const;
};

// Hook for locale-aware formatting
export const useLocaleFormatting = () => {
  const { formatNumber, formatCurrency, formatDate, formatTime, systemSettings } = usePersonalization();
  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    locale: systemSettings.locale,
    uses24HourClock: systemSettings.uses24HourClock,
    temperatureUnit: systemSettings.temperatureUnit,
    measurementSystem: systemSettings.measurementSystem,
  };
};

export default PersonalizationContext;
