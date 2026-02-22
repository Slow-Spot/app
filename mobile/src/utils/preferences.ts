import { logger } from './logger';
// ══════════════════════════════════════════════════════════════
// User Preferences & Customization
// Manage all user settings and preferences
// ══════════════════════════════════════════════════════════════

import type {
  UserMeditationProgress,
  InstructionStyle,
  ExperienceLevel,
} from '../types/userProgress';

// ══════════════════════════════════════════════════════════════
// PREFERENCE TYPES
// ══════════════════════════════════════════════════════════════

export interface UserPreferences {
  // Instructions
  instructionStyle: InstructionStyle;
  alwaysSkipInstructions: boolean;
  breathingPrepDuration: number; // seconds
  reminderFrequency: 'frequent' | 'normal' | 'rare' | 'none';

  // Audio & haptics
  voiceGuidanceEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  ambientSoundVolume: number; // 0-100
  chimeVolume: number; // 0-100

  // Cultural & purpose preferences
  preferredCultures: string[];
  preferredOccasions: string[];
  preferredBreathingPattern: 'box' | '4-7-8' | 'equal' | 'calm';

  // Experience
  experienceLevel: ExperienceLevel;
  selfReportedLevel: 1 | 2 | 3 | 4 | 5;

  // UI preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  displayMetrics: 'metric' | 'imperial';

  // Notifications
  dailyReminderEnabled: boolean;
  dailyReminderTime?: string; // HH:MM format
  streakReminderEnabled: boolean;
  achievementNotificationsEnabled: boolean;

  // Privacy
  trackMoodData: boolean;
  shareAnonymousData: boolean;
}

// ══════════════════════════════════════════════════════════════
// DEFAULT PREFERENCES
// ══════════════════════════════════════════════════════════════

export const DEFAULT_PREFERENCES: UserPreferences = {
  instructionStyle: 'detailed',
  alwaysSkipInstructions: false,
  breathingPrepDuration: 60,
  reminderFrequency: 'normal',
  voiceGuidanceEnabled: false,
  hapticFeedbackEnabled: true,
  ambientSoundVolume: 50,
  chimeVolume: 70,
  preferredCultures: [],
  preferredOccasions: [],
  preferredBreathingPattern: 'box',
  experienceLevel: 'beginner',
  selfReportedLevel: 1,
  theme: 'auto',
  language: 'en',
  displayMetrics: 'metric',
  dailyReminderEnabled: false,
  streakReminderEnabled: true,
  achievementNotificationsEnabled: true,
  trackMoodData: true,
  shareAnonymousData: false,
};

// ══════════════════════════════════════════════════════════════
// PREFERENCE PRESETS
// ══════════════════════════════════════════════════════════════

export interface PreferencePreset {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  preferences: Partial<UserPreferences>;
}

export const PREFERENCE_PRESETS: PreferencePreset[] = [
  {
    id: 'beginner',
    nameKey: 'presets.beginner.name',
    descriptionKey: 'presets.beginner.description',
    icon: '🌱',
    preferences: {
      instructionStyle: 'detailed',
      alwaysSkipInstructions: false,
      breathingPrepDuration: 90,
      reminderFrequency: 'frequent',
      voiceGuidanceEnabled: true,
      hapticFeedbackEnabled: true,
    },
  },
  {
    id: 'experienced',
    nameKey: 'presets.experienced.name',
    descriptionKey: 'presets.experienced.description',
    icon: '🧘',
    preferences: {
      instructionStyle: 'moderate',
      alwaysSkipInstructions: false,
      breathingPrepDuration: 60,
      reminderFrequency: 'normal',
      voiceGuidanceEnabled: false,
      hapticFeedbackEnabled: true,
    },
  },
  {
    id: 'expert',
    nameKey: 'presets.expert.name',
    descriptionKey: 'presets.expert.description',
    icon: '⚡',
    preferences: {
      instructionStyle: 'minimal',
      alwaysSkipInstructions: true,
      breathingPrepDuration: 30,
      reminderFrequency: 'rare',
      voiceGuidanceEnabled: false,
      hapticFeedbackEnabled: false,
    },
  },
  {
    id: 'mindful',
    nameKey: 'presets.mindful.name',
    descriptionKey: 'presets.mindful.description',
    icon: '🌸',
    preferences: {
      instructionStyle: 'detailed',
      alwaysSkipInstructions: false,
      breathingPrepDuration: 120,
      reminderFrequency: 'frequent',
      ambientSoundVolume: 30,
      chimeVolume: 50,
    },
  },
  {
    id: 'quick',
    nameKey: 'presets.quick.name',
    descriptionKey: 'presets.quick.description',
    icon: '⏱️',
    preferences: {
      instructionStyle: 'minimal',
      alwaysSkipInstructions: true,
      breathingPrepDuration: 0,
      reminderFrequency: 'none',
      voiceGuidanceEnabled: false,
    },
  },
];

