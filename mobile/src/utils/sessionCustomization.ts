// ══════════════════════════════════════════════════════════════
// Session Customization Utilities
// Create, clone, validate, export/import custom sessions
// ══════════════════════════════════════════════════════════════

import { v4 as uuidv4 } from 'uuid';
import { MeditationSession } from '../services/api';
import {
  CustomMeditationSession,
  SessionTemplate,
  SessionValidationResult,
  SessionValidationError,
  SessionValidationWarning,
  SessionExportData,
  SessionImportResult,
  SESSION_TEMPLATES,
} from '../types/customSessions';

// ══════════════════════════════════════════════════════════════
// SESSION CREATION
// ══════════════════════════════════════════════════════════════

/**
 * Clone an existing session for customization
 */
export const cloneSession = (
  session: MeditationSession,
  userId: string
): CustomMeditationSession => {
  const now = new Date().toISOString();

  return {
    ...session,
    id: uuidv4(),
    baseSessionId: typeof session.id === 'number' ? session.id : undefined,
    isCustom: true,
    createdAt: now,
    lastModified: now,
    createdBy: userId,
    timesCompleted: 0,
    isShared: false,

    // Customize title to indicate it's a clone
    title: `${session.title} (Custom)`,
  };
};

/**
 * Create a new session from a template
 */
export const createCustomSession = (
  template: SessionTemplate,
  userId: string,
  overrides?: Partial<CustomMeditationSession>
): CustomMeditationSession => {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    title: '',
    description: '',
    imageUrl: '',
    durationSeconds: 600,
    level: 1,
    ambientFrequency: 0.3,
    chimeFrequency: 0,
    ...template.defaults,
    ...overrides,
    isCustom: true,
    createdAt: now,
    lastModified: now,
    createdBy: userId,
    timesCompleted: 0,
    isShared: false,
  } as CustomMeditationSession;
};

/**
 * Create a completely blank session
 */
export const createBlankSession = (userId: string): CustomMeditationSession => {
  const blankTemplate = SESSION_TEMPLATES.find(t => t.id === 'blank_canvas');
  return createCustomSession(blankTemplate!, userId);
};

/**
 * Update an existing custom session
 */
export const updateCustomSession = (
  session: CustomMeditationSession,
  updates: Partial<Omit<CustomMeditationSession, 'id' | 'createdAt' | 'createdBy'>>
): CustomMeditationSession => {
  return {
    ...session,
    ...updates,
    lastModified: new Date().toISOString(),
  };
};

/**
 * Duplicate a custom session
 */
export const duplicateCustomSession = (
  session: CustomMeditationSession,
  userId: string
): CustomMeditationSession => {
  const now = new Date().toISOString();

  return {
    ...session,
    id: uuidv4(),
    title: `${session.title} (Copy)`,
    createdAt: now,
    lastModified: now,
    createdBy: userId,
    timesCompleted: 0,
    lastCompletedAt: undefined,
    averageRating: undefined,
  };
};

// ══════════════════════════════════════════════════════════════
// VALIDATION
// ══════════════════════════════════════════════════════════════

/**
 * Validate a custom session
 */
