/**
 * useSystemSettings Hook
 *
 * Comprehensive hook for detecting and responding to system-level settings.
 * Provides real-time updates for:
 * - Reduced motion preference (accessibility)
 * - System font scale
 * - Color scheme changes (dark/light mode)
 * - RTL layout direction
 * - Timezone and regional settings
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  AppStateStatus} from 'react-native';
import {
  AccessibilityInfo,
  Appearance,
  PixelRatio,
  I18nManager,
  AppState,
  useColorScheme,
} from 'react-native';
import * as Localization from 'expo-localization';
import { logger } from '../utils/logger';

// Types for system settings
export interface SystemSettings {
  // Accessibility
  reduceMotionEnabled: boolean;
  screenReaderEnabled: boolean;
  boldTextEnabled: boolean;
  grayscaleEnabled: boolean;
  invertColorsEnabled: boolean;

  // Display
  fontScale: number;
  colorScheme: 'light' | 'dark' | null;

  // Localization
  isRTL: boolean;
  locale: string;
  languageCode: string;
  regionCode: string | null;
  timezone: string;
  uses24HourClock: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  measurementSystem: 'metric' | 'us' | 'uk';

  // Calendar
  calendar: string;
  firstWeekday: number; // 1 = Monday, 7 = Sunday

  // Currency
  currencyCode: string | null;
  currencySymbol: string | null;

  // Decimal separator
  decimalSeparator: string;
  groupingSeparator: string;
}

// Default values
const DEFAULT_SETTINGS: SystemSettings = {
  reduceMotionEnabled: false,
  screenReaderEnabled: false,
  boldTextEnabled: false,
  grayscaleEnabled: false,
  invertColorsEnabled: false,
  fontScale: 1,
  colorScheme: null,
  isRTL: false,
  locale: 'en-US',
  languageCode: 'en',
  regionCode: null,
  timezone: 'UTC',
  uses24HourClock: true,
  temperatureUnit: 'celsius',
  measurementSystem: 'metric',
  calendar: 'gregorian',
  firstWeekday: 1,
  currencyCode: null,
  currencySymbol: null,
  decimalSeparator: '.',
  groupingSeparator: ',',
};

/**
 * Hook to get and listen to all system settings
 */