// ══════════════════════════════════════════════════════════════
// PREFERENCE HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Merge user preferences with defaults
 */
export const mergeWithDefaults = (
  userPrefs: Partial<UserPreferences>
): UserPreferences => {
  return {
    ...DEFAULT_PREFERENCES,
    ...userPrefs,
  };
};

/**
 * Apply a preset to user preferences
 */
export const applyPreset = (
  presetId: string,
  currentPrefs: UserPreferences
): UserPreferences => {
  const preset = PREFERENCE_PRESETS.find(p => p.id === presetId);
  if (!preset) return currentPrefs;

  return {
    ...currentPrefs,
    ...preset.preferences,
  };
};

/**
 * Auto-detect recommended preferences based on user progress
 */
export const getRecommendedPreferences = (
  progress: UserMeditationProgress
): Partial<UserPreferences> => {
  const recommendations: Partial<UserPreferences> = {};

  // Instruction style based on experience
  if (progress.totalSessions < 10) {
    recommendations.instructionStyle = 'detailed';
    recommendations.breathingPrepDuration = 90;
  } else if (progress.totalSessions < 50) {
    recommendations.instructionStyle = 'moderate';
    recommendations.breathingPrepDuration = 60;
  } else {
    recommendations.instructionStyle = 'minimal';
    recommendations.breathingPrepDuration = 30;
  }

  // Reminder frequency based on consistency
  const avgCompletionRate =
    progress.completedSessions.length > 0
      ? progress.completedSessions.reduce(
          (sum, c) => sum + c.completionPercentage,
          0
        ) / progress.completedSessions.length
      : 0;

  if (avgCompletionRate < 70) {
    recommendations.reminderFrequency = 'frequent';
  } else if (avgCompletionRate < 90) {
    recommendations.reminderFrequency = 'normal';
  } else {
    recommendations.reminderFrequency = 'rare';
  }

  // Preferred cultures based on history
  const cultureCounts = new Map<string, number>();
  progress.completedSessions.forEach(c => {
    if (c.cultureTag) {
      cultureCounts.set(c.cultureTag, (cultureCounts.get(c.cultureTag) || 0) + 1);
    }
  });

  const topCultures = Array.from(cultureCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([culture]) => culture);

  if (topCultures.length > 0) {
    recommendations.preferredCultures = topCultures;
  }

  // Preferred occasions based on history
  const occasionCounts = new Map<string, number>();
  progress.completedSessions.forEach(c => {
    if (c.purposeTag) {
      occasionCounts.set(c.purposeTag, (occasionCounts.get(c.purposeTag) || 0) + 1);
    }
  });

  const topOccasions = Array.from(occasionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([occasion]) => occasion);

  if (topOccasions.length > 0) {
    recommendations.preferredOccasions = topOccasions;
  }

  return recommendations;
};

/**
 * Validate preferences
 */
