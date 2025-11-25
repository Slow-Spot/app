// ══════════════════════════════════════════════════════════════
// Custom Sessions Types
// User-created meditation sessions with full customization
// ══════════════════════════════════════════════════════════════

import { MeditationSession } from '../services/api';

// ══════════════════════════════════════════════════════════════
// Custom Session Interface
// ══════════════════════════════════════════════════════════════

export interface CustomMeditationSession extends Omit<MeditationSession, 'id'> {
  id: string; // UUID for custom sessions
  baseSessionId?: number; // Original session ID if cloned
  isCustom: true;

  // Metadata
  createdAt: string;
  lastModified: string;
  createdBy: string; // userId

  // Usage stats
  timesCompleted: number;
  lastCompletedAt?: Date;
  averageRating?: number;

  // Sharing
  isShared: boolean;
  sharedWith?: string[]; // userIds
  isPublic?: boolean;
}

// ══════════════════════════════════════════════════════════════
// Session Templates
// Pre-configured templates for quick session creation
// ══════════════════════════════════════════════════════════════

export interface SessionTemplate {
  id: string;
  nameKey: string; // i18n key
  descriptionKey: string; // i18n key
  icon: string;
  category: 'quick' | 'deep' | 'targeted' | 'custom';

  // Default values
  defaults: Partial<Omit<CustomMeditationSession, 'id' | 'createdAt' | 'lastModified' | 'createdBy'>>;
}

export const SESSION_TEMPLATES: SessionTemplate[] = [
  {
    id: 'blank_canvas',
    nameKey: 'templates.blankCanvas.name',
    descriptionKey: 'templates.blankCanvas.description',
    icon: '🎨',
    category: 'custom',
    defaults: {
      durationSeconds: 600, // 10 minutes
      level: 1,
      ambientFrequency: 0.3,
      chimeFrequency: 0,
      isCustom: true,
      timesCompleted: 0,
      isShared: false,
    },
  },
  {
    id: 'quick_meditation',
    nameKey: 'templates.quickMeditation.name',
    descriptionKey: 'templates.quickMeditation.description',
    icon: '⚡',
    category: 'quick',
    defaults: {
      durationSeconds: 300, // 5 minutes
      level: 1,
      instructionId: 'level1_breath',
      ambientFrequency: 0.2,
      chimeFrequency: 0,
      isCustom: true,
      timesCompleted: 0,
      isShared: false,
    },
  },
  {
    id: 'deep_practice',
    nameKey: 'templates.deepPractice.name',
    descriptionKey: 'templates.deepPractice.description',
    icon: '🧘',
    category: 'deep',
    defaults: {
      durationSeconds: 1200, // 20 minutes
      level: 3,
      instructionId: 'level3_mindfulness',
      ambientFrequency: 0.1,
      chimeFrequency: 300, // Every 5 minutes
      isCustom: true,
      timesCompleted: 0,
      isShared: false,
    },
  },
  {
    id: 'morning_energizer',
    nameKey: 'templates.morningEnergizer.name',
    descriptionKey: 'templates.morningEnergizer.description',
    icon: '🌅',
    category: 'targeted',
    defaults: {
      durationSeconds: 600, // 10 minutes
      level: 2,
      instructionId: 'morning_energy',
      purposeTag: 'morning',
      ambientFrequency: 0.3,
      chimeFrequency: 0,
      isCustom: true,
      timesCompleted: 0,
      isShared: false,
    },
  },
  {
    id: 'stress_relief',
    nameKey: 'templates.stressRelief.name',
    descriptionKey: 'templates.stressRelief.description',
    icon: '😌',
    category: 'targeted',
    defaults: {
      durationSeconds: 900, // 15 minutes
      level: 2,
      instructionId: 'stress_relief',
      purposeTag: 'stress',
      ambientFrequency: 0.5,
      chimeFrequency: 0,
      isCustom: true,
      timesCompleted: 0,
      isShared: false,
    },
  },
  {
    id: 'sleep_preparation',
    nameKey: 'templates.sleepPreparation.name',
    descriptionKey: 'templates.sleepPreparation.description',
    icon: '🌙',
    category: 'targeted',
    defaults: {
      durationSeconds: 900, // 15 minutes
      level: 2,
      instructionId: 'sleep_preparation',
      purposeTag: 'sleep',
      ambientFrequency: 0.7,
      chimeFrequency: 0,
      isCustom: true,
      timesCompleted: 0,
      isShared: false,
    },
  },
];

// ══════════════════════════════════════════════════════════════
// Session Validation
// ══════════════════════════════════════════════════════════════

export interface SessionValidationResult {
  valid: boolean;
  errors: SessionValidationError[];
  warnings: SessionValidationWarning[];
}

export interface SessionValidationError {
  field: string;
  messageKey: string; // i18n key
  value?: any;
}

export interface SessionValidationWarning {
  field: string;
  messageKey: string; // i18n key
  suggestion?: string;
}

// ══════════════════════════════════════════════════════════════
// Export/Import Format
// ══════════════════════════════════════════════════════════════

export interface SessionExportData {
  version: '1.0';
  exportedAt: string;
  session: CustomMeditationSession;
  metadata: {
    appVersion: string;
    platform: string;
  };
}

export interface SessionImportResult {
  success: boolean;
  session?: CustomMeditationSession;
  errors?: string[];
  warnings?: string[];
}