export const useSystemSettings = (): SystemSettings & {
  refresh: () => Promise<void>;
  isLoading: boolean;
} => {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();

  // Fetch all system settings
  const fetchSettings = useCallback(async () => {
    try {
      // Accessibility settings - fetch in parallel
      const [
        reduceMotion,
        screenReader,
        boldText,
        grayscale,
        invertColors,
      ] = await Promise.all([
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isBoldTextEnabled?.() ?? Promise.resolve(false),
        AccessibilityInfo.isGrayscaleEnabled?.() ?? Promise.resolve(false),
        AccessibilityInfo.isInvertColorsEnabled?.() ?? Promise.resolve(false),
      ]);

      // Localization settings
      const locales = Localization.getLocales();
      const primaryLocale = locales?.[0];
      const calendars = Localization.getCalendars?.() ?? [];
      const primaryCalendar = calendars?.[0];

      // Get regional format settings
      const regionSettings = getRegionalSettings(primaryLocale);

      const newSettings: SystemSettings = {
        // Accessibility
        reduceMotionEnabled: reduceMotion,
        screenReaderEnabled: screenReader,
        boldTextEnabled: boldText,
        grayscaleEnabled: grayscale,
        invertColorsEnabled: invertColors,

        // Display
        fontScale: PixelRatio.getFontScale(),
        colorScheme: colorScheme ?? null,

        // Localization
        isRTL: I18nManager.isRTL,
        locale: primaryLocale?.languageTag ?? 'en-US',
        languageCode: primaryLocale?.languageCode ?? 'en',
        regionCode: primaryLocale?.regionCode ?? null,
        timezone: primaryCalendar?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
        uses24HourClock: primaryCalendar?.uses24hourClock ?? true,
        temperatureUnit: primaryLocale?.temperatureUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
        measurementSystem: primaryLocale?.measurementSystem ?? 'metric',

        // Calendar
        calendar: primaryCalendar?.calendar ?? 'gregorian',
        firstWeekday: primaryCalendar?.firstWeekday ?? 1,

        // Currency
        currencyCode: primaryLocale?.currencyCode ?? null,
        currencySymbol: primaryLocale?.currencySymbol ?? null,

        // Number formatting
        decimalSeparator: regionSettings.decimalSeparator,
        groupingSeparator: regionSettings.groupingSeparator,
      };

      setSettings(newSettings);
    } catch (error) {
      logger.error('Failed to fetch system settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [colorScheme]);

  // Initial fetch
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Listen to accessibility changes
  useEffect(() => {
    const subscriptions: Array<{ remove: () => void }> = [];

    // Reduce motion
    const reduceMotionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setSettings((prev) => ({ ...prev, reduceMotionEnabled: isEnabled }));
        logger.log('System: Reduce motion changed:', isEnabled);
      }
    );
    subscriptions.push(reduceMotionSubscription);

    // Screen reader
    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isEnabled) => {
        setSettings((prev) => ({ ...prev, screenReaderEnabled: isEnabled }));
        logger.log('System: Screen reader changed:', isEnabled);
      }
    );
    subscriptions.push(screenReaderSubscription);

    // Bold text (iOS only)
    if (AccessibilityInfo.addEventListener) {
      try {
        const boldTextSubscription = AccessibilityInfo.addEventListener(
          'boldTextChanged',
          (isEnabled: boolean) => {
            setSettings((prev) => ({ ...prev, boldTextEnabled: isEnabled }));
            logger.log('System: Bold text changed:', isEnabled);
          }
        );
        subscriptions.push(boldTextSubscription);
      } catch {
        // Not supported on this platform
      }

      try {
        const grayscaleSubscription = AccessibilityInfo.addEventListener(
          'grayscaleChanged',
          (isEnabled: boolean) => {
            setSettings((prev) => ({ ...prev, grayscaleEnabled: isEnabled }));
            logger.log('System: Grayscale changed:', isEnabled);
          }
        );
        subscriptions.push(grayscaleSubscription);
      } catch {
        // Not supported on this platform
      }

      try {
        const invertColorsSubscription = AccessibilityInfo.addEventListener(
          'invertColorsChanged',
          (isEnabled: boolean) => {
            setSettings((prev) => ({ ...prev, invertColorsEnabled: isEnabled }));
            logger.log('System: Invert colors changed:', isEnabled);
          }
        );
        subscriptions.push(invertColorsSubscription);
      } catch {
        // Not supported on this platform
      }
    }

    return () => {
      subscriptions.forEach((sub) => sub.remove());
    };
  }, []);

  // Listen to color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      setSettings((prev) => ({ ...prev, colorScheme: newScheme ?? null }));
      logger.log('System: Color scheme changed:', newScheme);
    });

    return () => subscription.remove();
  }, []);

  // Refresh settings when app becomes active (for locale/timezone changes)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        fetchSettings();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [fetchSettings]);

  // Update colorScheme from hook
  useEffect(() => {
    setSettings((prev) => ({ ...prev, colorScheme: colorScheme ?? null }));
  }, [colorScheme]);

  return {
    ...settings,
    refresh: fetchSettings,
    isLoading,
  };
};

/**
 * Hook specifically for reduced motion preference
 */
export const useReducedMotion = (): boolean => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Initial fetch
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => subscription.remove();
  }, []);

  return reduceMotion;
};

/**
 * Hook for system font scale
 */
export const useSystemFontScale = (): number => {
  const [fontScale, setFontScale] = useState(PixelRatio.getFontScale());

  useEffect(() => {
    // Check font scale when app becomes active
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setFontScale(PixelRatio.getFontScale());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  return fontScale;
};

/**
 * Hook for real-time color scheme changes
 */
export const useRealtimeColorScheme = (): 'light' | 'dark' | null => {
  const colorScheme = useColorScheme();
  const [scheme, setScheme] = useState<'light' | 'dark' | null>(colorScheme ?? null);

  useEffect(() => {
    setScheme(colorScheme ?? null);
  }, [colorScheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      setScheme(newScheme ?? null);
    });

    return () => subscription.remove();
  }, []);

  return scheme;
};

/**
 * Hook for timezone detection
 */