export const validatePreferences = (
  prefs: Partial<UserPreferences>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (prefs.breathingPrepDuration !== undefined) {
    if (prefs.breathingPrepDuration < 0 || prefs.breathingPrepDuration > 300) {
      errors.push('Breathing prep duration must be between 0-300 seconds');
    }
  }

  if (prefs.ambientSoundVolume !== undefined) {
    if (prefs.ambientSoundVolume < 0 || prefs.ambientSoundVolume > 100) {
      errors.push('Ambient sound volume must be between 0-100');
    }
  }

  if (prefs.chimeVolume !== undefined) {
    if (prefs.chimeVolume < 0 || prefs.chimeVolume > 100) {
      errors.push('Chime volume must be between 0-100');
    }
  }

  if (prefs.dailyReminderTime) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(prefs.dailyReminderTime)) {
      errors.push('Daily reminder time must be in HH:MM format');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ══════════════════════════════════════════════════════════════
// BREATHING PATTERNS
// ══════════════════════════════════════════════════════════════

export interface BreathingPattern {
  id: 'box' | '4-7-8' | 'equal' | 'calm';
  nameKey: string;
  descriptionKey: string;
  inhale: number; // seconds
  hold1?: number; // seconds (after inhale)
  exhale: number; // seconds
  hold2?: number; // seconds (after exhale)
  rounds: number;
  benefitsKey: string;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    nameKey: 'breathing.box.name',
    descriptionKey: 'breathing.box.description',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    rounds: 4,
    benefitsKey: 'breathing.box.benefits',
  },
  {
    id: '4-7-8',
    nameKey: 'breathing.478.name',
    descriptionKey: 'breathing.478.description',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    rounds: 4,
    benefitsKey: 'breathing.478.benefits',
  },
  {
    id: 'equal',
    nameKey: 'breathing.equal.name',
    descriptionKey: 'breathing.equal.description',
    inhale: 5,
    exhale: 5,
    rounds: 6,
    benefitsKey: 'breathing.equal.benefits',
  },
  {
    id: 'calm',
    nameKey: 'breathing.calm.name',
    descriptionKey: 'breathing.calm.description',
    inhale: 3,
    exhale: 6,
    rounds: 5,
    benefitsKey: 'breathing.calm.benefits',
  },
];

/**
 * Get breathing pattern by ID
 */
export const getBreathingPattern = (
  patternId: 'box' | '4-7-8' | 'equal' | 'calm'
): BreathingPattern | null => {
  return BREATHING_PATTERNS.find(p => p.id === patternId) || null;
};

/**
 * Calculate total duration of breathing prep
 */
export const calculateBreathingDuration = (pattern: BreathingPattern): number => {
  const cycleDuration =
    pattern.inhale +
    (pattern.hold1 || 0) +
    pattern.exhale +
    (pattern.hold2 || 0);

  return cycleDuration * pattern.rounds;
};

// ══════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Serialize preferences for storage
 */
export const serializePreferences = (prefs: UserPreferences): string => {
  return JSON.stringify(prefs);
};

/**
 * Deserialize preferences from storage
 */
export const deserializePreferences = (data: string): UserPreferences => {
  try {
    const parsed = JSON.parse(data);
    return mergeWithDefaults(parsed);
  } catch (error) {
    logger.error('Failed to parse preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

// ══════════════════════════════════════════════════════════════
// MIGRATION HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Migrate old preferences to new format
 */
export const migratePreferences = (
  oldPrefs: Partial<Record<string, unknown>>,
  _version: string
): UserPreferences => {
  // Wyciagamy tylko klucze istniejace w DEFAULT_PREFERENCES
  const validKeys = Object.keys(DEFAULT_PREFERENCES) as (keyof UserPreferences)[];
  const filtered: Partial<UserPreferences> = {};

  if (oldPrefs) {
    for (const key of validKeys) {
      if (oldPrefs[key] !== undefined) {
        (filtered as Record<string, unknown>)[key] = oldPrefs[key];
      }
    }
  }

  return mergeWithDefaults(filtered);
};