export const validateCustomSession = (
  session: Partial<CustomMeditationSession>
): SessionValidationResult => {
  const errors: SessionValidationError[] = [];
  const warnings: SessionValidationWarning[] = [];

  // Required fields
  if (!session.title || session.title.trim().length === 0) {
    errors.push({
      field: 'title',
      messageKey: 'validation.titleRequired',
    });
  } else if (session.title.length > 100) {
    errors.push({
      field: 'title',
      messageKey: 'validation.titleTooLong',
      value: session.title.length,
    });
  }

  if (!session.description || session.description.trim().length === 0) {
    warnings.push({
      field: 'description',
      messageKey: 'validation.descriptionRecommended',
      suggestion: 'Add a description to help remember the purpose of this session',
    });
  }

  // Duration validation
  if (!session.durationSeconds || session.durationSeconds < 60) {
    errors.push({
      field: 'durationSeconds',
      messageKey: 'validation.durationTooShort',
      value: session.durationSeconds,
    });
  } else if (session.durationSeconds > 3600) {
    errors.push({
      field: 'durationSeconds',
      messageKey: 'validation.durationTooLong',
      value: session.durationSeconds,
    });
  }

  // Warn for very short sessions
  if (session.durationSeconds && session.durationSeconds < 180) {
    warnings.push({
      field: 'durationSeconds',
      messageKey: 'validation.durationVeryShort',
      suggestion: 'Consider at least 3 minutes for an effective session',
    });
  }

  // Level validation
  if (!session.level || session.level < 1 || session.level > 5) {
    errors.push({
      field: 'level',
      messageKey: 'validation.levelInvalid',
      value: session.level,
    });
  }

  // Frequency validation
  if (session.ambientFrequency !== undefined) {
    if (session.ambientFrequency < 0 || session.ambientFrequency > 1) {
      errors.push({
        field: 'ambientFrequency',
        messageKey: 'validation.frequencyOutOfRange',
        value: session.ambientFrequency,
      });
    }
  }

  if (session.chimeFrequency !== undefined && session.chimeFrequency < 0) {
    errors.push({
      field: 'chimeFrequency',
      messageKey: 'validation.chimeFrequencyInvalid',
      value: session.chimeFrequency,
    });
  }

  // Chime frequency warning
  if (
    session.chimeFrequency &&
    session.durationSeconds &&
    session.chimeFrequency > 0 &&
    session.chimeFrequency < 60
  ) {
    warnings.push({
      field: 'chimeFrequency',
      messageKey: 'validation.chimeFrequencyVeryFrequent',
      suggestion: 'Frequent chimes may be distracting',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Quick validation check (returns boolean only)
 */
export const isSessionValid = (session: Partial<CustomMeditationSession>): boolean => {
  const result = validateCustomSession(session);
  return result.valid;
};

// ══════════════════════════════════════════════════════════════
// EXPORT/IMPORT
// ══════════════════════════════════════════════════════════════

/**
 * Export session to JSON string for sharing
 */
export const exportSession = (
  session: CustomMeditationSession,
  appVersion: string = '1.0.0',
  platform: string = 'mobile'
): string => {
  const exportData: SessionExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    session: {
      ...session,
      // Remove user-specific data
      createdBy: 'imported',
      timesCompleted: 0,
      lastCompletedAt: undefined,
      averageRating: undefined,
      isShared: false,
      sharedWith: undefined,
    },
    metadata: {
      appVersion,
      platform,
    },
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import session from JSON string
 */
export const importSession = (
  jsonString: string,
  userId: string
): SessionImportResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const data = JSON.parse(jsonString) as SessionExportData;

    // Version check
    if (data.version !== '1.0') {
      warnings.push(`Unknown export version: ${data.version}. Attempting import anyway.`);
    }

    // Validate imported session
    const validationResult = validateCustomSession(data.session);
    if (!validationResult.valid) {
      errors.push(...validationResult.errors.map(e => e.messageKey));
    }
    warnings.push(...validationResult.warnings.map(w => w.messageKey));

    // Create new session with imported data
    const now = new Date().toISOString();
    const importedSession: CustomMeditationSession = {
      ...data.session,
      id: uuidv4(), // Generate new ID
      createdAt: now,
      lastModified: now,
      createdBy: userId,
      timesCompleted: 0,
      isShared: false,
      title: `${data.session.title} (Imported)`,
    };

    return {
      success: errors.length === 0,
      session: importedSession,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: ['Invalid JSON format or corrupted file'],
    };
  }
};

// ══════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Convert custom session to storable format (dates to ISO strings)
 */
export const serializeCustomSession = (
  session: CustomMeditationSession
): Record<string, any> => {
  return {
    ...session,
    createdAt: session.createdAt,
    lastModified: session.lastModified,
    lastCompletedAt: session.lastCompletedAt,
  };
};

/**
 * Convert stored format back to CustomMeditationSession (ISO strings to dates)
 */
export const deserializeCustomSession = (
  data: Record<string, any>
): CustomMeditationSession => {
  return {
    ...data,
    createdAt: data.createdAt,
    lastModified: data.lastModified,
    lastCompletedAt: data.lastCompletedAt,
  } as CustomMeditationSession;
};

// ══════════════════════════════════════════════════════════════
// TEMPLATE HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Get all available templates
 */
export const getAllTemplates = (): SessionTemplate[] => {
  return SESSION_TEMPLATES;
};

/**
 * Get template by ID
 */
export const getTemplateById = (templateId: string): SessionTemplate | null => {
  return SESSION_TEMPLATES.find(t => t.id === templateId) || null;
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (
  category: SessionTemplate['category']
): SessionTemplate[] => {
  return SESSION_TEMPLATES.filter(t => t.category === category);
};

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Check if a session is custom
 */
export const isCustomSession = (
  session: MeditationSession | CustomMeditationSession
): session is CustomMeditationSession => {
  return 'isCustom' in session && session.isCustom === true;
};

/**
 * Convert duration seconds to human-readable format
 */
export const formatDuration = (durationSeconds: number): string => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Generate suggested title based on session properties
 */
export const generateSuggestedTitle = (
  session: Partial<CustomMeditationSession>
): string => {
  const parts: string[] = [];

  // Duration
  const minutes = Math.round((session.durationSeconds || 0) / 60);
  parts.push(`${minutes}-Minute`);

  // Purpose or culture
  if (session.purposeTag) {
    parts.push(
      session.purposeTag.charAt(0).toUpperCase() + session.purposeTag.slice(1)
    );
  } else if (session.cultureTag) {
    parts.push(session.cultureTag.charAt(0).toUpperCase() + session.cultureTag.slice(1));
  }

  parts.push('Meditation');

  return parts.join(' ');
};