export const useTimezone = (): {
  timezone: string;
  offset: number;
  abbreviation: string;
} => {
  const [timezoneInfo, setTimezoneInfo] = useState(() => getTimezoneInfo());

  useEffect(() => {
    // Refresh timezone when app becomes active (user might have traveled)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setTimezoneInfo(getTimezoneInfo());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  return timezoneInfo;
};

/**
 * Hook for RTL support
 */
export const useRTL = (): {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  textAlign: 'left' | 'right';
  flexDirection: 'row' | 'row-reverse';
} => {
  const isRTL = I18nManager.isRTL;

  return useMemo(
    () => ({
      isRTL,
      direction: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    }),
    [isRTL]
  );
};

/**
 * Hook for locale and regional settings
 */
export const useLocaleSettings = (): {
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
  formatNumber: (num: number, decimals?: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date) => string;
} => {
  const locales = Localization.getLocales();
  const primaryLocale = locales?.[0];
  const calendars = Localization.getCalendars?.() ?? [];
  const primaryCalendar = calendars?.[0];

  const locale = primaryLocale?.languageTag ?? 'en-US';
  const regionSettings = getRegionalSettings(primaryLocale);

  const formatNumber = useCallback(
    (num: number, decimals = 2): string => {
      try {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(num);
      } catch {
        return num.toFixed(decimals);
      }
    },
    [locale]
  );

  const formatCurrency = useCallback(
    (amount: number): string => {
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: primaryLocale?.currencyCode ?? 'USD',
        }).format(amount);
      } catch {
        return `${primaryLocale?.currencySymbol ?? '$'}${amount.toFixed(2)}`;
      }
    },
    [locale, primaryLocale?.currencyCode, primaryLocale?.currencySymbol]
  );

  const formatDate = useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions): string => {
      try {
        return new Intl.DateTimeFormat(locale, options).format(date);
      } catch {
        return date.toLocaleDateString();
      }
    },
    [locale]
  );

  const formatTime = useCallback(
    (date: Date): string => {
      try {
        return new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: 'numeric',
          hour12: !(primaryCalendar?.uses24hourClock ?? true),
        }).format(date);
      } catch {
        return date.toLocaleTimeString();
      }
    },
    [locale, primaryCalendar?.uses24hourClock]
  );

  return {
    locale,
    languageCode: primaryLocale?.languageCode ?? 'en',
    regionCode: primaryLocale?.regionCode ?? null,
    uses24HourClock: primaryCalendar?.uses24hourClock ?? true,
    temperatureUnit: primaryLocale?.temperatureUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    measurementSystem: primaryLocale?.measurementSystem ?? 'metric',
    currencyCode: primaryLocale?.currencyCode ?? null,
    currencySymbol: primaryLocale?.currencySymbol ?? null,
    decimalSeparator: regionSettings.decimalSeparator,
    groupingSeparator: regionSettings.groupingSeparator,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
  };
};

// Helper functions

function getTimezoneInfo(): {
  timezone: string;
  offset: number;
  abbreviation: string;
} {
  const calendars = Localization.getCalendars?.() ?? [];
  const timezone = calendars?.[0]?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  const now = new Date();
  const offset = -now.getTimezoneOffset(); // Minutes from UTC

  // Get timezone abbreviation
  let abbreviation = 'UTC';
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart) {
      abbreviation = tzPart.value;
    }
  } catch {
    // Fallback to calculating offset string
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    abbreviation = `UTC${offset >= 0 ? '+' : '-'}${hours}${mins > 0 ? `:${mins}` : ''}`;
  }

  return { timezone, offset, abbreviation };
}

function getRegionalSettings(locale: Localization.Locale | undefined): {
  decimalSeparator: string;
  groupingSeparator: string;
} {
  try {
    const formatter = new Intl.NumberFormat(locale?.languageTag ?? 'en-US');
    const parts = formatter.formatToParts(1234.5);
    const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.';
    const group = parts.find((p) => p.type === 'group')?.value ?? ',';
    return { decimalSeparator: decimal, groupingSeparator: group };
  } catch {
    return { decimalSeparator: '.', groupingSeparator: ',' };
  }
}

/**
 * Hook to check if animations should be disabled
 * Combines user preference with system reduced motion setting
 */
export const useShouldReduceAnimations = (userPreference: boolean): boolean => {
  const systemReduceMotion = useReducedMotion();

  // If system reduce motion is enabled, always disable animations
  // Otherwise, respect user preference
  return systemReduceMotion || !userPreference;
};

/**
 * Hook to get adaptive font size based on system settings and user preference
 */
export const useAdaptiveFontSize = (
  baseSize: number,
  userLargerTextEnabled: boolean
): number => {
  const systemFontScale = useSystemFontScale();

  // Apply both system font scale and user preference
  const userMultiplier = userLargerTextEnabled ? 1.2 : 1.0;

  // Cap the maximum scale to prevent UI breaking (max 1.5x total)
  const totalScale = Math.min(systemFontScale * userMultiplier, 1.5);

  return Math.round(baseSize * totalScale);
};

export default useSystemSettings;
