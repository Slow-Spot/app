/**
 * Cultural Theme Service
 * Maps culture tags to color themes
 */

export interface CultureTheme {
  primary: string;
  ambient: string;
  accent: string;
  name: string;
}

export const CULTURE_THEMES: Record<string, CultureTheme> = {
  zen: {
    name: 'Zen',
    primary: '#2D4A2B',    // Dark forest green
    ambient: '#E8F5E9',    // Light green
    accent: '#8BC34A',     // Light green accent
  },
  mindfulness: {
    name: 'Mindfulness',
    primary: '#3F51B5',    // Indigo
    ambient: '#E8EAF6',    // Light indigo
    accent: '#7986CB',     // Light indigo accent
  },
  zen_buddhist: {
    name: 'Zen Buddhist',
    primary: '#8D6E63',    // Brown
    ambient: '#EFEBE9',    // Light brown
    accent: '#BCAAA4',     // Tan
  },
  vipassana: {
    name: 'Vipassana',
    primary: '#4FA8FF',    // Soft blue
    ambient: '#EBF5FF',    // Light blue
    accent: '#3B8FDB',     // Blue accent
  },
  transcendental: {
    name: 'Transcendental',
    primary: '#9C27B0',    // Purple
    ambient: '#F3E5F5',    // Light purple
    accent: '#BA68C8',     // Purple accent
  },
  universal: {
    name: 'Universal',
    primary: '#607D8B',    // Blue grey
    ambient: '#ECEFF1',    // Light grey
    accent: '#90A4AE',     // Grey accent
  },
};

/**
 * Get theme for a given culture tag
 * Falls back to universal theme if not found
 */
export const getThemeForCulture = (cultureTag: string | null | undefined): CultureTheme => {
  if (!cultureTag || !CULTURE_THEMES[cultureTag]) {
    return CULTURE_THEMES.universal;
  }
  return CULTURE_THEMES[cultureTag];
};

/**
 * Get list of available culture themes
 */
export const getAvailableThemes = (): CultureTheme[] => {
  return Object.values(CULTURE_THEMES);
};

/**
 * Get theme name for display
 */
export const getThemeName = (cultureTag: string | null | undefined): string => {
  return getThemeForCulture(cultureTag).name;
};
